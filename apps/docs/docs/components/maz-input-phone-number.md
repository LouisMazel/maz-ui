---
title: MazInputPhoneNumber
description: MazInputPhoneNumber is a standalone input component that helps the user enter a phone number and validate it according to the country
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

::: warning
For some countries with multiple valid number lengths like Anguilla (AI), you may need to disable the auto formatting (as you type) with `auto-format="false"` prop
:::

## Prerequisites

To use this component, you have to install the `libphonenumber-js` dependency

<NpmBadge package="libphonenumber-js" />

```bash
npm install libphonenumber-js
```

---

::: details Show feature list and info

- **Auto-detect** country calling code with phone number provided
- You can set your **preferred-countries, ignored-countries** or exclude some countries with **only-countries** - Ex `['FR', 'BE', 'DE']`
- Validation UI state: input becomes green when the phone number is valid and becomes red when the phone number is incorrect (can be disabled by `no-validation-success` and `no-validation-error` prop)
- **Multi options for getting country code**: By default, the component gets the country code via the browser (disable it with `:use-browser-locale="false"`) or you can use - fetch-country to get the country code via <https://ipwho.is> (network needed) - you can use `default-country-code` option instead to set one
- Phone number is formatted while typing (can be disabled by the prop `noFormattingAsYouType`)
- You can `search` your country in the list
- Keyboard accessibility (Arrow down, Arrow up: Country list navigation - Escape: Close country list)
- Phone number example for each country in placeholder/label (can be disabled with `no-example` prop)
- Auto-focus phone number input after selecting a country
- You can disable the flags: `hide-flags` prop
- Translations: [Component translations](#labels--placeholders) & [countries translations](#country-list)

:::

## Usage

<ComponentDemo>
  <MazInputPhoneNumber
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    show-code-on-list
    :preferred-countries="['FR', 'BE', 'DE', 'GB', 'US', 'CA']"
    :ignored-countries="['AC']"
    @data="results = $event"
  />

  <br />
  <br />

<template #content>

  <div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>v-model="{{ phoneNumber ?? 'undefined' }}"</code></pre></div>

**Result object is emitted by `@data` events - [Model](#types)**

  <div class="language-js ext-js"><span class="lang">js</span><pre class="language-js"><code>{{ results }}</code></pre></div>
  </template>

<template #code>

```vue
<script setup lang="ts">
import { MazInputPhoneNumber } from 'maz-ui'
import { ref } from 'vue'
const phoneNumber = ref()
const countryCode = ref('FR')
const results = ref()
</script>

<template>
  <MazInputPhoneNumber
    v-model="phoneNumber"
    v-model:country-code="countryCode"
    show-code-on-list
    :preferred-countries="['FR', 'BE', 'DE', 'GB', 'US', 'CA']"
    :ignored-countries="['AC']"
    @data="results = $event"
  />
  <code>
    {{ results }}
  </code>
</template>
```

  </template>
</ComponentDemo>

## Translations

### Labels & placeholders

```html
<MazInputPhoneNumber
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

### Country list

Two ways to translate the country list:

#### First solution - set country locale

```html
<MazInputPhoneNumber country-locale="fr-FR" />
```

#### Second solution - custom list

```html
<MazInputPhoneNumber
  :custom-countries-list="{
    FR: 'France',
    BE: 'Belgique',
    DE: 'Allemagne',
    US: 'Etats-Unis',
  }"
/>
```

## Auto formatting

Becareful, the auto formatting is enabled by default and can have some issues with some countries with multiple valid number lengths like Anguilla (AI), you can disable it with the `auto-format` prop

```html
<MazInputPhoneNumber v-model="phoneNumber" :auto-format="false" />
```

## Orientation

`@default "responsive"`

By default, the orientation is responsive, it will be in column on mobile (up to 425px) and in row on desktop

You can force the orientation to be:

- in column with the `orientation="col"` prop
- in row with the `orientation="row"` prop

<ComponentDemo>
  <p class="maz-mb-4 maz-font-semibold">
    Reduce the window size to see the responsive behavior
  </p>

  <div class="maz-inline-flex maz-flex-col maz-gap-2 maz-items-start">
    <MazInputPhoneNumber orientation="responsive" />
    <MazInputPhoneNumber orientation="row" />
    <MazInputPhoneNumber orientation="col" />
  </div>

<template #code>

```html
<MazInputPhoneNumber orientation="responsive" />
<MazInputPhoneNumber orientation="row" />
<MazInputPhoneNumber orientation="col" />
```

  </template>
</ComponentDemo>

## Show country name instead of calling code

You can display the country name instead of the calling code with the `country-selector-display-name` prop

<ComponentDemo>
  <MazInputPhoneNumber
    country-selector-display-name
    :translations="{
      countrySelector: {
        placeholder: 'Country',
      },
    }"
  />

<template #code>

```html
<MazInputPhoneNumber
  country-selector-display-name
  :translations="{
    countrySelector: {
      placeholder: 'Country',
    },
  }"
