import type { AgentsTool } from './types.ts'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { parse } from 'jsonc-parser'
import { claudeConfigDir, hasToolReviewHooks, isClaudePluginEnabled } from './claudeHooks.ts'
import { readManagedVersion } from './managedContent.ts'
import { MAZ_UI_AGENTS_TOOL } from './tool.ts'
import { compareVersions, escapeRegExp, isJsonObject } from './utils.ts'

/** Where Claude Code finds an MCP server: one server per name, the local one first, then the project, then the user */
export type ClaudeMcpScope = 'local' | 'project' | 'user' | 'plugin'

export interface ClaudeMcpServer {
  scope: ClaudeMcpScope
  /** Name of the server (`plugin:<plugin>:<server>` for a plugin) */
  name: string
  /** Command line of the server, `undefined` for a plugin */
  command?: string
  /** File that declares it */
  file: string
  /** `false` when another server of the same name wins, or when it is disabled */
  active: boolean
  /** A server of `.mcp.json` rejected by `disabledMcpjsonServers` */
  disabled?: true
}

export interface AgentsProblem {
  message: string
  /** Command or change that fixes it */
  fix: string
}

export interface AgentsDiagnosis {
  /** The MCP servers of the tool Claude Code finds for the project */
  servers: ClaudeMcpServer[]
  /** The Claude Code plugin of the tool is installed and enabled for the user in the project */
  plugin: boolean
  problems: AgentsProblem[]
}

export interface DiagnoseAgentsOptions {
  rootDir: string
  /** Version of the tool installed in the project: the servers pinned to an older version are reported */
  version?: string
  tool?: AgentsTool
}

const SCOPE_ORDER: ClaudeMcpScope[] = ['local', 'project', 'user']
/** A prerelease version (`5.0.0-beta.3`) or dist-tag (`beta`) */
function isPrerelease(version: string): boolean {
  return /^(?:alpha|beta|rc|canary|next)$/.test(version) || /-(?:alpha|beta|rc|canary|next)\b/.test(version)
}

function readJson(file: string): unknown {
  return existsSync(file)
    ? parse(readFileSync(file, 'utf8'), [], { allowTrailingComma: true })
    : undefined
}

/** `~/.claude.json` (in `CLAUDE_CONFIG_DIR` when set): the user and local MCP servers */
function claudeJsonFile(): string {
  return process.env.CLAUDE_CONFIG_DIR
    ? join(process.env.CLAUDE_CONFIG_DIR, '.claude.json')
    : join(homedir(), '.claude.json')
}

function commandOf(entry: unknown): string | undefined {
  if (!isJsonObject(entry))
    return undefined

  const args = Array.isArray(entry.args)
    ? entry.args
    : []

  return typeof entry.command === 'string'
    ? [entry.command, ...args].join(' ')
    : (entry.url as string | undefined)
}

function toolServers(servers: unknown, scope: ClaudeMcpScope, file: string, tool: AgentsTool): ClaudeMcpServer[] {
  if (!isJsonObject(servers))
    return []

  return Object.entries(servers)
    .filter(([name, entry]) => name === tool.name || [tool.mcpPackage, tool.mcpBin].some(reference => JSON.stringify(entry).includes(reference)))
    .map(([name, entry]) => ({ scope, name, command: commandOf(entry), file, active: true }))
}

/** The project servers rejected by `disabledMcpjsonServers`, in any settings file */
function disabledProjectServers(rootDir: string): Set<string> {
  const files = [
    join(rootDir, '.claude/settings.local.json'),
    join(rootDir, '.claude/settings.json'),
    join(claudeConfigDir(), 'settings.json'),
  ]

  return new Set(files.flatMap((file) => {
    const settings = readJson(file)
    const disabled = isJsonObject(settings)
      ? settings.disabledMcpjsonServers
      : undefined

    return Array.isArray(disabled)
      ? disabled.filter((name): name is string => typeof name === 'string')
      : []
  }))
}

function readServers(rootDir: string, tool: AgentsTool): ClaudeMcpServer[] {
  const claudeJson = readJson(claudeJsonFile())
  const projects = isJsonObject(claudeJson) && isJsonObject(claudeJson.projects)
    ? claudeJson.projects
    : {}
  const realRoot = realpathSync(rootDir)
  const project = projects[realRoot] ?? projects[rootDir]
  const disabled = disabledProjectServers(rootDir)
  const servers = [
    ...toolServers(isJsonObject(project) ? project.mcpServers : undefined, 'local', claudeJsonFile(), tool),
    ...toolServers((readJson(join(rootDir, '.mcp.json')) as Record<string, unknown> | undefined)?.mcpServers, 'project', '.mcp.json', tool),
    ...toolServers(isJsonObject(claudeJson) ? claudeJson.mcpServers : undefined, 'user', claudeJsonFile(), tool),
  ]

  for (const server of servers) {
    if (server.scope === 'project' && disabled.has(server.name))
      server.disabled = true
  }

  // A disabled server does not start: the next server of the same name does
  const candidates = servers.filter(server => !server.disabled)

  for (const server of servers) {
    const winner = SCOPE_ORDER.map(scope => candidates.find(other => other.scope === scope && other.name === server.name)).find(Boolean)

    server.active = winner === server
  }

  return servers
}

