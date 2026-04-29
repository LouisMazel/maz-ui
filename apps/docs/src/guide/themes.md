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
- **Performance Strategies** - Runtime injection or build-time generation according to your needs
- **Strict TypeScript** - Complete types for perfect DX
- **Zero FOUC** - Pass the preset object up front; the full CSS is injected synchronously on first paint
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
    preset: mazUi, // pristine | ocean | obsidian | nova
    strategy: 'runtime', // 'runtime' | 'buildtime'
    darkModeStrategy: 'class', // 'class' | 'media' (only if mode is `both`)
    mode: 'both', // 'light' | 'dark' | 'both' (supported color modes)
    colorMode: 'auto', // 'auto' | 'light' | 'dark' (initial color mode, only if mode is 'both')
    persistPreset: true, // remember the active preset name across reloads
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
  background-color: var(--maz-surface);
  color: var(--maz-foreground);
}
```

### 3. Using in your components

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, isDark, updateTheme } = useTheme()
</script>

<template>
  <div class="maz:bg-surface maz:text-foreground">
    <button
      class="maz:rounded-md maz:bg-primary maz:text-primary-foreground"
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
- `persistPreset` (optional, default `true`): Persist the active preset name in the `maz-preset` cookie so it is restored on reload.

### Preset persistence

When `persistPreset` is enabled (default), `@maz-ui/themes` stores the resolved preset name in a `maz-preset` cookie (1-year TTL, `SameSite=Lax`) — exactly like `maz-color-mode` for the dark/light state. The cookie is:

- **Read at boot** and used to resolve the active preset — even when `options.preset` is provided. `options.preset` (string name **or** preset object) is treated as the *default* the app boots with, while the cookie carries the user's last explicit choice. The cookie wins.
- **Written** after every successful preset resolution and after every `useTheme().updateTheme()` call (idempotent — no write if the value already matches).
- **Auto-cleared** when the saved name no longer resolves (e.g. typo, preset removed in a downgrade) — the runtime falls back to `options.preset` (or default) and clears the cookie silently.

Custom preset names are stored exactly like bundled ones: `@maz-ui/themes` does not maintain a whitelist. Switch the option off to disable any cookie read/write:

```typescript
app.use(MazUi, {
  theme: {
    preset: mazUi,
    persistPreset: false, // never write or read the maz-preset cookie
  },
})
```

Useful when:
- You want zero theme-related cookies (privacy / regulatory).
- The active preset is fully driven by the consumer app and no end-user switching is exposed.

## Interactive Demo

<ComponentDemo title="Real-time theme control">
  <div class="demo-theme-controls">
    <div class="maz:space-y-4">
      <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls maz:space-y-4">
        <div class="maz:flex maz:flex-col maz:gap-4">
          <label class="maz:text-sm maz:font-medium">Color Mode: {{ colorMode }}</label>
          <div class="maz:flex maz:gap-2">
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
        <div class="maz:space-y-2">
          <label class="maz:text-sm maz:font-medium">Preset:</label>
          <div class="maz:flex maz:gap-2">
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
    <div class="maz:space-y-4">
      <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
        <MazBtn color="primary">Primary Button</MazBtn>
        <MazBtn color="secondary">Secondary Button</MazBtn>
        <MazBtn color="success">Success Button</MazBtn>
        <MazBtn color="warning">Warning Button</MazBtn>
      </div>
      <div class="theme-controls maz:space-y-4">
        <div class="maz:flex maz:items-center maz:gap-4">
          <label class="maz:text-sm maz:font-medium">Mode:</label>
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
        <div class="maz:space-y-2">
          <label class="maz:text-sm maz:font-medium">Preset:</label>
          <div class="maz:flex maz:gap-2">
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

### Nova

A modern startup / AI / creative preset — electric violet primary, hot coral secondary, cyan accent. Tight 0.5rem `md` radius, Geist + Inter font stack, snappy ease-out spring. Built for product / AI surfaces (think Linear, Vercel, OpenAI energy) where the UI itself should feel alive.

```typescript
import { nova } from '@maz-ui/themes/presets'
```

## Rendering Strategies

### ⚡ Runtime (Recommended)

CSS is generated and injected synchronously on first paint. Pass the preset object directly (`preset: mazUi`) so the full stylesheet is rendered before the first frame — no FOUC.

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
  <MazBtn @click="resetTheme" color="secondary" class="maz:ms-2">
    Reset
  </MazBtn>

  <div class="maz:mt-4 maz:p-4 maz:bg-primary/10 maz:rounded-md">
    <p v-if="presetName === 'custom-purple'" class="maz:text-primary maz:font-medium">
      Custom theme applied with purple colors!
    </p>
    <p v-else class="maz:text-primary maz:font-medium">
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
      'font-family': 'Inter, sans-serif'
    },
    scales: {
      rounded: { md: '1rem' }
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
      'border-width': '2px',
      'font-family': 'Inter, sans-serif'
    },
    scales: {
      rounded: { md: '0.75rem' }
    },
    colors: {
      light: {
        primary: '210 100% 50%',
        secondary: '210 40% 96%',
        surface: '210 20% 98%',
        accent: '280 100% 70%'
      },
      dark: {
        primary: '210 100% 60%',
        secondary: '210 40% 15%',
        surface: '210 20% 8%',
        accent: '280 100% 80%'
      }
    }
  }
})
```

