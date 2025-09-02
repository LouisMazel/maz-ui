---
title: Auto-Import Resolvers
description: Complete guide to Maz-UI auto-import resolvers for effortless component, directive, and composable imports
head:
  - - meta
    - name: keywords
      content: vue auto import, unplugin resolvers, maz-ui resolver, vue components auto import
---

# Auto-Import Resolvers

Supercharge your Vue development with Maz-UI's intelligent auto-import resolvers. Never write import statements again while maintaining perfect tree-shaking and TypeScript support.

::: tip Vue Only Feature
Auto-import resolvers are designed for Vue projects using build tools like Vite or Webpack. For Nuxt users, everything is already integrated in the [@maz-ui/nuxt module](/guide/nuxt).
:::

## Why Use Auto-Import Resolvers?

<div class="features-grid">

### Zero Boilerplate

- No manual imports required
- Components, composables, and directives automatically available
- IntelliSense support with full TypeScript definitions

### Perfect Tree-Shaking

- Only imports what you actually use
- Maintains optimal bundle sizes
- Same performance as manual imports

### Type Safety

- Full TypeScript support
- Auto-generated type definitions
- Compile-time error checking

### Conflict Prevention

- Configurable prefixes to avoid naming conflicts
- Flexible naming strategies
- Compatible with other UI libraries

</div>

## Quick Setup

Install the required packages:

```bash
npm install unplugin-vue-components unplugin-auto-import
```

Configure your build tool:

::: code-group

```typescript [Vite]
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
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver(),
      ],
      dts: true,
    }),
    AutoImport({
      resolvers: [MazModulesResolver()],
      dts: true,
    }),
  ],
})
```

```typescript [Webpack]
const { MazComponentsResolver, MazDirectivesResolver, MazModulesResolver } = require('maz-ui/resolvers')
const AutoImport = require('unplugin-auto-import/webpack')
// webpack.config.js
const Components = require('unplugin-vue-components/webpack')

module.exports = {
  plugins: [
    Components({
      resolvers: [
        MazComponentsResolver(),
        MazDirectivesResolver(),
      ],
    }),
    AutoImport({
      resolvers: [MazModulesResolver()],
    }),
  ],
}
```

:::

## Available Resolvers

### MazComponentsResolver

Auto-imports all Maz-UI components (50+ available):

```vue
<script setup lang="ts">
// No imports needed!
const text = ref('')
const selected = ref('')
const options = ['Option 1', 'Option 2']
</script>

<template>
  <!-- All components auto-imported -->
  <MazBtn color="primary">
    Button
  </MazBtn>
  <MazInput v-model="text" placeholder="Type here..." />
  <MazSelect v-model="selected" :options="options" />
  <MazCard>
    <template #header>
      Card Title
    </template>
    <p>Content goes here</p>
  </MazCard>
</template>
```

### MazDirectivesResolver

Auto-imports powerful Vue directives:

```vue
<script setup lang="ts">
// No directive imports needed!
const showDropdown = ref(false)

function handleClickOutside() {
  showDropdown.value = false
}
</script>

<template>
  <div>
    <!-- Tooltip directive -->
    <MazBtn v-tooltip="'This is a helpful tooltip'">
      Hover me
    </MazBtn>

    <!-- Click outside detection -->
    <div v-click-outside="handleClickOutside" class="dropdown">
      <button @click="showDropdown = !showDropdown">
        Toggle
      </button>
      <div v-show="showDropdown">
        Dropdown content
      </div>
    </div>

    <!-- Lazy image loading -->
    <img v-lazy-img="{ src: '/large-image.jpg', loading: '/loading.gif' }">

    <!-- Image zoom and fullscreen -->
    <img v-zoom-img src="/photo.jpg" alt="Zoomable image">
    <img v-fullscreen-img src="/gallery-1.jpg" alt="Gallery image">
  </div>
</template>
```

**Available Directives:**

- **[`v-tooltip`](./../directives/tooltip.md)** - Flexible tooltip positioning and content
- **[`v-click-outside`](./../directives/click-outside.md)** - Detect clicks outside an element and execute a callback function
- **[`v-lazy-img`](./../directives/lazy-img.md)** - Lazy load images with intersection observer
- **[`v-zoom-img`](./../directives/zoom-img.md)** - Click to zoom images with smooth animations
- **[`v-fullscreen-img`](./../directives/fullscreen-img.md)** - Fullscreen image viewer with navigation

### MazModulesResolver

Auto-imports composables and utility functions:

```vue
<script setup lang="ts">
// Composables auto-imported
const toast = useToast()
const { width, height } = useWindowSize()
const { isMobile, isTablet } = useBreakpoints()
const { toggleDarkMode, isDark } = useTheme()

// Utility functions auto-imported
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query)
}, 300)

const formattedPrice = formatCurrency(29.99, { currency: 'EUR' })
const readableDate = date(new Date(), { format: 'short' })

// Timer composable
const { start, pause, reset, time } = useTimer()

function handleSearch(query) {
  debouncedSearch(query)
}

function showSuccess() {
  toast.success('Operation completed!', {
    position: 'top-right',
    timeout: 3000
  })
}
</script>
```

