<script lang="ts" setup generic="T extends string | number">
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { computed, ref, watch } from 'vue'

export type MazInputCodeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface MazInputCodeProps<T = string | number> {
  /** The style of the component. */
  style?: HTMLAttributes['style']
  /** The class of the component. */
  class?: HTMLAttributes['class']
  /** The value of the component (v-model). */
  modelValue?: T
  /** The length of the code. */
  codeLength?: number
  /** The type of the input field. */
  type?: 'text' | 'number'
  /** Whether to accept alpha characters. */
  acceptAlpha?: boolean
  /** Whether the input is required. */
  required?: boolean
  /** Whether the input is disabled. */
  disabled?: boolean
  /** Whether there is an error with the input. */
  error?: boolean
  /** Whether the input is successful. */
  success?: boolean
  /** Whether there is a warning with the input. */
  warning?: boolean
  /** The size of the component. */
  size?: MazInputCodeSize
  /** The color of the component. */
  color?: MazColor
  /** The hint text to display below the input. */
  hint?: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputCodeProps<T>>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  codeLength: 4,
  type: 'text',
  acceptAlpha: false,
  required: false,
  disabled: false,
  error: false,
  success: false,
  warning: false,
  size: 'md',
  color: 'primary',
})

const emits = defineEmits<{
  /**
   * Update the model value.
   * @param value The new value of the model.
   */
  'update:model-value': [value?: T]
  /**
   * Emitted when all inputs are set.
   */
  'completed': [value: void]
}>()

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
    emits('update:model-value', emittedValue as T)

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
    }
    else {
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

  if (props.type === 'text') {
    return stringValue
  }

  return stringValue && !Number.isNaN(Number(stringValue))
    ? Number(stringValue)
    : undefined
}

const isLetterOrNumberRegex = /^[\w.]$/
const isNumberRegex = /\d+/g

function getValueSanitized(value: string) {
  return (props.acceptAlpha ? value.match(isLetterOrNumberRegex) : value.match(isNumberRegex))?.toString()
}

function handleKeydown(event: KeyboardEvent, inputIndex: number) {
  const currentInputValue = localMap.value.get(inputIndex)

  if (event.key === 'ArrowRight') {
    focusAndSelectInputByIndex(inputIndex)
  }

  if (event.key === 'ArrowLeft') {
    focusAndSelectInputByIndex(inputIndex - 2)
  }

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
    const lastIndex
      = lastInputWithoutValueIndex >= props.codeLength
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
      selectInputByIndex(index)
    }
  }, 0)
}

function selectInputByIndex(index: number) {
  const input = inputList.value[index]

  if (index + 1 > props.codeLength || !input) {
    return
  }

  input.select()
}

const SIZE_CLASS = {
  mini: 'maz:text-[0.625rem]',
  xs: 'maz:text-xs',
  sm: 'maz:text-sm',
  md: '',
  lg: 'maz:text-lg',
  xl: 'maz:text-xl',
} as const

const borderColorState = computed(() => {
  if (props.error)
    return 'maz:border-destructive!'
  if (props.success)
    return 'maz:border-success!'
  if (props.warning)
    return 'maz:border-warning!'

  return undefined
})
</script>

<template>
  <fieldset
    class="m-input-code m-reset-css maz:inline-flex maz:flex-col maz:gap-[0.5em] maz:align-top"
    :class="[size ? `--${size}` : undefined, SIZE_CLASS[size as keyof typeof SIZE_CLASS], props.class]"
    :disabled
    :style="[style, { '--input-border-color': `var(--maz-${props.color})` }]"
  >
    <div class="m-input-code__wrapper maz:inline-flex maz:gap-[1em]">
      <div v-for="item in codeLength" :key="item" class="input-wrapper maz:relative maz:h-[4em] maz:w-[4em] maz:overflow-hidden maz:rounded-md maz:border maz:border-solid maz:border-divider maz:dark:border-divider-400 maz:transition-colors maz:duration-200 maz:ease-in-out maz:dark:bg-surface-400" :class="borderColorState">
        <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
        <input
          :id="`m-input-code-${item}`"
          :ref="
            (el) => {
              inputList[item - 1] = el as HTMLInputElement
            }
          "
          type="text"
          :name="`m-input-code-${item}`"
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
          @click="selectInputByIndex(item - 1)"
          @paste="setValueOnPaste"
        >
      </div>
    </div>
    <span
      class="m-input-code__hint maz:text-sm" :class="{
        '--error': error,
        '--success': success,
        '--warning': warning,
        'maz:text-destructive-600': error,
        'maz:text-success-600': success,
        'maz:text-warning-600': warning,
        'maz:text-muted': !error && !success && !warning,
      }"
    >{{ hint }}</span>
  </fieldset>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-input-code {
  &.--mini {
    line-height: 1rem;
  }

  .input-wrapper {
    &:focus-within {
      border-color: var(--input-border-color);
    }

    input {
      @apply maz:h-full maz:w-full maz:bg-transparent maz:text-center maz:text-[1.5em] maz:outline-hidden;
    }

    &:has(input:disabled) {
      @apply maz:bg-surface-600 maz:dark:bg-surface-300 maz:text-muted;

      input {
        @apply maz:disabled-cursor maz:text-muted;
      }
    }
  }
}
</style>
