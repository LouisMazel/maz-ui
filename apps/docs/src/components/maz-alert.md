---
title: MazAlert
description: MazAlert is an accessible component for displaying contextual feedback messages like success, warning, error, or informational notifications with customizable colors, icons, and styling options
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazAlert title="Information" content="This is an informational alert message." />

  <template #code>

```vue
<template>
  <MazAlert title="Information" content="This is an informational alert message." />
</template>

<script lang="ts" setup>
  import MazAlert from 'maz-ui/components/MazAlert'
</script>
```

  </template>
</ComponentDemo>

## Variants

MazAlert supports two visual variants: `soft` (default) with transparent background, and `solid` with full color background.

### Soft variant (default)

The soft variant uses a transparent background with colored text.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert color="info" variant="soft" title="Soft Info" content="This is the default soft variant with transparent background." />
    <MazAlert color="success" variant="soft" title="Soft Success" content="Subtle and non-intrusive style." />
    <MazAlert color="destructive" variant="soft" title="Soft Error" content="Easy on the eyes while still noticeable." />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="info" variant="soft" title="Soft Info" content="..." />
  <MazAlert color="success" variant="soft" title="Soft Success" content="..." />
  <MazAlert color="destructive" variant="soft" title="Soft Error" content="..." />
</template>
```

  </template>
</ComponentDemo>

### Solid variant

The solid variant uses the full color as background with contrasting text.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert color="info" variant="solid" title="Solid Info" content="Full color background for high visibility." />
    <MazAlert color="success" variant="solid" title="Solid Success" content="Great for important notifications." />
    <MazAlert color="destructive" variant="solid" title="Solid Error" content="Impossible to miss critical alerts." />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="info" variant="solid" title="Solid Info" content="..." />
  <MazAlert color="success" variant="solid" title="Solid Success" content="..." />
  <MazAlert color="destructive" variant="solid" title="Solid Error" content="..." />
</template>
```

  </template>
</ComponentDemo>

### All colors with solid variant

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert v-for="color in colors" :key="color" :color="color" variant="solid" :title="capitalize(color)" :content="`Solid ${color} alert.`" />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="info" variant="solid" title="Info" content="..." />
  <MazAlert color="success" variant="solid" title="Success" content="..." />
  <MazAlert color="warning" variant="solid" title="Warning" content="..." />
  <MazAlert color="destructive" variant="solid" title="Error" content="..." />
  <!-- ... other colors -->
</template>
```

  </template>
</ComponentDemo>

## Colors

MazAlert supports all theme colors to convey different types of messages.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert v-for="color in colors" :key="color" :color="color" :title="capitalize(color)" :content="`This is a ${color} alert message.`" />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="info" title="Info" content="This is an info alert." />
  <MazAlert color="success" title="Success" content="Operation completed successfully!" />
  <MazAlert color="warning" title="Warning" content="Please review before proceeding." />
  <MazAlert color="destructive" title="Error" content="An error occurred." />
  <MazAlert color="primary" title="Primary" content="This is a primary alert." />
  <MazAlert color="secondary" title="Secondary" content="This is a secondary alert." />
  <MazAlert color="accent" title="Accent" content="This is an accent alert." />
  <MazAlert color="contrast" title="Contrast" content="This is a contrast alert." />
</template>
```

  </template>
</ComponentDemo>

## With slots

Use slots for more complex content with custom HTML.

<ComponentDemo>
  <MazAlert color="destructive">
    <template #title>
      3 errors found
    </template>
    <ul class="maz-m-0 maz-list-inside maz-list-disc maz-pl-0">
      <li>firstname - Invalid length: Expected >=5 but received 0</li>
      <li>lastname - Invalid length: Expected >=2 but received 0</li>
      <li>age - Invalid type: Expected number but received ""</li>
    </ul>
  </MazAlert>

  <template #code>

```vue
<template>
  <MazAlert color="destructive">
    <template #title>
      3 errors found
    </template>
    <ul class="maz-m-0 maz-list-inside maz-list-disc maz-pl-0">
      <li>firstname - Invalid length: Expected >=5 but received 0</li>
      <li>lastname - Invalid length: Expected >=2 but received 0</li>
      <li>age - Invalid type: Expected number but received ""</li>
    </ul>
  </MazAlert>
</template>
```

  </template>
</ComponentDemo>

## Without border

Remove the border with `:bordered="false"`.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert color="success" title="Without border" content="This alert has no border." :bordered="false" />
    <MazAlert color="success" title="With border (default)" content="This alert has a border." />
  </div>

  <template #code>

