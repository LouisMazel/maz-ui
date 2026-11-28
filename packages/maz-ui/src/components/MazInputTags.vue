<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { useFieldTopLabel, useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { ROUNDED_SIZE_CLASS, SIZE_TEXT_CLASS } from './constants.ts'
import MazBadge from './MazBadge.vue'
import { getFieldFocusColor } from './MazField/useFieldState.ts'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style,
  id,
  modelValue,
  placeholder,
  label,
  topLabel,
  assistiveText,
  hint,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  color = 'primary',
  block,
  addTagsOnBlur = true,
  animated = true,
} = defineProps<MazInputTagsProps>()

const emits = defineEmits<{
  /**
   * The tags are added or removed
   * @property {(string | number)[]} value - the new tags
   */
  'update:model-value': [value?: (string | number)[]]
}>()

export interface MazInputTagsProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the input */
  id?: string
  /** @model The modelValue of the input */
  modelValue?: (string | number)[]
  /** The placeholder of the input */
  placeholder?: string
  /** The label of the input: its accessible name, and its placeholder without `placeholder` */
  label?: string
  /** Static label displayed above the field */
  topLabel?: string
  /** Text displayed below the field (help, error message) */
  assistiveText?: string
  /** Disable the input */
  disabled?: boolean
  /** Display the input with error style */
  error?: boolean
  /** Display the input with success style */
  success?: boolean
  /** Display the input with warning style */
  warning?: boolean
  /**
   * The size of the input, the same heights as `MazInput`
   * @default 'md'
   */
  size?: MazSize
  /**
   * The rounded size of the field
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * The color of the focused field and of the tags
   * @default 'primary'
   */
  color?: MazColor
  /** The input will be displayed in full width */
  block?: boolean
  /**
   * Add the typed text as tags when the input is blurred
   * @default true
   */
  addTagsOnBlur?: boolean
  /** The hint text displayed in place of the label */
  hint?: string
  /**
   * Animate the tags that enter and leave (the others glide) and the shake of a refused duplicate
   * @default true
   */
  animated?: boolean
}

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: MazRoundedSize }>('MazInputTags', {
  size: 'md',
  roundedSize: 'md',
})

const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazInputTags',
  providedId: id,
})

const inputRef = useTemplateRef('input')
const fieldRef = useTemplateRef<HTMLElement>('field')

const { shouldReduceMotion } = useReducedMotion()
const motionEnabled = computed(() => animated && !shouldReduceMotion.value)

/** A leaving tag is taken out of the flow where it stands, so the others glide to their new place */
function pinLeavingTag(element: Element) {
  const tag = element as HTMLElement

  tag.style.width = `${tag.offsetWidth}px`
  tag.style.height = `${tag.offsetHeight}px`
  tag.style.left = `${tag.offsetLeft}px`
  tag.style.top = `${tag.offsetTop}px`
}

const inputValue = ref('')
const tagToDelete = ref<string | number>()
let deleteTimeout: ReturnType<typeof setTimeout> | undefined

const tags = computed(() => modelValue ?? [])

const SHAKE_DURATION = 300
const SHAKE_KEYFRAMES = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-4px)', offset: 0.2 },
  { transform: 'translateX(3px)', offset: 0.4 },
  { transform: 'translateX(-2px)', offset: 0.6 },
  { transform: 'translateX(1px)', offset: 0.8 },
  { transform: 'translateX(0)' },
]
const shakes = new Map<Element, Animation>()

function shakeTwin(tag: string | number) {
  const element = fieldRef.value?.querySelectorAll('.m-input-tags__tag')[tags.value.indexOf(tag)]

  if (!motionEnabled.value || !element || typeof element.animate !== 'function')
    return

  shakes.get(element)?.cancel()
  shakes.set(element, element.animate(SHAKE_KEYFRAMES, { duration: SHAKE_DURATION, easing: 'cubic-bezier(0.36, 0.07, 0.19, 0.97)' }))
}

onBeforeUnmount(() => {
  clearTimeout(deleteTimeout)
  for (const shake of shakes.values())
    shake.cancel()
  shakes.clear()
})

const { labelOnTop, topLabelText } = useFieldTopLabel(() => ({ label, topLabel }))

/** No floating label in a field of tags: the label is the placeholder of the input, unless it is shown above the field */
const inputPlaceholder = computed(() => placeholder || hint || (labelOnTop.value ? undefined : label))

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

const stateTextClass = computed(() => {
  if (error)
    return 'maz:text-destructive-600!'
  if (success)
    return 'maz:text-success-600!'
  if (warning)
    return 'maz:text-warning-600!'
  return undefined
})

const fieldState = computed(() => (error ? 'error' : success ? 'success' : warning ? 'warning' : undefined))

const borderClass = computed(() => {
  if (error)
    return 'maz:border-destructive'
  if (success)
    return 'maz:border-success'
  if (warning)
    return 'maz:border-warning'
  return 'maz:border-divider maz:dark:border-divider-400'
})

function clearTagToDelete() {
  clearTimeout(deleteTimeout)
  tagToDelete.value = undefined
}

function addTags(event?: Event) {
  const values = inputValue.value.split(',').map(value => value.trim()).filter(Boolean)
  inputValue.value = ''

  if (!values.length)
    return

  event?.preventDefault()
  clearTagToDelete()

  const newTags = values.filter((value, index) => !tags.value.includes(value) && values.indexOf(value) === index)

  for (const value of values.filter(value => tags.value.includes(value)))
    shakeTwin(value)

  if (newTags.length) {
    emits('update:model-value', [
      ...tags.value,
      ...newTags,
    ])
  }
}

function removeTag(tag: string | number) {
  clearTagToDelete()
  emits('update:model-value', tags.value.filter(item => item !== tag))
}

