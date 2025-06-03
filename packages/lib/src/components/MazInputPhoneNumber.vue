<script lang="ts" setup>
import type { CountryCode } from 'libphonenumber-js'
import type { ComponentPublicInstance, HTMLAttributes } from 'vue'
import type { MazInputPhoneNumberTranslations, Results } from './MazInputPhoneNumber/types'
import type { Color, Position, Size } from './types'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { defaultLocales } from './MazInputPhoneNumber/default-locales'

import { useLibphonenumber } from './MazInputPhoneNumber/useLibphonenumber'
import { useMazInputPhoneNumber } from './MazInputPhoneNumber/useMazInputPhoneNumber'

defineOptions({
  name: 'MazInputPhoneNumber',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputPhoneNumberProps>(), {
  listPosition: 'bottom left',
  color: 'primary',
  size: 'md',
  countrySelectorWidth: '9rem',
  autoFormat: true,
  orientation: 'responsive',
  searchThreshold: 0.75,
  countrySelectAttributes: () => ({
    name: 'country',
    autocomplete: 'off',
  }),
  phoneInputAttributes: () => ({
    name: 'phone',
    autocomplete: 'tel',
    inputmode: 'tel',
  }),
  useBrowserLocale: true,
  search: true,
  validationError: true,
  validationSuccess: true,
})

const emits = defineEmits<{
  /**
   * emitted when country or phone number changes
   * @property {string} phoneNumber - phoneNumber formatted
   */
  'update:model-value': [value: string | undefined | null]
  /**
   * emitted when selected country changes
   * @property {CountryCode} countryCode - Country code
   */
  'country-code': [countryCode?: CountryCode | undefined | null]
  /**
   * emitted when country changes
   * @property {CountryCode} countryCode - Country code
   */
  'update:country-code': [countryCode?: CountryCode | undefined | null]
  /**
   * emitted when country or phone number changes
   * @property {Results} results - metadata of current phone number
   */
  'data': [results: Results]
}>()

const CountrySelector = defineAsyncComponent(() => import('./MazInputPhoneNumber/CountrySelector.vue'))
const PhoneInput = defineAsyncComponent(() => import('./MazInputPhoneNumber/PhoneInput.vue'))

export interface MazInputPhoneNumberProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** @model Country calling code + telephone number in international format */
  modelValue?: string | undefined | null
  /** @model Country code selected - Ex: "FR" */
  countryCode?: CountryCode | undefined | null
  /** Id of the component */
  id?: string
  /** Placeholder of the input */
  placeholder?: string
  /** label of the input */
  label?: string
  /** List of country codes to place first in the select list - Ex: ['FR', 'BE', 'GE'] */
  preferredCountries?: CountryCode[]
  /** List of country codes to be removed from the select list - Ex: ['FR', 'BE', 'GE'] */
  ignoredCountries?: CountryCode[]
  /** List of country codes to only have the countries selected in the select list - Ex: ['FR', 'BE', 'GE'] */
  onlyCountries?: CountryCode[]
  /** Locale strings of the component */
  translations?: Partial<MazInputPhoneNumberTranslations>
  /** Position where the list of countries will be opened */
  listPosition?: Position
  /** Component color applied - Ex: "secondary" */
  color?: Color
  /** Component size applied - Ex: "sm" */
  size?: Size
  /** Remove flags in country list */
  hideFlags?: boolean
  /** Disable input */
  disabled?: boolean
  /** No show the phone number example */
  noExample?: boolean
  /** Disable search input in country list */
  search?: boolean
  /**
   * Threshold of the search input in country list where 1 is a perfect match and 0 is a match with any character
   * @default 0.75
   */
  searchThreshold?: number
  /**
   * If true, the browser locale will be used
   * @default true
   */
  useBrowserLocale?: boolean
  /** The component will make a request (https://ipwho.is) to get the location of the user and use it to set the default country code */
  fetchCountry?: boolean
  /** No show the country selector */
  hideCountrySelector?: boolean
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
   * locale of country list - Ex: "fr-FR"
   * @default {string} browser locale
   */
  countryLocale?: string
  /** Disable validation error UI */
  validationError?: boolean
  /** Disable validation success UI */
  validationSuccess?: boolean
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
  /** Exclude selectors to close country selector list - usefull when you using custom flag */
  excludedSelectors?: string[]
  /**
   * Orientation of the inputs in the component
   * @default "responsive"
   * @values "row" | "col" | "responsive"
   */
  orientation?: 'row' | 'col' | 'responsive'
  /**
   * Meta attributes of the country input
   * @default `{Record<string, unknown>}` `{ autocomplete: 'off', name: 'country' }`
   */
  countrySelectAttributes?: Record<string, unknown>
  /**
   * Meta attributes of the phone number input
   * @default `{Record<string, unknown>}` `{ autocomplete: 'tel', name: 'phone', inputmode: 'tel' }`
   */
  phoneInputAttributes?: Record<string, unknown>
}

