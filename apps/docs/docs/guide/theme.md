---
title: Theme System
description: Modern and performant theme system for Maz-UI with TypeScript, HSL CSS variables and flexible strategies.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/themes"></NpmBadge>

## ✨ Why @maz-ui/themes?

- 🎨 **Modern HSL CSS Variables** - Maximum flexibility with colors
- 🌓 **Smart Dark Mode** - Automatic support with `prefers-color-scheme`
- 🚀 **Automatic Generation** - Color scales (50-950) created automatically
- ⚡ **Performance Strategies** - Runtime, build-time or hybrid according to your needs
- 🛡️ **Strict TypeScript** - Complete types for perfect DX
- 🎯 **Zero FOUC** - Critical CSS injected inline to avoid flashes
- 🔧 **Flexible Presets** - Ready-to-use and customizable configurations

## Installation

```bash
npm install @maz-ui/themes
```

## Quick Usage

### 1. Plugin Configuration

```typescript
// main.ts
import { MazThemePlugin } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazThemePlugin, {
  preset: mazUi,
  strategy: 'hybrid', // 'runtime' | 'build' | 'hybrid'
  darkModeStrategy: 'class' // 'class' | 'media' | 'auto'
})
```

### 2. Using in your components

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, isDark, updateTheme } = useTheme()
</script>

<template>
  <div class="maz-bg-background maz-text-foreground">
    <button
      class="maz-rounded maz-bg-primary maz-text-primary-foreground"
      @click="toggleDarkMode"
    >
      {{ isDark ? '☀️' : '🌙' }} Toggle theme
    </button>
  </div>
</template>
```

## Interactive Demo

<ComponentDemo title="Real-time theme control">
  <div class="demo-theme-controls">
    <div class="maz-space-y-4">
      <h3 class="maz-text-xl maz-font-semibold">Demo Interface</h3>
      <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <MazInput />
      <div class="theme-controls maz-space-y-4">
        <div class="maz-flex maz-items-center maz-gap-4">
          <label class="maz-text-sm maz-font-medium">Mode:</label>
          <MazBtn
            size="sm"
            :color="!isDark ? 'primary' : 'secondary'"
            @click="setColorMode('light')"
          >
            ☀️ Light
          </MazBtn>
          <MazBtn
            size="sm"
            :color="isDark ? 'primary' : 'secondary'"
            @click="setColorMode('dark')"
          >
            🌙 Dark
          </MazBtn>
          <MazBtn
            size="sm"
            :color="colorMode === 'auto' ? 'primary' : 'secondary'"
            @click="setColorMode('auto')"
          >
            🔄 Auto
          </MazBtn>
        </div>
        <div class="maz-space-y-2">
          <label class="maz-text-sm maz-font-medium">Preset:</label>
          <div class="maz-flex maz-gap-2">
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'default' ? 'primary' : 'secondary'"
              @click="changePreset('mazUi')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'ocean' ? 'primary' : 'secondary'"
              @click="changePreset('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'pristine' ? 'primary' : 'secondary'"
              @click="changePreset('pristine')"
            >
              Pristine
            </MazBtn>
          </div>
        </div>
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'
import { mazUi, ocean, pristine } from '@maz-ui/themes/presets'

const {
  isDark,
  colorMode,
  currentPreset,
  setColorMode,
  updateTheme
} = useTheme()

const presets = { mazUi, pristine, ocean }
const originalPreset = ref(null)

function changePreset(presetName) {
  updateTheme(presets[presetName])
}
</script>

<template>
  <div class="maz-bg-background maz-text-foreground">
    <MazBtn
      :color="isDark ? 'primary' : 'secondary'"
      @click="setColorMode(isDark ? 'light' : 'dark')"
    >
      {{ isDark ? '☀️' : '🌙' }} Toggle
    </MazBtn>

    <MazBtn @click="changePreset('ocean')">
      Ocean Theme
    </MazBtn>
  </div>
</template>
```

  </template>
</ComponentDemo>

## Available Presets

### Maz-UI (Default)

The default theme inspired by Maz-UI identity with vibrant and modern colors.

```typescript
import { mazUi } from '@maz-ui/themes/presets'
```

