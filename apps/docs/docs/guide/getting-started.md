---
title: Getting Started
description: Build amazing Vue applications faster with Maz-UI v4 - The modern, modular component library
head:
  - - meta
    - name: keywords
      content: vue ui library, vue components, nuxt ui, maz-ui installation, vue 3 components
---

# Getting Started

::: tip ✨ What's New in v4

- **Tree-shaking improvements** - Import only what you need
- **TypeScript-first** - Full type safety out of the box
- **Theming system** - Customizable themes and dark mode support (4 presets available)
- **Internationalization** - Locale management and tree-shakable imports
- **Icon library** - Comprehensive collection of SVG icons designed for performance and flexibility
- **Nuxt module** - Effortless Maz-UI integration with auto-imports
- **Performance optimizations** - Tree-shaking benefits and maximum optimization
- **Enhanced accessibility** - WCAG 2.1 AA compliant
- **New components** - MazPopover & MazSelectCountry
:::

## Quick Installation {#quick-installation}

::: code-group

```bash [Vue]
npm install maz-ui
```

```bash [Nuxt]
# Install the dedicated Nuxt module for the best experience (recommended)
npm install @maz-ui/nuxt
```

:::

### Prerequisites

- **Node.js** v18+
- **Vue** 3.5+ or **Nuxt** 3.0+

## Framework Integration

::: code-group

```typescript [Vue Setup]
// main.ts
// Optional: Use the theme plugin for advanced theming
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { createApp } from 'vue'

import App from './App.vue'
// Import Maz-UI styles before your own CSS
import 'maz-ui/styles'

import './style.css'

const app = createApp(App)

// Install theme plugin
app.use(MazUi, {
  /**
   * Theme configuration (optional if you are using the default theme)
   * More information in dedicated documentation
   * @see https://maz-ui.com/guide/theme
   */
  theme: {
    preset: 'maz-ui', // 'ocean' | 'pristine' | 'obsidian' | 'maz-ui'
  },
  /**
   * Translations configuration (optional if you are using english)
   * More information in dedicated documentation
   * @see https://maz-ui.com/guide/translations
   */
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
  },
})

app.mount('#app')
```

```typescript [Nuxt Setup]
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    /**
     * Theme configuration (optional if you are using the default theme)
     * More information in dedicated documentation
     * @see https://maz-ui.com/guide/theme
     */
    theme: {
      preset: 'maz-ui', // 'ocean' | 'pristine' | 'obsidian' | 'maz-ui'
    },
    /**
     * Translations configuration (optional if you are using english)
     * More information in dedicated documentation
     * @see https://maz-ui.com/guide/translations
     */
    translations: {
      locale: 'fr',
      fallbackLocale: 'en',
    },
  },
})
```

:::

::: info Auto-Import Magic
With the Nuxt module, all Maz-UI components, composables, and directives are automatically available without explicit imports!
:::

## Your First Component

Let's start with a simple button to see Maz-UI in action:

::: code-group

```vue [Vue 3]
<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn'

function handleClick() {
  console.log('Button clicked!')
}
</script>

<template>
  <div>
    <MazBtn color="primary" @click="handleClick">
      Hello Maz-UI! 👋
    </MazBtn>
  </div>
</template>
```

```vue [Nuxt 3]
<script setup lang="ts">
// No imports needed with @maz-ui/nuxt module!
function handleClick() {
  console.log('Button clicked!')
}
</script>

<template>
  <div>
    <MazBtn color="primary" @click="handleClick">
      Hello Maz-UI! 👋
    </MazBtn>
  </div>
</template>
```

:::

## Smart Loading with resolvers <Badge text="Vue only" />

### Installation

::: code-group

```bash [pnpm]
pnpm add unplugin-vue-components unplugin-auto-import
```

```bash [npm]
npm install unplugin-vue-components unplugin-auto-import
```

```bash [yarn]
yarn add unplugin-vue-components unplugin-auto-import
```

