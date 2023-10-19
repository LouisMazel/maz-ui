<template>
  <div
    :id="instanceId"
    class="m-phone-number-input"
    :class="{
      '--no-flags': noFlags,
    }"
  >
    <button
      v-if="countryCode && !noFlags && !noCountrySelector"
      class="m-phone-number-input__country-flag maz-text-xl"
      tabindex="-1"
      type="button"
      @click="focusCountrySelector"
    >
      {{ localeToUnicodeFlag(countryCode) }}
    </button>

    <MazSelect
      v-if="!noCountrySelector && countryOptions"
      ref="CountrySelector"
      class="m-phone-number-input__select"
      :model-value="countryCode"
      option-value-key="iso2"
      option-label-key="name"
      option-input-value-key="dialCode"
      :max-list-width="250"
      :disabled="disabled"
      :color="color"
      :size="size"
      :list-position="listPosition"
      :search="!noSearch"
      :search-placeholder="locales.countrySelector.searchPlaceholder"
      :options="countryOptions"
      :error="error || (!!asYouTypeNumber && !countryCode)"
      :hint="!!asYouTypeNumber && !countryCode ? locales.countrySelector.error : undefined"
      :label="locales.countrySelector.placeholder"
      @update:model-value="setCountryCode($event, true)"
      @focus="inputFocused = false"
    >
      <template #default="{ option, isSelected }">
        <div
          class="m-phone-number-input__select__item maz-flex maz-items-center maz-truncate"
          :class="{
            'm-phone-number-input__select__item--selected': isSelected,
          }"
        >
          <span v-if="!noFlags && typeof option.iso2 === 'string'" class="maz-mr-2 maz-text-lg">
            {{ localeToUnicodeFlag(option.iso2) }}
          </span>
          <span
            v-if="showCodeOnList"
            class="maz-w-10 maz-flex-none"
            :class="{ 'maz-text-muted': !isSelected }"
          >
            {{ option.dialCode }}
          </span>
          <span class="maz-flex-1 maz-truncate" :class="{ 'maz-font-semibold': isSelected }">
            {{ option.name }}
          </span>
        </div>
      </template>
    </MazSelect>

    <MazInput
      :id="id"
      ref="PhoneNumberInput"
      :model-value="asYouTypeNumber"
      :label="inputPlaceholder"
      :disabled="disabled"
      :color="color"
      :error="error || (!!asYouTypeNumber && !results?.isValid)"
      v-bind="$attrs"
      :size="size"
      icon-name="phone"
      type="tel"
      clearable
      class="m-phone-number-input__input maz-flex-1"
      :class="{
        '--border-radius': !noCountrySelector,
        '--error': error || !results?.isValid,
        '--focused': inputFocused,
      }"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @update:model-value="emitsValueAndResults($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { CountryCode } from 'libphonenumber-js'
  import type { Result, Translations } from './MazPhoneNumberInput/types'
  import type { Color, Position, Size } from './types'

  export type { Color, Size, Position, CountryCode, Result, Translations }

  import { truthyFilter } from './../modules/helpers/truthy-filter'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'

  import { defaultLocales } from './MazPhoneNumberInput/constantes/default-locales'

  import {
    computed,
    onBeforeMount,
    onMounted,
    type PropType,
    ref,
    watch,
    getCurrentInstance,
    defineAsyncComponent,
  } from 'vue'

  import { localeToUnicodeFlag } from './../modules/helpers/locale-to-unicode-flag'
  import { useLibphonenumber, isCountryAvailable } from './MazPhoneNumberInput/use-libphonenumber'

  const {
    fetchCountryCode,
    browserLocale,
    getResultsFromPhoneNumber,
    getAsYouTypeFormat,
    getCountriesList,
    getPhoneNumberExample,
    sanitizePhoneNumber,
    loadPhoneNumberExamplesFile,
  } = useLibphonenumber()

  const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))
  const MazSelect = defineAsyncComponent(() => import('./MazSelect.vue'))

  const emits = defineEmits([
    'update',
    'update:model-value',
    'country-code',
    'update:country-code',
    'update:data',
  ])

  const props = defineProps({
    modelValue: {
      type: String,
      validator: (prop: string) => {
        return typeof prop === 'string' || prop === undefined
      },
      default: undefined,
    },
    defaultPhoneNumber: { type: String, default: undefined },
    countryCode: {
      type: String as PropType<CountryCode>,
      default: undefined,
      validator: (code: string) => isCountryAvailable(code),
    },
    defaultCountryCode: {
      type: String as PropType<CountryCode>,
      default: undefined,
      validator: (code: string) => isCountryAvailable(code),
    },
    data: {
      type: Object as PropType<Partial<Result>>,
      default: () => ({ isValid: false }),
    },
    id: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    preferredCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    ignoredCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    onlyCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    translations: { type: Object as PropType<Translations>, default: undefined },
    listPosition: {
      type: String as PropType<Position>,
      default: 'bottom left',
      validator: (value: Position) => {
        return ['top', 'top right', 'top left', 'bottom', 'bottom right', 'bottom left'].includes(
          value,
        )
      },
    },
    color: { type: String as PropType<Color>, default: 'primary' },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    noFlags: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    noExample: { type: Boolean, default: false },
    noSearch: { type: Boolean, default: false },
    noUseBrowserLocale: { type: Boolean, default: false },
    fetchCountry: { type: Boolean, default: false },
    noCountrySelector: { type: Boolean, default: false },
    showCodeOnList: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    customCountriesList: {
      type: Object as PropType<Record<CountryCode, string>>,
      default: undefined,
    },
  })

  const instance = getCurrentInstance()
  const instanceId = useInstanceUniqId({
    componentName: 'MazPhoneNumberInput',
    instance,
    providedId: props.id,
  })

  const CountrySelector = ref<typeof MazSelect>()
  const PhoneNumberInput = ref<typeof MazInput>()

  const asYouTypeNumber = ref<string>()
  const examplesFileLoaded = ref(false)
  const inputFocused = ref(false)

  const countryCode = computed({
    get: () => props.countryCode,
    set: (value) => emits('update:country-code', value),
  })
  const results = computed({
    get: () => props.data,
    set: (value) => emits('update:data', value),
  })

  const countries = computed(() => getCountriesList(props.customCountriesList))

  const locales = computed(() => ({
    ...defaultLocales,
    ...props.translations,
  }))

  const countriesList = computed(() => {
    return countries.value?.filter((item) => !props.ignoredCountries?.includes(item.iso2))
  })

  const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries?.map(
      (country) => countriesList.value?.find((item) => item.iso2.includes(country)),
    )
  })

  const otherCountries = computed(() => {
    return countriesList.value?.filter((item) => !props.preferredCountries?.includes(item.iso2))
  })

  const countriesSorted = computed(() => {
    return props.preferredCountries
      ? [...(countriesFiltered.value ?? []), ...(otherCountries.value ?? [])]
      : props.onlyCountries
      ? countriesFiltered.value
      : countriesList.value
  })

  const countryOptions = computed(() => {
    return countriesSorted.value
      ?.map((country) => {
        return country
          ? {
              ...country,
              dialCode: `+${country.dialCode}`,
            }
          : undefined
      })
      .filter(truthyFilter)
  })

  const inputPlaceholder = computed(() => {
    if (props.placeholder) {
      return props.placeholder
    }

    const defaultPlaceholder = locales.value.phoneInput.placeholder

    if (props.noExample || !examplesFileLoaded.value) {
      return defaultPlaceholder
    } else {
      const example = getPhoneNumberExample(countryCode.value)
      return results.value.isValid || !example
        ? defaultPlaceholder
        : `${locales.value.phoneInput.example} ${example}`
    }
  })

  onBeforeMount(async () => {
    try {
      if (props.fetchCountry) {
        const locale = await fetchCountryCode()
        if (locale) setCountryCode(locale)
      }
    } catch (error) {
      console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }

    try {
      if (!props.noExample && !examplesFileLoaded.value) {
        await loadPhoneNumberExamplesFile()
        examplesFileLoaded.value = true
      }
    } catch {
      console.error('[maz-ui](MazPhoneNumberInput) while loading phone number examples file')
    }
  })

  onMounted(() => {
    try {
      if (!props.defaultCountryCode && !props.noUseBrowserLocale && !countryCode.value) {
        const locale = browserLocale()
        if (locale) {
          setCountryCode(locale)
        }
      }

      if (props.defaultCountryCode && props.fetchCountry) {
        console.warn(
          `[maz-ui](MazPhoneNumberInput) Do not use 'fetch-country' and 'default-country-code' options in the same time`,
        )
      }
      if (props.defaultCountryCode && props.noUseBrowserLocale) {
        console.warn(
          `[maz-ui](MazPhoneNumberInput) If you use a 'default-country-code', do not use 'no-use-browser-locale' options`,
        )
      }
    } catch (error) {
      console.warn(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }
  })

  // watch(
  //   () => props.modelValue,
  //   (phoneNumber, oldPhoneNumber) => {
  //     if (phoneNumber !== oldPhoneNumber) {
  //       emitsValueAndResults(phoneNumber)
  //     }
  //   },
  // )

  watch(
    () => props.defaultPhoneNumber,
    (phoneNumber, oldPhoneNumber) => {
      if (phoneNumber !== oldPhoneNumber) {
        emitsValueAndResults(phoneNumber)
      }
    },
  )

  watch(
    () => props.defaultCountryCode,
    (countryCode, oldCountryCode) => {
      if (countryCode && countryCode !== oldCountryCode) {
        setCountryCode(countryCode)
        // emitsValueAndResults()
      }
    },
    { immediate: true },
  )

  const focusCountrySelector = () => {
    CountrySelector.value?.$el.querySelector('input')?.focus()
  }

  const focusPhoneNumberInput = () => {
    PhoneNumberInput.value?.$el.querySelector('input')?.focus()
  }

  const autoUpdateCountryCodeFromPhoneNumber = () => {
    if (
      results.value &&
      results.value.countryCode &&
      countryCode.value !== results.value.countryCode
    ) {
      setCountryCode(results.value.countryCode)
    }
  }

  const getAndEmitResults = (phoneNumber?: string, noAutoUpdateCountryCode?: boolean) => {
    results.value = getResultsFromPhoneNumber(countryCode.value, phoneNumber)

    if (!noAutoUpdateCountryCode) {
      autoUpdateCountryCodeFromPhoneNumber()
    }

    emits('update', results.value)
  }

  const emitsValueAndResults = (
    phoneNumber = props.modelValue,
    noAutoUpdateCountryCode?: boolean,
  ) => {
    try {
      getAndEmitResults(phoneNumber, noAutoUpdateCountryCode)

      emitValue(phoneNumber)
    } catch (error) {
      console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }
  }

  const emitValue = (phoneNumber?: string) => {
    asYouTypeNumber.value = sanitizePhoneNumber(phoneNumber)

    const internalResults = getResultsFromPhoneNumber(countryCode.value, phoneNumber)

    if (countryCode.value) {
      const isFullNumber = asYouTypeNumber.value?.includes('+')

      asYouTypeNumber.value =
        internalResults.formatNational && isFullNumber
          ? internalResults.formatNational
          : getAsYouTypeFormat(countryCode.value, asYouTypeNumber.value)
    }

    const valueToEmit = internalResults.e164

    if (valueToEmit !== props.modelValue) {
      emits('update:model-value', valueToEmit)
    }
  }

  const setCountryCode = (selectedCountryCode: string, autoFocusInput = false) => {
    try {
      const countryAvailable = isCountryAvailable(selectedCountryCode)

      if (countryAvailable) {
        countryCode.value = selectedCountryCode as CountryCode
        emits('country-code', selectedCountryCode)
      }

      if (autoFocusInput) {
        focusPhoneNumberInput()
      }
    } catch (error) {
      console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }
  }
</script>

<style lang="postcss" scoped>
  .m-phone-number-input {
    @apply maz-relative maz-flex;

    &__country-flag {
      position: absolute;
      bottom: 2px;
      left: 15px;
      z-index: 4;
      outline: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }

    &__input.--border-radius:deep(.m-input-wrapper) {
      @apply maz-rounded-l-none;

      margin-left: -2px;
    }

    &__select {
      @apply maz-w-36;

      &__item {
        @apply maz-w-full maz-text-sm;
      }

      &:deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-r-none !important;
      }
    }

    &:not(.--no-flags) {
      .m-phone-number-input__select:deep(.m-input-wrapper) .m-select-input {
        @apply maz-pl-11 !important;
      }
    }

    &__input {
      &.--error,
      &.--focused {
        @apply maz-z-1;
      }
    }
  }
</style>
./MazPhoneNumberInput/constantes/default-locales ./MazPhoneNumberInput/utils/use-libphonenumber-js
