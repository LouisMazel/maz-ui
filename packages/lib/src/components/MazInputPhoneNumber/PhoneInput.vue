<script lang="ts" setup>
import type { CountryCode } from 'libphonenumber-js'
import type { MazInputPhoneNumberInjectedData } from '../MazInputPhoneNumber.vue'
import type { MazInputPhoneNumberTranslations } from './types'
import { computed, onMounted, ref } from 'vue'
import { injectStrict } from '../../helpers/injectStrict'
import MazInput, { type MazInputProps } from '../MazInput.vue'
import { useLibphonenumber } from './useLibphonenumber'
import { useMazInputPhoneNumber } from './useMazInputPhoneNumber'

type PhoneInputProps = Omit<MazInputProps, 'modelValue'> & {
  id: string
  locales: MazInputPhoneNumberTranslations
  noExample: boolean
  hasRadius: boolean
  autoFormat: boolean
}

const { placeholder, label, noExample, locales, autoFormat, name, inputmode, autocomplete } = defineProps<PhoneInputProps>()

const { getPhoneNumberExample, getAsYouTypeFormat, loadExamples } = useLibphonenumber()
const { sanitizePhoneNumber } = useMazInputPhoneNumber()
const { results, selectedCountry } = injectStrict<MazInputPhoneNumberInjectedData>('data')

const modelValue = defineModel<string | undefined | null>()

const asYouTypeFormatted = computed(() => {
  const phoneNumberToFormat = results.value.isValid ? results.value.formatNational : modelValue.value
  return getAsYouTypeFormat(selectedCountry.value, phoneNumberToFormat) || phoneNumberToFormat
})

const inputFocused = ref(false)
const displayedPhoneNumber = computed({
  get: () => !inputFocused.value && autoFormat ? asYouTypeFormatted.value : modelValue.value,
  set: (value) => {
    modelValue.value = sanitizePhoneNumber(value)
  },
})

function getCountryPhoneNumberExample(selectedCountry?: CountryCode | undefined | null) {
  const example = getPhoneNumberExample(selectedCountry)
  return example ? `${locales.phoneInput.example} ${example}` : undefined
}

const inputLabelOrPlaceholder = computed(() => {
  if (label || placeholder) {
    return label || placeholder
  }

  const defaultPlaceholder = locales.phoneInput.placeholder

  if (noExample || !inputFocused.value) {
    return defaultPlaceholder
  }
  else {
    const phoneExample = getCountryPhoneNumberExample(selectedCountry.value)
    return results.value?.isValid || !phoneExample ? defaultPlaceholder : phoneExample
  }
})

const inputProps = computed(() => {
  return placeholder
    ? { placeholder: inputLabelOrPlaceholder.value }
    : { label: inputLabelOrPlaceholder.value }
})

onMounted(() => {
  if (!noExample)
    loadExamples()
})
</script>

<template>
  <MazInput
    :id
    v-model="displayedPhoneNumber"
    v-bind="{ ...$attrs, ...inputProps }"
    :disabled
    :color
    :error
    :size
    :success
    :name
    :inputmode
    :autocomplete
    class="m-phone-input"
    :class="[
      {
        '--border-radius': hasRadius,
        '--error': error || !results.isValid,
        '--focused': inputFocused,
      },
    ]"
    @focus="inputFocused = true"
    @blur="inputFocused = false"
  />
</template>

<style lang="postcss" scoped>
.m-phone-input {
  @apply maz-min-w-52 maz-flex-1;

  &.--error,
  &.--focused {
    @apply maz-z-1;
  }
}

/** RESPONSIVE */
.m-phone-number-input {
  &.--responsive .m-phone-input {
    @apply -maz-mt-0.5 maz-flex-none mob-m:-maz-ml-0.5 mob-m:maz-mt-0 mob-m:maz-flex-auto;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-t-none mob-m:maz-rounded-l-none mob-m:maz-rounded-tr;
      }
    }
  }

  &.--row .m-phone-input {
    @apply -maz-ml-0.5;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-l-none;
      }
    }
  }

  &.--col .m-phone-input {
    @apply -maz-mt-0.5 maz-ml-0 maz-flex-none;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-t-none maz-rounded-bl;
      }
    }
  }
}
</style>
