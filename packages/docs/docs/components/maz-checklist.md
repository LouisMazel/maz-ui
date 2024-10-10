---
title: MazChecklist
description: MazChecklist is a standalone component that allows creating a checklist with integrated search functionality. It provides a flexible and customizable user interface for selecting multiple items from a list of options. The component supports real-time search, color customization, and displays messages when no results are found.
lastUpdated: false
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Usage

<ComponentDemo>

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
      autoFocus: true,
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
        autoFocus: true,
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
    import MazChecklist from 'maz-ui/components/MazChecklist'
    import { ref } from 'vue'
    import { useLanguageDisplayNames } from 'maz-ui'

    const query = ref<string>()
    const languages = ref<string[]>()
    const languagesOptions = useLanguageDisplayNames('en-US').getLanguageDisplayNamesForIsoCodes().value.map(({ code, language }) => ({
      label: language,
      value: code,
    }))
  </script>
  ```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-checklist.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useLanguageDisplayNames } from 'maz-ui'
  const query = ref()
  const languages = ref<string[]>()
  const languagesOptions = useLanguageDisplayNames('en-US').getLanguageDisplayNamesForIsoCodes().value.map(({ code, language }) => ({
    label: language,
    value: code,
  }))
</script>
