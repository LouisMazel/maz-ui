---
title: Maz-UI v4.0.0 Migration Guide
description: Complete guide to migrate from Maz-UI v3.x to v4.0.0 - Modular architecture, optimized tree-shaking, and new components
---

# {{ $frontmatter.title }}

Maz-UI v4.0.0 isn’t just an update — it’s a complete rebuild designed to give developers more flexibility and simplicity.

The library is now split into independent packages, allowing you to install and use only what you need.\
The theme system has been redesigned to make customizing and managing multiple themes easier, while the internationalization system offers full control over translations.\
Performance has also been significantly improved thanks to optimal tree-shaking, more efficient minification, and a modernized architecture.

::: tip Connected to Maz-UI MCP

Follow the [MCP](/guide/mcp) guide to connect your AI assistant to Maz-UI's documentation for a smooth migration process.

:::

## Why Migrate to v4.0.0?

### Architectural Revolution

v4.0.0 isn't just an update, it's a **complete rebuild** that transforms Maz-UI into a modern and performant library:

#### Optimized Tree-Shaking

- **Dramatic bundle reduction**: 60-90% size reduction
- **Granular imports**: Every component, composables, plugins, directive, and utility is individually importable
- **Modern bundlers**: Perfect compatibility with Vite, Webpack 5, Rollup

#### Modular Architecture

- **Restructured monorepo**: Separation into specialized packages
- **New export structure**: Modular exports for better DX
- **Maximum flexibility**: Choose exactly what you need

#### Advanced Theme System

- **Predefined presets**: `mazUi`, `obsidian`, `ocean`, `pristine`
- **Dynamic CSS Variables**: Automatic CSS variable generation
- **Intelligent dark mode**: Configurable strategies for dark mode based on system preferences and user choice stored in cookies

#### Complete Internationalization

- **9 supported languages by default**: EN, FR, DE, ES, IT, PT, JA, ZH-CN
- **Add your own languages**: Easy integration of custom translations
- **Translation system**: Vue plugin and dedicated composables
- **Automatic fallback**: Smart handling of missing translations

#### New Components or refactored

- **MazLink**: Modern link component replacing `MazBtn variant="link"`
- **MazExpandAnimation**: CSS Grid expansion animation (replaces `MazTransitionExpand`)
- **MazDropzone**: Complete rewrite without external dependency
- **MazPopover**: Versatile overlay component with smart positioning
- **MazSelectCountry**: Country/language selector with i18n support

## New Packages

v4.0.0 separates functionality into specialized packages for better modularity:

### Main Packages

| Package | Description | Status |
|---------|-------------|--------|
| **maz-ui** | Vue components, composables, plugins | Refactored |
| **@maz-ui/themes** | Theme system and presets | New |
| **@maz-ui/translations** | i18n translations | New |
| **@maz-ui/utils** | JavaScript/TypeScript utilities | New |
| **@maz-ui/icons** | SVG icons and flags (860+ icons) | New |
| **@maz-ui/cli** | CLI for theme generation | Renamed |
| **@maz-ui/nuxt** | Nuxt module | New |
| **@maz-ui/mcp** | MCP server for IA agent | New |

## Migration Checklist

### Step 1: Update Dependencies

```bash
# Uninstall old version
npm uninstall maz-ui

# Install new version
npm install maz-ui@4.0.0

# Optional: Install specialized packages
npm install @maz-ui/themes @maz-ui/translations @maz-ui/utils @maz-ui/icons

# Remove external dependency no longer needed
npm uninstall dropzone
```

**Updated peer dependencies:**
- **Vue**: `^3.5.0` (was `^3.0.0`)
- **unplugin-vue-components**: `>=28.0.0`
- **unplugin-auto-import**: `>=19.0.0`

### Vue users - Plugin configuration

**NEW**: v4.0.0 introduces a mandatory Vue plugin for configuration.

#### Before (v3.x)

```typescript
// main.ts
import { createApp } from 'vue'
import 'maz-ui/style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

#### After (v4.0.0)

```typescript
// main.ts
import { createApp } from 'vue'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets'
import { fr } from '@maz-ui/translations'

// Import styles before your CSS
import 'maz-ui/style.css'
import './style.css'

import App from './App.vue'

const app = createApp(App)

