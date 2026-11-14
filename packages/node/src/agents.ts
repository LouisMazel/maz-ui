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
} from './agents/deprecated'
export { detectAgentTargets } from './agents/detectAgentTargets'
export { mcpServerCommand } from './agents/mcpServer'
export { setupAgents } from './agents/setupAgents'
export { MAZ_UI_AGENTS_TOOL } from './agents/tool'
export type { AgentDocs, AgentsTool, AgentTarget, McpServerCommand, SetupAgentsAction, SetupAgentsChange, SetupAgentsOptions, SetupAgentsResult } from './agents/types'
export { AGENT_TARGETS } from './agents/types'
export type { PackageManager } from './project'
export { detectPackageManager, findProjectPackage, findWorkspaceDirs, readPackageVersion } from './project'
