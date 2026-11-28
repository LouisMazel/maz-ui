import type { ChangeSet } from './changeSet.ts'
import type { AgentsTool, AgentTarget, McpServerCommand } from './types.ts'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { keptMcpCommandReason } from './mcpConfig.ts'
import { MAZ_UI_AGENTS_TOOL } from './tool.ts'
import { escapeRegExp } from './utils.ts'

/** Project config of Codex, read in the trusted projects */
export const CODEX_CONFIG = '.codex/config.toml'

interface TomlTable {
  key: string
  /** The table and its sub-tables (`[mcp_servers.<key>.env]`) */
  start: number
  end: number
  body: string
}

const HEADER = /^[ \t]*\[([^\]\n]+)\][ \t]*(?:#.*)?$/gm

/** The key of a `[mcp_servers.<key>]` header, without its quotes */
function serverKey(header: string): string | undefined {
  return /^mcp_servers\.(?:"([^"]+)"|'([^']+)'|([\w-]+))$/.exec(header)?.slice(1).find(Boolean)
}

/** The `[mcp_servers.<key>]` tables of a TOML config, with their sub-tables */
function serverTables(content: string): TomlTable[] {
  const headers = [...content.matchAll(HEADER)].map(match => ({ name: match[1].trim(), index: match.index }))

  return headers.flatMap((header, position) => {
    const key = serverKey(header.name)

    if (!key)
      return []

    const next = headers.slice(position + 1).find(other => !other.name.startsWith(`${header.name}.`))
    const end = next?.index ?? content.length

    return [{ key, start: header.index, end, body: content.slice(header.index, end) }]
  })
}

/** A TOML basic string or array of basic strings: their syntax is the one of JSON */
function parseValue(body: string, field: string): unknown {
  const value = new RegExp(`^[ \\t]*${field}[ \\t]*=[ \\t]*("(?:[^"\\\\\\n]|\\\\.)*"|\\[[^\\]]*\\])`, 'm').exec(body)?.[1]

  try {
    return value === undefined
      ? undefined
      : JSON.parse(value.replace(/,(\s*)\]$/, '$1]'))
  }
  catch {
    return undefined
  }
}

function tableCommand(table: TomlTable): Partial<McpServerCommand> {
  const command = parseValue(table.body, 'command')
  const args = parseValue(table.body, 'args')

  return {
    command: typeof command === 'string'
      ? command
      : undefined,
    args: Array.isArray(args) && args.every(arg => typeof arg === 'string')
      ? args
      : undefined,
  }
}

function serverFields(server: McpServerCommand): string {
  return `command = ${JSON.stringify(server.command)}\nargs = ${JSON.stringify(server.args).replaceAll('","', '", "')}\n`
}

function referencesTool(table: TomlTable, tool: AgentsTool): boolean {
  const args = tableCommand(table).args ?? []

  return (table.body.includes(tool.mcpPackage) || table.body.includes(tool.mcpBin))
    && (tool.mcpArgs ?? []).every(arg => args.includes(arg))
}

/** Folder of the user config of Codex */
export function codexHome(): string {
  return process.env.CODEX_HOME ?? join(homedir(), '.codex')
}

/** `true` when the user config of Codex enables the Codex plugin of the tool (`[plugins."maz-ui@<marketplace>"]`) */
export function isCodexPluginEnabled(tool: AgentsTool = MAZ_UI_AGENTS_TOOL): boolean {
  const file = join(codexHome(), 'config.toml')
  const content = existsSync(file)
    ? readFileSync(file, 'utf8')
    : ''
  const headers = [...content.matchAll(HEADER)]
  const plugin = new RegExp(`^plugins\\.(?:"${escapeRegExp(tool.name)}@[^"]+"|'${escapeRegExp(tool.name)}@[^']+')$`)

  return headers.some((header, position) => plugin.test(header[1].trim())
    && /^[ \t]*enabled[ \t]*=[ \t]*true\b/m.test(content.slice(header.index, headers[position + 1]?.index ?? content.length)))
}

function withoutTable(content: string, table: TomlTable): string {
  const rest = [content.slice(0, table.start), content.slice(table.end)].join('')

  return `${rest.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`
}

/** Replaces the `command` and `args` of a table, its other fields (`env`, `startup_timeout_sec`...) are kept */
function withCommand(table: TomlTable, server: McpServerCommand): string {
  const fields = /^[ \t]*(?:command|args)[ \t]*=[ \t]*(?:"(?:[^"\\\n]|\\.)*"|\[[^\]]*\])[ \t]*\n?/gm
  const [header, ...rest] = table.body.split('\n')

  return `${header}\n${serverFields(server)}${rest.join('\n').replace(fields, '')}`
}

export interface SyncCodexConfigOptions {
  targets: AgentTarget[]
  server: McpServerCommand
  mcp: boolean
  remove: boolean
}

/**
 * Registers (or removes) the MCP server of the tool in the `.codex/config.toml` of the project (`[mcp_servers.<name>]`).
 * Skipped when the Codex plugin of the tool is enabled for this user: it runs its own MCP server.
 */
export function syncCodexConfig(changes: ChangeSet, { targets, server, mcp, remove }: SyncCodexConfigOptions, tool: AgentsTool): void {
  if (!targets.includes('codex') || (!mcp && !remove))
    return

  const current = changes.read(CODEX_CONFIG)
  const content = current ?? ''
  const tables = serverTables(content)
  const existing = tables.find(table => referencesTool(table, tool))

  if (remove) {
    if (existing?.key !== tool.name)
      return

    const edited = withoutTable(content, existing)

    if (edited.trim() === '')
      changes.delete(CODEX_CONFIG)
    else
      changes.write(CODEX_CONFIG, edited, current)
    return
  }

  if (existing) {
    const kept = keptMcpCommandReason(tableCommand(existing), existing.key, server, tool)

    if (kept)
      changes.unchanged(CODEX_CONFIG, kept)
    else
      changes.write(CODEX_CONFIG, `${content.slice(0, existing.start)}${withCommand(existing, server)}${content.slice(existing.end)}`, current, `"${existing.key}" now runs ${[server.command, ...server.args].join(' ')}`)
    return
  }

  if (tables.some(table => table.key === tool.name)) {
    changes.skip(CODEX_CONFIG, `a "${tool.name}" server already exists with another command: left untouched`)
    return
  }

  if (isCodexPluginEnabled(tool)) {
    changes.skip(CODEX_CONFIG, `the ${tool.name} Codex plugin runs its own MCP server: not added`)
    return
  }

  const key = /^[\w-]+$/.test(tool.name)
    ? tool.name
    : JSON.stringify(tool.name)
  const base = content === '' || content.endsWith('\n\n')
    ? content
    : `${content.replace(/\n?$/, '\n')}\n`

  changes.write(CODEX_CONFIG, `${base}[mcp_servers.${key}]\n${serverFields(server)}`, current)
}
