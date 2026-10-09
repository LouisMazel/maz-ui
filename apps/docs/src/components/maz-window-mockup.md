---
title: MazWindowMockup
description: MazWindowMockup renders a macOS-style window frame in three variants — browser, terminal, and editor — to showcase content, demos, or code examples in your documentation or UI.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: info Optional: shiki for code variants
When you pass the `code` prop, `MazWindowMockup` mounts `MazCodeHighlight` internally for syntax highlighting. This requires the [`shiki`](https://shiki.style) optional peer dependency to be installed. See the [MazCodeHighlight installation note](/components/maz-code-highlight#installation-requirement).
:::

## Browser variant

The default variant. Displays an address bar with the `url` prop and a copy-URL button on the right side of the bar.

<ComponentDemo>
  <MazWindowMockup url="https://maz-ui.com" min-height="100px">
    <div style="padding: 1rem; text-align: center;">Browser content goes here</div>
  </MazWindowMockup>

  <template #code>

```vue
<template>
  <MazWindowMockup url="https://maz-ui.com" min-height="100px">
    <div>Browser content goes here</div>
  </MazWindowMockup>
</template>

<script lang="ts" setup>
  import MazWindowMockup from 'maz-ui/components/MazWindowMockup'
</script>
```

  </template>
</ComponentDemo>

### Hide the URL copy button

Set `:hide-url-copy="true"` to remove the copy-URL button from the title bar.

<ComponentDemo>
  <MazWindowMockup url="https://maz-ui.com" min-height="80px" :hide-url-copy="true" />

  <template #code>

```vue
<template>
  <MazWindowMockup url="https://maz-ui.com" min-height="80px" :hide-url-copy="true" />
</template>
```

  </template>
</ComponentDemo>

### With screenshot

Use this variant to display a screenshot of a website.

<ComponentDemo>
  <MazWindowMockup url="https://maz-ui.com" min-height="100px">
    <img :src="screenshot" alt="Maz UI Demo Dashboard" width="100%">
  </MazWindowMockup>

  <template #code>

```vue
<template>
  <MazWindowMockup url="https://maz-ui.com" min-height="100px">
    <img src="/img/screenshots/maz-ui-home-desktop.webp" alt="Maz UI Demo Dashboard" width="100%">
  </MazWindowMockup>
</template>

<script lang="ts" setup>
  import MazWindowMockup from 'maz-ui/components/MazWindowMockup'
</script>
```

  </template>
</ComponentDemo>

## Terminal variant

Displays a centered title and a `$` prompt prefix in front of the code (when `code` is provided). The prompt prefix is **not** copied to the clipboard — the copy button only writes the raw `code` value.

<ComponentDemo>
  <MazWindowMockup variant="terminal" title="zsh" code="pnpm add maz-ui" language="bash" />

  <template #code>

```vue
<template>
  <MazWindowMockup variant="terminal" title="zsh" code="pnpm add maz-ui" language="bash" />
</template>

<script lang="ts" setup>
  import MazWindowMockup from 'maz-ui/components/MazWindowMockup'
</script>
```

  </template>
</ComponentDemo>

### Custom prompt

Replace the default `$` with any character via the `prompt` prop.

<ComponentDemo>
  <MazWindowMockup variant="terminal" code="git status" language="bash" prompt="❯" />

  <template #code>

```vue
<template>
  <MazWindowMockup variant="terminal" code="git status" language="bash" prompt="❯" />
</template>
```

  </template>
</ComponentDemo>

### Without prompt

Hide the default prompt by setting `hide-prompt` to `true`.

<ComponentDemo>
  <MazWindowMockup variant="terminal" code="git status" language="bash" :hide-prompt="true" />

  <template #code>

```vue
<template>
  <MazWindowMockup variant="terminal" code="git status" language="bash" :hide-prompt="true" />
</template>
```

  </template>
</ComponentDemo>

## Editor variant

Shows a filename tab anchored to the bottom of the title bar — matching the look of real editors like VSCode.

<ComponentDemo>
  <MazWindowMockup variant="editor" filename="App.vue" :code="vueCode" language="vue" />

  <template #code>

```vue
<template>
  <MazWindowMockup variant="editor" filename="App.vue" :code="vueCode" language="vue" />
</template>

<script lang="ts" setup>
  import MazWindowMockup from 'maz-ui/components/MazWindowMockup'

  const vueCode = `<template>
  <MazBtn>Click me</MazBtn>
</template>`
</script>
```

  </template>
</ComponentDemo>

## With code and language props

Pass `code` and `language` to display highlighted source code via `MazCodeHighlight`. The inner highlighter automatically renders with squared corners so it sits flush against the window's border.

<ComponentDemo>
  <MazWindowMockup code="import MazBtn from 'maz-ui/components/MazBtn'" language="ts" />

  <template #code>

```vue
<template>
  <MazWindowMockup code="import MazBtn from 'maz-ui/components/MazBtn'" language="ts" />
</template>

<script lang="ts" setup>
  import MazWindowMockup from 'maz-ui/components/MazWindowMockup'
</script>
```

  </template>
</ComponentDemo>

## Empty-state placeholder

When neither `code` nor a slot content is provided, the content area renders an empty placeholder. Pass the optional `label` prop to display a centered text inside it.

<ComponentDemo>
  <MazWindowMockup url="https://maz-ui.com" min-height="160px" label="Preview" />

  <template #code>

```vue
<template>
  <MazWindowMockup url="https://maz-ui.com" min-height="160px" label="Preview" />
</template>
```

  </template>
</ComponentDemo>

## Custom translations

The URL copy button's aria-label and tooltip come from the `@maz-ui/translations` package (`windowMockup.copyUrlToClipboard` / `windowMockup.urlCopiedToClipboard`). Override per-instance with the `translations` prop:

<ComponentDemo>
  <MazWindowMockup
    url="https://maz-ui.com"
    min-height="80px"
    :translations="{ copyUrlToClipboard: 'Copier l\'URL', urlCopiedToClipboard: 'URL copiée !' }"
  />

  <template #code>

```vue
<template>
  <MazWindowMockup
    url="https://maz-ui.com"
    min-height="80px"
    :translations="{
      copyUrlToClipboard: 'Copier l\'URL',
      urlCopiedToClipboard: 'URL copiée !',
    }"
  />
</template>
```

  </template>
</ComponentDemo>

For app-wide translations, set up the [maz-ui translations plugin](/translations) and the component will pick up your locale automatically.

<script lang="ts" setup>
  import screenshot from './../assets/interface-screenshot.png'

  const vueCode = `<template>
  <MazBtn>Click me</MazBtn>
</template>`
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-window-mockup.doc.md-->
