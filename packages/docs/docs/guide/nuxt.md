---
title: Nuxt Module
description: This module enables auto imports of CSS files, components, composables and installs plugins and directives
---

<!-- markdownlint-disable MD033 MD025 -->

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: info
Module compatible with Nuxt v3 or later
:::

## Installation

<div class="maz-flex maz-gap-0.5">
  <NpmBadge package="maz-ui" />
</div>

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
    injectAos: {
      injectCss: true,
    },
    injectUseToast: true,
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
   * Enable auto-import of main css file
   * @default true
   */
  injectCss?: boolean
  /**
   * Install aos plugin and enable auto-import of useAos composable
   * @default false
   */
  injectAos?:
    | boolean
    | (Omit<AosOptions, 'router'> & {
        /**
         * Auto inject aos CSS file
         * @default true
         */
        injectCss?: boolean
        /**
         * Set `true` to re-run animations on page change
         * @default false
         */
        router?: boolean
      })
  /**
   * Install toaster plugin and enable auto-import of useToast composable
   * @default false
   */
  injectUseToast?: boolean | ToasterOptions
  /**
   * Install wait plugin and enable auto-import of useWait composable
   * @default false
   */
  injectUseWait?: boolean
  /**
   * Enable auto-import of useThemeHandler composable
   * @default false
   */
  injectUseThemeHandler?: boolean | ThemeHandlerOptions
  /**
   * Enable auto-import of useIdleTimeout composable
   * @default false
   */
  injectUseIdleTimeout?: boolean
  /**
   * Enable auto-import of useUserVisibility composable
   * @default false
   */
  injectUseUserVisibility?: boolean
  /**
   * Globally install of v-zoom-img directive
   * @default false
   */
  installVZoomImg?: boolean
  /**
   * Globally install of v-click-outside directive
   * @default false
   */
  installVClickOutside?: boolean
  /**
   * Globally install of v-fullscreen-img directive
   * @default false
   */
  installVFullscreenImg?: boolean
  /**
   * Globally install of v-lazy-img directive
   * @default false
   */
  installVLazyImg?: boolean | vLazyImgOptions
  /**
   * Enable auto-import of all components
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
