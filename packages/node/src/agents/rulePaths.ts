import type { AgentsTool, SetupAgentsOptions } from './types'
import { posix } from 'node:path'
import { findWorkspacesUsing } from '../project'

function isUnscopedGlob(glob: string): boolean {
  return ['**', '**/*', '*', '/**', '/**/*'].includes(glob.trim())
}

/**
 * Globs the Claude Code rule is scoped to, `undefined` when it must always be loaded. The root of the project
 * depending on the tool (single package project), or no dependency found (the tool is used from elsewhere), apply
 * the files of the tool to the whole project, since no folder is more relevant than another.
 */
export function resolveRulePaths(rootDir: string, tool: AgentsTool, option: SetupAgentsOptions['paths'] = 'auto'): string[] | undefined {
  if (option === 'all')
    return undefined

  const explicit = Array.isArray(option)
    ? option.map(glob => glob.trim()).filter(Boolean)
    : []
  const globs = Array.isArray(option)
    ? explicit
    : autoRulePaths(rootDir, tool)

  return globs.length === 0 || globs.some(isUnscopedGlob)
    ? undefined
    : [
        ...new Set(globs),
      ]
}

/** Claude Code expands the braces of `paths` within a budget of 1000 patterns: beyond it the braces match nothing */
const MAX_EXPANDED_PATTERNS = 1000

/** Number of patterns a glob expands to: the alternatives of each `{a,b}` group multiply */
function expandedPatternCount(glob: string): number {
  const groups = glob.replaceAll(/\\./g, '').matchAll(/\{([^{}]*)\}/g)

  return [...groups].reduce((count, [, alternatives]) => count * alternatives.split(',').length, 1)
}

/** Escapes the characters of a folder name that a glob would interpret */
function escapeGlobFolder(folder: string): string {
  return folder.replaceAll(/[[\]{}()*?!]/g, String.raw`\$&`)
}

function autoRulePaths(rootDir: string, tool: AgentsTool): string[] {
  if (!tool.packages || tool.packages.length === 0)
    return []

  const files = tool.ruleGlobs ?? ['**/*']
  const folders = findWorkspacesUsing(rootDir, tool.packages)
  const globsOf = (scopedFolders: string[]): string[] => scopedFolders.flatMap(folder => files.map(glob => posix.join(escapeGlobFolder(folder), glob)))
  const scoped = globsOf(folders.includes('') || folders.length === 0
    ? ['']
    : folders)

  return scoped.reduce((total, glob) => total + expandedPatternCount(glob), 0) > MAX_EXPANDED_PATTERNS
    ? globsOf([''])
    : scoped
}

/** `paths:` frontmatter of a Claude Code rule. It must be the first thing of the file, before the managed header */
export function claudeFrontmatter(globs: string[] | undefined): string {
  if (!globs || globs.length === 0)
    return ''

  const items = globs.map(glob => [
    '  -',
    JSON.stringify(glob),
  ].join(' ')).join('\n')

  return `---\npaths:\n${items}\n---\n\n`
}
