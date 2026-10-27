import type { ServerContext } from '../context'

import { z } from 'zod'
import { findSection, linksToDocIds, sectionContent, stripFrontmatter } from './markdown'
import { defineTool } from './types'

export interface GetSetupGuideArgs {
  framework: 'vue' | 'nuxt'
  tailwind?: boolean
}

function sections(context: ServerContext, id: string, titles: string[]): string[] {
  const doc = context.knowledge.docsById.get(id)

  if (!doc)
    return []

  const markdown = linksToDocIds(stripFrontmatter(context.knowledge.readDoc(id)), doc)

  return titles
    .map(title => findSection(markdown, title))
    .filter(section => !!section)
    .map(section => sectionContent(markdown, section))
}

export function getSetupGuide(context: ServerContext, { framework, tailwind = true }: GetSetupGuideArgs): string {
  const parts = [`# Set up maz-ui ${context.knowledge.version} in a ${framework === 'nuxt' ? 'Nuxt' : 'Vue'} app`]

  if (framework === 'nuxt')
    parts.push(...sections(context, 'ecosystem/nuxt', ['Installation', 'Minimal Setup']))
  else
    parts.push(...sections(context, 'guide/vue', ['Quick Start']))

  if (tailwind) {
    parts.push(
      '## Tailwind CSS',
      ...sections(context, 'guide/tailwind', ['Setup']),
      `Then style with the theme tokens only (\`get_theme_tokens\`).${framework === 'nuxt' ? ' With Tailwind, set `mazUi.css.injectCss: false` and import `maz-ui/style.css` first in your Tailwind entry to control the CSS order.' : ''}`,
    )
  }

  parts.push(
    '## AI agents',
    'Run `npx @maz-ui/mcp init` in the project: it registers this MCP server and writes the maz-ui rules for your agents (Claude Code, Cursor, Copilot, Codex...) without touching your own instructions.',
    `Full guides: \`get_doc({ id: "${framework === 'nuxt' ? 'ecosystem/nuxt' : 'guide/vue'}" })\`, \`get_doc({ id: "ecosystem/themes" })\` (presets, dark mode), \`get_doc({ id: "ecosystem/translations" })\`.`,
  )

  return parts.join('\n\n')
}

export const getSetupGuideTool = defineTool({
  name: 'get_setup_guide',
  title: 'Set up maz-ui',
  description: 'Installation and configuration steps of maz-ui for a Vue (Vite) or Nuxt app, with or without Tailwind CSS: packages to install, plugin or Nuxt module options, theme preset, translations, CSS entry and AI agent setup.',
  inputSchema: {
    framework: z.enum(['vue', 'nuxt']).describe('Target framework'),
    tailwind: z.boolean().optional().describe('Include the Tailwind CSS integration (default true)'),
  },
  run: getSetupGuide,
})
