---
title: MazInputAutocomplete
description: MazInputAutocomplete is a text input suggesting values while typing, from a local list (fuzzy search with typo tolerance) or from an async source (an API), with keyboard navigation, highlight of the matches and the ARIA combobox pattern.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

Unlike `MazSelect`, the value is the text typed: a suggestion fills the input, and any other text stays allowed. `v-model:selected` gives the chosen suggestion (`undefined` once the text is edited).

## Basic usage

The `items` are searched with [fuzzySearch](./../ecosystem/utils/fuzzy-search.md): prefixes, words in any order, initials ("nwz"), typos ("Franse"), accents and case. The best matches come first, the matched characters are highlighted.

<ComponentDemo>
  <MazInputAutocomplete
    v-model="country"
    v-model:selected="selectedCountry"
    label="Country"
    :items="countries"
    :limit="8"
    block
  />

  <p class="maz:mt-4! maz:mb-0!">
    <b>Text:</b> {{ country || 'empty' }}<br>
    <b>Selected:</b> {{ selectedCountry ? `${selectedCountry.label} (${selectedCountry.value})` : 'none' }}
  </p>

<template #code>

```vue
<script lang="ts" setup>
import MazInputAutocomplete from 'maz-ui/components/MazInputAutocomplete'
import { useDisplayNames } from 'maz-ui/composables/useDisplayNames'
import { ref } from 'vue'

interface Country {
  label: string
  value: string
}

const countries: Country[] = useDisplayNames('en-US')
  .getAllDisplayNames({ type: 'region' })
  .value
  .map(({ code, name }) => ({ label: name, value: code }))

const country = ref('')
const selectedCountry = ref<Country>()
</script>

<template>
  <MazInputAutocomplete
    v-model="country"
    v-model:selected="selectedCountry"
    label="Country"
    :items="countries"
    :limit="8"
    block
  />
</template>
```

  </template>
</ComponentDemo>

## Items

The `items` can be strings, numbers or objects. For objects, `item-label` gives the text (key or function, default `label`) and `item-value` the identity used to find the selected suggestion (default `value`).

`search-keys` changes the searched keys, with their weight (default: the label).

```vue
<MazInputAutocomplete
  v-model="user"
  label="User"
  :items="users"
  :item-label="user => `${user.firstName} ${user.lastName}`"
  item-value="id"
  :search-keys="[
    user => `${user.firstName} ${user.lastName}`,
    { key: 'email', weight: 0.6 },
  ]"
/>
```

`search-threshold` is the tolerance to typos: the minimal similarity (from 0 to 1) of a whole value with the query. `1` disables it (default `0.75`).

## Async source

`source` loads the suggestions of a query: an API, a database. It is called after `debounce` ms (default `300`), with an `AbortSignal` aborted when a new query is typed, and its results are displayed in their order (the matched characters are still highlighted). The input shows a loader meanwhile.

<ComponentDemo>
  <MazInputAutocomplete
    v-model="city"
    label="City"
    :source="searchCities"
    :min-chars="2"
    block
  >
    <template #item="{ item, segments }">
      <span class="maz:flex maz:w-full maz:items-center maz:justify-between maz:gap-2">
        <span>
          <template v-for="(segment, index) in segments" :key="index">
            <b v-if="segment.match">{{ segment.text }}</b>
            <template v-else>{{ segment.text }}</template>
          </template>
        </span>
        <span class="maz:text-muted">{{ item.country }}</span>
      </span>
    </template>
  </MazInputAutocomplete>

<template #code>

```vue
<script lang="ts" setup>
import type { MazInputAutocompleteSourceContext } from 'maz-ui/components/MazInputAutocomplete'
import MazInputAutocomplete from 'maz-ui/components/MazInputAutocomplete'
import { ref } from 'vue'

interface City {
  label: string
  value: string
  country: string
}

const city = ref('')

async function searchCities(query: string, { signal }: MazInputAutocompleteSourceContext) {
  const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`, { signal })

  return response.json() as Promise<City[]>
}
</script>

