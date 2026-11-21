import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { stringifyFrontmatter } from '../markdown/frontmatter.ts'

export interface AgentContent {
  /** Complete rules: the AGENTS.md section, the skill and the rules page */
  rules: string
  /** Core of the rules, always useful: the Claude Code rule, loaded in the context of the agent, stays short */
  rulesCore: string
  /** Core of the rules with the compact catalog: the context the Claude Code plugin adds at the start of each session */
  sessionCore: string
  workflow: string
}

export const SKILL_DESCRIPTION = 'Build Vue and Nuxt UIs with the maz-ui ecosystem (components, composables, directives, @maz-ui/icons, @maz-ui/utils, @maz-ui/themes, Tailwind theme tokens) instead of re-implementing them. Use whenever you write or review Vue/Nuxt components, pages, forms, layouts, styles or helpers in a project that depends on maz-ui.'

/** File of the catalog in the VitePress output: the rules include it, so that the AI agents guide shows it too */
export const CATALOG_FILE = 'ecosystem-catalog.doc.md'

const CATALOG_INCLUDE = /\n*^<!--@include: [^\n]*ecosystem-catalog\.doc\.md-->$\n*/m

/** Reads the rules, with `catalog` in place of the include of the catalog */
export function loadAgentContent(contentDir: string, catalog = '', compactCatalog = catalog): AgentContent {
  const read = (file: string, section = catalog): string => readFileSync(join(contentDir, file), 'utf8').replace(CATALOG_INCLUDE, () => `\n\n${section}${section ? '\n\n' : ''}`).trim()

  return {
    rules: read('rules.md'),
    rulesCore: read('rules-core.md'),
    sessionCore: read('rules-core.md', compactCatalog),
    workflow: read('skill.md'),
  }
}

/** No version number: the docs are generated before the release bumps the version (see setupAgents for the installed one) */
const VERSION_NOTE = '> These rules and the docs in `node_modules/maz-ui/agent-docs` and `node_modules/@maz-ui/<package>/agent-docs` match the installed versions of the packages (their `package.json`).'

/** `rules.md` at the root of the bundle */
export function renderRulesDoc(content: AgentContent): string {
  return `${stringifyFrontmatter({
    title: 'maz-ui rules for AI agents',
    description: 'How to use maz-ui and its ecosystem in this project: look-up workflow, components, icons, helpers, Tailwind theme tokens, imports.',
  })}

# maz-ui rules for AI agents

${VERSION_NOTE}

${content.rules}
`
}

/** Content of `.claude/rules/maz-ui.md`: the core of the rules, the rest is served on demand by the MCP tools */
export function renderClaudeRule(content: AgentContent): string {
  return `# maz-ui

${content.rulesCore}
`
}

/** Hooks inject 10,000 characters at most (above, Claude only gets the path of a file and a preview), the hook adds a header */
export const SESSION_CONTEXT_LIMIT = 9500

/**
 * Context the SessionStart and SubagentStart hooks of the Claude Code plugin add, read from the installed maz-ui:
 * always loaded, unlike a skill the agent has to invoke, and version matched
 */
export function renderSessionContext(content: AgentContent): string {
  return `# maz-ui

${content.sessionCore}
`
}

/** Section inserted between markers in the project `AGENTS.md` */
export function renderAgentsMdSection(content: AgentContent): string {
  return `## maz-ui

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
