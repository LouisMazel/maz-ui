import type { ServerContext } from '../context'
import type { DocCategory } from '../knowledge/schema'

import { z } from 'zod'
import { docCategories } from '../knowledge/schema'
import { truncateText } from './markdown'
import { defineTool } from './types'

const CATEGORY_TITLES: Record<DocCategory, string> = {
  guide: 'Guides',
  component: 'Components (maz-ui)',
  composable: 'Composables (maz-ui)',
  directive: 'Directives (maz-ui)',
  plugin: 'Plugins (maz-ui)',
  ecosystem: 'Ecosystem packages',
  util: 'Helpers (@maz-ui/utils)',
  node: 'Node utilities (@maz-ui/node)',
  reference: 'References',
}

export interface ListDocsArgs {
  category?: DocCategory
}

export function describeSource(context: ServerContext): string {
  const { source, version } = context.knowledge

  if (source.kind === 'project')
    return `Docs of maz-ui ${version}, read from the project (node_modules/maz-ui/docs).`

  if (source.kind === 'custom')
    return `Docs of maz-ui ${version}, read from ${source.directory}.`

  if (source.projectVersion && source.projectVersion !== version)
    return `The project uses maz-ui ${source.projectVersion}, which does not ship its docs: these are the docs of maz-ui ${version} (bundled with @maz-ui/mcp). Double check APIs that may differ.`

  return `Docs of maz-ui ${version} (bundled with @maz-ui/mcp).`
}

export function listDocs(context: ServerContext, { category }: ListDocsArgs): string {
  const categories = category ? [category] : docCategories
  const sections = categories
    .map((current) => {
      const docs = context.knowledge.docs.filter(doc => doc.category === current)

      if (docs.length === 0)
        return ''

      const lines = docs.map(doc => `- ${doc.title} \`${doc.id}\`: ${truncateText(doc.description, 120)}`)

      return `## ${CATEGORY_TITLES[current]} (${docs.length})\n\n${lines.join('\n')}`
    })
    .filter(Boolean)

  return [
    `# maz-ui ecosystem catalog`,
    '',
    describeSource(context),
    '',
    ...sections.flatMap(section => [section, '']),
    'Read a page with `get_doc({ id })`, a component API with `get_component_api({ names })`.',
  ].join('\n')
}

export const listDocsTool = defineTool({
  name: 'list_docs',
  title: 'maz-ui catalog',
  description: 'Catalog of everything maz-ui and its ecosystem provide (installed version), one line per item with its id: components, composables, directives, plugins, @maz-ui/utils helpers, ecosystem packages (themes, translations, icons, nuxt), guides and references. Use it to get an overview; prefer `search_docs` to find something for a given need.',
  inputSchema: {
    category: z.enum(docCategories).optional().describe('Only list this category'),
  },
  run: listDocs,
})
