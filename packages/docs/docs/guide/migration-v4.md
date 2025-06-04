# 🚀 Maz-UI v4.0.0 Migration Guide

This guide will help you migrate from Maz-UI v3.x to v4.0.0. This major version introduces fundamental changes in architecture, component APIs, and code structure.

## 📋 Summary of Major Changes

- ✅ **Optimized Tree-shaking** - Drastic bundle size reduction (60-90%)
- ✅ **New Export Structure** - More granular and efficient imports
- ✅ **MazDropzone Component Rewritten** - No more external `dropzone` dependency
- ✅ **MazTransitionExpand Removed** - Replaced by `MazExpandAnimation`
- ✅ **Helpers Migrated to Composables** - Several helpers are now Vue composables
- ✅ **MazBtn Props Refactored** - Removal of `variant`, addition of new props
- ✅ **MazPhoneNumberInput Renamed** - Now `MazInputPhoneNumber`
- ✅ **Filters Renamed to Formatters** - New nomenclature for formatting utilities
- ✅ **Dependencies Updated** - New versions of peerDependencies
- ✅ **Improved API** - Stricter and more consistent TypeScript

## ⚠️ Major Breaking Changes

### 1. 🧩 Import Structure (BREAKING CHANGE)

#### Vue Components

```typescript
// ❌ BEFORE - Still works but not optimal
import { MazBtn, MazInput } from 'maz-ui'

// ✅ AFTER - Recommended import for tree-shaking
import { MazBtn, MazInput } from 'maz-ui/components'
// or even better for maximum tree-shaking
import MazBtn from 'maz-ui/components/MazBtn'
import MazInput from 'maz-ui/components/MazInput'
```

#### Plugins (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { installToaster, ToasterHandler } from 'maz-ui'

// ✅ AFTER - Required import
import { installToaster, ToasterHandler } from 'maz-ui/plugins'
// or better
import { installToaster, ToasterHandler } from 'maz-ui/plugins/toaster'
```

#### Directives (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { vClickOutside, vTooltip } from 'maz-ui'

// ✅ AFTER - Required import
import { vClickOutside, vTooltip } from 'maz-ui/directives'
// or better
import { vClickOutside } from 'maz-ui/directives/vClickOutside'
import { vTooltip } from 'maz-ui/directives/vTooltip'
```

#### Composables (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { useThemeHandler, useToast } from 'maz-ui'

// ✅ AFTER - Required import
import { useThemeHandler, useToast } from 'maz-ui/composables'
// or better
import { useThemeHandler } from 'maz-ui/composables/useThemeHandler'
import { useToast } from 'maz-ui/composables/useToast'
```

#### Formatters (ex-Filters) - RENAMED

```typescript
// ❌ BEFORE - "filters" no longer exist
import { capitalize, currency } from 'maz-ui/filters'

// ✅ AFTER - Now called "formatters"
import { capitalize, currency } from 'maz-ui/formatters'
// or
import { capitalize } from 'maz-ui/formatters/capitalize'
```

### 2. 🔧 Helpers Migrated to Composables (BREAKING CHANGE)

Several helpers are now Vue composables and need to be used in a Vue context:

#### `idle-timeout` → `useIdleTimeout`

```typescript
// ❌ BEFORE - Classic helper
import { idleTimeout } from 'maz-ui/helpers'

const controller = idleTimeout({
  timeout: 5000,
  onTimeout: () => console.log('timeout'),
  onActivity: () => console.log('activity')
})

// ✅ AFTER - Vue composable
import { useIdleTimeout } from 'maz-ui/composables'

// In a Vue component
const { isIdle } = useIdleTimeout({
  timeout: 5000,
  onTimeout: () => console.log('timeout'),
  onActivity: () => console.log('activity')
})
```

#### `user-visibility` → `useUserVisibility`

```typescript
// ❌ BEFORE
import { userVisibility } from 'maz-ui/helpers'

const { isVisible } = userVisibility()

// ✅ AFTER
import { useUserVisibility } from 'maz-ui/composables'

// In a Vue component
const { isVisible } = useUserVisibility()
```

#### `mount-component` → `useMountComponent`

```typescript
// ❌ BEFORE
import { mountComponent } from 'maz-ui/helpers'

mountComponent(MyComponent, { props, container })

// ✅ AFTER
import { useMountComponent } from 'maz-ui/composables'

// In a Vue component
const { mount, unmount } = useMountComponent()
mount(MyComponent, { props, container })
```

#### `inject-strict` → `useInjectStrict`

```typescript
// ❌ BEFORE
import { injectStrict } from 'maz-ui/helpers'

const data = injectStrict('key')

