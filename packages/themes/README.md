# @maz-ui/themes

Système de thèmes performant et typé pour Maz-UI, inspiré de Shadcn et PrimeVue.

## Fonctionnalités

- 🎨 **Variables CSS HSL** - Utilise des variables CSS HSL pour une flexibilité maximale
- 🌓 **Mode sombre automatique** - Support natif du mode sombre avec `prefers-color-scheme`
- 🚀 **Génération automatique** - Génère automatiquement les variantes de couleurs (50-950)
- ⚡ **Stratégies flexibles** - Runtime, build-time ou hybride
- 🛡️ **TypeScript strict** - Types complets pour une DX optimale
- 🎯 **Zéro FOUC** - CSS critique injecté inline
- 🔧 **Presets configurables** - Presets prêts à l'emploi et personnalisables

## Installation

```bash
npm install @maz-ui/themes
```

## Utilisation de base

### 1. Installation du plugin

```typescript
import { mazUi } from '@maz-ui/themes'
import { MazThemePlugin } from 'maz-ui'
// main.ts
import { createApp } from 'vue'

const app = createApp(App)

app.use(MazThemePlugin, {
  preset: mazUi,
  strategy: 'hybrid',
  darkModeStrategy: 'class'
})
```

### 2. Utilisation dans les composants

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

## Presets disponibles

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

## Création de presets personnalisés

```typescript
import { definePreset, mazUi } from '@maz-ui/themes'

const myPreset = definePreset(mazUi, {
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
})
```

## API du composable

```typescript
const {
  currentPreset, // Ref<ThemePreset>
  colorMode, // Ref<'light' | 'dark' | 'auto'>
  isDark, // Ref<boolean>
  strategy, // Ref<'runtime' | 'build' | 'hybrid'>
  updateTheme, // (preset: ThemePreset | ThemePresetOverrides) => void
  setColorMode, // (mode: 'light' | 'dark' | 'auto') => void
  toggleDarkMode // () => void
} = useMazTheme()
```

## Stratégies

### Runtime

CSS généré et injecté dynamiquement côté client.

### Build

CSS généré au build-time et inclus dans le bundle.

### Hybrid (recommandé)

CSS critique injecté inline, CSS complet chargé de manière asynchrone.

## Variables CSS générées

Le système génère automatiquement :

- Variables de couleurs de base : `--primary`, `--secondary`, etc.
- Échelles de couleurs : `--primary-50` à `--primary-950`
- Variables de design : `--radius`, `--font-family`
- Support mode sombre via `.dark` ou `@media (prefers-color-scheme: dark)`

## Build-time

```typescript
import { buildThemeCSS, generateThemeBundle } from '@maz-ui/themes'

// CSS pour un preset
const css = buildThemeCSS({
  preset: myPreset,
  darkModeStrategy: 'class',
  critical: true
})

// Bundle pour plusieurs presets
const bundle = generateThemeBundle([mazUi, darkPreset], {
  darkModeStrategy: 'class'
})
```
