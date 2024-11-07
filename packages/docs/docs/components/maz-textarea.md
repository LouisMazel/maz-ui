---
title: MazTextarea
description: MazTextarea is a standalone component that replaces the standard html textarea input with a beautiful design system. Many options like colors, disabled, error, warning, success and error messages are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: info
This component has the "autogrow" feature, so when the user writes, the textarea expands automatically
:::

## Basic usage

<ComponentDemo expanded>
  <MazTextarea
    v-model="value"
    name="comment"
    label="Enter your comment"
  />

  <template #code>

```vue
<template>
  <MazTextarea
    v-model="value"
    name="comment"
    label="Enter your comment"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazTextarea from 'maz-ui/components/MazTextarea'

  const value = ref()
</script>
```

  </template>
</ComponentDemo>

## With label and append slots

You can use the `label` and `append` slots to customize the label and the append element.

<ComponentDemo>
  <MazTextarea
    v-model="value"
    name="comment"
  >
    <template #label>
      <MazIcon name="envelope" class="maz-text-xl" />
      <span class="maz-ml-2">
        The custom label
      </span>
    </template>
    <template #append>
      <MazBtn icon="paper-airplane" size="sm" @click="sendMessage" />
    </template>
  </MazTextarea>

  <template #code>

```html
<MazTextarea
  v-model="value"
  name="comment"
>
  <template #label>
    <MazIcon name="envelope" class="maz-text-xl" />
    <span class="maz-ml-2">
      The custom label
    </span>
  </template>
</MazTextarea>
```

  </template>
</ComponentDemo>

## With hint and state

You can use the `hint` attribute to display a hint message. This will replace the label.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazTextarea
      v-model="value"
      name="comment"
      label="This is a label"
      hint="This is a hint message"
    />
    <MazTextarea
      v-model="value"
      name="comment"
      label="This is a label"
      hint="This is a hint message"
      error
    />
    <MazTextarea
      v-model="value"
      name="comment"
      label="This is a label"
      hint="This is a hint message"
      success
    />
    <MazTextarea
      v-model="value"
      name="comment"
      label="This is a label"
      hint="This is a hint message"
      warning
    />
  </div>

  <template #code>

```vue
<template>
  <MazTextarea
    v-model="value"
    name="comment"
    label="This is a label"
    hint="This is a hint message"
  />
  <MazTextarea
    v-model="value"
    name="comment"
    label="This is a label"
    hint="This is a hint message"
    error
  />
  <MazTextarea
    v-model="value"
    name="comment"
    label="This is a label"
    hint="This is a hint message"
    success
  />
  <MazTextarea
    v-model="value"
    name="comment"
    label="This is a label"
    hint="This is a hint message"
    warning
  />
</template>
```

  </template>
</ComponentDemo>

## Disabled

<ComponentDemo>
  <MazTextarea
    v-model="value"
    name="comment"
    label="This is a label"
    disabled
  />

  <template #code>

```html disabled />
```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-textarea.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useToast } from 'maz-ui'

  const value = ref()

  const toast = useToast()

  function sendMessage() {
    toast.success('Message sent', {
      position: 'top-right',
    })
    value.value = ''
  }
</script>
