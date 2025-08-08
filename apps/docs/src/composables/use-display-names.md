---
title: useDisplayNames
description: useDisplayNames is a Vue 3 composable specialized in displaying localized country names (regions) and language names. It supports various code formats including ISO 639-1 (language codes), ISO 3166-1 (country codes), and BCP 47 (language tags), using the Intl.DisplayNames API for internationalization.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useDisplayNames` allows you to fetch and format localized country names and language names using the `Intl.DisplayNames` API. It supports multiple code formats (ISO 639-1, ISO 3166-1, BCP 47) and is particularly useful for applications that need to display human-readable country or language names based on different locales.

::: warning

Depending on your environment (client or node server) and the browser you are using, the `Intl.DisplayNames` results can be differents (e.g, Firefox and Chrome can return different results).

:::

## Key Features

- Displays localized country names (regions) and language names
- Supports multiple code formats: ISO 639-1 (language codes), ISO 3166-1 (country codes), and BCP 47 (language tags)  
- Works with any locale supported by the browser's Intl.DisplayNames API
- Provides functions to get individual names or bulk retrieve all available names
- Handles errors gracefully with fallback values
- Smart filtering and sorting options for comprehensive lists

## Basic Usage

To see `useDisplayNames` in action, you can try out the following demo. This demo showcases how to use the composable to fetch and display localized language names dynamically based on user input.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-items-start">
    <MazSelect
      v-model="selectedLocale"
      label="Select a locale"
      :maxListHeight="350"
      :options="[
        { value: 'en-US', label: 'English (en-US)' },
        { value: 'fr-FR', label: 'French (fr-FR)' },
        { value: 'es-ES', label: 'Spanish (es-ES)' },
        { value: 'zh-CN', label: 'Chinese (zh-CN)' },
        { value: 'de-DE', label: 'German (de-DE)' },
        { value: 'it-IT', label: 'Italian (it-IT)' },
        { value: 'ja-JP', label: 'Japanese (ja-JP)' },
        { value: 'ko-KR', label: 'Korean (ko-KR)' },
        { value: 'pt-BR', label: 'Portuguese (pt-BR)' },
        { value: 'ru-RU', label: 'Russian (ru-RU)' },
      ]"
      search
    />
    <MazSelect
      v-model="code"
      label="Select a language"
      :options="localeOptions?.map(({ name, code }) => ({
        label: `${name} (${code})`,
        value: code
      }))"
      search
    />
    <p>Translated Language: {{ languageDisplayName || 'undefined' }}</p>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDisplayNames } from 'maz-ui/composables/useDisplayNames'
import { computed, ref } from 'vue'

const selectedLocale = ref('en-US')
const code = ref('')

const { getDisplayName, getAllDisplayNames } = useDisplayNames(selectedLocale)

const languageDisplayName = getDisplayName(code, { type: 'language' })

const localeOptions = getAllDisplayNames({ type: 'language' })
</script>

<template>
  <MazSelect
    v-model="selectedLocale"
    label="Select a locale"
    :max-list-height="350"
    :options="[
      { value: 'en-US', label: 'English (en-US)' },
      { value: 'fr-FR', label: 'French (fr-FR)' },
      { value: 'es-ES', label: 'Spanish (es-ES)' },
      { value: 'zh-CN', label: 'Chinese (zh-CN)' },
      { value: 'de-DE', label: 'German (de-DE)' },
      { value: 'it-IT', label: 'Italian (it-IT)' },
      { value: 'ja-JP', label: 'Japanese (ja-JP)' },
      { value: 'ko-KR', label: 'Korean (ko-KR)' },
      { value: 'pt-BR', label: 'Portuguese (pt-BR)' },
      { value: 'ru-RU', label: 'Russian (ru-RU)' },
    ]"
    search
  />
  <MazSelect
    v-model="code"
    label="Select a language"
    :options="localeOptions?.map(({ name, code }) => ({
      label: `${name} (${code})`,
      value: code
    }))"
    search
  />
  <p>Translated Language: {{ languageDisplayName || 'undefined' }}</p>
</template>
```

  </template>

</ComponentDemo>

In this example, the `useDisplayNames` composable is used to fetch and display the language name based on the selected locale and language code (ISO 639-1 or BCP 47 format).

The returned value is reactive and will update automatically when the locale or language code changes if arguments are reactive (use ref or computed).

## Functions

`useDisplayNames` can take a locale as argument to avoid passing this value each time you call the functions. This is useful when you need to fetch multiple country or language names based on the same locale.

It provides the following functions:

### `getDisplayName`

Fetches the localized display name of a country (region) or language based on the provided locale and code (supports ISO 639-1, ISO 3166-1, and BCP 47 formats).

```ts
function getDisplayName(code: MaybeRefOrGetter<string>, options: {
  type: MaybeRefOrGetter<Intl.DisplayNamesOptions['type']>,
  locale?: MaybeRefOrGetter<string>
}): ComputedRef<string | undefined>
```

### `getAllDisplayNames`

Fetches the localized display names for all available countries (regions) or languages for a given locale. Supports filtering by code type (ISO 639-1, ISO 3166-1, BCP 47, or all).

```ts
function getAllDisplayNames(options: {
  type: MaybeRefOrGetter<Intl.DisplayNamesOptions['type']>,
  locale?: MaybeRefOrGetter<string>,
  codes?: MaybeRefOrGetter<string[]>,
  exclude?: MaybeRefOrGetter<string[]>,
  preferred?: MaybeRefOrGetter<string[]>,
  onlyIso?: MaybeRefOrGetter<boolean>,
  onlyBcp?: MaybeRefOrGetter<boolean>,
}): ComputedRef<{ name: string, code: string }[]>
```

## Notes

- The `useDisplayNames` composable is designed to be used with Vue 3.
- The composable functions return `ComputedRef` values, which are reactive and will update automatically when their dependencies change.
- Handle errors gracefully by providing fallback values when the display name cannot be fetched.
- The `Intl.DisplayNames` API is used internally to fetch and format the display names based on the provided locale and code.
- The composable supports multiple locales, allowing you to fetch country and language names in different languages.
- Use the `getAllDisplayNames` function to fetch comprehensive lists of countries or languages with advanced filtering options.
- Supports various code formats: ISO 639-1 (language codes like 'en', 'fr'), ISO 3166-1 (country codes like 'US', 'FR'), and BCP 47 (language tags like 'en-US', 'fr-FR').

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useDisplayNames } from 'maz-ui/src/composables/useDisplayNames.js'

const selectedLocale = ref('en-US')
const code = ref('fr-FR')

const { getDisplayName, getAllDisplayNames } = useDisplayNames(selectedLocale)

const languageDisplayName = getDisplayName(code, { type: 'language' })

const localeOptions = getAllDisplayNames({ type: 'language' })
</script>