// ✅ AFTER
import { useInjectStrict } from 'maz-ui/composables'

// In a Vue component
const data = useInjectStrict('key')
```

#### `freeze-value` → `useFreezeValue`

```typescript
// ❌ BEFORE
import { freezeValue } from 'maz-ui/helpers'

const frozen = freezeValue(reactiveValue)

// ✅ AFTER
import { useFreezeValue } from 'maz-ui/composables'

// In a Vue component
const frozen = useFreezeValue(reactiveValue)
```

### 3. �� MazBtn - Major API Changes (BREAKING CHANGE)

#### Removal of `variant` prop

```vue
<!-- ❌ BEFORE - variant="link" deprecated -->
<MazBtn variant="link" href="/path">Link</MazBtn>

<!-- ✅ AFTER - Use MazLink -->
<MazLink href="/path">Link</MazLink>
```

#### New props added

```vue
<!-- ✅ NEW PROPS available -->
<MazBtn
  :padding="false"           <!-- New: padding control -->
  justify="start"            <!-- New: content alignment -->
  :underline="false"         <!-- New: underline control -->
  rounded-size="full"        <!-- New: border-radius control -->
>
  Button
</MazBtn>
```

### 4. 📞 MazPhoneNumberInput → MazInputPhoneNumber (BREAKING CHANGE)

The component has been renamed and the API has changed:

```vue
<!-- ❌ BEFORE -->
<MazPhoneNumberInput
  v-model="phone"
  v-model:country-code="country"
  :preferred-countries="['FR', 'US']"
/>

<!-- ✅ AFTER -->
<MazInputPhoneNumber
  v-model="phone"
  v-model:country-code="country"
  :preferred-countries="['FR', 'US']"
/>
```

**Import also changed:**

```typescript
// ❌ BEFORE
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'

// ✅ AFTER
import MazInputPhoneNumber from 'maz-ui/components/MazInputPhoneNumber'
```

### 5. 🗑️ Removed Component: MazTransitionExpand

```vue
<!-- ❌ BEFORE -->
<MazTransitionExpand animation-duration="500ms">
  <div v-show="isOpen">Content</div>
</MazTransitionExpand>

<!-- ✅ AFTER -->
<MazExpandAnimation
  v-model="isOpen"
  duration="500ms"
  timing-function="ease-in-out"
>
  <div>Content</div>
</MazExpandAnimation>
```

**API Changes:**
- `v-model` replaces manual visibility control
- `duration` replaces `animation-duration`
- New `timing-function` prop
- CSS Grid-based animation

### 6. 📦 MazDropzone - Complete Rewrite

#### Removal of `dropzone` dependency

```bash
# ❌ BEFORE - required dependency
npm install dropzone

# ✅ AFTER - no longer needed
npm uninstall dropzone
```

#### New API props

```vue
<!-- ✅ NEW PROPS -->
<MazDropzone
  v-model="files"
  :auto-upload="'single'"        <!-- New: automatic upload -->
  url="/api/upload"              <!-- New: upload URL -->
  :request-options="{ ... }"     <!-- New: fetch options -->
  :transform-body="transformFn"  <!-- New: body transformation -->
  :min-file-size="0.1"          <!-- New: min size in MB -->
  @upload-success="onSuccess"    <!-- New: upload success -->
  @upload-error="onError"        <!-- New: upload error -->
/>
```

### 7. 🔄 Generalized Props Changes

#### MazCard - New props

```vue
<!-- ✅ NEW PROPS -->
<MazCard
  :collapsible="true"           <!-- New: collapsible card -->
  v-model:collapse-open="open"  <!-- New: collapse control -->
  :block="true"                 <!-- New: 100% width -->
/>
```

#### MazAvatar - Enhanced props

```vue
<!-- ✅ NEW PROPS -->
<MazAvatar
  :letter-count="2"             <!-- New: number of displayed letters -->
  rounded-size="lg"             <!-- New: border-radius control -->
  :loading="'intersecting'"     <!-- New: loading strategy -->
  :fallback-src="/fallback.jpg" <!-- New: fallback image -->
/>
```

#### MazLink - New component

```vue
<!-- ✅ NEW COMPONENT to replace MazBtn variant="link" -->
<MazLink
  href="/path"
  :auto-external="true"         <!-- New: automatic external icon -->
  :underline-only-hover="true"  <!-- New: underline on hover -->
  left-icon="home"              <!-- New: left icon -->
  right-icon="arrow"            <!-- New: right icon -->
>
  Link
