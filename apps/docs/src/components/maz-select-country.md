---
title: MazSelectCountry
description: MazSelectCountry is a versatile Vue component for selecting countries or languages with built-in internationalization support and customizable display options
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

## Basic usage

The most common use case is selecting a country. The component automatically displays country names in the user's locale with their respective flags.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="selectedCountry"
      :codes="['FR', 'DE', 'IT', 'ES', 'GB', 'NL', 'BE', 'AT', 'CH', 'PT']"
      label="Select a country"
    />
    <div class="maz:text-sm maz:text-muted">
      Selected: {{ selectedCountry || 'None' }}
    </div>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const selectedCountry = ref('FR')
</script>

<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Select a country"
  />
</template>
```

</template>
</ComponentDemo>

## Language selection

Configure the component to display languages instead of countries by setting the appropriate `displayNamesOptions`.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="selectedLanguage"
      label="Select a language"
      :display-names-options="{ type: 'language' }"
    />
    <div class="maz:text-sm maz:text-muted">
      Selected: {{ selectedLanguage || 'None' }}
    </div>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const selectedLanguage = ref('en')
</script>

<template>
  <MazSelectCountry
    v-model="selectedLanguage"
    label="Select a language"
    :display-names-options="{ type: 'language' }"
  />
</template>
```

</template>
</ComponentDemo>

## Sizes and colors

<ComponentDemo>
  <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
    <div class="maz:space-y-4">
      <h4 class="maz:font-semibold">Sizes</h4>
      <MazSelectCountry
        v-model="sizeExample1"
        size="sm"
        label="Small"
      />
      <MazSelectCountry
        v-model="sizeExample2"
        size="md"
        label="Medium (default)"
      />
      <MazSelectCountry
        v-model="sizeExample3"
        size="lg"
        label="Large"
      />
    </div>
    <div class="maz:space-y-4">
      <h4 class="maz:font-semibold">Colors</h4>
      <MazSelectCountry
        v-model="colorExample1"
        color="primary"
        label="Primary"
      />
      <MazSelectCountry
        v-model="colorExample2"
        color="secondary"
        label="Secondary"
      />
      <MazSelectCountry
        v-model="colorExample3"
        color="accent"
        label="Accent"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Sizes -->
  <MazSelectCountry
    v-model="selectedCountry"
    size="sm"
    label="Small"
  />
  <MazSelectCountry
    v-model="selectedCountry"
    size="md"
    label="Medium (default)"
  />
  <MazSelectCountry
    v-model="selectedCountry"
    size="lg"
    label="Large"
  />

  <!-- Colors -->
  <MazSelectCountry
    v-model="selectedCountry"
    color="primary"
    label="Primary"
  />
  <MazSelectCountry
    v-model="selectedCountry"
    color="secondary"
    label="Secondary"
  />
  <MazSelectCountry
    v-model="selectedCountry"
    color="accent"
    label="Accent"
  />
</template>
```

</template>
</ComponentDemo>

## Preferred countries

You can prioritize certain countries to appear at the top of the list using the `preferredCodes` prop.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="preferredExample"
      label="European countries first"
      :preferred-codes="['FR', 'DE', 'IT', 'ES', 'GB']"
    />
  </div>

<template #code>

```vue
<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="European countries first"
    :preferred-codes="['FR', 'DE', 'IT', 'ES', 'GB']"
  />
</template>
```

</template>
</ComponentDemo>

## Filtering options

Control which countries are displayed using `onlyCodes` to show only specific countries, or `ignoredCodes` to exclude certain ones.

<ComponentDemo>
  <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Only European countries</h4>
      <MazSelectCountry
        v-model="europeExample"
        label="European countries only"
        :only-codes="['FR', 'DE', 'IT', 'ES', 'GB', 'NL', 'BE', 'AT', 'CH', 'PT']"
      />
    </div>
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Exclude specific countries</h4>
      <MazSelectCountry
        v-model="excludeExample"
        label="All except some countries"
        :ignored-codes="['KP', 'SY', 'AF']"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Only specific countries -->
  <MazSelectCountry
    v-model="selectedCountry"
    label="European countries only"
    :only-codes="['FR', 'DE', 'IT', 'ES', 'GB', 'NL', 'BE', 'AT', 'CH', 'PT']"
  />

  <!-- Exclude specific countries -->
  <MazSelectCountry
    v-model="selectedCountry"
    label="All except some countries"
    :ignored-codes="['KP', 'SY', 'AF']"
  />
</template>
```

