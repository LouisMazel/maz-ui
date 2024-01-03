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
      v-if="countryCodeModel && !noFlags && !noCountrySelector"
      class="m-phone-number-input__country-flag maz-text-xl"
      tabindex="-1"
      type="button"
      :class="{
        '--should-have-bottom-flag': locales.countrySelector.placeholder.length > 0,
      }"
      @click="focusCountrySelector"
    >
      <!--
        @slot Country selector flag
          @binding {String} country-code - current selected country code - Ex: `"FR"`
      -->
      <slot name="selector-flag" :country-code="countryCodeModel">
        {{ countryCodeToUnicodeFlag(countryCodeModel) }}
      </slot>
    </button>

    <MazSelect
      v-if="!noCountrySelector"
      ref="CountrySelector"
      v-model="countryCodeModel"
      class="m-phone-number-input__select"
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
      :error="error || (!noValidationError ? !!inputValue && !countryCodeModel : false)"
      :hint="!!inputValue && !countryCodeModel ? locales.countrySelector.error : undefined"
      :success="success || (!noValidationSuccess ? results?.isValid : false)"
      :label="locales.countrySelector.placeholder"
      :style="{
        width: countrySelectorWidth,
      }"
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
      inputmode="tel"
      :success="success || (!noValidationSuccess ? results?.isValid : false)"
      class="m-phone-number-input__input maz-flex-1"
      :class="{
        '--border-radius': !noCountrySelector,
        '--error': error || !results?.isValid,
        '--focused': inputFocused,
      }"
      @focus="inputFocused = true"
      @blur="inputFocused = false"
      @update:model-value="onInputValueChanged($event as string)"
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
    ref,
    watch,
    getCurrentInstance,
    nextTick,
    reactive,
    defineOptions,
    type StyleValue,
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

  const emits = defineEmits<{
    /**
     * emitted when country or phone number changes
     * @property {Result} results - meta info of current phone number
     */
    (event: 'update', results: Result): void
    /** emitted when country or phone number changes
     * @property {Result} results - meta info of current phone number
     */
    (event: 'data', results: Result): void
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

  const props = withDefaults(
    defineProps<{
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
      countryCode?: CountryCode | string
      /** @deprecated - use country-code or v-model:country-code */
      defaultCountryCode?: CountryCode | string
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
      /** The component will make a request to get the location of the user and use it to set the default country code */
      fetchCountry?: boolean
      /** No show the country selector */
      noCountrySelector?: boolean
      /** Show country calling code in the country list */
      showCodeOnList?: boolean
      /** Replace country names */
      customCountriesList?: Record<CountryCode, string>
      /** Disabled auto-format as you type */
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
    }>(),
    {
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
    },
  )

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
      const example = getPhoneNumberExample(countryCodeModel.value)
      return results.value.isValid || !example
        ? defaultPlaceholder
        : `${locales.value.phoneInput.example} ${example}`
    }
  })

  const internalCountryCode = ref<CountryCode | undefined>(
    (props.countryCode || props.defaultCountryCode) as CountryCode,
  )

  watch(
    () => props.countryCode || props.defaultCountryCode,
    (value) => {
      internalCountryCode.value = value as CountryCode | undefined
    },
  )

  const countryCodeModel = computed({
    get: () => internalCountryCode.value,
    set: (value) => {
      emits('country-code', value)
      emits('update:country-code', value)

      if (value) {
        onCountryChanged(value)
        onInputValueChanged(inputValue.value)
      }
    },
  })

  const phoneNumberModel = computed({
    get: () => props.modelValue || props.defaultPhoneNumber,
    set: (value) => {
      emits('update:model-value', value)
    },
  })

  const internalValue = ref<string | undefined>(phoneNumberModel.value)

  const asYouTypeFormatted = ref<string>()

  const inputValue = computed<string>(() => {
    if (props.noFormattingAsYouType) {
      return internalValue.value ?? ''
    }

    return asYouTypeFormatted.value ?? internalValue.value ?? ''
  })

  const results = ref<Result>(
    getResultsFromPhoneNumber({
      phoneNumber: phoneNumberModel.value,
      countryCode: countryCodeModel.value,
    }),
  )

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
    await parseModel(phoneNumberModel.value)

    await nextTick()

    if (props.fetchCountry && !countryCodeModel.value) {
      await setCountryFromIpWho()
    }

    if (!props.defaultCountryCode && !props.noUseBrowserLocale && !countryCodeModel.value) {
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
    () => phoneNumberModel.value,
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
      countryCode: countryCodeModel.value,
    })

    phoneNumberModel.value = newResults.e164
  }

  function onCountryChanged(codeCountry: string | CountryCode) {
    setCountryCode(codeCountry, true)
    updateResults(inputValue.value, codeCountry as CountryCode)
  }

  function setCountryCode(selectedCountryCode: string | CountryCode, autoFocusInput = false) {
    try {
      const countryAvailable = isCountryAvailable(selectedCountryCode)

      if (countryAvailable) {
        internalCountryCode.value = selectedCountryCode as CountryCode

        if (autoFocusInput) {
          focusPhoneNumberInput()
        }
      }
    } catch (error) {
      console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    }
  }

  async function parseModel(newModel?: string) {
    updateResults(newModel, countryCodeModel.value)

    await nextTick()

    if (props.noFormattingAsYouType) {
      internalValue.value = inputValue.value
    } else if (newModel) {
      asYouTypeFormatted.value =
        selectionRange.cursorAtEnd || results.value.isValid
          ? (internalValue.value = getAsYouTypeFormat(
              results.value.countryCode ?? countryCodeModel.value,
              results.value.formatNational ?? internalValue.value,
            ))
          : internalValue.value
    } else {
      asYouTypeFormatted.value = undefined
    }

    await nextTick()

    autoUpdateCountryCodeWithResults(results.value)
  }

  function autoUpdateCountryCodeWithResults(newResults: Result) {
    if (newResults.countryCode && countryCodeModel.value !== newResults.countryCode) {
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
    @apply maz-relative maz-flex maz-items-center;

    &__country-flag {
      position: absolute;
      left: 13px;
      z-index: 4;
      outline: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;

      &.--should-have-bottom-flag {
        bottom: 2px;
      }
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
