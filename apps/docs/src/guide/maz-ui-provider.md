---
title: MazUiProvider
description: A component-based alternative to the MazUi plugin for initializing theme and translations, ideal for lazy-loaded pages and micro-frontends.
head:
  - - meta
    - name: keywords
      content: maz-ui provider, vue provider component, lazy loading, theme provider, translations provider, tree-shaking, code splitting, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Why MazUiProvider?

The standard approach to initialize Maz-UI is the [`MazUi` plugin](./vue.md#install-plugin) in your `main.ts`. This works well, but it means theme and translation setup code is loaded in your **entry bundle** -- even on pages that don't use Maz-UI components.

`MazUiProvider` solves this by moving the initialization into a **component** that you place in a lazy-loaded route or subtree. The result: **zero Maz-UI footprint in your entry bundle**.

## Before & After

### Before: Plugin in main.ts (entry bundle)

```typescript
// main.ts -- loaded on EVERY page
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { fr } from '@maz-ui/translations'
import 'maz-ui/styles'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'hybrid',
  },
  translations: {
    locale: 'fr',
    messages: { fr },
  },
})
```

All of `@maz-ui/themes`, `@maz-ui/translations`, and the preset data end up in the initial bundle.

### After: Provider in a lazy-loaded page

```typescript
// main.ts -- clean, no Maz-UI code
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      // Lazy-loaded -- Maz-UI code only loads when user navigates here
      component: () => import('./pages/Dashboard.vue'),
    },
  ],
})

createApp(App).use(router).mount('#app')
```

```vue
<!-- pages/Dashboard.vue -- lazy-loaded -->
<script setup lang="ts">
import { MazUiProvider } from 'maz-ui/components'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { fr } from '@maz-ui/translations'
</script>

<template>
  <MazUiProvider
    :theme="{ preset: mazUi, strategy: 'hybrid' }"
    :translations="{ locale: 'fr', messages: { fr } }"
  >
    <!-- All Maz-UI components inside this subtree work as expected -->
    <MazBtn color="primary">Dashboard Action</MazBtn>
    <MazInput placeholder="Search..." />
  </MazUiProvider>
</template>
```

The entire Maz-UI setup is now code-split into the Dashboard chunk.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | `object` | Yes | Theme configuration. Must include `preset`. See [Theming](./themes.md) for details. |
| `translations` | `object` | Yes | Translations configuration. Must include `locale` and `messages` with at least the current locale's messages. See [Translations](./translations.md) for details. |

### theme

```typescript
interface ThemeOptions {
  preset: ThemePreset              // Required - Theme preset (mazUi, ocean, pristine, obsidian, or custom)
  overrides?: ThemePresetOverrides // Partial overrides for colors, foundation, etc.
  strategy?: 'runtime' | 'buildtime' | 'hybrid' // CSS generation strategy (default: 'hybrid')
  darkModeStrategy?: 'class' | 'media'           // Dark mode handling (default: 'class')
  colorMode?: 'light' | 'dark' | 'auto'          // Initial color mode (default: 'auto')
  mode?: 'light' | 'dark' | 'both'               // Supported color modes (default: 'both')
}
```

::: warning Why is preset required?
Providing the theme preset synchronously avoids FOUC (Flash of Unstyled Content). Without a preset, components would render without their CSS variables until the theme loads, causing a visible flash.
:::

### translations

```typescript
interface TranslationsOptions {
  locale: string                     // Required - Active locale (e.g. 'fr')
  messages: MazUiTranslationsMessages // Required - Must contain at least the locale's messages
  fallbackLocale?: string            // Fallback locale (default: 'en')
  preloadFallback?: boolean          // Preload fallback locale (default: true)
}
```

::: warning Why are locale and messages required?
By default, Maz-UI does not bundle any translations to keep your bundle small. Translation files are loaded asynchronously on demand.

If you don't provide the messages for the current locale synchronously, components like `MazInputPhoneNumber` will briefly show translation keys (e.g. `inputPhoneNumber.countrySelect.placeholder`) instead of actual text until the async loading completes.

Providing messages upfront avoids this flash:

```typescript
import { fr } from '@maz-ui/translations'

// Messages for 'fr' are available immediately -- no flash
const translations = { locale: 'fr', messages: { fr } }
```
:::

## Plugin vs Provider

| | Plugin (`MazUi`) | Component (`MazUiProvider`) |
|---|---|---|
| **Setup location** | `main.ts` via `app.use()` | Any `.vue` template |
| **Bundle impact** | Loaded in the entry bundle | Can be lazy-loaded with the page |
| **Scope** | Global (entire app) | Subtree (children of the provider) |
| **Reconfigurable** | Configured once at install | Reactive to prop changes |
| **Best for** | Apps that use Maz-UI on every page | Apps with Maz-UI on specific pages, micro-frontends, testing |

### When to use the plugin

- Your app uses Maz-UI components on most or all pages
- You want a simple, one-time setup
- You're using Nuxt (the [Nuxt module](./nuxt.md) handles everything automatically)

### When to use the provider

- Maz-UI is only used on certain lazy-loaded routes
- You want zero Maz-UI overhead in the initial bundle
- You're building a micro-frontend or embedding Maz-UI in a larger app
- You need different theme/translation configurations in different parts of your app
- You want theme configuration to be reactive to prop changes

## Using Both Together

If you use both the plugin and the provider, **the provider takes precedence in its subtree**. Children of `MazUiProvider` will use the provider's theme and translations, while the rest of the app uses the plugin's configuration.

```vue
<!-- App.vue -->
<!-- Plugin provides global defaults -->
<script setup lang="ts">
import { MazUiProvider } from 'maz-ui/components'
import { ocean } from '@maz-ui/themes/presets/ocean'
import { en } from '@maz-ui/translations'
</script>

<template>
  <div>
    <!-- Uses plugin theme (mazUi preset) -->
    <MazBtn color="primary">Global Theme</MazBtn>

    <!-- Provider overrides in this subtree -->
    <MazUiProvider
      :theme="{ preset: ocean }"
      :translations="{ locale: 'en', messages: { en } }"
    >
      <!-- Uses ocean preset -->
      <MazBtn color="primary">Ocean Theme</MazBtn>
    </MazUiProvider>
  </div>
</template>
```

This is possible because both the plugin and the provider use the same Vue `provide` injection keys (`mazThemeState` and `mazTranslations`). Vue's `provide`/`inject` mechanism ensures the nearest ancestor provider wins.

## Full Example

```vue
<script setup lang="ts">
import { MazUiProvider } from 'maz-ui/components'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { fr } from '@maz-ui/translations'
import { ref } from 'vue'

const locale = ref('fr')
</script>

<template>
  <MazUiProvider
    :theme="{
      preset: mazUi,
      strategy: 'hybrid',
      colorMode: 'auto',
    }"
    :translations="{
      locale,
      fallbackLocale: 'en',
      messages: { fr },
    }"
  >
    <div class="maz-bg-background maz-text-foreground maz-p-4">
      <h1>My Dashboard</h1>
      <MazBtn color="primary">Action</MazBtn>
      <MazInput placeholder="Search..." />
    </div>
  </MazUiProvider>
</template>
```
