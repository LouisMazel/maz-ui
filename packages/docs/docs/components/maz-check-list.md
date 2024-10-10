---
title: MazCheckList
description: MazCheckList is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazChecklist
    v-model="languages"
    title="Select your languages"
    :search="{
      enabled: true,
      placeholder: 'Search a language',
      debounce: 300,
      autoFocus: true,
    }"
    :items="languagesOptions"
  >
    <template #item="{ item }">
      <div class="flex w-full items-center justify-between">
        <span class="capitalize">{{ item.label }}</span>
        <MazBadge color="theme" outline>
          {{ item.value }}
        </MazBadge>
      </div>
    </template>
  </MazChecklist>

  <template #code>

  ```vue
  <template>
    <MazCheckList />
  </template>

  <script lang="ts" setup>
    import MazCheckList from 'maz-ui/components/MazCheckList'
  </script>
  ```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-check-list.doc.md-->

<script lang="ts" setup>
import { ref } from 'vue'
const languages = ref<string[]>([])
const languagesOptions = ref<{ label: string, value: string }[]>([])
</script>
