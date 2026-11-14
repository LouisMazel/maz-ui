import type { McpServerCommand } from './types'
import {
  findInstalledPackage as findInstalledPackageInternal,
  findWorkspacesUsing as findWorkspacesUsingInternal,
  readWorkspacePatterns as readWorkspacePatternsInternal,
} from '../project'
import { readAgentDocs as readAgentDocsInternal, resolveAgentDocsDir as resolveAgentDocsDirInternal } from './agentDocs'
import {
  isEditedManagedContent as isEditedManagedContentInternal,
  readManagedVersion as readManagedVersionInternal,
} from './managedContent'
import { installsMcpPackage as installsMcpPackageInternal } from './mcpServer'
import { resolveRulePaths as resolveRulePathsInternal } from './rulePaths'
import { compareVersions as compareVersionsInternal, writeFileAtomic as writeFileAtomicInternal } from './utils'

/** @deprecated Internal to `setupAgents`, removed in the next major version. Use `MAZ_UI_AGENTS_TOOL` */
export const MANAGED_MARKER = 'Managed by maz-ui'
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const AGENTS_MD_BEGIN = '<!-- BEGIN:maz-ui -->'
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const AGENTS_MD_END = '<!-- END:maz-ui -->'
/** @deprecated Internal to `setupAgents`, removed in the next major version. Use `MAZ_UI_AGENTS_TOOL.name` */
export const MCP_SERVER_NAME = 'maz-ui'
/** @deprecated Removed in the next major version. Use `mcpServerCommand` */
export const DEFAULT_MCP_SERVER: McpServerCommand = {
  command: 'npx',
  args: ['-y', '@maz-ui/mcp@latest'],
}

/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const installsMcpPackage: typeof installsMcpPackageInternal = installsMcpPackageInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const isEditedManagedContent: typeof isEditedManagedContentInternal = isEditedManagedContentInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const readManagedVersion: typeof readManagedVersionInternal = readManagedVersionInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version. Use the `docsDir` option of `setupAgents` */
export const readAgentDocs: typeof readAgentDocsInternal = readAgentDocsInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const resolveRulePaths: typeof resolveRulePathsInternal = resolveRulePathsInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const writeFileAtomic: typeof writeFileAtomicInternal = writeFileAtomicInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const compareVersions: typeof compareVersionsInternal = compareVersionsInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version. Use `findProjectPackage` */
export const findInstalledPackage: typeof findInstalledPackageInternal = findInstalledPackageInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version. Use `findWorkspaceDirs` */
export const readWorkspacePatterns: typeof readWorkspacePatternsInternal = readWorkspacePatternsInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version */
export const findWorkspacesUsing: typeof findWorkspacesUsingInternal = findWorkspacesUsingInternal
/** @deprecated Internal to `setupAgents`, removed in the next major version. Use the `appDir` option of `setupAgents` */
export const resolveAgentDocsDir: typeof resolveAgentDocsDirInternal = resolveAgentDocsDirInternal
