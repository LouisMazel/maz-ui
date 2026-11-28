import type { ParseError } from 'jsonc-parser'
import type { ChangeSet } from './changeSet.ts'
import type { AgentsTool, AgentTarget, McpServerCommand } from './types.ts'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { applyEdits, modify, parse } from 'jsonc-parser'
import { detectFormatting } from './mcpConfig.ts'
import { isGeneratedMcpCommand, pinnedMcpVersion } from './mcpServer.ts'
import { MAZ_UI_AGENTS_TOOL } from './tool.ts'
import { compareVersions, escapeRegExp, isJsonObject } from './utils.ts'

const CLAUDE_SETTINGS = '.claude/settings.json'
/**
 * After each edit, for an immediate feedback; at the end of a task (of the agent or of a subagent), for the files
 * written another way (a heredoc or a script in Bash): the command finds them in `git status`
 */
const HOOK_EVENTS: Array<{ event: string, matcher?: string }> = [
  { event: 'PostToolUse', matcher: 'Edit|Write|MultiEdit' },
  { event: 'Stop' },
  { event: 'SubagentStop' },
]
/** The first run of `npx -y` downloads the package */
const TIMEOUT = 90

interface HookCommand {
  type?: unknown
  command?: unknown
}

interface HookGroup {
  matcher?: unknown
  hooks?: unknown
}

/** Command of the review hook: the command of the MCP server, with the arguments of the hook */
export function reviewHookCommand(server: McpServerCommand, tool: AgentsTool): string | undefined {
  if (!tool.reviewHookArgs)
    return undefined

  const mcpArgs = tool.mcpArgs ?? []
  const runner = mcpArgs.length > 0 && server.args.slice(-mcpArgs.length).join(' ') === mcpArgs.join(' ')
    ? server.args.slice(0, -mcpArgs.length)
    : server.args

  return [server.command, ...runner, ...tool.reviewHookArgs].join(' ')
}

/** Command of the MCP server a hook command runs, `undefined` when it is not a review hook `setupAgents` writes for the tool */
function hookServer(command: unknown, tool: AgentsTool): McpServerCommand | undefined {
  const suffix = ` ${tool.reviewHookArgs?.join(' ')}`

  if (typeof command !== 'string' || !tool.reviewHookArgs || !command.endsWith(suffix))
    return undefined

  const [runner, ...args] = command.slice(0, -suffix.length).split(' ')
  const server = { command: runner, args: [...args, ...(tool.mcpArgs ?? [])] }

  return isGeneratedMcpCommand(server, tool)
    ? server
    : undefined
}

function isToolHook(command: unknown, tool: AgentsTool): boolean {
  return hookServer(command, tool) !== undefined
}

/** Folder of the user settings of Claude Code */
export function claudeConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude')
}

function readJson(file: string): unknown {
  return existsSync(file)
    ? parse(readFileSync(file, 'utf8'), [], { allowTrailingComma: true })
    : undefined
}

/** The value of the plugin in the `enabledPlugins` of a settings file, `undefined` when the file does not set it */
function pluginSetting(file: string, plugin: RegExp): boolean | undefined {
  const settings = readJson(file)
  const plugins = isJsonObject(settings)
    ? settings.enabledPlugins
    : undefined

  if (!isJsonObject(plugins))
    return undefined

  const values = Object.entries(plugins).filter(([name, enabled]) => plugin.test(name) && typeof enabled === 'boolean')

  return values.length > 0
    ? values.some(([, enabled]) => enabled === true)
    : undefined
}

/** `false` when the list of the installed plugins of Claude Code does not have it (a plugin enabled by a project is not installed for each teammate) */
function isPluginInstalled(plugin: RegExp): boolean {
  const installed = readJson(join(claudeConfigDir(), 'plugins/installed_plugins.json'))
  const plugins = isJsonObject(installed)
    ? installed.plugins
    : undefined

  // An unknown format: the settings decide
  return !isJsonObject(plugins) || Object.keys(plugins).some(name => plugin.test(name))
}

