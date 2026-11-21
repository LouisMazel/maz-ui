import type { ParseError } from 'jsonc-parser'
import type { ChangeSet } from './changeSet.ts'
import type { AgentsTool, AgentTarget } from './types.ts'
import { applyEdits, modify, parse } from 'jsonc-parser'
import { isClaudePluginEnabled } from './claudeHooks.ts'
import { claudeMcpServerKey, detectFormatting } from './mcpConfig.ts'
import { isJsonObject } from './utils.ts'

const LOCAL_SETTINGS = '.claude/settings.local.json'
const GITIGNORE = '.gitignore'

export interface SyncPluginMcpServerOptions {
  rootDir: string
  targets: AgentTarget[]
  mcp: boolean
  remove: boolean
}

/** `.claude/settings.local.json` is personal: added to the `.gitignore` of the project when it does not ignore it yet */
function ignoreLocalSettings(changes: ChangeSet): void {
  const current = changes.read(GITIGNORE)

  if (current === undefined || /^\/?(?:\.claude\/?(?:\*\*?)?|\.claude\/settings\.local\.json|\*\*\/settings\.local\.json|settings\.local\.json)$/m.test(current))
    return

  const separator = current === '' || current.endsWith('\n')
    ? ''
    : '\n'

  changes.write(GITIGNORE, `${current}${separator}${LOCAL_SETTINGS}\n`, current, 'personal Claude Code settings')
}

/** The `disabledMcpjsonServers` of the local settings, `undefined` when the file or the list is invalid */
function readDisabledServers(current: string | undefined): unknown[] | undefined {
  const errors: ParseError[] = []
  const parsed: unknown = current === undefined
    ? {}
    : parse(current, errors, { allowTrailingComma: true })
  const disabled = isJsonObject(parsed) && errors.length === 0
    ? parsed.disabledMcpjsonServers ?? []
    : undefined

  return Array.isArray(disabled)
    ? disabled
    : undefined
}

function writeDisabledServers(changes: ChangeSet, current: string | undefined, list: unknown[], reason: string): void {
  const base = current ?? '{}\n'
  // The array is written again: jsonc-parser breaks a minified array when it removes its last element
  const content = applyEdits(base, modify(base, ['disabledMcpjsonServers'], list.length > 0
    ? list
    : undefined, { formattingOptions: detectFormatting(base) }))

  if (Object.keys(parse(content) as Record<string, unknown>).length === 0) {
    changes.delete(LOCAL_SETTINGS)
    return
  }

  changes.write(LOCAL_SETTINGS, content.endsWith('\n')
    ? content
    : `${content}\n`, current, reason)
}

/**
 * The Claude Code plugin of the tool runs its own MCP server: for the user who has it, the server of the `.mcp.json`
 * of the project (kept for the teammates without the plugin) would start a second time, with the same tools. It is
 * disabled in the local settings of the project (`disabledMcpjsonServers`), and enabled again when the plugin is not
 * there anymore or with `remove`.
 */
export function syncPluginMcpServer(changes: ChangeSet, { rootDir, targets, mcp, remove }: SyncPluginMcpServerOptions, tool: AgentsTool): void {
  if (!targets.includes('claude') || (!mcp && !remove))
    return

  const projectKey = claudeMcpServerKey(changes, rootDir, tool)
  const key = projectKey ?? tool.name
  const current = changes.read(LOCAL_SETTINGS)
  const disabled = readDisabledServers(current)

  if (!disabled) {
    changes.skip(LOCAL_SETTINGS, 'invalid JSON or disabledMcpjsonServers: left untouched')
    return
  }

  const shouldDisable = !remove && projectKey !== undefined && isClaudePluginEnabled(rootDir, tool)

  if (shouldDisable === disabled.includes(key))
    return

  if (!shouldDisable) {
    writeDisabledServers(changes, current, disabled.filter(name => name !== key), `"${key}" of .mcp.json enabled again`)
    return
  }

  writeDisabledServers(changes, current, [...disabled, key], `the ${tool.name} Claude Code plugin runs its own MCP server: "${key}" of .mcp.json disabled for you`)
  ignoreLocalSettings(changes)
}
