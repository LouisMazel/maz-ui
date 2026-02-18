---
title: Theming
description: Modern and performant theme system for Maz-UI with TypeScript, HSL CSS variables and flexible strategies.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/themes"></NpmBadge>

## Features

- **Modern HSL CSS Variables** - Maximum flexibility with colors
- **Smart Dark Mode** - Automatic support with `prefers-color-scheme`
- **Automatic Generation** - Color scales (50-950) created automatically
- **Performance Strategies** - Runtime, build-time or hybrid according to your needs
- **Strict TypeScript** - Complete types for perfect DX
- **Zero FOUC** - Critical CSS injected inline to avoid flashes
- **Flexible Presets** - Ready-to-use and customizable configurations

## Theme Editor

Create your own theme with the [Theme Editor](./../theme-editor.md).

## Quick Usage

### 1. Plugin Configuration with `MazUi` plugin

To avoid FOUC (Flash of Unstyled Content), **you should provide the theme preset**.

```typescript
// main.ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazUi, {
  theme: {
    preset: mazUi, // pristine | ocean | obsidian
    strategy: 'hybrid', // 'runtime' | 'buildtime' | 'hybrid'
    darkModeStrategy: 'class', // 'class' | 'media' (only if mode is `both`)
    mode: 'both', // 'light' | 'dark' | 'both' (supported color modes)
    colorMode: 'auto', // 'auto' | 'light' | 'dark' (initial color mode, only if mode is 'both')
  }
})
```

::: tip Alternative: MazUiProvider
You can also initialize the theme via the [`MazUiProvider`](./maz-ui-provider.md) component for lazy-loaded pages or subtree-scoped themes.
:::

### 2. Setup your CSS to support theme foundation and dark mode

```css
html {
  font-size: var(--maz-base-font-size);
  font-family: var(--maz-font-family);
  background-color: hsl(var(--maz-background));
  color: hsl(var(--maz-foreground));
}
```

### 3. Using in your components

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

## Configuration

- `preset`: The theme preset to use
- `overrides` (optional): Override specific parts of the theme
- `strategy` (optional): The rendering strategy to use
- `darkModeStrategy` (optional): The dark mode strategy to use, only if you use mode `both`
- `mode` (optional): The supported color modes to use (light, dark, both)
- `colorMode` (optional): The initial color mode to use (only if mode is 'both')

## Interactive Demo

<ComponentDemo title="Real-time theme control">
  <div class="demo-theme-controls">
    <div class="maz-space-y-4">
      <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls maz-space-y-4">
        <div class="maz-flex maz-flex-col maz-gap-4">
          <label class="maz-text-sm maz-font-medium">Color Mode: {{ colorMode }}</label>
          <div class="maz-flex maz-gap-2">
            <MazBtn
              size="sm"
              :color="colorMode === 'light' ? 'primary' : 'contrast'"
              @click="setColorMode('light')"
            >
              ☀️ Light
            </MazBtn>
            <MazBtn
              size="sm"
              :color="colorMode === 'dark' ? 'primary' : 'contrast'"
              @click="setColorMode('dark')"
            >
              🌙 Dark
            </MazBtn>
            <MazBtn
              size="sm"
              :color="colorMode === 'auto' ? 'primary' : 'contrast'"
              @click="setColorMode('auto')"
            >
              🔄 Auto
            </MazBtn>
          </div>
        </div>
        <div class="maz-space-y-2">
          <label class="maz-text-sm maz-font-medium">Preset:</label>
          <div class="maz-flex maz-gap-2">
            <MazBtn
              size="sm"
              :color="presetName === 'maz-ui' ? 'primary' : 'contrast'"
              @click="updateTheme('maz-ui')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'ocean' ? 'primary' : 'contrast'"
              @click="updateTheme('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'pristine' ? 'primary' : 'contrast'"
              @click="updateTheme('pristine')"
            >
              Pristine
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'obsidian' ? 'primary' : 'contrast'"
              @click="updateTheme('obsidian')"
            >
              Obsidian
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

const { presetName, updateTheme, colorMode, setColorMode } = useTheme()
</script>