</template>
</ComponentDemo>

## Custom display options

Configure how country/language names are displayed using the `displayNamesOptions` prop, which leverages the browser's `Intl.DisplayNames` API.

<ComponentDemo>
  <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Short country names</h4>
      <MazSelectCountry
        v-model="shortExample"
        label="Short names"
        :display-names-options="{ type: 'region', style: 'short' }"
      />
    </div>
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Languages with narrow style</h4>
      <MazSelectCountry
        v-model="languageNarrowExample"
        label="Language names (narrow)"
        :display-names-options="{ type: 'language', style: 'narrow' }"
        hide-flags
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Short country names -->
  <MazSelectCountry
    v-model="selectedCountry"
    label="Short names"
    :display-names-options="{ type: 'region', style: 'short' }"
  />

  <!-- Languages with narrow style -->
  <MazSelectCountry
    v-model="selectedLanguage"
    label="Language names (narrow)"
    :display-names-options="{ type: 'language', style: 'narrow' }"
    hide-flags
  />
</template>
```

  </template>
</ComponentDemo>

## Flags source

By default, the flags are images of the [flagcdn.com](https://flagcdn.com) CDN: each user's browser requests them from this third party. The `flag-src` prop changes where they come from, in four ways:

| Source | `flag-src` | Network |
| --- | --- | --- |
| CDN (default) | not set | flagcdn.com |
| Flags of maz-ui | `loadCountryFlag` from `maz-ui/country-flags` | none (works offline) |
| Your own files | URL template: `'/flags/{code}.svg'` | your server |
| Your own function | `(code) => string \| undefined \| Promise<string \| undefined>` | yours |

In every case, a flag is only loaded when it becomes visible (the selected country, then the rows of the open list in view), and a code without flag displays the colored badge.

### For the whole app

Set it once instead of on every component: the `flag-src` of `MazSelectCountry` and `MazInputPhoneNumber` both default to `defaults.global.flagSrc` (see [Global component defaults](../guide/global-defaults.md)). A `flag-src` set on a component always wins.

```ts
// Vue: main.ts
import { loadCountryFlag } from 'maz-ui/country-flags'
import { MazUi } from 'maz-ui/plugins/maz-ui'

app.use(MazUi, {
  theme: { preset: mazUi },
  defaults: {
    global: { flagSrc: loadCountryFlag }, // or a URL template: '/flags/{code}.svg'
  },
})
```

```ts
// Nuxt: nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    flags: 'local', // 'cdn' (default) | 'local' | a URL template: '/flags/{code}.svg'
  },
})
```

### Flags of maz-ui, offline

`loadCountryFlag` gives the square flag of a code from the 256 flags of `@maz-ui/icons`, as a `data:image/svg+xml` URL: no request to a third party (nothing to allow for flagcdn.com in your Content Security Policy, the user's IP is not sent to it), and the component works offline (hybrid apps with Capacitor or Cordova, PWAs, intranets).

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="localFlagsExample"
      label="Country (flags of maz-ui)"
      :flag-src="loadCountryFlag"
    />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { loadCountryFlag } from 'maz-ui/country-flags'
import { ref } from 'vue'

const selectedCountry = ref('FR')
</script>

<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Country (flags of maz-ui)"
    :flag-src="loadCountryFlag"
  />
</template>
```

</template>
</ComponentDemo>

How it stays light:

- Nothing in maz-ui imports `maz-ui/country-flags`: an app that does not import it has **no flag file at all** in its build.
- Once imported, your bundler emits **one small chunk per flag** (256 files, from a few hundred bytes to a few kilobytes each). None is preloaded: only the flags displayed are downloaded.
- The loader itself (a table of 256 dynamic imports, about 4 kB gzipped) goes into the chunk that imports it. To keep it out of your entry chunk, import it on demand (the Nuxt option `flags: 'local'` does it for you):

```ts
const flagSrc = (code: string) => import('maz-ui/country-flags').then(({ loadCountryFlag }) => loadCountryFlag(code))
```

::: tip Content Security Policy
The flags are `data:` URLs: a strict CSP must allow `img-src data:` (already needed by the lazy images of maz-ui).
:::

::: tip PWA precache
Once you use `loadCountryFlag`, the 256 flag chunks are part of your build, so a service worker that precaches every `**/*.js` downloads all of them at install. Keep them (every flag available offline) or exclude them and let them load on demand. With Vite, the chunks are named after their module, `MazFlagSquareFR-[hash].js`:

```ts
// vite-plugin-pwa
VitePWA({ workbox: { globIgnores: ['**/MazFlagSquare*.js'] } })
```

Nuxt names its chunks `_nuxt/[hash].js` only: name the flag chunks yourself to exclude them, e.g. `vite.build.rollupOptions.output.chunkFileNames: chunk => chunk.name.startsWith('MazFlagSquare') ? '_nuxt/flags/[name].[hash].js' : '_nuxt/[hash].js'`, then ignore `**/_nuxt/flags/**`.
:::

### Your own files

A URL template, with `{code}` for the lowercase code and `{CODE}` for the uppercase code. The images are lazy loaded like the CDN ones. A missing image displays the badge.

```vue
<template>
  <!-- public/flags/fr.svg, public/flags/de.svg... -->
  <MazSelectCountry v-model="selectedCountry" flag-src="/flags/{code}.svg" />

  <!-- another host, uppercase codes -->
  <MazSelectCountry v-model="selectedCountry" flag-src="https://assets.example.com/flags/{CODE}.png" />
</template>
```

### Your own function

A function receives the country code of each flag when it becomes visible, and returns the image source (URL or data URL), or `undefined` to display the badge. It can be async: only the flags displayed are loaded.

```vue
<script lang="ts" setup>
// One file per flag in your project, loaded on demand (Vite turns this import into one chunk per file)
function flagSrc(code: string) {
  return import(`./assets/flags/${code.toLowerCase()}.svg?url`)
    .then(module => module.default)
    .catch(() => undefined)
}
</script>

<template>
  <MazSelectCountry v-model="selectedCountry" :flag-src="flagSrc" />
</template>
```

You can also replace the flags entirely with the `selector-flag` and `country-list-flag` slots.

## Without flags

Hide country flags using the `hideFlags` prop for a cleaner text-only interface.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="noFlagsExample"
      label="Countries without flags"
      hide-flags
      placeholder="Text-only country selection"
    />
  </div>

<template #code>

```vue
<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Countries without flags"
    hide-flags
    placeholder="Text-only country selection"
  />
</template>
```

</template>
</ComponentDemo>

## Custom locale

Override the default locale to display country/language names in a specific language.

<ComponentDemo>
  <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Countries in French</h4>
      <MazSelectCountry
        v-model="frenchExample"
        label="Pays (French)"
        locale="fr-FR"
      />
    </div>
    <div>
      <h4 class="maz:font-semibold maz:mb-2">Countries in Spanish</h4>
      <MazSelectCountry
        v-model="spanishExample"
        label="País (Spanish)"
        locale="es-ES"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Countries in French -->
  <MazSelectCountry
    v-model="selectedCountry"
    label="Pays (French)"
    locale="fr-FR"
  />

  <!-- Countries in Spanish -->
  <MazSelectCountry
    v-model="selectedCountry"
    label="País (Spanish)"
    locale="es-ES"
  />
</template>
```

</template>
</ComponentDemo>

## States and validation

The component supports all the standard form states for better user experience.

<ComponentDemo>
  <div class="maz:grid maz:grid-cols-1 maz:md:grid-cols-2 maz:gap-4">
    <div class="maz:space-y-4">
      <MazSelectCountry
        v-model="successExample"
        label="Success state"
        success
        hint="Valid country selected"
      />
      <MazSelectCountry
        v-model="warningExample"
        label="Warning state"
        warning
        hint="Please verify your selection"
      />
    </div>
    <div class="maz:space-y-4">
      <MazSelectCountry
        v-model="errorExample"
        label="Error state"
        error
        hint="Please select a valid country"
      />
      <MazSelectCountry
        v-model="disabledExample"
        label="Disabled state"
        disabled
        hint="Selection is not available"
      />
    </div>
  </div>

<template #code>

```vue
<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Success state"
    success
    hint="Valid country selected"
  />

  <MazSelectCountry
    v-model="selectedCountry"
    label="Warning state"
    warning
    hint="Please verify your selection"
  />

  <MazSelectCountry
    v-model="selectedCountry"
    label="Error state"
    error
    hint="Please select a valid country"
  />

  <MazSelectCountry
    v-model="selectedCountry"
    label="Disabled state"
    disabled
    hint="Selection is not available"
  />