</MazLink>
```

### 8. 📚 PeerDependencies Update (BREAKING CHANGE)

```json
{
  "peerDependencies": {
    // ✅ Major updates
    "vue": "^3.5.0",                    // was "^3.0.0"
    "unplugin-auto-import": ">=19.0.0 <20.0.0",  // was ">=0.18.0 <1.0.0"
    "unplugin-vue-components": ">=28.0.0 <29.0.0", // was ">=0.27.0 <1.0.0"
    "valibot": ">=0.30.0 <2.0.0",       // was ">=0.30.0 <1.0.0"

    // ❌ Removed
    // "dropzone": "^5.9.3" - removed
  }
}
```

## 🛠️ Step-by-Step Migration Guide

### Step 1: Update Dependencies

```bash
# Update maz-ui
npm install maz-ui@^4.0.0

# Remove dropzone if installed
npm uninstall dropzone

# Update peer dependencies if needed
npm install vue@^3.5.0
npm install unplugin-auto-import@^19.0.0
npm install unplugin-vue-components@^28.0.0
```

### Step 2: Import Migration

#### Automatic Replacement Scripts

```bash
# 1. Components
find . -name "*.vue" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/from ['\"]maz-ui['\"] /from 'maz-ui\/components' /g"

# 2. Plugins
find . -name "*.vue" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/\(install.*\|.*Handler\).*from ['\"]maz-ui['\"]/from 'maz-ui\/plugins'/g"

# 3. Directives
find . -name "*.vue" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/\(v[A-Z][a-zA-Z]*\).*from ['\"]maz-ui['\"]/from 'maz-ui\/directives'/g"

# 4. Composables
find . -name "*.vue" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/\(use[A-Z][a-zA-Z]*\).*from ['\"]maz-ui['\"]/from 'maz-ui\/composables'/g"

# 5. Formatters (ex-filters)
find . -name "*.vue" -o -name "*.ts" -o -name "*.js" | \
  xargs sed -i "s/maz-ui\/filters/maz-ui\/formatters/g"
```

### Step 3: Migrate Helpers to Composables

#### 3.1 Identify Affected Helpers

```bash
# Search for usage of helpers that became composables
grep -r "idleTimeout\|userVisibility\|mountComponent\|injectStrict\|freezeValue" \
  --include="*.vue" --include="*.ts" --include="*.js" .
```

#### 3.2 Migrate `idleTimeout` → `useIdleTimeout`

```typescript
// ❌ BEFORE
import { idleTimeout } from 'maz-ui/helpers'

const handleTimeout = () => console.log('User idle')
const controller = idleTimeout({
  timeout: 300000, // 5 minutes
  onTimeout: handleTimeout
})

// Stop manually
controller.stop()

// ✅ AFTER
import { useIdleTimeout } from 'maz-ui/composables'

// In setup() or <script setup>
const { isIdle, pause, resume, reset } = useIdleTimeout({
  timeout: 300000,
  onTimeout: () => console.log('User idle')
})

// Control via methods
pause()   // equivalent to stop()
resume()  // restart
reset()   // reset timer
```

#### 3.3 Migrate `userVisibility` → `useUserVisibility`

```typescript
// ❌ BEFORE
import { userVisibility } from 'maz-ui/helpers'

const { isVisible, addEventListener, removeEventListener } = userVisibility()

// ✅ AFTER
import { useUserVisibility } from 'maz-ui/composables'

// In setup() or <script setup>
const { isVisible, isHidden } = useUserVisibility()

// No more manual event listener management
```

### Step 4: Component Migration

#### 4.1 MazBtn - Remove variant="link"

```bash
# Search for all usages
grep -r 'variant="link"' --include="*.vue" .
```

```vue
<!-- ❌ BEFORE -->
<MazBtn variant="link" href="/path">Link</MazBtn>

<!-- ✅ AFTER -->
<MazLink href="/path">Link</MazLink>
```

#### 4.2 MazPhoneNumberInput → MazInputPhoneNumber

```bash
# Search and replace
find . -name "*.vue" | xargs sed -i 's/MazPhoneNumberInput/MazInputPhoneNumber/g'
```

#### 4.3 MazTransitionExpand → MazExpandAnimation

```bash
# Search for usages
grep -r "MazTransitionExpand" --include="*.vue" .
```

```vue
<!-- ❌ BEFORE -->
<MazTransitionExpand animation-duration="300ms">
  <div v-show="isOpen">{{ content }}</div>
</MazTransitionExpand>

<!-- ✅ AFTER -->
<MazExpandAnimation v-model="isOpen" duration="300ms">
  <div>{{ content }}</div>
</MazExpandAnimation>
```

### Step 5: Verification and Testing

#### 5.1 TypeScript

```bash
# Check TypeScript errors
npm run type-check
# or
npx vue-tsc --noEmit
```

#### 5.2 Build and Bundle

```bash
# Test build
npm run build

# Analyze bundle size (if available)
npm run build:analyze
```

#### 5.3 Tests

```bash
# Run tests
npm run test

# End-to-end tests if available
npm run test:e2e
```

## 📊 Migration Benefits

### Bundle Size Reduction

| Import Type | v3.x | v4.x | Gain |
|-------------|------|------|------|
| Global Import | ~500KB | ~500KB | 0% |
| Specific Import | ~200KB | ~15-50KB | 60-90% |
| Helpers Only | ~50KB | ~5KB | 90% |
| Components Only | ~300KB | ~30KB | 90% |

### Improved Performance

- **Effective Tree-shaking** on all bundlers
- **Faster page loading**
- **Improved frontend/backend separation**
- **Stricter and more consistent TypeScript**

## 🆘 Troubleshooting

### Error: "Cannot resolve module 'maz-ui/components'"

```bash
# Check installed version
npm list maz-ui

# Reinstall if needed
npm install maz-ui@latest
```

### Error: "idleTimeout is not a function"

```typescript
// ❌ Old helper
import { idleTimeout } from 'maz-ui/helpers'

// ✅ New composable
import { useIdleTimeout } from 'maz-ui/composables'
```

### Error: "MazTransitionExpand is not exported"

```vue
<!-- ❌ Removed component -->
<MazTransitionExpand>...</MazTransitionExpand>

<!-- ✅ New component -->
<MazExpandAnimation v-model="isOpen">...</MazExpandAnimation>
```

### CSS Error in Node.js/SSR

```typescript
// ✅ Safe for Node.js - Pure helpers
import { sleep, debounce } from 'maz-ui/helpers'

// ❌ Avoid on server side - Contains CSS
import { MazBtn } from 'maz-ui/components'
```

### Still Large Bundle

```bash
# Check non-optimized imports
grep -r "from ['\"]maz-ui['\"]" --include="*.vue" --include="*.ts" .

# Analyze bundle
npm run build:analyze
```

## 🔧 Bundler Configuration

### Vite

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@maz-ui': 'maz-ui/src'
    }
  },
  optimizeDeps: {
    include: [
      'maz-ui/helpers',
      'maz-ui/composables'
    ]
  }
}
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@maz-ui/components': 'maz-ui/dist/components',
      '@maz-ui/composables': 'maz-ui/dist/composables',
      '@maz-ui/helpers': 'maz-ui/dist/helpers'
    }
  }
}
```

### Nuxt 3

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['maz-ui/nuxt'],
  mazUi: {
    injectComponents: true,
    injectCss: true,
    // ... other options
  }
})
```

## ✅ Complete Migration Checklist

### Dependencies

- [ ] Update maz-ui to v4+
- [ ] Remove `dropzone` dependency
- [ ] Update Vue to v3.5+
- [ ] Update unplugin-auto-import to v19+
- [ ] Update unplugin-vue-components to v28+

### Imports

- [ ] Migrate all component imports to `maz-ui/components`
- [ ] Migrate all plugin imports to `maz-ui/plugins`
- [ ] Migrate all directive imports to `maz-ui/directives`
- [ ] Migrate all composable imports to `maz-ui/composables`
- [ ] Rename `filters` imports to `formatters`

### Helpers → Composables

- [ ] Migrate `idleTimeout` to `useIdleTimeout`
- [ ] Migrate `userVisibility` to `useUserVisibility`
- [ ] Migrate `mountComponent` to `useMountComponent`
- [ ] Migrate `injectStrict` to `useInjectStrict`
- [ ] Migrate `freezeValue` to `useFreezeValue`

### Components

- [ ] Replace `MazBtn variant="link"` with `MazLink`
- [ ] Rename `MazPhoneNumberInput` to `MazInputPhoneNumber`
- [ ] Replace `MazTransitionExpand` with `MazExpandAnimation`
- [ ] Check new `MazDropzone` props
- [ ] Adapt new props for `MazBtn`, `MazCard`, `MazAvatar`

### Testing and Validation

- [ ] Test TypeScript compilation
- [ ] Test production build
- [ ] Check bundle size
- [ ] Run unit tests
- [ ] Test in development and production modes
- [ ] Test SSR/Nuxt if applicable
- [ ] Validate critical functionalities

## 📚 Resources

- [Official v4 Documentation](https://maz-ui.com)
- [Complete Changelog](https://github.com/LouisMazel/maz-ui/blob/release/4.0.0/CHANGELOG.md)

---

💡 **Need help?** Create an issue on [GitHub](https://github.com/LouisMazel/maz-ui/issues)