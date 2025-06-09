---
title: useLanguageDisplayNames
description: useLanguageDisplayNames is a Vue 3 composable that provides functions to work with language display names based on ISO codes. It leverages the Intl.DisplayNames API to fetch and format language names. This composable is useful for applications that need to display language names in a user-friendly format based on different locales.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useLanguageDisplayNames` allows you to fetch and format language names based on ISO codes using the `Intl.DisplayNames` API. This composable is particularly useful for applications that need to display language names in a user-friendly format based on different locales.

::: warning

Depending on your environment (client or node server) and the browser you are using, the `Intl.DisplayNames` results can be differents (e.g, Firefox and Chrome can return different results).

:::

## Key Features

- Fetches language display names based on ISO codes
- Supports multiple locales
- Provides functions to get display names for all possible languages
- Handles errors gracefully and provides fallback values

## Basic Usage

To see `useLanguageDisplayNames` in action, you can try out the following demo. This demo showcases how to use the composable to fetch and display language names dynamically based on user input.

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
  <template>
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
  </template>

  <script lang="ts" setup>
    import { ref, computed } from 'vue'
    import { useLanguageDisplayNames } from 'maz-ui/composables/useLanguageDisplayNames'

    const selectedLocale = ref('en-US')
    const code = ref('')

    const { getLanguageDisplayName, getAllLanguageDisplayNames } = useLanguageDisplayNames(selectedLocale)

    const languageDisplayName = getLanguageDisplayName({ code })

    const localeOptions = computed(() => getAllLanguageDisplayNames('en-US').value.map(({ language, code }) => ({
      label: `${language} (${code})`,
      value: code
    })))
  </script>

  ```

  </template>

</ComponentDemo>

In this example, the `useLanguageDisplayNames` composable is used to fetch and display the language name based on the selected locale and ISO code.

The returned value is reactive and will update automatically when the locale or ISO code changes if arguments are reactive (use ref or computed).

## Functions

`useLanguageDisplayNames` can take a locale and ISO code as arguments to avoid pass this value each time you call the function. It is useful when you need to fetch language display names based on the same locale.

It provides the following functions:

### `getLanguageDisplayName`

Fetches the display name of a language based on the provided locale and ISO code.

```ts
function getLanguageDisplayName(options: {
  locale?: MaybeRefOrGetter<string>,
  code?: MaybeRefOrGetter<string>
}): ComputedRef<string | undefined>
```

### `getAllLanguageDisplayNames`

Fetches the display names for all predefined ISO codes for a given locale.

```ts
function getAllLanguageDisplayNames(
  locale?: MaybeRefOrGetter<string>
): ComputedRef<{ language: string; code: string }[]>
```

## Notes

- The `useLanguageDisplayNames` composable is designed to be used with Vue 3.
- The composable functions return `ComputedRef` values, which are reactive and will update automatically when their dependencies change.
- Handle errors gracefully by providing fallback values when the display name cannot be fetched.
- The `Intl.DisplayNames` API is used internally to fetch and format the language names based on the provided locale and ISO code.
- The composable supports multiple locales, allowing you to fetch language names in different languages.
- Use the `getAllLanguageDisplayNames` function to fetch the display names for all predefined ISO codes for a given locale.

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useLanguageDisplayNames } from 'maz-ui/composables/useLanguageDisplayNames'

const selectedLocale = ref('fr-FR')
const code = ref('')

const { getLanguageDisplayName, getAllLanguageDisplayNames } = useLanguageDisplayNames(selectedLocale)

const languageDisplayName = getLanguageDisplayName({ code })

const localeOptions = computed(() => getAllLanguageDisplayNames('en-US').value.map(({ language, code }) => ({
  label: `${language} (${code})`,
  value: code
})))
</script>