### Pristine

A minimalist and elegant theme inspired by Apple design with pure black and white aesthetics.

```typescript
import { pristine } from '@maz-ui/themes/presets'
```

### Ocean

A vibrant ocean-inspired theme with deep blues, aquatic greens, and coral accents. Features rounded borders and Poppins font for a fresh, modern look.

```typescript
import { ocean } from '@maz-ui/themes/presets'
```

## Rendering Strategies

### 🚀 Hybrid (Recommended)

The hybrid strategy combines the best of both worlds:

- Critical CSS injected inline (zero FOUC)
- Full CSS loaded asynchronously
- Optimal performance

```typescript
app.use(MazThemePlugin, {
  preset: mazUi,
  strategy: 'hybrid'
})
```

### ⚡ Runtime

CSS generated and injected dynamically on client-side.
Perfect for applications with frequent theme changes.

```typescript
app.use(MazThemePlugin, {
  preset: mazUi,
  strategy: 'runtime'
})
```

### 🏗️ Build

CSS generated at build-time and included in the bundle.
Optimal for static sites without theme changes.

```typescript
app.use(MazThemePlugin, {
  preset: mazUi,
  strategy: 'build'
})
```

## Creating Custom Themes

### Basic Theme

<br />

<ComponentDemo title="Create your own theme">
  <MazBtn @click="applyCustomTheme" color="info">
    Apply Custom Theme
  </MazBtn>
  <MazBtn @click="resetTheme" color="secondary" class="maz-ml-2">
    Reset
  </MazBtn>

  <div class="maz-mt-4 maz-p-4 maz-bg-primary/10 maz-rounded-[var(--maz-radius)]">
    <p class="maz-text-primary maz-font-medium">
      Custom theme applied with purple colors!
    </p>
  </div>

<template #code>

```typescript
import { definePreset, mazUi } from '@maz-ui/themes'

const customTheme = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom-purple',
    appearance: {
      radius: '1rem'
    },
    colors: {
      light: {
        primary: '280 100% 60%',
        secondary: '300 50% 90%',
        accent: '260 100% 70%'
      },
      dark: {
        primary: '280 100% 70%',
        secondary: '300 30% 20%',
        accent: '260 100% 80%'
      }
    }
  }
})

// Usage
const { updateTheme } = useTheme()
updateTheme(customTheme)
```

  </template>
</ComponentDemo>

### Advanced Theme with Overrides

```typescript
import { definePreset, mazUi } from '@maz-ui/themes'

const brandTheme = definePreset({
  base: mazUi,
  overrides: {
    name: 'brand',
    appearance: {
      'radius': '0.75rem',
      'border-width': '2px',
      'font-family': 'Inter, sans-serif'
    },
    colors: {
      light: {
        primary: '210 100% 50%',
        secondary: '210 40% 96%',
        background: '210 20% 98%',
        accent: '280 100% 70%'
      },
      dark: {
        primary: '210 100% 60%',
        secondary: '210 40% 15%',
        background: '210 20% 8%',
        accent: '280 100% 80%'
      }
    }
  }
})
```

## useTheme Composable API

```typescript
const {
  // Reactive state
  currentPreset, // Ref<BaseThemePreset>
  colorMode, // Ref<'light' | 'dark' | 'auto'>
  isDark, // Ref<boolean>
  strategy, // Ref<'runtime' | 'build' | 'hybrid'>

  // Actions
  updateTheme, // (preset: ThemePreset | Partial<ThemePreset>) => void
  setColorMode, // (mode: 'light' | 'dark' | 'auto') => void
  toggleDarkMode // () => void
} = useTheme()
```

### Advanced Usage Examples

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'
import { computed } from 'vue'

const { currentPreset, isDark, updateTheme, setColorMode } = useTheme()

// Computed for interface
const themeIcon = computed(() => isDark.value ? '☀️' : '🌙')
const themeName = computed(() => currentPreset.value.name)

// Function to apply a temporary custom theme
function previewColor(color: string) {
  updateTheme({
    colors: {
      light: { primary: color },
      dark: { primary: color }
    }
  })
}

