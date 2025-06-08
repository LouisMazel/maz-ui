---
title: country-code-to-unicode-flag
description: Convert country code in unicode flag
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
  This feature does not work with Windows but you can use this polyfill: [https://www.npmjs.com/package/country-flag-emoji-polyfill](https://www.npmjs.com/package/country-flag-emoji-polyfill)
:::

## Basic usage

<span style="font-size: 2rem;">
  {{ unicodeFlag }}
</span>

```vue
<template>
  <span style="font-size: 2rem;">
    {{ unicodeFlag }}
  </span>
</template>

<script lang="ts" setup >
  import { countryCodeToUnicodeFlag } from 'maz-ui'

  const unicodeFlag = countryCodeToUnicodeFlag('FR')
</script>
```

## Example

<div class="maz-gap-2 maz-flex maz-flex-wrap maz-items-center">
  <span class="maz-text-xs">{{ flag }}</span>
  <span class="maz-text-sm">{{ flag }}</span>
  <span class="maz-text-base">{{ flag }}</span>
  <span class="maz-text-lg">{{ flag }}</span>
  <span class="maz-text-xl">{{ flag }}</span>
  <span class="maz-text-2xl">{{ flag }}</span>
  <span class="maz-text-3xl">{{ flag }}</span>
  <span class="maz-text-4xl">{{ flag }}</span>
  <span class="maz-text-5xl">{{ flag }}</span>
  <span class="maz-text-6xl">{{ flag }}</span>
  <span class="maz-text-7xl">{{ flag }}</span>
</div>

<MazSelect
  v-model="countryCode"
  :options="countryOptions"
  label="Select country"
  search
  search-placeholder="Search country"
  @selected-option="(option) => console.log('option', option)"
>
  <template #default="{ option, isSelected }">
    <div
      class="maz-flex maz-items-center maz-gap-3"
    >
      <span class="maz-text-lg">
        {{ option.unicodeFlag }}
      </span>
      <MazBadge
        pastel
        size="0.7rem"
        class="maz-w-9"
        :class="{ 'maz-text-muted': !isSelected }"
      >
        {{ option.value }}
      </MazBadge>
      <span :class="{ 'maz-font-semibold': isSelected }">
        {{ option.label }}
      </span>
    </div>
  </template>
</MazSelect>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import { countryCodeToUnicodeFlag } from 'maz-ui'
  import { getCountries } from 'libphonenumber-js'

  const unicodeFlag = countryCodeToUnicodeFlag('FR')

  const countryCode = ref('FR')
  const flag = computed(() => countryCodeToUnicodeFlag(countryCode.value))

  const countryOptions = ref(getCountriesList())

  onMounted(() => {
    const listOfCountries = getCountriesList(window.navigator.language)
    if (listOfCountries.length > 1) {
      countryOptions.value = listOfCountries
    }
  })

  function getCountriesList(
    locale?: string,
  ) {
    const countriesList = []
    const isoList = getCountries()

    for (const iso2 of isoList) {
      const name = new Intl.DisplayNames([locale ?? 'en-US'], { type: 'region' }).of(iso2)

      if (name) {
        countriesList.push({
          value: iso2,
          label: name,
          unicodeFlag: countryCodeToUnicodeFlag(iso2)
        })
      }
    }

    return countriesList
  }
</script>

::: details Show full code

```vue

<template>
  <div class="maz-gap-2 maz-flex maz-flex-wrap maz-items-center">
    <span class="maz-text-xs">{{ flag }}</span>
    <span class="maz-text-sm">{{ flag }}</span>
    <span class="maz-text-base">{{ flag }}</span>
    <span class="maz-text-lg">{{ flag }}</span>
    <span class="maz-text-xl">{{ flag }}</span>
    <span class="maz-text-2xl">{{ flag }}</span>
    <span class="maz-text-3xl">{{ flag }}</span>
    <span class="maz-text-4xl">{{ flag }}</span>
    <span class="maz-text-5xl">{{ flag }}</span>
    <span class="maz-text-6xl">{{ flag }}</span>
    <span class="maz-text-7xl">{{ flag }}</span>
  </div>

  <MazSelect
    v-model="countryCode"
    :options="countryOptions"
    label="Select country"
    search
    search-placeholder="Search country"
    @selected-option="(option) => console.log('option', option)"
  >
    <template #default="{ option, isSelected }">
      <div
        class="maz-flex maz-items-center maz-gap-3"
      >
        <span class="maz-text-lg">
          {{ option.unicodeFlag }}
        </span>
        <MazBadge
          pastel
          size="0.7rem"
          class="maz-w-9"
          :class="{ 'maz-text-muted': !isSelected }"
        >
          {{ option.value }}
        </MazBadge>
        <span :class="{ 'maz-font-semibold': isSelected }">
          {{ option.label }}
        </span>
      </div>
    </template>
  </MazSelect>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import { countryCodeToUnicodeFlag } from 'maz-ui'
  import { getCountries } from 'libphonenumber-js'

  const countryCode = ref('FR')
  const flag = computed(() => countryCodeToUnicodeFlag(countryCode.value))

  const countryOptions = ref(getCountriesList())

  onMounted(() => {
    const listOfCountries = getCountriesList(window.navigator.language)
    if (listOfCountries.length > 1) {
      countryOptions.value = listOfCountries
    }
  })

  function getCountriesList(
    locale?: string,
  ) {
    const countriesList = []
    const isoList = getCountries()

    for (const iso2 of isoList) {
      const name = new Intl.DisplayNames([locale ?? 'en-US'], { type: 'region' }).of(iso2)

      if (name) {
        countriesList.push({
          value: iso2,
          label: name,
          unicodeFlag: countryCodeToUnicodeFlag(iso2)
        })
      }
    }

    return countriesList
  }
</script>
```

:::
