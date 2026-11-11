<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { SIZE_TEXT_CLASS } from './constants.ts'
import MazBadge from './MazBadge.vue'

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

const isFocused = ref(false)
const inputValue = ref('')
const tagToDelete = ref<string | number>()
let deleteTimeout: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => clearTimeout(deleteTimeout))

const tags = computed(() => modelValue ?? [])

/** No floating label in a field of tags: the label is the placeholder of the input */
const inputPlaceholder = computed(() => placeholder || hint || label)

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const satisfies Record<MazRoundedSize, string>

const stateTextClass = computed(() => {
  if (error)
    return 'maz:text-destructive-600!'
  if (success)
    return 'maz:text-success-600!'
  if (warning)
    return 'maz:text-warning-600!'
  return undefined
})

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
  isFocused.value = false
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
      v-if="topLabel"
      :for="instanceId"
      class="m-input-tags__top-label maz:mb-2"
      :class="stateTextClass"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
    >
      {{ topLabel }}
    </label>

    <!-- The click only moves the focus to the input, which has the keyboard interactions -->
    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <div
      class="m-input-tags__field maz:relative maz:flex maz:w-full maz:flex-wrap maz:items-center maz:gap-1 maz:border maz:border-solid maz:bg-input maz:transition-colors maz:duration-300"
      :class="[borderClass, ROUNDED_CLASS[roundedSize], { '--focused': isFocused }]"
      @click="focusInput"
    >
      <TransitionGroup name="maz-tags">
        <MazBadge
          v-for="tag in tags"
          :key="tag"
          class="m-input-tags__tag"
          :color="tagToDelete === tag ? 'destructive' : color"
          :size
          :removable="!disabled"
          :remove-label="`${t('aria.remove')} ${tag}`"
          pastel
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
        @focus="isFocused = true"
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
  --m-input-tags-height: 3rem;
  --m-input-tags-padding: 0.375rem;
  --m-input-tags-focus: var(--maz-primary);

  &.--xl {
    --m-input-tags-height: 4rem;
    --m-input-tags-padding: 0.5rem;
  }

  &.--lg {
    --m-input-tags-height: 3.5rem;
    --m-input-tags-padding: 0.4375rem;
  }

  &.--sm {
    --m-input-tags-height: 2.5rem;
    --m-input-tags-padding: 0.3125rem;
  }

  &.--xs {
    --m-input-tags-height: 2rem;
    --m-input-tags-padding: 0.25rem;
  }

  &.--mini {
    --m-input-tags-height: 1.5rem;
    --m-input-tags-padding: 0.1875rem;
  }

  &.--secondary {
    --m-input-tags-focus: var(--maz-secondary);
  }

  &.--accent {
    --m-input-tags-focus: var(--maz-accent);
  }

  &.--info {
    --m-input-tags-focus: var(--maz-info);
  }

  &.--success {
    --m-input-tags-focus: var(--maz-success);
  }

  &.--warning {
    --m-input-tags-focus: var(--maz-warning);
  }

  &.--destructive {
    --m-input-tags-focus: var(--maz-destructive);
  }

  &.--contrast {
    --m-input-tags-focus: var(--maz-contrast);
  }

  &:not(.--has-state) .m-input-tags__field.--focused {
    border-color: var(--m-input-tags-focus);
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
</style>
