<script lang="ts" setup generic="T extends string | number">
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { SIZE_TEXT_CLASS } from './constants.ts'
import { getFieldFocusColor } from './MazField/useFieldState.ts'

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
  /**
   * Base of the ids of the inputs (`<id>-1`, `<id>-2`...), unique by default
   */
  id?: string
  /**
   * Animate the characters that rise into place, the cells that fill when the code is complete
   * and the shake of an `error`
   * @default true
   */
  animated?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  modelValue,
  codeLength = 4,
  type = 'text',
  acceptAlpha = false,
  required = false,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  size = 'md',
  color = 'primary',
  id,
  animated = true,
} = defineProps<MazInputCodeProps<T>>()

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

const { t } = useTranslations()

const instanceId = useInstanceUniqId({ componentName: 'm-input-code', providedId: id })

const { shouldReduceMotion } = useReducedMotion()

const inputList = ref<HTMLInputElement[]>([])
const codeWrapper = ref<HTMLElement>()
const localMap = ref<Map<number, string | undefined>>(new Map())

watch(
  () => modelValue,
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

    if (emittedValue?.toString().length === codeLength) {
      emits('completed')
    }
  },
})

function getMapValues(value = modelValue) {
  const map = new Map<number, string | undefined>()

  for (const item of Array.from({ length: codeLength }, (_, i) => i)) {
    if (value === undefined) {
      map.set(item + 1, undefined)
    }
    else {
      const values = [
        ...value.toString(),
      ]

      map.set(item + 1, values[item])
    }
  }

  return map
}

const RISE_DURATION = 180
const RISE_STAGGER = 30
const SHAKE_DURATION = 350
const SHAKE_KEYFRAMES = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-6px)', offset: 0.2 },
  { transform: 'translateX(5px)', offset: 0.4 },
  { transform: 'translateX(-4px)', offset: 0.6 },
  { transform: 'translateX(2px)', offset: 0.8 },
  { transform: 'translateX(0)' },
]

const animations = new Map<Element, Animation>()

function playAnimation(element: Element | undefined, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
  if (!animated || shouldReduceMotion.value || !element || typeof element.animate !== 'function')
    return

  animations.get(element)?.cancel()
  animations.set(element, element.animate(keyframes, options))
}

