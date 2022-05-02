---
description: MazPhoneNumberInput is a standalone input component to help the user enter a phone number and validate it according to the country
---

# MazPhoneNumberInput

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

To use this component, you have to install the dependency `libphonenumber-js`

<NpmBadge package="libphonenumber-js" />

<CodeGroup>

  <CodeGroupItem title="NPM" active>

```bash
# install in your project
npm install libphonenumber-js
```
  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```bash
# install in your project
yarn add libphonenumber-js
```
  </CodeGroupItem>
</CodeGroup>

## Basic usage

> This component use [MazInput](/maz-ui-3/components/maz-input.html), so it inherits all his props

<MazPhoneNumberInput
  v-model="phoneNumber"
  show-code-on-list
  color="info"
  :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
  :ignored-countries="['AC']"
  @update="results = $event"
  :success="results?.isValid"
/>

> Emit on `@update` event

<div class="language-json ext-json"><pre class="language-json"><code>{{ results }}</code></pre></div>

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
  <code>
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
- You can set your **preferred-countries, ignored-countries** or exclude some countries with **only-countries**
- Validation UI state: input becomes green when the phone number is valid (can be disabled by no-validation attr)
- **Multi options to getting country code** : By default the component get the country code via the browser (disable it with no-use-browser-locale) or you can use - fetch-country to get the country code via https://ip2c.org/s (network needed) - you can use default-country-code option instead to set one
- Phone number is formatted while typing
- You can **search** your country in list (open countries list & type your country name)
- Keyboard accessibility (Arrow down, Arrow up: Countries list navigation - Escape: Close countries list)
- Phone number example for each country in placeholder/label (can be disabled with `no-example` prop)
- Auto focus phone number input after selecting country
- You can disable the flags: `no-flags` prop
- Set your translations
- Provide your custom countries list (for translation)

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

## Props & Events emitted

<ComponentPropDoc component="MazPhoneNumberInput" />