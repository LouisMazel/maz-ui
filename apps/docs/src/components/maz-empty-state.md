---
title: MazEmptyState
description: MazEmptyState shows what an empty list or page holds - an illustration, a sentence and the next action. The search variant quotes the query. The illustration moves a little toward the mouse.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give a `title` and a `description`. Put the main action in the `actions` slot.

<ComponentDemo>
  <MazEmptyState title="No project yet" description="Create your first project to see it here.">
    <template #actions>
      <MazBtn>Create a project</MazBtn>
    </template>
  </MazEmptyState>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazEmptyState from 'maz-ui/components/MazEmptyState'
</script>

<template>
  <MazEmptyState title="No project yet" description="Create your first project to see it here.">
    <template #actions>
      <MazBtn>Create a project</MazBtn>
    </template>
  </MazEmptyState>
</template>
```

  </template>
</ComponentDemo>

## Search without result

With `variant="search"`, the `query` is quoted and the message is announced to screen readers (`role="status"`). The title defaults to "No results".

<ComponentDemo>
  <MazEmptyState variant="search" query="unicorn" description="Try another word or remove a filter." />

<template #code>

```vue
<template>
  <MazEmptyState variant="search" query="unicorn" description="Try another word or remove a filter." />
</template>
```

  </template>
</ComponentDemo>

## Icon and illustration

Change the `icon` and the `color`. For a full illustration, use the `illustration` slot.

<ComponentDemo>
  <MazEmptyState title="All caught up" icon="check-circle" color="success" size="sm" />

<template #code>

```vue
<template>
  <MazEmptyState title="All caught up" icon="check-circle" color="success" size="sm" />

  <MazEmptyState title="Custom">
    <template #illustration>
      <img src="/empty.svg" alt="" width="160">
    </template>
  </MazEmptyState>
</template>
```

  </template>
</ComponentDemo>

## Accessibility and motion

- The icon is decorative (`aria-hidden`). The title is a `h3`: change the level with the `title` slot if your page needs another.
- The illustration follows the mouse only on devices with a mouse. It never moves on touch screens, nor with reduced motion.
- There is no animation loop: the position changes only when the pointer moves.

<!--@include: ./../../.vitepress/generated-docs/maz-empty-state.doc.md-->
