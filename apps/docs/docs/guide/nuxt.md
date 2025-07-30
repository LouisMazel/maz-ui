---
title: Install maz-ui with Nuxt
description: The ultimate Nuxt module for Maz-UI - zero-config setup with auto-imports, theming, and powerful features out of the box
---

# {{ $frontmatter.title }}

Transform your Nuxt application with the most comprehensive Vue.js UI library integration. **Maz-UI Nuxt Module** provides zero-configuration setup, intelligent auto-imports, and powerful theming capabilities.

## ✨ Why Choose Maz-UI for Nuxt?

- **🚀 Zero Configuration** - Works out of the box with sensible defaults
- **🎨 Advanced Theming** - Built-in dark mode, custom themes, and CSS variables
- **📦 Auto-Import Everything** - Components, composables, and directives automatically available
- **⚡ Performance Optimized** - Tree-shaking, lazy loading, and hybrid CSS strategies
- **🛠️ Developer Experience** - TypeScript support, DevTools integration, and IntelliSense
- **🎯 Production Ready** - SSR/SSG support with client-side hydration

## Prerequisites

- **Node.js** v18+
- **Nuxt** 3.0+

## 🚀 Installation

<div class="maz-flex maz-gap-0.5">
  <NpmBadge package="maz-ui" />
  <NpmBadge package="@maz-ui/nuxt" />
</div>

::: code-group

```bash [pnpm]
pnpm add @maz-ui/nuxt maz-ui
```

```bash [npm]
npm install @maz-ui/nuxt maz-ui
```

```bash [yarn]
yarn add @maz-ui/nuxt maz-ui
```

:::

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt']
})
```

That's it! 🎉 All components and composables are now auto-imported and ready to use.

## 🎯 Quick Start

### Instant Usage

No imports needed - everything is auto-imported:

```vue
<script setup>
// Composables are auto-imported
const { start, stop, pause, resume, remainingTime } = useTimer({
  timeout: 4000,
  callback: () => console.log('Timeout end')
})
const { toggleDarkMode, isDark } = useTheme()
</script>

<template>
  <div class="maz-bg-background p-8 maz-text-foreground">
    <!-- Components are auto-imported -->
    <MazBtn color="primary" @click="start">
      Start timer ({{ remainingTime }}ms)
    </MazBtn>

    <!-- Directives work globally -->
    <MazBtn @click="toggleDarkMode">
      Toggle dark mode ({{ isDark ? '🌙' : '☀️' }})
    </MazBtn>
  </div>
</template>
```

## ⚙️ Configuration

### Minimal Setup

For most use cases, no configuration is needed:

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt']
  // That's it! 🎉
})
```

### Advanced Configuration

