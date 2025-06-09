<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { MazTrash } from '@maz-ui/icons'
import { computed, ref } from 'vue'
import { truthyFilter } from '../helpers/truthyFilter'
import MazBtn from './MazBtn.vue'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputTagsProps>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  placeholder: undefined,
  label: undefined,
  disabled: false,
  error: false,
  success: false,
  warning: false,
  size: 'md',
  color: 'primary',
  addTagsOnBlur: true,
})

const emits = defineEmits<{
  'update:model-value': [value?: (string | number)[]]
}>()

export interface MazInputTagsProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** @model The modelValue of the input */
  modelValue?: (string | number)[]
  /** The placeholder of the input */
  placeholder?: string
  /** The label of the input */
  label?: string
  /** Disable the input */
  disabled?: boolean
  /** Display the input with error style */
  error?: boolean
  /** Display the input with success style */
  success?: boolean
  /** Display the input with warning style */
  warning?: boolean
  /** The size of the input */
  size?: MazSize
  /** The color of the input */
  color?: MazColor
  /** The input will be displayed in full width */
  block?: boolean
  /** Add tags on blur */
  addTagsOnBlur?: boolean
  /** The hint text to display below the input. */
  hint?: string
}

const isFocused = ref(false)
const inputValue = ref<string>()
const tagsHoveredId = ref<string>()
const lastIdToDelete = ref<string>()
const currentDeleteTimeout = ref<NodeJS.Timeout>()

const tags = computed(() =>
  props.modelValue?.map((tag: string | number) => {
    return {
      tag,
      // eslint-disable-next-line sonarjs/pseudo-random
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }
  }),
)

function addTags(event: Event) {
  if (inputValue.value) {
    lastIdToDelete.value = undefined
    event.preventDefault()
    const values = inputValue.value
      .trim()
      .split(',')
      .map(value => (value.trim() === ',' ? undefined : value.trim()))
      .filter(truthyFilter)

    const newValues = values.filter(
      value => !props.modelValue?.filter(truthyFilter)?.some(tag => tag === value),
    )
    emits(
      'update:model-value',
      props.modelValue ? [...props.modelValue, ...newValues] : [...newValues],
    )
    inputValue.value = undefined
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const borderStyle = computed(() => {
  if (props.error)
    return 'maz-border-destructive'
  if (props.success)
    return 'maz-border-success'
  if (props.warning)
    return 'maz-border-warning'

  if (isFocused.value) {
    if (props.color === 'primary')
      return 'maz-border-primary'
    if (props.color === 'secondary')
      return 'maz-border-secondary'
    if (props.color === 'info')
      return 'maz-border-info'
    if (props.color === 'destructive')
      return 'maz-border-destructive'
    if (props.color === 'success')
      return 'maz-border-success'
    if (props.color === 'warning')
      return 'maz-border-warning'
  }

  return 'maz-border-divider'
})

function removeLastTag() {
  if (inputValue.value || (tags.value && tags.value?.length === 0)) {
    return
  }
  if (currentDeleteTimeout.value) {
    clearTimeout(currentDeleteTimeout.value)
  }
  if (lastIdToDelete.value) {
    removeTag(lastIdToDelete.value)
    lastIdToDelete.value = undefined
  }
  else {
    lastIdToDelete.value = tags.value?.[tags.value.length - 1]?.id
    currentDeleteTimeout.value = setTimeout(() => {
      lastIdToDelete.value = undefined
    }, 2000)
  }
}

function removeTag(id: string) {
  const tagsArray = tags.value?.filter(tag => tag.id !== id).map(tag => tag.tag)
  emits('update:model-value', tagsArray)
}

const buttonSize = computed(() => {
  if (props.size === 'mini')
    return 'mini'
  if (props.size === 'xs')
    return 'mini'
  if (props.size === 'sm')
    return 'xs'
  if (props.size === 'md')
    return 'sm'
  if (props.size === 'lg')
    return 'md'
  if (props.size === 'xl')
    return 'lg'

  return props.size
})
</script>

<template>
  <div
    class="m-input-tags m-reset-css"
    :class="[borderStyle, `--${color}`, `--${size}`, props.class, { '--block': block }]"
    :style
    @focus.capture="isFocused = true"
    @blur.capture="isFocused = false"
  >
    <TransitionGroup name="maz-tags">
      <div v-for="({ tag, id }, i) in tags" :key="`tag-${i}`" class="m-input-tags__wrapper">
        <MazBtn
          class="m-input-tags__tag"
          :disabled
          :size="buttonSize"
          :color="tagsHoveredId === id || lastIdToDelete === id ? 'destructive' : color"
          :right-icon="tagsHoveredId === id || lastIdToDelete === id ? MazTrash : undefined"
          @click.stop="removeTag(id)"
          @mouseenter="tagsHoveredId = id"
          @focus="tagsHoveredId = id"
          @mouseleave="tagsHoveredId = undefined"
          @blur="tagsHoveredId = undefined"
        >
          {{ tag }}
        </MazBtn>
      </div>
    </TransitionGroup>

    <MazInput
      key="input-tags"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder
      :label
      :aria-label="label || placeholder"
      :error
      :hint
      :success
      :warning
      :disabled
      :color
      :block
      :size
      input-classes="maz-w-full"
      :border="false"
      class="m-input-tags__input"
      @keydown.enter="addTags"
      @keydown.delete="removeLastTag"
      @blur="addTagsOnBlur ? addTags($event) : undefined"
    />
  </div>
</template>

<style lang="postcss" scoped>
.m-input-tags {
  @apply maz-relative maz-inline-flex maz-flex-wrap maz-gap-1
      maz-overflow-hidden maz-rounded maz-border maz-bg-surface maz-px-[0.5em] maz-py-[0.25em] maz-align-top maz-transition-colors maz-duration-200 maz-ease-in-out dark:maz-bg-surface-400;

  &.--xl {
    @apply maz-min-h-16;
  }

  &.--lg {
    @apply maz-min-h-14;
  }

  &.--md {
    @apply maz-min-h-12;
  }

  &.--sm {
    @apply maz-min-h-10;
  }

  &.--xs {
    @apply maz-min-h-8;
  }

  &.--mini {
    @apply maz-min-h-6;
  }

  &.--block {
    @apply maz-w-full;
  }

  &__wrapper {
    @apply maz-inline-flex maz-h-auto !maz-flex-none maz-flex-center;
  }

  &__input {
    @apply !maz-h-auto maz-flex-1;

    &:deep(.m-input-wrapper) {
      @apply maz-border-none;

      min-width: 7.5em;
    }

    &:deep(input) {
      padding-left: 0.4em;
      padding-right: 0.4em;
    }
  }
}
</style>