### Customizing scales

Each `ThemeScales` entry maps to a Tailwind utility — override the keys you care about and the rest stays untouched:

```typescript
const denseTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'dense',
    foundation: {
      // Tighter spacing — every p-N / gap-N / m-N rescales
      space: '0.2rem',
    },
    scales: {
      // Sharper corners on the whole radius scale
      rounded: {
        'xs': '0.0625rem',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Custom elevated-surface shadow
      shadow: {
        elevation: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },
  },
})
```

Foundation gets new optional keys for fonts and disabled-state behaviour:

```typescript
const codeTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    foundation: {
      'font-mono-stack': '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
      'font-display-stack': '"Cal Sans", Manrope, sans-serif',
      'disabled-opacity': '0.4',
      'disabled-cursor': 'wait',
    },
  },
})
```

### Per-component overrides

`components` is a small, validated set of per-component knobs. Every entry is per-mode where appropriate so light and dark can drift independently:

```typescript
const surfaceTheme = definePreset({
  base: 'maz-ui',
  overrides: {
    name: 'cool-surfaces',
    components: {
      btn: {
        // Bias every button text heavier
        'font-weight': '600',
      },
      container: {
        // Cards / dialogs / popovers / drawers — light = page surface, dark = a tier above
        bg: { light: 'var(--maz-surface)', dark: 'var(--maz-surface-300)' },
      },
      input: {
        // All form-control surfaces
        bg: { light: 'var(--maz-surface-100)', dark: 'var(--maz-surface-400)' },
      },
    },
  },
})
```

Components consume these via `maz:bg-container` / `maz:bg-input` Tailwind utilities, so a single override propagates everywhere — no per-component class hunt.

## useTheme Composable API

```typescript
const {
  // Reactive state
  presetName, // ComputedRef<string>
  colorMode, // ComputedRef<'light' | 'dark' | 'auto'>
  isDark, // ComputedRef<boolean>
  strategy, // ComputedRef<'runtime' | 'buildtime'>

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
})

writeFileSync(join(_dirname, 'public/custom.css'), fullCSS)

/**
 * Or generate per-mode CSS files
 */
const { full, lightOnly, darkOnly } = buildSeparateThemeFiles(customPreset, {
  darkSelector: 'class',
})

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
})

// Or generate per-mode CSS files
const { full, lightOnly, darkOnly } = buildSeparateThemeFiles(customPreset, {
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
<link rel="stylesheet" href="/themes/custom-full.css">
```

### Utility functions

#### `buildThemeCSS(options)`

