---
title: useStringMatching
description: Efficient composable for string matching tasks, utilizing Levenshtein distance calculation. Simplify comparison operations with minimal setup. Enhance text similarity checks effortlessly.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-items-start maz-flex-wrap maz-mb-4">
    <MazInput v-model="string1" label="Enter first string" />
    <MazInput v-model="string2" label="Enter second string" />
  </div>

  <p class="!maz-mb-1">
    <b>isMatching:</b> {{ isMatching }}
  </p>
  <p class="!maz-my-0">
    <b>score:</b> {{ score }}
  </p>

  <template #code>

  ```vue
  <template>
    <MazInput v-model="string1" label="Enter first string" />
    <MazInput v-model="string2" label="Enter second string" />

    <p>
      <b>isMatching:</b> {{ isMatching }}
    </p>
    <p>
      <b>score:</b> {{ score }}
    </p>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { useStringMatching } from 'maz-ui/composables'

    const string1 = ref<string>('maz-ui')
    const string2 = ref<string>('màéz-uiok')

    const { score, isMatching } = useStringMatching(string1, string2)
  </script>
  ```

  </template>

</ComponentDemo>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useStringMatching } from 'maz-ui/src/composables/useStringMatching'

  const string1 = ref<string>('maz-ui')
  const string2 = ref<string>('méz-ui')

  const { score, isMatching } = useStringMatching(string1, string2, 0.75)
</script>
