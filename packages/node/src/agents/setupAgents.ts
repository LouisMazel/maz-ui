import type { AgentsTool, AgentTarget, McpServerCommand, SetupAgentsOptions, SetupAgentsResult } from './types.ts'
import { findProjectPackage, readPackageVersion } from '../project.ts'
import { resolveAgentDocs } from './agentDocs.ts'
import { ChangeSet } from './changeSet.ts'
import { syncClaudeHooks } from './claudeHooks.ts'
import { syncPluginMcpServer } from './claudeLocalSettings.ts'
import { syncCodexConfig } from './codexConfig.ts'
import { detectAgentTargets } from './detectAgentTargets.ts'
import { syncMcpConfigs, syncOpenCodePlugin } from './mcpConfig.ts'
import { mcpServerCommand, pinnedMcpVersion } from './mcpServer.ts'
import { resolveRulePaths } from './rulePaths.ts'
import { syncRules } from './rules.ts'
import { MAZ_UI_AGENTS_TOOL, resolveTool } from './tool.ts'

/**
 * Command of the MCP server: the given one, else the command for the project, pinned to the given version, else to
 * the version of the MCP package installed for the app. With the version of the MCP package it runs (`latest` when unknown)
 */
function resolveMcpServer(options: SetupAgentsOptions, tool: AgentsTool): { server: McpServerCommand, version: string } {
  const packageDir = findProjectPackage(options.appDir ?? options.rootDir, tool.mcpPackage)
  const installedVersion = packageDir
    ? readPackageVersion(packageDir)
    : undefined
  const server = options.mcpServer ?? mcpServerCommand(options.rootDir, options.mcpVersion ?? installedVersion, tool)

  return {
    server,
    version: pinnedMcpVersion(server, tool) ?? installedVersion ?? options.mcpVersion ?? 'latest',
  }
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
  const { server, version: mcpVersion } = resolveMcpServer(options, tool)
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

  // Before the MCP server: an OpenCode config left empty by the removal of the server is deleted
  syncOpenCodePlugin(changes, { rootDir, targets, version: mcpVersion, hooks: options.hooks === true, remove }, tool)

  if (mcp || remove)
    syncMcpConfigs(changes, rootDir, targets, server, remove, tool)

  syncCodexConfig(changes, { targets, server, mcp, remove }, tool)

  syncClaudeHooks(changes, { rootDir, targets, server, hooks: options.hooks === true, remove }, tool)
  syncPluginMcpServer(changes, { rootDir, targets, mcp, remove }, tool)

  return {
    targets: targets as T[],
    version,
    changes: changes.changes,
    mcpServer: server,
    localMcpServer: !server.args.includes('-y'),
    claudeRulePaths,
  }
}
