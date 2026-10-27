import type { ServerContext } from '../context'

import { z } from 'zod'
import { findSection, sectionContent, stripFrontmatter } from './markdown'
import { defineTool, ToolInputError } from './types'

export const THEME_TOPICS = {
  'setup': 'Setup',
  'colors': 'Colors',
  'radius': 'Border radius',
  'shadows': 'Shadows',
  'spacing': 'Spacing',
  'breakpoints': 'Breakpoints',
  'typography': 'Typography and motion',
  'z-index': 'z-index',
  'utilities': 'Custom utilities',
  'variants': 'Variants',
  'layout': 'Layout variables',
  'transitions': 'Vue transitions',
  'css-variables': 'CSS variables in custom CSS',
} as const

export type ThemeTopic = keyof typeof THEME_TOPICS

export interface GetThemeTokensArgs {
  topics?: ThemeTopic[]
}

export function getThemeTokens(context: ServerContext, { topics }: GetThemeTokensArgs): string {
  const reference = context.knowledge.docsById.get('reference/tailwind-tokens')

  if (!reference)
    throw new ToolInputError('This maz-ui version does not ship the Tailwind reference. Read `get_doc({ id: "guide/tailwind" })`.')

  const markdown = stripFrontmatter(context.knowledge.readDoc(reference.id))
  const footer = '\n\nTo extend the theme (your own colors, fonts, animations, variants, container width): `get_doc({ id: "guide/tailwind" })`. Brand colors and radius belong to a preset: `get_doc({ id: "ecosystem/themes", sections: ["Creating Custom Themes"] })`.'

  if (!topics?.length)
    return `${markdown.trim()}${footer}`

  const parts = topics.map((topic) => {
    const section = findSection(markdown, THEME_TOPICS[topic])

    return section ? sectionContent(markdown, section) : ''
  })

  return `# maz-ui ${context.knowledge.version} Tailwind theme\n\n${parts.filter(Boolean).join('\n\n')}${footer}`
}

export const getThemeTokensTool = defineTool({
  name: 'get_theme_tokens',
  title: 'maz-ui Tailwind theme tokens',
  description: 'Every Tailwind CSS class and CSS variable of the maz-ui theme (installed version): theme colors (bg-primary, text-muted, border-divider, bg-surface... with -foreground and 50-950 scales), radius, shadows (shadow-elevation), spacing, breakpoints (mob-*, tab-*, lap-*), fonts, durations, z-index, custom utilities (flex-center, padded-container), dark variant and CSS variables. Use it before styling: never the default Tailwind palette, hard-coded colors or the internal `maz:` prefix.',
  inputSchema: {
    topics: z.array(z.enum(Object.keys(THEME_TOPICS) as [ThemeTopic, ...ThemeTopic[]])).optional().describe('Only these topics (default: everything)'),
  },
  run: getThemeTokens,
})
