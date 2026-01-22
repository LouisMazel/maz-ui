---
title: MazReadMore
description: MazReadMore is a standalone component to truncate long text with a "Read more" / "Read less" toggle functionality
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

## Basic usage

Use the `text` prop or the default slot to provide the content to truncate. By default, the component uses line-clamp with 4 lines.

### With text prop

<br />

<ComponentDemo>
  <MazReadMore :text="longText" />
<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
</script>

<template>
  <MazReadMore :text="longText" />
</template>
```

</template>
</ComponentDemo>

### With default slot

<br />

<ComponentDemo>
  <MazReadMore>
    <p>{{longText}}</p>
  </MazReadMore>
<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'
</script>

<template>
  <MazReadMore>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </MazReadMore>
</template>
```

</template>
</ComponentDemo>

## Truncation with max lines

Control the number of visible lines using the `max-lines` prop.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <div>
      <p class="maz-text-sm maz-text-muted maz-mb-2">2 lines</p>
      <MazReadMore :text="longText" :max-lines="2" />
    </div>
    <div>
      <p class="maz-text-sm maz-text-muted maz-mb-2">6 lines</p>
      <MazReadMore :text="longText" :max-lines="6" />
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse.
Excepteur sint occaecat cupidatat non proident, sunt in culpa.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
</script>

<template>
  <MazReadMore :text="longText" :max-lines="2" />
  <MazReadMore :text="longText" :max-lines="6" />
</template>
```

</template>
</ComponentDemo>

## Truncation with max characters

Use the `max-chars` prop to truncate based on character count instead of lines.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <div>
      <p class="maz-text-sm maz-text-muted maz-mb-2">50 characters</p>
      <MazReadMore :text="longText" :max-chars="50" />
    </div>
    <div>
      <p class="maz-text-sm maz-text-muted maz-mb-2">150 characters</p>
      <MazReadMore :max-chars="150">
        {{ longText }}
      </MazReadMore>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`
</script>

<template>
  <MazReadMore :text="longText" :max-chars="50" />
  <MazReadMore :max-chars="150">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </MazReadMore>
</template>
```

</template>
</ComponentDemo>

## Using slot for content

You can use the default slot to provide rich content instead of plain text.

<ComponentDemo>
  <MazReadMore :max-lines="2">
    <p>
      <strong>Rich content example:</strong> Lorem ipsum dolor sit amet,
      <em>consectetur adipiscing elit</em>. Sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </MazReadMore>

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'
</script>

<template>
  <MazReadMore :max-lines="2">
    <p>
      <strong>Rich content example:</strong> Lorem ipsum dolor sit amet,
      <em>consectetur adipiscing elit</em>. Sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </MazReadMore>
</template>
```

</template>
</ComponentDemo>

## Colors

Customize the color of the toggle link using the `color` prop.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazReadMore :text="longText" color="primary" :max-lines="2" />
    <MazReadMore :text="longText" color="secondary" :max-lines="2" />
    <MazReadMore :text="longText" color="info" :max-lines="2" />
    <MazReadMore :text="longText" color="success" :max-lines="2" />
    <MazReadMore :text="longText" color="warning" :max-lines="2" />
    <MazReadMore :text="longText" color="destructive" :max-lines="2" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`
</script>

<template>
  <MazReadMore :text="longText" color="primary" :max-lines="2" />
  <MazReadMore :text="longText" color="secondary" :max-lines="2" />
  <MazReadMore :text="longText" color="info" :max-lines="2" />
  <MazReadMore :text="longText" color="success" :max-lines="2" />
  <MazReadMore :text="longText" color="warning" :max-lines="2" />
  <MazReadMore :text="longText" color="destructive" :max-lines="2" />
</template>
```

</template>
</ComponentDemo>

## Custom toggle text

Customize the "Read more" and "Read less" text using the `expand-text` and `collapse-text` props.

<ComponentDemo>
  <MazReadMore
    :text="longText"
    :max-lines="2"
    expand-text="Show more"
    collapse-text="Show less"
  />

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'

const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`
</script>

<template>
  <MazReadMore
    :text="longText"
    :max-lines="2"
    expand-text="Show more"
    collapse-text="Show less"
  />
</template>
```

</template>
</ComponentDemo>

## Short content (no button)

When the content is shorter than the truncation limit, the toggle button is automatically hidden.

<ComponentDemo>
  <MazReadMore text="This is a short text that doesn't need truncation." :max-lines="4" />

<template #code>

```vue
<script lang="ts" setup>
import MazReadMore from 'maz-ui/components/MazReadMore'
</script>

<template>
  <MazReadMore text="This is a short text that doesn't need truncation." :max-lines="4" />
</template>
```

</template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-read-more.doc.md-->

<script lang="ts" setup>
const longText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
</script>