:::

For the ultimate developer experience, use auto-imports for components, composables, and directives:

::: info Nuxt Users
Auto-import is already integrated in the [@maz-ui/nuxt module](/guide/nuxt). No additional configuration needed!
:::

```typescript
import vue from '@vitejs/plugin-vue'
import {
  MazComponentsResolver,
  MazDirectivesResolver,
  MazModulesResolver
} from 'maz-ui/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    // Auto-import components
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver(),
      ],
      dts: true,
    }),
    // Auto-import composables and utilities
    AutoImport({
      resolvers: [MazModulesResolver()],
      dts: true,
    }),
  ],
})
```

Now use everything without imports:

```vue
<script setup lang="ts">
// Auto-imported composables and utilities
const text = ref('')
const toast = useToast()

// Auto-imported utility functions
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query)
}, 300)

function handleClickOutside() {
  toast.info('Clicked outside!')
}
</script>

<template>
  <!-- Auto-imported components -->
  <MazBtn>Button</MazBtn>
  <MazInput v-model="text" placeholder="Type here..." />

  <!-- Auto-imported directives -->
  <div v-click-outside="handleClickOutside">
    Click outside detector
  </div>

  <!-- Auto-imported tooltip directive -->
  <MazBtn v-tooltip="'This is a tooltip'">
    Hover me
  </MazBtn>
</template>
```

### Available Resolvers

| Resolver                | Purpose                                            | Import               |
| ----------------------- | -------------------------------------------------- | -------------------- |
| `MazComponentsResolver` | Components (MazBtn, MazInput, etc.)                | `'maz-ui/resolvers'` |
| `MazDirectivesResolver` | Directives (v-click-outside, v-tooltip, etc.)      | `'maz-ui/resolvers'` |
| `MazModulesResolver`    | Composables & utilities (useToast, debounce, etc.) | `'maz-ui/resolvers'` |

### Avoiding Naming Conflicts

To avoid naming conflicts, you can use the `prefix` option:

```typescript
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver({ prefix: 'Maz' }), // v-maz-tooltip
      ],
    }),
    AutoImport({
      resolvers: [
        MazModulesResolver({ prefix: 'Maz' }), // useMazToast, useMazTheme
      ],
    }),
  ],
})
```

::: info Complete Resolver Documentation
For comprehensive resolver configuration, advanced options, real-world examples, and troubleshooting, check out our [dedicated resolver guide](/guide/resolvers).
:::

## Ecosystem Packages

Extend Maz-UI with our specialized companion packages:

### @maz-ui/themes

**Advanced Theming System**

Modern theme system with HSL variables, dark mode support, and flexible strategies.

```bash
npm install @maz-ui/themes
```

**Features:**

- 🎨 HSL CSS custom properties
- 🌓 Smart dark mode detection
- ⚡ Multiple rendering strategies
- 🛡️ Full TypeScript support

[→ View Theme Documentation](./theme.md)

---

### @maz-ui/translations

**Internationalization (i18n)**

Internationalization library for Maz-UI.

```bash
npm install @maz-ui/translations
```

**Features:**

- 🌐 Internationalization of Maz-UI components
- 🔄 Locale management
- 📦 Tree-shakable imports
- 🛠️ TypeScript support

[→ View Translations Documentation](./translations.md)

---

### @maz-ui/icons

**Optimized Icon Library**

Comprehensive collection of SVG icons designed for performance and flexibility.

```bash
npm install @maz-ui/icons
```

**Features:**

- 300+ icons
- Usable as Vue components (e.g. `<MazStar name="maz-ui" />`)
- Tree-shakable imports
- Multiple sizes and variants
- Full TypeScript definitions

[→ Browse Icon Library](./icons.md)

---

### @maz-ui/nuxt

**Seamless Nuxt Integration**

Official Nuxt module for effortless Maz-UI integration with auto-imports.

```bash
npm install @maz-ui/nuxt
```

**Features:**

