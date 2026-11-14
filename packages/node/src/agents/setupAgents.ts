import type { AgentsTool, AgentTarget, McpServerCommand, SetupAgentsOptions, SetupAgentsResult } from './types'
import { findProjectPackage, readPackageVersion } from '../project'
import { resolveAgentDocs } from './agentDocs'
import { ChangeSet } from './changeSet'
import { detectAgentTargets } from './detectAgentTargets'
import { syncMcpConfigs } from './mcpConfig'
import { mcpServerCommand } from './mcpServer'
import { resolveRulePaths } from './rulePaths'
import { syncRules } from './rules'
import { MAZ_UI_AGENTS_TOOL, resolveTool } from './tool'

/**
 * Command of the MCP server: the given one, else the command for the project, pinned to the given version, else to
 * the version of the MCP package installed for the app
 */
function resolveMcpServer(options: SetupAgentsOptions, tool: AgentsTool): McpServerCommand {
  if (options.mcpServer)
    return options.mcpServer

  const packageDir = findProjectPackage(options.appDir ?? options.rootDir, tool.mcpPackage)
  const installedVersion = packageDir
    ? readPackageVersion(packageDir)
    : undefined

  return mcpServerCommand(options.rootDir, options.mcpVersion ?? installedVersion, tool)
}

/**
 * Configures the AI coding agents of a project to use a tool, maz-ui by
 * default: rules (version matched with the installed tool) and its MCP server.
 * Idempotent and conservative: it only writes files it owns, a delimited
 * section of `AGENTS.md` and its own entry of the MCP config files.
 */
export function setupAgents<T extends AgentTarget = AgentTarget>(options: SetupAgentsOptions<T>): SetupAgentsResult<T> {
  const { rootDir, rules = true, mcp = true, dryRun = false, remove = false, tool = MAZ_UI_AGENTS_TOOL } = options
  const setup = resolveTool(tool)
  const targets: AgentTarget[] = options.targets ?? detectAgentTargets(rootDir)
  const server = resolveMcpServer(options, tool)
  const docs = remove || !rules || targets.length === 0
    ? undefined
    : resolveAgentDocs(options, tool)
  const version = docs?.version ?? ''
  const changes = new ChangeSet(rootDir, dryRun)

  const claudeRulePaths = docs && targets.includes('claude')
    ? resolveRulePaths(rootDir, tool, options.paths)
    : undefined

  if (rules || remove)
    syncRules(changes, rootDir, targets, docs, setup, claudeRulePaths)

  if (mcp || remove)
    syncMcpConfigs(changes, rootDir, targets, server, remove, tool)

  return {
    targets: targets as T[],
    version,
    changes: changes.changes,
    mcpServer: server,
    localMcpServer: !server.args.includes('-y'),
    claudeRulePaths,
  }
}
