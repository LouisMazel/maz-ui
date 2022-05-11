<template>
  <div
    :id="id"
    class="m-phone-number-input maz-relative maz-flex"
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
      :class="{
        '--no-country-code': !countryCode,
      }"
      :model-value="countryCode"
      option-value-key="iso2"
      option-label-key="name"
      option-input-value-key="dialCode"
      :max-list-width="250"
      :disabled="disabled"
      :color="color"
      :size="size"
      :list-position="listPosition"
      :options="countryOptions"
      :error="error || (!!formattedNumber && !countryCode)"
      :hint="
        !!formattedNumber && !countryCode ? t.countrySelector.error : undefined
      "
      :label="t.countrySelector.placeholder"
      @update:model-value="setCountryCode($event as CountryCode, true)"
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
      @update:model-value="buildResults($event)"
      @keydown="onKeydown($event)"
    />
  </div>
</template>

<script lang="ts">
  export type { Color, Size, Position } from './types'
</script>

<script lang="ts" setup>
  // NEXT: listPosition
  // import { getCountryCallingCode } from 'libphonenumber-js'
  import type { CountryCode } from 'libphonenumber-js'

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

  import locales from './MazPhoneNumberInput/constantes/locales'

  import type { Result, Translations } from './MazPhoneNumberInput/types'

  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onBeforeMount,
    onMounted,
    type PropType,
    ref,
    watch,
  } from 'vue'

  import MazInput from './MazInput.vue'
  import MazSelect from './MazSelect.vue'
  import type { Color, Position, Size } from './types'

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
      type: String as PropType<CountryCode>,
      default: undefined,
      validator: (code: CountryCode) => {
        return isCountryAvailable(code)
      },
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
        return [
          'top',
          'top right',
          'top left',
          'bottom',
          'bottom right',
          'bottom left',
        ].includes(value)
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

  const results = ref<Partial<Result>>({})
  const countryCode = ref<CountryCode>()
  const formattedNumber = ref<string>()
  const cursorPosition = ref<number | null>()
  const examplesFileLoaded = ref(false)
  const inputFocused = ref(false)
  const lastKeyPressed = ref<KeyboardEvent['key']>()
  const CountrySelector = ref<ComponentPublicInstance>()
  const PhoneNumberInput = ref<ComponentPublicInstance>()

  onBeforeMount(async () => {
    countryCode.value = props.defaultCountryCode
    formattedNumber.value = props.defaultPhoneNumber

    try {
      if (!props.noExample && !examplesFileLoaded.value) {
        await loadPhoneNumberExamplesFile()
        examplesFileLoaded.value = true
      }
    } catch (err) {
      throw new Error(
        '[MazPhoneNumberInput] while loading phone number examples file',
      )
    }
  })

  onMounted(async () => {
    try {
      if (!props.defaultPhoneNumber && props.modelValue) {
        buildResults(props.modelValue)
      }

      if (props.defaultCountryCode && props.fetchCountry) {
        throw new Error(
          "[MazPhoneNumberInput] Do not use 'fetch-country' and 'default-country-code' options in the same time",
        )
      }
      if (props.defaultCountryCode && props.noUseBrowserLocale) {
        throw new Error(
          "[MazPhoneNumberInput] If you use a 'default-country-code', do not use 'no-use-browser-locale' options",
        )
      }

      if (!props.defaultCountryCode) {
        const locale = props.fetchCountry
          ? await fetchCountryCode()
          : props.noUseBrowserLocale
          ? undefined
          : browserLocale()

        if (locale) {
          setCountryCode(locale as CountryCode)
        }
      }
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (mounted) ${err}`)
    }
  })

  const countries = computed(() => getCountriesList(props.customCountriesList))

  const t = computed(() => ({
    ...locales,
    ...props.translations,
  }))

  // const callingCode = computed(() => {
  //   try {
  //     const getDialCode = (code: CountryCode) => {
  //       const result = countriesSorted.value?.find(
  //         (country) => country?.iso2 === code,
  //       )
  //       return result ? result.dialCode : undefined
  //     }

  //     return countryCode.value
  //       ? `+${
  //           getDialCode(countryCode.value) ||
  //           getCountryCallingCode(countryCode.value)
  //         }`
  //       : undefined
  //   } catch (err) {
  //     throw new Error(`[MazPhoneNumberInput] (callingCode) ${err}`)
  //   }
  // })

  const isValid = computed(() => {
    return results.value?.isValid
  })

  const countriesList = computed(() => {
    return countries.value?.filter(
      (item) => !props.ignoredCountries?.includes(item.iso2),
    )
  })

  const countriesFiltered = computed(() => {
    const countries = props.onlyCountries || props.preferredCountries
    return countries?.map((country) =>
      countriesList.value?.find((item) => item.iso2.includes(country)),
    )
  })

  const otherCountries = computed(() => {
    return countriesList.value?.filter(
      (item) => !props.preferredCountries?.includes(item.iso2),
    )
  })

  const countriesSorted = computed(() => {
    return props.preferredCountries
      ? [
          ...(countriesFiltered.value ? countriesFiltered.value : []),
          ...(otherCountries.value ? otherCountries.value : []),
        ]
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
    () => props.defaultPhoneNumber,
    (phoneNumber, oldPhoneNumber) => {
      if (phoneNumber === oldPhoneNumber) {
        return
      }
      buildResults(phoneNumber)
    },
  )

  watch(
    () => props.defaultCountryCode,
    (countryCode, oldCountryCode) => {
      if (!countryCode || countryCode === oldCountryCode) {
        return
      }
      buildResults(countryCode)
    },
  )

  const onKeydown = (event: KeyboardEvent) => {
    lastKeyPressed.value = event.key

    const target = event.target as HTMLInputElement | undefined

    cursorPosition.value = target?.selectionStart
  }

  const getPhoneNumberExample = () => {
    try {
      const phoneNumber = countryCode.value
        ? getExamplePhoneNumber(countryCode.value)
        : undefined
      return phoneNumber ? phoneNumber.formatNational() : undefined
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (getPhoneNumberExample) ${err}`)
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

    const lastCharacOfPhoneNumber = phoneNumber
      ? phoneNumber.trim().substring(-1)
      : false
    const lastCharIsParanthese = lastCharacOfPhoneNumber === ')'

    if (backSpacePressed && lastCharIsParanthese) {
      phoneNumber = phoneNumber?.trim().slice(0, -2)
    }

    return phoneNumber
  }

  const buildResults = (
    phoneNumber?: string,
    noAutoUpdateCountryCode?: boolean,
  ) => {
    try {
      formattedNumber.value = sanitizeNumber(phoneNumber)

      results.value = getResultsFromPhoneNumber(
        countryCode.value,
        formattedNumber.value,
      )

      const { isValid, e164 } = results.value

      const hasDeletedCharac =
        formattedNumber.value &&
        phoneNumber &&
        formattedNumber.value?.length > phoneNumber?.length

      const cursorIsAtEnd =
        phoneNumber && cursorPosition.value
          ? cursorPosition.value + 1 >= phoneNumber.length
          : true

      const shouldUseAsYoutType =
        (!hasDeletedCharac && cursorIsAtEnd) || isValid

      if (countryCode.value) {
        const isFullNumber = formattedNumber.value?.includes('+')

        formattedNumber.value =
          results.value.formatNational && isFullNumber
            ? results.value.formatNational
            : shouldUseAsYoutType
            ? getAsYouTypeFormat(countryCode.value, formattedNumber.value)
            : formattedNumber.value
      }

      if (!noAutoUpdateCountryCode) {
        autoUpdateCountryCodeFromPhoneNumber()
      }

      // sent when the user tape
      // @arg Object with all parsed values
      emits('update', results.value)

      const valueToEmit = isValid ? e164 : formattedNumber.value
      if (!valueToEmit && valueToEmit === props.modelValue) {
        return
      }

      // sent when the user tape
      // @arg Phone number value formatted in e164 format (international format)
      emits('update:model-value', valueToEmit)
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (buildResults) ${err}`)
    }
  }

  const onBlur = () => {
    inputFocused.value = true

    if (countryCode.value) {
      formattedNumber.value = getAsYouTypeFormat(
        countryCode.value,
        formattedNumber.value,
      )
    }
  }

  const setCountryCode = (
    selectedCountryCode: CountryCode,
    autoFocusInput = false,
  ) => {
    try {
      const countryAvailable = isCountryAvailable(selectedCountryCode)

      if (autoFocusInput) {
        focusPhoneNumberInput()
        if (formattedNumber.value && formattedNumber.value.includes('+')) {
          formattedNumber.value = undefined
        }
      }

      if (countryAvailable) {
        countryCode.value = selectedCountryCode
        emits('country-code', selectedCountryCode)
        buildResults(formattedNumber.value, true)
      }
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (setCountryCode) ${err}`)
    }
  }

  const focusCountrySelector = async () => {
    try {
      await nextTick()
      CountrySelector.value?.$el.querySelector('input')?.focus()
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (focusCountrySelector) ${err}`)
    }
  }

  const focusPhoneNumberInput = async () => {
    try {
      await nextTick()
      PhoneNumberInput.value?.$el.querySelector('input')?.focus()
    } catch (err) {
      throw new Error(`[MazPhoneNumberInput] (focusPhoneNumberInput) ${err}`)
    }
  }
</script>

<style lang="postcss" scoped>
  @import './MazPhoneNumberInput/css/flags.css';

  .m-phone-number-input {
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
        @apply maz-px-1 maz-py-1 maz-text-sm;
      }

      &:not(.--no-country-code) {
        &:deep(.m-input-wrapper) {
          @apply maz-rounded-r-none;
        }
      }
    }

    &:not(.--no-flags) {
      & .m-phone-number-input__select:deep(.m-input-wrapper) input {
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
