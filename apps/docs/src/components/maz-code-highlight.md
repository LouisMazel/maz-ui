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

## Color mode

By default (`color-mode="auto"`) the block follows the color mode of your app. The mode is resolved in this order:

1. the `color-mode` prop, when it is not `auto`
2. the closest `.dark` ancestor (including `<html>`), observed for changes
3. the color mode of [`@maz-ui/themes`](/ecosystem/themes) when the theme plugin is installed (known at render time, so it is consistent with SSR and Nuxt)
4. the `dark` class of `<html>`

The `theme` prop (shiki theme name) always wins over the theme chosen from the color mode.

### Force the color mode

Set `color-mode` to `light` or `dark` to force the mode of a single block. The `dark` or `light` class is added on the root element, so the language badge, the copy button and the tooltip follow the forced mode.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazCodeHighlight code="const mode = 'dark'" language="ts" color-mode="dark" />
    <MazCodeHighlight code="const mode = 'light'" language="ts" color-mode="light" />
  </div>

  <template #code>

```vue
<template>
  <MazCodeHighlight code="const mode = 'dark'" language="ts" color-mode="dark" />
  <MazCodeHighlight code="const mode = 'light'" language="ts" color-mode="light" />
</template>
```

  </template>
</ComponentDemo>

### Dark ancestor

A `.dark` class on any ancestor is enough, without any prop:

```vue
<template>
  <div class="dark">
    <MazCodeHighlight code="const dark = true" language="ts" />
  </div>
</template>
```

### Nuxt and SSR

With `@maz-ui/nuxt` (or the `MazUi` plugin / `MazUiProvider`), the block reads the color mode from `useTheme()`, so the server and the client render the same theme. Without a theme plugin, the component falls back to the `dark` class of `<html>` on the client and renders the light theme on the server.

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

## Sizes

`size` sets the size of the code text and of the padding around it: `mini`, `xs`, `sm`, `md` (default) or `lg`. Small sizes fit dense content like logs or terminal output.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-2">
    <MazCodeHighlight v-for="size in ['mini', 'xs', 'sm', 'md', 'lg']" :key="size" :code="`const size = '${size}'`" language="ts" :size="size" />
  </div>

  <template #code>

```vue
<template>
  <MazCodeHighlight code="const size = 'mini'" language="ts" size="mini" />
  <MazCodeHighlight code="const size = 'xs'" language="ts" size="xs" />
  <MazCodeHighlight code="const size = 'sm'" language="ts" size="sm" />
  <MazCodeHighlight code="const size = 'md'" language="ts" />
  <MazCodeHighlight code="const size = 'lg'" language="ts" size="lg" />
</template>
```

  </template>
</ComponentDemo>

## Long code: max height and line wrap

`max-height` (any CSS length) caps the height of the block: longer code scrolls inside it. `wrap` breaks long lines instead of scrolling horizontally, and `hide-language` removes the language badge.

<ComponentDemo>
  <MazCodeHighlight :code="longLog" language="log" size="xs" max-height="8rem" wrap hide-language />

  <template #code>

```vue
<template>
  <MazCodeHighlight
    :code="longLog"
    language="log"
    size="xs"
    max-height="8rem"
    wrap
    hide-language
  />
</template>
```

  </template>
</ComponentDemo>

## Follow streamed code (logs)

For code that grows while it is displayed (logs, build or terminal output), set `follow` with a `max-height`:

- the block stays scrolled to its last line as code is appended;
- scrolling up stops following, scrolling back to the bottom follows again;
- appended lines are highlighted alone, from the grammar state of the previous ones, instead of the whole code again: the cost of an update depends on the new lines, not on the size of the log.

The code must grow by appending (the new code starts with the previous one); any other change highlights it again from the start. The exposed `scrollToBottom()` method scrolls to the last line and follows again, for a "Follow" button for example.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-2">
    <MazBtn size="sm" @click="toggleStream">{{ streaming ? 'Stop' : 'Start' }} the build</MazBtn>
    <MazCodeHighlight :code="streamedLog" language="log" size="xs" max-height="10rem" follow hide-language class="maz:w-full" />
  </div>

  <template #code>

```vue
<template>
  <MazCodeHighlight
    ref="log"
    :code="lines.join('\n')"
    language="log"
    size="xs"
    max-height="10rem"
    follow
    hide-language
  />
  <MazBtn size="sm" @click="log?.scrollToBottom()">Follow</MazBtn>
</template>

<script lang="ts" setup>
  import { ref, useTemplateRef } from 'vue'
  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCodeHighlight from 'maz-ui/components/MazCodeHighlight'

  const log = useTemplateRef('log')
  // Push the lines of your process as they arrive
  const lines = ref<string[]>([])
</script>
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

For app-wide translations, set up the [maz-ui translations plugin](/ecosystem/translations) and the component will pick up your locale automatically.

<script lang="ts" setup>
  import { onBeforeUnmount, ref } from 'vue'

  const vueExample = `<script lang="ts" setup>
  import { ref } from 'vue'
  const count = ref(0)
<\/script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`

  const longLog = Array.from({ length: 12 }, (_, i) => `2026-11-13T09:${String(20 + i).padStart(2, '0')}:00.000Z [build] ${i % 4 === 3 ? 'WARN' : 'INFO'} packages/core/src/module-${i}.ts compiled in ${40 + i * 7}ms, output written to dist/module-${i}.js`).join('\n')

  const STEPS = ['Resolving dependencies', 'Compiling src/index.ts', 'Compiling src/utils.ts', 'WARN Unused export in src/legacy.ts', 'Bundling 42 modules', 'Minifying', 'Writing dist/index.js', 'ERROR Type check failed in src/api.ts', 'Retrying type check', 'Done in 4.2s']
  const streamedLog = ref('')
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
      const line = `[${String(++count).padStart(3, '0')}] ${STEPS[count % STEPS.length]}`
      streamedLog.value = streamedLog.value ? `${streamedLog.value}\n${line}` : line
    }, 300)
  }

  onBeforeUnmount(() => clearInterval(timer))
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-code-highlight.doc.md-->
