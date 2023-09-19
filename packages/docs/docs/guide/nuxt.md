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

[Available options](#module-options)

```ts
export default defineNuxtConfig({
  modules: ['maz-ui/nuxt'],
  mazUi: {
    injectComponents: true,
    injectCss: true,
    injectAosCss: false,
    injectToaster: true,
    injectUseThemeHandler: true,
    devtools: true,
  },
})
```

## Basic usage

The components, plugins and tools are auto-imported

```vue
<template>
  <MazBtn @click="toggleTheme">
    Button auto-imported
  </MazBtn>
</template>

<script lang="ts" setup>
  const toast = useToast()
  const {
    autoSetTheme,
    toggleTheme,
  } = useThemeHandler()

  toast.show('Success message')

  onMounted(() =>
    autoSetTheme()
  })
</script>
```

## Module Options

```ts
export interface ModuleOptions {
  /**
   * Enable auto import of main css file
   * @default true
   */
  injectCss?: boolean
  /**
   * Enable auto import of main css file
   * @default false
   */
  injectAosCss?: boolean
  /**
   * Install the toaster plugin and enable auto import of toaster composable
   * @default false
   */
  injectToaster?: boolean
  /**
   * Enable auto import of useTheme composable
   * @default false
   */
  injectUseThemeHandler?: boolean
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