function removeCommand(server: ClaudeMcpServer): string {
  return `claude mcp remove ${server.name} -s ${server.scope}`
}

/** A server shadowed by another of the same name, or running beside the server of the plugin */
function duplicateProblems(servers: ClaudeMcpServer[], plugin: boolean, tool: AgentsTool): AgentsProblem[] {
  const problems: AgentsProblem[] = []

  for (const server of servers.filter(candidate => candidate.scope !== 'project')) {
    const shadowed = servers.find(other => other !== server && other.name === server.name && !other.active && !other.disabled)

    if (server.active && shadowed) {
      problems.push({
        message: `"${server.name}" of the ${server.scope} scope (${server.command}) runs instead of the one of the ${shadowed.scope} scope (${shadowed.command}): Claude Code runs one server per name, the local one first, then the project, then the user.`,
        fix: removeCommand(server),
      })
    }
    else if (plugin && server.active) {
      problems.push({
        message: `"${server.name}" of the ${server.scope} scope runs beside the server of the ${tool.name} plugin: Claude Code sees each tool twice.`,
        fix: removeCommand(server),
      })
    }
  }

  const projectServer = servers.find(server => server.scope === 'project' && server.active)

  if (plugin && projectServer) {
    problems.push({
      message: `"${projectServer.name}" of .mcp.json runs beside the server of the ${tool.name} plugin: Claude Code sees each tool twice. Keep it for the teammates without the plugin, and disable it for you.`,
      fix: `run ${tool.generatedBy}: it adds "disabledMcpjsonServers": ["${projectServer.name}"] to .claude/settings.local.json, a file that is not committed`,
    })
  }

  return problems
}

/** Servers that run a prerelease, or an older version than the installed tool */
function versionProblems(servers: ClaudeMcpServer[], version: string | undefined, tool: AgentsTool): AgentsProblem[] {
  const pinned = new RegExp(`${escapeRegExp(tool.mcpPackage)}@(\\S+)`)

  return servers.filter(server => server.active && server.command).flatMap((server) => {
    const pin = pinned.exec(server.command as string)?.[1]
    const runsPrerelease = !!pin && isPrerelease(pin) && !(version && isPrerelease(version))
    const isOlder = !!pin && /^\d/.test(pin) && !!version && compareVersions(pin, version) < 0

    if (!runsPrerelease && !isOlder)
      return []

    const installed = version
      ? `, the project installs ${tool.name} ${version}`
      : ''

    return [{
      message: `"${server.name}" of the ${server.scope} scope runs ${tool.mcpPackage}@${pin}${installed}: its docs and review do not match.`,
      fix: server.scope === 'project'
        ? `run ${tool.generatedBy}`
        : `${removeCommand(server)}, then rely on the plugin or on the .mcp.json of the project`,
    }]
  })
}

function ruleProblems(rootDir: string, version: string | undefined, plugin: boolean, tool: AgentsTool): AgentsProblem[] {
  const problems: AgentsProblem[] = []
  const rule = join(rootDir, `.claude/rules/${tool.name}.md`)
  const written = existsSync(rule)
    ? readManagedVersion(readFileSync(rule, 'utf8'), tool)
    : undefined

  if (written && version && compareVersions(written, version) < 0) {
    problems.push({
      message: `.claude/rules/${tool.name}.md was written for ${tool.name} ${written}, the project installs ${version}.`,
      fix: `run ${tool.generatedBy}`,
    })
  }

  if (plugin && hasToolReviewHooks(rootDir, tool)) {
    problems.push({
      message: `.claude/settings.json has the review hooks of ${tool.name}, and the ${tool.name} plugin has its own: each file is reviewed twice.`,
      fix: `run ${tool.generatedBy}`,
    })
  }

  return problems
}

/**
 * Checks how Claude Code gets the MCP server and the rules of a tool (maz-ui by default) in a project: the servers of
 * each scope, the one that wins, the duplicates with the plugin, the versions that do not match the installed tool.
 */
export function diagnoseAgents({ rootDir, version, tool = MAZ_UI_AGENTS_TOOL }: DiagnoseAgentsOptions): AgentsDiagnosis {
  const plugin = isClaudePluginEnabled(rootDir, tool)
  const servers = readServers(rootDir, tool)
  const all = plugin
    ? [...servers, { scope: 'plugin' as const, name: `plugin:${tool.name}:${tool.name}`, file: 'plugin', active: true }]
    : servers
  const problems = [
    ...duplicateProblems(servers, plugin, tool),
    ...versionProblems(servers, version, tool),
    ...ruleProblems(rootDir, version, plugin, tool),
  ]

  if (all.every(server => !server.active)) {
    problems.push({
      message: `Claude Code has no ${tool.name} MCP server in this project.`,
      fix: `run ${tool.generatedBy}`,
    })
  }

  return { servers: all, plugin, problems }
}
