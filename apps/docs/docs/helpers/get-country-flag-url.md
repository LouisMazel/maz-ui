---
title: getCountryFlagUrl
description: Get country flag from flagcdn.com with a simple function call
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

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
      <img :src="option.flagSrc" class="maz-text-lg" :alt="`Flag of ${option.label}`" />
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

## Basic usage

<img :src="flagSrc" alt="Flag of France" />

```vue
<template>
  <img :src="flagSrc" alt="Flag of France" />
</template>

<script lang="ts" setup >
  import { getCountryFlagUrl } from 'maz-ui'

  const flagSrc = getCountryFlagUrl('FR')
</script>
```

## Sizing

<div class="maz-gap-2 maz-flex maz-flex-wrap maz-items-center">
  <img
    v-for="{ src, size, countryCode } in sizedFlags"
    :key="src"
    :src="src"
    :alt="`${countryCode} Flag`"
  />
</div>

::: details Show full code

```vue
<template>
  <img
    v-for="{ src, size, countryCode } in sizedFlags"
    :key="src"
    :src="src"
    :alt="`${countryCode} Flag`"
  />
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getCountryFlagUrl } from 'maz-ui'

  const countryCode = ref('FR')

  const sizedFlags = computed(() => {
    const sizes: Size[] = [
      '16x12',
      '20x15',
      '24x18',
      '80x60',
      'h80',
      'w160',
    ]

    return sizes.map(size => ({
      src: getCountryFlagUrl(countryCode.value, size),
      size: size,
      countryCode: countryCode.value
    }))
  })
</script>
```

:::

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import { getCountryFlagUrl } from 'maz-ui'
  import { getCountries } from 'libphonenumber-js'

  const countryCode = ref('FR')
  const flagSrc = computed(() => getCountryFlagUrl(countryCode.value))

  const sizedFlags = computed(() => {
    const sizes: Size[] = [
      '16x12',
      '20x15',
      '24x18',
      '80x60',
      'h80',
      'w160',
    ]

    return sizes.map(size => ({
      src: getCountryFlagUrl(countryCode.value, size),
      size: size,
      countryCode: countryCode.value
    }))
  })

  const countryOptions = ref(getCountriesList())

  onMounted(() => {
    const listOfCountries = getCountriesList(window.navigator.language)
    if (listOfCountries.length > 1) {
      countryOptions.value = listOfCountries
    }
  })

  function getCountriesList(locale?: string) {
    const countriesList = []
    const isoList = getCountries()

    for (const iso2 of isoList) {
      const name = new Intl.DisplayNames([locale ?? 'en-US'], { type: 'region' }).of(iso2)

      if (name) {
        countriesList.push({
          value: iso2,
          label: name,
          flagSrc: getCountryFlagUrl(iso2)
        })
      }
    }

    return countriesList
  }
</script>
