---
title: MazMarkdownEditor
description: MazMarkdownEditor is a GitHub-style markdown editor with Write/Preview/Split tabs, a configurable formatting toolbar, optional line numbers, and a sanitized preview. It shares the same states, labels and theming as MazTextarea, is SSR-friendly, and supports custom renderers.
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
  <MazMarkdownEditor v-model="basic" placeholder="markdown goes here" />

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

The formatting toolbar is opt-in. Set `toolbar` to `true` to display the full toolbar. Buttons act on the current textarea selection and preserve the native undo/redo history (`Cmd/Ctrl + Z`).

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

### Available actions

The full toolbar exposes the following action keys:

| Key | Result |
| --- | --- |
| `heading` | Heading dropdown (`#`, `##`, `###`) |
| `bold` | `**bold**` |
| `italic` | `_italic_` |
| `strikethrough` | `~~strikethrough~~` |
| `quote` | `> quote` |
| `code` | `` `inline code` `` |
| `codeBlock` | fenced ` ``` ` code block |
| `link` | `[text](url)` |
| `image` | `![alt](url)` |
| `bulletList` | `- item` |
| `orderedList` | `1. item` |
| `checkList` | `- [ ] task` |
| `table` | markdown table skeleton |

### Configure the toolbar

Pass an **ordered array of action keys** to display only a subset (and control their order):

<ComponentDemo>
  <MazMarkdownEditor v-model="withToolbarConfig" :toolbar="['heading', 'bold', 'italic', 'link', 'codeBlock']" />

  <template #code>

```vue
<template>
  <MazMarkdownEditor
    v-model="content"
    :toolbar="['heading', 'bold', 'italic', 'link', 'codeBlock']"
  />
</template>
```

  </template>
</ComponentDemo>

## Keyboard shortcuts

Classic markdown shortcuts are enabled by default and work whenever the textarea is focused. They preserve the native undo/redo history. The toolbar buttons also display their shortcut in the tooltip. Use `mod` for `Cmd` on macOS and `Ctrl` elsewhere.

| Shortcut | Action |
| --- | --- |
| `mod + B` | Bold |
| `mod + I` | Italic |
| `mod + Shift + X` | Strikethrough |
| `mod + K` | Link |
| `mod + E` | Inline code |
| `mod + Shift + E` | Code block |
| `mod + Shift + .` | Quote |
| `mod + Shift + 8` | Bulleted list |
| `mod + Shift + 7` | Numbered list |
| `mod + Shift + L` | Task list |
| `mod + Alt + 1/2/3` | Heading 1/2/3 |

Disable them with `:shortcuts="false"`:

```vue
<template>
  <MazMarkdownEditor v-model="content" toolbar :shortcuts="false" />
</template>
```

::: tip
Image and table insertions have no default shortcut (to avoid clashing with browser shortcuts). Use the toolbar buttons or the `toolbar` slot helpers for those.
:::

## List continuation

Pressing <kbd>Enter</kbd> inside a list automatically inserts the next marker, just like a desktop markdown editor:

- Bulleted lists (`-`, `*`, `+`) repeat the marker.
- Numbered lists increment the index (`1.` → `2.`).
- Task lists insert a fresh unchecked box (`- [ ] `).
- Indentation is preserved.

Pressing <kbd>Enter</kbd> again on an empty item removes the marker and exits the list. This works out of the box, no configuration required.

## Label & assistive text

Like `MazTextarea`, the editor supports a static `top-label` (or `label`), the `required` asterisk and an `assistive-text` displayed below the editor.

<ComponentDemo>
  <MazMarkdownEditor
    v-model="withLabel"
    top-label="Description"
    placeholder="Markdown goes here"
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

## Split mode

A third tab displays the editor and the preview side by side. Switch to it from the toolbar tabs, or control it with `v-model:mode` (`'write' | 'preview' | 'split'`). On small screens the two panes stack vertically.

<ComponentDemo>
  <MazMarkdownEditor v-model="splitContent" mode="split" />

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" mode="split" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('# Split view\n\nType on the left, see the **preview** on the right.')
</script>
```

  </template>
</ComponentDemo>

## Line numbers

Enable the `line-numbers` prop to display a gutter on the left of the editor. Numbers reflect logical lines and stay in sync with the textarea scroll.

<ComponentDemo>
  <MazMarkdownEditor v-model="lineNumbersContent" line-numbers />

  <template #code>

```vue
<template>
  <MazMarkdownEditor v-model="content" line-numbers />
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

The active tab is available through `v-model:mode` (`'write' | 'preview' | 'split'`).

```vue
<template>
  <MazMarkdownEditor v-model="content" v-model:mode="mode" />
  <p>Current tab: {{ mode }}</p>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdownEditor from 'maz-ui/components/MazMarkdownEditor'

  const content = ref('')
  const mode = ref<'write' | 'preview' | 'split'>('write')
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
  const withToolbarConfig = ref('Only a few buttons here.')
  const splitContent = ref('# Split view\n\nType on the left, see the **preview** on the right.')
  const lineNumbersContent = ref('Line one\nLine two\nLine three')
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
