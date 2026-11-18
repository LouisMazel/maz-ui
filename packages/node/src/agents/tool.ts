import type { AgentsTool } from './types'
import { escapeRegExp } from './utils'

export const MAZ_UI_AGENTS_TOOL: AgentsTool = {
  name: 'maz-ui',
  mcpPackage: '@maz-ui/mcp',
  mcpBin: 'maz-ui-mcp',
  generatedBy: '`npx @maz-ui/mcp init` (or the `mazUi.agents` Nuxt option)',
  versionNote: () => '> These rules and the docs in `node_modules/maz-ui/agent-docs` match the installed maz-ui.',
  packages: [
    'maz-ui',
    '@maz-ui/nuxt',
    '@maz-ui/themes',
    '@maz-ui/icons',
    '@maz-ui/utils',
    '@maz-ui/translations',
  ],
  ruleGlobs: ['**/*.{vue,ts,tsx,css,scss}'],
}

/** Values derived from a tool: markers, files and patterns of its generated content */
export interface ToolSetup {
  tool: AgentsTool
  marker: string
  agentsMdBegin: string
  agentsMdEnd: string
  ruleFile: string
  managedHeader: RegExp
  managedVersion: RegExp
}

const toolSetups = new WeakMap<AgentsTool, ToolSetup>()

export function resolveTool(tool: AgentsTool): ToolSetup {
  let setup = toolSetups.get(tool)

  if (!setup) {
    const marker = tool.marker ?? `Managed by ${tool.name}`

    setup = {
      tool,
      marker,
      agentsMdBegin: `<!-- BEGIN:${tool.name} -->`,
      agentsMdEnd: `<!-- END:${tool.name} -->`,
      ruleFile: `.claude/rules/${tool.name}.md`,
      managedHeader: new RegExp(`<!-- ${escapeRegExp(marker)}[^\\n]*?-->`),
      managedVersion: new RegExp(`${escapeRegExp(marker)} (\\d[^\\s:]*)`),
    }
    toolSetups.set(tool, setup)
  }

  return setup
}