**Most used available composables:**

| Category             | Composables                               |
| -------------------- | --------------------------------------------------- |
| **UI Management**    | [`useToast`](./../composables/use-toast.md), [`useDialog`](./../composables/use-dialog.md), [`useTheme`](./../guide/themes.md#usetheme-composable-api), [`useWait`](./../composables/use-wait.md)      |
| **Responsive**       | [`useBreakpoints`](./../composables/use-breakpoints.md), [`useWindowSize`](./../composables/use-window-size.md)                   |
| **User Interaction** | [`useUserVisibility`](./../composables/use-user-visibility.md), [`useIdleTimeout`](./../composables/use-idle-timeout.md), [`useSwipe`](./../composables/use-swipe.md)   |
| **Form Handling**    | [`useFormValidator`](./../composables/use-form-validator.md)                  |
| **Advanced**         | [`useTimer`](./../composables/use-timer.md), [`useStringMatching`](./../composables/use-string-matching.md)           |

**Most used available formatters and utilities:**

| Category             | Utilities/Formatters                               |
| -------------------- | --------------------------------------------------- |
| **Formatters**       | [`formatCurrency`](./../helpers/currency.md), [`formatDate`](./../helpers/date.md), [`sleep`](./../helpers/sleep.md) |
| **Utilities**        | [`debounce`](./../helpers/debounce.md), [`throttle`](./../helpers/throttle.md), [`isEqual`](./../helpers/is-equal.md) |

## Advanced Configuration

### Avoiding Naming Conflicts with Prefixes

When using multiple UI libraries or when you have naming conflicts, use prefixes:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        MazComponentsResolver(), // No prefix needed
        MazDirectivesResolver({ prefix: 'maz' }), // vMazTooltip, vMazClickOutside, vMazLazyImg, vMazZoomImg, vMazFullscreenImg
      ],
    }),
    AutoImport({
      resolvers: [
        MazModulesResolver({ prefix: 'maz' }), // useMazToast, useMazTheme, mazSleep, mazDebounce, etc.
      ],
    }),
  ],
})
```

With prefixes enabled:

```vue
<script setup lang="ts">
// Prefixed composables
const toast = useMazToast()
const theme = useMazTheme()

// Prefixed utilities (for composables only)
const mazDebounce = debounce // Note: utility functions are not prefixed
</script>

<template>
  <!-- Prefixed components -->
  <MazMazBtn v-maz-tooltip="'Prefixed tooltip'">
    Prefixed Button
  </MazMazBtn>
</template>
```

::: warning Prefix Limitation
Currently, utility functions (like `debounce`, `currency`) are not prefixed by the `MazModulesResolver`. Only composables (functions starting with `use`) are prefixed. This is a limitation that may be addressed in future versions.
:::

### Development Mode

Enable development mode for better debugging and faster builds during development:

```typescript
export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MazComponentsResolver({ devMode: process.env.NODE_ENV === 'development' }),
        MazDirectivesResolver({ devMode: process.env.NODE_ENV === 'development' }),
      ],
    }),
    AutoImport({
      resolvers: [
        MazModulesResolver({ devMode: process.env.NODE_ENV === 'development' }),
      ],
    }),
  ],
})
```

### Custom Resolver Configuration

Combine with other popular resolvers:

```typescript
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  MazComponentsResolver
} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        // Multiple UI libraries with prefixes
        MazComponentsResolver({ prefix: 'Maz' }),
        ElementPlusResolver({ prefix: 'El' }),
        AntDesignVueResolver({ prefix: 'A' }),
      ],
    }),
  ],
})
```

## Real-World Examples

### Complete Dashboard Setup

```typescript
import vue from '@vitejs/plugin-vue'
import { MazComponentsResolver, MazDirectivesResolver, MazModulesResolver } from 'maz-ui/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// vite.config.ts - Production-ready configuration
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [MazComponentsResolver()],
      dts: 'src/types/components.d.ts',
      directoryAsNamespace: true,
    }),
    AutoImport({
      resolvers: [MazModulesResolver()],
      dts: 'src/types/auto-imports.d.ts',
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true,
      },
    }),
  ],
})
```

### Dashboard Component Example

```vue
<script setup lang="ts">
// All auto-imported - no imports needed!
const toast = useToast()
const { width } = useWindowSize()
const { isMobile } = useBreakpoints()

// Reactive data
const currentPage = ref(1)
const perPage = ref(10)
const isLoading = ref(false)
const showUserDialog = ref(false)
const editingUser = ref({ name: '', role: '' })

// Computed
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return users.value.slice(start, start + perPage.value)
})

// Auto-imported utilities
const debouncedRefresh = debounce(refreshData, 1000)

// Mock data
const users = ref([
  { id: 1, name: 'John Doe', role: 'Admin' },
  { id: 2, name: 'Jane Smith', role: 'User' },
])

const stats = computed(() => [
  { label: 'Total Users', value: users.value.length, color: 'primary' },
  { label: 'Active', value: users.value.filter(u => u.role === 'User').length, color: 'success' },
])

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

const roleOptions = ['Admin', 'User', 'Moderator']
const totalUsers = computed(() => users.value.length)