/**
 * `true` when the Claude Code plugin of the tool (`maz-ui@<marketplace>`) is installed and enabled for this user in the
 * project: the local settings of the project win over its shared settings, which win over the user settings
 */
export function isClaudePluginEnabled(rootDir: string, tool: AgentsTool = MAZ_UI_AGENTS_TOOL): boolean {
  const plugin = new RegExp(`^${escapeRegExp(tool.name)}@`)
  const files = [
    join(rootDir, '.claude/settings.local.json'),
    join(rootDir, CLAUDE_SETTINGS),
    join(claudeConfigDir(), 'settings.json'),
  ]
  const enabled = files.map(file => pluginSetting(file, plugin)).find(value => value !== undefined)

  return enabled === true && isPluginInstalled(plugin)
}

function finalNewline(content: string): string {
  return content.endsWith('\n')
    ? content
    : `${content}\n`
}

/** Settings without the hooks of the tool: the groups and the events left empty are removed, the other settings are kept as written */
function withoutToolHooks(content: string, tool: AgentsTool): string {
  const formattingOptions = { ...detectFormatting(content) }
  const isOwned = (hook: HookCommand): boolean => isToolHook(hook.command, tool)
  const hooksOf = (group: HookGroup): HookCommand[] => Array.isArray(group.hooks)
    ? group.hooks as HookCommand[]
    : []
  let edited = content

  for (const { event } of HOOK_EVENTS) {
    const groups = (readHookGroups(edited) as Record<string, HookGroup[]>)[event]

    if (!groups.some(group => hooksOf(group).some(isOwned)))
      continue

    // The array is written again: jsonc-parser breaks a minified array when it removes its last element
    const kept = groups
      .map(group => hooksOf(group).some(isOwned)
        ? { ...group, hooks: hooksOf(group).filter(hook => !isOwned(hook)) }
        : group)
      .filter(group => !Array.isArray(group.hooks) || group.hooks.length > 0)

    edited = applyEdits(edited, modify(edited, ['hooks', event], kept.length > 0
      ? kept
      : undefined, { formattingOptions }))
  }

  const hooks = (parse(edited) as Record<string, unknown>).hooks

  return isJsonObject(hooks) && Object.keys(hooks).length === 0
    ? applyEdits(edited, modify(edited, ['hooks'], undefined, { formattingOptions }))
    : edited
}

/** The hook groups of each event of the review, `undefined` when the settings or their hooks are invalid */
function readHookGroups(current: string | undefined): Record<string, HookGroup[]> | undefined {
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined
    ? {}
    : parse(current, errors, { allowTrailingComma: true })
  const hooks = isJsonObject(parsed)
    ? parsed.hooks ?? {}
    : undefined

  if (errors.length > 0 || !isJsonObject(hooks))
    return undefined

  const groups = HOOK_EVENTS.map(({ event }) => [event, hooks[event] ?? []] as const)

  return groups.every(([, list]) => Array.isArray(list))
    ? Object.fromEntries(groups) as Record<string, HookGroup[]>
    : undefined
}

function removeToolHooks(changes: ChangeSet, current: string, tool: AgentsTool, reason?: string): void {
  const content = withoutToolHooks(current, tool)

  if (Object.keys(parse(content) as Record<string, unknown>).length === 0)
    changes.delete(CLAUDE_SETTINGS)
  else
    changes.write(CLAUDE_SETTINGS, finalNewline(content), current, reason)
}

/** Like the MCP server, a pinned version is only replaced by the installed package or a newer pin (monorepos) */
function keptPin(existing: HookCommand[], server: McpServerCommand, tool: AgentsTool): string | undefined {
  const current = hookServer(existing[0]?.command, tool)
  const pinned = current && pinnedMcpVersion(current, tool)
  const wanted = pinnedMcpVersion(server, tool)

  return pinned && server.args.includes('-y') && (!wanted || compareVersions(pinned, wanted) >= 0)
    ? pinned
    : undefined
}

