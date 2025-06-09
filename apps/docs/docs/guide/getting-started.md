---
title: Getting Started
description: Build amazing Vue applications faster with Maz-UI v4 - The modern, modular component library
head:
  - - meta
    - name: keywords
      content: vue ui library, vue components, nuxt ui, maz-ui installation, vue 3 components
---

# Getting Started

<div class="hero-section">
  <p class="hero-description">
    Discover Maz-UI v4: The modern, modular Vue component library designed for performance, accessibility, and developer experience. From simple buttons to complex data tables, build stunning interfaces in minutes.
  </p>

  <div class="hero-actions">
    <a href="#quick-installation" class="hero-btn primary">Get Started →</a>
    <a href="/components/maz-btn" class="hero-btn secondary">Browse Components</a>
  </div>
</div>

::: tip ✨ What's New in v4

- **Tree-shaking by default** - Import only what you need
- **Modular CSS** - Each component brings its own styles
- **Enhanced accessibility** - WCAG 2.1 AA compliant
- **TypeScript-first** - Full type safety out of the box
  :::

## Quick Installation {#quick-installation}

::: code-group

```bash [npm]
npm install maz-ui
```

```bash [yarn]
yarn add maz-ui
```

```bash [pnpm]
pnpm add maz-ui
```

:::

### Prerequisites

- **Node.js** v18+
- **Vue** 3.2+ or **Nuxt** 3.0+

## Your First Component

Let's start with a simple button to see Maz-UI in action:

::: code-group

```vue [Vue 3]
<script setup lang="ts">
import { MazBtn } from 'maz-ui/components'
import 'maz-ui/styles'

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

## Framework Integration

### Vue 3 Setup

Import the main CSS file and optionally configure the theme plugin in your `main.ts`:

```typescript
// Optional: Use the theme plugin for advanced theming
import { MazUiPlugin } from 'maz-ui/plugins/maz-ui'
import { createApp } from 'vue'

import App from './App.vue'
// Import Maz-UI styles before your own CSS
import 'maz-ui/styles'

import './style.css'

const app = createApp(App)

// Install theme plugin with default configuration
app.use(MazUiPlugin, {
  // Theme configuration (optional)
  strategy: 'hybrid', // 'runtime' | 'build' | 'hybrid'
  darkModeStrategy: 'class' // 'class' | 'media' | 'auto'
})

app.mount('#app')
```

::: info Theme Plugin Benefits
The `MazUiPlugin` enables advanced theming capabilities, dark mode management, and CSS custom properties generation. It's optional but recommended for full theme control.
:::

### Nuxt 3 Setup <Badge type="tip" text="Recommended" />

Install the dedicated Nuxt module for the best experience:

```bash
npm install @maz-ui/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    // Auto-import components, composables, and CSS
    autoImport: true,
    // Optional: customize theme
    theme: 'light', // 'light' | 'dark' | 'auto'
  }
})
```

::: info Auto-Import Magic
With the Nuxt module, all Maz-UI components, composables, and directives are automatically available without explicit imports!
:::

## Why Choose Maz-UI?

<div class="features-grid">

### 🚀 **Performance First**

- Tree-shaking reduces bundle size by up to 80%
- Modular CSS architecture
- Runtime optimizations
- Minimal dependencies

### ♿ **Accessibility Built-in**

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimized
- Focus management

### 🎨 **Design Excellence**

- Modern, clean aesthetics
- Dark/Light mode support
- Customizable themes
- Consistent design tokens

### 🛠️ **Developer Experience**

- TypeScript-first approach
- Comprehensive documentation
- Auto-completion support
- Extensive examples

</div>

## Smart Loading

### Auto-Import with unplugin-vue-components & unplugin-auto-import <Badge text="Vue only" />

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

When using multiple UI libraries, use prefixes to prevent conflicts:

```typescript
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MazComponentsResolver({ prefix: 'Maz' }), // MazMazBtn, MazMazInput
        MazDirectivesResolver({ prefix: 'Maz' }), // v-maz-tooltip
        ElementPlusResolver({ prefix: 'El' }), // ElButton, ElInput
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

[→ View Theme Documentation](/guide/theme)

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

[→ Browse Icon Library](/icons/)

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

