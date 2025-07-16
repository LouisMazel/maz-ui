---
title: useDisplayNames
description: useDisplayNames is a Vue 3 composable that provides functions to work with display names based on ISO codes. It leverages the Intl.DisplayNames API to fetch and format display names. This composable is useful for applications that need to display display names in a user-friendly format based on different locales.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useDisplayNames` allows you to fetch and format display names based on ISO codes using the `Intl.DisplayNames` API. This composable is particularly useful for applications that need to display display names in a user-friendly format based on different locales.

::: warning

Depending on your environment (client or node server) and the browser you are using, the `Intl.DisplayNames` results can be differents (e.g, Firefox and Chrome can return different results).

:::

## Key Features

- Fetches display names based on ISO codes
- Supports multiple locales
- Provides functions to get display names for all possible display names
- Handles errors gracefully and provides fallback values

## Basic Usage

To see `useDisplayNames` in action, you can try out the following demo. This demo showcases how to use the composable to fetch and display display names dynamically based on user input.

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
      :options="localeOptions"
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

const languageDisplayName = getDisplayName({ type: 'language', code })

const localeOptions = computed(() => getAllDisplayNames({ type: 'language' }).value.map(({ name, code }) => ({
  label: `${name} (${code})`,
  value: code
})))
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
    :options="localeOptions"
    search
  />
  <p>Translated Language: {{ languageDisplayName || 'undefined' }}</p>
</template>
```

  </template>

</ComponentDemo>

In this example, the `useDisplayNames` composable is used to fetch and display the language name based on the selected locale and ISO code.

The returned value is reactive and will update automatically when the locale or ISO code changes if arguments are reactive (use ref or computed).

## Functions

`useDisplayNames` can take a locale and ISO code as arguments to avoid pass this value each time you call the function. It is useful when you need to fetch language display names based on the same locale.

It provides the following functions:

### `getDisplayName`

Fetches the display name of a language based on the provided locale and ISO code.

```ts
function getDisplayName(options: {
  type: MaybeRefOrGetter<Intl.DisplayNamesOptions['type']>,
  locale?: MaybeRefOrGetter<string>
  code?: MaybeRefOrGetter<string>
}): ComputedRef<string | undefined>
```

### `getAllDisplayNames`

Fetches the display names for all predefined ISO codes for a given locale.

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
- The `Intl.DisplayNames` API is used internally to fetch and format the display names based on the provided locale and ISO code.
- The composable supports multiple locales, allowing you to fetch display names in different languages.
- Use the `getAllDisplayNames` function to fetch the display names for all predefined ISO codes for a given locale.

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useDisplayNames } from 'maz-ui/composables/useDisplayNames'

const selectedLocale = ref('fr-FR')
const code = ref('')

const { getDisplayName, getAllDisplayNames } = useDisplayNames(selectedLocale)

const languageDisplayName = getDisplayName({ type: 'language', code })

const localeOptions = computed(() => getAllDisplayNames({ type: 'language' }).value.map(({ name, code }) => ({
  label: `${name} (${code})`,
  value: code
})))
</script>
