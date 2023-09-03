---
title: Nuxt Module
description: This module enables auto imports of components, composables and installs plugins and directives
---

<!-- markdownlint-disable MD033 MD025 -->

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: info
Module compatible with Nuxt v3 or later
:::

## Installation

<NpmBadge package="maz-ui" />

```bash
npm install maz-ui
# or yarn add maz-ui
# or pnpm add maz-ui
```

Add it to your Nuxt modules:

```ts
export default defineNuxtConfig({
  ...
  modules: ['maz-ui/nuxt'],
  mazUi: {
    injectToaster: true,
  },
  ...
})
```

## Basic usage

The components, plugins and tools are auto-imported

```vue
<template>
  <MazBtn>
    Button auto-imported
  </MazBtn>
</template>

<script lang="ts" setup>
  const toast = useToast()

  toast.show('Success message')
</script>
```

## Module Options

```ts
export interface ModuleOptions {
  /**
   * Install the toaster plugin and enable auto import of toaster composable
   */
  injectToaster?: boolean
  /**
   * Enable auto import of useCurrency composable
   */
  injectUseCurrency?: boolean
  /**
   * Enable auto import of useThemeHandler composable
   */
  injectUseThemeHandler?: boolean
  /**
   * install global of v-fullscreen-img directive
   */
  installFullscreenImgDirective?: boolean
  /**
   * Enable auto import of all components
   * @default true
   */
  injectComponents?: boolean
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
}
```
