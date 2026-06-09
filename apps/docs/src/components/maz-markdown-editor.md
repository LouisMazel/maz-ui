---
title: MazMarkdownEditor
description: MazMarkdownEditor is a GitHub-style markdown editor with Write/Preview tabs, an optional formatting toolbar, and a sanitized preview. It shares the same states, labels and theming as MazTextarea, is SSR-friendly, and supports custom renderers.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Installation requirement

The preview relies on [`marked`](https://marked.js.org) for parsing and [`dompurify`](https://github.com/cure53/DOMPurify) for sanitization. Both are loaded lazily (only when the preview is rendered), so install them in your project:

::: code-group

```bash [pnpm]
pnpm add marked dompurify
```

```bash [npm]
npm install marked dompurify
```

```bash [yarn]
yarn add marked dompurify
```

:::

If they are not installed, the preview falls back to a safe, escaped plain-text block. You can also provide your own renderer with the [`renderFunction`](#custom-renderer) prop to avoid these dependencies entirely.

## Basic usage

The component exposes a `v-model` bound to the raw markdown string and two tabs: **Write** (textarea) and **Preview** (rendered, sanitized HTML).

<ComponentDemo>
  <MazMarkdownEditor v-model="basic" />

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('# Hello maz-ui\n\nThis is **markdown** with a [link](https://maz-ui.com).')
</script>
```

  </template>
</ComponentDemo>

## Toolbar

The formatting toolbar (bold, italic, bulleted list, link, inline code) is opt-in. Enable it with the `toolbar` prop. Buttons act on the current textarea selection.

<ComponentDemo>
  <MazMarkdownEditor v-model="withToolbar" toolbar />

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" toolbar />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('Select some text and click **Bold**.')
</script>
```

  </template>
</ComponentDemo>

## Label & assistive text

Like `MazTextarea`, the editor supports a static `top-label` (or `label`), the `required` asterisk and an `assistive-text` displayed below the editor.

<ComponentDemo>
  <MazMarkdownEditor
    v-model="withLabel"
    top-label="Description"
    assistive-text="Markdown is supported"
    required
  />

  <template #code>

```vue
<template>
  <MazMarkdownEditor
    v-model="content"
    top-label="Description"
    assistive-text="Markdown is supported"
    required
  />
</template>
```

  </template>
</ComponentDemo>

## States

Use `error`, `success`, `warning`, `disabled` and `readonly` to reflect validation states, consistent with the other form components.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazMarkdownEditor v-model="stateError" error assistive-text="This field has an error" />
    <MazMarkdownEditor v-model="stateSuccess" success assistive-text="Looks good!" />
    <MazMarkdownEditor v-model="stateDisabled" disabled />
  </div>

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" error assistive-text="This field has an error" />
  <MazMarkdownEditor v-model="content" success assistive-text="Looks good!" />
  <MazMarkdownEditor v-model="content" disabled />
</template>
```

  </template>
</ComponentDemo>

## Custom renderer {#custom-renderer}

Provide a `render-function` to use your own markdown engine (e.g. `markdown-it`, a Nuxt Content renderer, or a server-side pipeline). It receives the raw markdown and returns an HTML string (sync or async). The result is still sanitized when `sanitize` is enabled.

<ComponentDemo>
  <MazMarkdownEditor v-model="customRender" :render-function="upperCaseRenderer" />

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" :render-function="renderer" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('Rendered by a custom function')

  function renderer(markdown: string) {
    return `<p>${markdown.toUpperCase()}</p>`
  }
</script>
```

  </template>
</ComponentDemo>

## Sanitization

By default, the rendered HTML is sanitized with DOMPurify to prevent XSS. Disabling it (`:sanitize="false"`) renders the raw output of the renderer; only do this when the markdown source is fully trusted.

```vue
<template>
  <!-- Trusted content only -->
  <MazMarkdownEditor v-model="content" :sanitize="false" />
</template>
```

## Controlled mode

The active tab is available through `v-model:mode` (`'write' | 'preview'`).

```vue
<template>
  <MazMarkdownEditor v-model="content" v-model:mode="mode" />
  <p>Current tab: {{ mode }}</p>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('')
  const mode = ref<'write' | 'preview'>('write')
</script>
```

## Custom translations

The tab labels, the empty-preview text and the toolbar button labels come from the `@maz-ui/translations` package (`markdownEditor.*`). You can override any key per-instance with the `translations` prop without touching the global locale:

<ComponentDemo>
  <MazMarkdownEditor
    v-model="translated"
    toolbar
    :translations="{ write: 'Édition', preview: 'Aperçu', emptyPreview: 'Rien à afficher' }"
  />

  <template #code>

```vue
<template>
  <MazMarkdownEditor
    v-model="content"
    toolbar
    :translations="{ write: 'Édition', preview: 'Aperçu', emptyPreview: 'Rien à afficher' }"
  />
</template>
```

  </template>
</ComponentDemo>

For app-wide translations, set up the [maz-ui translations plugin](/translations) and the component will pick up your locale automatically.

<script lang="ts" setup>
  import { ref } from 'vue'

  const basic = ref('# Hello maz-ui\n\nThis is **markdown** with a [link](https://maz-ui.com).')
  const withToolbar = ref('Select some text and click **Bold**.')
  const withLabel = ref('')
  const stateError = ref('Invalid content')
  const stateSuccess = ref('Valid content')
  const stateDisabled = ref('Disabled editor')
  const customRender = ref('Rendered by a custom function')
  const translated = ref('Localized **markdown** editor.')

  function upperCaseRenderer(markdown: string) {
    return `<p>${markdown.toUpperCase()}</p>`
  }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-markdown-editor.doc.md-->
