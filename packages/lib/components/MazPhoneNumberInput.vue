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
      :error="error || (!!inputValue && !countryCode)"
      :hint="!!inputValue && !countryCode ? locales.countrySelector.error : undefined"
      :label="locales.countrySelector.placeholder"
      @update:model-value="onCountryChanged($event)"
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
      :model-value="inputValue"
      :label="inputPlaceholder"
      :disabled="disabled"
      :color="color"
      :error="error || (!!inputValue && !results?.isValid)"
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

  import MazInput from './MazInput.vue'
  import MazSelect from './MazSelect.vue'

  const emits = defineEmits([
    /** emitted when country or phone number changed
     * @returns data - {Result}
     */
    'update',
    /** emitted when country or phone number changed
     * @returns data - {Result}
     */
    'data',
    /** emitted when selected country changed */
    'country-code',
    /** Two way binding (v-model:model-value) - emitted when country changed */
    'update:model-value',
    /** Two way binding (v-model:country-code) - emitted when country changed */
    'update:country-code',
  ])

  const props = defineProps({
    modelValue: {
      type: String,
      validator: (prop: string) => {
        return typeof prop === 'string' || prop === undefined
      },
      default: undefined,
    },
    /** @deprecated */
    defaultPhoneNumber: { type: String, default: undefined },
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
    /**
     * Disabled auto-format as you type
     */
    noFormattingAsYouType: { type: Boolean, default: false },
    /**
     * locale of country list - Ex: "fr-FR"
     * @default browser locale
     */
    countryLocale: { type: String, default: undefined },
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
