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
      class="m-phone-number-input__country-flag"
      tabindex="-1"
      type="button"
      @click="focusCountrySelector"
    >
      <div class="maz-flag" :class="`maz-flag-${countryCode.toLowerCase()}`" />
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
      :search-placeholder="t.countrySelector.searchPlaceholder"
      :options="countryOptions"
      :error="error || (!!formattedNumber && !countryCode)"
      :hint="!!formattedNumber && !countryCode ? t.countrySelector.error : undefined"
      :label="t.countrySelector.placeholder"
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
          <span
            v-if="!noFlags && typeof option.iso2 === 'string'"
            class="maz-flag maz-mr-2"
            :class="[`maz-flag-${option.iso2.toLowerCase()}`]"
          />
          <span
            v-if="showCodeOnList"
            class="maz-w-10 maz-flex-none"
            :class="{ 'maz-text-muted': !isSelected }"
          >
            {{ option.dialCode }}
          </span>
          <span class="maz-flex-1 maz-truncate">
            {{ option.name }}
          </span>
        </div>
      </template>
    </MazSelect>

    <MazInput
      :id="id"
      ref="PhoneNumberInput"
      :model-value="formattedNumber"
      :label="inputPlaceholder"
      :disabled="disabled"
      :color="color"
      :error="error || (!!formattedNumber && !results.isValid)"
      v-bind="$attrs"
      :size="size"
      icon-name="phone"
      type="tel"
      clearable
      class="m-phone-number-input__input maz-flex-1"
      :class="{
        '--border-radius': !noCountrySelector,
        '--error': error || !results.isValid,
        '--focused': inputFocused,
      }"
      @focus="inputFocused = true"
      @blur="onBlur"
      @update:model-value="emitsValueAndResults($event)"
      @keydown="onKeydown($event)"
    />
  </div>
</template>

<script lang="ts">
  export type { Color, Size, Position } from './types'
  export type { CountryCode } from 'libphonenumber-js'
  export type { Result, Translations } from './MazPhoneNumberInput/types'
</script>

