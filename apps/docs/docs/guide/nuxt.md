---
title: '@maz-ui/nuxt'
description: The ultimate Nuxt module for Maz-UI - zero-config setup with auto-imports, theming, and powerful features out of the box
---

# {{ $frontmatter.title }}

Transform your Nuxt application with the most comprehensive Vue.js UI library integration. **Maz-UI Nuxt Module** provides zero-configuration setup, intelligent auto-imports, and powerful theming capabilities.

::: info
Compatible with Nuxt v3 and later
:::

## ✨ Why Choose Maz-UI for Nuxt?

- **🚀 Zero Configuration** - Works out of the box with sensible defaults
- **🎨 Advanced Theming** - Built-in dark mode, custom themes, and CSS variables
- **📦 Auto-Import Everything** - Components, composables, and directives automatically available
- **⚡ Performance Optimized** - Tree-shaking, lazy loading, and hybrid CSS strategies
- **🛠️ Developer Experience** - TypeScript support, DevTools integration, and IntelliSense
- **🎯 Production Ready** - SSR/SSG support with client-side hydration

## 🚀 Installation

<div class="maz-flex maz-gap-0.5">
  <NpmBadge package="maz-ui" />
</div>

::: code-group

```bash [pnpm]
pnpm add @maz-ui/nuxt
```

```bash [npm]
npm install @maz-ui/nuxt
```

```bash [yarn]
yarn add @maz-ui/nuxt
```

:::

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt']
})
```

That's it! 🎉 All components, composables, and directives are now auto-imported and ready to use.

## 🎯 Quick Start

### Instant Usage

No imports needed - everything is auto-imported:

```vue
<script setup>
// Composables are auto-imported
const toast = useToast()
const { toggleDarkMode, isDark } = useTheme()

function showToast() {
  toast.success('Welcome to Maz-UI! 🎉')
}
</script>

<template>
  <div class="maz-bg-background p-8 maz-text-foreground">
    <!-- Components are auto-imported -->
    <MazBtn color="primary" @click="showToast">
      Click me!
    </MazBtn>

    <!-- Directives work globally -->
    <div v-tooltip="'Hello world!'" class="mt-4">
      Hover for tooltip
    </div>

    <!-- Icons with custom path -->
    <MazIcon name="heart" class="text-red-500" />
  </div>
</template>
```

### Dynamic Theming

```vue
<script setup>
const { toggleDarkMode, isDark, updateTheme } = useTheme()

async function changeTheme() {
  const { ocean } = await import('@maz-ui/themes')
  updateTheme(ocean)
}
</script>

<template>
  <div>
    <MazBtn @click="toggleDarkMode">
      {{ isDark ? '☀️' : '🌙' }} Toggle Theme
    </MazBtn>

    <MazBtn @click="changeTheme">
      🎨 Switch to Ocean Theme
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
      }
    },

    // 🌐 Translations
    translations: {
      locales: 'fr',
      fallbackLocale: 'en',
      messages: {
        // override default messages
      },
    },

    // 🧩 Components
    components: {
      autoImport: true, // All components globally available
    },

    // 🎪 Composables
    composables: {
      useTheme: true,
      useToast: true,
      useDialog: true,
      useAos: {
        injectCss: true,
        router: true, // Re-trigger animations on route change
      },
      // ... all other composables enabled by default
    },

    // 🎯 Directives
    directives: {
      vTooltip: true,
      vLazyImg: { threshold: 0.1 },
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

  // 🎭 UI Plugins
  useToast: true, // Toast notifications
  useDialog: true, // Modal dialogs
  useWait: true, // Loading states

  // 🎬 Animations
  useAos: {
    injectCss: true,
    router: true, // Re-trigger on route change
  },

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
// themes/custom.ts
export const customTheme = {
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
  radius: '0.5rem',
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  }
}
```

```ts
// nuxt.config.ts
import { customTheme } from './themes/custom'

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

3. **Use useTheme only in client-side code** or with proper SSR handling:

```vue
<script setup>
// ✅ Good - with client check
const { toggleDarkMode } = process.client ? useTheme() : { toggleDarkMode: () => {} }

// ✅ Good - in onMounted
onMounted(() => {
  const { toggleDarkMode } = useTheme()
})

// ❌ Bad - direct usage in SSR
const { toggleDarkMode } = useTheme() // Will throw in SSR
</script>
```

Ces corrections résolvent le problème de lifecycle en :

1. **Corrigeant le bug d'injection** dans le composable useTheme
2. **Améliorant l'exposition du theme state** dans le plugin Nuxt
3. **Gérant correctement le SSR** dans le wrapper Nuxt du composable
4. **Activant useTheme par défaut** dans le module

Le système devrait maintenant fonctionner correctement avec Nuxt !
