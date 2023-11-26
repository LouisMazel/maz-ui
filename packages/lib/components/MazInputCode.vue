<template>
  <fieldset
    class="m-input-code"
    :class="[size ? `--${size}` : undefined]"
    :disabled="disabled"
    :style="style"
  >
    <div v-for="item in codeLength" :key="item" class="input-wrapper" :class="borderColorState">
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <input
        :ref="
          (el) => {
            inputList[item - 1] = el as HTMLInputElement
          }
        "
        type="text"
        minlength="1"
        maxlength="1"
        :inputmode="acceptAlpha ? 'text' : 'numeric'"
        :pattern="acceptAlpha ? '[a-zA-Z0-9]{1}' : '[0-9]{1}'"
        autocomplete="do-not-autofill"
        :required="required"
        v-bind="$attrs"
        :value="inputValues.get(item)"
        @input="handleNewValue($event, item)"
        @keydown="handleKeydown($event, item)"
        @paste="setValueOnPaste"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
  import { computed, type PropType, ref, watch, type HTMLAttributes } from 'vue'
  import type { Color } from './types'
  export type { Color } from './types'

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
    /** Is v-model */
    modelValue: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    /** Choose the length of the code */
    codeLength: { type: Number, default: 4 },
    /** Is the returned type (number works only when accept-alpha is not enable) */
    type: {
      type: String as PropType<'text' | 'number'>,
      default: 'text',
    },
    /** Turn it to true to accept alpha charac */
    acceptAlpha: { type: Boolean, default: false },
    /** make inputs required */
    required: { type: Boolean, default: false },
    /** make inputs required */
    disabled: { type: Boolean, default: false },
    /** When is `true` the input has the error style (danger color) */
    error: { type: Boolean, default: false },
    /** When is `true` the input has the success style (success color) */
    success: { type: Boolean, default: false },
    /** When is `true` the input has the warning style (warning color) */
    warning: { type: Boolean, default: false },
    /** Predefined size of component */
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md',
    },
    /** Color of component */
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
  })

  const emits = defineEmits([
    /**
     * update the model
     */
    'update:model-value',
    /**
     * Emitted when all inputs are set.
     */
    'completed',
  ])

  const inputList = ref<HTMLInputElement[]>([])
  const localMap = ref<Map<number, string | undefined>>(new Map())

  watch(
    () => props.modelValue,
    (value, oldValue) => {
      if (value !== oldValue) {
        localMap.value = getMapValues()
      }
    },
    { immediate: true },
  )

  const inputValues = computed({
    get: () => localMap.value,
    set: (value) => {
      const emittedValue = getEmittedValue(value)
      emits('update:model-value', emittedValue)

      if (emittedValue?.toString().length === props.codeLength) {
        emits('completed')
      }
    },
  })

  function getMapValues(value = props.modelValue) {
    const map = new Map<number, string | undefined>()

    for (const item of Array.from({ length: props.codeLength }, (_, i) => i)) {
      if (value === undefined) {
        map.set(item + 1, undefined)
      } else {
        const values = [...value.toString()]

        map.set(item + 1, values[item])
      }
    }

    return map
  }

  function handleNewValue(event: Event, item: number) {
    const newValue = getValueSanitized((event.target as HTMLInputElement)?.value)

    inputValues.value = localMap.value.set(item, newValue)

    if (newValue) {
      focusAndSelectInputByIndex(item)
    }
  }

  function getEmittedValue(map: ReturnType<typeof getMapValues>) {
    const stringValue = [...map.values()].join('')

    return props.type === 'text'
      ? stringValue
      : stringValue && !Number.isNaN(Number(stringValue))
        ? Number(stringValue)
        : undefined
  }

  function getValueSanitized(value: string) {
    return (props.acceptAlpha ? value.match(/^[\w.]$/i) : value.match(/\d+/g))?.toString()
  }

  function handleKeydown(event: KeyboardEvent, inputIndex: number) {
    const currentInputValue = localMap.value.get(inputIndex)

    if (event.key === 'Backspace' && !currentInputValue) {
      const previousInputIndexToFocus = inputIndex - 1 < 0 ? 0 : inputIndex - 1

      inputValues.value = localMap.value.set(previousInputIndexToFocus, undefined)

      focusAndSelectInputByIndex(previousInputIndexToFocus - 1)
    }
  }

  function setValueOnPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text')

    if (!pasteData) {
      return
    }

    const indexInputsFromPastePlace = Array.from({ length: props.codeLength }, (_, i) => ({
      index: i + 1,
      value: ([...pasteData.toString()][i] ?? undefined) as string | undefined,
    }))

    for (const { index, value } of indexInputsFromPastePlace) {
      const sanitizedValue = value ? getValueSanitized(value) : undefined
      if (sanitizedValue) {
        localMap.value.set(index, sanitizedValue)
      }
    }

    setTimeout(() => {
      const lastInputWithoutValueIndex = getLastInputWithoutValueIndex()
      const lastIndex =
        lastInputWithoutValueIndex >= props.codeLength
          ? props.codeLength - 1
          : lastInputWithoutValueIndex
      focusAndSelectInputByIndex(lastIndex, false)
    }, 0)
  }

  function getLastInputWithoutValueIndex() {
    return [...localMap.value.values()].filter(Boolean).length
  }

  function focusAndSelectInputByIndex(index: number, selectValue = true) {
    setTimeout(() => {
      const input = inputList.value[index]

      if (index + 1 > props.codeLength || !input) {
        return
      }

      input.focus()
      if (selectValue) {
        input.select()
      }
    }, 0)
  }

  const borderColorState = computed(() => {
    if (props.error) return '!maz-border-danger'
    if (props.success) return '!maz-border-success'
    if (props.warning) return '!maz-border-warning'

    return ''
  })

  const borderColor = computed(() => {
    return `var(--maz-color-${props.color})`
  })
</script>

<style lang="postcss" scoped>
  .m-input-code {
    @apply maz-flex maz-gap-[1em];

    &.--mini {
      @apply maz-text-[0.625rem];

      line-height: 1rem;
    }

    &.--xs {
      @apply maz-text-xs;
    }

    &.--sm {
      @apply maz-text-sm;
    }

    &.--lg {
      @apply maz-text-lg;
    }

    &.--xl {
      @apply maz-text-xl;
    }

    .input-wrapper {
      @apply maz-relative maz-h-[4em] maz-w-[4em] maz-overflow-hidden maz-rounded maz-border maz-border-solid maz-border-gray-200 maz-transition-colors maz-duration-200 maz-ease-in-out dark:maz-border-color-lighter dark:maz-bg-color-light;

      &:focus-within {
        @apply maz-outline-none;

        border-color: v-bind('borderColor');
      }

      input {
        @apply maz-h-full maz-w-full maz-bg-transparent maz-text-center maz-text-[1.5em] maz-outline-none;
      }

      &:has(input:disabled) {
        @apply maz-bg-color-lighter maz-text-muted;

        input {
          @apply maz-cursor-not-allowed maz-text-muted;
        }
      }
    }
  }
</style>