/** Composables */
const { fetchCountryCode, getBrowserLocale } = useMazInputPhoneNumber()
const { isCountryAvailable, getPhoneNumberResults } = useLibphonenumber()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputPhoneNumber',
  providedId: props.id,
})

/** Models */

const phoneNumber = ref<string | undefined | null>()
const selectedCountry = ref<CountryCode | undefined | null>()

/** State */
const isPhoneNumberInternalUpdate = ref(false)
const isCountryInternalUpdate = ref(false)
const locales = computed(() => ({
  ...defaultLocales,
  ...props.translations,
}))
const hasAutoFormat = computed(() => props.autoFormat)

const results = ref<Results>({
  isValid: false,
  countryCode: props.countryCode,
  phoneNumber: props.modelValue,
})
const PhoneInputRef = ref<ComponentPublicInstance>()

/** Logic */

onBeforeMount(async () => {
  if (props.countryCode && !selectedCountry.value) {
    onCountryChanged({ countryCode: props.countryCode })
  }

  if (props.fetchCountry && !selectedCountry.value) {
    const { data: countryCode, error } = await fetchCountryCode()

    if (error) {
      console.error(`[MazInputPhoneNumber](onBeforeMount) Error while fetching country code - ${error.message}`)
      return
    }

    onCountryChanged({ countryCode })
  }
})

onMounted(() => {
  if (!selectedCountry.value && props.useBrowserLocale) {
    const countryCode = getBrowserLocale()?.locale
    onCountryChanged({ countryCode: countryCode as CountryCode })
  }
})

function updateTheResults({
  phone = phoneNumber.value || props.modelValue,
  countryCode = selectedCountry.value,
  checkCountryCode = false,
}: {
  phone?: string | undefined | null
  countryCode?: CountryCode | undefined | null
  checkCountryCode?: boolean
}) {
  results.value = getPhoneNumberResults({
    phoneNumber: phone,
    countryCode,
    checkCountryCode,
  })
}

function getPhoneNumberInput() {
  return PhoneInputRef.value?.$el.querySelector('input') as HTMLInputElement | undefined
}

async function selectPhoneNumberInput() {
  await nextTick()
  getPhoneNumberInput()?.select()
}

function setSelectedCountry(countryCode?: string | undefined | null) {
  if (!countryCode) {
    return
  }

  if (!isCountryAvailable(countryCode)) {
    console.warn(`[MazInputPhoneNumber] Country code not available: "${countryCode}"`)
    selectedCountry.value = undefined
    return
  }

  selectedCountry.value = countryCode as CountryCode
}

function onPhoneNumberChanged({
  newPhoneNumber,
}: {
  newPhoneNumber?: string | undefined | null
}) {
  updateTheResults({ phone: newPhoneNumber })

  if (results.value.parsedCountryCode && results.value.parsedCountryCode !== selectedCountry.value) {
    onCountryChanged({
      countryCode: results.value.parsedCountryCode,
      updateResults: false,
    })
  }

  if (results.value.isValid && hasAutoFormat.value) {
    phoneNumber.value = results.value.formatNational?.trim().replaceAll(new RegExp(/\D/g), '')
  }
  else {
    phoneNumber.value = newPhoneNumber
  }

  isPhoneNumberInternalUpdate.value = true

  if (results.value.e164) {
    emits('update:model-value', results.value.e164)
  }
  else {
    emits('update:model-value', results.value.phoneNumber)
  }

  setTimeout(() => {
    isPhoneNumberInternalUpdate.value = false
  }, 0)
}