Customize everything to your needs:

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // 🎛️ General Settings
    general: {
      autoImportPrefix: 'Maz', // useMazToast instead of useToast
      defaultMazIconPath: '/icons', // Default path for <MazIcon />
      devtools: true, // Enable DevTools integration
    },

    // 🎨 CSS & Styling
    css: {
      injectMainCss: true, // Auto-inject Maz-UI styles
    },

    // 🌈 Theming System
    theme: {
      preset: 'mazUi', // or 'dark', 'ocean', or custom object
      strategy: 'hybrid', // 'runtime' | 'buildtime' | 'hybrid'
      darkModeStrategy: 'class', // 'class' | 'media' | 'auto'
      overrides: {
        colors: {
          light: { primary: '220 100% 50%' },
          dark: { primary: '220 100% 70%' }
        }
      },
      mode: 'both', // 'light' | 'dark' | 'both'
    },

    // 🌐 Translations
    translations: {
      locales: 'fr',
      fallbackLocale: 'en',
      messages: {
        // override default messages or add new languages
      },
    },

    // 🧩 Components
    components: {
      autoImport: true, // All components globally available
    },

    // 🔌 Plugins (not enabled by default)
    plugins: {
      aos: true,
      dialog: true,
      toast: true,
      wait: true,
    },

    // 🎪 Composables (enabled by default)
    composables: {
      useFormValidator: true,
      useFreezeValue: true,
      useIdleTimeout: false,
      useInstanceUniqId: false,
      useMountComponent: false,
      useReadingTime: false,
      useStringMatching: false,
    },

    // 🎯 Directives (not enabled by default)
    directives: {
      vTooltip: true,
      vLazyImg: true,
      vClickOutside: true,
      vFullscreenImg: true,
      vZoomImg: true,
    },
  }
})
```

## 📚 Complete Configuration Reference

### 🎛️ General Configuration

```ts
const general = {
  // Add prefix to all auto-imported composables
  autoImportPrefix: 'Maz', // only for composables, generates useMazToast, useMazTheme, etc.

  // Default icon path for <MazIcon name="..." />
  defaultMazIconPath: '/icons',

  // Enable Nuxt DevTools integration
  devtools: true,
}
```

### 🎨 CSS Configuration

```ts
const css = {
  // Auto-inject Maz-UI base styles
  injectMainCss: true,
}
```

### 🌈 Theme System

The most powerful theming system for Nuxt applications:

```ts
const theme = {
  // Use predefined presets or create custom ones
  preset: 'mazUi', // 'mazUi' | 'dark' | 'ocean' | CustomThemeObject

  // Override specific parts of the theme
  overrides: {
    colors: {
      light: {
        primary: '220 100% 50%',
        secondary: '220 14% 96%',
        background: '0 0% 100%',
        foreground: '222 84% 5%',
      },
      dark: {
        primary: '220 100% 70%',
        secondary: '220 14% 4%',
        background: '222 84% 5%',
        foreground: '210 40% 98%',
      }
    },
    // Override other theme properties...
  },

  // Supported color modes to use
  mode: 'both', // 'light' | 'dark' | 'both'

  // Initial color mode to use (only if mode is 'both')
  colorMode: 'auto', // 'light' | 'dark' | 'auto'

  // CSS generation strategy
  strategy: 'hybrid', // 'runtime' | 'buildtime' | 'hybrid' (recommended)

  // Dark mode handling
  darkModeStrategy: 'class', // 'class' | 'media' | 'auto'
}
```

**Theme Strategies Explained:**

- **`hybrid`** (recommended): Critical CSS inlined, full CSS loaded asynchronously
- **`runtime`**: CSS generated and injected on client-side
- **`buildtime`**: CSS generated at build time and included in bundle

### 🧩 Components

```ts
const components = {
  // Auto-import all 50+ Maz-UI components
  autoImport: true,
}
```

**Available Components:**
`MazBtn`, `MazInput`, `MazSelect`, `MazDialog`, `MazToast`, `MazIcon`, `MazCard`, `MazTable`, `MazChart`, `MazCarousel`, `MazGallery`, and 50+ more!

### 🎪 Composables

All composables are auto-imported and ready to use:

```ts
const composables = {
  // 🎨 Theming
  useTheme: true, // Theme management and dark mode

  // 🌐 Translations
  useTranslations: true, // Translation management

  // 📱 Responsive & Detection
  useWindowSize: true, // Reactive window dimensions
  useBreakpoints: true, // Responsive breakpoints
  useUserVisibility: true, // Page visibility detection
  useIdleTimeout: true, // User idle detection

  // 🛠️ Utilities
  useTimer: true, // Timer and countdown
  useFormValidator: true, // Form validation
  useStringMatching: true, // String utilities
  useReadingTime: true, // Reading time calculation
  useDisplayNames: true, // Display localized names
  useSwipe: true, // Swipe gestures

  // 🔧 Advanced
  useFreezeValue: true, // Freeze reactive values
  useInjectStrict: true, // Strict dependency injection
  useInstanceUniqId: true, // Unique IDs generation
  useMountComponent: true, // Dynamic component mounting
}
```

### 🔌 Plugins

```ts
const plugins = {
  // 🎬 Animations
  aos: true,
  // 🎭 Display modales without any implementation in template
  dialog: true,
  // 🎭 UI Notifications
  toast: true,
  // 🔄 Loading States
  wait: true,
}
```

### 🎯 Directives

Powerful Vue directives for enhanced functionality:

```ts
const directives = {
  // Image directives
  vLazyImg: { threshold: 0.1 }, // Lazy loading with intersection observer
  vZoomImg: true, // Click to zoom images
  vFullscreenImg: true, // Fullscreen image viewer

  // Interaction directives
  vTooltip: { position: 'top' }, // Flexible tooltips
  vClickOutside: true, // Detect outside clicks
}
```

## 🎨 Advanced Theming

### Custom Theme Creation

```ts
import { definePreset } from '@maz-ui/themes'

export const customTheme = definePreset({
  base: 'maz-ui',
  name: 'custom',
  foundation: {
    'base-font-size': '14px',
    'font-family': `Manrope, sans-serif, system-ui, -apple-system`,
    'radius': '0.7rem',
    'border-width': '0.0625rem',
  },
  colors: {
    light: {
      primary: '350 100% 50%', // Custom pink
      secondary: '350 14% 96%',
      background: '0 0% 100%',
      foreground: '222 84% 5%',
      muted: '210 40% 96%',
      accent: '210 40% 90%',
      destructive: '0 84% 60%',
      border: '214 32% 91%',
      input: '214 32% 91%',
      ring: '350 100% 50%',
    },
    dark: {
      primary: '350 100% 70%',
      secondary: '350 14% 4%',
      background: '222 84% 5%',
      foreground: '210 40% 98%',
      muted: '217 33% 17%',
      accent: '217 33% 17%',
      destructive: '0 62% 30%',
      border: '217 33% 17%',
      input: '217 33% 17%',
      ring: '350 100% 70%',
    }
  },
})

export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: customTheme,
      strategy: 'hybrid',
    }
  }
})
```

## 🐛 Troubleshooting

### Theme System Issues

If you encounter the error `"useTheme must be used within MazUi plugin or MazUiTheme plugin installation"`, ensure that:

1. **Enable useTheme composable** in your configuration:

```ts
const config = {
  mazUi: {
    composables: {
      useTheme: true, // Must be explicitly enabled
    }
  }
}
```

2. **Theme system is not disabled**:

```ts
const config = {
  mazUi: {
    theme: {
    // theme config, not false
      preset: 'mazUi'
    }
  }
}
```
