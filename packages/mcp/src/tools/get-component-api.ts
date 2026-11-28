import type { ServerContext } from '../context.ts'
import type { ComponentApi } from '../knowledge/schema.ts'

import { z } from 'zod'
import { closest, resolveComponent } from '../knowledge/resolve.ts'
import { findSection, linksToDocIds, listSections, sectionContent, stripFrontmatter } from './markdown.ts'
import { sourceNote } from './source-note.ts'
import { defineTool, ToolInputError } from './types.ts'

export interface GetComponentApiArgs {
  names: string[]
  /** Names, types, defaults and values only, without the descriptions */
  compact?: boolean
}

/** The description after the name and the type of a prop, an event or a slot: `- \`size\` (\`"sm" | "md"\`): The size.` */
const ITEM_DESCRIPTION = /^(- `[^`]+`(?: \((?:[^()]|\([^()]*\))*\))?):\s.*$/gm

function compactApi(api: string): string {
  return api.replace(ITEM_DESCRIPTION, '$1')
}

/** The sections of the page that are examples, to read one with `get_doc({ id, sections })` instead of the whole page */
function exampleSections(markdown: string): string[] {
  return listSections(markdown)
    .filter(section => section.level === 2 && !section.title.endsWith(' API'))
    .map(section => section.title.replaceAll(/\[([^\]]+)\]\([^)]*\)/g, '$1'))
}

/** The API of a component, the hints about its parent and its attributes, and the sections of its examples */
function componentBlock(context: ServerContext, component: ComponentApi, compact: boolean): string {
  const doc = context.knowledge.docsById.get(component.docId)
  const markdown = doc
    ? linksToDocIds(stripFrontmatter(context.knowledge.readDoc(doc.id)), doc)
    : ''
  const section = findSection(markdown, `${component.name} API`)
  const api = section
    ? sectionContent(markdown, section)
    : `## ${component.name} API\n\n\`${component.import}\``
  const parent = component.parent
    ? `\n\nBuilding block of \`${component.parent}\`: see \`get_doc({ id: "${context.knowledge.componentsByName.get(component.parent)?.docId}" })\` for complete examples.`
    : ''
  const forwarded = component.forwardsAttrs
    ? `\n\nForwards its attributes to \`${component.forwardsAttrs}\`: the props and events of \`${component.forwardsAttrs}\` work on ${component.name} too (\`get_component_api({ names: ["${component.forwardsAttrs}"] })\`).`
    : ''

  const examples = exampleSections(markdown)
  const examplesLine = examples.length > 0
    ? `Examples: \`get_doc({ id: "${component.docId}", sections: ["${examples[0]}"] })\`, sections: ${examples.join(', ')}`
    : `Examples: \`get_doc({ id: "${component.docId}" })\``

  return `${compact
    ? compactApi(api)
    : api}${parent}${forwarded}\n\n${examplesLine}`
}

export function getComponentApi(context: ServerContext, { names, compact = false }: GetComponentApiArgs): string {
  const blocks: string[] = []
  const unknown: string[] = []
  const docIds: string[] = []

  for (const name of [
    ...new Set(names),
  ]) {
    const component = resolveComponent(context.knowledge, name)

    if (!component) {
      unknown.push(name)
      continue
    }

    docIds.push(component.docId)
    blocks.push(componentBlock(context, component, compact))
  }

  if (blocks.length === 0) {
    const suggestions = unknown.flatMap(name => closest(name, context.knowledge.componentsByName.keys(), { max: 4 }))

    throw new ToolInputError([
      `Unknown maz-ui component${unknown.length > 1
        ? 's'
        : ''}: ${unknown.join(', ')}.`,
      suggestions.length > 0
        ? `Did you mean: ${[
          ...new Set(suggestions),
        ].join(', ')}?`
        : '',
      'Use `search_docs` to find a component from a need, or `list_docs({ category: "component" })`.',
    ].filter(Boolean).join('\n'))
  }

  if (unknown.length > 0) {
    const suggestions = unknown.flatMap(name => closest(name, context.knowledge.componentsByName.keys(), { max: 4 }))

    blocks.push(`Unknown: ${unknown.join(', ')}.${suggestions.length > 0
      ? ` Did you mean ${[
        ...new Set(suggestions),
      ].join(', ')}?`
      : ''}`)
  }

  const note = sourceNote(context.knowledge, docIds[0])

  return [
    `Props are listed in kebab-case (use \`:prop\` for dynamic values). Values marked "non exhaustive" accept other values. Never use undocumented props, events or slots.`,
    ...blocks,
  ].join('\n\n---\n\n') + (note
    ? `\n\n${note}`
    : '')
}

export const getComponentApiTool = defineTool({
  name: 'get_component_api',
  title: 'maz-ui component API',
  description: 'Exact API of one or more maz-ui components (installed version): import, props with types, defaults and accepted values, v-model, events with payload, slots with bindings, exposed methods, and the example sections of their page. Call it before writing a template with a Maz* component; batch up to 10 components in one call (`compact: true` drops the descriptions).',
  inputSchema: {
    names: z.array(z.string().min(1)).min(1).max(10).describe('Component names: ["MazBtn", "MazDialog"] (kebab-case and short names like "btn" work)'),
    compact: z.boolean().optional().describe('Names, types, defaults and values only, without the descriptions: for components you already know'),
  },
  run: getComponentApi,
})
