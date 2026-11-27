---
title: MazMarkdown
description: MazMarkdown renders a markdown string as formatted, sanitized and themed text, read-only. It is the preview of MazMarkdownEditor on its own, with sizes, colors, code highlighting, external links and a custom renderer.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass the markdown to `content`. The result is styled with the [`rich-text`](/guide/typography#rich-text) utility, so it follows the type scale of your theme in light and dark mode.

<ComponentDemo>
  <MazMarkdown :content="basic" />

  <template #code>

```vue
<template>
  <MazMarkdown :content="content" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazMarkdown from 'maz-ui/components/MazMarkdown'

  const content = ref('# Release 5.9\n\nThis release adds **MazMarkdown**.\n\n- Sanitized by default\n- Code blocks are highlighted\n\nSee the [docs](https://maz-ui.com).')
</script>
```

  </template>
</ComponentDemo>

The content is parsed with [`marked`](https://marked.js.org) (GitHub flavored, line breaks kept) and sanitized with [`dompurify`](https://github.com/cure53/DOMPurify), both installed with `maz-ui` and loaded only when the component is used. Code highlighting needs the optional [`shiki`](https://shiki.style) package, see [Code blocks](#code-blocks).

## Size

`size` scales the text, the titles and the code blocks (`mini` renders as `xs`, `xl` as `lg`). It can be set for the whole app with `defaults.MazMarkdown.size` or `defaults.global.size`.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazMarkdown content="## Extra small" size="xs" />
    <MazMarkdown content="## Small" size="sm" />
    <MazMarkdown content="## Medium" />
    <MazMarkdown content="## Large" size="lg" />
  </div>

  <template #code>

```vue
<template>
  <MazMarkdown content="## Extra small" size="xs" />
  <MazMarkdown content="## Small" size="sm" />
  <MazMarkdown content="## Medium" />
  <MazMarkdown content="## Large" size="lg" />
</template>
```

  </template>
</ComponentDemo>

## Color

`color` sets the color of the text and the titles (links keep the primary color). Use `inherit` to take the color of the parent, in a colored banner for example.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazMarkdown content="**Muted** text with a [link](https://maz-ui.com)" color="muted" />
    <MazMarkdown content="**Success** text" color="success" />
    <MazMarkdown content="**Destructive** text" color="destructive" />
  </div>

  <template #code>

```vue
<template>
  <MazMarkdown content="**Muted** text" color="muted" />
  <MazMarkdown content="**Success** text" color="success" />
  <MazMarkdown content="**Destructive** text" color="destructive" />
</template>
```

  </template>
</ComponentDemo>

## Inline

`inline` renders one line of inline markdown (bold, italic, code, links) in a `span`: no paragraph, title or list. Use it inside a sentence, a label or a table cell. The text keeps the font, size and color of its parent, and the bold, code and links follow the `rich-text` styles.

<ComponentDemo>
  <p>
    Status: <MazMarkdown content="**ready**, see `config.ts`" inline />
  </p>

  <template #code>

```vue
<template>
  <p>Status: <MazMarkdown content="**ready**, see `config.ts`" inline /></p>
</template>
```

  </template>
</ComponentDemo>

## Code blocks {#code-blocks}

Fenced code blocks are rendered with [`MazCodeHighlight`](./maz-code-highlight.md): syntax highlighting and a copy button. It needs the optional `shiki` package, without it the code is shown without colors. Set `:highlight="false"` to keep plain `<pre>` blocks and never load it. Blocks nested in a list or a quote, and indented blocks, stay plain `<pre>`.

<ComponentDemo>
  <MazMarkdown :content="withCode" />

  <template #code>

```vue
<template>
  <MazMarkdown :content="content" />
  <MazMarkdown :content="content" :highlight="false" />
</template>
```

  </template>
</ComponentDemo>

## Links

Absolute links (`http://`, `https://`, `//`) open in a new tab with `rel="noopener noreferrer"`. Disable it with `:external-links="false"`.

Every click on a link emits `link-click` with the event and the `href`, before the browser follows it. Call `event.preventDefault()` to handle the link yourself: an in-app router, the system browser of a desktop app.

```vue
<template>
  <MazMarkdown :content="content" @link-click="onLink" />
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function onLink(event: MouseEvent, href: string) {
    if (href.startsWith('/')) {
      event.preventDefault()
      router.push(href)
    }
  }
</script>
```

## Heading anchors

`heading-anchors` adds an `id` to each title (the slug of its text, `-1`, `-2`... for duplicates), so that `#anchor` links reach them.

```vue
<template>
  <MazMarkdown :content="'# Getting started\n\nBack to the top'" heading-anchors />
  <!-- <h1 id="getting-started">Getting started</h1> -->
</template>
```

## Marked options

`marked-options` is forwarded to `marked` (`gfm` and `breaks` are enabled by default).

```vue
<template>
  <MazMarkdown :content="content" :marked-options="{ breaks: false }" />
</template>
```

## Custom renderer {#custom-renderer}

`render-function` replaces `marked` with your own engine (`markdown-it`, a server pipeline...). It receives the markdown and returns HTML, sync or async. The result is still sanitized when `sanitize` is enabled.

```vue
<template>
  <MazMarkdown :content="content" :render-function="render" />
</template>

<script lang="ts" setup>
  import MarkdownIt from 'markdown-it'

  const md = new MarkdownIt()

  function render(markdown: string) {
    return md.render(markdown)
  }
</script>
```

## Sanitization

The HTML is sanitized with DOMPurify by default. `:sanitize="false"` renders the raw output: do it only for a fully trusted markdown.

With SSR, the sanitized content is rendered on the client, DOMPurify needs a DOM. A trusted content with `:sanitize="false"` is rendered on the server.

## Empty content

Without content, nothing is rendered. The `empty` slot displays a placeholder instead.

```vue
<template>
  <MazMarkdown :content="description">
    <template #empty>
      <p class="text-muted">No description</p>
    </template>
  </MazMarkdown>
</template>
```

## Style

The component takes `class` and `style` on its root. The classes reach the root, so `[&_code]:text-primary` restyles the inline code for example. See [`rich-text`](/guide/typography#rich-text) for the variables of the styles.

## Accessibility

The links are native `a` elements: they are focusable and work with the keyboard. The titles keep their level, take care to start the markdown at the level that fits your page.

## Editing markdown

To let users write markdown, use [`MazMarkdownEditor`](./maz-markdown-editor.md): its preview is a `MazMarkdown`.

<script lang="ts" setup>
  import { ref } from 'vue'

  const basic = ref('# Release 5.9\n\nThis release adds **MazMarkdown**.\n\n- Sanitized by default\n- Code blocks are highlighted\n\nSee the [docs](https://maz-ui.com).')
  const withCode = ref('Install the package:\n\n```bash\npnpm add maz-ui\n```\n\nThen use it:\n\n```ts\nimport MazMarkdown from \'maz-ui/components/MazMarkdown\'\n```')
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-markdown.doc.md-->
