<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# @maz-ui/nuxt

✨ **The Ultimate Nuxt Module for Beautiful Vue.js Components** ✨

Transform your Nuxt application with **Maz-UI** - a comprehensive Vue.js component library that makes building beautiful interfaces effortless!

[![npm version](https://badge.fury.io/js/%40maz-ui%2Fnuxt.svg)](https://badge.fury.io/js/%40maz-ui%2Fnuxt)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## What is Maz-UI?

**Maz-UI** is a powerful Vue.js component library with **50+ beautiful components**, **20+ useful composables**, and **smart directives** that work perfectly with Nuxt. Think of it as your design system in a box!

### Why Choose Maz-UI for Your Nuxt App?

- **Zero Configuration** - Works instantly with sensible defaults
- **Beautiful by Default** - Professional design with dark mode included
- **Everything Auto-Imported** - No more import statements needed
- **Super Fast** - Optimized for performance with tree-shaking
- **Developer Friendly** - TypeScript support and great DevTools
- **Production Ready** - Perfect SSR/SSG support

## Quick Start (2 minutes!)

### Step 1: Install the module

```bash
# Choose your package manager
npm install @maz-ui/nuxt
# or
pnpm add @maz-ui/nuxt
# or
yarn add @maz-ui/nuxt
```

### Step 2: Add to your Nuxt config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
})
```

**That's it! 🎉** All components, composables, and features are now available in your app!

### Step 3: Start using components

```vue
<script setup>
// All composables are auto-imported too!
const toast = useToast()
const { isDark, toggleDarkMode } = useTheme()

function showMessage() {
  toast.success('Welcome to Maz-UI! 🎉')
}
</script>

<template>
  <div>
    <!-- All components are auto-imported! -->
    <MazBtn color="primary" @click="showMessage">
      Click me!
    </MazBtn>

    <!-- Composables work everywhere -->
    <MazCard class="mt-4">
      <h2>Welcome to Maz-UI!</h2>
      <p>Current theme: {{ isDark ? 'Dark' : 'Light' }}</p>
    </MazCard>

    <!-- Directives are ready to use -->
    <div v-tooltip="'Hello World!'">
      Hover me for tooltip
    </div>
  </div>
</template>
```

## What You Get Out of the Box

### 50+ Beautiful Components

- **Buttons**: `MazBtn`,
- **Forms**: `MazInput`, `MazSelect`, `MazCheckbox`, `MazRadio`, `MazTextarea`, `MazInputPhoneNumber`
- **Overlay**: `MazDropdown`, `MazPopover`
- **Navigation**: `MazTabs`, `MazStepper`, `MazPagination`
- **Data Display**: `MazTable`, `MazCard`, `MazBadge`, `MazAvatar`
- **Media**: `MazCarousel`, `MazGallery`, `MazLazyImg`
- **Feedback**: `MazDialog`, `MazToast`, `MazSpinner`, `MazLoadingBar`
- **Charts**: `MazChart` (with Chart.js integration)
- **And 30+ more!**

### 20+ Powerful Composables

- **`useTheme()`** - Theme management and dark mode
- **`useToast()`** - Beautiful toast notifications
- **`useDialog()`** - Modal dialogs made easy
- **`useAos()`** - Smooth scroll animations
- **`useTimer()`** - Countdown and timer functionality
- **`useWindowSize()`** - Reactive window dimensions
- **`useBreakpoints()`** - Responsive design helpers
- **And many more!**

### Smart Directives

- **`v-tooltip`** - Beautiful tooltips anywhere
- **`v-lazy-img`** - Lazy load images automatically
- **`v-zoom-img`** - Click to zoom images
- **`v-click-outside`** - Detect outside clicks
- **`v-fullscreen-img`** - Fullscreen image viewer

## Theming Made Simple

Maz-UI comes with a powerful theming system that makes your app look professional instantly:

```vue
<script setup>
// Switch between built-in themes
const { updateTheme, toggleDarkMode } = useTheme()

async function changeToOceanTheme() {
  const { ocean } = await import('@maz-ui/themes')
  updateTheme(ocean)
}
</script>

