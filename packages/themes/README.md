# @maz-ui/themes

High-performance and typed theme system for Maz-UI.

## Features

- 🎨 **Native `light-dark()` + `color-scheme`** - Modern CSS theming with zero JS overhead for the light/dark switch
- 🌓 **Native dark mode** - `color-scheme` makes native form controls, scrollbars, and built-in widgets adapt automatically
- 🌈 **Smooth color transitions** - Animated dark/light toggle via `@property` + CSS `transition` (opt-out)
- ✨ **View Transitions** - Optional full-page animated theme switch via `document.startViewTransition()`
- 🛡️ **Anti-FART** - `<meta name="color-scheme">` injected at boot to prevent any Flash of inAccurate coloR Theme
- 🚀 **Automatic generation** - Automatically generates color variants (50-950) via `color-mix(in oklch, …)`
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
  // Class added to <html> when dark mode is forced (default: 'dark')
  darkClass: 'dark',
  // Class added to <html> when light mode is forced (default: 'light')
  lightClass: 'light',
  // Smooth color transition on dark/light toggle (default: true)
  // Can also be `false` for instant switch or `{ duration, easing }` for custom values
  colorTransition: { duration: '300ms', easing: 'ease-in-out' },
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

## Color modes and class toggling

`darkClass` and `lightClass` interact with `darkModeStrategy` to control how `<html>` is decorated.

### `darkModeStrategy: 'class'` (default)

- `setColorMode('dark')` → adds `darkClass` (default `.dark`) to `<html>` → CSS applies `color-scheme: only dark`.
- `setColorMode('light')` → adds `lightClass` (default `.light`) to `<html>` → CSS applies `color-scheme: only light`.
- `setColorMode('auto')` → removes both classes, leaving only `color-scheme: light dark` on `:root` so the browser follows the system `prefers-color-scheme`.

Forcing both classes (light/dark) on the root ensures the browser-native widgets (scrollbars, native `<select>`, date pickers, autofill backgrounds, …) match the explicit user choice rather than the OS preference.

### `darkModeStrategy: 'media'`

- No class is ever added to `<html>`.
- The browser always follows `prefers-color-scheme` via `color-scheme: light dark`.
- `setColorMode()` still updates the persisted cookie but does **not** force a visual override — system preference always wins.

## Color transitions

The `colorTransition` option animates color CSS variables when toggling dark/light.

```ts
// Default — animate with preset `motion-normal` + `easing-in-out`
app.use(MazUiTheme, { preset: mazUi })

// Disable — instant switch (legacy v4 behaviour)
app.use(MazUiTheme, { preset: mazUi, colorTransition: false })

// Custom duration/easing
app.use(MazUiTheme, {
  preset: mazUi,
  colorTransition: { duration: '250ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
})
```

**How it works:** the generator emits an `@property --maz-X { syntax: '<color>'; … }` declaration for every color variable above `@layer theme`, then applies a `transition: <vars> <duration> <easing>` rule on `:root`. The `@property` registration is what makes CSS interpolate colors instead of swapping them instantly.

**Caveat:** `@property` is Baseline 2024 — Firefox shipped support in 128 (July 2024). Browsers without `@property` simply fall through to an instant swap (no error, just no animation).

## Animated theme switch (View Transitions)

For a full-page animated swap (rather than per-variable color tweens), pass `{ animate: true }` to `setColorMode` or `toggleDarkMode`:

```ts
import { useTheme } from '@maz-ui/themes'

const { toggleDarkMode, setColorMode } = useTheme()

await toggleDarkMode({ animate: true })
await setColorMode('dark', { animate: true })
```

- Wraps the switch in `document.startViewTransition()` so the browser captures a snapshot of the page before/after and crossfades between them.
- The helper is **lazy-imported** — when `animate` is not used, the View Transitions glue stays out of the boot bundle.
- **Graceful degradation:** in browsers that don't support the API (e.g., Firefox stable as of mid-2026), the change is applied immediately with no animation — no error thrown.

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
      rounded: { md: '0.75rem' },
    },
    colors: {
      light: {
        primary: 'oklch(0.6 0.2 250)',
        secondary: 'oklch(0.96 0.01 250)',
      },
      dark: {
        primary: 'oklch(0.7 0.2 250)',
        secondary: 'oklch(0.2 0.01 250)',
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
  updateTheme, // (preset: ThemePreset | ThemePresetName | ThemePresetOverrides) => Promise<void>
  setColorMode, // (mode: 'light' | 'dark' | 'auto', options?: { animate?: boolean }) => Promise<void>
  toggleDarkMode, // (options?: { animate?: boolean }) => Promise<void>
} = useTheme()
```

`setColorMode` and `toggleDarkMode` are **async** (`Promise<void>`). The promise resolves once the change — and the optional View Transition — has been applied. Callers can ignore the return value when no transition is needed.

The optional `{ animate?: boolean }` parameter enables the View Transitions API (see [Animated theme switch](#animated-theme-switch-view-transitions)).

## Strategies

### Runtime (recommended)

The full theme CSS is generated and injected synchronously on first paint, on both client and server (via `useHead` in Nuxt). `updateTheme(...)` re-injects the new CSS at runtime.

### Buildtime

CSS generated at build-time and included in the bundle. Nothing is injected at runtime; you must include the generated CSS file yourself.

## Generated CSS variables

The generator produces a modern, native CSS contract:

- **Base colors** are emitted as `light-dark(L, D)` when `mode: 'both'` — a single declaration that the browser resolves to the active scheme. Example: `--maz-primary: light-dark(oklch(0.6 0.2 250), oklch(0.7 0.2 250));`.
- **Scale palettes** `--maz-X-50` through `--maz-X-950` are derived from the base via `color-mix(in oklch, var(--maz-X), white|black N%)`. The `in oklch` interpolation keeps the scale perceptually uniform and chroma-stable.
- **Color scheme** is declared on `:root` as `color-scheme: light dark`. With `darkModeStrategy: 'class'`, the generator also emits `.dark { color-scheme: only dark; }` and `.light { color-scheme: only light; }` so an explicit user choice overrides the system preference (and native widgets follow).
- **Design tokens** — `--maz-rounded-*`, `--maz-shadow-*`, `--maz-font-family`, motion durations, easings, etc. — are bridged into Tailwind v4 via `@theme inline`.
- **`@property` declarations** for every color variable are emitted above `@layer theme` when `colorTransition` is enabled, alongside a single `transition:` rule on `:root` that animates them.

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
