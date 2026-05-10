---
title: MazCodeHighlight
description: MazCodeHighlight displays source code with syntax highlighting powered by shiki. It auto-detects dark/light mode, ships with a copy-to-clipboard button, a language badge, and supports lazy loading.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Installation requirement

Install [`shiki`](https://shiki.style) in your project to enable highlighting:

::: code-group

```bash [pnpm]
pnpm add shiki
```

```bash [npm]
npm install shiki
```

```bash [yarn]
yarn add shiki
```

:::

If `shiki` is not installed, the component falls back to a plain `<pre><code>` block.

## Basic usage

<ComponentDemo>
  <MazCodeHighlight code="const greeting = 'Hello, maz-ui!'" language="ts" />

  <template #code>

```vue
<template>
  <MazCodeHighlight code="const greeting = 'Hello, maz-ui!'" language="ts" />
</template>

<script lang="ts" setup>
  import MazCodeHighlight from 'maz-ui/components/MazCodeHighlight'
</script>
```

  </template>
</ComponentDemo>

## With slot

The default slot text is used as source code when the `code` prop is not provided. This is useful for plain text blocks.

<ComponentDemo>
  <MazCodeHighlight language="bash">npm install maz-ui</MazCodeHighlight>

  <template #code>

```vue
<template>
  <MazCodeHighlight language="bash">npm install maz-ui</MazCodeHighlight>
</template>

<script lang="ts" setup>
  import MazCodeHighlight from 'maz-ui/components/MazCodeHighlight'
</script>
```

  </template>
</ComponentDemo>

## Languages

Pass any valid [shiki language identifier](https://shiki.style/languages) to the `language` prop. The chosen language is also displayed as a small badge in the top-right corner (the badge fades out on hover when the copy button appears).

<ComponentDemo>
  <MazCodeHighlight language="vue" :code="vueExample" />

  <template #code>

```vue
<template>
  <MazCodeHighlight language="vue" :code="vueExample" />
</template>

<script lang="ts" setup>
  import MazCodeHighlight from 'maz-ui/components/MazCodeHighlight'

  const vueExample = `<script lang="ts" setup>
  import { ref } from 'vue'
  const count = ref(0)
<\/script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`
</script>
```

  </template>
</ComponentDemo>

## Custom theme

Override the auto-detected theme with any [shiki built-in theme](https://shiki.style/themes).

<ComponentDemo>
  <MazCodeHighlight code="console.log('dracula theme')" language="js" theme="dracula" />

  <template #code>

```vue
<template>
  <MazCodeHighlight code="console.log('dracula theme')" language="js" theme="dracula" />
</template>

<script lang="ts" setup>
  import MazCodeHighlight from 'maz-ui/components/MazCodeHighlight'
</script>
```

  </template>
</ComponentDemo>

## Copy to clipboard

A copy button is displayed in the top-right corner on hover (or when focused via keyboard). Clicking it writes the resolved code to the clipboard and shows a check icon for ~1.5s.

### Disable the copy button

Set `:copyable="false"` to hide the button entirely.

<ComponentDemo>
  <MazCodeHighlight code="const noCopyButton = true" language="ts" :copyable="false" />

  <template #code>

```vue
<template>
  <MazCodeHighlight code="const noCopyButton = true" language="ts" :copyable="false" />
</template>
```

  </template>
</ComponentDemo>

### Copy a different value than the displayed code

Use `copyValue` when the displayed source differs from what should be copied — for example to strip a leading `$` prompt when rendering a shell command. This is the mechanism `MazWindowMockup` uses internally to keep the terminal prompt out of the clipboard.

<ComponentDemo>
  <MazCodeHighlight code="$ pnpm add maz-ui" copy-value="pnpm add maz-ui" language="bash" />

  <template #code>

```vue
<template>
  <MazCodeHighlight
    code="$ pnpm add maz-ui"
    copy-value="pnpm add maz-ui"
    language="bash"
  />
</template>
```

  </template>
</ComponentDemo>

## Disable rounded corners

Set `:rounded="false"` to render the highlighted block with squared corners — useful when embedding inside another container that already has its own border-radius (e.g. inside `MazWindowMockup`).

<ComponentDemo>
  <MazCodeHighlight code="// squared corners" language="ts" :rounded="false" />

  <template #code>

```vue
<template>
  <MazCodeHighlight code="// squared corners" language="ts" :rounded="false" />
</template>
```

  </template>
</ComponentDemo>

## Custom translations

The copy button's aria-label and tooltip come from the `@maz-ui/translations` package (`codeHighlight.copyToClipboard` / `codeHighlight.copiedToClipboard`). You can override either key per-instance with the `translations` prop without touching the global locale:

<ComponentDemo>
  <MazCodeHighlight
    code="const hello = 'world'"
    language="ts"
    :translations="{ copyToClipboard: 'Copier le code', copiedToClipboard: 'Copié !' }"
  />

  <template #code>

```vue
<template>
  <MazCodeHighlight
    code="const hello = 'world'"
    language="ts"
    :translations="{
      copyToClipboard: 'Copier le code',
      copiedToClipboard: 'Copié !',
    }"
  />
</template>
```

  </template>
</ComponentDemo>

For app-wide translations, set up the [maz-ui translations plugin](/translations) and the component will pick up your locale automatically.

<script lang="ts" setup>
  const vueExample = `<script lang="ts" setup>
  import { ref } from 'vue'
  const count = ref(0)
<\/script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-code-highlight.doc.md-->
