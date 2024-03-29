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
    :class="{
      '--border-radius': hasRadius,
      '--error': error || !results.isValid,
      '--focused': inputFocused,
    }"
    @focus="inputFocused = true"
    @blur="inputFocused = false"
    @update:model-value="($event) => onValueChange($event as string)"
  />
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, type ComponentPublicInstance, nextTick } from 'vue'
  import MazInput from '../MazInput.vue'

  import type { Color, Size, Translations } from '../MazPhoneNumberInput.vue'
  import { useLibphonenumber } from './use-libphonenumber'
  import { useMazPhoneNumberInput } from './use-maz-phone-number-input'

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
    (event: 'update:model-value', phoneNumber?: string): void
  }>()

  const modelValue = defineModel<string>()

  const { loadPhoneNumberExamplesFile, getPhoneNumberExample, examples } = useLibphonenumber()
  const { selectedCountry, results, saveCursorPosition } = useMazPhoneNumberInput()

  const inputFocused = ref(false)

  const inputLabel = computed(() => {
    if (props.label) {
      return props.label
    }

    const defaultPlaceholder = props.locales.phoneInput.placeholder

    if (props.noExample || !examples.value) {
      return defaultPlaceholder
    } else {
      const example = getPhoneNumberExample(selectedCountry.value)
      return results.value?.isValid || !example
        ? defaultPlaceholder
        : `${props.locales.phoneInput.example} ${example}`
    }
  })

  const PhoneInputRef = ref<ComponentPublicInstance>()

  async function loadExamples() {
    try {
      return loadPhoneNumberExamplesFile()
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

  onMounted(() => {
    if (!props.noExample) {
      loadExamples()
    }
  })
</script>

<style lang="postcss" scoped>
  .m-phone-input {
    @apply maz-min-w-52 maz-flex-1;

    &.--border-radius:deep(.m-input-wrapper) {
      @apply maz-rounded-l-none;

      margin-left: -2px;
    }

    &.--error,
    &.--focused {
      @apply maz-z-1;
    }
  }
</style>