<script lang="ts" setup>
  import type { CountryCode } from 'libphonenumber-js'
  import type { Result, Translations } from './MazPhoneNumberInput/types'
  import type { Color, Position, Size } from './types'

  import {
    fetchCountryCode,
    browserLocale,
    getResultsFromPhoneNumber,
    getAsYouTypeFormat,
    isCountryAvailable,
    getCountriesList,
    getExamplePhoneNumber,
    sanitizePhoneNumber,
    loadPhoneNumberExamplesFile,
  } from './MazPhoneNumberInput/utils'
  import { truthyFilter } from '@package/helpers'
  import { useInstanceUniqId } from '@package/composables/instance-uniq-id.composable'

  import locales from './MazPhoneNumberInput/constantes/locales'

  import {
    computed,
    onBeforeMount,
    onMounted,
    type PropType,
    ref,
    watch,
    getCurrentInstance,
  } from 'vue'

  import MazInput from './MazInput.vue'
  import MazSelect from './MazSelect.vue'

  const emits = defineEmits(['update', 'update:model-value', 'country-code'])

  const props = defineProps({
    modelValue: {
      type: String,
      validator: (prop: string) => {
        return typeof prop === 'string' || prop === undefined
      },
      default: undefined,
    },
    id: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    defaultPhoneNumber: { type: String, default: undefined },
    defaultCountryCode: {
      type: String as PropType<CountryCode | string>,
      default: undefined,
      validator: (code: string) => isCountryAvailable(code),
    },
    preferredCountries: {
      type: Array as PropType<CountryCode[]>,
      default: undefined,
    },
    ignoredCountries: {
      type: Array as PropType<CountryCode[]>,
      default: undefined,
    },
    onlyCountries: {
      type: Array as PropType<CountryCode[]>,
      default: undefined,
    },
    translations: {
      type: Object as PropType<Translations>,
      default: undefined,
    },
    listPosition: {
      type: String as PropType<Position>,
      default: 'bottom left',
      validator: (value: Position) => {
        return ['top', 'top right', 'top left', 'bottom', 'bottom right', 'bottom left'].includes(
          value,
        )
      },
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: string) => {
        return [
          'primary',
          'secondary',
          'warning',
          'danger',
          'info',
          'success',
          'white',
          'black',
        ].includes(value)
      },
    },
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
  const { instanceId } = useInstanceUniqId({
    componentName: 'MazPhoneNumberInput',
    instance,
    providedId: props.id,
  })

  const results = ref<Partial<Result>>({})
  const countryCode = ref<CountryCode>()
  const formattedNumber = ref<string>()
  const cursorPosition = ref<number | null>()
  const examplesFileLoaded = ref(false)
  const inputFocused = ref(false)
  const lastKeyPressed = ref<KeyboardEvent['key']>()
  const CountrySelector = ref<typeof MazSelect>()
  const PhoneNumberInput = ref<typeof MazInput>()

  onBeforeMount(async () => {
    try {
      formattedNumber.value = props.modelValue ?? props.defaultPhoneNumber

      if (props.defaultCountryCode) {
        setCountryCode(props.defaultCountryCode)
      }

      if (props.fetchCountry) {
        const locale = await fetchCountryCode()
        if (locale) setCountryCode(locale)
      }

      getAndEmitResults(formattedNumber.value)
    } catch (error) {
      throw new Error(`[MazPhoneNumberInput](onBeforeMount) ${error}`)
    }

    try {
      if (!props.noExample && !examplesFileLoaded.value) {
        await loadPhoneNumberExamplesFile()
        examplesFileLoaded.value = true
      }
    } catch {
      throw new Error(
        '[MazPhoneNumberInput](onBeforeMount) while loading phone number examples file',
      )
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
        throw String(
          "Do not use 'fetch-country' and 'default-country-code' options in the same time",
        )
      }
      if (props.defaultCountryCode && props.noUseBrowserLocale) {
        throw String(
          "If you use a 'default-country-code', do not use 'no-use-browser-locale' options",
        )
      }
    } catch (error) {
      console.warn(`[MazPhoneNumberInput](mounted) ${error}`)
    }
  })

  const countries = computed(() => getCountriesList(props.customCountriesList))

  const t = computed(() => ({
    ...locales,
    ...props.translations,
  }))

  const isValid = computed(() => {
    return results.value?.isValid
  })

  const countriesList = computed(() => {
    return countries.value?.filter((item) => !props.ignoredCountries?.includes(item.iso2))
  })

  const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries?.map((country) =>
      countriesList.value?.find((item) => item.iso2.includes(country)),
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

    const defaultPlaceholder = t.value.phoneInput.placeholder

    if (props.noExample || !examplesFileLoaded.value) {
      return defaultPlaceholder
    } else {
      const example = getPhoneNumberExample()
      return isValid.value || !example
        ? defaultPlaceholder
        : `${t.value.phoneInput.example} ${example}`
    }
  })

  watch(
    () => props.modelValue,
    (phoneNumber, oldPhoneNumber) => {
      if (phoneNumber !== oldPhoneNumber) {
        emitsValueAndResults(phoneNumber)
      }
    },
  )

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
        emitsValueAndResults()
      }
    },
  )

  const onKeydown = (event: KeyboardEvent) => {
    lastKeyPressed.value = event.key

    const target = event.target as HTMLInputElement | undefined

    cursorPosition.value = target?.selectionStart
  }

  const getPhoneNumberExample = () => {
    try {
      const phoneNumber = countryCode.value ? getExamplePhoneNumber(countryCode.value) : undefined
      return phoneNumber ? phoneNumber.formatNational() : undefined
    } catch (error) {
      throw new Error(`[MazPhoneNumberInput](getPhoneNumberExample) ${error}`)
    }
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

  const sanitizeNumber = (phoneNumber?: string) => {
    phoneNumber = sanitizePhoneNumber(phoneNumber)

    const backSpacePressed = lastKeyPressed.value === 'Backspace'

    const lastCharacOfPhoneNumber = phoneNumber ? phoneNumber.charAt(phoneNumber.length - 1) : ''
    const lastCharIsParanthese = lastCharacOfPhoneNumber === ')'

    if (backSpacePressed && lastCharIsParanthese) {
      phoneNumber = phoneNumber?.trim().slice(0, -2)
    }

    return phoneNumber
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
      throw new Error(`[MazPhoneNumberInput](emitsValueAndResults) ${error}`)
    }
  }

  const emitValue = (phoneNumber?: string) => {
    formattedNumber.value = sanitizeNumber(phoneNumber)

    const { isValid, e164, formatNational } = getResultsFromPhoneNumber(
      countryCode.value,
      phoneNumber,
    )

    const hasDeletedCharac =
      formattedNumber.value && phoneNumber && formattedNumber.value?.length > phoneNumber?.length

    const cursorIsAtEnd =
      phoneNumber && cursorPosition.value ? cursorPosition.value + 1 >= phoneNumber.length : true

    const shouldUseAsYoutType = (!hasDeletedCharac && cursorIsAtEnd) || isValid

    if (countryCode.value) {
      const isFullNumber = formattedNumber.value?.includes('+')

      formattedNumber.value =
        formatNational && isFullNumber
          ? formatNational
          : shouldUseAsYoutType
          ? getAsYouTypeFormat(countryCode.value, formattedNumber.value)
          : formattedNumber.value
    }

    const valueToEmit = isValid ? e164 : formattedNumber.value

    if (valueToEmit !== props.modelValue) {
      emits('update:model-value', valueToEmit)
    }
  }

  const onBlur = () => {
    inputFocused.value = true

    if (countryCode.value) {
      formattedNumber.value = getAsYouTypeFormat(countryCode.value, formattedNumber.value)
    }
  }

  const setCountryCode = (selectedCountryCode: string, autoFocusInput = false) => {
    try {
      const countryAvailable = isCountryAvailable(selectedCountryCode)

      if (countryAvailable) {
        countryCode.value = selectedCountryCode as CountryCode
        emits('country-code', selectedCountryCode)
        emitsValueAndResults(props.modelValue, true)
      }

      if (autoFocusInput) {
        focusPhoneNumberInput()
        if (formattedNumber.value && formattedNumber.value.includes('+')) {
          formattedNumber.value = undefined
        }
      }
    } catch (error) {
      throw new Error(`[MazPhoneNumberInput](setCountryCode) ${error}`)
    }
  }

  const focusCountrySelector = () => {
    try {
      CountrySelector.value?.$el.querySelector('input')?.focus()
    } catch (error) {
      throw new Error(`[MazPhoneNumberInput](focusCountrySelector) ${error}`)
    }
  }

  const focusPhoneNumberInput = () => {
    try {
      PhoneNumberInput.value?.$el.querySelector('input')?.focus()
    } catch (error) {
      throw new Error(`[MazPhoneNumberInput](focusPhoneNumberInput) ${error}`)
    }
  }
</script>

<style lang="postcss" scoped>
  @import './MazPhoneNumberInput/css/flags.css';

  .m-phone-number-input {
    @apply maz-relative maz-flex;

    &__country-flag {
      position: absolute;
      bottom: 10px;
      left: 18px;
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