<template>
  <div class="demo-theme-controls">
    <div class="maz-space-y-4">
      <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls maz-space-y-4">
        <div class="maz-flex maz-items-center maz-gap-4">
          <label class="maz-text-sm maz-font-medium">Mode:</label>
          <MazBtn
            size="sm"
            :color="colorMode === 'light' ? 'primary' : 'secondary'"
            @click="setColorMode('light')"
          >
            ☀️ Light
          </MazBtn>
          <MazBtn
            size="sm"
            :color="colorMode === 'dark' ? 'primary' : 'secondary'"
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
              :color="presetName === 'maz-ui' ? 'primary' : 'secondary'"
              @click="updateTheme('mazUi')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'ocean' ? 'primary' : 'secondary'"
              @click="updateTheme('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'pristine' ? 'primary' : 'secondary'"
              @click="updateTheme('pristine')"
            >
              Pristine
            </MazBtn>
            <MazBtn
              size="sm"
              :color="presetName === 'obsidian' ? 'primary' : 'secondary'"
              @click="updateTheme('obsidian')"
            >
              Obsidian
            </MazBtn>
          </div>
        </div>
      </div>
    </div>
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

### Obsidian

A dark and elegant theme with a focus on readability and minimalism.

```typescript
import { obsidian } from '@maz-ui/themes/presets'
```

## Rendering Strategies

### 🚀 Hybrid (Recommended)

The hybrid strategy combines the best of both worlds:

- **Critical CSS injected immediately** - Prevents FOUC (Flash of Unstyled Content)
- **Full CSS loaded asynchronously** - Uses `requestIdleCallback` to avoid blocking the main thread
- **Optimal performance** - Balance between display speed and interface fluidity

The full CSS is injected via `requestIdleCallback` with a 100ms timeout, allowing the browser to prioritize critical tasks while ensuring fast loading of complete styling.

```typescript
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'hybrid'
  }
})
```

### ⚡ Runtime

CSS generated (critical and full) injected immediately.

**⚠️ Potential risks:**
- **Main thread blocking** - Immediate injection can impact performance

```typescript
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'runtime'
  }
})
```

### 🏗️ Buildtime

CSS generated at build-time and included in the bundle.
You have to build your CSS files before running your app.

