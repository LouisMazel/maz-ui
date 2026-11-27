---
title: Install maz-ui with Vue
description: Maz-UI is a Vue.js UI library that provides a set of pre-built components, plugins, directives and utilities to help you build modern, responsive, and accessible web applications.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip Model Context Protocol (MCP)

A MCP server is available to connect your IA agents to the documentation and implement Maz-UI easily.

Check out the documentation of [@maz-ui/mcp](../ecosystem/mcp.md)

:::

## Quick Start {#quick-start}

### Installation {#installation}

::: code-group

```bash [pnpm]
pnpm add maz-ui @maz-ui/themes
```

```bash [npm]
npm install maz-ui @maz-ui/themes
```

```bash [yarn]
yarn add maz-ui @maz-ui/themes
```

:::

### Install plugin

```ts
import { MazUi } from 'maz-ui/plugins/maz-ui'

import { mazUi } from '@maz-ui/themes'
import { en } from '@maz-ui/translations/locales'

import 'maz-ui/style.css'

app.use(MazUi, {
  theme: {
    preset: mazUi,
  },
  translations: {
    messages: { en },
  },
})
```

The MazUi plugin also takes the global options of the toasts and dialogs, and enables the animations on scroll:

```ts
app.use(MazUi, {
  theme: { preset: mazUi },
  // Global options of useToast()
  toast: { position: 'top-right' },
  // Global options of useDialog()
  dialog: { acceptText: 'Yes' },
  // Animations on scroll (disabled by default), with `import 'maz-ui/aos.css'`
  aos: true,
  // Open the external links outside of the WebView (Tauri, Electron), see the desktop apps guide
  openExternal: href => openUrl(href),
})
```

See [Desktop apps](./desktop-apps.md) for `openExternal` and `isExternalLink`.

::: tip Why provide preset and messages?
- **`preset`** -- Providing the theme preset synchronously avoids FOUC (Flash of Unstyled Content). Without it, components render without their CSS variables until the theme loads.
- **`messages`** -- By default, Maz-UI does not bundle any translations. If you don't provide messages for the current locale, components will briefly show raw translation keys instead of actual text until the async loading completes.
:::

### Add the Vite plugin

[`MazUi()`](../ecosystem/vite-plugin.md) of `@maz-ui/vite-plugin` gives the icons by name (`<MazIcon icon="x-mark" />`, only the icons of each page are bundled) and removes the unused CSS of maz-ui at build time:

::: code-group

```bash [pnpm]
pnpm add -D @maz-ui/vite-plugin
```

```bash [npm]
npm install -D @maz-ui/vite-plugin
```

```bash [yarn]
yarn add -D @maz-ui/vite-plugin
```

:::

```ts
// vite.config.ts
import { MazUi } from '@maz-ui/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), MazUi()],
})
```