- 🔄 Auto-import components & composables
- 🚀 SSR optimization
- ⚙️ Zero-config setup
- 🎨 Built-in theme support

[→ Nuxt Module Guide](/guide/nuxt)

---

<!-- ### @maz-ui/cli
**Development Tools**

Command-line tools for scaffolding, theming, and project optimization.

```bash
npm install -g @maz-ui/cli
```

**Features:**
- 🏗️ Component scaffolding
- 🎨 Theme generation
- 📊 Bundle analysis
- 🔄 Migration utilities

[→ CLI Documentation](/guide/cli)

## Advanced Usage Patterns -->

### Theme Customization

For comprehensive theming capabilities including CSS custom properties, dark mode, and preset management, explore our advanced theme system:

[→ **Complete Theme Documentation**](/guide/theme)

The theme system provides:

- 🎨 HSL-based CSS custom properties
- 🌓 Automatic dark mode support
- 🎯 Pre-built themes (Maz-UI, Ocean, Pristine, Obsidian)
- ⚡ Multiple rendering strategies
- 🛠️ TypeScript-first configuration

## Performance Optimizations

### Tree-Shaking Benefits

Maz-UI v4 is built with tree-shaking in mind. Import only what you need for optimal bundle sizes:

```typescript
/**
 * Utilities
 */

// ❌ Avoid importing everything
import * as MazUI from 'maz-ui'
// ✅ Import specific utilities
import { formatCurrency, debounce } from 'maz-ui'

/**
 * Components
 */

// ✅ Import specific components (good)
import { MazBtn, MazCard, MazInput } from 'maz-ui/components'
// ✅✅ Direct component import (most optimized)
import MazBtn from 'maz-ui/components/MazBtn'
import MazCard from 'maz-ui/components/MazCard'
import MazInput from 'maz-ui/components/MazInput'

/**
 * Composables
 */

// ✅ Import composable from index file
import { useBreakpoints, useToast } from 'maz-ui/composables'

// ✅✅ Direct composable import (most optimized)
import { useToast } from 'maz-ui/composables/useToast'
import { useBreakpoints } from 'maz-ui/composables/useBreakpoints'

/**
 * Directives
 */

// ✅ Import directive from index file
import { vClickOutside } from 'maz-ui/directives'

// ✅✅ Direct directive import (most optimized)
import { vClickOutside } from 'maz-ui/directives/vClickOutside'

/**
 * Plugins
 */

// ✅ Import plugin from index file
import { MazUi } from 'maz-ui/plugins'
// ✅✅ Direct plugin import (most optimized)
import { MazUi } from 'maz-ui/plugins/maz-ui'

// ✅✅✅ Even better: auto-import does this automatically
// Components, composables, and utilities are imported only when used
```

::: tip Maximum Optimization
**Direct imports** (e.g., `import MazBtn from 'maz-ui/components/MazBtn'`) are the most optimized approach as they bypass index files completely. This ensures the smallest possible bundle size and fastest build times.
:::

## Next Steps

<div class="next-steps">

### **Explore Components**

Browse the [component library](./../components/maz-btn.md) with live examples and API documentation.

### **Customize Themes**

Learn about [theming and customization](./theme.md) to match your brand.

### **Internationalization**

Learn about [internationalization](./translations.md) to support multiple languages.

### **Get Help**

Browse [GitHub discussions](https://github.com/LouisMazel/maz-ui/discussions) or open an issue on [GitHub](https://github.com/LouisMazel/maz-ui/issues).

</div>

<style scoped>
.hero-section {
  @apply maz-rounded maz-p-8 maz-my-12 maz-from-primary-400 maz-to-secondary-700 maz-bg-gradient-to-br;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;

  h3 {
    margin-top: 0;
  }
  ul {
    margin-top: 0;
  }
}

.next-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;

  h3 {
    margin-top: 0;
  }
  p {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .hero-btn {
    width: 200px;
  }
}
</style>
