---
title: Nuxt Module
description: This module enables auto imports of CSS files, components, composables and installs plugins and directives
---

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

See all [available options here](#module-options)

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
  ...
  // You can also use the public runtime config
  runtimeConfig: {
    public: {
      mazUi: {
        ...
      }
    }
  }
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

  autoSetTheme()
</script>
```

## Module Options

```ts
export interface MazUiNuxtOptions {
  /**
   * Prefix for composables
   * @description This prefix will be added after `use` keyword
   * @example `composablePrefix: 'Maz'` will generate `useMazToast` composable instead of `useToast`
   * @default ''
   */
  autoImportPrefix?: string
  /**
   * Enable auto-import of main css file
   * @default true
   */
  injectCss?: boolean
  /**
   * Install aos plugin and enable auto-import of useAos composable
   * @default true
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
   * @default true
   */
  injectUseToast?: boolean | ToasterOptions
  /**
   * Install wait plugin and enable auto-import of useWait composable
   * @default true
   */
  injectUseWait?: boolean
  /**
   * Enable auto-import of useThemeHandler composable
   * @default true
   */
  injectUseThemeHandler?: boolean | ThemeHandlerOptions
  /**
   * Enable auto-import of useIdleTimeout composable
   * @default true
   */
  injectUseIdleTimeout?: boolean
  /**
   * Enable auto-import of useUserVisibility composable
   * @default true
   */
  injectUseUserVisibility?: boolean
  /**
   * Enable auto-import of useTimer composable
   * @default true
   */
  injectUseTimer?: boolean
  /**
   * Enable auto-import of useWindowSize composable
   * @default true
   */
  injectUseWindowSize?: boolean
  /**
   * Enable auto-import of useBreakpoints composable
   * @default true
   */
  injectUseBreakpoints?: boolean
  /**
   * Globally install of v-zoom-img directive
   * @default true
   */
  installVZoomImg?: boolean
  /**
   * Globally install of v-click-outside directive
   * @default true
   */
  installVClickOutside?: boolean
  /**
   * Globally install of v-fullscreen-img directive
   * @default true
   */
  installVFullscreenImg?: boolean
  /**
   * Globally install of v-lazy-img directive
   * @default true
   */
  installVLazyImg?: boolean | vLazyImgOptions
  /**
   * Globally install of v-tooltip directive
   * @default true
   */
  installVTooltip?: boolean | vTooltipOptions
  /**
   * Enable auto-import of all components
   * @default true
   */
  injectComponents?: boolean
  /**
   * Default path to public svg icons folder for `<MazIcon />` component
   * @default undefined
   */
  defaultMazIconPath?: string
  /**
   * Enable Nuxt Devtools integration
   * @default true
   */
  devtools?: boolean
}
```