export interface SyncClaudeHooksOptions {
  rootDir: string
  targets: AgentTarget[]
  server: McpServerCommand
  hooks: boolean
  remove: boolean
}

/** The hooks of the tool, by event */
function toolHooks(groups: Record<string, HookGroup[]>, tool: AgentsTool): Record<string, HookCommand[]> {
  return Object.fromEntries(HOOK_EVENTS.map(({ event }) => [
    event,
    groups[event].flatMap(group => Array.isArray(group.hooks)
      ? group.hooks as HookCommand[]
      : []).filter(hook => isToolHook(hook.command, tool)),
  ]))
}

/** Settings with one review hook per event, after the other hooks */
function withReviewHooks(content: string, command: string): string {
  const formattingOptions = detectFormatting(content)

  return HOOK_EVENTS.reduce((edited, { event, matcher }) => {
    const remaining = (readHookGroups(edited) as Record<string, HookGroup[]>)[event]
    const group = {
      ...(matcher
        ? { matcher }
        : {}),
      hooks: [{ type: 'command', command, timeout: TIMEOUT }],
    }

    return applyEdits(edited, remaining.length > 0
      ? modify(edited, ['hooks', event, remaining.length], group, { formattingOptions, isArrayInsertion: true })
      : modify(edited, ['hooks', event], [group], { formattingOptions }))
  }, content)
}

/**
 * Registers (or removes) the review hooks of the tool in `.claude/settings.json`: Claude Code runs them after each
 * edit and at the end of each task, and sends their findings back to the agent, which fixes them right away. The other
 * settings and hooks are kept.
 */
export function syncClaudeHooks(changes: ChangeSet, { rootDir, targets, server, hooks, remove }: SyncClaudeHooksOptions, tool: AgentsTool): void {
  const command = reviewHookCommand(server, tool)

  if (!command || !targets.includes('claude') || (!hooks && !remove))
    return

  const current = changes.read(CLAUDE_SETTINGS)
  const groups = readHookGroups(current)

  if (!groups) {
    changes.skip(CLAUDE_SETTINGS, 'invalid JSON or hooks: left untouched')
    return
  }

  const byEvent = toolHooks(groups, tool)
  const existing = Object.values(byEvent).flat()
  const pluginReason = `the ${tool.name} Claude Code plugin already reviews the edited files`

  if (remove || isClaudePluginEnabled(rootDir, tool)) {
    if (existing.length > 0)
      removeToolHooks(changes, current as string, tool, remove ? undefined : `${pluginReason}: hooks removed`)
    else if (!remove)
      changes.skip(CLAUDE_SETTINGS, `${pluginReason}: no hook added`)
    return
  }

  if (Object.values(byEvent).every(list => list.length === 1 && list[0].command === command)) {
    changes.unchanged(CLAUDE_SETTINGS, `${tool.name} review hooks already registered`)
    return
  }

  const pinned = keptPin(existing, server, tool)

  if (pinned && Object.values(byEvent).every(list => list.length === 1 && list[0].command === existing[0].command)) {
    changes.unchanged(CLAUDE_SETTINGS, `the review hooks run ${tool.mcpPackage} ${pinned}`)
    return
  }

  const kept = pinned
    ? existing[0].command as string
    : command
  const content = withReviewHooks(withoutToolHooks(current ?? '{}\n', tool), kept)

  changes.write(CLAUDE_SETTINGS, finalNewline(content), current, existing.length > 0
    ? `review hooks now run ${kept}`
    : `review of the edited files by ${tool.name}`)
}

/** `true` when the shared settings of the project have a review hook of the tool */
export function hasToolReviewHooks(rootDir: string, tool: AgentsTool): boolean {
  const file = join(rootDir, CLAUDE_SETTINGS)
  const groups = existsSync(file)
    ? readHookGroups(readFileSync(file, 'utf8'))
    : undefined

  return !!groups && Object.values(toolHooks(groups, tool)).some(hooks => hooks.length > 0)
}