<template>
  <MazInputAutocomplete
    v-model="city"
    label="City"
    :source="searchCities"
    :min-chars="2"
    block
  >
    <template #item="{ item, segments }">
      <span class="flex w-full items-center justify-between gap-2">
        <span>
          <template v-for="(segment, index) in segments" :key="index">
            <b v-if="segment.match">{{ segment.text }}</b>
            <template v-else>{{ segment.text }}</template>
          </template>
        </span>
        <span class="text-muted">{{ item.country }}</span>
      </span>
    </template>
  </MazInputAutocomplete>
</template>
```

  </template>
</ComponentDemo>

When the `source` throws, the `error` slot (with a `retry` function) is displayed and the `error` event is emitted.

## Open on focus

`open-on-focus` opens the suggestions on focus. With `min-chars` at `0`, every item is listed before typing (or the `source` is called with an empty query).

<ComponentDemo>
  <MazInputAutocomplete
    v-model="fruit"
    label="Fruit"
    :items="fruits"
    :min-chars="0"
    open-on-focus
    block
  />

<template #code>

```vue
<MazInputAutocomplete
  v-model="fruit"
  label="Fruit"
  :items="['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Kiwi', 'Mango', 'Orange', 'Peach', 'Pear']"
  :min-chars="0"
  open-on-focus
/>
```

  </template>
</ComponentDemo>

## Accessibility

The input is a [combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (`aria-autocomplete="list"`): the focus stays in it, `aria-activedescendant` points to the active suggestion, and the number of results is announced to the screen readers.

| Key                    | Action                                                       |
| ---------------------- | ------------------------------------------------------------ |
| `ArrowDown`, `ArrowUp` | Open the list, move the active suggestion (`Alt` only opens) |
| `Enter`                | Choose the active suggestion, or the first one               |
| `Escape`               | Close the list, a second time clear the input                |
| `Tab`                  | Close the list and move the focus                            |

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

<!--@include: ./../../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../../.vitepress/generated-docs/maz-input-autocomplete.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useDisplayNames } from 'maz-ui/composables/useDisplayNames'

  const countries = useDisplayNames('en-US').getAllDisplayNames({ type: 'region' }).value.map(({ code, name }) => ({
    label: name,
    value: code,
  }))

  const country = ref('')
  const selectedCountry = ref()

  const cities = [
    { label: 'Paris', value: 'paris', country: 'France' },
    { label: 'Lyon', value: 'lyon', country: 'France' },
    { label: 'Marseille', value: 'marseille', country: 'France' },
    { label: 'Berlin', value: 'berlin', country: 'Germany' },
    { label: 'Munich', value: 'munich', country: 'Germany' },
    { label: 'Madrid', value: 'madrid', country: 'Spain' },
    { label: 'Barcelona', value: 'barcelona', country: 'Spain' },
    { label: 'Lisbon', value: 'lisbon', country: 'Portugal' },
    { label: 'London', value: 'london', country: 'United Kingdom' },
    { label: 'Manchester', value: 'manchester', country: 'United Kingdom' },
    { label: 'Rome', value: 'rome', country: 'Italy' },
    { label: 'Milan', value: 'milan', country: 'Italy' },
    { label: 'New York', value: 'new-york', country: 'United States' },
    { label: 'San Francisco', value: 'san-francisco', country: 'United States' },
    { label: 'Tokyo', value: 'tokyo', country: 'Japan' },
  ]

  const city = ref('')

  function searchCities(query, { signal }) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve(cities.filter(item => item.label.toLowerCase().includes(query.toLowerCase())))
      }, 600)

      signal.addEventListener('abort', () => {
        clearTimeout(timeout)
        reject(signal.reason)
      })
    })
  }

  const fruit = ref('')
  const fruits = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Kiwi', 'Mango', 'Orange', 'Peach', 'Pear']
</script>
