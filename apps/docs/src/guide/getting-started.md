---
title: Getting Started
description: Build Vue and Nuxt applications faster with Maz-UI v4 - The modern, modular component library
head:
  - - meta
    - name: keywords
      content: vue ui library, vue components, nuxt ui, maz-ui installation, components, nuxt, vue, themes, translations, icons, mcp, maz-ui
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip **Why Maz-UI?**

- 🌱 **Tree-shaking** - Import only what you need
- 🛠️ **TypeScript-first** - Full type safety out of the box
- 🚀 **Performance** - Tree-shaking benefits and maximum optimization
- 🎨 **Theming system** - Customizable themes and dark mode support (4 presets available) - [@maz-ui/themes](./themes.md)
- 💨 **Optional Tailwind bridge** - Already have a Tailwind v4 setup? Expose your active maz-ui theme tokens (colors, radius, breakpoints, custom utilities) to your own Tailwind config - [Tailwind integration](./tailwind.md)
- 🌐 **Internationalization** - Locale management and tree-shakable imports - [@maz-ui/translations](./translations.md)
- 🎨 **Icon library** - Comprehensive collection of SVG icons designed for performance and flexibility (400+ icons) - [@maz-ui/icons](./icons.md)
- 🧰 **Nuxt module** - Effortless Maz-UI integration with auto-imports - [@maz-ui/nuxt](./nuxt.md)
- 🤖 **MCP** - Connect your IA agents to the documentation - [@maz-ui/mcp](./mcp.md)

:::

## Guides

Start by choosing your framework:

<div class="maz:flex maz:gap-4 maz:w-full maz:flex-col maz:tab-m:flex-row vp-raw">
  <MazCard
    href="/guide/vue"
    class="maz:flex-1"
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
        Vue guide
      </MazBtn>
    </template>
  </MazCard>
  <MazCard
    href="/guide/nuxt"
    class="maz:flex-1"
    content-title="Nuxt Users Guide"
    :gallery="{
      images: ['https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8mpeku6brwkfmrsumu3h.png'],
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
        Nuxt guide
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

- 860+ icons
- Usable as Vue components (e.g. `<MazStar />`)
- Tree-shakable imports
- Multiple sizes and variants
- Full TypeScript definitions

[→ Browse Icon Library](./icons.md)

---

### @maz-ui/mcp

**Maz-UI MCP server to connect your IA agents to the documentation**

**Features:**

- Connect your IA agents to the documentation

[→ View MCP Documentation](./mcp.md)

## Performance Optimizations

### Tree-Shaking Benefits

Maz-UI v4 is built with tree-shaking in mind. Import only what you need for optimal bundle sizes:

```typescript
/**
 * Utilities
 */

// ❌ Avoid importing everything
import { formatCurrency, debounce } from 'maz-ui'
// ✅ Import from @maz-ui/utils
import { formatCurrency, debounce } from '@maz-ui/utils'

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

### Explore Components

Browse the [component library](./../components/maz-btn.md) with live examples and API documentation.

### Customize Themes

Learn about [theming and customization](./themes.md) to match your brand.

### Internationalization

Learn about [internationalization](./translations.md) to support multiple languages.

### Lazy Loading with MazUiProvider

Use [`MazUiProvider`](./maz-ui-provider.md) to defer Maz-UI initialization to lazy-loaded pages for zero entry-bundle overhead.

### Get Help

Browse [GitHub discussions](https://github.com/LouisMazel/maz-ui/discussions) or open an issue on [GitHub](https://github.com/LouisMazel/maz-ui/issues).

</div>

<style scoped>
@reference "../../.vitepress/theme/main.css";
.hero-section {
  @apply maz:rounded maz:p-8 maz:my-12 maz:from-primary-400 maz:to-secondary-700 maz:bg-linear-to-br;
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