// Auto mode with system detection
function enableAutoMode() {
  setColorMode('auto')
}
</script>
```

## Build-time and CSS Generation

For projects requiring build-time generated CSS:

```typescript
import { buildThemeCSS, generateThemeBundle } from '@maz-ui/themes/build'
import { mazUi, pristine } from '@maz-ui/themes/presets'

// CSS for a single preset
const css = buildThemeCSS({
  preset: mazUi,
  mode: 'both', // 'light' | 'dark' | 'both'
  darkSelector: 'class', // 'class' | 'media'
  prefix: 'maz'
})

// Bundle for multiple presets
const bundle = generateThemeBundle([mazUi, pristine], {
  mode: 'both',
  darkSelector: 'class'
})
```

## Generated CSS Variables

The system automatically generates all necessary variables:

### Base Variables

```css
:root {
  /* Main colors */
  --maz-primary: 210 100% 56%;
  --maz-primary-foreground: 0 0% 100%;
  --maz-secondary: 164 76% 46%;
  --maz-background: 0 0% 100%;
  --maz-foreground: 210 8% 14%;

  /* Design tokens */
  --maz-radius: 0.7rem;
  --maz-border-width: 0.063rem;
  --maz-font-family: Manrope, sans-serif;
}
```

### Automatic Color Scales

```css
:root {
  /* Primary scale generated automatically */
  --maz-primary-50: 210 100% 95%;
  --maz-primary-100: 210 100% 87%;
  --maz-primary-200: 210 100% 79%;
  /* ... up to 900 */
  --maz-primary-900: 210 79% 17%;
}
```

### Dark Mode

```css
.dark {
  --maz-background: 235 16% 15%;
  --maz-foreground: 0 0% 85%;
  /* Variables automatically adapted */
}

/* Or with media query */
@media (prefers-color-scheme: dark) {
  :root {
    --maz-background: 235 16% 15%;
    --maz-foreground: 0 0% 85%;
  }
}
```

## Usage with Nuxt

For Nuxt users, check the [dedicated Nuxt documentation](/guide/nuxt) which covers installation and framework-specific configuration.

## Migration from Legacy System

If you're using the legacy theme system with CLI:

::: code-group

```typescript [Before (CLI)]
// maz-ui.config.ts
export default defineConfig({
  theme: {
    colors: {
      primary: 'hsl(210, 100%, 56%)',
      secondary: 'hsl(164, 76%, 46%)'
    }
  }
})
```

```typescript [After (@maz-ui/themes)]
// main.ts
import { definePreset, mazUi } from '@maz-ui/themes'

const myTheme = definePreset({
  base: mazUi,
  overrides: {
    colors: {
      light: {
        primary: '210 100% 56%',
        secondary: '164 76% 46%'
      }
    }
  }
})

app.use(MazThemePlugin, { preset: myTheme })
```

:::

The new system offers much more flexibility and performance!

<script setup>
import { useTheme } from '@maz-ui/themes'
import { mazUi, pristine, ocean } from '@maz-ui/themes/presets'
import { ref } from 'vue'

const {
  isDark,
  colorMode,
  currentPreset,
  setColorMode,
  updateTheme
} = useTheme()

const presets = { mazUi, pristine, ocean }
const originalPreset = ref(null)

function changePreset(presetName) {
  updateTheme(presets[presetName])
}

function applyCustomTheme() {
  if (!originalPreset.value) {
    originalPreset.value = currentPreset.value
  }

  updateTheme({
    name: 'custom-purple',
    colors: {
      light: {
        'primary': '280 100% 60%',
        'secondary': '300 50% 90%',
        'accent': '260 100% 70%'
      },
      dark: {
        'primary': '280 100% 70%',
        'secondary': '300 30% 20%',
        'accent': '260 100% 80%'
      }
    }
  })
}

function resetTheme() {
  if (originalPreset.value) {
    updateTheme(originalPreset.value)
    originalPreset.value = null
  }
}
</script>

<style scoped>
.demo-theme-controls {
  @apply maz-w-full;
}

.theme-controls {
  @apply maz-border-t maz-border-divider maz-pt-4;
}
</style>
