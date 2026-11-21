import type { CatalogGroup } from '../catalog.ts'
import type { PageSymbols } from '../sources/symbols.ts'

import { extractImports } from '../sources/symbols.ts'

interface CatalogTool {
  symbol: string
  specifier: string
}

/** Symbols of a doc, `undefined` for an unknown id */
export type CatalogLookup = (id: string) => PageSymbols | undefined

function toolsOf(page: PageSymbols, only: string[] | undefined): CatalogTool[] {
  const specifiers = new Map(extractImports(page.imports.join('\n')).flatMap(statement => [statement.defaultName, ...statement.names]
    .filter((name): name is string => !!name)
    .map(name => [name, statement.specifier] as const)))

  return page.symbols
    .filter(symbol => !only || only.includes(symbol))
    .flatMap((symbol) => {
      const specifier = specifiers.get(symbol)

      return specifier
        ? [{ symbol, specifier }]
        : []
    })
}

/** `` `a`, `b` (`@maz-ui/utils/helpers/<name>`) `` when the modules are named after their symbol, else one import per module */
function renderTools(tools: CatalogTool[]): string {
  const groups = new Map<string, CatalogTool[]>()

  for (const tool of tools) {
    const directory = tool.specifier.slice(0, tool.specifier.lastIndexOf('/'))
    const key = tool.specifier.endsWith(`/${tool.symbol}`) && tools.filter(other => other.specifier.startsWith(`${directory}/`) && other.specifier.endsWith(`/${other.symbol}`)).length > 1
      ? `${directory}/<name>`
      : tool.specifier

    groups.set(key, [...(groups.get(key) ?? []), tool])
  }

  return [...groups.entries()].map(([specifier, group]) => specifier.startsWith('maz-ui/plugins/')
    ? group.map(tool => `\`app.use(${tool.symbol})\` once (\`${specifier}\`)`).join(', ')
    : `${group.map(tool => `\`${tool.symbol}\``).join(', ')} (\`${specifier}\`)`).join(', ')
}

function needProblems({ need, docs, symbols }: CatalogGroup['needs'][number], lookup: CatalogLookup): string[] {
  const pages = docs.map(id => lookup(id))
  const problems = docs.filter((_, index) => !pages[index]).map(id => `catalog.ts references the unknown doc "${id}"`)
  const known = pages.flatMap(page => page?.symbols ?? [])

  problems.push(...(symbols ?? []).filter(symbol => !known.includes(symbol)).map(symbol => `catalog.ts: "${symbol}" is not a symbol of ${docs.join(', ')}`))

  if (pages.every(page => page && toolsOf(page, symbols).length === 0))
    problems.push(`catalog.ts: no import found for "${need}"`)

  return problems
}

/** Problems of the catalog: unknown docs, unknown symbols, tools missing from it */
export function catalogProblems(catalog: CatalogGroup[], lookup: CatalogLookup, catalogable: string[], omitted: Record<string, string>): string[] {
  const needs = catalog.flatMap(group => group.needs)
  const listed = new Set(needs.flatMap(need => need.docs))

  return [
    ...needs.flatMap(need => needProblems(need, lookup)),
    ...catalogable
      .filter(id => !listed.has(id) && !omitted[id])
      .map(id => `${id} is missing from the catalog of the agent rules (tools/agent-docs/src/catalog.ts): add the need it covers, or add it to CATALOG_OMITTED`),
    ...Object.keys(omitted).filter(id => !lookup(id)).map(id => `CATALOG_OMITTED references the unknown doc "${id}"`),
  ]
}

/** Symbols only: the imports are a `search_docs` away */
function renderCompactTools(tools: CatalogTool[]): string {
  return tools.map(tool => tool.specifier.startsWith('maz-ui/plugins/')
    ? `\`app.use(${tool.symbol})\``
    : `\`${tool.symbol}\``).join(', ')
}

/** The examples in parentheses of a need, left out of the compact catalog (the code ones are kept: they are the triggers) */
const ASIDE = / \([^()`]*\)/g

const COMPACT_INTRO = 'Before writing logic by hand, look for the need below: these tools already exist. `search_docs` gives their import and API (or `node_modules/maz-ui/agent-docs`). A plugin (`app.use(...)`) is one line in `main.ts` (`mazUi.plugins` with Nuxt).'

export interface RenderCatalogOptions {
  /** Symbols without their imports and a short intro, for the context loaded at the start of each session (10,000 characters at most) */
  compact?: boolean
}

/** Section of the rules that lists the tools of the ecosystem by need */
export function renderCatalog(catalog: CatalogGroup[], lookup: CatalogLookup, { compact = false }: RenderCatalogOptions = {}): string {
  const groups = catalog.map(({ title, needs }) => {
    const lines = needs.flatMap(({ need, docs, symbols }) => {
      const tools = docs.flatMap((id) => {
        const page = lookup(id)

        return page
          ? toolsOf(page, symbols)
          : []
      })

      return tools.length > 0
        ? [compact
            ? `- ${need.replaceAll(ASIDE, '')}: ${renderCompactTools(tools)}`
            : `- ${need}: ${renderTools(tools)}`]
        : []
    })

    return `**${title}**\n\n${lines.join('\n')}`
  })

  if (compact)
    return `### The ecosystem by need\n\n${COMPACT_INTRO}\n\n${groups.join('\n\n')}`

  return `### The ecosystem by need

Before writing logic by hand (a state shared between components, a timer, an event listener, an observer, a formatter, a browser API), look for the need below: these tools already exist. Read their API with \`get_doc\` or \`search_docs\` (or their page in \`agent-docs\`) before using them, and \`search_docs\` the needs that are not listed. A composable that works through a plugin needs it once in the app (\`app.use(WaitPlugin)\` in \`main.ts\`, or \`mazUi.plugins\` with Nuxt): that is one line, not a reason to write it by hand.

${groups.join('\n\n')}`
}