<template>
  <div>
    <MazBtn @click="toggleDarkMode">
      🌙 Toggle Dark Mode
    </MazBtn>

    <MazBtn @click="changeToOceanTheme">
      🌊 Ocean Theme
    </MazBtn>
  </div>
</template>
```

**Built-in themes**: `mazUi`, `ocean`, `pristine`, `obsidian` + create your own!

## Configuration Options

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // General Settings
    general: {
      autoImportPrefix: 'Maz', // useMazToast instead of useToast
      defaultMazIconPath: '/icons', // Path to your SVG icons
      devtools: true, // Enable DevTools integration
    },

    // Theme System
    theme: {
      preset: 'ocean', // Choose: 'mazUi', 'ocean', 'pristine', 'obsidian'
      strategy: 'hybrid', // 'runtime' | 'buildtime' | 'hybrid'
      darkModeStrategy: 'class', // 'class' | 'media' | 'auto'
    },

    // Translations
    translations: {
      locale: 'fr', // Default language
      fallbackLocale: 'en',
    },

    // Components (all enabled by default)
    components: {
      autoImport: true, // Auto-import all components globally
    },

    // Composables (customize what you need)
    composables: {
      useTheme: true,
      useToast: true,
      useDialog: true,
      useAos: {
        injectCss: true, // Include AOS animations CSS
        router: true, // Re-trigger on route change
      },
      // ... all others enabled by default
    },

    // Directives
    directives: {
      vTooltip: true,
      vLazyImg: { threshold: 0.1 }, // Custom intersection threshold
      vClickOutside: true,
      vFullscreenImg: true,
      vZoomImg: true,
    },
  },
})
```

## Advanced Features

### Custom Theme Creation

```ts
import { definePreset } from '@maz-ui/themes'
// themes/my-theme.ts
export const myCustomTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    colors: {
      primary: '350 100% 50%',
      secondary: '350 14% 96%',
      background: '0 0% 100%',
      // ... more colors
    },
  },
})
```

```ts
// nuxt.config.ts
import { myCustomTheme } from './themes/my-theme'

export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: myCustomTheme,
    },
  },
})
```

## SSR/SSG Support

This module is built specifically for Nuxt with perfect SSR and SSG support:

- ✅ **Server-Side Rendering** - Components render perfectly on the server
- ✅ **Static Site Generation** - Works great with `nuxt generate`
- ✅ **Hydration** - Smooth client-side takeover
- ✅ **Theme Persistence** - Dark mode preference remembered
- ✅ **No FOUC** - Flash of unstyled content prevented

## Why This Module vs Manual Setup?

| Feature          | Manual Setup          | @maz-ui/nuxt Module           |
| ---------------- | --------------------- | ----------------------------- |
| **Setup Time**   | 30+ minutes           | 2 minutes                     |
| **Auto Imports** | Manual imports needed | ✅ Everything auto-imported   |
| **SSR Support**  | Complex configuration | ✅ Works out of the box       |
| **Theme System** | Manual CSS management | ✅ Automatic theme switching  |
| **Bundle Size**  | Full library imported | ✅ Tree-shaking optimized     |
| **DevTools**     | No integration        | ✅ Nuxt DevTools support      |
| **TypeScript**   | Manual type setup     | ✅ Perfect TypeScript support |

## Learn More

- **[Full Documentation](https://maz-ui.com/guide/nuxt)**
- **[Report Issues](https://github.com/LouisMazel/maz-ui/issues)**
- **[Discussions](https://github.com/LouisMazel/maz-ui/discussions)**

## Contributing

We love contributions! Check out our [Contributing Guide](https://github.com/LouisMazel/maz-ui/blob/main/CONTRIBUTING.md).

## License

MIT License © 2025 [LouisMazel](https://github.com/LouisMazel)

---

<div align="center">

**Built with ❤️ for the Vue.js and Nuxt community**

[⭐ Give it a star on GitHub!](https://github.com/LouisMazel/maz-ui)

</div>
