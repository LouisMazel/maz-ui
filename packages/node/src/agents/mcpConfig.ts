import type { FormattingOptions, ParseError } from 'jsonc-parser'
import type { ChangeSet } from './changeSet'
import type { AgentsTool, AgentTarget, McpServerCommand } from './types'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { applyEdits, modify, parse } from 'jsonc-parser'
import { isGeneratedMcpCommand, pinnedMcpVersion } from './mcpServer'
import { compareVersions, isJsonObject } from './utils'

interface McpConfigFile {
  file: string
  rootKey: string
  /** Entry of the server in the config */
  toEntry: (server: McpServerCommand) => Record<string, unknown>
  /** Command of an entry of the config */
  fromEntry: (entry: unknown) => Partial<McpServerCommand>
}

/** `{ command, args }` entries, with `type: 'stdio'` when the agent expects it */
function commandConfig(file: string, rootKey: string, withType: boolean): McpConfigFile {
  return {
    file,
    rootKey,
    toEntry: server => withType
      ? { type: 'stdio', ...server }
      : { ...server },
    fromEntry: entry => isJsonObject(entry)
      ? {
          command: entry.command as string,
          args: Array.isArray(entry.args)
            ? entry.args as string[]
            : undefined,
        }
      : {},
  }
}

const OPENCODE_FILES = [
  'opencode.jsonc',
  'opencode.json',
  '.opencode/opencode.jsonc',
  '.opencode/opencode.json',
]

/** OpenCode: `mcp` entries of type `local`, whose `command` holds the command and its arguments */
function openCodeConfig(rootDir: string): McpConfigFile {
  return {
    file: OPENCODE_FILES.find(file => existsSync(join(rootDir, file))) ?? 'opencode.json',
    rootKey: 'mcp',
    toEntry: server => ({
      type: 'local',
      command: [server.command, ...server.args],
    }),
    fromEntry: entry => isJsonObject(entry) && Array.isArray(entry.command)
      ? {
          command: entry.command[0] as string,
          args: entry.command.slice(1) as string[],
        }
      : {},
  }
}

const GEMINI_SETTINGS = '.gemini/settings.json'

/** The project MCP config of each agent that has one, in the order they are written */
function mcpConfigFiles(rootDir: string): Partial<Record<AgentTarget, McpConfigFile>> {
  return {
    claude: commandConfig('.mcp.json', 'mcpServers', true),
    cursor: commandConfig('.cursor/mcp.json', 'mcpServers', false),
    vscode: commandConfig('.vscode/mcp.json', 'servers', true),
    gemini: commandConfig(GEMINI_SETTINGS, 'mcpServers', false),
    opencode: openCodeConfig(rootDir),
    junie: commandConfig('.junie/mcp/mcp.json', 'mcpServers', false),
    windsurf: commandConfig('.devin/mcp_config.json', 'mcpServers', false),
    warp: commandConfig('.warp/.mcp.json', 'mcpServers', false),
    kiro: commandConfig('.kiro/settings/mcp.json', 'mcpServers', false),
    roo: commandConfig('.roo/mcp.json', 'mcpServers', false),
  }
}

/** An entry that starts the MCP server of the tool, whatever its key and runner */
function referencesToolMcp(server: unknown, tool: AgentsTool, config: McpConfigFile): boolean {
  const serialized = JSON.stringify(server)
  const args = config.fromEntry(server).args ?? []

  return (serialized.includes(tool.mcpPackage) || serialized.includes(tool.mcpBin))
    && (tool.mcpArgs ?? []).every(arg => args.includes(arg))
}

/** The former package (or bin) of the tool an entry references, from `tool.legacyMcpPackages` */
function findLegacyPackage(server: unknown, tool: AgentsTool): string | undefined {
  const serialized = JSON.stringify(server)

  return tool.legacyMcpPackages?.find(name => serialized.includes(name))
}

function detectFormatting(content: string): FormattingOptions {
  const indent = /^( +|\t)"/m.exec(content)?.[1] ?? '  '

  return {
    insertSpaces: !indent.includes('\t'),
    tabSize: indent.includes('\t')
      ? 1
      : indent.length,
    eol: content.includes('\r\n')
      ? '\r\n'
      : '\n',
  }
}

/** Replaces the command of an existing entry of the MCP server of the tool, its other fields (`env`...) are kept */
function updateMcpCommand(changes: ChangeSet, config: McpConfigFile, [key, entry]: [string, unknown], server: McpServerCommand, tool: AgentsTool): void {
  const current = config.fromEntry(entry)
  const label = [server.command, ...server.args].join(' ')

  if (current.command === server.command && JSON.stringify(current.args) === JSON.stringify(server.args)) {
    changes.unchanged(config.file, `${tool.name} MCP server already registered as "${key}"`)
    return
  }

  if (!isGeneratedMcpCommand(current, tool)) {
    changes.unchanged(config.file, `"${key}" runs a custom command: left untouched`)
    return
  }

  const pinned = pinnedMcpVersion(current, tool)
  const wanted = pinnedMcpVersion(server, tool)
  const isLocal = !server.args.includes('-y')

  // A pin is only replaced by the installed package or a newer pin: never by `latest`, nor by an older version (monorepos)
  if (pinned && !isLocal && (!wanted || compareVersions(pinned, wanted) >= 0)) {
    changes.unchanged(config.file, `"${key}" runs ${tool.mcpPackage} ${pinned}`)
    return
  }

  const file = changes.read(config.file) as string
  const formatting = detectFormatting(file)
  // Only the fields that start the server: the others (`env`, `type`...) are kept
  const content = Object.entries(config.toEntry(server))
    .filter(([field]) => field !== 'type')
    .reduce((edited, [field, value]) => applyEdits(edited, modify(edited, [config.rootKey, key, field], value, { formattingOptions: formatting })), file)

  changes.write(config.file, content, file, `"${key}" now runs ${label}`)
}

