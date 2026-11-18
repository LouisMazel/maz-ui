import type { Prepared } from 'fuzzysort'
import fuzzysort from 'fuzzysort'
import { normalizeString } from './normalizeString'
import { getMatchingScore } from './stringMatching'

/** A key of the items to search in: a property name, a getter, or one of them with a weight */
export type FuzzySearchKey<T> = FuzzySearchKeyValue<T> | {
  /** Property name or getter */
  key: FuzzySearchKeyValue<T>
  /**
   * Weight of the key in the score: a match in a key of weight 0.5 counts half
   * @default 1
   */
  weight?: number
  /** Name of the key in the matches, defaults to the property name or `key-<index>` for a getter */
  name?: string
}

export type FuzzySearchKeyValue<T> = (T extends object ? Extract<keyof T, string> : never) | ((item: T) => unknown)

export interface FuzzySearchOptions<T> {
  /**
   * The keys to search in, for a list of objects. A list of strings, numbers or booleans is searched as is.
   */
  keys?: FuzzySearchKey<T>[]
  /**
   * Tolerance to typos: the minimal similarity (from 0 to 1) of a whole value with the query, for the values that do not
   * contain the query. `1` disables it.
   * @default 0.75
   */
  typoThreshold?: number
  /**
   * Minimal score (from 0 to 1) of a scattered match that does not start a word (`fr` in `South Africa`). The matches
   * that start a word (`mzv` in `maz-van`, `nwz` in `New Zealand`) are kept from 3 characters, the typo matches always.
   * @default 0.35
   */
  minScore?: number
  /**
   * Order of the results: the best match first, or the order of the list
   * @default 'relevance'
   */
  sort?: 'relevance' | 'original'
  /** Maximum number of results, all by default */
  limit?: number
}

export interface FuzzySearchMatch {
  /** Name of the key */
  key: string
  /** Value of the key, as searched */
  value: string
  /** Indexes of the matched characters in `value`, empty for a typo match */
  indexes: number[]
}

export interface FuzzySearchResult<T> {
  item: T
  /** Index of the item in the list */
  index: number
  /** From 0 to 1, 1 is an exact match */
  score: number
  /** The keys that match the query, the best first */
  matches: FuzzySearchMatch[]
}

export interface FuzzySearchSegment {
  text: string
  /** `true` when the text matches the query */
  match: boolean
}

interface FuzzySearchEntry<T> {
  item: T
  index: number
  values: string[]
  prepared: Prepared[]
  normalized: string[]
}

interface ResolvedKey<T> {
  get: (item: T) => unknown
  weight: number
  name: string
}

/** Shorter queries scattered over a value match too many items */
const MIN_SCATTERED_QUERY_LENGTH = 3

/** The matches found only by the typo tolerance rank below the fuzzy matches */
const TYPO_SCORE_FACTOR = 0.5

const WORD_CHAR = /[\p{L}\p{N}]/u

/** `true` when the character at `index` starts a word: start of the value, after a separator, or a camelCase hump */
function isWordStart(value: string, index: number): boolean {
  const previous = value[index - 1]
  const char = value[index]!

  return !previous
    || !WORD_CHAR.test(previous)
    || (previous === previous.toLowerCase() && char !== char.toLowerCase())
}

function toText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function resolveKeys<T>(keys: FuzzySearchKey<T>[] | undefined): ResolvedKey<T>[] {
  if (!keys?.length) {
    return [
      {
        get: item => item,
        weight: 1,
        name: 'value',
      },
    ]
  }

  return keys.map((key, index) => {
    const { key: value, weight = 1, name } = typeof key === 'object'
      ? key
      : { key, weight: 1, name: undefined }

    return typeof value === 'function'
      ? { get: value, weight, name: name ?? `key-${index}` }
      : {
          get: (item: T) => (item as Record<string, unknown>)[value],
          weight,
          name: name ?? value,
        }
  })
}

/**
 * Index a list for fuzzy searches: the values of the keys are read and prepared once, then `search` can run on each
 * keystroke. A search finds, from the best to the weakest: the exact values, the prefixes, the substrings (better at
 * the start of a word), the words in any order, the scattered letters (`mzv` finds `maz-van`) and the typos (`Franse`
 * finds `France`). The case and the accents are ignored.
 * @param list The items to search in
 * @param options The keys, the typo tolerance and the order of the results
 * @returns The `search(query)` function of the index
 */