/>
```

  </template>
</ComponentDemo>

## Flags replacement with slots

Replace the default flags with slots

<ComponentDemo>
  <MazInputPhoneNumber :exclude-selectors="['#input-flag-element']">
    <template #selector-flag="{ countryCode }">
      <span
        id="input-flag-element"
        style="font-size: 0.8rem; background-color: hsl(var(--maz-secondary)); color: hsl(var(--maz-secondary-foreground)); border-radius: 20%; padding: 3px; line-height: 1;"
      >
        {{ countryCode }}
      </span>
    </template>
    <template #country-list-flag="{ countryCode }">
      <MazBadge size="0.8rem" style="margin-right: 10px; width: 26px;">
        {{ countryCode }}
      </MazBadge>
    </template>
  </MazInputPhoneNumber>

<template #code>

  <NpmBadge package="country-flag-icons" />

```html
<MazInputPhoneNumber :exclude-selectors="['#input-flag-element']">
  <template #selector-flag="{ countryCode }">
    <span
      id="input-flag-element"
      style="
        font-size: 0.8rem;
        background-color: hsl(var(--maz-secondary));
        color: hsl(var(--maz-secondary-foreground));
        border-radius: 100px;
        padding: 2px;
      "
    >
      {{ countryCode }}
    </span>
  </template>
  <template #country-list-flag="{ countryCode }">
    <MazBadge size="0.8rem" style="margin-right: 10px; width: 26px"> {{ countryCode }} </MazBadge>
  </template>
</MazInputPhoneNumber>
```

::: tip
You can use available country codes with libraries like [country-flag-icons](https://www.npmjs.com/package/country-flag-icons) to replace unicode flags by SVG flags
:::
</template>

</ComponentDemo>

## Types

**Results emitted by `@update` or `@data` event**

```ts
export interface Results {
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
  possibleCountries?: CountryCode[]
  phoneNumber?: string
}
```

### Country Code

```ts
type CountryCode = 'AC' | 'AD' | 'AE' | 'AF' | 'AG' | 'AI' | 'AL' | 'AM' | 'AO' | 'AR' | 'AS' | 'AT' | 'AU' | 'AW' | 'AX' | 'AZ' | 'BA' | 'BB' | 'BD' | 'BE' | 'BF' | 'BG' | 'BH' | 'BI' | 'BJ' | 'BL' | 'BM' | 'BN' | 'BO' | 'BQ' | 'BR' | 'BS' | 'BT' | 'BW' | 'BY' | 'BZ' | 'CA' | 'CC' | 'CD' | 'CF' | 'CG' | 'CH' | 'CI' | 'CK' | 'CL' | 'CM' | 'CN' | 'CO' | 'CR' | 'CU' | 'CV' | 'CW' | 'CX' | 'CY' | 'CZ' | 'DE' | 'DJ' | 'DK' | 'DM' | 'DO' | 'DZ' | 'EC' | 'EE' | 'EG' | 'EH' | 'ER' | 'ES' | 'ET' | 'FI' | 'FJ' | 'FK' | 'FM' | 'FO' | 'FR' | 'GA' | 'GB' | 'GD' | 'GE' | 'GF' | 'GG' | 'GH' | 'GI' | 'GL' | 'GM' | 'GN' | 'GP' | 'GQ' | 'GR' | 'GT' | 'GU' | 'GW' | 'GY' | 'HK' | 'HN' | 'HR' | 'HT' | 'HU' | 'ID' | 'IE' | 'IL' | 'IM' | 'IN' | 'IO' | 'IQ' | 'IR' | 'IS' | 'IT' | 'JE' | 'JM' | 'JO' | 'JP' | 'KE' | 'KG' | 'KH' | 'KI' | 'KM' | 'KN' | 'KP' | 'KR' | 'KW' | 'KY' | 'KZ' | 'LA' | 'LB' | 'LC' | 'LI' | 'LK' | 'LR' | 'LS' | 'LT' | 'LU' | 'LV' | 'LY' | 'MA' | 'MC' | 'MD' | 'ME' | 'MF' | 'MG' | 'MH' | 'MK' | 'ML' | 'MM' | 'MN' | 'MO' | 'MP' | 'MQ' | 'MR' | 'MS' | 'MT' | 'MU' | 'MV' | 'MW' | 'MX' | 'MY' | 'MZ' | 'NA' | 'NC' | 'NE' | 'NF' | 'NG' | 'NI' | 'NL' | 'NO' | 'NP' | 'NR' | 'NU' | 'NZ' | 'OM' | 'PA' | 'PE' | 'PF' | 'PG' | 'PH' | 'PK' | 'PL' | 'PM' | 'PR' | 'PS' | 'PT' | 'PW' | 'PY' | 'QA' | 'RE' | 'RO' | 'RS' | 'RU' | 'RW' | 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SG' | 'SH' | 'SI' | 'SJ' | 'SK' | 'SL' | 'SM' | 'SN' | 'SO' | 'SR' | 'SS' | 'ST' | 'SV' | 'SX' | 'SY' | 'SZ' | 'TA' | 'TC' | 'TD' | 'TG' | 'TH' | 'TJ' | 'TK' | 'TL' | 'TM' | 'TN' | 'TO' | 'TR' | 'TT' | 'TV' | 'TW' | 'TZ' | 'UA' | 'UG' | 'US' | 'UY' | 'UZ' | 'VA' | 'VC' | 'VE' | 'VG' | 'VI' | 'VN' | 'VU' | 'WF' | 'WS' | 'XK' | 'YE' | 'YT' | 'ZA' | 'ZM' | 'ZW'
```

<!--@include: ./../.vitepress/generated-docs/maz-input-phone-number.doc.md-->

<script setup lang="ts">
  import { ref } from 'vue'
  const phoneNumber = ref()
  const countryCode = ref()

  const phoneNumber2 = ref('+3263')
  const results = ref()
</script>
