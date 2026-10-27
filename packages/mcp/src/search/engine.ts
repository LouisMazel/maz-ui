import type { Knowledge } from '../knowledge/load'
import type { DocCategory, DocEntry } from '../knowledge/schema'

import MiniSearch from 'minisearch'
import { normalizeName, toKebab } from '../knowledge/resolve'
import { SYNONYMS } from './synonyms'
import { analyze, processTerm, tokenize } from './text'

export interface SearchOptions {
  category?: DocCategory
  limit?: number
}

export interface SearchHit {
  doc: DocEntry
  score: number
  /** Query terms found in the doc */
  matched: string[]
}

interface IndexedDoc {
  id: string
  name: string
  aliases: string
  description: string
  headings: string
  api: string
  body: string
}

const FIELD_BOOSTS = {
  name: 8,
  aliases: 5,
  description: 2.5,
  headings: 1.5,
  api: 1.2,
  body: 0.5,
}

const CATEGORY_HINTS: Record<string, DocCategory> = {
  component: 'component',
  composable: 'composable',
  hook: 'composable',
  directive: 'directive',
  plugin: 'plugin',
  helper: 'util',
  util: 'util',
  utility: 'util',
  function: 'util',
  guide: 'guide',
}

const EXACT_MATCH_BOOST = 4
const EXACT_ALIAS_BOOST = 2.5
const CATEGORY_HINT_BOOST = 1.4

function normalizedSynonyms(): Map<string, string[]> {
  const map = new Map<string, string[]>()

  for (const [key, values] of Object.entries(SYNONYMS)) {
    const term = processTerm(key)

    if (term)
      map.set(term, values.map(processTerm).filter((value): value is string => !!value && value !== term))
  }

  return map
}

/** Removes the generated header of a page (frontmatter + metadata list) so it does not dilute the body field */
function bodyOf(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, '')
}

export class DocSearch {
  private readonly index: MiniSearch<IndexedDoc>
  private readonly synonyms = normalizedSynonyms()

  constructor(private readonly knowledge: Knowledge) {
    this.index = new MiniSearch<IndexedDoc>({
      fields: Object.keys(FIELD_BOOSTS),
      storeFields: [],
      tokenize,
      processTerm,
    })

    this.index.addAll(knowledge.docs.map(doc => this.toIndexed(doc)))
  }

  private toIndexed(doc: DocEntry): IndexedDoc {
    const component = doc.category === 'component' ? this.knowledge.componentsByName.get(doc.title) : undefined
    const api = component
      ? [
          ...component.props.map(prop => prop.name),
          ...component.events.map(event => event.name),
          ...component.slots.map(slot => slot.name),
        ].join(' ')
      : ''

    return {
      id: doc.id,
      name: [doc.title, ...doc.symbols, doc.slug].join(' '),
      aliases: doc.aliases.join(' . '),
      description: doc.description,
      headings: doc.headings.join(' . '),
      api,
      body: bodyOf(this.knowledge.readDoc(doc.id)),
    }
  }

  private exactMatch(query: string): DocEntry | undefined {
    const name = normalizeName(query)
    const lower = name.toLowerCase()
    const kebab = toKebab(name)

    return this.knowledge.docs.find(doc =>
      doc.symbols.some(symbol => symbol.toLowerCase() === lower)
      || doc.title.toLowerCase() === lower
      || doc.slug === lower
      || doc.slug === kebab
      || doc.id === lower
      || doc.slug === `maz-${kebab}`,
    )
  }