Generates complete CSS for a theme.

```typescript
const css = buildThemeCSS({
  preset: customPreset,
  mode: 'both', // 'light' | 'dark' | 'both'
  darkSelector: 'class', // 'class' | 'media'
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
// Result: { full, lightOnly, darkOnly }
```

#### `createThemeStylesheet(css, options)`

Creates a `<style>
@reference "../../.vitepress/theme/main.css";
` tag with the provided CSS.

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

## Token Reference

Every preset emits the same set of CSS variables on `:root` (and a `.dark` block when `mode: 'both'`). Use these names directly in your own CSS — `var(--maz-primary)`, `calc(var(--maz-space) * 4)`, etc.

### Foundation

Single-value design tokens. Set via `foundation.<key>` on the preset.

| Preset key | CSS variable | Default | Notes |
| --- | --- | --- | --- |
| `base-font-size` | `--maz-base-font-size` | `14px` | Anchors `rem` for the whole app. Apply on `html { font-size: var(--maz-base-font-size) }`. |
| `border-width` | `--maz-border-width` | `1px` | Default border for components and the global `*::before/::after` reset. |
| `space` | `--maz-space` | `0.25rem` | Base step for every Tailwind spacing utility (`maz:p-1`, `maz:gap-2`, …). |
| `font-family` | `--maz-font-family` | preset-specific | Sans / body font stack. Bridged to Tailwind `--font-sans`. |
| `font-mono-stack` | `--maz-font-mono-stack` | `ui-monospace, …` | Monospace stack — `MazInputCode`, `<code>`, `<kbd>`. Bridged to `--font-mono`. |
| `font-display-stack` | `--maz-font-display-stack` | same as `font-family` | Display / heading stack. Bridged to `--font-display`. |
| `motion-fast` | `--maz-motion-fast` | `100ms` | Bridged to Tailwind `--duration-fast`. |
| `motion-normal` | `--maz-motion-normal` | `200ms` | Default transition duration (`--default-transition-duration`). |
| `motion-slow` | `--maz-motion-slow` | `300ms` | Bridged to `--duration-slow`. |
| `easing-out` | `--maz-easing-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing (`--ease-out`, also `--default-transition-timing-function`). |
| `easing-in` | `--maz-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Bridged to `--ease-in`. |
| `easing-in-out` | `--maz-easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Bridged to `--ease-in-out`. |
| `disabled-opacity` | `--maz-disabled-opacity` | `0.5` | Applied to disabled buttons / inputs. |
| `disabled-cursor` | `--maz-disabled-cursor` | `not-allowed` | Cursor for disabled interactive elements. |

> **Why `font-mono-stack` / `font-display-stack` / `motion-*`?** Under Tailwind v4 `prefix(maz)`, the bridge LHS gets prefixed (`--font-mono` → `--maz-font-mono`), so a same-named source token would self-cycle. The `-stack` and `motion-` suffixes break the collision.

### Colors

Defined per mode under `colors.light` / `colors.dark`. Each base color also gets an automatic 50–950 scale.

| Preset key | CSS variable (base) | Auto scale | Notes |
| --- | --- | --- | --- |
| `surface` | `--maz-surface` | `--maz-surface-50..900` | Page / container background. |
| `foreground` | `--maz-foreground` | `--maz-foreground-50..900` | Default text color. |
| `primary` | `--maz-primary` | `--maz-primary-50..900` | Brand color. |
| `primary-foreground` | `--maz-primary-foreground` | — | Text on `bg-primary`. |
| `secondary` | `--maz-secondary` | `--maz-secondary-50..900` | |
| `secondary-foreground` | `--maz-secondary-foreground` | — | |
| `accent` | `--maz-accent` | `--maz-accent-50..900` | |
| `accent-foreground` | `--maz-accent-foreground` | — | |
| `info` | `--maz-info` | `--maz-info-50..900` | Status — informational. |
| `info-foreground` | `--maz-info-foreground` | — | |
| `success` | `--maz-success` | `--maz-success-50..900` | Status — success. |
| `success-foreground` | `--maz-success-foreground` | — | |
| `warning` | `--maz-warning` | `--maz-warning-50..900` | Status — warning. |
| `warning-foreground` | `--maz-warning-foreground` | — | |
| `destructive` | `--maz-destructive` | `--maz-destructive-50..900` | Status — error / danger. |
| `destructive-foreground` | `--maz-destructive-foreground` | — | |
| `contrast` | `--maz-contrast` | `--maz-contrast-50..900` | High-contrast accent (light = near-black, dark = near-white). |
| `contrast-foreground` | `--maz-contrast-foreground` | — | |
| `divider` | `--maz-divider` | `--maz-divider-50..900` | Default border / separator color. |
| `muted` | `--maz-muted` | `--maz-muted-50..900` | Muted / secondary text. |
| `overlay` | `--maz-overlay` | `--maz-overlay-50..900` | Backdrop / dialog scrim. |
| `shadow` | `--maz-shadow` | `--maz-shadow-50..900` | Tint used by Tailwind `shadow-*` utilities (via `--color-elevation`). |

### Scales

Multi-step scales under `scales.<key>`.

| Preset key | CSS variables | Tailwind utility |
| --- | --- | --- |
| `rounded.xs..3xl` | `--maz-rounded-xs..3xl` | `maz:rounded-{key}` (bridged to `--radius-{key}`) |
| `shadow.{sm, md, lg, xl, elevation}` | `--maz-shadow-style-{key}` | `maz:shadow-{key}` (bridged to `--shadow-{key}`) |

> Same naming-collision avoidance as foundation: `rounded.*` (instead of `radius.*`) and `shadow-style-*` (instead of plain `shadow-*`) keep the bridge cycle-free under `prefix(maz)`.

### Components

Per-component knobs under `components.<key>`. All optional — omit to fall back to the surface tokens.

| Preset key | CSS variable | Notes |
| --- | --- | --- |
| `btn.font-weight` | `--maz-btn-font-weight` | Font-weight on `.m-btn`. Defaults to `'500'`. |
| `container.bg.light` / `.dark` | `--maz-container-bg` (per mode) | Background of `Card`, `Container`, `Dialog`, `Popover`, `Drawer`, … Defaults to `var(--maz-surface)`. Bridged to `--color-container`. |
| `input.bg.light` / `.dark` | `--maz-input-bg` (per mode) | Background of `Input`, `Textarea`, `Select`, `Checkbox`, … Defaults to `var(--maz-surface)` light, `var(--maz-surface-400)` dark. Bridged to `--color-input`. |

### Sample output

```css
:root {
  /* Main colors */
  --maz-primary: oklch(0.6495 0.1913 253.63);
  --maz-primary-foreground: oklch(1 0 0);
  --maz-surface: oklch(1 0 0);
  --maz-foreground: oklch(0.2573 0.0068 248.09);

  /* Foundation */
  --maz-base-font-size: 14px;
  --maz-border-width: 1px;
  --maz-space: 0.25rem;
  --maz-font-family: Manrope, sans-serif, …;
  --maz-motion-normal: 200ms;

  /* Scales */
  --maz-rounded-md: 0.7rem;
  --maz-shadow-style-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), …;

  /* Auto-generated 50–950 scale */
  --maz-primary-500: oklch(…);
  /* ... */
}
```

### Dark Mode

```css
.dark {
  --maz-surface: 235 16% 15%;
  --maz-foreground: 0 0% 85%;
  /* Variables automatically adapted */
}

/* Or with media query */
@media (prefers-color-scheme: dark) {
  :root {
    --maz-surface: 235 16% 15%;
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
@reference "../../.vitepress/theme/main.css";
.demo-theme-controls {
  @apply maz:w-full;
}

.theme-controls {
  @apply maz:border-t maz:border-divider maz:pt-4;
}
</style>