It writes `src/maz-icons.d.ts`, the types of the names: commit it, the CI and a fresh clone get the names without running Vite. See [icons by name](../ecosystem/vite-plugin.md#icons-by-name) and [CSS purge](../ecosystem/vite-plugin.md#css-purge).

Without Tailwind CSS, import `maz-ui/utilities.css` for the maz-ui utilities (`text-title-1`, `rich-text`, `padded-container`, `flex-center`...), the plugin purges it too. With Tailwind CSS, keep `@import 'maz-ui/tailwindcss/utilities.css'` in your Tailwind entry instead.

## Advanced Integration

You must the MazUi plugin to initialize the theme and translations.

- [Theme documentation](../ecosystem/themes.md)
- [Translations documentation](../ecosystem/translations.md)

```typescript
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets'
import { fr } from '@maz-ui/translations/locales'
// or import fr from '@maz-ui/translations/locales/fr'

// Import Maz-UI styles before your own CSS
import 'maz-ui/style.css'
import './style.css'

app.use(MazUi, {
  /**
   * Theme configuration (optional if you are using the default theme)
   * More information in dedicated documentation
   * @see https://maz-ui.com/ecosystem/themes
   */
  theme: {
    preset: mazUi, // 'ocean' | 'pristine' | 'obsidian' | 'nova' | 'folio' | 'macos' | 'windows' | 'linux'
    overrides: {
      foundation: {
        'space': '0.25rem',
        'border-width': '0.0625rem',
      },
      scales: {
        rounded: { md: '0.7rem' },
      },
      colors: {
        light: {
          primary: 'oklch(0.65 0.19 254)',
        }
      }
    }
  },
  /**
   * Translations configuration (optional if you are using english)
   * More information in dedicated documentation
   * @see https://maz-ui.com/ecosystem/translations
   */
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
      fr,
    },
  },
})

app.mount('#app')
```

::: tip Alternative: MazUiProvider
If Maz-UI is only used on specific pages, you can use the [`MazUiProvider`](./maz-ui-provider.md) component instead of the plugin to keep Maz-UI out of your entry bundle.
:::

## Using your first component

Let's start with a simple button to see Maz-UI in action:

```vue
<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn'

function handleClick() {
  console.log('Button clicked!')
}
</script>

<template>
  <MazBtn color="primary" start-icon="sparkles" @click="handleClick">
    Hello Maz-UI!
  </MazBtn>
</template>
```

## Icons

860+ icons by name, as components or as SVG: see [@maz-ui/icons](../ecosystem/icons/index.md) and the [icon set](../ecosystem/icons/icon-set.md).

## Theming

More information in the [theme documentation](/ecosystem/themes).

## Translations

More information in the [translations documentation](/ecosystem/translations).

## Toast, dialog, wait and aos

No plugin to install for the toasts, the dialogs and the loading states: use their composable. Their global options go in the [MazUi plugin](#install-plugin).
- [toast](./../plugins/toast.md) with `useToast()` (display notifications)
- [dialog](./../plugins/dialog.md) with `useDialog()` (display modales without any implementation in template)
- [wait](./../plugins/wait.md) with `useWait()` (display loading states, works anywhere, even outside of a component)
- [aos](./../plugins/aos.md) (animations on scroll), enabled with the `aos` option of the MazUi plugin

## Directives

More information about installation and usage in:
- [tooltip](./../directives/tooltip.md) (display tooltips)
- [click-outside](./../directives/click-outside.md) (detect outside clicks)
- [lazy-img](./../directives/lazy-img.md) (lazy load images)
- [zoom-img](./../directives/zoom-img.md) (zoom images on click)
- [fullscreen-img](./../directives/fullscreen-img.md) (display images fullscreen on click with an animate effect)

## Smart Loading with resolvers

### Installation

::: code-group

```bash [pnpm]
pnpm add unplugin-vue-components unplugin-auto-import
```

```bash [npm]
npm install unplugin-vue-components unplugin-auto-import
```

```bash [yarn]
yarn add unplugin-vue-components unplugin-auto-import
```

:::

For the ultimate developer experience, use auto-imports for components, composables, and directives.

Into your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  MazComponentsResolver,
  MazDirectivesResolver,
  MazModulesResolver
} from 'maz-ui/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'


export default defineConfig({
  plugins: [
    vue(),
    // Auto-import components
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver(),
      ],
      dts: true,
    }),
    // Auto-import composables and utilities
    AutoImport({
      resolvers: [MazModulesResolver()],
      dts: true,
    }),
  ],
})
```

Now use everything without imports:

```vue
<script setup lang="ts">
// Auto-imported composables and utilities
const text = ref('')
const toast = useToast()

// Auto-imported utility functions
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query)
}, 300)

function handleClickOutside() {
  toast.info('Clicked outside!')
}
</script>

<template>
  <!-- Auto-imported components -->
  <MazBtn>Button</MazBtn>
  <MazInput v-model="text" placeholder="Type here..." />

  <!-- Auto-imported directives -->
  <div v-click-outside="handleClickOutside">
    Click outside detector
  </div>

  <!-- Auto-imported tooltip directive -->
  <MazBtn v-tooltip="'This is a tooltip'">
    Hover me
  </MazBtn>
</template>
```

### Available Resolvers

| Resolver                | Purpose                                            | Import               |
| ----------------------- | -------------------------------------------------- | -------------------- |
| `MazComponentsResolver` | Components (MazBtn, MazInput, etc.)                | `'maz-ui/resolvers'` |
| `MazDirectivesResolver` | Directives (v-click-outside, v-tooltip, etc.)      | `'maz-ui/resolvers'` |
| `MazModulesResolver`    | Composables & utilities (useToast, debounce, etc.) | `'maz-ui/resolvers'` |

### Avoiding Naming Conflicts

To avoid naming conflicts, you can use the `prefix` option:

```typescript
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver({ prefix: 'Maz' }), // v-maz-tooltip
      ],
    }),
    AutoImport({
      resolvers: [
        MazModulesResolver({ prefix: 'Maz' }), // useMazToast, useMazTheme
      ],
    }),
  ],
})
```

::: info Complete Resolver Documentation
For comprehensive resolver configuration, advanced options, real-world examples, and troubleshooting, check out our [dedicated resolver guide](/guide/resolvers).
:::