### Modular CSS Architecture

Maz-UI components automatically import their own styles when used, ensuring optimal bundle sizes:

```typescript
// Each component brings its own CSS
import { MazBtn } from 'maz-ui/components'
// MazBtn's CSS is automatically included

// No need to manually import component styles
// The bundler will tree-shake unused component CSS
```

::: info Automatic Style Management
Components handle their own CSS imports internally, so you don't need to worry about manual style imports. This ensures you only get the CSS for components you actually use.
:::

### Global Component Registration

Register frequently used components globally:

```typescript
import { MazBtn, MazCard, MazInput } from 'maz-ui/components'
// main.ts
import { createApp } from 'vue'

const app = createApp(App)

// Register commonly used components
app.component('MazBtn', MazBtn)
app.component('MazInput', MazInput)
app.component('MazCard', MazCard)
```

### Theme Customization

For comprehensive theming capabilities including CSS custom properties, dark mode, and preset management, explore our advanced theme system:

[→ **Complete Theme Documentation**](/guide/theme)

The theme system provides:

- 🎨 HSL-based CSS custom properties
- 🌓 Automatic dark mode support
- 🎯 Pre-built themes (Maz-UI, Ocean, Pristine)
- ⚡ Multiple rendering strategies
- 🛠️ TypeScript-first configuration

## Performance Optimizations

### Tree-Shaking Benefits

Maz-UI v4 is built with tree-shaking in mind. Import only what you need for optimal bundle sizes:

```typescript
// ❌ Avoid importing everything
import * as MazUI from 'maz-ui'

import { currency, debounce } from 'maz-ui'
// ✅ Import specific components (good)
import { MazBtn, MazCard, MazInput } from 'maz-ui/components'
// ✅✅ Direct component import (most optimized)
import MazBtn from 'maz-ui/components/MazBtn'
import MazCard from 'maz-ui/components/MazCard'

import MazInput from 'maz-ui/components/MazInput'
import { useBreakpoints, useToast } from 'maz-ui/composables'
import useBreakpoints from 'maz-ui/composables/useBreakpoints'

// ✅✅ Direct composable import (most optimized)
import useToast from 'maz-ui/composables/useToast'
import currency from 'maz-ui/modules/currency'

// ✅✅ Direct utility import (most optimized)
import debounce from 'maz-ui/modules/debounce'
import { MazUiPlugin } from 'maz-ui/plugins'

// ✅✅ Direct plugin import (most optimized)
import { MazUiPlugin } from 'maz-ui/plugins/maz-ui'

// ✅✅✅ Even better: auto-import does this automatically
// Components, composables, and utilities are imported only when used
```

::: tip Maximum Optimization
**Direct imports** (e.g., `import MazBtn from 'maz-ui/components/MazBtn'`) are the most optimized approach as they bypass index files completely. This ensures the smallest possible bundle size and fastest build times.
:::

### Import Strategies Comparison

```typescript
import { debounce } from 'maz-ui'
// Strategy 1: Modular imports (best for production)
import { MazBtn } from 'maz-ui/components'
// Strategy 3: Global registration (for commonly used components)
import { MazBtn, MazInput } from 'maz-ui/components'
// Bundle impact: ~10-20KB per component/composable

// Strategy 2: Auto-import with resolvers (recommended)
// No imports needed, automatic tree-shaking
// Bundle impact: Same as modular, but zero boilerplate

import { useToast } from 'maz-ui/composables'
app.component('MazBtn', MazBtn)
app.component('MazInput', MazInput)
// Bundle impact: Only registered components included
```

## Next Steps

<div class="next-steps">

### **Explore Components**

Browse the [component library](./../components/maz-btn.md) with live examples and API documentation.

### **Customize Themes**

Learn about [theming and customization](./theme.md) to match your brand.

### **Get Help**

Browse [GitHub discussions](https://github.com/LouisMazel/maz-ui/discussions) or open an issue on [GitHub](https://github.com/LouisMazel/maz-ui/issues).

</div>

<style scoped>
.hero-section {
  text-align: center;
  margin: 2rem 0 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.hero-btn.primary {
  background: white;
  color: #667eea;
}

.hero-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
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
