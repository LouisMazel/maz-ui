<template>
  <div class="m-phone-number-input" :class="[props.class, { '--block': block }]" :style="style">
    <CountrySelector
      v-if="!noCountrySelector"
      :id="instanceId"
      :model-value="selectedCountry"
      :color
      :size
      :country-locale
      :country-selector-display-name
      :custom-countries-list
      :ignored-countries
      :list-position
      :no-flags
      :no-search
      :error="error || (!noValidationError ? !!phoneNumber && !selectedCountry : false)"
      :success="success || (!noValidationSuccess ? results?.isValid : false)"
      :locales
      :disabled
      :show-code-on-list
      :only-countries
      :preferred-countries
      :width="countrySelectorWidth"
      @update:model-value="countryChanged"
    />

    <PhoneInput
      :id="instanceId"
      ref="PhoneInputRef"
      :model-value="phoneNumber"
      :color
      :size
      :no-example
      block
      :disabled
      :has-radius="!noCountrySelector"
      :success="success || (!noValidationSuccess ? results.isValid : false)"
      :error="error || (!noValidationError ? !!phoneNumber && !results.isValid : false)"
      :locales
      :no-formatting-as-you-type
      :auto-format
      :label="placeholder"
      @update:model-value="
        onPhoneNumberChanged({
          newPhoneNumber: $event,
          autoFormat,
          noFormattingAsYouType,
        })
      "
    />
  </div>
</template>