function riseInto(indexes: number[]) {
  nextTick(() => {
    for (const [order, index] of indexes.entries()) {
      playAnimation(
        inputList.value[index - 1],
        [
          { transform: 'translateY(40%)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        { duration: RISE_DURATION, delay: order * RISE_STAGGER, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
      )
    }
  })
}

const isComplete = computed(() => [...localMap.value.values()].filter(Boolean).length === codeLength)

watch(() => error, (hasError) => {
  if (hasError)
    playAnimation(codeWrapper.value, SHAKE_KEYFRAMES, { duration: SHAKE_DURATION, easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' })
})

onBeforeUnmount(() => {
  for (const animation of animations.values())
    animation.cancel()
  animations.clear()
})

function handleNewValue(event: Event, item: number) {
  const target = event.target as HTMLInputElement | null
  let rawValue = target?.value ?? ''
  const { inputType, data } = event as InputEvent

  // A key typed in a filled input replaces its character
  if (rawValue.length > 1 && inputType === 'insertText' && data?.length === 1) {
    rawValue = data

    if (target)
      target.value = data
  }

  // SMS autofill (`one-time-code`) or a paste puts several characters in one input
  if (rawValue.length > 1) {
    fillFromIndex(item, rawValue)
    return
  }

  const newValue = getValueSanitized(rawValue)

  inputValues.value = localMap.value.set(item, newValue)

  if (newValue) {
    riseInto([item])
    focusAndSelectInputByIndex(item)
  }
}

function getEmittedValue(map: ReturnType<typeof getMapValues>) {
  const stringValue = [
    ...map.values(),
  ].join('')

  if (type === 'text') {
    return stringValue
  }

  return stringValue && !Number.isNaN(Number(stringValue))
    ? Number(stringValue)
    : undefined
}

const isLetterOrNumberRegex = /^[\w.]$/
const isNumberRegex = /\d+/g

function getValueSanitized(value: string) {
  return (acceptAlpha
    ? value.match(isLetterOrNumberRegex)
    : value.match(isNumberRegex))?.toString()
}

function handleKeydown(event: KeyboardEvent, inputIndex: number) {
  const currentInputValue = localMap.value.get(inputIndex)

  const isRtl = globalThis.getComputedStyle(event.target as HTMLElement).direction === 'rtl'
  const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight'
  const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft'

  if (event.key === nextKey) {
    focusAndSelectInputByIndex(inputIndex)
  }

  if (event.key === previousKey) {
    focusAndSelectInputByIndex(inputIndex - 2)
  }

  if (event.key === 'Backspace' && !currentInputValue) {
    const previousInputIndexToFocus = inputIndex - 1 < 0
      ? 0
      : inputIndex - 1

    inputValues.value = localMap.value.set(previousInputIndexToFocus, undefined)

    focusAndSelectInputByIndex(previousInputIndexToFocus - 1)
  }
}

function fillFromIndex(startIndex: number, value: string) {
  const characters = [...value].map(getValueSanitized).filter(Boolean) as string[]

  const filled: number[] = []

  for (const [offset, character] of characters.entries()) {
    const index = startIndex + offset

    if (index > codeLength)
      break

    localMap.value.set(index, character)
    filled.push(index)
  }

  riseInto(filled)

  inputValues.value = localMap.value

  const nextIndex = Math.min(startIndex + characters.length, codeLength) - 1
  focusAndSelectInputByIndex(nextIndex, false)

  if (inputList.value[startIndex - 1])
    inputList.value[startIndex - 1].value = localMap.value.get(startIndex) ?? ''
}

function setValueOnPaste(event: ClipboardEvent) {
  const pasteData = event.clipboardData?.getData('text')

  if (!pasteData) {
    return
  }

  const indexInputsFromPastePlace = Array.from({ length: codeLength }, (_, i) => ({
    index: i + 1,
    value: ([
      ...pasteData.toString(),
    ][i] ?? undefined) as string | undefined,
  }))

  const pasted: number[] = []

  for (const { index, value } of indexInputsFromPastePlace) {
    const sanitizedValue = value
      ? getValueSanitized(value)
      : undefined
    if (sanitizedValue) {
      localMap.value.set(index, sanitizedValue)
      pasted.push(index)
    }
  }

  riseInto(pasted)

  setTimeout(() => {
    const lastInputWithoutValueIndex = getLastInputWithoutValueIndex()
    const lastIndex
      = lastInputWithoutValueIndex >= codeLength
        ? codeLength - 1
        : lastInputWithoutValueIndex
    focusAndSelectInputByIndex(lastIndex, false)
  }, 0)
}

function getLastInputWithoutValueIndex() {
  return [
    ...localMap.value.values(),
  ].filter(Boolean).length
}

function focusAndSelectInputByIndex(index: number, selectValue = true) {
  setTimeout(() => {
    const input = inputList.value[index]

    if (index + 1 > codeLength || !input) {
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

  if (index + 1 > codeLength || !input) {
    return
  }

  input.select()
}

const borderColorState = computed(() => {
  if (error)
    return 'maz:border-destructive!'
  if (success)
    return 'maz:border-success!'
  if (warning)
    return 'maz:border-warning!'

  return undefined
})
</script>

<template>
  <fieldset
    class="m-input-code m-reset-css maz:inline-flex maz:flex-col maz:gap-[0.5em] maz:align-top"
    :class="[size ? `--${size}` : undefined, SIZE_TEXT_CLASS[size], classProp, { '--complete': isComplete, '--static': !animated }]"
    :disabled
    :style="[style, { '--input-border-color': getFieldFocusColor(color), '--m-field-color': getFieldFocusColor(color) }]"
  >
    <div ref="codeWrapper" class="m-input-code__wrapper maz:inline-flex maz:gap-[1em]">
      <div v-for="item in codeLength" :key="item" class="input-wrapper maz:relative maz:size-[4em] maz:overflow-hidden maz:rounded-md maz:border maz:border-solid maz:field-focus maz:border-divider maz:dark:border-divider-400 maz:dark:bg-input" :class="borderColorState">
        <input
          :id="`${instanceId}-${item}`"
          :ref="
            (el) => {
              inputList[item - 1] = el as HTMLInputElement
            }
          "
          type="text"
          :name="`m-input-code-${item}`"
          :aria-label="`${t('aria.character')} ${item}`"
          minlength="1"
          :maxlength="item === 1 ? undefined : 1"
          :inputmode="acceptAlpha ? 'text' : 'numeric'"
          :pattern="acceptAlpha ? '[a-zA-Z0-9]{1}' : '[0-9]{1}'"
          :autocomplete="item === 1 ? 'one-time-code' : 'off'"
          :aria-invalid="error || undefined"
          :aria-describedby="hint ? `${instanceId}-hint` : undefined"
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
      :id="`${instanceId}-hint`"
      class="m-input-code__hint maz:text-body-sm" :class="{
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
    inline-size: calc(4em * var(--maz-density-ratio, 1));
    block-size: calc(4em * var(--maz-density-ratio, 1));

    input {
      @apply maz:h-full maz:w-full maz:bg-transparent maz:text-center maz:text-[1.5em] maz:outline-hidden maz:font-mono;
    }

    &:has(input:not(:disabled)) {
      @at-root .m-input-code.--complete & {
        border-color: var(--input-border-color);
        background-color: color-mix(in oklab, var(--input-border-color) 10%, transparent);
      }
    }

    &:has(input:disabled) {
      @apply maz:bg-surface-600 maz:dark:bg-surface-300 maz:text-muted;

      input {
        @apply maz:disabled-cursor maz:text-muted;
      }
    }
  }
}

.m-input-code.--complete .input-wrapper:nth-child(2) {
  transition-delay: calc(40ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(3) {
  transition-delay: calc(80ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(4) {
  transition-delay: calc(120ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(5) {
  transition-delay: calc(160ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(6) {
  transition-delay: calc(200ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(7) {
  transition-delay: calc(240ms * var(--maz-motion-scale, 1));
}

.m-input-code.--complete .input-wrapper:nth-child(8) {
  transition-delay: calc(280ms * var(--maz-motion-scale, 1));
}

.m-input-code.--static .input-wrapper {
  transition: none;
}
</style>
