export { isClaudePluginEnabled } from './agents/claudeHooks.ts'
export {
  AGENTS_MD_BEGIN,
  AGENTS_MD_END,
  compareVersions,
  DEFAULT_MCP_SERVER,
  findInstalledPackage,
  findWorkspacesUsing,
  installsMcpPackage,
  isEditedManagedContent,
  MANAGED_MARKER,
  MCP_SERVER_NAME,
  readAgentDocs,
  readManagedVersion,
  readWorkspacePatterns,
  resolveAgentDocsDir,
  resolveRulePaths,
  writeFileAtomic,
} from './agents/deprecated.ts'
export { detectAgentTargets } from './agents/detectAgentTargets.ts'
export { diagnoseAgents } from './agents/doctor.ts'
export type { AgentsDiagnosis, AgentsProblem, ClaudeMcpScope, ClaudeMcpServer, DiagnoseAgentsOptions } from './agents/doctor.ts'
export { mcpServerCommand } from './agents/mcpServer.ts'
export { setupAgents } from './agents/setupAgents.ts'
export { MAZ_UI_AGENTS_TOOL } from './agents/tool.ts'
export type { AgentDocs, AgentsTool, AgentTarget, McpServerCommand, SetupAgentsAction, SetupAgentsChange, SetupAgentsOptions, SetupAgentsResult } from './agents/types.ts'
export { AGENT_TARGETS } from './agents/types.ts'
export type { PackageManager } from './project.ts'
export { detectPackageManager, findProjectPackage, findWorkspaceDirs, readPackageVersion } from './project.ts'
