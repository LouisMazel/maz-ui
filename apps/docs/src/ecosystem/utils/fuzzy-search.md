---
title: fuzzySearch
description: Fuzzy search in a list of strings or objects - prefixes, words in any order, initials, typos, accents and case, with relevance order, key weights and highlight.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It powers the search of `MazSelect`, `MazChecklist` and `MazInputAutocomplete`, and the [useFuzzySearch](./../../composables/use-fuzzy-search.md) composable. Built on [fuzzysort](https://github.com/farzher/fuzzysort), with a typo tolerance on top.

## Usage

```ts
import { fuzzySearch } from '@maz-ui/utils/helpers/fuzzySearch'

const countries = [
  { code: 'FR', name: 'France' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'GB', name: 'United Kingdom' },
]

fuzzySearch(countries, 'kingdom united', { keys: ['name'] }).map(result => result.item.name)
// → ['United Kingdom']

fuzzySearch(countries, 'nwz', { keys: ['name'] }).map(result => result.item.name)
// → ['New Zealand']

fuzzySearch(countries, 'Franse', { keys: ['name'] }).map(result => result.item.name)
// → ['France'] (typo)

fuzzySearch(['apple', 'banana', 'cherry'], 'ban').map(result => result.item)
// → ['banana']
```

What is found:

- the prefixes and the substrings: `fr` → `France`, `French Guiana`, `South Africa`
- the words in any order: `kingdom united` → `United Kingdom`
- the letters starting the words, from 3 letters: `nwz` → `New Zealand` (shorter scattered matches are ignored, to avoid noise)
- the typos, below the other matches: `Franse` → `France`, `germny` → `Germany`
- whatever the case and the accents, in every script: `cote` → `Côte d’Ivoire`, `strasse` → `Straße`

## Reuse the index

`createFuzzySearch` prepares the list once: use it when the same list is searched several times (search as you type).

```ts
import { createFuzzySearch } from '@maz-ui/utils/helpers/fuzzySearch'

const { search } = createFuzzySearch(users, {
  keys: [
    'name',
    { key: 'email', weight: 0.5 },
    { key: user => user.team.name, name: 'team' },
  ],
})

search('ada')
search('ada lov')
```

## Highlight the matches

Each result lists the keys that match the query, with the indexes of the matched characters in the original value. `highlightMatches` splits a value into the parts matching or not.

```ts
import { fuzzySearch, highlightMatches } from '@maz-ui/utils/helpers/fuzzySearch'

const [result] = fuzzySearch(countries, 'fra', { keys: ['name'] })
const [match] = result.matches
// → { key: 'name', value: 'France', indexes: [0, 1, 2] }

highlightMatches(match.value, match.indexes)
// → [{ text: 'Fra', match: true }, { text: 'nce', match: false }]
```

```vue
<template>
  <span>
    <template v-for="segment in highlightMatches(match.value, match.indexes)" :key="segment.text">
      <mark v-if="segment.match">{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
```

A typo match has no index (`indexes: []`).

## API

```ts
function fuzzySearch<T>(list: readonly T[], query: string, options?: FuzzySearchOptions<T>): FuzzySearchResult<T>[]

function createFuzzySearch<T>(list: readonly T[], options?: FuzzySearchOptions<T>): {
  search: (query: string) => FuzzySearchResult<T>[]
}

function highlightMatches(text: string, indexes: readonly number[]): FuzzySearchSegment[]
```

An empty query returns every item, in the order of the list, with the score `1`.

### Options

| Option          | Type                          | Default       | Description                                                                                                       |
| --------------- | ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `keys`          | `FuzzySearchKey<T>[]`         | `undefined`   | The keys searched in the objects: a key name, a getter `(item) => value`, or `{ key, weight, name }`. Without keys, the items are searched as they are (strings, numbers, booleans) |
| `typoThreshold` | `number`                      | `0.75`        | Tolerance to typos: the minimal similarity (from 0 to 1) of a whole value with the query. `1` disables it          |
| `minScore`      | `number`                      | `0.35`        | Minimal score of a scattered match, below it the value is only kept as a typo match                              |
| `sort`          | `'relevance' \| 'original'`   | `'relevance'` | `relevance`: the best matches first (same score: the order of the list). `original`: the order of the list       |
| `limit`         | `number`                      | `undefined`   | Maximum number of results                                                                                         |

The `weight` of a key (from 0 to 1, default `1`) multiplies its score: the key with the best weighted score gives the score of the item.

### Types

```ts
interface FuzzySearchResult<T> {
  item: T
  /** Index of the item in the list */
  index: number
  /** From 0 to 1, 1 is an exact match */
  score: number
  /** The keys matching the query, the best first */
  matches: FuzzySearchMatch[]
}

interface FuzzySearchMatch {
  /** The name of the key (key name, `name` of the key, or `key-<index>` for a getter) */
  key: string
  value: string
  /** Indexes of the matched characters in `value` */
  indexes: number[]
}

interface FuzzySearchSegment {
  text: string
  match: boolean
}
```

## Similarity helpers

The typo tolerance uses the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance), also exported:

```ts
import { getMatchingScore, isStringMatching, levenshteinDistance } from '@maz-ui/utils/helpers/stringMatching'

levenshteinDistance('kitten', 'sitting') // → 3
getMatchingScore('maz-ui', 'maz-uo') // → 0.83 (1 - distance / longest length)
isStringMatching('maz-ui', 'maz-uo') // → true (score >= 0.75)
isStringMatching('maz-ui', 'maz-uo', 0.9) // → false
```

They compare the whole strings, without normalization: use `fuzzySearch` to search in a list.
