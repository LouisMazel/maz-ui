---
title: MazRelativeTime
description: MazRelativeTime shows "3 minutes ago" on a real time element. It updates by itself, in the language of the page, and only the characters that change roll.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass a `date`: a `Date`, a timestamp or a string. A date in the future reads "in 5 minutes".

<ComponentDemo>
  <ul>
    <li><MazRelativeTime :date="now - 3 * 60000" locale="en" /></li>
    <li><MazRelativeTime :date="now + 5 * 60000" locale="en" /></li>
    <li><MazRelativeTime :date="now - 26 * 3600000" locale="en" /></li>
  </ul>

<template #code>

```vue
<script lang="ts" setup>
import MazRelativeTime from 'maz-ui/components/MazRelativeTime'
</script>

<template>
  <MazRelativeTime :date="new Date('2026-06-01T10:00:00Z')" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  const now = Date.now()
</script>

## Language and style

Without `locale`, the component uses the locale of `@maz-ui/translations`, then the one of the browser. `style` sets the length of the units (`long`, `short`, `narrow`) and `numeric="always"` turns "yesterday" into "1 day ago".

<ComponentDemo>
  <div class="maz:flex maz:flex-col">
    <MazRelativeTime :date="now - 3 * 60000" locale="fr" />
    <MazRelativeTime :date="now - 3 * 60000" locale="en" style="short" />
    <MazRelativeTime :date="now - 26 * 3600000" locale="en" numeric="always" />
  </div>

<template #code>

```vue
<template>
  <MazRelativeTime :date="date" locale="fr" />
  <MazRelativeTime :date="date" locale="en" style="short" />
  <MazRelativeTime :date="date" locale="en" numeric="always" />
</template>
```

  </template>
</ComponentDemo>

## Updates

The text refreshes only when it can change: every second under a minute, every minute under an hour, and so on. The timer stops while the page is hidden. Only the characters that change roll (`animated` to turn it off).

## Exact date

The exact date shows in the native tooltip on hover (`title` to turn it off). The `datetime` attribute always holds the ISO date, for search engines and assistive technologies.

## Server rendering

The server renders the text computed at the server time. The client recomputes it on hydration without a warning (`data-allow-mismatch`), so a text that differs by a few seconds never breaks the page.

## Accessibility and motion

- The element is a real `<time>`. Screen readers read the final text, not the rolling characters.
- With reduced motion, the text changes instantly.

<!--@include: ./../../.vitepress/generated-docs/maz-relative-time.doc.md-->