function syncMcpConfig(changes: ChangeSet, config: McpConfigFile, server: McpServerCommand, remove: boolean, tool: AgentsTool): void {
  const current = changes.read(config.file)
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined
    ? {}
    : parse(current, errors, { allowTrailingComma: true })

  if (errors.length > 0 || !isJsonObject(parsed) || (parsed[config.rootKey] !== undefined && !isJsonObject(parsed[config.rootKey]))) {
    changes.skip(config.file, 'invalid JSON: left untouched')
    return
  }

  const servers = (parsed[config.rootKey] ?? {}) as Record<string, unknown>
  const existing = Object.entries(servers).find(([, value]) => referencesToolMcp(value, tool, config))
  const base = current ?? '{}\n'
  const formatting = detectFormatting(base)

  if (remove) {
    if (existing?.[0] === tool.name) {
      const content = applyEdits(base, modify(base, [config.rootKey, tool.name], undefined, { formattingOptions: formatting }))
      const remaining = parse(content) as Record<string, Record<string, unknown>>
      const isEmpty = Object.keys(remaining).length === 1 && Object.keys(remaining[config.rootKey]).length === 0

      if (isEmpty)
        changes.delete(config.file)
      else
        changes.write(config.file, content, current)
    }
    return
  }

  if (existing) {
    updateMcpCommand(changes, config, existing, server, tool)
    return
  }

  const legacy = Object.entries(servers).map(([key, entry]) => [
    key,
    findLegacyPackage(entry, tool),
  ] as const).find(([, name]) => name !== undefined)

  if (legacy) {
    const [key, name] = legacy
    const migrated = applyEdits(base, modify(base, [config.rootKey, key], config.toEntry(server), { formattingOptions: formatting }))

    changes.write(config.file, migrated.endsWith('\n')
      ? migrated
      : `${migrated}\n`, current, `"${key}" migrated from ${name} to ${tool.mcpPackage}`)
    return
  }

  if (servers[tool.name] !== undefined) {
    changes.skip(config.file, `a "${tool.name}" server already exists with another command: left untouched`)
    return
  }

  const content = applyEdits(base, modify(base, [config.rootKey, tool.name], config.toEntry(server), { formattingOptions: formatting }))

  changes.write(config.file, content.endsWith('\n')
    ? content
    : `${content}\n`, current)
}

/** Registers (or removes) the MCP server in the project MCP config of each target that has one */
export function syncMcpConfigs(changes: ChangeSet, rootDir: string, targets: AgentTarget[], server: McpServerCommand, remove: boolean, tool: AgentsTool): void {
  for (const [target, config] of Object.entries(mcpConfigFiles(rootDir)) as [AgentTarget, McpConfigFile][]) {
    // Warp also reads the .mcp.json of Claude Code: a second entry would start the server twice
    const readsClaudeConfig = target === 'warp' && targets.includes('claude') && !remove

    if (targets.includes(target) && !readsClaudeConfig)
      syncMcpConfig(changes, config, server, remove, tool)
  }
}

/**
 * Adds `AGENTS.md` to the `context.fileName` of the Gemini CLI settings, which only lists `GEMINI.md` by default.
 * Kept in remove mode: the `AGENTS.md` of the project can hold the rules of other tools.
 */
export function syncGeminiContext(changes: ChangeSet): void {
  const current = changes.read(GEMINI_SETTINGS)
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined
    ? {}
    : parse(current, errors, { allowTrailingComma: true })
  const context = isJsonObject(parsed)
    ? parsed.context
    : undefined
  const fileName = isJsonObject(context)
    ? context.fileName
    : undefined
  const names: unknown[] = fileName === undefined
    ? ['GEMINI.md']
    : [fileName].flat()

  if (errors.length > 0 || !isJsonObject(parsed) || (context !== undefined && !isJsonObject(context)) || names.some(name => typeof name !== 'string')) {
    changes.skip(GEMINI_SETTINGS, 'invalid JSON or context.fileName: left untouched')
    return
  }

  if (names.includes('AGENTS.md'))
    return

  const base = current ?? '{}\n'
  const content = applyEdits(base, modify(base, ['context', 'fileName'], [...names, 'AGENTS.md'], {
    formattingOptions: detectFormatting(base),
  }))

  changes.write(GEMINI_SETTINGS, content.endsWith('\n')
    ? content
    : `${content}\n`, current, 'Gemini CLI reads AGENTS.md')
}
