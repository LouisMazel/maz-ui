import type { ColorScaleStep } from '@maz-ui/themes/utils/resolve-preset'
import type { ServerContext } from '../context'
import type { BundledPresetName } from '../project/resolved-theme'

import { COLOR_SCALE_STEPS, SCALED_COLORS } from '@maz-ui/themes/utils/resolve-preset'
import { z } from 'zod'
import { BUNDLED_PRESETS, renderEffectiveColors } from '../project/resolved-theme'
import { findSection, sectionContent, stripFrontmatter } from './markdown'
import { defineTool, ToolInputError } from './types'

export const THEME_TOPICS = {
  'setup': 'Setup',
  'colors': 'Colors',
  'radius': 'Border radius',
  'shadows': 'Shadows',
  'spacing': 'Spacing',
  'breakpoints': 'Breakpoints',
  'container-queries': 'Container queries',
  'layout': 'Layout',
  'typography': 'Typography and motion',
  'type-scale': 'Type scale',
  'rich-text': 'Rich text',
  'z-index': 'z-index',
  'utilities': 'Custom utilities',
  'variants': 'Variants',
  'transitions': 'Vue transitions',
  'css-variables': 'CSS variables in custom CSS',
} as const

export type ThemeTopic = keyof typeof THEME_TOPICS

export interface GetThemeTokensArgs {
  topics?: ThemeTopic[]
  /** Include the theme of the project (preset, Tailwind `@theme` tokens, variants, utilities) */
  project?: boolean
  /** Effective colors of a bundled preset instead of the presets of the project */
  preset?: BundledPresetName
  /** Detailed effective colors (oklch, contrasts) of these colors only */
  colors?: string[]
  /** Only these steps of the effective scales */
  steps?: ColorScaleStep[]
}

export async function getThemeTokens(context: ServerContext, { topics, project = true, preset, colors, steps }: GetThemeTokensArgs): Promise<string> {
  const { tailwind } = context.knowledge
  const reference = context.knowledge.docsById.get('reference/tailwind-tokens')

  if (!reference || !tailwind)
    throw new ToolInputError('This maz-ui version does not ship the Tailwind reference. Read `get_doc({ id: "guide/tailwind" })`.')

  const markdown = stripFrontmatter(context.knowledge.readDoc(reference.id))
  let projectTheme: string | undefined

  const wantsColors = !topics?.length || topics.includes('colors') || !!colors?.length || !!preset

  if (project || preset) {
    // Babel loads on the first read of the project theme, not when the server starts
    const { readProjectTheme, renderProjectTheme } = await import('../project/theme')
    const theme = project
      ? readProjectTheme(context.cwd)
      : { stylesheets: [], presets: [] }
    const effectiveColors = wantsColors
      ? renderEffectiveColors(theme.presets, { preset, colors, steps })
      : undefined

    projectTheme = [project && renderProjectTheme(theme, tailwind, topics), effectiveColors].filter(Boolean).join('\n\n') || undefined
  }
  const footer = '\n\nHow to extend the theme (project colors, fonts, animations, variants, utilities, container width) and how it combines with the preset: `get_doc({ id: "guide/tailwind" })`. Brand colors, fonts and radius belong to a preset: `get_doc({ id: "ecosystem/themes", sections: ["Creating Custom Themes"] })`.'

  const mazUiTheme = topics?.length
    ? `# maz-ui ${context.knowledge.version} Tailwind theme\n\n${topics.map((topic) => {
      const section = findSection(markdown, THEME_TOPICS[topic])

      return section
        ? sectionContent(markdown, section)
        : ''
    }).filter(Boolean).join('\n\n')}`
    : markdown.trim()

  return projectTheme
    ? `${projectTheme}\n\n---\n\n${mazUiTheme}${footer}`
    : `${mazUiTheme}${footer}`
}

export const getThemeTokensTool = defineTool({
  name: 'get_theme_tokens',
  title: 'maz-ui Tailwind theme tokens',
  description: 'The Tailwind theme of the project: its own tokens, preset, variants and utilities (read from its Tailwind entry and `definePreset`), then every Tailwind CSS class and CSS variable of the maz-ui theme (installed version): theme colors (bg-primary, text-muted, border-divider, bg-surface... with -foreground and 50-950 scales), the effective colors of the preset (hex of every color and 50-950 step, light and dark, contrast ratios, steps that look the same or change between modes), radius, shadows (shadow-elevation), spacing, breakpoints (mob-*, tab-*, lap-*) and container queries (@tab-m:...), layout (padded-container page gutter, layout patterns, action hierarchy), type scale (text-display, text-title-1..4, text-body, text-label, text-caption...), rich-text for raw HTML, fonts, durations, z-index, custom utilities (flex-center, disabled-state), dark variant and CSS variables. Use it before styling: never the default Tailwind palette, hard-coded colors or the internal `maz:` prefix.',
  inputSchema: {
    topics: z.array(z.enum(Object.keys(THEME_TOPICS) as [ThemeTopic, ...ThemeTopic[]])).optional().describe('Only these topics (default: everything)'),
    project: z.boolean().optional().describe('Include the theme of the project: preset, `@theme` tokens, variants, utilities (default: true)'),
    preset: z.enum(Object.keys(BUNDLED_PRESETS) as [BundledPresetName, ...BundledPresetName[]]).optional().describe('Effective colors of this bundled preset instead of the presets of the project'),
    colors: z.array(z.enum(SCALED_COLORS)).optional().describe('Detailed effective colors (oklch and contrast ratios of every step, light and dark) of these colors only, e.g. ["accent"]'),
    steps: z.array(z.enum(COLOR_SCALE_STEPS)).optional().describe('Only these steps of the effective scales, e.g. ["100", "500", "900"]'),
  },
  run: getThemeTokens,
})