```vue
<template>
  <MazAlert
    color="success"
    title="Without border"
    content="This alert has no border."
    :bordered="false"
  />

  <MazAlert
    color="success"
    title="With border (default)"
    content="This alert has a border."
  />
</template>
```

  </template>
</ComponentDemo>

## Rounded sizes

Customize the border radius with the `rounded-size` prop.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert v-for="size in roundedSizes" :key="size" :rounded-size="size" :title="`Rounded: ${size}`" content="Customize the border radius." />
  </div>

  <template #code>

```vue
<template>
  <MazAlert rounded-size="none" title="Rounded: none" content="..." />
  <MazAlert rounded-size="sm" title="Rounded: sm" content="..." />
  <MazAlert rounded-size="md" title="Rounded: md" content="..." />
  <MazAlert rounded-size="base" title="Rounded: base (default)" content="..." />
  <MazAlert rounded-size="lg" title="Rounded: lg" content="..." />
  <MazAlert rounded-size="xl" title="Rounded: xl" content="..." />
  <MazAlert rounded-size="2xl" title="Rounded: 2xl" content="..." />
  <MazAlert rounded-size="3xl" title="Rounded: 3xl" content="..." />
</template>
```

  </template>
</ComponentDemo>

## Hide icon

Hide the default icon with `hide-icon`.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert color="warning" title="With icon (default)" content="The icon is visible." />
    <MazAlert color="warning" title="Without icon" content="The icon is hidden." hide-icon />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="warning" title="With icon (default)" content="The icon is visible." />
  <MazAlert color="warning" title="Without icon" content="The icon is hidden." hide-icon />
</template>
```

  </template>
</ComponentDemo>

## Custom icon

Provide a custom icon using the `icon` prop.

<ComponentDemo>
  <MazAlert color="primary" title="Custom icon" content="This alert uses a custom icon." icon="bell" />

  <template #code>

```vue
<template>
  <MazAlert
    color="primary"
    title="Custom icon"
    content="This alert uses a custom icon."
    icon="bell"
  />
</template>
```

  </template>
</ComponentDemo>

## Title only or content only

You can use either title, content, or both.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazAlert color="info" title="Title only alert" />
    <MazAlert color="success" content="Content only alert without a title." />
    <MazAlert color="warning" title="Both title and content" content="This alert has both." />
  </div>

  <template #code>

```vue
<template>
  <MazAlert color="info" title="Title only alert" />
  <MazAlert color="success" content="Content only alert without a title." />
  <MazAlert color="warning" title="Both title and content" content="This alert has both." />
</template>
```

  </template>
</ComponentDemo>

## Use cases

### Form validation errors

<ComponentDemo>
  <MazAlert color="destructive" title="Please fix the following errors:">
    <ul class="maz-m-0 maz-list-inside maz-list-disc maz-pl-0">
      <li>Email address is required</li>
      <li>Password must be at least 8 characters</li>
    </ul>
  </MazAlert>

  <template #code>

```vue
<template>
  <MazAlert color="destructive" title="Please fix the following errors:">
    <ul class="maz-m-0 maz-list-inside maz-list-disc maz-pl-0">
      <li>Email address is required</li>
      <li>Password must be at least 8 characters</li>
    </ul>
  </MazAlert>
</template>
```

  </template>
</ComponentDemo>

### Success notification

<ComponentDemo>
  <MazAlert color="success" title="Payment successful!" content="Your order #12345 has been confirmed. You will receive an email confirmation shortly." />

  <template #code>

```vue
<template>
  <MazAlert
    color="success"
    title="Payment successful!"
    content="Your order #12345 has been confirmed. You will receive an email confirmation shortly."
  />
</template>
```

  </template>
</ComponentDemo>

### Warning message

<ComponentDemo>
  <MazAlert color="warning" title="Session expiring soon" content="Your session will expire in 5 minutes. Please save your work to avoid losing any changes." />

  <template #code>

```vue
<template>
  <MazAlert
    color="warning"
    title="Session expiring soon"
    content="Your session will expire in 5 minutes. Please save your work to avoid losing any changes."
  />
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  const colors = ['info', 'success', 'warning', 'destructive', 'primary', 'secondary', 'accent', 'contrast']
  const roundedSizes = ['none', 'sm', 'md', 'base', 'lg', 'xl', '2xl', '3xl']

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-alert.doc.md-->
