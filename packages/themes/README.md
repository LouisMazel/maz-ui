# @maz-ui/themes

High-performance and typed theme system for Maz-UI.

## Features

- 🎨 **HSL CSS Variables** - Uses HSL CSS variables for maximum flexibility
- 🌓 **Automatic dark mode** - Native dark mode support with `prefers-color-scheme`
- 🚀 **Automatic generation** - Automatically generates color variants (50-950)
- ⚡ **Flexible strategies** - Runtime injection or build-time generation
- 🛡️ **Strict TypeScript** - Complete types for optimal DX
- 🎯 **Zero FOUC** - Pass the preset object so the full CSS renders synchronously on first paint
- 🔧 **Configurable presets** - Ready-to-use and customizable presets

## Installation

```bash
npm install @maz-ui/themes
```

## Basic usage

### 1. Plugin installation

```typescript
// main.ts
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazUiTheme, {
  preset: mazUi,
  strategy: 'runtime',
  darkModeStrategy: 'class',
  // remember the active preset name across reloads (default: true)
  persistPreset: true,
})
```

### Preset persistence

The active preset name is stored in a `maz-preset` cookie (1-year TTL, `SameSite=Lax`). At boot the cookie takes priority over `options.preset` (string name **or** preset object — both treated as the default the app boots with), so the user's last choice survives across reloads. The cookie is written on every successful resolution and on every `useTheme().updateTheme()` call, and auto-cleared if the saved name no longer resolves. Set `persistPreset: false` to opt out — no cookie is read or written.

### 2. Usage in components

```vue
<script setup>
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, isDark } = useTheme()
</script>

<template>
  <div class="maz:bg-surface maz:text-foreground">
    <button
      class="maz:bg-primary maz:text-primary-foreground maz:rounded-md"
      @click="toggleDarkMode"
    >
      Toggle Dark Mode
    </button>
  </div>
</template>
```

## Available presets

### Default

```typescript
import { mazUi } from '@maz-ui/themes/presets/mazUi'
```

### Pristine

```typescript
import { pristine } from '@maz-ui/themes/presets/pristine'
```

### Ocean

```typescript
import { ocean } from '@maz-ui/themes/presets/ocean'
```

### Obsidian

```typescript
import { obsidian } from '@maz-ui/themes/presets/obsidian'
```

### Nova

```typescript
import { nova } from '@maz-ui/themes/presets/nova'
```

## Creating custom presets

```typescript
import { definePreset, mazUi } from '@maz-ui/themes'

const myPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'my-theme',
    scales: {
      radius: { md: '0.75rem' },
    },
    colors: {
      light: {
        primary: '220 100% 50%',
        secondary: '210 40% 96%',
      },
      dark: {
        primary: '220 100% 70%',
        secondary: '210 40% 15%',
      },
    },
  },
})
```

## Composable API

```typescript
import { useTheme } from '@maz-ui/themes'

const {
  preset, // ComputedRef<ThemePreset>
  presetName, // ComputedRef<string>
  colorMode, // Ref<'light' | 'dark' | 'auto'>
  isDark, // ComputedRef<boolean>
  strategy, // ComputedRef<'runtime' | 'buildtime'>
  updateTheme, // (preset: ThemePreset | ThemePresetName | ThemePresetOverrides) => void
  setColorMode, // (mode: 'light' | 'dark' | 'auto') => void
  toggleDarkMode, // () => void
} = useTheme()
```

## Strategies

### Runtime (recommended)

The full theme CSS is generated and injected synchronously on first paint, on both client and server (via `useHead` in Nuxt). `updateTheme(...)` re-injects the new CSS at runtime.

### Buildtime

CSS generated at build-time and included in the bundle. Nothing is injected at runtime; you must include the generated CSS file yourself.

## Generated CSS variables

The system automatically generates:

- Base color variables: `--primary`, `--secondary`, etc.
- Color scales: `--primary-50` to `--primary-950`
- Design variables: `--radius`, `--font-family`
- Dark mode support via `.dark` or `@media (prefers-color-scheme: dark)`

## Build-time

```typescript
import { buildThemeCSS, generateThemeBundle } from '@maz-ui/themes'

// CSS for a preset
const css = buildThemeCSS({
  preset: myPreset,
  darkSelector: 'class',
})

// Bundle for multiple presets
const bundle = generateThemeBundle([mazUi, darkPreset], {
  darkSelector: 'class',
})
```
