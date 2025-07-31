---
title: MazSelectCountry
description: MazSelectCountry is a versatile Vue 3 component for selecting countries or languages with built-in internationalization support and customizable display options
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/translated-component.md-->

## Basic usage

The most common use case is selecting a country. The component automatically displays country names in the user's locale with their respective flags.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <MazSelectCountry
      v-model="selectedCountry"
      :codes="['FR', 'DE', 'IT', 'ES', 'GB', 'NL', 'BE', 'AT', 'CH', 'PT']"
      label="Select a country"
    />
    <div class="maz-text-sm maz-text-muted">
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
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <MazSelectCountry
      v-model="selectedLanguage"
      label="Select a language"
      :display-names-options="{ type: 'language' }"
    />
    <div class="maz-text-sm maz-text-muted">
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
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div class="maz-space-y-4">
      <h4 class="maz-font-semibold">Sizes</h4>
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
    <div class="maz-space-y-4">
      <h4 class="maz-font-semibold">Colors</h4>
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
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
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
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Only European countries</h4>
      <MazSelectCountry
        v-model="europeExample"
        label="European countries only"
        :only-codes="['FR', 'DE', 'IT', 'ES', 'GB', 'NL', 'BE', 'AT', 'CH', 'PT']"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Exclude specific countries</h4>
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
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Short country names</h4>
      <MazSelectCountry
        v-model="shortExample"
        label="Short names"
        :display-names-options="{ type: 'region', style: 'short' }"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Languages with narrow style</h4>
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

## Without flags

Hide country flags using the `hideFlags` prop for a cleaner text-only interface.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
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
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Countries in French</h4>
      <MazSelectCountry
        v-model="frenchExample"
        label="Pays (French)"
        locale="fr-FR"
      />
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-2">Countries in Spanish</h4>
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
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div class="maz-space-y-4">
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
    <div class="maz-space-y-4">
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
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
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
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
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
  <div class="maz-max-w-md">
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
- **Flag integration**: Automatic flag display using country codes
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
