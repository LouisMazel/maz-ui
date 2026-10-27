import type { ServerContext } from '../context'

import { z } from 'zod'
import { closest, resolveComponent } from '../knowledge/resolve'
import { findSection, linksToDocIds, sectionContent, stripFrontmatter } from './markdown'
import { defineTool, ToolInputError } from './types'

export interface GetComponentApiArgs {
  names: string[]
}

export function getComponentApi(context: ServerContext, { names }: GetComponentApiArgs): string {
  const blocks: string[] = []
  const unknown: string[] = []

  for (const name of [...new Set(names)]) {
    const component = resolveComponent(context.knowledge, name)

    if (!component) {
      unknown.push(name)
      continue
    }

    const doc = context.knowledge.docsById.get(component.docId)
    const markdown = doc ? linksToDocIds(stripFrontmatter(context.knowledge.readDoc(doc.id)), doc) : ''
    const section = findSection(markdown, `${component.name} API`)
    const api = section ? sectionContent(markdown, section) : `## ${component.name} API\n\n\`${component.import}\``
    const parent = component.parent ? `\n\nBuilding block of \`${component.parent}\`: see \`get_doc({ id: "${context.knowledge.componentsByName.get(component.parent)?.docId}" })\` for complete examples.` : ''

    blocks.push(`${api}${parent}\n\nExamples: \`get_doc({ id: "${component.docId}" })\``)
  }

  if (blocks.length === 0) {
    const suggestions = unknown.flatMap(name => closest(name, context.knowledge.componentsByName.keys(), { max: 4 }))

    throw new ToolInputError([
      `Unknown maz-ui component${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}.`,
      suggestions.length > 0 ? `Did you mean: ${[...new Set(suggestions)].join(', ')}?` : '',
      'Use `search_docs` to find a component from a need, or `list_docs({ category: "component" })`.',
    ].filter(Boolean).join('\n'))
  }

  if (unknown.length > 0) {
    const suggestions = unknown.flatMap(name => closest(name, context.knowledge.componentsByName.keys(), { max: 4 }))

    blocks.push(`Unknown: ${unknown.join(', ')}.${suggestions.length > 0 ? ` Did you mean ${[...new Set(suggestions)].join(', ')}?` : ''}`)
  }

  return [
    `Props are listed in kebab-case (use \`:prop\` for dynamic values). Values marked "non exhaustive" accept other values. Never use undocumented props, events or slots.`,
    ...blocks,
  ].join('\n\n---\n\n')
}

export const getComponentApiTool = defineTool({
  name: 'get_component_api',
  title: 'maz-ui component API',
  description: 'Exact API of one or more maz-ui components (installed version): import, props with types, defaults and accepted values, v-model, events with payload, slots with bindings, exposed methods. Call it before writing a template with a Maz* component; batch up to 10 components in one call.',
  inputSchema: {
    names: z.array(z.string().min(1)).min(1).max(10).describe('Component names: ["MazBtn", "MazDialog"] (kebab-case and short names like "btn" work)'),
  },
  run: getComponentApi,
})