// NEW: MazUi plugin required
app.use(MazUi, {
  // Theme configuration (optional)
  theme: {
    preset: mazUi, // or 'ocean' | 'pristine' | 'obsidian'
  },
  // Translation configuration (optional)
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
      fr,
    },
  },
})

app.mount('#app')
```

### Nuxt users - Module Configuration

**NEW**: Dedicated Nuxt module with simplified API.

#### Before (v3.x)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['maz-ui/nuxt'],
  mazUi: {
    // v3 configuration
  }
})
```

#### After (v4.0.0)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'], // New package
  mazUi: {
    // New configuration API
    theme: {
      preset: 'maz-ui',
      strategy: 'hybrid',
      darkModeStrategy: 'class',
    },
    translations: {
      locale: 'fr',
      fallbackLocale: 'en',
    },
    plugins: {
      aos: true,
      dialog: true,
      toast: true,
      wait: true,
    },
    directives: {
      vTooltip: true,
      vLazyImg: true,
      vClickOutside: true,
    },
  }
})
```

### Import Migration

**MAJOR CHANGE**: New modular import structure.

#### Components

**NOTE**: Component imports haven't changed - they work the same way as in v3.x.

```typescript
// ✅ SAME AS v3.x - Still works
import MazBtn from 'maz-ui/components/MazBtn'
import MazInput from 'maz-ui/components/MazInput'

// ✅ NEW - Batch imports for convenience
import { MazBtn, MazInput } from 'maz-ui/components'
```

#### Plugins

```typescript
// ❌ BEFORE (v3.x)
import { installToaster, ToastHandler } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { ToastPlugin, ToastHandler } from 'maz-ui/plugins'
// or for maximum tree-shaking
import { ToastPlugin, ToastHandler } from 'maz-ui/plugins/toast'
```

#### Directives

```typescript
// ❌ BEFORE (v3.x)
import { vClickOutside, vTooltip } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { vClickOutside, vTooltip } from 'maz-ui/directives'
// or for maximum tree-shaking
import { vClickOutside } from 'maz-ui/directives/vClickOutside'
import { vTooltip } from 'maz-ui/directives/vTooltip'
```

#### Composables

```typescript
// ❌ BEFORE (v3.x)
import { useTimer, useToast } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { useTimer, useToast } from 'maz-ui/composables'
// or for maximum tree-shaking
import { useTimer } from 'maz-ui/composables/useTimer'
import { useToast } from 'maz-ui/composables/useToast'
```

#### Utilities

```typescript
// ❌ BEFORE (v3.x)
import { currency, date } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { formatCurrency, formatDate } from 'maz-ui'
// or for better performance
import { formatCurrency, formatDate } from '@maz-ui/utils'
```

## Component Changes

### MazBtn - Major Changes

#### Removed `variant="link"`

```html
<!-- ❌ BEFORE (v3.x) -->
<MazBtn variant="link" href="/path">
  Link
</MazBtn>

<!-- ✅ AFTER (v4.0.0) - Use MazLink -->
<MazLink href="/path">
  Link
</MazLink>

<!-- Action with click -->
<MazLink @click="handleClick">
  Action
</MazLink>
```

#### Prop Changes

```html
<!-- CHANGED PROPS -->
<MazBtn
  outlined            <!-- ✅ NEW: was 'outline' -->
  justify="space-between"  <!-- 🆕 NEW: Content alignment -->
  :padding="false"         <!-- 🆕 NEW: Padding control -->
  rounded-size="full"      <!-- 🆕 NEW: Border radius size -->
>
  Button
</MazBtn>
```

### MazLink - New Component

Replaces `MazBtn variant="link"` with a richer API:

```html
<!-- ✅ NEW COMPONENT -->
<MazLink
  href="/path"
  :auto-external="true"           <!-- 🆕 NEW: Automatic external icon -->
  :underline-hover="true"         <!-- 🆕 NEW: Underline on hover -->
  left-icon="home"                <!-- 🆕 NEW: Left icon -->
  right-icon="arrow-right"        <!-- 🆕 NEW: Right icon -->
  color="primary"                 <!-- 🆕 NEW: Custom color -->
  as="router-link"               <!-- 🆕 NEW: Custom component -->
>
  Link with icons
