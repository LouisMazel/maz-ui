import type { ServerContext } from '../context'
import type { DocEntry } from '../knowledge/schema'

import { z } from 'zod'
import { resolveDoc } from '../knowledge/resolve'
import { findSection, linksToDocIds, listSections, outline, sectionContent, stripFrontmatter } from './markdown'
import { formatDocLine } from './search-docs'
import { defineTool, ToolInputError } from './types'

/** Pages above this size are returned as an outline plus their beginning, unless `full` is set */
export const MAX_FULL_DOC_CHARS = 24_000
const PREVIEW_CHARS = 6000

export function notFoundMessage(context: ServerContext, query: string): string {
  const suggestions = context.search.search(query, { limit: 5 })

  return [
    `No maz-ui doc matches "${query}".`,
    ...(suggestions.length > 0 ? ['', 'Closest docs:', ...suggestions.map(hit => formatDocLine(hit.doc))] : []),
    '',
    'Pass an id from `search_docs` or `list_docs` (e.g. "components/maz-btn", "composables/use-toast", "guide/tailwind").',
  ].join('\n')
}

function related(context: ServerContext, doc: DocEntry): string {
  const docs = doc.related
    .map(id => context.knowledge.docsById.get(id))
    .filter((entry): entry is DocEntry => !!entry)

  return docs.length > 0 ? `\n\nRelated: ${docs.map(entry => `\`${entry.id}\` (${entry.title})`).join(', ')}` : ''
}

export interface GetDocArgs {
  id: string
  sections?: string[]
  full?: boolean
}

export function getDoc(context: ServerContext, { id, sections, full = false }: GetDocArgs): string {
  const doc = resolveDoc(context.knowledge, id)

  if (!doc)
    throw new ToolInputError(notFoundMessage(context, id))

  const markdown = linksToDocIds(stripFrontmatter(context.knowledge.readDoc(doc.id)), doc)

  if (sections?.length) {
    const found = sections.map(title => ({ title, section: findSection(markdown, title) }))
    const missing = found.filter(entry => !entry.section).map(entry => entry.title)

    if (missing.length === found.length) {
      throw new ToolInputError(`No section "${missing.join('", "')}" in \`${doc.id}\`. Available sections:\n${outline(markdown)}`)
    }

    return [
      `# ${doc.title} (\`${doc.id}\`)`,
      ...found.filter(entry => entry.section).map(entry => sectionContent(markdown, entry.section as NonNullable<typeof entry.section>)),
      ...(missing.length > 0 ? [`Sections not found: ${missing.join(', ')}.`] : []),
    ].join('\n\n')
  }

  if (full || markdown.length <= MAX_FULL_DOC_CHARS)
    return `${markdown.trim()}${related(context, doc)}`

  const firstSection = listSections(markdown)[0]
  const intro = markdown.slice(0, Math.min(firstSection ? markdown.split('\n').slice(0, firstSection.start).join('\n').length : PREVIEW_CHARS, PREVIEW_CHARS))
  const apiHint = doc.category === 'component' ? `\n\nFor the props, events and slots: \`get_component_api({ names: ${JSON.stringify(doc.symbols)} })\`.` : ''

  return [
    intro.trim(),
    '',
    `This page is long (${markdown.length} characters). Request the sections you need with \`get_doc({ id: "${doc.id}", sections: ["..."] })\`, or \`full: true\` for everything.${apiHint}`,
    '',
    '## Sections',
    '',
    outline(markdown),
  ].join('\n') + related(context, doc)
}

export const getDocTool = defineTool({
  name: 'get_doc',
  title: 'Read a maz-ui doc page',
  description: 'Read a maz-ui documentation page (usage, examples, options) of the installed version: a component, composable, directive, plugin, helper, guide (tailwind, vue, getting-started, migration-v5...) or ecosystem package (themes, translations, icons, nuxt). Accepts an id ("components/maz-btn", "guide/tailwind", "ecosystem/themes") or a name (MazBtn, useToast, vTooltip, debounce). Long pages return an outline: then ask for specific sections.',
  inputSchema: {
    id: z.string().min(1).describe('Doc id or name: "components/maz-btn", "MazBtn", "useToast", "guide/tailwind", "ecosystem/themes"'),
    sections: z.array(z.string()).max(10).optional().describe('Only return these sections (heading titles, e.g. ["Basic usage", "Loading"])'),
    full: z.boolean().optional().describe('Return the whole page even when it is long'),
  },
  run: getDoc,
})
