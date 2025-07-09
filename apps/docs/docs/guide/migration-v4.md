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
// ✅ AFTER - You can import all components from the index file
import { MazBtn, MazInput } from 'maz-ui/components'
// But you can still import specific components for maximum tree-shaking
import MazBtn from 'maz-ui/components/MazBtn'
import MazInput from 'maz-ui/components/MazInput'
```

#### Plugins (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { installToaster, ToasterHandler } from 'maz-ui'

// ✅ AFTER - Required import
import { ToastPlugin, ToastHandler } from 'maz-ui/plugins'
// or better for maximum tree-shaking
import { ToastPlugin, ToastHandler } from 'maz-ui/plugins/toast'
```

#### Directives (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { vClickOutside, vTooltip } from 'maz-ui'

// ✅ AFTER - Required import
import { vClickOutside, vTooltip } from 'maz-ui/directives'
// or better for maximum tree-shaking
import { vClickOutside } from 'maz-ui/directives/vClickOutside'
import { vTooltip } from 'maz-ui/directives/vTooltip'
```

#### Composables (BREAKING CHANGE)

```typescript
// ❌ BEFORE - No longer works
import { useTimer, useToast } from 'maz-ui'

// ✅ AFTER - Required import
import { useTimer, useToast } from 'maz-ui/composables'
// or better for maximum tree-shaking
import { useTimer } from 'maz-ui/composables/useTimer'
import { useToast } from 'maz-ui/composables/useToast'
```

#### Utils

```typescript
// No changes
import { capitalize, currency } from 'maz-ui'

// But for maximum tree-shaking, you can import specific utils from @maz-ui/utils
import { capitalize, currency } from '@maz-ui/utils'
```

### 2. 🔧 Helpers Migrated to Composables (BREAKING CHANGE)

Several helpers are now Vue composables and need to be used in a Vue context:

#### `idle-timeout` → `useIdleTimeout`

```typescript
// ❌ BEFORE - Classic helper
import { idleTimeout } from 'maz-ui'

const controller = idleTimeout({
  timeout: 5000,
  onTimeout: () => console.log('timeout'),
  onActivity: () => console.log('activity')
})

// ✅ AFTER - Vue composable
import { useIdleTimeout } from 'maz-ui'

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
import { userVisibility } from 'maz-ui'

const { isVisible } = userVisibility()

// ✅ AFTER
import { useUserVisibility } from 'maz-ui/composables'

// In a Vue component
const { isVisible } = useUserVisibility()
```

#### `mount-component` → `useMountComponent`

```typescript
// ❌ BEFORE
import { mountComponent } from 'maz-ui'

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
import { injectStrict } from 'maz-ui'

const data = injectStrict('key')

// ✅ AFTER
import { useInjectStrict } from 'maz-ui/composables'

// In a Vue component
const data = useInjectStrict('key')
```

#### `freeze-value` → `useFreezeValue`

```typescript
// ❌ BEFORE
import { freezeValue } from 'maz-ui'

const frozen = freezeValue(reactiveValue)

// ✅ AFTER
import { useFreezeValue } from 'maz-ui/composables'

// In a Vue component
const frozen = useFreezeValue(reactiveValue)
```

### 3. MazBtn - Major API Changes (BREAKING CHANGE)

#### Removal of `variant` prop

```html
<!-- ❌ BEFORE - variant="link" deprecated -->
<MazBtn variant="link" href="/path">
  Link
</MazBtn>

<!-- ✅ AFTER - Use MazLink -->
<MazLink href="/path">
  Link
</MazLink>

<!-- Will be a button -->
<MazLink @click="handleClick">
  Link
</MazLink>
```

### 4. 📞 MazPhoneNumberInput → MazInputPhoneNumber (BREAKING CHANGE)

The component has been renamed and the API has changed:

```html
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
// ✅ AFTER
import MazInputPhoneNumber from 'maz-ui/components/MazInputPhoneNumber'

// ❌ BEFORE
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
```

### 5. 🗑️ Removed Component: MazTransitionExpand

```html
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

### 6. 📦 MazDropzone - Complete Rewrite (BREAKING CHANGE)

#### Removal of `dropzone` dependency

```bash
# ❌ BEFORE - required dependency
npm install dropzone

# ✅ AFTER - no longer needed
npm uninstall dropzone
```

#### New API props

```html
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

```html
<!-- ✅ NEW PROPS -->
<MazCard
  :collapsible="true"           <!-- New: collapsible card --
  v-model:collapse-open="open"  <!-- New: collapse control -->
  :block="true"                 <!-- New: 100% width -->
/>
```

#### MazLink - Replace MazBtn variant="link"

```html
<!-- ✅ NEW COMPONENT to replace MazBtn variant="link" -->
<MazLink
  href="/path"
  :auto-external="true"         <!-- New: automatic external icon --
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
    "vue": "^3.5.0", // was "^3.0.0"
    "unplugin-auto-import": ">=19.0.0 <20.0.0", // was ">=0.18.0 <1.0.0"
    "unplugin-vue-components": ">=28.0.0 <29.0.0", // was ">=0.27.0 <1.0.0"
    "valibot": ">=0.30.0 <2.0.0" // was ">=0.30.0 <1.0.0"

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

### Step 5: Verification and Testing

#### 1. Type check

```bash
npx vue-tsc --noEmit
```

#### 2. Build and Bundle

```bash
# Test build
npm run build
```

#### 3. Tests

```bash
# Run tests (if available)
npm run test
```

## 📊 Migration Benefits

### Bundle Size Reduction

With the new import structure, you can now import only the components you need, and the bundler will automatically tree-shake the code.

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
// ✅ New composable
import { useIdleTimeout } from 'maz-ui/composables'

// ❌ Old helper
import { idleTimeout } from 'maz-ui/helpers'
```

### Error: "MazTransitionExpand is not exported"

```vue
<!-- ❌ Removed component -->
<MazTransitionExpand>
...
</MazTransitionExpand>

<!-- ✅ New component -->
<MazExpandAnimation v-model="isOpen">
...
</MazExpandAnimation>
```

## ✅ Complete Migration Checklist

### Dependencies

- [ ] Update maz-ui to v4+
- [ ] Remove `dropzone` dependency
- [ ] Update Vue to v3.5+
- [ ] Update unplugin-auto-import to v19+
- [ ] Update unplugin-vue-components to v28+

### Imports

- [ ] Migrate all plugin imports to `maz-ui/plugins/*`
- [ ] Migrate all directive imports to `maz-ui/directives/*`
- [ ] Migrate all composable imports to `maz-ui/composables/*`

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
- [Complete Changelog](https://github.com/LouisMazel/maz-ui/blob/master/CHANGELOG.md)

---

💡 **Need help?** Create an issue on [GitHub](https://github.com/LouisMazel/maz-ui/issues)