</MazLink>
```

### MazPicker --> MazDatePicker

MazPicker has been renamed to MazDatePicker.

Props have been changed:
- `no-header` --> `hide-header`
- `input-date-style` --> `input-date-format`

New Props:
- `min-max-auto`: Control behavior when the date is in the range of min and max.

```html
<MazDatePicker />
```

### MazPopover - New Component

Versatile overlay component with smart positioning:

```html
<!-- NEW COMPONENT -->
<MazPopover
  trigger="click"                 <!-- 🆕 NEW: Trigger mode -->
  position="bottom-start"         <!-- 🆕 NEW: Smart positioning -->
  :persistent="true"              <!-- 🆕 NEW: Keep open for interactions -->
  role="dialog"                   <!-- 🆕 NEW: Accessibility role -->
>
  <template #trigger>
    <MazBtn>Open Popover</MazBtn>
  </template>

  <template #default>
    <div class="p-4">
      Popover content
    </div>
  </template>
</MazPopover>
```

### MazSelectCountry - New Component

Country/language selector with i18n support:

```html
<!-- ✅ NEW COMPONENT -->
<MazSelectCountry
  v-model="selectedCountry"
  :preferred-codes="['US', 'FR']"  <!-- 🆕 NEW: Preferred countries -->
  :locale="'fr'"                   <!-- 🆕 NEW: Localization -->
  :hide-flags="false"              <!-- 🆕 NEW: Flag display -->
  :display-code="false"            <!-- 🆕 NEW: Show codes -->
/>
```

### MazInputPhoneNumber - Renamed

```html
<!-- ❌ BEFORE (v3.x) -->
<MazPhoneNumberInput
  v-model="phone"
  v-model:country-code="country"
  :preferred-countries="['FR', 'US']"
  @update="handleUpdate"
/>

<!-- ✅ AFTER (v4.0.0) -->
<MazInputPhoneNumber
  v-model="phone"
  v-model:country-code="country"
  :preferred-countries="['FR', 'US']"
  @data="handleData"            <!-- 🔄 CHANGED: @update → @data -->
/>
```

### MazExpandAnimation - Replaces MazTransitionExpand

```html
<!-- ❌ BEFORE (v3.x) -->
<MazTransitionExpand animation-duration="500ms">
  <div v-show="isOpen">Content</div>
</MazTransitionExpand>

<!-- ✅ AFTER (v4.0.0) -->
<MazExpandAnimation
  v-model="isOpen"                <!-- 🆕 NEW: v-model for state control -->
  duration="500ms"               <!-- 🔄 CHANGED: duration instead of animation-duration -->
  timing-function="ease-in-out"  <!-- 🆕 NEW: Timing function -->
>
  <div>Content</div>
</MazExpandAnimation>
```

### MazDropzone - Complete Rewrite

**External dependency removed:**

```bash
# ❌ BEFORE (v3.x) - External dependency required
npm install dropzone

# ✅ AFTER (v4.0.0) - No external dependency
npm uninstall dropzone
```

**New Features:**

```html
<!-- ✅ NEW FEATURES -->
<MazDropzone
  v-model="files"
  :auto-upload="'single'"          <!-- 🆕 NEW: Automatic upload -->
  url="/api/upload"                <!-- 🆕 NEW: Upload URL -->
  :request-options="{ ... }"       <!-- 🆕 NEW: Request options -->
  :transform-body="transformFn"    <!-- 🆕 NEW: Body transformation -->
  :min-file-size="0.1"            <!-- 🆕 NEW: Min size in MB -->
  @upload-success="onSuccess"      <!-- 🆕 NEW: Success event -->
  @upload-error="onError"          <!-- 🆕 NEW: Error event -->
/>
```

### MazDropdown & MazSelect - Position API

```html
<!-- ❌ BEFORE (v3.x) -->
<MazDropdown position="bottom right" />
<MazSelect position="bottom right" />

<!-- ✅ AFTER (v4.0.0) -->
<MazDropdown position="bottom-end" />
<MazSelect position="bottom-end" />
```

**New position type:**

```typescript
type MazPopoverPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right' |
  'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
  'left-start' | 'left-end' | 'right-start' | 'right-end'
```

### MazDialogConfirm - Renamed

```typescript
// ❌ BEFORE (v3.x)
import { MazDialogPromise } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { MazDialogConfirm } from 'maz-ui'
```

## Composable Changes

### useDialog - API Changes

**No longer Promise-based to avoid JS console errors:**

```typescript
// ❌ BEFORE (v3.x)
const dialog = useDialog()