// Methods
function refreshData() {
  isLoading.value = true
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    toast.success('Data refreshed!')
  }, 1000)
}

function closeDialog() {
  showUserDialog.value = false
  editingUser.value = { name: '', role: '' }
}

function saveUser() {
  toast.success('User saved successfully!')
  closeDialog()
}
</script>

<template>
  <div class="dashboard">
    <!-- Auto-imported components -->
    <MazCard class="stats-card">
      <template #header>
        <div class="flex items-center justify-between">
          <h2>Statistics</h2>
          <MazBtn
            v-tooltip="'Refresh data'"
            size="sm"
            @click="refreshData"
          >
            <MazIcon name="refresh" />
          </MazBtn>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="stat in stats" :key="stat.label">
          <MazBadge :color="stat.color">
            {{ stat.value }}
          </MazBadge>
          <p class="text-sm text-muted">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </MazCard>

    <!-- Data table with pagination -->
    <MazCard>
      <template #header>
        Users
      </template>

      <MazTable
        :data="paginatedUsers"
        :columns="columns"
        :loading="isLoading"
      />

      <template #footer>
        <MazPagination
          v-model:current-page="currentPage"
          :total="totalUsers"
          :per-page="perPage"
        />
      </template>
    </MazCard>

    <!-- Modal dialog -->
    <MazDialog v-model="showUserDialog" title="User Details">
      <MazInput
        v-model="editingUser.name"
        label="Name"
        placeholder="Enter user name"
      />
      <MazSelect
        v-model="editingUser.role"
        label="Role"
        :options="roleOptions"
      />

      <template #footer>
        <MazBtn @click="closeDialog">
          Cancel
        </MazBtn>
        <MazBtn @click="saveUser">
          Save
        </MazBtn>
      </template>
    </MazDialog>
  </div>
</template>
```

## TypeScript Integration

### Auto-Generated Types

The resolvers automatically generate TypeScript definitions:

```typescript
// auto-imports.d.ts (generated)
declare global {
  const useToast: typeof import('maz-ui/composables')['useToast']
  const useTheme: typeof import('maz-ui/composables')['useTheme']
  const debounce: typeof import('maz-ui')['debounce']
  const currency: typeof import('maz-ui')['currency']
  // ... all other auto-imports
}

// components.d.ts (generated)
declare module 'vue' {
  export interface GlobalComponents {
    MazBtn: typeof import('maz-ui/components')['MazBtn']
    MazInput: typeof import('maz-ui/components')['MazInput']
    // ... all other components
  }
}
```

### ESLint Configuration

Prevent ESLint errors for auto-imported functions:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    './.eslintrc-auto-import.json', // Generated by unplugin-auto-import
  ],
  rules: {
    'no-undef': 'off', // Disable for auto-imports
  },
}
```

## Performance Tips

### Optimize Bundle Size

```typescript
// Only import specific resolvers you need
import { MazComponentsResolver } from 'maz-ui/resolvers'

// Use tree-shaking friendly configuration
export default defineConfig({
  plugins: [
    Components({
      resolvers: [MazComponentsResolver()],
      // Generate types for better tree-shaking
      dts: true,
    }),
  ],
  build: {
    rollupOptions: {
      // Ensure proper tree-shaking
      treeshake: true,
    },
  },
})
```

## Troubleshooting

### Common Issues

**Components not auto-importing:**

```typescript
// ✅ Make sure resolvers are properly configured
Components({
  resolvers: [MazComponentsResolver()], // Must be included
})
```

**TypeScript errors:**

```typescript
// ✅ Ensure dts generation is enabled
Components({
  dts: true, // Generate type definitions
})
```

**Prefix not working for utilities:**

```typescript
// ⚠️ Known limitation: utilities are not prefixed
MazModulesResolver({ prefix: 'Maz' }) // Only composables are prefixed
```

**Development performance:**

```typescript
// ✅ Enable development mode for faster builds
MazComponentsResolver({
  devMode: process.env.NODE_ENV === 'development'
})
```

## Migration from Manual Imports

### Before (Manual Imports)

```vue
<script setup lang="ts">
import { formatCurrency, debounce } from 'maz-ui'
import { MazBtn, MazCard, MazInput } from 'maz-ui/components'
import { useTheme, useToast } from 'maz-ui/composables'
import { vTooltip } from 'maz-ui/directives'

const toast = useToast()
// ... rest of component
</script>
```

### After (Auto-Import)

```vue
<script setup lang="ts">
// Nothing to import! Everything is auto-imported
const toast = useToast()
// ... rest of component
</script>
```

## Related Resources

- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) - The underlying auto-import system
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) - Auto-import for composables and utilities
- [Nuxt Module](/guide/nuxt) - All auto-imports included out of the box

---

Ready to boost your productivity? Set up auto-import resolvers and never write import statements again! 🚀

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;

  h3 {
    margin-top: 0;
  }
  ul {
    margin-top: 0;
  }
}

.features-grid > div {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.dashboard {
  display: grid;
  gap: 1.5rem;
}

.stats-card {
  border: 1px solid var(--vp-c-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
