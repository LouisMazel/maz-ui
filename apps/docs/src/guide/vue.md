---
title: Install maz-ui with Vue
description: Maz-UI is a Vue.js UI library that provides a set of pre-built components, plugins, directives and utilities to help you build modern, responsive, and accessible web applications.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip Model Context Protocol (MCP)

A MCP server is available to connect your IA agents to the documentation and implement Maz-UI easily.

Check out the documentation of [@maz-ui/mcp](./mcp.md)

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
import { en } from '@maz-ui/translations'

import 'maz-ui/styles'

app.use(MazUi, {
  theme: {
    preset: mazUi,
  },
  translations: {
    messages: { en },
  },
})
```

## Advanced Integration

You must the MazUi plugin to initialize the theme and translations.

- [Theme documentation](./themes.md)
- [Translations documentation](./translations.md)

```typescript
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets'
import { fr } from '@maz-ui/translations'

// Import Maz-UI styles before your own CSS
import 'maz-ui/styles'
import './style.css'

app.use(MazUi, {
  /**
   * Theme configuration (optional if you are using the default theme)
   * More information in dedicated documentation
   * @see https://maz-ui.com/guide/themes
   */
  theme: {
    preset: mazUi, // 'ocean' | 'pristine' | 'obsidian'
    overrides: {
      foundation: {
        'radius': '0.7rem',
        'border-width': '0.0625rem',
      },
      colors: {
        light: {
          primary: '220 100% 50%',
        }
      }
    }
  },
  /**
   * Translations configuration (optional if you are using english)
   * More information in dedicated documentation
   * @see https://maz-ui.com/guide/translations
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
  <MazBtn color="primary" @click="handleClick">
    Hello Maz-UI! 👋
  </MazBtn>
</template>
```

## Theming

More information in the [theme documentation](/guide/themes).

## Translations

More information in the [translations documentation](/guide/translations).

## Plugins

More information about installation and usage in:
- [aos](./../plugins/aos.md) (animations on scroll)
- [dialog](./../plugins/dialog.md) (display modales without any implementation in template)
- [toast](./../plugins/toast.md) (display notifications)
- [wait](./../plugins/wait.md) (display loading states)

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