try {
  const result = await dialog.confirm({
    title: 'Confirm',
    message: 'Are you sure?',
    confirmText: 'Yes',
    cancelText: 'No'
  })
  // Handle confirm
} catch (error) {
  // Handle cancel
}
```

```typescript
// ✅ AFTER (v4.0.0)
const dialog = useDialog()

dialog.confirm({
  title: 'Confirm',
  message: 'Are you sure?',
  buttons: {                      // 🔄 CHANGED: buttons instead of confirmText/cancelText
    confirm: 'Yes',
    cancel: 'No'
  },
  onAccept: () => {              // 🆕 NEW: Accept callback
    // Handle confirm
  },
  onReject: () => {              // 🆕 NEW: Reject callback
    // Handle cancel
  },
  onClose: () => {               // 🆕 NEW: Close callback (finally)
    // Handle close
  }
})
```

### useDisplayNames - Renamed

```typescript
// ❌ BEFORE (v3.x)
import { useLanguageDisplayNames } from 'maz-ui'

const { getDisplayName } = useLanguageDisplayNames()

// ✅ AFTER (v4.0.0)
import { useDisplayNames } from 'maz-ui/composables'

const { getDisplayName } = useDisplayNames()
```

**📖 Complete documentation:** [useDisplayNames Guide](/composables/use-display-names)

### Helpers to Composables

**🔄 MAJOR CHANGE**: Several helpers are now Vue composables and must be used within Vue context.

#### useIdleTimeout

```typescript
// ❌ BEFORE (v3.x)
import { idleTimeout } from 'maz-ui'

const controller = idleTimeout({
  timeout: 5000,
  onTimeout: () => console.log('timeout'),
  onActivity: () => console.log('activity')
})

// ✅ AFTER (v4.0.0)
import { useIdleTimeout } from 'maz-ui/composables'

// In a Vue component
const { isIdle } = useIdleTimeout({
  timeout: 5000,
  onTimeout: () => console.log('timeout'),
  onActivity: () => console.log('activity')
})
```

## Color System Changes

### Color Removals and Replacements

```typescript
// ❌ REMOVED COLORS
color="theme"     // ✅ REPLACED BY: color="contrast"
color="white"     // ❌ REMOVED
color="black"     // ❌ REMOVED
color="danger"    // ✅ REPLACED BY: color="destructive"
```

### 🆕 New Color System

**Available colors in v4.0.0:**

```typescript
type MazColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' |
  'warning' | 'destructive' | 'contrast' | 'transparent'
```

**Migration examples:**

```html
<!-- ❌ BEFORE (v3.x) -->
<MazBtn color="theme">Theme Button</MazBtn>
<MazBtn color="danger">Danger Button</MazBtn>

<!-- ✅ AFTER (v4.0.0) -->
<MazBtn color="contrast">Contrast Button</MazBtn>
<MazBtn color="destructive">Destructive Button</MazBtn>
```

## Removed Features

### Removed Directive

```html
<!-- ❌ REMOVED - v-closable directive -->
<div v-closable="handler">Content</div>

<!-- ✅ ALTERNATIVE - Use v-click-outside -->
<div v-click-outside="handler">Content</div>
```

### Removed Utility Names

```typescript
// ❌ BEFORE (v3.x)
import { currency, date } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import { formatCurrency, formatDate } from 'maz-ui'
```

## TypeScript Changes

### Type Prefixing

**All component types are now prefixed with `Maz`:**

```typescript
// ❌ BEFORE (v3.x)
import type { Props } from 'maz-ui/components/MazBtn'
import type { ButtonsRadioOption, Row, Color, Size } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { MazRadioButtonsOption, MazTableRow, MazColor, MazSize } from 'maz-ui'
```

### Type Import Changes

```typescript
// ❌ BEFORE (v3.x)
import type { Color, Size } from 'maz-ui'

// ✅ AFTER (v4.0.0)
import type { MazColor, MazSize } from 'maz-ui'
```

## Theme System

### Basic Configuration

```typescript
// main.ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi } from '@maz-ui/themes/presets'

app.use(MazUi, {
  theme: {
    preset: mazUi, // or 'ocean' | 'pristine' | 'obsidian'
  },
})
```

### Custom Theme

```typescript
import { definePreset } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets'

