# @maz-ui/icons

A comprehensive collection of **328 beautiful SVG icons** ready for use in your Vue.js applications. Built with performance and flexibility in mind, these icons are optimized for modern web development.

## Features

- **300+ icons** - Comprehensive set covering all common use cases
- **Multiple usage patterns** - Direct SVG files, Vue components, or auto-import
- **TypeScript support** - Full type definitions included
- **Tree-shakeable** - Import only the icons you need
- **Customizable** - Easy to style with CSS
- **Optimized SVGs** - Clean, minimal markup for best performance
- **Auto-import resolver** - Seamless integration with unplugin-vue-components
- **Build tool integration** - Works perfectly with Vite and vite-svg-loader

## Installation

### Basic Installation

::: code-group

```bash [npm]
npm install @maz-ui/icons
```

```bash [yarn]
yarn add @maz-ui/icons
```

```bash [pnpm]
pnpm add @maz-ui/icons
```

:::

### With Auto-import Support (Recommended)

For the best developer experience with auto-imports:

```bash
npm install @maz-ui/icons unplugin-vue-components
```

### With vite-svg-loader Integration

To use SVG files as Vue components:

```bash
npm install @maz-ui/icons vite-svg-loader
```

## Usage Methods

### Method 1: Vue Components (Recommended)

Import and use icons as Vue components:

```vue
<script setup lang="ts">
import { MazCheck, MazHeart, MazUser } from '@maz-ui/icons'
</script>

<template>
  <div>
    <MazCheck class="text-green-500" />
    <MazUser class="w-6 h-6" />
    <MazHeart class="text-red-500 hover:scale-110 transition-transform" />
  </div>
</template>
```

**Benefits:**

- ✅ Tree-shaking - Only bundled icons are included
- ✅ TypeScript support with full IntelliSense
- ✅ Vue 3 optimized with `defineAsyncComponent`
- ✅ Easy to style with CSS classes

### Method 2: Auto-import with Resolver

Never worry about imports again with automatic component resolution:

#### Setup unplugin-vue-components

```ts
import { MazIconsResolver } from '@maz-ui/icons/resolvers'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        MazIconsResolver() // Auto-import Maz UI icons
      ]
    })
  ]
})
```

#### Usage (No Imports Required!)

```vue
<script setup lang="ts">
// No imports needed! Icons are auto-imported
</script>

<template>
  <div class="navigation">
    <!-- Icons are automatically imported when used -->
    <MazHome class="nav-icon" />
    <MazUser class="nav-icon" />
    <MazSettings class="nav-icon" />
    <MazLogout class="nav-icon" />
  </div>
</template>

<style scoped>
.nav-icon {
  @apply w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer;
}
</style>
```

**Benefits:**

- ✅ Zero import boilerplate
- ✅ Full TypeScript support
- ✅ Tree-shaking still works
- ✅ IntelliSense for all available icons

### Method 3: With vite-svg-loader

Transform SVG files into Vue components at build time:

#### Vite Configuration

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'component' // Import as Vue component by default
    })
  ]
})
```

#### Usage in Components

```vue
<script setup lang="ts">
// Import SVGs as Vue components
import CheckIcon from '@maz-ui/icons/svg/check.svg?component'
import HeartIcon from '@maz-ui/icons/svg/heart.svg?component'
import UserIcon from '@maz-ui/icons/svg/user.svg?component'
</script>

<template>
  <div class="flex items-center gap-2">
    <CheckIcon class="w-5 h-5 text-green-600" />
    <UserIcon class="w-6 h-6 text-blue-500" />
    <HeartIcon class="w-4 h-4 text-red-500 animate-pulse" />
  </div>
</template>
```

**Benefits:**

- ✅ Build-time optimization
- ✅ Full Vue component features (props, slots, etc.)
- ✅ Better performance than runtime imports
- ✅ Automatic TypeScript declarations

### Method 4: Direct SVG Files

Access SVG files directly for maximum flexibility:

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const checkSvg = ref('')

onMounted(async () => {
  const response = await fetch('/node_modules/@maz-ui/icons/svg/check.svg')
  checkSvg.value = await response.text()
})
</script>

<template>
  <div>
    <!-- Using img tag -->
    <img src="@maz-ui/icons/svg/check.svg" alt="Check" class="w-6 h-6">

    <!-- Inline SVG with fetch -->
    <div class="text-blue-500" v-html="checkSvg" />
  </div>
</template>
```

**Benefits:**

- ✅ Direct file access
- ✅ Smallest possible bundle size
- ✅ Can be used in any context (not just Vue)
- ✅ Easy to embed in CSS or other assets

## Styling Icons

Icons inherit the current text color and can be styled like any other element:

```vue
<template>
  <div class="icon-examples">
    <!-- Size control -->
    <MazStar class="w-4 h-4" />
    <MazStar class="w-8 h-8" />
    <MazStar class="text-2xl" />

    <!-- Colors -->
    <MazHeart class="text-red-500" />
    <MazLeaf class="text-green-600" />
    <MazSky class="text-blue-400" />

    <!-- Interactive states -->
    <MazButton class="hover:text-blue-500 transition-colors cursor-pointer" />

    <!-- Animations -->
    <MazSpinner class="animate-spin" />
    <MazHeart class="hover:scale-110 transition-transform" />

    <!-- With background -->
    <MazCheck class="p-2 bg-green-100 text-green-600 rounded-full" />
  </div>
</template>
```

