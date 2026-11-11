---
title: useFuzzySearch
description: Reactive fuzzy search in a list - prefixes, words in any order, initials, typos and accents, the best matches first, with the matched characters to highlight them.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The list is indexed when it changes, and searched when the query changes. The matching is the one of the [fuzzySearch](./../ecosystem/utils/fuzzy-search.md) helper of `@maz-ui/utils`.

## Usage

<ComponentDemo>
  <MazInput v-model="query" label="Search a country" class="maz:mb-4" />

  <ul class="maz:m-0! maz:list-none maz:p-0!">
    <li v-for="result in results" :key="result.item.code" class="maz:m-0!">
      <template v-for="(segment, index) in getSegments(result)" :key="index">
        <mark v-if="segment.match" class="maz:bg-transparent maz:font-semibold maz:text-primary">{{ segment.text }}</mark>
        <template v-else>{{ segment.text }}</template>
      </template>
      <span class="maz:text-muted"> ({{ result.item.code }}, score {{ result.score.toFixed(2) }})</span>
    </li>
  </ul>

<template #code>

```vue
<script lang="ts" setup>
import type { FuzzySearchResult } from '@maz-ui/utils/helpers/fuzzySearch'
import { highlightMatches } from '@maz-ui/utils/helpers/fuzzySearch'
import { useFuzzySearch } from 'maz-ui/composables/useFuzzySearch'
import { ref } from 'vue'

const countries = [
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  // ...
]

const query = ref('')

const { results } = useFuzzySearch(countries, query, {
  keys: ['name', { key: 'code', weight: 0.8 }],
  limit: 8,
})

function getSegments(result: FuzzySearchResult<typeof countries[number]>) {
  const match = result.matches.find(item => item.key === 'name')

  return highlightMatches(result.item.name, match?.indexes ?? [])
}
</script>

<template>
  <MazInput v-model="query" label="Search a country" />

  <ul>
    <li v-for="result in results" :key="result.item.code">
      <template v-for="(segment, index) in getSegments(result)" :key="index">
        <mark v-if="segment.match" class="bg-transparent font-semibold text-primary">{{ segment.text }}</mark>
        <template v-else>{{ segment.text }}</template>
      </template>
    </li>
  </ul>
</template>
```

  </template>
</ComponentDemo>

Try `nwz`, `kingdom united`, `germny` or `cote`.

## Debounce

With a big list, `debounce` waits for the end of the typing: `isPending` is `true` meanwhile, the previous results stay displayed.

```ts
const { items, isPending } = useFuzzySearch(products, query, {
  keys: ['title', { key: 'description', weight: 0.5 }],
  debounce: 200,
})
```

## Reactive options

The list, the query and the options accept refs and getters.

```ts
const typoThreshold = ref(0.75)

const { items } = useFuzzySearch(() => store.users, query, () => ({
  keys: ['name', 'email'],
  typoThreshold: typoThreshold.value,
}))
```

## API

```ts
function useFuzzySearch<T>(
  list: MaybeRefOrGetter<readonly T[] | null | undefined>,
  query: MaybeRefOrGetter<string | null | undefined>,
  options?: MaybeRefOrGetter<UseFuzzySearchOptions<T>>,
): {
  /** The results: item, index, score, matched keys and characters */
  results: ComputedRef<FuzzySearchResult<T>[]>
  /** The matching items */
  items: ComputedRef<T[]>
  /** `true` while the debounce runs */
  isPending: Ref<boolean>
}
```

An empty query returns every item, in the order of the list.

### Options

The options of [fuzzySearch](./../ecosystem/utils/fuzzy-search.md#options) (`keys`, `typoThreshold`, `minScore`, `sort`, `limit`), and:

| Option     | Type     | Default | Description                                                     |
| ---------- | -------- | ------- | --------------------------------------------------------------- |
| `debounce` | `number` | `0`     | Delay in ms between the last change of the query and the search |

<script lang="ts" setup>
  import { highlightMatches } from '@maz-ui/utils/helpers/fuzzySearch'
  import { useFuzzySearch } from 'maz-ui/composables/useFuzzySearch'
  import { ref } from 'vue'

  const countries = [
    { code: 'FR', name: 'France' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'DE', name: 'Germany' },
    { code: 'GR', name: 'Greece' },
    { code: 'CI', name: 'Côte d’Ivoire' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'GN', name: 'Guinea' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'AE', name: 'United Arab Emirates' },
  ]

  const query = ref('')

  const { results } = useFuzzySearch(countries, query, {
    keys: ['name', { key: 'code', weight: 0.8 }],
    limit: 8,
  })

  function getSegments(result) {
    const match = result.matches.find(item => item.key === 'name')

    return highlightMatches(result.item.name, match?.indexes ?? [])
  }
</script>