</template>
```

</template>
</ComponentDemo>

## Custom options

Provide your own list of options instead of using the built-in country/language codes.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="customExample"
      label="Custom regions"
      :options="customRegions"
      hide-flags
    />
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const selectedCustom = ref()
const customRegions = [
  { code: 'EUROPE', name: 'Europe' },
  { code: 'ASIA', name: 'Asia' },
  { code: 'AFRICA', name: 'Africa' },
  { code: 'AMERICAS', name: 'Americas' },
  { code: 'OCEANIA', name: 'Oceania' }
]
</script>

<template>
  <MazSelectCountry
    v-model="selectedCustom"
    label="Custom regions"
    :options="customRegions"
    hide-flags
  />
</template>
```

</template>
</ComponentDemo>

## Display code instead of name

Show country/language codes in the input field instead of names using the `displayCode` prop.

<ComponentDemo>
  <div class="maz:flex maz:gap-4 maz:flex-wrap">
    <MazSelectCountry
      v-model="codeDisplayExample"
      label="Display country codes"
      display-code
      placeholder="Shows codes like 'FR', 'US'..."
    />
  </div>

<template #code>

```vue
<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Display country codes"
    display-code
    placeholder="Shows codes like 'FR', 'US'..."
  />
</template>
```

</template>
</ComponentDemo>

## Advanced configuration

Combine multiple features for complex use cases, such as business applications requiring specific country lists with custom styling.

<ComponentDemo>
  <div class="maz:max-w-md">
    <MazSelectCountry
      v-model="advancedExample"
      label="Business countries"
      color="primary"
      size="lg"
      :preferred-codes="['US', 'GB', 'DE', 'FR', 'CA']"
      :ignored-codes="['AQ', 'BV', 'HM']"
      :search-threshold="2"
      display-code
      success
      hint="Primary business regions prioritized"
    />
  </div>

<template #code>

```vue
<template>
  <MazSelectCountry
    v-model="selectedCountry"
    label="Business countries"
    color="primary"
    size="lg"
    :preferred-codes="['US', 'GB', 'DE', 'FR', 'CA']"
    :ignored-codes="['AQ', 'BV', 'HM']"
    :search-threshold="2"
    display-code
    success
    hint="Primary business regions prioritized"
  />
</template>
```

</template>
</ComponentDemo>

## How it works

The `MazSelectCountry` component is built on top of `MazSelect` and leverages the powerful `useDisplayNames` composable, which uses the browser's native `Intl.DisplayNames` API for internationalization.

### Key features:

- **Automatic localization**: Country and language names are displayed in the user's locale
- **Built-in search**: Users can quickly find countries by typing
- **Flag integration**: Automatic flag display using country codes, from the flagcdn.com CDN, the flags of maz-ui (offline) or your own files
- **Flexible filtering**: Support for preferred, ignored, or specific country lists
- **Custom options**: Override default behavior with custom data
- **Accessibility**: Full keyboard navigation and screen reader support

### useDisplayNames composable

The component uses the `useDisplayNames` composable internally, which provides:

```typescript
// Get display name for a single code
const displayName = getDisplayName('FR', {
  locale: 'en-US',
  type: 'region'
})

// Get all display names with filtering
const allCountries = getAllDisplayNames({
  locale: 'en-US',
  codesType: 'country',
  preferred: ['US', 'GB', 'FR'],
  exclude: ['AQ']
})
```

This ensures consistent internationalization across your application while providing maximum flexibility for different use cases.

<script setup>
import { loadCountryFlag } from 'maz-ui/country-flags'
import { ref } from 'vue'

// Basic examples
const selectedCountry = ref('FR')
const selectedLanguage = ref('en-US')

// Size and color examples
const sizeExample1 = ref()
const sizeExample2 = ref()
const sizeExample3 = ref()
const colorExample1 = ref()
const colorExample2 = ref()
const colorExample3 = ref()

// Other examples
const preferredExample = ref()
const europeExample = ref()
const excludeExample = ref()
const shortExample = ref()
const languageNarrowExample = ref()
const noFlagsExample = ref()
const localFlagsExample = ref('FR')
const frenchExample = ref()
const spanishExample = ref()
const successExample = ref()
const warningExample = ref()
const errorExample = ref()
const disabledExample = ref()
const codeDisplayExample = ref()
const advancedExample = ref()

// Custom options example
const customExample = ref()
const customRegions = [
  { code: 'EUROPE', name: 'Europe' },
  { code: 'ASIA', name: 'Asia' },
  { code: 'AFRICA', name: 'Africa' },
  { code: 'AMERICAS', name: 'Americas' },
  { code: 'OCEANIA', name: 'Oceania' }
]
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-select-country.doc.md-->
