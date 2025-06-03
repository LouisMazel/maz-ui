---
title: MazChecklist
description: MazChecklist is a standalone component that allows creating a checklist with integrated search functionality. It provides a flexible and customizable user interface for selecting multiple items from a list of options. The component supports real-time search, color customization, and displays messages when no results are found.
lastUpdated: false
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>

  Selected languages: {{ languages || 'none' }}

  query value: {{ query || 'none' }}

  <br />

  <MazChecklist
    v-model="languages"
    v-model:query="query"
    title="Select your languages"
    :search="{
      enabled: true,
      placeholder: 'Search a language',
      debounce: 300,
      autoFocus: false,
      size: 'sm'
    }"
    :items="languagesOptions"
    class="maz-max-h-80"
  >
    <template #item="{ item }">
      <div class="maz-flex maz-w-full maz-items-center maz-justify-between maz-gap-2">
        <span class="maz-capitalize">{{ item.label }}</span>
        <MazBadge color="theme" outline>
          {{ item.value }}
        </MazBadge>
      </div>
    </template>
  </MazChecklist>

  <template #code>

  ```vue
  <template>
    Selected languages: {{ languages || 'none' }}

    <br />

    <MazChecklist
      v-model="languages"
      v-model:query="query"
      title="Select your languages"
      :search="{
        enabled: true,
        placeholder: 'Search a language',
        debounce: 300,
        autoFocus: false,
        size: 'sm'
      }"
      :items="languagesOptions"
      class="maz-h-80"
    >
      <template #item="{ item }">
        <div class="maz-flex maz-w-full maz-items-center maz-justify-between maz-gap-2">
          <span class="maz-capitalize">{{ item.label }}</span>
          <MazBadge color="theme" outline>
            {{ item.value }}
          </MazBadge>
        </div>
      </template>
    </MazChecklist>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { MazChecklist } from 'maz-ui/components'
    import { useLanguageDisplayNames } from 'maz-ui/composables'

    const query = ref<string>()
    const languages = ref<string[]>()
    const languagesOptions = useLanguageDisplayNames('en-US').getAllLanguageDisplayNames().value.map(({ code, language }) => ({
      label: language,
      value: code,
    }))
  </script>
  ```

  </template>
</ComponentDemo>

## Custom search function

You can replace the default search function by providing a custom search function.

<ComponentDemo>
  <MazChecklist
    v-model="languages"
    v-model:query="query"
    :search="{
      enabled: true,
      placeholder: 'Search a language',
    }"
    :items="languagesOptions"
    :search-function="customSearchFunction"
    class="maz-max-h-80"
  />

  <template #code>

  ```vue
  <template>
    <MazChecklist
      v-model="languages"
      v-model:query="query"
      :search="{
        enabled: true,
        placeholder: 'Search a language',
      }"
      :items="languagesOptions"
      :search-function="customSearchFunction"
      class="maz-max-h-80"
    />
  </template>

  <script lang="ts" setup>
    const query = ref()
    const languages = ref<string[]>()
    const languagesOptions = ref([])
    languagesOptions.value = useLanguageDisplayNames('en-US').getAllLanguageDisplayNames().value.map(({ code, language }) => ({
      label: language,
      value: code,
    }))

    function customSearchFunction(query: string, items: typeof languagesOptions) {
      return items.filter(
        ({ label, value }) =>
          label.toLowerCase().includes(query.toLowerCase()) ||
          value.toLowerCase().includes(query.toLowerCase()),
      )
    }
  </script>
  ```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-checklist.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useLanguageDisplayNames } from 'maz-ui/src/composables/useLanguageDisplayNames'
  const query = ref()
  const languages = ref<string[]>()
  const languagesOptions = ref([])
  languagesOptions.value = useLanguageDisplayNames('en-US').getAllLanguageDisplayNames().value.map(({ code, language }) => ({
    label: language,
    value: code,
  }))

  function customSearchFunction(query: string, items: typeof languagesOptions) {
    return items.filter(
      ({ label, value }) =>
        label.toLowerCase().includes(query.toLowerCase()) ||
        value.toLowerCase().includes(query.toLowerCase()),
    )
  }
</script>
