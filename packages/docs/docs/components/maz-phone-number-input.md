---
title: MazPhoneNumberInput
description: MazPhoneNumberInput is a standalone input component that helps the user enter a phone number and validate it according to the country
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

---

To use this component, you have to install the `libphonenumber-js` dependency

<NpmBadge package="libphonenumber-js" />

```bash
npm install libphonenumber-js
```

## Usage

<MazPhoneNumberInput
  v-model="phoneNumber"
  show-code-on-list
  color="info"
  :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
  :ignored-countries="['AC']"
  @update="results = $event"
  :success="results?.isValid"
/>

<div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>v-model="{{ phoneNumber ?? 'undefined' }}"</code></pre></div>

::: details Result object is emitted by @update event - Click to show model

```ts
export type Result = {
  isValid: boolean
  isPossible?: boolean
  countryCode?: CountryCode
  countryCallingCode?: CountryCallingCode
  nationalNumber?: NationalNumber
  type?: NumberType
  formatInternational?: string
  formatNational?: string
  uri?: string
  e164?: string
  rfc3966?: string
}
```

:::

<div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>{{ results }}</code></pre></div>

---

### Code

<script setup lang="ts">
  import { ref } from 'vue'
  const phoneNumber = ref()
  const results = ref()
</script>

```vue
<template>
  <MazPhoneNumberInput
    v-model="phoneNumber"
    show-code-on-list
    color="info"
    :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
    :ignored-countries="['AC']"
    @update="results = $event"
    :success="results?.isValid"
  />
  <code>
    {{ results }}
  </code>
</template>

<script setup lang="ts">
  import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
  import { ref } from 'vue'
  const phoneNumber = ref()
  const results = ref()
</script>
```

## Feature List

- **Auto-detect** country calling code with phone number provided
- You can set your **preferred-countries, ignored-countries** or exclude some countries with **only-countries** - Ex `['FR', 'BE', 'DE']`
- Validation UI state: input becomes green when the phone number is valid (can be disabled by `no-validation` prop)
- **Multi options to getting country code** : By default the component gets the country code via the browser (disable it with no-use-browser-locale) or you can use - fetch-country to get the country code via <https://ipwho.is> (network needed) - you can use `default-country-code` option instead to set one
- Phone number is formatted while typing
- You can `search` your country in list
- Keyboard accessibility (Arrow down, Arrow up: Countries list navigation - Escape: Close countries list)
- Phone number example for each country in placeholder/label (can be disabled with `no-example` prop)
- Auto focus phone number input after selecting country
- You can disable the flags: `no-flags` prop
- Translations: [Component translations](#translations) & [countries translations](#countries-list)

## Translations

### Labels & placeholders

```vue
<template>
  <MazPhoneNumberInput
    :translations="{
      countrySelector: {
        placeholder: 'Country code',
        error: 'Choose country',
      },
      phoneInput: {
        placeholder: 'Phone number',
        example: 'Example:',
      },
    }"
  />
</template>
```

### Countries list

```vue
<template>
  <MazPhoneNumberInput
    :custom-countries-list="{
      FR: 'France',
      BE: 'Belgique',
      DE: 'Allemagne',
      US: 'Etats-Unis',
    }"
  />
</template>
```

<!--@include: ./../.vitepress/generated-docs/maz-phone-number-input.doc.md-->
