<template>
  <div
    :id="instanceId"
    class="m-phone-number-input"
    :class="[
      props.class,
      {
        '--no-flags': noFlags,
      },
    ]"
    :style="style"
  >
    <button
      v-if="countryCode && !noFlags && !noCountrySelector"
      class="m-phone-number-input__country-flag maz-text-xl"
      tabindex="-1"
      type="button"
      @click="focusCountrySelector"
    >
      <!--
        @slot Country selector flag
          @binding {String} country-code - current selected country code - Ex: `"FR"`
      -->
      <slot name="selector-flag" :country-code="countryCode">
        {{ countryCodeToUnicodeFlag(countryCode) }}
      </slot>
    </button>

    <MazSelect
      v-if="!noCountrySelector"
      ref="CountrySelector"
      class="m-phone-number-input__select"
      :model-value="countryCode"
      option-value-key="iso2"
      option-label-key="name"
      :option-input-value-key="countrySelectorDisplayName ? 'name' : 'dialCode'"
      :max-list-width="250"
      :disabled="disabled"
      :color="color"
      :size="size"
      :list-position="listPosition"
      :search="!noSearch"
      :search-placeholder="locales.countrySelector.searchPlaceholder"
      :options="countryOptions"
      :error="error || (!noValidationError ? !!inputValue && !countryCode : false)"
      :hint="!!inputValue && !countryCode ? locales.countrySelector.error : undefined"
      :label="locales.countrySelector.placeholder"
      :success="success || (!noValidationSuccess ? results?.isValid : false)"
      :style="{
        width: countrySelectorWidth,
      }"
      @update:model-value="onCountryChanged($event)"
      @focus="inputFocused = false"
    >
      <template #default="{ option, isSelected }">
        <div
          class="m-phone-number-input__select__item maz-flex maz-items-center maz-gap-1 maz-truncate"
          :class="{
            'm-phone-number-input__select__item--selected': isSelected,
          }"
        >
          <span v-if="!noFlags && typeof option.iso2 === 'string'" class="maz-text-lg">
            <!--
              @slot Country list flag
                @binding {String} country-code - country code of option - Ex: `"FR"`
                @binding {{ iso2: string; dialCode: string; name: string; }} option - country data
                @binding {Boolean} is-selected - `true` if option is selected
            -->
            <slot
              name="country-list-flag"
              :country-code="option.iso2"
              :option="option"
              :is-selected="isSelected"
            >
              {{ countryCodeToUnicodeFlag(option.iso2) }}
            </slot>
          </span>
          <span
            v-if="showCodeOnList"
            class="maz-w-9 maz-flex-none"
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
      :model-value="inputValue"
      :label="inputPlaceholder"
      :disabled="disabled"
      :color="color"
      :error="error || (!noValidationError ? !!inputValue && !results?.isValid : false)"
      v-bind="$attrs"
      :size="size"
      icon-name="phone"
      type="tel"
      clearable
      :success="success || (!noValidationSuccess ? results?.isValid : false)"
      class="m-phone-number-input__input maz-flex-1"
      :class="{
        '--border-radius': !noCountrySelector,
        '--error': error || !results?.isValid,
        '--focused': inputFocused,
      }"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @update:model-value="onInputValueChanged($event)"
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

  import { defaultLocales } from './MazPhoneNumberInput/default-locales'

  import {
    computed,
    onMounted,
    type PropType,
    ref,
    watch,
    getCurrentInstance,
    nextTick,
    reactive,
    defineOptions,
    type HTMLAttributes,
  } from 'vue'

  import { countryCodeToUnicodeFlag } from './../modules/helpers/country-code-to-unicode-flag'
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

  import MazInput from './MazInput.vue'
  import MazSelect from './MazSelect.vue'

  const emits = defineEmits([
    /** emitted when country or phone number changes
     * @property {Result} results - meta info of current phone number
     */
    'update',
    /** emitted when country or phone number changes
     * @property {Result} results - meta info of current phone number
     */
    'data',
    /** emitted when selected country changes
     * @property {CountryCode} countryCode - Country code
     */
    'country-code',
    /** emitted when country or phone number changes
     * @property {String} phoneNumber - phoneNumber formatted
     */
    'update:model-value',
    /** emitted when country changes
     * @property {CountryCode} countryCode - Country code
     */
    'update:country-code',
  ])

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    /** Country calling code + telephone number in international format */
    modelValue: {
      type: String,
      validator: (prop: string) => {
        return typeof prop === 'string' || prop === undefined
      },
      default: undefined,
    },
    /** @deprecated */
    defaultPhoneNumber: { type: String, default: undefined },
    /** Country code selected - Ex: "FR" */
    countryCode: {
      type: String as PropType<CountryCode | string>,
      default: undefined,
      validator: (code: string) => isCountryAvailable(code),
    },
    /** @deprecated - use country-code or v-model:country-code */
    defaultCountryCode: {
      type: String as PropType<CountryCode | string>,
      default: undefined,
      validator: (code: string) => isCountryAvailable(code),
    },
    id: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    /** List of country codes to place first in the select list - Ex: ['FR', 'BE', 'GE'] */
    preferredCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    /** List of country codes to be removed from the select list - Ex: ['FR', 'BE', 'GE'] */
    ignoredCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    /** List of country codes to only have the countries selected in the select list - Ex: ['FR', 'BE', 'GE'] */
    onlyCountries: { type: Array as PropType<CountryCode[]>, default: undefined },
    /** Locale strings of the component */
    translations: { type: Object as PropType<Translations>, default: undefined },
    /** Position where the list of countries will be opened */
    listPosition: {
      type: String as PropType<Position>,
      default: 'bottom left',
      validator: (value: Position) => {
        return ['top', 'top right', 'top left', 'bottom', 'bottom right', 'bottom left'].includes(
          value,
        )
      },
    },
    /** Component color applied - Ex: "secondary" */
    color: { type: String as PropType<Color>, default: 'primary' },
    /** Component size applied - Ex: "sm" */
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    /** Remove flags in country list */
    noFlags: { type: Boolean, default: false },
    /** Disable input */
    disabled: { type: Boolean, default: false },
    /** No show the phone number example */
    noExample: { type: Boolean, default: false },
    /** Disable search input in country list */
    noSearch: { type: Boolean, default: false },
    /** By default the component use the browser locale to set the default country code if not country code is provided */
    noUseBrowserLocale: { type: Boolean, default: false },
    /** The component will make a request to get the location of the user and use it to set the default country code */
    fetchCountry: { type: Boolean, default: false },
    /** No show the country selector */
    noCountrySelector: { type: Boolean, default: false },
    /** Show country calling code in the country list */
    showCodeOnList: { type: Boolean, default: false },
    /** Replace country names */
    customCountriesList: {
      type: Object as PropType<Record<CountryCode, string>>,
      default: undefined,
    },
    /** Disabled auto-format as you type */
    noFormattingAsYouType: { type: Boolean, default: false },
    /**
     * locale of country list - Ex: "fr-FR"
     * @default {string} browser locale
     */
    countryLocale: { type: String, default: undefined },
    /** Disable validation error UI */
    noValidationError: { type: Boolean, default: false },
    /** Disable validation success UI */
    noValidationSuccess: { type: Boolean, default: false },
    /** Add success UI */
    success: { type: Boolean, default: false },
    /** Add error UI */
    error: { type: Boolean, default: false },
    /** Will replace the calling code by the country name in the country selector */
    countrySelectorDisplayName: { type: Boolean, default: false },
    /** Choose the width of the country selector */
    countrySelectorWidth: { type: String, default: '9rem' },
  })

  const instance = getCurrentInstance()
  const instanceId = useInstanceUniqId({
    componentName: 'MazPhoneNumberInput',
    instance,
    providedId: props.id,
  })

  const PhoneNumberInput = ref<typeof MazInput>()
  const CountrySelector = ref<typeof MazSelect>()
  const selectionRange = reactive<{
    start?: number | null
    end?: number | null
    cursorAtEnd?: boolean
  }>({
    start: 0,
    end: 0,
    cursorAtEnd: true,
  })

  const examplesFileLoaded = ref(false)
  const inputFocused = ref(false)

  const countries = computed(() => getCountriesList(props.countryLocale, props.customCountriesList))

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

  const locales = computed(() => ({
    ...defaultLocales,
    ...props.translations,
  }))

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

  const model = computed({
    get: () => props.modelValue || props.defaultPhoneNumber,
    set: (value) => {
      emits('update:model-value', value)
    },
  })

  const internalCountryCode = ref<CountryCode>()

  const countryCode = computed({
    get: () =>
      (props.countryCode || props.defaultCountryCode || internalCountryCode.value) as
        | CountryCode
        | undefined,
    set: (value) => {
      emits('country-code', value)
      emits('update:country-code', value)
      internalCountryCode.value = value
    },
  })

  const internalValue = ref<string | undefined>(model.value)

  const results = ref<Result>(
    getResultsFromPhoneNumber({
      phoneNumber: model.value,
      countryCode: countryCode.value,
    }),
  )

  const asYouTypeFormatted = ref<string>()

  const inputValue = computed<string>(() => {
    if (props.noFormattingAsYouType) {
      return internalValue.value ?? ''
    }

    return asYouTypeFormatted.value ?? internalValue.value ?? ''
  })

  async function setCountryFromIpWho() {
    const fetchedLocale = await fetchCountryCode()
    if (fetchedLocale) setCountryCode(fetchedLocale)
  }

  async function loadExamples() {
    try {
      if (!props.noExample && !examplesFileLoaded.value) {
        await loadPhoneNumberExamplesFile()
        examplesFileLoaded.value = true
      }
    } catch {
      console.error('[maz-ui](MazPhoneNumberInput) while loading phone number examples file')
    }
  }

  onMounted(async () => {
    await parseModel(model.value)

    await nextTick()

    if (props.fetchCountry && !countryCode.value) {
      await setCountryFromIpWho()
    }

    if (!props.defaultCountryCode && !props.noUseBrowserLocale && !countryCode.value) {
      setCountryCodeFromBrowserLocale()
    }

    await loadExamples()
  })

  watch(
    () => results.value,
    (newResults) => {
      emits('update', newResults)
      emits('data', newResults)
    },
    { immediate: true, deep: true },
  )

  watch(
    () => countryCode.value,
    (newCountryCode, oldCountryCode) => {
      if (newCountryCode && newCountryCode !== oldCountryCode) {
        setCountryCode(newCountryCode)
        onInputValueChanged(inputValue.value)
      }
    },
  )

  watch(
    () => model.value,
    async (newModel, oldModel) => {
      if (newModel !== oldModel) {
        parseModel(newModel)
      }
    },
  )

  watch(
    () => inputValue.value,
    async (newModel, oldModel) => {
      if (!props.noFormattingAsYouType && newModel && newModel !== oldModel) {
        const input = getPhoneNumberInput()
        if (
          input &&
          !results.value.isValid &&
          typeof selectionRange.start === 'number' &&
          !selectionRange.cursorAtEnd
        ) {
          const start = selectionRange.start
          const end = selectionRange.end
          setTimeout(() => {
            input.setSelectionRange(start, end ?? start)
          }, 0)
        }
      }
    },
  )

  function setCountryCodeFromBrowserLocale() {
    const { locale } = browserLocale()
    if (locale) {
      setCountryCode(locale)
    }
  }

  function updateResults(phoneNumber?: string, countryCode?: CountryCode) {
    results.value = getResultsFromPhoneNumber({
      phoneNumber,
      countryCode,
    })
  }

  async function onInputValueChanged(phoneNumber: string) {
    const input = getPhoneNumberInput()
    selectionRange.start = input?.selectionStart
    selectionRange.end = input?.selectionEnd
    selectionRange.cursorAtEnd = selectionRange.start
      ? selectionRange.start >= phoneNumber.length
      : true

    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber)

    internalValue.value = sanitizedPhoneNumber

    const newResults = getResultsFromPhoneNumber({
      phoneNumber: sanitizedPhoneNumber,
      countryCode: countryCode.value,
    })

    model.value = newResults.e164
  }

  function onCountryChanged(codeCountry: string | CountryCode) {
    updateResults(inputValue.value, codeCountry as CountryCode)

    setCountryCode(codeCountry, true)
  }

  function setCountryCode(selectedCountryCode: string | CountryCode, autoFocusInput = false) {
    try {
      const countryAvailable = isCountryAvailable(selectedCountryCode)

      if (countryAvailable) {
        countryCode.value = selectedCountryCode as CountryCode

        if (autoFocusInput) {
          focusPhoneNumberInput()
        }
      }
    } catch (error) {
      console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }
  }

  async function parseModel(newModel?: string) {
    updateResults(newModel, countryCode.value)

    await nextTick()

    if (props.noFormattingAsYouType) {
      internalValue.value = inputValue.value
    } else {
      asYouTypeFormatted.value =
        selectionRange.cursorAtEnd || results.value.isValid
          ? (internalValue.value = getAsYouTypeFormat(
              results.value.countryCode ?? countryCode.value,
              results.value.formatNational ?? internalValue.value,
            ))
          : internalValue.value
    }

    await nextTick()

    autoUpdateCountryCodeWithResults(results.value)
  }

  function autoUpdateCountryCodeWithResults(newResults: Result) {
    if (newResults.countryCode && countryCode.value !== newResults.countryCode) {
      setCountryCode(newResults.countryCode)
    }
  }

  function getPhoneNumberInput() {
    return PhoneNumberInput.value?.$el.querySelector('input') as HTMLInputElement | undefined
  }

  function focusCountrySelector() {
    CountrySelector.value?.$el.querySelector('input')?.focus()
  }

  async function focusPhoneNumberInput() {
    await nextTick()
    getPhoneNumberInput()?.focus()
  }
</script>

<style lang="postcss" scoped>
  .m-phone-number-input {
    @apply maz-relative maz-flex;

    &__country-flag {
      position: absolute;
      bottom: 2px;
      left: 13px;
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
      width: 9rem;

      &__item {
        @apply maz-w-full maz-text-sm;
      }

      &:deep(.m-select-input .m-input-wrapper) {
        @apply maz-rounded-r-none !important;
      }
    }

    &:not(.--no-flags) {
      .m-phone-number-input__select:deep(.m-select-input input) {
        @apply maz-pl-9 !important;
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
../modules/helpers/country-code-to-unicode-flag