  search(query: string, { category, limit = 8 }: SearchOptions = {}): SearchHit[] {
    const terms = analyze(query)

    if (terms.length === 0)
      return []

    const hintedCategory = category ? undefined : terms.map(term => CATEGORY_HINTS[term]).find(Boolean)
    const expansion = [...new Set(terms.flatMap(term => this.synonyms.get(term) ?? []))].filter(term => !terms.includes(term))
    const exact = this.exactMatch(query)
    const normalizedQuery = query.trim().toLowerCase()

    const results = this.index.search({
      combineWith: 'OR',
      queries: [
        { queries: [terms.join(' ')], combineWith: 'OR' },
        ...(expansion.length > 0 ? [{ queries: [expansion.join(' ')], combineWith: 'OR' as const, boostTerm: () => 0.45 }] : []),
      ],
    }, {
      boost: FIELD_BOOSTS,
      fuzzy: (term: string) => (term.length >= 5 ? 0.2 : false),
      prefix: (term: string) => term.length >= 4,
      weights: { fuzzy: 0.35, prefix: 0.5 },
      filter: result => !category || this.knowledge.docsById.get(result.id as string)?.category === category,
    })

    return results
      .map((result) => {
        const doc = this.knowledge.docsById.get(result.id as string) as DocEntry
        const matched = terms.filter(term => result.queryTerms.includes(term))
        const coverage = matched.length / terms.length
        let score = result.score * (0.6 + coverage)

        if (exact && doc.id === exact.id)
          score *= EXACT_MATCH_BOOST
        else if (doc.aliases.includes(normalizedQuery))
          score *= EXACT_ALIAS_BOOST
        if (hintedCategory && doc.category === hintedCategory)
          score *= CATEGORY_HINT_BOOST

        return { doc, score, matched }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
}

/** Keywords agents use, mapped to the words of the heroicons names */
const ICON_SYNONYMS: Record<string, string[]> = {
  delete: ['trash'],
  remove: ['trash', 'xmark', 'minus'],
  bin: ['trash'],
  close: ['xmark'],
  cross: ['xmark'],
  cancel: ['xmark'],
  add: ['plus'],
  plus: ['plus'],
  new: ['plus'],
  create: ['plus'],
  edit: ['pencil'],
  write: ['pencil'],
  rename: ['pencil'],
  search: ['magnifying', 'glass'],
  find: ['magnifying'],
  zoom: ['magnifying'],
  settings: ['cog', 'adjustment'],
  setting: ['cog', 'adjustment'],
  config: ['cog'],
  preferences: ['cog', 'adjustment'],
  filter: ['funnel', 'adjustment'],
  menu: ['bars'],
  hamburger: ['bars'],
  user: ['user'],
  account: ['user'],
  profile: ['user'],
  people: ['user'],
  team: ['user'],
  logout: ['arrow', 'rectangle'],
  login: ['arrow', 'rectangle'],
  signout: ['arrow', 'rectangle'],
  download: ['arrow', 'down', 'tray'],
  upload: ['arrow', 'up', 'tray'],
  export: ['arrow', 'up', 'tray'],
  import: ['arrow', 'down', 'tray'],
  back: ['arrow', 'left'],
  previous: ['chevron', 'left'],
  next: ['chevron', 'right'],
  forward: ['arrow', 'right'],
  expand: ['chevron', 'down'],
  dropdown: ['chevron', 'down'],
  success: ['check'],
  valid: ['check'],
  done: ['check'],
  ok: ['check'],
  error: ['exclamation'],
  warning: ['exclamation', 'triangle'],
  alert: ['exclamation', 'bell'],
  info: ['information'],
  help: ['question'],
  notification: ['bell'],
  email: ['envelope'],
  mail: ['envelope'],
  message: ['chat', 'envelope'],
  comment: ['chat'],
  phone: ['phone', 'device'],
  call: ['phone'],
  calendar: ['calendar'],
  date: ['calendar'],
  time: ['clock'],
  clock: ['clock'],
  favorite: ['star', 'heart'],
  like: ['heart', 'thumb'],
  love: ['heart'],
  home: ['home'],
  house: ['home'],
  lock: ['lock'],
  password: ['lock', 'key'],
  security: ['shield', 'lock'],
  visible: ['eye'],
  show: ['eye'],
  hide: ['eye', 'slash'],
  hidden: ['eye', 'slash'],
  copy: ['clipboard', 'document', 'duplicate'],
  paste: ['clipboard'],
  link: ['link'],
  share: ['share'],
  image: ['photo'],
  picture: ['photo'],
  camera: ['camera'],
  video: ['video', 'film'],
  music: ['musical'],
  file: ['document'],
  folder: ['folder'],
  cart: ['shopping'],
  shop: ['shopping'],
  payment: ['credit', 'card', 'banknote'],
  money: ['banknote', 'currency'],
  refresh: ['arrow', 'path'],
  reload: ['arrow', 'path'],
  sync: ['arrow', 'path'],
  undo: ['arrow', 'uturn'],
  dark: ['moon'],
  light: ['sun'],
  theme: ['moon', 'sun', 'swatch'],
  language: ['language', 'globe'],
  world: ['globe'],
  location: ['map', 'pin'],
  map: ['map'],
  chart: ['chart'],
  stats: ['chart'],
  print: ['printer'],
  more: ['ellipsis'],
  options: ['ellipsis'],
  drag: ['bars'],
  external: ['arrow', 'top', 'right', 'square'],
  github: ['github'],
  code: ['code'],
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

function regionName(code: string): string {
  try {
    return regionNames.of(code) ?? ''
  }
  catch {
    return ''
  }
}
const iconWordsCache = new Map<string, string[]>()

/** Analyzed words of an icon name; flags also get their country name (`MazFlagFR` -> france) */
function iconWords(name: string): string[] {
  const cached = iconWordsCache.get(name)

  if (cached)
    return cached

  const flag = /^MazFlag(?:Square)?([A-Z]{2})(?:[A-Z]{2})?$/.exec(name)
  const country = flag ? regionName(flag[1]) : ''

  const words = [...analyze(name.replace(/^Maz/, '')), ...(flag ? ['flag', 'country', flag[1].toLowerCase()] : []), ...analyze(country)]
  iconWordsCache.set(name, words)

  return words
}

/** Icon search over the `@maz-ui/icons` names, with English keywords and country names for flags */
export function searchIcons(names: Iterable<string>, query: string, limit = 20): string[] {
  const words = analyze(query.replace(/\bicons?\b/gi, ''))

  if (words.length === 0)
    return []

  const synonyms = new Map(Object.entries(ICON_SYNONYMS).map(([key, values]) => [
    processTerm(key) ?? key,
    values.map(value => processTerm(value) ?? value),
  ]))

  return [...names]
    .map((name) => {
      const parts = iconWords(name)
      const lowerName = name.toLowerCase()
      let score = 0

      for (const word of words) {
        const candidates = [word, ...(synonyms.get(word) ?? [])]

        for (const [index, candidate] of candidates.entries()) {
          const weight = index === 0 ? 1 : 0.8

          if (parts.includes(candidate))
            score += 3 * weight
          else if (lowerName.includes(candidate))
            score += 1.5 * weight
        }
      }

      if (score > 0 && name.startsWith('MazFlag') && !words.some(word => ['flag', 'country'].includes(word)))
        score *= 0.3

      return { name, score: score - parts.length * 0.05 }
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(entry => entry.name)
}
