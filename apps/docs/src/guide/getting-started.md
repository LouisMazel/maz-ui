---
title: Getting Started
description: Build Vue and Nuxt applications faster with Maz-UI v4 - The modern, modular component library
head:
  - - meta
    - name: keywords
      content: vue ui library, vue components, nuxt ui, maz-ui installation, vue 3 components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip ✨ What's New in v4

- 🌱 **Tree-shaking improvements** - Import only what you need
- 🛠️ **TypeScript-first** - Full type safety out of the box
- 🎨 **Theming system** - Customizable themes and dark mode support (4 presets available)
- 🌐 **Internationalization** - Locale management and tree-shakable imports
- 🎨 **Icon library** - Comprehensive collection of SVG icons designed for performance and flexibility
- 🧰 **Nuxt module** - Effortless Maz-UI integration with auto-imports
- 🚀 **Performance optimizations** - Tree-shaking benefits and maximum optimization
- 🛠️ **Enhanced accessibility** - WCAG 2.1 AA compliant
- 🆕 **New components** - MazPopover & MazSelectCountry

:::

## Guides

Start by choosing your framework:

<div class="maz-flex maz-gap-4 maz-w-full maz-flex-col tab-m:maz-flex-row vp-raw">
  <MazCard
    href="/guide/vue"
    class="maz-flex-1"
    :gallery="{
      images: ['https://positivethinking.tech/wp-content/uploads/2021/01/Logo-Vuejs.png'],
      height: 200,
      width: '100%',
    }"
  >
    <template #content-title>
      <h3>
        Vue Users Guide
      </h3>
    </template>
    <template #footer>
      <MazBtn color="contrast" href="/guide/vue">
        Go to Vue guide
      </MazBtn>
    </template>
  </MazCard>
  <MazCard
    href="/guide/nuxt"
    class="maz-flex-1"
    content-title="Nuxt Users Guide"
    :gallery="{
      images: ['https://seeklogo.com/images/N/nuxt-2023-logo-7D939E3251-seeklogo.com.png'],
      height: 200,
      width: '100%',
    }"
  >
    <template #content-title>
      <h3>
        Nuxt Users Guide
      </h3>
    </template>
    <template #footer>
      <MazBtn color="contrast" href="/guide/nuxt">
        Go to Nuxt guide
      </MazBtn>
    </template>
  </MazCard>
</div>

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

[→ View Theme Documentation](./themes.md)

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
- Usable as Vue components (e.g. `<MazStar />`)
- Tree-shakable imports
- Multiple sizes and variants
- Full TypeScript definitions

[→ Browse Icon Library](./icons.md)

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

[→ **Complete Theme Documentation**](/guide/themes)

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

// ✅✅✅ Even better: auto-import does this automatically
// Components, composables, and utilities are imported only when used

/**
 * Plugins
 */

// ✅ Import plugin from index file
import { MazUi } from 'maz-ui/plugins'
// ✅✅ Direct plugin import (most optimized)
import { MazUi } from 'maz-ui/plugins/maz-ui'
```

::: tip Maximum Optimization
**Direct imports** (e.g., `import MazBtn from 'maz-ui/components/MazBtn'`) are the most optimized approach as they bypass index files completely. This ensures the smallest possible bundle size and fastest build times.
:::

## Next Steps

<div class="next-steps">

### **Explore Components**

Browse the [component library](./../components/maz-btn.md) with live examples and API documentation.

### **Customize Themes**

Learn about [theming and customization](./themes.md) to match your brand.

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