### CSS Custom Properties

All icons support CSS custom properties for advanced styling:

```css
.custom-icon {
  --icon-size: 1.5rem;
  --icon-color: theme('colors.blue.500');
  --icon-hover-color: theme('colors.blue.600');

  width: var(--icon-size);
  height: var(--icon-size);
  color: var(--icon-color);
  transition: color 0.2s ease;
}

.custom-icon:hover {
  color: var(--icon-hover-color);
}
```

## Available Icons

The library includes **300+ carefully** covering all common use cases:

### Icon Naming Convention

All icons follow a consistent naming pattern:

- Vue components: `Maz` + PascalCase (e.g., `MazUserCircle`)
- SVG files: kebab-case (e.g., `user-circle.svg`)

```typescript
// Component imports
import {
  MazArrowRight, // arrow-right.svg
  MazChatBubbleLeft, // chat-bubble-left.svg
  MazShoppingCart, // shopping-cart.svg
  MazUserCircle // user-circle.svg
} from '@maz-ui/icons'
```

You can search icons on [Heroicons](https://heroicons.com/) and copy the name of the icon to use it in your project.

## Advanced Configuration

### Custom Icon Loading

Create your own icon loading utility:

```typescript
// utils/iconLoader.ts
import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

interface IconComponents {
  [key: string]: Component
}

export function createIconLoader(iconNames: string[]): IconComponents {
  const icons: IconComponents = {}

  iconNames.forEach((name) => {
    const componentName = `Maz${name.split('-').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}`

    icons[componentName] = defineAsyncComponent(
      () => import(`@maz-ui/icons/svg/${name}.svg?component`)
    )
  })

  return icons
}

// Usage
const icons = createIconLoader(['check', 'user', 'heart'])
```

### Dynamic Icon Loading

Load icons dynamically based on runtime conditions:

```vue
<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor'
})

const iconComponent = computed(() => {
  return defineAsyncComponent(
    () => import(`@maz-ui/icons/svg/${props.name}.svg?component`)
  )
})

const iconClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  return `${sizes[props.size]} text-${props.color}`
})

function handleClick() {
  console.log(`Clicked ${props.name} icon`)
}
</script>

<template>
  <component
    :is="iconComponent"
    :class="iconClass"
    @click="handleClick"
  />
</template>
```

### Build-time Icon Optimization

Optimize icons at build time with custom Vite plugin:

```typescript
// vite-plugin-icon-optimizer.ts
import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { optimize } from 'svgo'

export function iconOptimizer(): Plugin {
  return {
    name: 'icon-optimizer',
    transform(code, id) {
      if (id.includes('@maz-ui/icons/svg') && id.endsWith('.svg')) {
        const svgContent = readFileSync(id.replace('?component', ''), 'utf-8')
        const optimized = optimize(svgContent, {
          plugins: [
            'removeDoctype',
            'removeComments',
            'removeEmptyElements',
            'mergePaths'
          ]
        })

        return `export default ${JSON.stringify(optimized.data)}`
      }
    }
  }
}
```

## Integration Examples

### With Tailwind CSS

```vue
<template>
  <div class="flex items-center space-x-4">
    <MazHome class="w-5 h-5 text-gray-500 hover:text-blue-500 transition-colors" />
    <MazUser class="w-6 h-6 text-indigo-600" />
    <MazSettings class="w-4 h-4 text-gray-400 hover:text-gray-600" />
  </div>
</template>
```

### With Pinia Store

```typescript
import type { Component } from 'vue'
// stores/icons.ts
import { defineStore } from 'pinia'

export const useIconStore = defineStore('icons', () => {
  const loadedIcons = ref<Map<string, Component>>(new Map())

  async function loadIcon(name: string): Promise<Component> {
    if (loadedIcons.value.has(name)) {
      return loadedIcons.value.get(name)!
    }

    const icon = await import(`@maz-ui/icons/svg/${name}.svg?component`)
    loadedIcons.value.set(name, icon.default)
    return icon.default
  }

  return { loadIcon }
})
```

## Troubleshooting

### Common Issues

**Icons not displaying:**

- Ensure SVG files are properly served by your build tool
- Check if CSS `currentColor` is being inherited correctly
- Verify vite-svg-loader configuration if using component imports

**TypeScript errors:**

- Add `vite-svg-loader` types to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-svg-loader"]
  }
}
```

**Auto-import not working:**

- Verify `unplugin-vue-components` is properly configured
- Check that `MazIconsResolver` is included in resolvers array
- Ensure icon names match the exact component names

## Bundle Size

| Usage Method    | Bundle Impact | Best For                      |
| --------------- | ------------- | ----------------------------- |
| Direct SVG      | Minimal       | Static usage, minimal bundles |
| Vue Components  | Tree-shaken   | Dynamic usage, Vue apps       |
| Auto-import     | Tree-shaken   | Development experience        |
| vite-svg-loader | Optimized     | Build-time optimization       |

## Related Packages

- [Heroicons](https://heroicons.com/) - Tailwind CSS icons
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - Auto-import components
- [`vite-svg-loader`](https://github.com/jpkleemans/vite-svg-loader) - Load SVG as Vue components

---

**Need help?** Check out our [GitHub discussions](https://github.com/LouisMazel/maz-ui/discussions) or open an [issue](https://github.com/LouisMazel/maz-ui/issues).
