# @maz-ui/themes

High-performance and typed theme system for Maz-UI, inspired by Shadcn and PrimeVue.

## Features

- 🎨 **HSL CSS Variables** - Uses HSL CSS variables for maximum flexibility
- 🌓 **Automatic dark mode** - Native dark mode support with `prefers-color-scheme`
- 🚀 **Automatic generation** - Automatically generates color variants (50-950)
- ⚡ **Flexible strategies** - Runtime, build-time or hybrid
- 🛡️ **Strict TypeScript** - Complete types for optimal DX
- 🎯 **Zero FOUC** - Critical CSS injected inline
- 🔧 **Configurable presets** - Ready-to-use and customizable presets

## Installation

```bash
npm install @maz-ui/themes
```

## Basic usage

### 1. Plugin installation

```typescript
import { MazUiTheme } from '@maz-ui/themes'
// main.ts
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazUiTheme, {
  preset: 'maz-ui',
  strategy: 'hybrid',
  darkModeStrategy: 'class'
})
```

### 2. Usage in components

```vue
<script setup>
import { useMazTheme } from '@maz-ui/themes'

const { toggleDarkMode, isDark } = useMazTheme()
</script>

<template>
  <div class="maz-bg-background maz-text-foreground">
    <button
      class="maz-bg-primary maz-text-primary-foreground maz-rounded-[var(--radius)]"
      @click="toggleDarkMode"
    >
      Toggle Dark Mode
    </button>
  </div>
</template>
```

## Available presets

### Default (Shadcn-like)

```typescript
import { mazUi } from '@maz-ui/themes'
```

### Dark

```typescript
import { dark } from '@maz-ui/themes'
```

### Ocean

```typescript
import { ocean } from '@maz-ui/themes'
```

### Obsidian

```typescript
import { obsidian } from '@maz-ui/themes'
```

## Creating custom presets

```typescript
import { definePreset, mazUi } from '@maz-ui/themes'

const myPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'my-theme',
    radius: '0.75rem',
    colors: {
      light: {
        primary: '220 100% 50%',
        secondary: '210 40% 96%'
      },
      dark: {
        primary: '220 100% 70%',
        secondary: '210 40% 15%'
      }
    }
  }
})
```

## Composable API

```typescript
const {
  currentPreset, // Ref<ThemePreset>
  colorMode, // Ref<'light' | 'dark' | 'auto'>
  isDark, // Ref<boolean>
  strategy, // Ref<'runtime' | 'build' | 'hybrid'>
  updateTheme, // (preset: ThemePreset | ThemePresetName | ThemePresetOverrides) => void
  setColorMode, // (mode: 'light' | 'dark' | 'auto') => void
  toggleDarkMode // () => void
} = useMazTheme()
```

## Strategies

### Runtime

CSS generated and injected dynamically on the client side.

### Build

CSS generated at build-time and included in the bundle.

### Hybrid (recommended)

Critical CSS injected inline, complete CSS loaded asynchronously.

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
  darkModeStrategy: 'class',
  critical: true
})

// Bundle for multiple presets
const bundle = generateThemeBundle([mazUi, darkPreset], {
  darkModeStrategy: 'class'
})
```
