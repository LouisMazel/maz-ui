---
title: MazTextarea
description: MazTextarea is a standalone component that replaces the standard html textarea input with a beautiful design system. Many options like colors, disabled, error, warning, success and error messages are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: info
This component uses the native CSS `field-sizing: content` property for autogrow — the textarea expands automatically as the user types, with zero JavaScript overhead.
:::

## Basic usage

<ComponentDemo expanded>
  <MazTextarea
    v-model="mainValue"
    name="comment"
    label="Enter your comment"
  />

<template #code>

```vue
<script lang="ts" setup>
import MazTextarea from 'maz-ui/components/MazTextarea'
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <MazTextarea
    v-model="value"
    name="comment"
    label="Enter your comment"
  />
</template>
```

  </template>
</ComponentDemo>

## With top-label

You can use the `top-label` attribute to display a top label above the textarea.

<ComponentDemo>
  <MazTextarea
    v-model="value"
    top-label="Your message"
    placeholder="Type your message..."
  />

<template #code>

```html
<MazTextarea
  v-model="value"
  top-label="Your message"
  placeholder="Type your message..."
/>
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
      <span class="maz-ms-2">
        The custom label
      </span>
    </template>
    <template #append>
      <MazBtn icon="paper-airplane" size="sm" @click="sendMessage" />
    </template>
  </MazTextarea>

<template #code>

```vue
<script lang="ts" setup>
import { useToast } from 'maz-ui/composables'
import { ref } from 'vue'

const value = ref<string>()

const toast = useToast()

function sendMessage() {
  toast.success('Message sent', {
    position: 'top-right',
  })
  value.value = ''
}
</script>

<template>
  <MazTextarea
    v-model="value"
    name="comment"
  >
    <template #label>
      <MazIcon name="envelope" class="maz-text-xl" />
      <span class="maz-ms-2">
        The custom label
      </span>
    </template>
    <template #append>
      <MazBtn icon="paper-airplane" size="sm" @click="sendMessage" />
    </template>
  </MazTextarea>
</template>
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
    <hr class="maz-my-4">
    <MazTextarea
      v-model="value"
      name="comment"
      top-label="This is a label"
      hint="This is a hint message"
    />
    <MazTextarea
      v-model="value"
      name="comment"
      top-label="This is a label"
      hint="This is a hint message"
      error
    />
    <MazTextarea
      v-model="value"
      name="comment"
      top-label="This is a label"
      hint="This is a hint message"
      success
    />
    <MazTextarea
      v-model="value"
      name="comment"
      top-label="This is a label"
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
  <hr class="maz-my-4">
  <MazTextarea
    v-model="value"
    name="comment"
    top-label="This is a label"
    hint="This is a hint message"
  />
  <MazTextarea
    v-model="value"
    name="comment"
    top-label="This is a label"
    hint="This is a hint message"
    error
  />
  <MazTextarea
    v-model="value"
    name="comment"
    top-label="This is a label"
    hint="This is a hint message"
    success
  />
  <MazTextarea
    v-model="value"
    name="comment"
    top-label="This is a label"
    hint="This is a hint message"
    warning
  />
</template>
```

  </template>
</ComponentDemo>

## Disable autogrow

By default, the textarea automatically expands as the user types. You can disable this behavior with the `autogrow` prop set to `false` — the textarea will then have a fixed height with a manual resize handle.

<ComponentDemo>
  <MazTextarea
    v-model="value"
    name="comment"
    label="Fixed height textarea"
    :autogrow="false"
  />

<template #code>

```html
<MazTextarea v-model="value" name="comment" label="Fixed height textarea" :autogrow="false" />
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

```html
<MazTextarea v-model="value" name="comment" label="This is a label" disabled />
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-textarea.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useToast } from 'maz-ui/src/composables/useToast'

  const mainValue = ref()
  const value = ref()

  const toast = useToast()

  function sendMessage() {
    toast.success('Message sent', {
      position: 'top-right',
    })
    value.value = ''
  }
</script>
