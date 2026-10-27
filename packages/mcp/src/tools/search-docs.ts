import type { ServerContext } from '../context'
import type { DocCategory, DocEntry } from '../knowledge/schema'

import { z } from 'zod'
import { docCategories } from '../knowledge/schema'
import { searchIcons } from '../search/engine'
import { truncateText } from './markdown'
import { defineTool } from './types'

/** Below this score, results are only loosely related to the query */
export const WEAK_MATCH_SCORE = 150

export function nextCall(doc: DocEntry): string {
  if (doc.category === 'component')
    return `get_component_api({ names: ["${doc.title}"] }) for the API, get_doc({ id: "${doc.id}" }) for examples`

  if (doc.id === 'reference/tailwind-tokens')
    return 'get_theme_tokens()'

  if (doc.id === 'reference/icons')
    return 'find_icons({ query: "..." })'

  return `get_doc({ id: "${doc.id}" })`
}

export function formatDocLine(doc: DocEntry, index?: number): string {
  const prefix = index === undefined ? '-' : `${index + 1}.`
  const lines = [
    `${prefix} **${doc.title}** (${doc.category}, \`${doc.id}\`): ${truncateText(doc.description, 220)}`,
  ]

  if (doc.imports[0])
    lines.push(`   \`${doc.imports[0]}\``)

  lines.push(`   Next: ${nextCall(doc)}`)

  return lines.join('\n')
}

export interface SearchDocsArgs {
  query: string
  category?: DocCategory
  limit?: number
}

export function searchDocs(context: ServerContext, { query, category, limit = 8 }: SearchDocsArgs): string {
  const hits = context.search.search(query, { category, limit })
  const header = `# maz-ui ${context.knowledge.version} results for "${query}"${category ? ` (category: ${category})` : ''}`

  if (hits.length === 0) {
    return [
      header,
      '',
      'No result. Try other words describing the need (e.g. "modal" or "dialog", "notification" or "toast"), remove the category filter, or browse with `list_docs`.',
      'If maz-ui does not provide it, build it with maz-ui components and the theme tokens (`get_theme_tokens`).',
    ].join('\n')
  }

  const lines = [header, '', ...hits.map((hit, index) => formatDocLine(hit.doc, index))]

  if (hits[0].score < WEAK_MATCH_SCORE) {
    lines.push('', 'These results are weak matches: maz-ui probably has no dedicated feature for this need. Compose it from maz-ui components (MazCard, MazBtn, MazIcon...) and theme tokens (`get_theme_tokens`) rather than adding another library.')
  }

  if (/\bicons?\b/i.test(query)) {
    const icons = searchIcons(context.knowledge.iconNames, query, 8)

    if (icons.length > 0)
      lines.push('', `Icons: ${icons.join(', ')}. Use \`find_icons\` for imports.`)
  }

  return lines.join('\n')
}

export const searchDocsTool = defineTool({
  name: 'search_docs',
  title: 'Search maz-ui',
  description: 'Find what maz-ui and its ecosystem already provide for a need, BEFORE writing a component, composable, helper or style. Describe the need in plain words ("user avatar with initials", "confirm before delete", "phone number input", "debounce search", "dark mode toggle", "tailwind breakpoints"); names (MazBtn, useToast) and aliases from other libraries (modal, snackbar, combobox) work too. Returns ranked components, composables, directives, plugins, helpers (@maz-ui/utils), guides and references with their import and the next tool to call.',
  inputSchema: {
    query: z.string().min(1).describe('The need or the name to look for, in English'),
    category: z.enum(docCategories).optional().describe('Restrict to one category'),
    limit: z.number().int().min(1).max(20).optional().describe('Number of results (default 8)'),
  },
  run: searchDocs,
})