<script lang="ts" setup>
  import { type CountryCode } from 'libphonenumber-js'
  import type { Results, Translations } from './MazPhoneNumberInput/types'
  import CountrySelector from './MazPhoneNumberInput/CountrySelector.vue'
  import PhoneInput from './MazPhoneNumberInput/PhoneInput.vue'
  import type { Color, Position, Size } from './types'

  export type { Color, Size, Position, CountryCode, Results, Results as Result, Translations }

  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'

  import { defaultLocales } from './MazPhoneNumberInput/default-locales'

  import {
    computed,
    onMounted,
    ref,
    watch,
    defineOptions,
    type StyleValue,
    type ComponentPublicInstance,
    nextTick,
  } from 'vue'

  import { useMazPhoneNumberInput } from './MazPhoneNumberInput/use-maz-phone-number-input'

  const emits = defineEmits<{
    /**
     * emitted when country or phone number changes
     * @property {Results} results - metadata of current phone number
     */
    (event: 'update', results: Results): void
    /** emitted when country or phone number changes
     * @property {Results} results - metadata of current phone number
     */
    (event: 'data', results: Results): void
    /** emitted when selected country changes
     * @property {CountryCode} countryCode - Country code
     */
    (event: 'country-code', countryCode?: CountryCode): void
    /** emitted when country or phone number changes
     * @property {String} phoneNumber - phoneNumber formatted
     */
    (event: 'update:model-value', phoneNumber?: string): void
    /** emitted when country changes
     * @property {CountryCode} countryCode - Country code
     */
    (event: 'update:country-code', countryCode?: CountryCode): void
  }>()

  defineOptions({
    inheritAttrs: false,
  })

  export type Props = {
    /** Style attribut of the component root element */
    style?: StyleValue
    /** Class attribut of the component root element */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class?: any
    /** @model Country calling code + telephone number in international format */
    modelValue?: string
    /** @deprecated */
    defaultPhoneNumber?: string
    /** @model Country code selected - Ex: "FR" */
    countryCode?: CountryCode
    /** @deprecated - use country-code or v-model:country-code */
    defaultCountryCode?: CountryCode
    /** Id of the component */
    id?: string
    /** Placeholder of the input */
    placeholder?: string
    /** List of country codes to place first in the select list - Ex: ['FR', 'BE', 'GE'] */
    preferredCountries?: CountryCode[]
    /** List of country codes to be removed from the select list - Ex: ['FR', 'BE', 'GE'] */
    ignoredCountries?: CountryCode[]
    /** List of country codes to only have the countries selected in the select list - Ex: ['FR', 'BE', 'GE'] */
    onlyCountries?: CountryCode[]
    /** Locale strings of the component */
    translations?: Partial<Translations>
    /** Position where the list of countries will be opened */
    listPosition?: Position
    /** Component color applied - Ex: "secondary" */
    color?: Color
    /** Component size applied - Ex: "sm" */
    size?: Size
    /** Remove flags in country list */
    noFlags?: boolean
    /** Disable input */
    disabled?: boolean
    /** No show the phone number example */
    noExample?: boolean
    /** Disable search input in country list */
    noSearch?: boolean
    /** By default the component use the browser locale to set the default country code if not country code is provided */
    noUseBrowserLocale?: boolean
    /** The component will make a request (https://ipwho.is) to get the location of the user and use it to set the default country code */
    fetchCountry?: boolean
    /** No show the country selector */
    noCountrySelector?: boolean
    /** Show country calling code in the country list */
    showCodeOnList?: boolean
    /** Replace country names */
    customCountriesList?: Record<CountryCode, string>
    /**
     * Disabled auto-format when phone is valid
     * @default true
     */
    autoFormat?: boolean
    /**
     * Disabled auto-format as you type
     * @default false
     */
    noFormattingAsYouType?: boolean
    /**
     * locale of country list - Ex: "fr-FR"
     * @default {string} browser locale
     */
    countryLocale?: string
    /** Disable validation error UI */
    noValidationError?: boolean
    /** Disable validation success UI */
    noValidationSuccess?: boolean
    /** Add success UI */
    success?: boolean
    /** Add error UI */
    error?: boolean
    /** Will replace the calling code by the country name in the country selector */
    countrySelectorDisplayName?: boolean
    /** Choose the width of the country selector */
    countrySelectorWidth?: string
    /** The input will be displayed in full width */
    block?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    class: undefined,
    style: undefined,
    listPosition: 'bottom left',
    color: 'primary',
    size: 'md',
    modelValue: undefined,
    /** @deprecated */
    defaultPhoneNumber: undefined,
    countryCode: undefined,
    /** @deprecated */
    defaultCountryCode: undefined,
    id: undefined,
    placeholder: undefined,
    preferredCountries: undefined,
    ignoredCountries: undefined,
    onlyCountries: undefined,
    translations: undefined,
    customCountriesList: undefined,
    countryLocale: undefined,
    countrySelectorWidth: '9rem',
    noFormattingAsYouType: false,
    autoFormat: true,
  })

  const {
    phoneNumber,
    selectedCountry,
    results,
    fetchCountryCode,
    setSelectedCountry,
    onPhoneNumberChanged,
    onCountryChanged,
    getBrowserLocale,
  } = useMazPhoneNumberInput()

  const instanceId = useInstanceUniqId({
    componentName: 'MazPhoneNumberInput',
    providedId: props.id,
  })

  const locales = computed(() => ({
    ...defaultLocales,
    ...props.translations,
  }))

  onMounted(async () => {
    setSelectedCountry(props.countryCode ?? props.defaultCountryCode)

    if (props.fetchCountry && !selectedCountry.value) {
      const countryCode = await fetchCountryCode()
      setSelectedCountry(countryCode)
    }

    if (!props.defaultCountryCode && !props.noUseBrowserLocale && !selectedCountry.value) {
      const countryCode = getBrowserLocale()?.locale
      setSelectedCountry(countryCode)
    }
  })

  const PhoneInputRef = ref<ComponentPublicInstance>()
  function getPhoneNumberInput() {
    return PhoneInputRef.value?.$el.querySelector('input') as HTMLInputElement | undefined
  }
  async function selectPhoneNumberInput() {
    await nextTick()
    getPhoneNumberInput()?.select()
  }
  function countryChanged(countryCode?: CountryCode) {
    onCountryChanged({
      countryCode,
      autoFormat: props.autoFormat,
      noFormattingAsYouType: props.noFormattingAsYouType,
    })
    selectPhoneNumberInput()
  }

  watch(
    () => props.modelValue ?? props.defaultPhoneNumber,
    (value, oldValue) => {
      if (value && value !== oldValue && value !== phoneNumber.value) {
        onPhoneNumberChanged({
          newPhoneNumber: value,
          autoFormat: props.autoFormat,
          noFormattingAsYouType: props.noFormattingAsYouType,
        })
      }
    },
    {
      immediate: true,
    },
  )

  watch(
    () => props.countryCode ?? props.defaultCountryCode,
    (value, oldValue) => {
      if (value && value !== oldValue && value !== selectedCountry.value) {
        onCountryChanged({
          countryCode: value,
          autoFormat: props.autoFormat,
          noFormattingAsYouType: props.noFormattingAsYouType,
        })
      }
    },
    {
      immediate: true,
    },
  )

  watch(
    results,
    (value) => {
      emits('update', value)
      emits('data', value)

      if (value.e164 && value.isValid) {
        emits('update:model-value', value.e164)
      } else {
        emits('update:model-value', phoneNumber.value)
      }

      emits('country-code', selectedCountry.value)
      emits('update:country-code', selectedCountry.value)
    },
    {
      immediate: true,
    },
  )
</script>

<style lang="postcss" scoped>
  .m-phone-number-input {
    @apply maz-relative maz-inline-flex maz-items-center maz-align-top;

    &.--block {
      @apply maz-w-full;
    }
  }
</style>
