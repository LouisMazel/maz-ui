import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { stringifyFrontmatter } from '../markdown/frontmatter'

export interface AgentContent {
  rules: string
  workflow: string
}

export const SKILL_DESCRIPTION = 'Build Vue and Nuxt UIs with the maz-ui ecosystem (components, composables, directives, @maz-ui/icons, @maz-ui/utils, @maz-ui/themes, Tailwind theme tokens) instead of re-implementing them. Use whenever you write or review Vue/Nuxt components, pages, forms, layouts, styles or helpers in a project that depends on maz-ui.'

export function loadAgentContent(contentDir: string): AgentContent {
  return {
    rules: readFileSync(join(contentDir, 'rules.md'), 'utf8').trim(),
    workflow: readFileSync(join(contentDir, 'skill.md'), 'utf8').trim(),
  }
}

function versionLine(version: string): string {
  return `> maz-ui ${version} is installed: these rules and the docs in \`node_modules/maz-ui/docs\` match this version.`
}

/** `rules.md` at the root of the bundle */
export function renderRulesDoc(content: AgentContent, version: string): string {
  return `${stringifyFrontmatter({
    title: 'maz-ui rules for AI agents',
    description: 'How to use maz-ui and its ecosystem in this project: look-up workflow, components, icons, helpers, Tailwind theme tokens, imports.',
  })}

# maz-ui rules for AI agents

${versionLine(version)}

${content.rules}
`
}

/** Content of `.claude/rules/maz-ui.md`, always loaded by Claude Code */
export function renderClaudeRule(content: AgentContent, version: string): string {
  return `# maz-ui

${versionLine(version)}

${content.rules}
`
}

/** Section inserted between markers in the project `AGENTS.md` */
export function renderAgentsMdSection(content: AgentContent, version: string): string {
  return `## maz-ui

${versionLine(version)}

${content.rules}
`
}

/** `SKILL.md` of the Claude Code plugin: version agnostic */
export function renderSkill(content: AgentContent): string {
  return `${stringifyFrontmatter({
    name: 'maz-ui',
    description: SKILL_DESCRIPTION,
  })}

# maz-ui

${content.rules}

${content.workflow}
`
}
