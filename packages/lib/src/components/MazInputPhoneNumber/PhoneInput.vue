<script lang="ts" setup>
import type { CountryCode } from 'libphonenumber-js'
import type { ComponentPublicInstance } from 'vue'
import type { MazInputProps } from '../MazInput.vue'
import type { MazInputPhoneNumberInjectedData } from '../MazInputPhoneNumber.vue'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useInjectStrict } from '../../composables/useInjectStrict'
import MazInput from '../MazInput.vue'
import { useLibphonenumber } from './useLibphonenumber'
import { useMazInputPhoneNumber } from './useMazInputPhoneNumber'

type PhoneInputProps = Omit<MazInputProps, 'modelValue'> & {
  id: string
  locales: {
    placeholder: string
    example: string | undefined
  }
  example: boolean
  hasRadius: boolean
  autoFormat: 'blur' | 'typing' | 'disabled' | false
}

const { placeholder, label, example, locales, autoFormat, name, inputmode, autocomplete } = defineProps<PhoneInputProps>()

const { getPhoneNumberExample, getAsYouTypeFormat, loadExamples } = useLibphonenumber()
const { sanitizePhoneNumber } = useMazInputPhoneNumber()
const { results, selectedCountry } = useInjectStrict<MazInputPhoneNumberInjectedData>('mazInputPhoneNumberData')

const modelValue = defineModel<string | undefined | null>()

const inputFocused = ref(false)

const asYouTypeFormatted = computed(() => {
  const phoneNumberToFormat = results.value.isValid ? results.value.formatNational : modelValue.value

  return getAsYouTypeFormat(selectedCountry.value, phoneNumberToFormat) || phoneNumberToFormat
})

const displayedPhoneNumber = computed({
  get: () => (!inputFocused.value && autoFormat === 'blur') || autoFormat === 'typing' ? asYouTypeFormatted.value : modelValue.value,
  set: (value) => {
    modelValue.value = sanitizePhoneNumber(value)
  },
})

const { t } = useTranslations()
function getCountryPhoneNumberExample(selectedCountry?: CountryCode | undefined | null) {
  const example = getPhoneNumberExample(selectedCountry)
  if (!example) {
    return undefined
  }

  return locales.example
    ? locales.example.replace('{example}', example)
    : t('inputPhoneNumber.phoneInput.example', { example })
}

const inputLabelOrPlaceholder = computed(() => {
  if (label || placeholder) {
    return label || placeholder
  }

  const defaultPlaceholder = locales.placeholder

  if (!example || !inputFocused.value) {
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
  if (example)
    loadExamples()
})

const inputRef = useTemplateRef<ComponentPublicInstance>('input')

defineExpose({
  /**
   * Focus the input
   * @description This is used to focus the input
   */
  focus: () => {
    inputRef.value?.$el.querySelector('input')?.focus()
  },
})
</script>

<template>
  <MazInput
    :id
    v-bind="{ ...$attrs, ...inputProps }"
    ref="input"
    v-model="displayedPhoneNumber"
    :disabled
    :color
    :error
    :size
    :success
    block
    :name="name"
    :inputmode="inputmode"
    :autocomplete="autocomplete"
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
.m-input-phone-number {
  @apply maz-hidden;

  &.--responsive .m-phone-input {
    @apply -maz-mt-[var(--maz-border-width)] maz-flex-none mob-m:-maz-ml-[var(--maz-border-width)] mob-m:maz-mt-0 mob-m:maz-flex-auto;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-t-none mob-m:maz-rounded-l-none mob-m:maz-rounded-tr;
      }
    }
  }

  &.--row .m-phone-input {
    @apply -maz-ml-[var(--maz-border-width)] maz-flex-auto;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-l-none;
      }
    }
  }

  &.--col .m-phone-input {
    @apply -maz-mt-[var(--maz-border-width)] maz-ml-0 maz-flex-none;

    &.--border-radius {
      &:deep(.m-input-wrapper) {
        @apply maz-rounded-t-none maz-rounded-bl;
      }
    }
  }
}
</style>