function onCountryChanged({
  countryCode,
  updateResults = true,
  selectPhoneNumber = false,
}: {
  countryCode?: CountryCode
  updateResults?: boolean
  selectPhoneNumber?: boolean
}) {
  if (!countryCode) {
    selectedCountry.value = undefined
    return
  }

  isCountryInternalUpdate.value = true

  if (countryCode !== selectedCountry.value) {
    setSelectedCountry(countryCode)
  }

  if (updateResults) {
    updateTheResults({
      countryCode: selectedCountry.value,
      checkCountryCode: true,
    })
  }

  const code = results.value.countryCode || results.value.parsedCountryCode
  emits('country-code', code)
  emits('update:country-code', code)

  if (selectPhoneNumber && !results.value.isValid) {
    selectPhoneNumberInput()
  }

  setTimeout(() => {
    isCountryInternalUpdate.value = false
  }, 0)
}

/** Watchers */

watch(
  () => props.modelValue,
  (value, oldValue) => {
    if (!isPhoneNumberInternalUpdate.value && value !== oldValue && value !== phoneNumber.value) {
      onPhoneNumberChanged({ newPhoneNumber: value })
    }
  },
  { immediate: true },
)
watch(
  () => props.countryCode,
  (value, oldValue) => {
    if (!isCountryInternalUpdate.value && value && value !== oldValue && value !== selectedCountry.value) {
      onCountryChanged({ countryCode: value })
    }
  },
  { immediate: true },
)
watch(
  results,
  value => emits('data', value),
  { immediate: true },
)

/** Inject */
export interface MazInputPhoneNumberInjectedData {
  selectedCountry: typeof selectedCountry
  phoneNumber: typeof phoneNumber
  results: typeof results
}

provide<MazInputPhoneNumberInjectedData>('data', {
  selectedCountry,
  phoneNumber,
  results,
})
</script>

<template>
  <div
    class="m-phone-number-input m-reset-css"
    :class="[props.class, { '--block': block }, orientation ? `--${orientation}` : undefined]"
    :style
  >
    <CountrySelector
      v-if="!hideCountrySelector"
      :id="instanceId"
      v-bind="countrySelectAttributes"
      :model-value="selectedCountry"
      :color
      :size
      :country-locale
      :country-selector-display-name
      :custom-countries-list
      :ignored-countries
      :list-position
      :hide-flags
      :search
      :excluded-selectors
      :error="error || (validationError ? !!phoneNumber && !selectedCountry : false)"
      :success="success || (validationSuccess ? results?.isValid : false)"
      :locales
      :disabled
      :search-threshold
      :show-code-on-list
      :only-countries
      :preferred-countries
      :width="countrySelectorWidth"
      @update:model-value="onCountryChanged({ countryCode: $event, selectPhoneNumber: true })"
    >
      <template #no-results>
        <!--
         @slot Replace the "no results" icon in the country selector list
       -->
        <slot name="no-results" />
      </template>
      <template #selector-flag="{ countryCode: codeCountry }">
        <!--
         @slot Country selector flag
           @binding {String} country-code current selected country code Ex: `"FR"`
       -->
        <slot name="selector-flag" :country-code="codeCountry" />
      </template>
      <template #country-list-flag="{ isSelected, option }">
        <!--
         @slot Country list flag
           @binding {String} country-code country code of option Ex: `"FR"`
           @binding {{ iso2: string; dialCode: string; name: string; }} option country data
           @binding {Boolean} is-selected `true` if option is selected
       -->
        <slot
          name="country-list-flag"
          :country-code="option.iso2"
          :option="option"
          :is-selected="isSelected"
        />
      </template>
    </CountrySelector>

    <PhoneInput
      :id="instanceId"
      ref="PhoneInputRef"
      :model-value="phoneNumber"
      v-bind="{ ...$attrs, ...phoneInputAttributes }"
      :color
      :size
      :auto-format="hasAutoFormat"
      :no-example
      block
      :disabled
      :has-radius="!hideCountrySelector"
      :success="success || (validationSuccess ? results.isValid : false)"
      :error="error || (validationError ? !!phoneNumber && !results.isValid : false)"
      :locales
      :label
      :placeholder
      @update:model-value="onPhoneNumberChanged({ newPhoneNumber: $event })"
    />
  </div>
</template>

<style lang="postcss" scoped>
  .m-phone-number-input {
  @apply maz-relative maz-inline-flex maz-items-center maz-align-top;

  &.--block {
    @apply maz-w-full;
  }

  &.--col {
    @apply maz-flex-col;
  }

  &.--responsive {
    @apply maz-flex-col mob-m:maz-flex-row;
  }
}
</style>
