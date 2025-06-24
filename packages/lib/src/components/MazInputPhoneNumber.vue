<script lang="ts" setup>
import type { MazTranslationsNestedSchema } from '@maz-ui/translations/src/types.js'
import type { DeepPartial } from '@maz-ui/utils/src/ts-helpers/DeepPartial.js'
import type { CountryCode } from 'libphonenumber-js'
import type { HTMLAttributes } from 'vue'
import type { Results } from './MazInputPhoneNumber/types'

import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor, MazSize } from './types'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
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
import { useLibphonenumber } from './MazInputPhoneNumber/useLibphonenumber'
import { useMazInputPhoneNumber } from './MazInputPhoneNumber/useMazInputPhoneNumber'

defineOptions({
  name: 'MazInputPhoneNumber',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputPhoneNumberProps>(), {
  listPosition: 'bottom-start',
  color: 'primary',
  size: 'md',
  autoFormat: true,
  orientation: 'responsive',
  searchThreshold: 0.75,
  countrySelectAttributes: () => ({
    name: 'country',
    autocomplete: 'off',
    style: {
      width: '14rem',
    },
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
  example: true,
  disabled: false,
  hideCountrySelect: false,
  showCodeInList: false,
  displayCountryName: false,
  countryLocale: undefined,
  customCountriesList: undefined,
  hideFlags: false,
})

const emits = defineEmits<{
  /**
   * Emitted when country or phone number changes
   * @property {string} phoneNumber - phoneNumber formatted
   * @example
   * <MazInputPhoneNumber @update:model-value="handleValueChange" />
   */
  'update:model-value': [value: string | undefined | null]
  /**
   * Emitted when selected country changes
   * @property {CountryCode} countryCode - Country code
   * @example
   * <MazInputPhoneNumber @country-code="handleCountryChange" />
   */
  'country-code': [countryCode?: CountryCode | undefined | null]
  /**
   * Emitted when country changes
   * @property {CountryCode} countryCode - Country code
   * @example
   * <MazInputPhoneNumber @update:country-code="handleCountryChange" />
   */
  'update:country-code': [countryCode?: CountryCode | undefined | null]
  /**
   * Emitted when country or phone number changes
   * @property {Results} results - metadata of current phone number
   * @example
   * <MazInputPhoneNumber @data="handleDataChange" />
   */
  'data': [results: Results]
}>()

const MazSelectCountry = defineAsyncComponent(() => import('./MazSelectCountry.vue'))
const PhoneInput = defineAsyncComponent(() => import('./MazInputPhoneNumber/PhoneInput.vue'))

export interface MazInputPhoneNumberProps {
  /**
   * Style attribut of the component root element
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * Class attribut of the component root element
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /**
   * The current value of the input field in international format (e.g. +33612345678)
   * @model
   * @type {string | undefined | null}
   * @example "+33612345678"
   */
  modelValue?: string | undefined | null
  /**
   * The selected country code (e.g. "FR")
   * @model
   * @type {CountryCode | undefined | null}
   * @example "FR"
   */
  countryCode?: CountryCode | undefined | null
  /**
   * Unique identifier for the component
   * @type {string}
   * @example "phone-input-1"
   */
  id?: string
  /**
   * Text displayed when the input is empty
   * @type {string}
   * @example "Enter your phone number"
   */
  placeholder?: string
  /**
   * Label displayed above the input
   * @type {string}
   * @example "Phone Number"
   */
  label?: string
  /**
   * List of country codes to place first in the select list
   * @type {CountryCode[]}
   * @example ["FR", "BE", "GE"]
   */
  preferredCountries?: CountryCode[]
  /**
   * List of country codes to be removed from the select list
   * @type {CountryCode[]}
   * @example ["FR", "BE", "GE"]
   */
  ignoredCountries?: CountryCode[]
  /**
   * List of country codes to only have the countries selected in the select list
   * @type {CountryCode[]}
   * @example ["FR", "BE", "GE"]
   */
  onlyCountries?: CountryCode[]
  /**
   * Locale strings of the component
   * The default values are the translations of the MazTranslations plugin
   * @type {Partial<MazTranslationsNestedSchema['inputPhoneNumber']>}
   * @default {
   *   countrySelect: {
   *     error: 'Choose country',
   *     placeholder: 'Country code',
   *     searchPlaceholder: 'Search the country',
   *   },
   *   phoneInput: {
   *     placeholder: 'Phone number',
   *     example: 'Example: {example}',
   *   },
   * }
   */
  translations?: Partial<MazTranslationsNestedSchema['inputPhoneNumber']>
  /**
   * Position where the list of countries will be opened
   * @type {MazPopoverProps['position']}
   * @values top left, top right, bottom left, bottom right
   * @default "bottom left"
   */
  listPosition?: MazPopoverProps['position']
  /**
   * Component color applied
   * @type {MazColor}
   * @values primary, secondary, accent, info, success, warning, destructive, contrast
   * @default "primary"
   */
  color?: MazColor
  /**
   * Component size applied
   * @type {MazSize}
   * @values xs, sm, md, lg, xl, mini
   * @default "md"
   */
  size?: MazSize
  /**
   * Remove flags in country list
   * @default false
   */
  hideFlags?: boolean
  /**
   * Disable input
   * @default false
   */
  disabled?: boolean
  /**
   * Show the phone number example
   * @default true
   */
  example?: boolean
  /**
   * Disable search input in country list
   * @default true
   */
  search?: boolean
  /**
   * Threshold of the search input in country list where 1 is a perfect match and 0 is a match with any character
   * @type {number}
   * @default 0.75
   */
  searchThreshold?: number
  /**
   * If true, the browser locale will be used
   * @default true
   */
  useBrowserLocale?: boolean
  /**
   * The component will make a request (https://ipwho.is) to get the location of the user and use it to set the default country code
   * @default false
   */
  fetchCountry?: boolean
  /**
   * Hide the country selector
   * @default false
   */
  hideCountrySelect?: boolean
  /**
   * Show country calling code in the country list
   * @default false
   */
  showCodeInList?: boolean
  /**
   * Replace country names
   * @type {Record<CountryCode, string>}
   */
  customCountriesList?: Record<CountryCode, string>
  /**
   * Disabled auto-format when phone is valid
   * @default true
   */
  autoFormat?: boolean
  /**
   * Locale of country list
   * @type {string}
   * @example "fr-FR"
   */
  countryLocale?: string
  /**
   * Disable validation error UI
   * @default true
   */
  validationError?: boolean
  /**
   * Disable validation success UI
   * @default true
   */
  validationSuccess?: boolean
  /**
   * Add success UI
   * @default false
   */
  success?: boolean
  /**
   * Add error UI
   * @default false
   */
  error?: boolean
  /**
   * Will replace the calling code by the country name in the country selector
   * @default false
   */
  displayCountryName?: boolean
  /**
   * The input will be displayed in full width
   * @default false
   */
  block?: boolean
  /**
   * Orientation of the inputs in the component
   * @type {'row' | 'col' | 'responsive'}
   * @values row, col, responsive
   * @default "responsive"
   */
  orientation?: 'row' | 'col' | 'responsive'
  /**
   * Meta attributes of the country input
   * @type {Record<string, unknown>}
   * @default { autocomplete: 'off', name: 'country' }
   */
  countrySelectAttributes?: Record<string, unknown>
  /**
   * Meta attributes of the phone number input
   * @type {Record<string, unknown>}
   * @default { autocomplete: 'tel', name: 'phone', inputmode: 'tel' }
   */
  phoneInputAttributes?: Record<string, unknown>
}

/** Composables */
const { fetchCountryCode, getBrowserLocale, getCountryList } = useMazInputPhoneNumber()
const { isCountryAvailable, getPhoneNumberResults } = useLibphonenumber()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputPhoneNumber',
  providedId: props.id,
})

/** Models */

const phoneNumber = ref<string | undefined | null>()
const selectedCountry = ref<CountryCode | undefined>()

/** State */
const { t } = useTranslations()
const messages = computed(() => ({
  countrySelect: {
    error: props.translations?.countrySelect?.error || t('inputPhoneNumber.countrySelect.error'),
    placeholder: props.translations?.countrySelect?.placeholder || t('inputPhoneNumber.countrySelect.placeholder'),
    searchPlaceholder: props.translations?.countrySelect?.searchPlaceholder || t('inputPhoneNumber.countrySelect.searchPlaceholder'),
  },
  phoneInput: {
    placeholder: props.translations?.phoneInput?.placeholder || t('inputPhoneNumber.phoneInput.placeholder'),
    example: props.translations?.phoneInput?.example,
  },
} satisfies DeepPartial<MazTranslationsNestedSchema['inputPhoneNumber']>))
const isPhoneNumberInternalUpdate = ref(false)
const isCountryInternalUpdate = ref(false)
const hasAutoFormat = computed(() => props.autoFormat)

const results = ref<Results>({
  isValid: false,
  countryCode: props.countryCode,
  phoneNumber: props.modelValue,
})
const PhoneInputRef = ref<InstanceType<typeof PhoneInput>>()

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

async function selectPhoneNumberInput() {
  await nextTick()

  setTimeout(() => {
    PhoneInputRef.value?.focus()
  }, 100)
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

const countriesList = computed(() => {
  let list = getCountryList(props.countryLocale, props.customCountriesList)

  // preferredCountries, onlyCountries, ignoredCountries

  if (props.onlyCountries) {
    list = list?.filter(country => props.onlyCountries?.includes(country.code))
  }

  if (props.ignoredCountries) {
    list = list?.filter(country => !props.ignoredCountries?.includes(country.code))
  }

  if (props.preferredCountries) {
    list = list?.sort((a, b) => {
      const indexA = props.preferredCountries?.indexOf(a.code) ?? -1
      const indexB = props.preferredCountries?.indexOf(b.code) ?? -1

      if (indexA >= 0 && indexB >= 0) {
        return indexA - indexB
      }

      if (indexA >= 0) {
        return -1
      }

      if (indexB >= 0) {
        return 1
      }

      return 0
    })
  }

  return list ?? []
})

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
    class="m-input-phone-number m-reset-css"
    :class="[props.class, { '--block': block }, orientation ? `--${orientation}` : undefined]"
    :style
  >
    <MazSelectCountry
      v-if="!hideCountrySelect"
      :id="`${instanceId}-country`"
      class="m-input-phone-number__country-select"
      v-bind="countrySelectAttributes"
      :model-value="selectedCountry"
      :option-input-value-key="displayCountryName ? 'name' : 'dialCode'"
      :color
      :size
      :locale="countryLocale"
      :countries-list="customCountriesList"
      :list-position
      :hide-flags
      :search
      :block
      :error="error || (validationError ? !!phoneNumber && !selectedCountry : false)"
      :success="success || (validationSuccess ? results?.isValid : false)"
      :translations="messages.countrySelect"
      :hint="!!phoneNumber && !selectedCountry ? messages.countrySelect.error : undefined"
      :options="countriesList"
      :disabled
      :search-threshold
      :format-input-value="displayCountryName ? undefined :(value) => `+${value}`"
      :show-code-in-list
      :label="messages.countrySelect.placeholder"
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
          :country-code="option.code"
          :option="option"
          :is-selected="isSelected"
        />
      </template>
      <template #country-list-code="{ option }">
        <span class="m-input-phone-number__country-list-code">
          +{{ option.dialCode }}
        </span>
      </template>
    </MazSelectCountry>

    <PhoneInput
      :id="`${instanceId}-phone`"
      ref="PhoneInputRef"
      class="m-input-phone-number__phone-input"
      :model-value="phoneNumber"
      v-bind="{ ...$attrs, ...phoneInputAttributes }"
      :color
      :size
      :auto-format="hasAutoFormat"
      :example
      block
      :disabled
      :has-radius="!hideCountrySelect"
      :success="success || (validationSuccess ? results.isValid : false)"
      :error="error || (validationError ? !!phoneNumber && !results.isValid : false)"
      :locales="messages.phoneInput"
      :label
      :placeholder
      @update:model-value="onPhoneNumberChanged({ newPhoneNumber: $event })"
    />
  </div>
</template>

<style lang="postcss" scoped>
.m-input-phone-number {
  @apply maz-relative maz-inline-flex maz-items-center maz-align-top;

  &.--block {
    @apply maz-w-full;
  }

  &.--col {
    @apply maz-flex-col;

    .m-input-phone-number__country-select {
      @apply maz-min-w-full;

      &:deep(.m-select-country__select) {
        @apply maz-min-w-full;

        .m-input-wrapper {
          @apply maz-rounded-b-none maz-rounded-tr;
        }
      }
    }
  }

  &.--row {
    @apply maz-flex-row;

    .m-input-phone-number__country-select {
      &:deep(.m-select-country__select .m-input-wrapper) {
        @apply maz-rounded-r-none maz-rounded-b-none;
      }
    }
  }

  &.--responsive {
    @apply maz-flex-col mob-l:maz-flex-row;

    .m-input-phone-number__country-select {
      @apply maz-min-w-full mob-l:maz-min-w-[inherit];

      :deep(.m-select-country__select) {
        @apply maz-min-w-full mob-l:maz-min-w-[inherit];
      }

      &:deep(.m-input-wrapper) {
        @apply maz-rounded-b-none mob-l:maz-rounded-b mob-l:maz-rounded-r-none;
      }
    }
  }

  &__country-list-code {
    @apply maz-text-muted maz-min-w-[2rem] maz-text-center;
  }
}
</style>