export function createFuzzySearch<T>(list: readonly T[], options: FuzzySearchOptions<T> = {}) {
  const { typoThreshold = 0.75, minScore = 0.35, sort = 'relevance', limit } = options
  const keys = resolveKeys(options.keys)
  const typoMinScore = Math.min(Math.max(typoThreshold, 0), 1)

  const entries: FuzzySearchEntry<T>[] = list.map((item, index) => {
    const values = keys.map(key => toText(key.get(item)))

    return {
      item,
      index,
      values,
      prepared: values.map(value => fuzzysort.prepare(value)),
      normalized: values.map(value => normalizeString(value)),
    }
  })

  function finish(results: FuzzySearchResult<T>[]) {
    const sorted = sort === 'original'
      ? results.sort((a, b) => a.index - b.index)
      : results.sort((a, b) => b.score - a.score || a.index - b.index)

    return limit === undefined
      ? sorted
      : sorted.slice(0, limit)
  }

  function getTypoMatch(entry: FuzzySearchEntry<T>, query: string): FuzzySearchResult<T> | undefined {
    let best: FuzzySearchResult<T> | undefined

    for (const [keyIndex, value] of entry.normalized.entries()) {
      if (!value) {
        continue
      }

      const similarity = value.includes(query)
        ? 1
        : getMatchingScore(value, query)

      if (similarity < typoMinScore) {
        continue
      }

      const score = similarity * TYPO_SCORE_FACTOR * keys[keyIndex]!.weight

      if (!best || score > best.score) {
        best = {
          item: entry.item,
          index: entry.index,
          score,
          matches: [
            { key: keys[keyIndex]!.name, value: entry.values[keyIndex]!, indexes: [] },
          ],
        }
      }
    }

    return best
  }

  /**
   * Search the indexed list
   * @param query The text typed by the user, an empty query returns every item in the order of the list
   * @returns The matching items with their score and the matched characters
   */
  function search(query: string): FuzzySearchResult<T>[] {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return finish(entries.map(({ item, index }) => ({ item, index, score: 1, matches: [] })))
    }

    const fuzzyResults = fuzzysort.go(trimmedQuery, entries, {
      keys: keys.map((_, keyIndex) => (entry: FuzzySearchEntry<T>) => entry.prepared[keyIndex]),
      threshold: 0,
      limit: 0,
      scoreFn: result => Math.max(...result.map((keyResult, keyIndex) => keyResult.score * keys[keyIndex]!.weight)),
    })

    const normalizedQuery = normalizeString(trimmedQuery)
    const found = new Set<number>()
    const results: FuzzySearchResult<T>[] = []

    for (const result of fuzzyResults) {
      const entry = result.obj
      const matches = result
        .map((keyResult, keyIndex) => ({ keyResult, keyIndex }))
        .filter(({ keyResult }) => keyResult.score > 0)
        .sort((a, b) => b.keyResult.score - a.keyResult.score)
        .map(({ keyResult, keyIndex }) => ({
          key: keys[keyIndex]!.name,
          value: entry.values[keyIndex]!,
          indexes: [...keyResult.indexes].sort((a, b) => a - b),
        }))
      const bestMatch = matches[0]!
      const isStrong = result.score >= minScore || (trimmedQuery.length >= MIN_SCATTERED_QUERY_LENGTH && isWordStart(bestMatch.value, bestMatch.indexes[0]!))
      const match = isStrong
        ? {
            item: entry.item,
            index: entry.index,
            score: result.score,
            matches,
          }
        : getTypoMatch(entry, normalizedQuery)

      if (match) {
        found.add(entry.index)
        results.push(match)
      }
    }

    for (const entry of entries) {
      if (found.has(entry.index)) {
        continue
      }

      const typoMatch = getTypoMatch(entry, normalizedQuery)

      if (typoMatch) {
        results.push(typoMatch)
      }
    }

    return finish(results)
  }

  return { search }
}

/**
 * Fuzzy search in a list: see `createFuzzySearch`, which indexes the list once for repeated searches
 * @param list The items to search in
 * @param query The text typed by the user
 * @param options The keys, the typo tolerance and the order of the results
 * @returns The matching items with their score and the matched characters, the best first
 * @example
 * ```ts
 * fuzzySearch(['France', 'Germany', 'Spain'], 'frnc') // [{ item: 'France', index: 0, score: 0.6, matches: [...] }]
 * fuzzySearch(users, 'jo', { keys: ['name', { key: 'email', weight: 0.5 }] })
 * ```
 */
export function fuzzySearch<T>(list: readonly T[], query: string, options?: FuzzySearchOptions<T>): FuzzySearchResult<T>[] {
  return createFuzzySearch(list, options).search(query)
}

/**
 * Split a text into matched and unmatched segments, to highlight the matched characters without `v-html`
 * @param text The value of a match (`FuzzySearchMatch.value`)
 * @param indexes The matched indexes (`FuzzySearchMatch.indexes`)
 * @returns The segments of the text, in order
 * @example
 * ```ts
 * highlightMatches('France', [0, 1]) // [{ text: 'Fr', match: true }, { text: 'ance', match: false }]
 * ```
 */
export function highlightMatches(text: string, indexes: readonly number[]): FuzzySearchSegment[] {
  const matched = new Set(indexes)
  const segments: FuzzySearchSegment[] = []

  for (let index = 0; index < text.length; index++) {
    const char = text[index]!
    const match = matched.has(index)
    const last = segments.at(-1)

    if (last && last.match === match) {
      last.text += char
    }
    else {
      segments.push({ text: char, match })
    }
  }

  return segments
}