const customTheme = definePreset({
  base: mazUi,
  name: 'custom-theme',
  colors: {
    light: {
      primary: '220 100% 50%',
      secondary: '220 14% 96%',
    },
    dark: {
      primary: '220 100% 70%',
      secondary: '220 14% 4%',
    }
  }
})

app.use(MazUi, {
  theme: {
    preset: customTheme,
  },
})
```

### useTheme Composable

```vue
<script setup>
import { useTheme } from 'maz-ui/composables'

const { isDark, toggleDarkMode, setTheme } = useTheme()

// Change theme
setTheme('ocean')

// Toggle dark mode
toggleDarkMode()
</script>

<template>
  <button @click="toggleDarkMode">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>
```

**📖 Complete documentation:** [Theme Guide](/guide/themes)

## Translation System

### Configuration

```typescript
// main.ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { fr, en } from '@maz-ui/translations'

app.use(MazUi, {
  translations: {
    locale: 'fr',
    fallbackLocale: 'en',
    messages: {
      fr,
      en,
    },
  },
})
```

### useTranslations Composable

```vue
<script setup>
import { useTranslations } from 'maz-ui/composables'

const { t, locale, setLocale } = useTranslations()

// Change language
setLocale('fr')
</script>

<template>
  <p>{{ t('button.cancel') }}</p>
</template>
```

**📖 Complete documentation:** [Translation Guide](/guide/translations)

## Common Errors and Solutions

### "idleTimeout is not a function"

```typescript
// ❌ Old way
import { idleTimeout } from 'maz-ui'

// ✅ New way
import { useIdleTimeout } from 'maz-ui/composables'

// In a Vue component
const { isIdle } = useIdleTimeout({ timeout: 5000 })
```

### ❌ "MazTransitionExpand is not exported"

```vue
<!-- ❌ Removed component -->
<MazTransitionExpand>
  <div v-show="isOpen">Content</div>
</MazTransitionExpand>

<!-- ✅ New component -->
<MazExpandAnimation v-model="isOpen">
  <div>Content</div>
</MazExpandAnimation>
```

### ❌ "Module not found: Can't resolve 'dropzone'"

```bash
# ❌ Remove old dependency
npm uninstall dropzone

# ✅ MazDropzone has no external dependency
```

### ❌ "useTheme must be used within MazUi plugin"

```typescript
// ❌ Missing plugin
import { createApp } from 'vue'

// ✅ Add MazUi plugin
import { MazUi } from 'maz-ui/plugins/maz-ui'

app.use(MazUi)
```

### ❌ "Property 'outline' does not exist"

```html
<!-- ❌ Old prop name -->
<MazBtn outline>Button</MazBtn>

