<template>
  <MazInput
    :id="`phone-number-${id}`"
    ref="PhoneInputRef"
    :model-value="modelValue"
    v-bind="$attrs"
    :label="inputLabel"
    :disabled
    :color
    :error
    :size
    :success
    type="tel"
    inputmode="tel"
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
    @update:model-value="($event) => onValueChange($event as string)"
  />
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, type ComponentPublicInstance, nextTick } from 'vue'
  import MazInput from '../MazInput.vue'

  import type { Color, InjectedData, Size, Translations } from '../MazPhoneNumberInput.vue'
  import { useLibphonenumber } from './use-libphonenumber'
  import { type Examples } from 'libphonenumber-js'
  import { injectStrict } from '../../modules/helpers/inject-strict'

  const props = withDefaults(
    defineProps<{
      id: string
      color: Color
      size: Size
      locales: Translations
      label?: string
      noExample?: boolean
      disabled?: boolean
      hasRadius?: boolean
      success?: boolean
      error?: boolean
      autoFormat?: boolean
      noFormattingAsYouType?: boolean
    }>(),
    {
      class: undefined,
      style: undefined,
      label: undefined,
    },
  )

  const emits = defineEmits<{
    'update:model-value': [phoneNumber?: string]
  }>()

  const modelValue = defineModel<string>()

  const { getPhoneNumberExamplesFile, getPhoneNumberExample } = useLibphonenumber()

  const { selectionRange, results, selectedCountry } = injectStrict<InjectedData>('data')

  const examples = ref<Examples>()

  const inputFocused = ref(false)

  const inputLabel = computed(() => {
    if (props.label) {
      return props.label
    }

    const defaultPlaceholder = props.locales.phoneInput.placeholder

    if (props.noExample || !examples.value) {
      return defaultPlaceholder
    } else {
      const example = getPhoneNumberExample(examples.value, selectedCountry.value)
      return results.value?.isValid || !example
        ? defaultPlaceholder
        : `${props.locales.phoneInput.example} ${example}`
    }
  })

  const PhoneInputRef = ref<ComponentPublicInstance>()

  async function loadExamples() {
    try {
      if (examples.value) return

      examples.value = await getPhoneNumberExamplesFile()
    } catch (error) {
      console.error('[maz-ui](MazPhoneNumberInput) while loading phone number examples file', error)
    }
  }

  async function onValueChange(value?: string) {
    if (PhoneInputRef.value && value) {
      saveCursorPosition(PhoneInputRef.value, value)
    }
    await nextTick()
    emits('update:model-value', value)
  }

  function saveCursorPosition(PhoneInputRef: ComponentPublicInstance, currentPhoneNumber?: string) {
    const input = PhoneInputRef.$el.querySelector('input') as HTMLInputElement | undefined
    selectionRange.value.start = input?.selectionStart
    selectionRange.value.end = input?.selectionEnd
    selectionRange.value.cursorAtEnd =
      currentPhoneNumber &&
      typeof selectionRange.value.start === 'number' &&
      currentPhoneNumber.length > 0
        ? selectionRange.value.start >= currentPhoneNumber.length
        : true
  }

  onMounted(() => {
    if (!props.noExample) {
      loadExamples()
    }
  })
</script>

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
