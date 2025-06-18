---
title: Theming
description: Modern and performant theme system for Maz-UI with TypeScript, HSL CSS variables and flexible strategies.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<NpmBadge package="@maz-ui/themes"></NpmBadge>

## ✨ Features

- 🎨 **Modern HSL CSS Variables** - Maximum flexibility with colors
- 🌓 **Smart Dark Mode** - Automatic support with `prefers-color-scheme`
- 🚀 **Automatic Generation** - Color scales (50-950) created automatically
- ⚡ **Performance Strategies** - Runtime, build-time or hybrid according to your needs
- 🛡️ **Strict TypeScript** - Complete types for perfect DX
- 🎯 **Zero FOUC** - Critical CSS injected inline to avoid flashes
- 🔧 **Flexible Presets** - Ready-to-use and customizable configurations

## Quick Usage

### 1. Plugin Configuration with `MazUi` plugin

```typescript
// main.ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazUi, {
  theme: {
    preset: 'maz-ui', // 'maz-ui' | 'pristine' | 'ocean' | 'obsidian'
    strategy: 'hybrid', // 'runtime' | 'buildtime' | 'hybrid'
    darkModeStrategy: 'class' // 'class' | 'media' | 'auto'
  }
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
            :color="!isDark ? 'primary' : 'contrast'"
            @click="setColorMode('light')"
          >
            ☀️ Light
          </MazBtn>
          <MazBtn
            size="sm"
            :color="isDark ? 'primary' : 'contrast'"
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
        <div class="maz-space-y-2">
          <label class="maz-text-sm maz-font-medium">Preset:</label>
          <div class="maz-flex maz-gap-2">
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'maz-ui' ? 'primary' : 'contrast'"
              @click="changePreset('mazUi')"
            >
              Maz-UI
            </MazBtn>
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'ocean' ? 'primary' : 'contrast'"
              @click="changePreset('ocean')"
            >
              Ocean
            </MazBtn>
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'pristine' ? 'primary' : 'contrast'"
              @click="changePreset('pristine')"
            >
              Pristine
            </MazBtn>
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'obsidian' ? 'primary' : 'contrast'"
              @click="changePreset('obsidian')"
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

const { currentPreset, updateTheme } = useTheme()

function changePreset(presetName) {
  updateTheme(presetName)
}
</script>

<template>
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
              :color="currentPreset.name === 'maz-ui' ? 'primary' : 'secondary'"
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
            <MazBtn
              size="sm"
              :color="currentPreset.name === 'obsidian' ? 'primary' : 'secondary'"
              @click="changePreset('obsidian')"
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
app.use(MazUi, {
  theme: {
    preset: 'maz-ui',
    strategy: 'hybrid'
  }
})
```

### ⚡ Runtime

CSS generated and injected dynamically on client-side.
Perfect for applications with frequent theme changes.

**⚠️ Potential risks:**
- **Main thread blocking** - Immediate injection can impact performance
- **Possible FOUC** - Flash of unstyled content during CSS generation
- **Heavier bundle** - CSS generation utilities included client-side

```typescript
app.use(MazUi, {
  theme: {
    preset: 'maz-ui',
    strategy: 'runtime'
  }
})
```

### 🏗️ Buildtime

CSS generated at build-time and included in the bundle.
Optimal for static sites without theme changes.

```typescript
app.use(MazUi, {
  theme: {
    preset: 'maz-ui',
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
import { definePreset, MazUiTheme, type ThemePresetOverrides, ocean

 } from '@maz-ui/themes'

const overrides: ThemePresetOverrides = {
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
}

const customTheme = await definePreset({
  base: 'ocean',
  overrides,
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
  currentPreset, // Ref<ThemePreset>
  colorMode, // Ref<'light' | 'dark' | 'auto'>
  isDark, // Ref<boolean>
  strategy, // Ref<'runtime' | 'buildtime' | 'hybrid'>

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

## Build-time Strategy: Complete Guide

The build-time strategy allows you to generate your theme CSS files at compile time, offering the best performance in production.

### Step-by-step configuration

#### 1. Create a generation script

Create `scripts/build-themes.ts`:

```typescript
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  buildThemeCSS,
  generateThemeBundle,
  buildSeparateThemeFiles,
  createThemeStylesheet,
  definePreset,
  mazUi,
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

// Create destination folder
mkdirSync(join(process.cwd(), 'public/themes'), { recursive: true })

// Generate complete CSS
const customCSS = buildThemeCSS({
  preset: customPreset,
  mode: 'both',
  criticalOnly: false,
})

writeFileSync(join(process.cwd(), 'public/themes/custom.css'), customCSS)

// Generate bundle for multiple themes
const themeBundle = generateThemeBundle([customPreset, mazUi], {
  mode: 'both',
})

Object.entries(themeBundle).forEach(([name, css]) => {
  writeFileSync(join(process.cwd(), `public/themes/${name}.css`), css)
})

console.log('✅ Themes generated in public/themes/')
```

#### 2. Add script to package.json

```json
{
  "scripts": {
    "build:themes": "tsx scripts/build-themes.ts",
    "build": "npm run build:themes && vite build"
  }
}
```

#### 3. Include in your HTML

```html
<!-- Critical CSS first -->
<link rel="stylesheet" href="/themes/custom-critical.css">

<!-- Full CSS deferred -->
<link rel="stylesheet" href="/themes/custom-full.css" media="print" onload="this.media='all'">
```

#### 4. Plugin configuration

```typescript
app.use(MazThemePlugin, {
  strategy: 'buildtime', // Important!
  darkModeStrategy: 'class',
})
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
import { useTheme } from '@maz-ui/themes/src/composables/useTheme.js'
import { definePreset } from '@maz-ui/themes/src/define-preset.js'
import { ref } from 'vue'

const {
  isDark,
  colorMode,
  currentPreset,
  setColorMode,
  updateTheme
} = useTheme()

const originalPreset = ref(null)

function changePreset(presetName) {
  updateTheme(presetName)
}

const customPreset = await definePreset({
  base: 'ocean',
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
  if (!originalPreset.value) {
    originalPreset.value = currentPreset.value
  }

  updateTheme(customPreset)
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