<!-- ✅ New prop name -->
<MazBtn outlined>Button</MazBtn>
```

## Migration Benefits

### Performance

| Metric | v3.x | v4.0.0 | Improvement |
|--------|------|--------|-------------|
| **Bundle Size** | ~500KB | ~50-200KB | 60-90% |
| **Tree-shaking** | ❌ Limited | ✅ Optimal | Perfect |
| **Lazy Loading** | ❌ Basic | ✅ Advanced | Intelligent |
| **TypeScript** | ✅ Good | ✅ Excellent | Strict |

### Developer Experience

- **Auto-imports**: Resolvers for unplugin-vue-components
- **TypeScript**: Strict types and perfect auto-completion
- **DevTools**: Nuxt DevTools integration
- **Documentation**: Interactive guides and examples

### Maintenance

- **Modularity**: Separate packages for better maintenance
- **Versioning**: Semantic versioning for each package
- **Stability**: Mature and tested architecture

## Complete Migration Checklist

### Dependencies

- <MazCheckbox> Update maz-ui to v4.0.0+ </MazCheckbox>
- <MazCheckbox> Remove `dropzone` dependency </MazCheckbox>
- <MazCheckbox> Update Vue to v3.5+ </MazCheckbox>
- <MazCheckbox> Update unplugin-auto-import to v19+ </MazCheckbox>
- <MazCheckbox> Update unplugin-vue-components to v28+ </MazCheckbox>

### Configuration

- <MazCheckbox> Add MazUi plugin in main.ts </MazCheckbox>
- <MazCheckbox> Configure theme with new system </MazCheckbox>
- <MazCheckbox> Configure translations with new system </MazCheckbox>
- <MazCheckbox> Migrate Nuxt configuration to @maz-ui/nuxt (if using Nuxt) </MazCheckbox>

### Imports

- <MazCheckbox> Migrate plugin imports to `maz-ui/plugins/*` </MazCheckbox>
- <MazCheckbox> Migrate directive imports to `maz-ui/directives/*` </MazCheckbox>
- <MazCheckbox> Migrate composable imports to `maz-ui/composables/*` </MazCheckbox>
- <MazCheckbox> Update utility imports (e.g. currency → formatCurrency, etc.) </MazCheckbox>

### Components

- <MazCheckbox> Replace `MazBtn variant="link"` with `MazLink` </MazCheckbox>
- <MazCheckbox> Update `MazBtn outline` to `outlined` </MazCheckbox>
- <MazCheckbox> Rename `MazPhoneNumberInput` to `MazInputPhoneNumber` </MazCheckbox>
- <MazCheckbox> Rename `MazPicker` to `MazDatePicker` </MazCheckbox>
- <MazCheckbox> Replace `MazTransitionExpand` with `MazExpandAnimation` </MazCheckbox>
- <MazCheckbox> Update `MazDropdown`/`MazSelect` position props </MazCheckbox>
- <MazCheckbox> Rename `MazDialogPromise` to `MazDialogConfirm` </MazCheckbox>
- <MazCheckbox> Check new `MazDropzone` props </MazCheckbox>
- <MazCheckbox> Rename `MazPicker` to `MazDatePicker` </MazCheckbox>

### API Changes

- <MazCheckbox> Migrate `useDialog` from Promise to callback API </MazCheckbox>
- <MazCheckbox> Rename `useLanguageDisplayNames` to `useDisplayNames` </MazCheckbox>
- <MazCheckbox> Update `@update` to `@data` in `MazInputPhoneNumber` </MazCheckbox>
- <MazCheckbox> Replace removed colors (theme → contrast, danger → destructive) </MazCheckbox>
- <MazCheckbox> Remove `v-closable` directive usage </MazCheckbox>

### Helpers to Composables

- <MazCheckbox> Migrate `idleTimeout` to `useIdleTimeout` </MazCheckbox>
- <MazCheckbox> Migrate `userVisibility` to `useUserVisibility` </MazCheckbox>
- <MazCheckbox> Migrate `mountComponent` to `useMountComponent` </MazCheckbox>
- <MazCheckbox> Migrate `injectStrict` to `useInjectStrict` </MazCheckbox>
- <MazCheckbox> Migrate `freezeValue` to `useFreezeValue` </MazCheckbox>

### TypeScript

- <MazCheckbox> Update all type imports to use `Maz` prefix </MazCheckbox>
- <MazCheckbox> Update prop type imports (e.g. Props → MazBtnProps) </MazCheckbox>
- <MazCheckbox> Update generic types (e.g. Color → MazColor, Size → MazSize) </MazCheckbox>

### Testing and Validation

- <MazCheckbox> Test TypeScript compilation </MazCheckbox>
- <MazCheckbox> Test production build </MazCheckbox>
- <MazCheckbox> Check bundle size </MazCheckbox>
- <MazCheckbox> Run unit tests </MazCheckbox>
- <MazCheckbox> Test in development and production </MazCheckbox>
- <MazCheckbox> Test SSR/Nuxt if applicable </MazCheckbox>
- <MazCheckbox> Validate critical functionality </MazCheckbox>

## Additional Resources

- **[Official v4 Documentation](https://maz-ui.com)** - Complete documentation
- **[Theme Guide](/guide/themes)** - Advanced theme system
- **[Translation Guide](/guide/translations)** - Internationalization
- **[Vue Installation Guide](/guide/vue)** - Vue setup
- **[Nuxt Installation Guide](/guide/nuxt)** - Nuxt setup
- **[Resolvers Guide](/guide/resolvers)** - Smart auto-imports
- **[Complete Changelog](https://github.com/LouisMazel/maz-ui/blob/master/CHANGELOG.md)** - All changes

## Need Help?

Migration seems complex? We're here to help:

- **[Create Issue](https://github.com/LouisMazel/maz-ui/issues)** - Report bugs
- **[Discussions](https://github.com/LouisMazel/maz-ui/discussions)**
- **[MCP](./mcp.md)**

---

**🎉 Congratulations!** You now have all the tools to migrate to Maz-UI v4.0.0 and enjoy an exceptional developer experience with optimized performance!