See [Build-time](#build-time-strategy-complete-guide) for more details.

```typescript
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    strategy: 'buildtime'
  }
})
```

## Creating Custom Themes

### Basic Theme

<br />

<ComponentDemo title="Create your own theme">
  <MazBtn @click="applyCustomTheme" color="info">
    Apply Custom Theme
  </MazBtn>
  <MazBtn @click="resetTheme" color="secondary" class="maz-ms-2">
    Reset
  </MazBtn>

  <div class="maz-mt-4 maz-p-4 maz-bg-primary/10 maz-rounded-[var(--maz-radius)]">
    <p v-if="presetName === 'custom-purple'" class="maz-text-primary maz-font-medium">
      Custom theme applied with purple colors!
    </p>
    <p v-else class="maz-text-primary maz-font-medium">
      Default theme
    </p>
  </div>

<template #code>

```typescript
import { definePreset, MazUiTheme, type ThemePresetOverrides, ocean } from '@maz-ui/themes'

const customTheme = await definePreset({
  base: 'ocean',
  overrides: {
    name: 'custom-purple',
    foundation: {
      radius: '1rem'
      'font-family': 'Inter, sans-serif'
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
  },
})
/**
 * or with preset object
 * The function is synchronous when using a preset object
 */
const customTheme = definePreset({
  base: ocean,
  overrides,
})

// Usage

// with plugin
app.use(MazUiTheme, {
  preset: customTheme,
})

// or with composable
const { updateTheme } = useTheme()
updateTheme(customTheme)
```

  </template>
</ComponentDemo>

### Advanced Theme with Overrides

```typescript
import { definePreset } from '@maz-ui/themes'

const brandTheme = await definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'brand',
    foundation: {
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
  presetName, // ComputedRef<string>
  colorMode, // ComputedRef<'light' | 'dark' | 'auto'>
  isDark, // ComputedRef<boolean>
  strategy, // ComputedRef<'runtime' | 'buildtime' | 'hybrid'>

  // Actions
  updateTheme, // (preset: ThemePreset | ThemePresetOverrides) => void
  setColorMode, // (mode: 'light' | 'dark' | 'auto') => void
  toggleDarkMode // () => void
} = useTheme()
```

### Advanced Usage Examples

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'
import { computed } from 'vue'

const { presetName, isDark, updateTheme, setColorMode } = useTheme()

// Computed for interface
const themeIcon = computed(() => isDark.value ? '☀️' : '🌙')

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

## Build-time Strategy: Complete Guide

The build-time strategy allows you to generate your theme CSS files at compile time, offering the best performance in production.

### Step-by-step configuration

#### 1. Generate CSS

::: code-group

```typescript [Vue]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  // Build all css in one file
  buildThemeCSS,
  // Build multiple themes with one file each
  generateThemeBundle,
  // Build separate css files
  buildSeparateThemeFiles,
  definePreset,
  mazUi,
} from '@maz-ui/themes'

import App from './App.vue'

const _dirname = dirname(fileURLToPath(import.meta.url))

// Custom theme
const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: '221.2 83.2% 53.3%' },
      dark: { primary: '217.2 91.2% 59.8%' },
    },
  },
})

/**
 * Generate complete CSS
 */
const fullCSS = buildThemeCSS({
  preset: customPreset,
  mode: 'both',
  criticalOnly: false,
})

writeFileSync(join(_dirname, 'public/custom.css'), fullCSS)

/**
 * Or generate theme in  separate CSS files
 */
const { critical, full } = buildSeparateThemeFiles(customPreset, {
  darkSelector: 'class',
})

writeFileSync(join(_dirname, 'public/critical.css'), critical)
writeFileSync(join(_dirname, 'public/custom-full.css'), full)

/**
 * Or generate bundle for multiple themes in one file each
 */
const themeBundle = generateThemeBundle([customPreset, mazUi], {
  mode: 'both',
})

Object.entries(themeBundle).forEach(([name, css]) => {
  writeFileSync(join(_dirname, `public/${name}.css`), css)
})

const app = createApp(App)

app.use(MazUiTheme, {
  preset: customPreset,
  strategy: 'buildtime', // Important!
  darkModeStrategy: 'class',
})

app.mount('#app')
```

```typescript [Vitepress]
import {
  buildThemeCSS,
  generateThemeBundle,
  buildSeparateThemeFiles,
  createThemeStylesheet,
  definePreset,
  mazUi,
  CSS_ID,
} from '@maz-ui/themes'

// Custom theme
const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: '221.2 83.2% 53.3%' },
      dark: { primary: '217.2 91.2% 59.8%' },
    },
  },
})

// Generate complete CSS
const fullCSS = buildThemeCSS({
  preset: customPreset,
  mode: 'both',
  criticalOnly: false,
})

// Or generate separate CSS files
const { critical, full, lightOnly, darkOnly } = buildSeparateThemeFiles(customPreset, {
  darkSelector: 'class',
})

// Or generate bundle for multiple themes
const themeBundle = generateThemeBundle([customPreset, mazUi], {
  mode: 'both',
})

export default defineConfig<DefaultTheme.Config>({
  head: [
    ['style', { id: CSS_ID, type: 'text/css' }, full],
  ] satisfies HeadConfig[],
})
```

```typescript [Nuxt]
/*
 * You dont need to do anything,
 * The module will handle it for you.
 *
 * Just provide a preset to the module
 */

const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    colors: {
      light: { primary: '221.2 83.2% 53.3%' },
      dark: { primary: '217.2 91.2% 59.8%' },
    },
  },
})

export default defineConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    theme: {
      preset: customPreset,
      mode: 'both',
      colorMode: 'auto',
    },
  },
})
```

:::

#### 2. Include in your HTML (Only for Vue users)

```html
<!-- Critical CSS first -->
<link rel="stylesheet" href="/themes/custom-critical.css">

<!-- Full CSS deferred -->
<link rel="stylesheet" href="/themes/custom-full.css" media="print" onload="this.media='all'">
```

### Utility functions

#### `buildThemeCSS(options)`

Generates complete CSS for a theme.

```typescript
const css = buildThemeCSS({
  preset: customPreset,
  mode: 'both', // 'light' | 'dark' | 'both'
  darkSelector: 'class', // 'class' | 'media'
  criticalOnly: false, // true for critical CSS only
})
```

#### `generateThemeBundle(presets, options)`

Generates a bundle containing multiple themes.

```typescript
const bundle = generateThemeBundle([theme1, theme2], {
  mode: 'both',
  darkSelector: 'class',
})
// Result: { 'theme1': 'css...', 'theme2': 'css...' }
```

#### `buildSeparateThemeFiles(preset, options)`

Generates separate files for different use cases.

```typescript
const files = buildSeparateThemeFiles(preset)
// Result: { critical, full, lightOnly, darkOnly }
```

#### `createThemeStylesheet(css, options)`

Creates a `<style>` tag with the provided CSS.

```typescript
const styleTag = createThemeStylesheet(css, {
  id: 'my-theme',
  media: 'screen', // optional
})
```

### Build-time strategy advantages

- **Optimal performance** - No client-side CSS generation
- **Efficient caching** - CSS files cached by CDN
- **Reduced bundle** - Generation utilities excluded from client
- **Full compatibility** - Works even with JavaScript disabled

### Recommended use cases

- Production applications with static themes
- Sites with critical performance requirements
- Projects with multiple predefined themes
- Applications requiring fine control over CSS loading

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

::: details View all generated CSS variables (with maz-ui preset)

```css
@layer maz-ui-theme {
  :root {
    --maz-background: 0 0% 100%;
    --maz-foreground: 210 8% 14%;
    --maz-primary: 210 100% 56%;
    --maz-primary-foreground: 0 0% 100%;
    --maz-secondary: 272 99% 54%;
    --maz-secondary-foreground: 0 0% 100%;
    --maz-accent: 164 76% 46%;
    --maz-accent-foreground: 0 0% 100%;
    --maz-destructive: 356.95 95.91% 57.73%;
    --maz-destructive-foreground: 0 0% 100%;
    --maz-success: 80 61% 50%;
    --maz-success-foreground: 210 8% 14%;
    --maz-warning: 40 97% 59%;
    --maz-warning-foreground: 210 8% 14%;
    --maz-info: 188 78% 41%;
    --maz-info-foreground: 0 0% 100%;
    --maz-contrast: 235 16% 15%;
    --maz-contrast-foreground: 255 0% 95%;
    --maz-muted: 0 0% 54%;
    --maz-shadow: 240 5.9% 10%;
    --maz-border: 220 13.04% 90.98%;
    --maz-radius: 0.7rem;
    --maz-font-family: Manrope, sans-serif, system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --maz-base-font-size: 14px;
    --maz-border-width: 0.0625rem;
  }

  .dark {
    --maz-background: 235 16% 15%;
    --maz-foreground: 0 0% 85%;
    --maz-primary: 210 100% 56%;
    --maz-primary-foreground: 0 0% 100%;
    --maz-secondary: 272 99% 54%;
    --maz-secondary-foreground: 0 0% 100%;
    --maz-accent: 164 76% 46%;
    --maz-accent-foreground: 0 0% 100%;
    --maz-destructive: 1 100% 71%;
    --maz-destructive-foreground: 0 0% 100%;
    --maz-success: 80 61% 50%;
    --maz-success-foreground: 210 8% 14%;
    --maz-warning: 40 97% 59%;
    --maz-warning-foreground: 210 8% 14%;
    --maz-info: 188 78% 41%;
    --maz-info-foreground: 0 0% 100%;
    --maz-contrast: 0 0% 100%;
    --maz-contrast-foreground: 210 8% 14%;
    --maz-muted: 255 0% 54%;
    --maz-shadow: 240 3.7% 15.9%;
    --maz-border: 238 17% 25%;
    --maz-radius: 0.7rem;
    --maz-font-family: Manrope, sans-serif, system-ui, -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, oxygen, ubuntu, cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    --maz-base-font-size: 14px;
    --maz-border-width: 0.0625rem;
  }
}

@layer maz-ui-theme {

  :root {
    --maz-overlay: 0 0% 40%;
    --maz-primary-50: 210 77.5% 93.5%;
    --maz-primary-100: 210 80% 86%;
    --maz-primary-200: 210 85% 78.5%;
    --maz-primary-300: 210 90% 71%;
    --maz-primary-400: 210 95% 63.5%;
    --maz-primary-500: 210 100% 56%;
    --maz-primary-600: 210 100% 48.5%;
    --maz-primary-700: 210 100% 41%;
    --maz-primary-800: 210 100% 33.5%;
    --maz-primary-900: 210 100% 26%;
    --maz-primary-950: 210 100% 18.5%;
    --maz-secondary-50: 272 76.9% 91.5%;
    --maz-secondary-100: 272 79.4% 84%;
    --maz-secondary-200: 272 84.3% 76.5%;
    --maz-secondary-300: 272 89.2% 69%;
    --maz-secondary-400: 272 94.1% 61.5%;
    --maz-secondary-500: 272 99% 54%;
    --maz-secondary-600: 272 100% 46.5%;
    --maz-secondary-700: 272 100% 39%;
    --maz-secondary-800: 272 100% 31.5%;
    --maz-secondary-900: 272 100% 24%;
    --maz-secondary-950: 272 100% 16.5%;
    --maz-accent-50: 164 63% 83.5%;
    --maz-accent-100: 164 64.4% 76%;
    --maz-accent-200: 164 67.3% 68.5%;
    --maz-accent-300: 164 70.2% 61%;
    --maz-accent-400: 164 73.1% 53.5%;
    --maz-accent-500: 164 76% 46%;
    --maz-accent-600: 164 78.2% 38.5%;
    --maz-accent-700: 164 80.3% 31%;
    --maz-accent-800: 164 82.5% 23.5%;
    --maz-accent-900: 164 84.7% 16%;
    --maz-accent-950: 164 85.7% 8.5%;
    --maz-destructive-50: 357 75.2% 95.2%;
    --maz-destructive-100: 357 77.5% 87.7%;
    --maz-destructive-200: 357 82.1% 80.2%;
    --maz-destructive-300: 357 86.7% 72.7%;
    --maz-destructive-400: 357 91.3% 65.2%;
    --maz-destructive-500: 357 95.9% 57.7%;
    --maz-destructive-600: 357 99.4% 50.2%;
    --maz-destructive-700: 357 100% 42.7%;
    --maz-destructive-800: 357 100% 35.2%;
    --maz-destructive-900: 357 100% 27.7%;
    --maz-destructive-950: 357 100% 20.2%;
    --maz-success-50: 80 52.6% 87.5%;
    --maz-success-100: 80 53.6% 80%;
    --maz-success-200: 80 55.4% 72.5%;
    --maz-success-300: 80 57.3% 65%;
    --maz-success-400: 80 59.1% 57.5%;
    --maz-success-500: 80 61% 50%;
    --maz-success-600: 80 62.4% 42.5%;
    --maz-success-700: 80 63.8% 35%;
    --maz-success-800: 80 65.2% 27.5%;
    --maz-success-900: 80 66.6% 20%;
    --maz-success-950: 80 67.3% 12.5%;
    --maz-warning-50: 40 75.8% 96.5%;
    --maz-warning-100: 40 78.2% 89%;
    --maz-warning-200: 40 82.9% 81.5%;
    --maz-warning-300: 40 87.6% 74%;
    --maz-warning-400: 40 92.3% 66.5%;
    --maz-warning-500: 40 97% 59%;
    --maz-warning-600: 40 100% 51.5%;
    --maz-warning-700: 40 100% 44%;
    --maz-warning-800: 40 100% 36.5%;
    --maz-warning-900: 40 100% 29%;
    --maz-warning-950: 40 100% 21.5%;
    --maz-info-50: 188 64.3% 78.5%;
    --maz-info-100: 188 65.8% 71%;
    --maz-info-200: 188 68.9% 63.5%;
    --maz-info-300: 188 71.9% 56%;
    --maz-info-400: 188 75% 48.5%;
    --maz-info-500: 188 78% 41%;
    --maz-info-600: 188 80.3% 33.5%;
    --maz-info-700: 188 82.6% 26%;
    --maz-info-800: 188 84.8% 18.5%;
    --maz-info-900: 188 87.1% 11%;
    --maz-info-950: 188 88.3% 3.5%;
    --maz-contrast-50: 235 15.4% 52.5%;
    --maz-contrast-100: 235 15.5% 45%;
    --maz-contrast-200: 235 15.6% 37.5%;
    --maz-contrast-300: 235 15.7% 30%;
    --maz-contrast-400: 235 15.9% 22.5%;
    --maz-contrast-500: 235 16% 15%;
    --maz-contrast-600: 235 16.1% 7.5%;
    --maz-contrast-700: 235 16.2% 0%;
    --maz-contrast-800: 235 16.3% 0%;
    --maz-contrast-900: 235 16.4% 0%;
    --maz-contrast-950: 235 16.4% 0%;
    --maz-background-50: 0 5% 100%;
    --maz-background-100: 0 5% 100%;
    --maz-background-200: 0 5% 100%;
    --maz-background-300: 0 5% 100%;
    --maz-background-400: 0 5% 100%;
    --maz-background-500: 0 0% 100%;
    --maz-background-600: 0 5% 92.5%;
    --maz-background-700: 0 5% 85%;
    --maz-background-800: 0 5% 77.5%;
    --maz-background-900: 0 5% 70%;
    --maz-background-950: 0 5% 62.5%;
    --maz-foreground-50: 210 7.9% 51.5%;
    --maz-foreground-100: 210 7.9% 44%;
    --maz-foreground-200: 210 7.9% 36.5%;
    --maz-foreground-300: 210 7.9% 29%;
    --maz-foreground-400: 210 8% 21.5%;
    --maz-foreground-500: 210 8% 14%;
    --maz-foreground-600: 210 8% 6.5%;
    --maz-foreground-700: 210 8% 0%;
    --maz-foreground-800: 210 8.1% 0%;
    --maz-foreground-900: 210 8.1% 0%;
    --maz-foreground-950: 210 8.1% 0%;
    --maz-border-50: 220 12.7% 100%;
    --maz-border-100: 220 12.7% 100%;
    --maz-border-200: 220 12.8% 100%;
    --maz-border-300: 220 12.9% 100%;
    --maz-border-400: 220 13% 98.5%;
    --maz-border-500: 220 13% 91%;
    --maz-border-600: 220 13.1% 83.5%;
    --maz-border-700: 220 13.2% 76%;
    --maz-border-800: 220 13.2% 68.5%;
    --maz-border-900: 220 13.3% 61%;
    --maz-border-950: 220 13.3% 53.5%;
    --maz-muted-50: 0 5% 91.5%;
    --maz-muted-100: 0 5% 84%;
    --maz-muted-200: 0 5% 76.5%;
    --maz-muted-300: 0 5% 69%;
    --maz-muted-400: 0 5% 61.5%;
    --maz-muted-500: 0 0% 54%;
    --maz-muted-600: 0 5% 46.5%;
    --maz-muted-700: 0 5% 39%;
    --maz-muted-800: 0 5% 31.5%;
    --maz-muted-900: 0 5% 24%;
    --maz-muted-950: 0 5% 16.5%;
    --maz-overlay-50: 0 5% 77.5%;
    --maz-overlay-100: 0 5% 70%;
    --maz-overlay-200: 0 5% 62.5%;
    --maz-overlay-300: 0 5% 55%;
    --maz-overlay-400: 0 5% 47.5%;
    --maz-overlay-500: 0 0% 40%;
    --maz-overlay-600: 0 5% 32.5%;
    --maz-overlay-700: 0 5% 25%;
    --maz-overlay-800: 0 5% 17.5%;
    --maz-overlay-900: 0 5% 10%;
    --maz-overlay-950: 0 5% 2.5%;
    --maz-shadow-50: 240 5.8% 47.5%;
    --maz-shadow-100: 240 5.8% 40%;
    --maz-shadow-200: 240 5.8% 32.5%;
    --maz-shadow-300: 240 5.9% 25%;
    --maz-shadow-400: 240 5.9% 17.5%;
    --maz-shadow-500: 240 5.9% 10%;
    --maz-shadow-600: 240 5.9% 2.5%;
    --maz-shadow-700: 240 5.9% 0%;
    --maz-shadow-800: 240 5.9% 0%;
    --maz-shadow-900: 240 6% 0%;
    --maz-shadow-950: 240 6% 0%;
  }

  .dark {
    --maz-overlay: 0 0% 15%;
    --maz-primary-50: 210 77.5% 93.5%;
    --maz-primary-100: 210 80% 86%;
    --maz-primary-200: 210 85% 78.5%;
    --maz-primary-300: 210 90% 71%;
    --maz-primary-400: 210 95% 63.5%;
    --maz-primary-500: 210 100% 56%;
    --maz-primary-600: 210 100% 48.5%;
    --maz-primary-700: 210 100% 41%;
    --maz-primary-800: 210 100% 33.5%;
    --maz-primary-900: 210 100% 26%;
    --maz-primary-950: 210 100% 18.5%;
    --maz-secondary-50: 272 76.9% 91.5%;
    --maz-secondary-100: 272 79.4% 84%;
    --maz-secondary-200: 272 84.3% 76.5%;
    --maz-secondary-300: 272 89.2% 69%;
    --maz-secondary-400: 272 94.1% 61.5%;
    --maz-secondary-500: 272 99% 54%;
    --maz-secondary-600: 272 100% 46.5%;
    --maz-secondary-700: 272 100% 39%;
    --maz-secondary-800: 272 100% 31.5%;
    --maz-secondary-900: 272 100% 24%;
    --maz-secondary-950: 272 100% 16.5%;
    --maz-accent-50: 164 63% 83.5%;
    --maz-accent-100: 164 64.4% 76%;
    --maz-accent-200: 164 67.3% 68.5%;
    --maz-accent-300: 164 70.2% 61%;
    --maz-accent-400: 164 73.1% 53.5%;
    --maz-accent-500: 164 76% 46%;
    --maz-accent-600: 164 78.2% 38.5%;
    --maz-accent-700: 164 80.3% 31%;
    --maz-accent-800: 164 82.5% 23.5%;
    --maz-accent-900: 164 84.7% 16%;
    --maz-accent-950: 164 85.7% 8.5%;
    --maz-destructive-50: 1 77.5% 100%;
    --maz-destructive-100: 1 80% 100%;
    --maz-destructive-200: 1 85% 93.5%;
    --maz-destructive-300: 1 90% 86%;
    --maz-destructive-400: 1 95% 78.5%;
    --maz-destructive-500: 1 100% 71%;
    --maz-destructive-600: 1 100% 63.5%;
    --maz-destructive-700: 1 100% 56%;
    --maz-destructive-800: 1 100% 48.5%;
    --maz-destructive-900: 1 100% 41%;
    --maz-destructive-950: 1 100% 33.5%;
    --maz-success-50: 80 52.6% 87.5%;
    --maz-success-100: 80 53.6% 80%;
    --maz-success-200: 80 55.4% 72.5%;
    --maz-success-300: 80 57.3% 65%;
    --maz-success-400: 80 59.1% 57.5%;
    --maz-success-500: 80 61% 50%;
    --maz-success-600: 80 62.4% 42.5%;
    --maz-success-700: 80 63.8% 35%;
    --maz-success-800: 80 65.2% 27.5%;
    --maz-success-900: 80 66.6% 20%;
    --maz-success-950: 80 67.3% 12.5%;
    --maz-warning-50: 40 75.8% 96.5%;
    --maz-warning-100: 40 78.2% 89%;
    --maz-warning-200: 40 82.9% 81.5%;
    --maz-warning-300: 40 87.6% 74%;
    --maz-warning-400: 40 92.3% 66.5%;
    --maz-warning-500: 40 97% 59%;
    --maz-warning-600: 40 100% 51.5%;
    --maz-warning-700: 40 100% 44%;
    --maz-warning-800: 40 100% 36.5%;
    --maz-warning-900: 40 100% 29%;
    --maz-warning-950: 40 100% 21.5%;
    --maz-info-50: 188 64.3% 78.5%;
    --maz-info-100: 188 65.8% 71%;
    --maz-info-200: 188 68.9% 63.5%;
    --maz-info-300: 188 71.9% 56%;
    --maz-info-400: 188 75% 48.5%;
    --maz-info-500: 188 78% 41%;
    --maz-info-600: 188 80.3% 33.5%;
    --maz-info-700: 188 82.6% 26%;
    --maz-info-800: 188 84.8% 18.5%;
    --maz-info-900: 188 87.1% 11%;
    --maz-info-950: 188 88.3% 3.5%;
    --maz-contrast-50: 0 5% 100%;
    --maz-contrast-100: 0 5% 100%;
    --maz-contrast-200: 0 5% 100%;
    --maz-contrast-300: 0 5% 100%;
    --maz-contrast-400: 0 5% 100%;
    --maz-contrast-500: 0 0% 100%;
    --maz-contrast-600: 0 5% 92.5%;
    --maz-contrast-700: 0 5% 85%;
    --maz-contrast-800: 0 5% 77.5%;
    --maz-contrast-900: 0 5% 70%;
    --maz-contrast-950: 0 5% 62.5%;
    --maz-background-50: 235 15.4% 52.5%;
    --maz-background-100: 235 15.5% 45%;
    --maz-background-200: 235 15.6% 37.5%;
    --maz-background-300: 235 15.7% 30%;
    --maz-background-400: 235 15.9% 22.5%;
    --maz-background-500: 235 16% 15%;
    --maz-background-600: 235 16.1% 7.5%;
    --maz-background-700: 235 16.2% 0%;
    --maz-background-800: 235 16.3% 0%;
    --maz-background-900: 235 16.4% 0%;
    --maz-background-950: 235 16.4% 0%;
    --maz-foreground-50: 0 5% 100%;
    --maz-foreground-100: 0 5% 100%;
    --maz-foreground-200: 0 5% 100%;
    --maz-foreground-300: 0 5% 100%;
    --maz-foreground-400: 0 5% 92.5%;
    --maz-foreground-500: 0 0% 85%;
    --maz-foreground-600: 0 5% 77.5%;
    --maz-foreground-700: 0 5% 70%;
    --maz-foreground-800: 0 5% 62.5%;
    --maz-foreground-900: 0 5% 55%;
    --maz-foreground-950: 0 5% 47.5%;
    --maz-border-50: 238 16.3% 62.5%;
    --maz-border-100: 238 16.4% 55%;
    --maz-border-200: 238 16.6% 47.5%;
    --maz-border-300: 238 16.7% 40%;
    --maz-border-400: 238 16.9% 32.5%;
    --maz-border-500: 238 17% 25%;
    --maz-border-600: 238 17.1% 17.5%;
    --maz-border-700: 238 17.2% 10%;
    --maz-border-800: 238 17.3% 2.5%;
    --maz-border-900: 238 17.4% 0%;
    --maz-border-950: 238 17.5% 0%;
    --maz-muted-50: 255 5% 91.5%;
    --maz-muted-100: 255 5% 84%;
    --maz-muted-200: 255 5% 76.5%;
    --maz-muted-300: 255 5% 69%;
    --maz-muted-400: 255 5% 61.5%;
    --maz-muted-500: 255 0% 54%;
    --maz-muted-600: 255 5% 46.5%;
    --maz-muted-700: 255 5% 39%;
    --maz-muted-800: 255 5% 31.5%;
    --maz-muted-900: 255 5% 24%;
    --maz-muted-950: 255 5% 16.5%;
    --maz-overlay-50: 0 5% 52.5%;
    --maz-overlay-100: 0 5% 45%;
    --maz-overlay-200: 0 5% 37.5%;
    --maz-overlay-300: 0 5% 30%;
    --maz-overlay-400: 0 5% 22.5%;
    --maz-overlay-500: 0 0% 15%;
    --maz-overlay-600: 0 5% 7.5%;
    --maz-overlay-700: 0 5% 0%;
    --maz-overlay-800: 0 5% 0%;
    --maz-overlay-900: 0 5% 0%;
    --maz-overlay-950: 0 5% 0%;
    --maz-shadow-50: 240 5% 53.4%;
    --maz-shadow-100: 240 5% 45.9%;
    --maz-shadow-200: 240 5% 38.4%;
    --maz-shadow-300: 240 5% 30.9%;
    --maz-shadow-400: 240 5% 23.4%;
    --maz-shadow-500: 240 3.7% 15.9%;
    --maz-shadow-600: 240 5% 8.4%;
    --maz-shadow-700: 240 5% 0.9%;
    --maz-shadow-800: 240 5% 0%;
    --maz-shadow-900: 240 5% 0%;
    --maz-shadow-950: 240 5% 0%;
  }
}
```

:::

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
import { useTheme } from '@maz-ui/themes/composables/useTheme'
import { definePreset } from '@maz-ui/themes'
import { ref } from 'vue'

const {
  isDark,
  colorMode,
  preset,
  setColorMode,
  updateTheme,
  presetName
} = useTheme()

const originalPresetName = ref(null)

const customPreset = await definePreset({
  base: 'pristine',
  overrides: {
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
  }
})

function applyCustomTheme() {
  if (!originalPresetName.value) {
    originalPresetName.value = presetName.value
  }

  updateTheme(customPreset)
}

function resetTheme() {
  if (originalPresetName.value) {
    updateTheme(originalPresetName.value)
    originalPresetName.value = null
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
