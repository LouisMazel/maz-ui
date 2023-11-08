---
title: MazPhoneNumberInput
description: MazPhoneNumberInput is a standalone input component that helps the user enter a phone number and validate it according to the country
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

## Prerequisites

To use this component, you have to install the `libphonenumber-js` dependency

<NpmBadge package="libphonenumber-js" />

```bash
npm install libphonenumber-js
```

---

::: details Show feature list and infos

- **Auto-detect** country calling code with phone number provided
- You can set your **preferred-countries, ignored-countries** or exclude some countries with **only-countries** - Ex `['FR', 'BE', 'DE']`
- Validation UI state: input becomes green when the phone number is valid and becomes red when number is incorrect (can be disabled by `no-validation-success` and `no-validation-error` prop)
- **Multi options to getting country code** : By default the component gets the country code via the browser (disable it with no-use-browser-locale) or you can use - fetch-country to get the country code via <https://ipwho.is> (network needed) - you can use `default-country-code` option instead to set one
- Phone number is formatted while typing (can be disabled by the prop `noFormattingAsYouType`)
- You can `search` your country in list
- Keyboard accessibility (Arrow down, Arrow up: Country list navigation - Escape: Close country list)
- Phone number example for each country in placeholder/label (can be disabled with `no-example` prop)
- Auto focus phone number input after selecting country
- You can disable the flags: `no-flags` prop
- Translations: [Component translations](#translations) & [countries translations](#countries-list)

:::

## Usage

<MazPhoneNumberInput
  v-model="phoneNumber"
  show-code-on-list
  :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
  :ignored-countries="['AC']"
  @update="results = $event"
/>

<div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>v-model="{{ phoneNumber ?? 'undefined' }}"</code></pre></div>

### Result object is emitted by @update event - [Model](#results-emitted-by-update-event)

<div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>{{ results }}</code></pre></div>

::: details Show code

```vue
<template>
  <MazPhoneNumberInput
    v-model="phoneNumber"
    show-code-on-list
    :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
    :ignored-countries="['AC']"
    @update="results = $event"
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

:::

## Translations - Labels & placeholders

```html
<MazPhoneNumberInput
  :translations="{
    countrySelector: {
      placeholder: 'Country code',
      error: 'Choose country',
      searchPlaceholder: 'Search a country',
    },
    phoneInput: {
      placeholder: 'Phone number',
      example: 'Example:',
    },
  }"
/>
```

## Translations - Country list

**First solution - set country locale**

```html
<MazPhoneNumberInput
  country-locale="fr-FR"
/>
```

**Second solution - custom list**

```html
<MazPhoneNumberInput
  :custom-countries-list="{
    FR: 'France',
    BE: 'Belgique',
    DE: 'Allemagne',
    US: 'Etats-Unis',
  }"
/>
```

## Show country name instead of calling code

<MazPhoneNumberInput country-selector-display-name />

```html
<MazPhoneNumberInput country-selector-display-name />
```

## Types

### Results emitted by @update event

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

### Country Code

```ts
type CountryCode = 'AC' | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HN' | 'HR' | 'HT' | 'HU' | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' | 'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' | 'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ' | 'TA' | 'TC' | 'TD' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA' | 'UG' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU' | 'WF' | 'WS' | 'XK' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW';
```

<!--@include: ./../.vitepress/generated-docs/maz-phone-number-input.doc.md-->

<script setup lang="ts">
  import { ref } from 'vue'
  const phoneNumber = ref()

  const phoneNumber2 = ref('+3263')
  const results = ref()
</script>
