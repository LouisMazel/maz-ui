---
title: MazLogStream
description: MazLogStream shows a log that grows (build output, a process, an agent) in the frame of MazCodeHighlight, with a copy button, structured lines (muted, error, labelled, markdown) and a follow mode that sticks to the bottom until you scroll up.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass the lines of the log. A string is a plain line. Append lines to the array as they arrive: the block follows the bottom while you do not scroll up, and the lines already shown are not rendered again.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-2">
    <MazBtn size="sm" @click="toggleStream">{{ streaming ? 'Stop' : 'Start' }} the build</MazBtn>
    <MazLogStream :lines="streamed" max-height="10rem" size="sm" class="maz:w-full" />
  </div>

  <template #code>

```vue
<template>
  <MazLogStream :lines max-height="10rem" size="sm" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazLogStream from 'maz-ui/components/MazLogStream'

  const lines = ref<string[]>([])

  function onOutput(line: string) {
    lines.value.push(line)
  }
</script>
```

  </template>
</ComponentDemo>

Set `max-height` (any CSS length) so the log scrolls in its block. Once you scroll up, following stops and a button scrolls back to the last line; scrolling back to the bottom follows again. `:follow="false"` never scrolls by itself, and the exposed `scrollToBottom()` method scrolls to the last line and follows again.

## Structured lines

An object sets what a string cannot:

- `type`: `default`, `muted` (secondary lines, dimmed), `error`, `warning`, `success` or `info`.
- `label`: a short text on the left of the line (a source or a kind: `read`, `stderr`, `build`), aligned for every line. `labelColor` colors it (`muted` by default, or `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive`).
- `id`: a stable key, when the rank of the line in `lines` can change.

<ComponentDemo>
  <MazLogStream :lines="structured" size="sm" />

  <template #code>

```vue
<template>
  <MazLogStream :lines="lines" size="sm" />
</template>

<script lang="ts" setup>
  import type { MazLogStreamLine } from 'maz-ui/components/MazLogStream'
  import MazLogStream from 'maz-ui/components/MazLogStream'

  const lines: (string | MazLogStreamLine)[] = [
    'Starting the agent',
    { label: 'read', labelColor: 'info', text: 'src/index.ts', type: 'muted' },
    { label: 'edit', labelColor: 'warning', text: 'src/utils.ts', type: 'muted' },
    { label: 'run', labelColor: 'success', text: 'pnpm test' },
    { type: 'error', text: 'FAIL src/utils.test.ts' },
    { type: 'success', text: 'Done in 4.2s' },
  ]
</script>
```

  </template>
</ComponentDemo>

## Markdown lines

A line with `markdown: true` is rendered by the `markdown` slot (props: `line`, `text`, `index`), so you pick the renderer, for example [MazMarkdown](/components/maz-markdown), without MazLogStream depending on it. Without the slot, the text shows as is.

```vue
<template>
  <MazLogStream :lines="lines">
    <template #markdown="{ text }">
      <MazMarkdown :content="text" size="sm" />
    </template>
  </MazLogStream>
</template>

<script lang="ts" setup>
  import MazLogStream from 'maz-ui/components/MazLogStream'
  import MazMarkdown from 'maz-ui/components/MazMarkdown'

  const lines = [
    { markdown: true, text: 'I **fixed** the `parse` function.' },
    { label: 'edit', text: 'src/parse.ts', type: 'muted' },
  ]
</script>
```

## Long logs

Every line stays in the DOM. For a log that grows without end, set `max-lines`: only the last lines are rendered (the older ones are still in the copied text).

## Copy

The copy button appears on hover and copies the text of every line, with the label in front of its text. `copy-value` replaces the copied text, `:copyable="false"` removes the button.

## Look

The block has the same frame as [MazCodeHighlight](/components/maz-code-highlight): background, rounded corners, `size` (`mini` to `xl`), copy and "scroll to bottom" buttons. It follows the color mode of the app (the `dark` class of an ancestor or of `<html>`); `color-mode="dark"` or `"light"` forces it for this block, for example dark logs in a light app. `wrap` is on by default: `:wrap="false"` scrolls long lines horizontally.

The colors default to the `github-light` and `tokyo-night` themes of shiki. Override them with the CSS variables `--maz-log-stream-light-bg`, `--maz-log-stream-light-fg`, `--maz-log-stream-dark-bg` and `--maz-log-stream-dark-fg`, on the block or on an ancestor.

## Defaults for the whole app

`defaults.MazLogStream` of the [MazUi plugin](/guide/global-defaults) sets `colorMode`, `rounded`, `copyable`, `size` and `wrap` once for every log.

## Custom translations

The labels of the buttons are the ones of MazCodeHighlight (`codeHighlight.copyToClipboard`, `codeHighlight.copiedToClipboard`, `codeHighlight.scrollToBottom`), overridable per instance with the `translations` prop.

<script lang="ts" setup>
  import { onBeforeUnmount, ref } from 'vue'

  const STEPS = ['Resolving dependencies', 'Compiling src/index.ts', 'Compiling src/utils.ts', 'WARN Unused export in src/legacy.ts', 'Bundling 42 modules', 'Minifying', 'Writing dist/index.js', 'ERROR Type check failed in src/api.ts', 'Retrying type check', 'Done in 4.2s']
  const streamed = ref<{ text: string, type?: 'error' | 'warning' | 'muted' }[]>([])
  const streaming = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined
  let count = 0

  function toggleStream() {
    if (streaming.value) {
      clearInterval(timer)
      streaming.value = false
      return
    }
    streaming.value = true
    timer = setInterval(() => {
      const step = STEPS[count % STEPS.length]
      const type = step.startsWith('ERROR') ? 'error' : step.startsWith('WARN') ? 'warning' : undefined
      streamed.value.push({ text: `[${String(++count).padStart(3, '0')}] ${step}`, type })
    }, 300)
  }

  const structured = [
    'Starting the agent',
    { label: 'read', labelColor: 'info', text: 'src/index.ts', type: 'muted' },
    { label: 'edit', labelColor: 'warning', text: 'src/utils.ts', type: 'muted' },
    { label: 'run', labelColor: 'success', text: 'pnpm test' },
    { type: 'error', text: 'FAIL src/utils.test.ts' },
    { type: 'success', text: 'Done in 4.2s' },
  ]

  onBeforeUnmount(() => clearInterval(timer))
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-log-stream.doc.md-->