/** A first Backspace marks the last tag, a second one removes it */
function onBackspace() {
  const lastTag = tags.value.at(-1)

  if (inputValue.value || lastTag === undefined)
    return

  if (tagToDelete.value === lastTag) {
    removeTag(lastTag)
    return
  }

  clearTagToDelete()
  tagToDelete.value = lastTag
  deleteTimeout = setTimeout(clearTagToDelete, 2000)
}

function onKeydown(event: KeyboardEvent) {
  if (event.isComposing)
    return

  if (event.key === 'Enter' || event.key === ',') {
    if (event.key === ',')
      event.preventDefault()
    addTags(event)
  }
  else if (event.key === 'Backspace' || event.key === 'Delete') {
    onBackspace()
  }
  else {
    clearTagToDelete()
  }
}

function onBlur(event: FocusEvent) {
  clearTagToDelete()

  if (addTagsOnBlur)
    addTags(event)
}

function focusInput() {
  if (!disabled)
    inputRef.value?.focus()
}
</script>

<template>
  <div
    class="m-input-tags m-reset-css maz:inline-flex maz:flex-col maz:align-top maz:text-foreground"
    :class="[
      `--${color}`,
      `--${size}`,
      SIZE_TEXT_CLASS[size],
      classProp,
      { '--block': block, 'maz:w-full': block, '--disabled': disabled, '--has-state': error || success || warning },
    ]"
    :style
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabelText"
      :for="instanceId"
      class="m-input-tags__top-label maz:mb-2"
      :class="stateTextClass"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
    >
      {{ topLabelText }}
    </label>

    <!-- The click only moves the focus to the input, which has the keyboard interactions -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div
      ref="field"
      class="m-input-tags__field maz:relative maz:flex maz:w-full maz:flex-wrap maz:items-center maz:gap-1 maz:border maz:border-solid maz:field-focus maz:bg-input"
      :class="[borderClass, ROUNDED_CLASS[roundedSize]]" :style="{ '--m-field-color': getFieldFocusColor(color, fieldState) }"
      @click="focusInput"
    >
      <TransitionGroup name="m-tags" :css="motionEnabled" @before-leave="pinLeavingTag">
        <MazBadge
          v-for="tag in tags"
          :key="tag"
          class="m-input-tags__tag"
          :color="tagToDelete === tag ? 'destructive' : color"
          :size
          :removable="!disabled"
          :remove-label="`${t('aria.remove')} ${tag}`"
          variant="soft"
          @remove="removeTag(tag)"
        >
          {{ tag }}
        </MazBadge>
      </TransitionGroup>

      <input
        :id="instanceId"
        ref="input"
        v-model="inputValue"
        v-bind="$attrs"
        class="m-input-tags__input"
        type="text"
        :placeholder="inputPlaceholder"
        :aria-label="label || placeholder"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="assistiveText ? `${instanceId}-assistive-text` : undefined"
        :disabled
        @keydown="onKeydown"
        @blur="onBlur"
      >
    </div>

    <div
      v-if="assistiveText"
      :id="`${instanceId}-assistive-text`"
      class="m-input-tags__assistive-text maz:mt-1 maz:text-body-sm"
      :class="stateTextClass || 'maz:text-muted'"
    >
      {{ assistiveText }}
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

/* One line of the field has the height of MazInput: the tags and the input share its inner line */
.m-input-tags {
  --m-input-tags-height: var(--maz-control-height-md, 3rem);
  --m-input-tags-padding: 0.375rem;

  &.--xl {
    --m-input-tags-height: var(--maz-control-height-xl, 4rem);
    --m-input-tags-padding: 0.5rem;
  }

  &.--lg {
    --m-input-tags-height: var(--maz-control-height-lg, 3.5rem);
    --m-input-tags-padding: 0.4375rem;
  }

  &.--sm {
    --m-input-tags-height: var(--maz-control-height-sm, 2.5rem);
    --m-input-tags-padding: 0.3125rem;
  }

  &.--xs {
    --m-input-tags-height: var(--maz-control-height-xs, 2rem);
    --m-input-tags-padding: 0.25rem;
  }

  &.--mini {
    --m-input-tags-height: var(--maz-control-height-mini, 1.5rem);
    --m-input-tags-padding: 0.1875rem;
  }

  &.--disabled .m-input-tags__field {
    @apply maz:disabled-cursor maz:bg-surface-600 maz:text-muted maz:dark:bg-surface-300;
  }
}

.m-input-tags__field {
  --m-input-tags-inner: calc(var(--m-input-tags-height) - (var(--maz-border-width) * 2));
  --m-input-tags-line: calc(var(--m-input-tags-inner) - (var(--m-input-tags-padding) * 2));

  min-block-size: var(--m-input-tags-height);
  padding: var(--m-input-tags-padding);
  cursor: text;
}

.m-input-tags__field .m-input-tags__tag {
  @apply maz:max-w-full maz:min-w-0;

  block-size: min(var(--m-input-tags-line), 2em);
  padding-block: 0;
  line-height: 1;
}

.m-input-tags__input {
  @apply maz:m-0 maz:min-w-16 maz:flex-1 maz:appearance-none maz:border-none maz:bg-transparent maz:text-foreground maz:shadow-none maz:outline-hidden;

  flex-basis: 6rem;
  block-size: var(--m-input-tags-line);
  padding-block: 0;
  padding-inline: 0.25rem;
  font: inherit;

  &::placeholder {
    @apply maz:text-muted;
  }

  &:disabled {
    @apply maz:disabled-cursor maz:text-muted;
  }
}

.m-tags-enter-active,
.m-tags-move {
  transition:
    transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out),
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-tags-leave-active {
  position: absolute;
  transition:
    transform calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    opacity calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.m-tags-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.m-tags-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
