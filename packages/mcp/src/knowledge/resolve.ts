import type { Knowledge } from './load'
import type { ComponentApi, DocCategory, DocEntry } from './schema'

const CATEGORY_PRIORITY: DocCategory[] = ['component', 'composable', 'directive', 'plugin', 'util', 'guide', 'ecosystem', 'reference', 'node']

export function toKebab(value: string): string {
  return value
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function normalizeName(value: string): string {
  return value
    .trim()
    .replace(/^<\/?|\s*\/?>$/g, '')
    .replace(/^https?:\/\/(?:www\.)?maz-ui\.com\//, '')
    .replace(/^maz-ui:\/\//, '')
    .replace(/^([a-z]+):\/\//, '$1s/')
    .replace(/\.md$/, '')
    .replace(/\/$/, '')
}

function byPriority(a: DocEntry, b: DocEntry): number {
  return CATEGORY_PRIORITY.indexOf(a.category) - CATEGORY_PRIORITY.indexOf(b.category)
}

/**
 * Resolves a doc from an id (`components/maz-btn`), a slug (`maz-btn`), a
 * symbol (`MazBtn`, `useToast`, `vTooltip`, `debounce`), a short name
 * (`btn`, `v-tooltip`) or a maz-ui.com URL.
 */
export function resolveDoc(knowledge: Knowledge, query: string, category?: DocCategory): DocEntry | undefined {
  const name = normalizeName(query)
  const lower = name.toLowerCase()
  const kebab = toKebab(name)
  const candidates = category ? knowledge.docs.filter(doc => doc.category === category) : knowledge.docs
  const pick = (predicate: (doc: DocEntry) => boolean): DocEntry | undefined => candidates.filter(predicate).sort(byPriority)[0]

  const byId = knowledge.docsById.get(name)

  if (byId && (!category || byId.category === category))
    return byId

  const pathMatch = lower.includes('/')
    ? pick(doc => doc.id.toLowerCase() === lower || doc.id.toLowerCase().endsWith(`/${lower}`))
    : undefined

  return pathMatch
    ?? pick(doc => doc.symbols.includes(name))
    ?? pick(doc => doc.symbols.some(symbol => symbol.toLowerCase() === lower))
    ?? pick(doc => doc.slug === lower || doc.slug === kebab)
    ?? pick(doc => doc.slug === `maz-${kebab}` || doc.slug === kebab.replace(/^v-/, '') || doc.slug === `use-${kebab}`)
    ?? pick(doc => doc.title.toLowerCase() === lower)
    ?? (lower.includes('/') ? resolveDoc(knowledge, lower.split('/').at(-1) as string, category) : undefined)
}

/** Resolves a component from `MazBtn`, `maz-btn`, `btn`, `<MazBtn>` */
export function resolveComponent(knowledge: Knowledge, query: string): ComponentApi | undefined {
  const name = normalizeName(query).replace(/^components\//, '')
  const exact = knowledge.componentsByName.get(name)

  if (exact)
    return exact

  const kebab = toKebab(name).replace(/^maz-/, '')

  for (const component of knowledge.manifest.components) {
    if (toKebab(component.name).replace(/^maz-/, '') === kebab)
      return component
  }

  return undefined
}

/** Levenshtein distance, bounded for performance */
export function editDistance(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max)
    return max + 1

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    let rowMin = i

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
      rowMin = Math.min(rowMin, current[j])
    }

    if (rowMin > max)
      return max + 1

    previous = current
  }

  return previous[b.length]
}

/** Closest candidates by edit distance (case insensitive), best first */
export function closest(value: string, candidates: Iterable<string>, { max = 3, limit = 3 } = {}): string[] {
  const lower = value.toLowerCase()

  return [...candidates]
    .map(candidate => ({ candidate, distance: editDistance(lower, candidate.toLowerCase(), max) }))
    .filter(({ distance }) => distance <= max)
    .sort((a, b) => a.distance - b.distance || a.candidate.length - b.candidate.length)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}
