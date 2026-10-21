<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { MazTrash } from '@maz-ui/icons/raw/MazTrash'
import { truthyFilter } from '@maz-ui/utils/helpers/truthyFilter'
import { computed, ref } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import MazBtn from './MazBtn.vue'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  modelValue,
  disabled = false,
  error = false,
  success = false,
  warning = false,
  color = 'primary',
  addTagsOnBlur = true,
} = defineProps<MazInputTagsProps>()

const emits = defineEmits<{
  'update:model-value': [value?: (string | number)[]]
}>()

const { size } = useGlobalConfig<{ size: MazSize }>('MazInputTags', { size: 'md' })

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
  modelValue?.map((tag: string | number) => {
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
      value => !modelValue?.filter(truthyFilter)?.includes(value),
    )
    emits(
      'update:model-value',
      modelValue ? [...modelValue, ...newValues] : [...newValues],
    )
    inputValue.value = undefined
  }
}

const borderStyle = computed(() => {
  if (error)
    return 'maz:border-destructive'
  if (success)
    return 'maz:border-success'
  if (warning)
    return 'maz:border-warning'

  if (isFocused.value) {
    if (color === 'primary')
      return 'maz:border-primary'
    if (color === 'secondary')
      return 'maz:border-secondary'
    if (color === 'info')
      return 'maz:border-info'
    if (color === 'destructive')
      return 'maz:border-destructive'
    if (color === 'success')
      return 'maz:border-success'
    if (color === 'warning')
      return 'maz:border-warning'
  }

  return ''
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
    lastIdToDelete.value = tags.value?.at(-1)?.id
    currentDeleteTimeout.value = setTimeout(() => {
      lastIdToDelete.value = undefined
    }, 2000)
  }
}

function removeTag(id: string) {
  const tagsArray = tags.value?.filter(tag => tag.id !== id).map(tag => tag.tag)
  emits('update:model-value', tagsArray)
}

const SIZE_CLASS = {
  xl: 'maz:min-h-16',
  lg: 'maz:min-h-14',
  md: 'maz:min-h-12',
  sm: 'maz:min-h-10',
  xs: 'maz:min-h-8',
  mini: 'maz:min-h-6',
} as const

const buttonSize = computed(() => {
  if (size.value === 'mini')
    return 'mini'
  if (size.value === 'xs')
    return 'mini'
  if (size.value === 'sm')
    return 'xs'
  if (size.value === 'md')
    return 'sm'
  if (size.value === 'lg')
    return 'md'
  if (size.value === 'xl')
    return 'lg'

  return size.value
})
</script>

<template>
  <div
    class="m-input-tags m-reset-css maz:relative maz:inline-flex maz:flex-wrap maz:gap-1 maz:overflow-hidden maz:rounded-md maz:border maz:border-divider maz:bg-input maz:px-[0.5em] maz:py-[0.25em] maz:align-top maz:transition-colors maz:duration-200 maz:ease-in-out maz:dark:border-divider-400"
    :class="[borderStyle, `--${color}`, `--${size}`, SIZE_CLASS[size], classProp, { '--block': block, 'maz:w-full': block }]"
    :style
    @focus.capture="isFocused = true"
    @blur.capture="isFocused = false"
  >
    <TransitionGroup name="maz-tags">
      <div v-for="({ tag, id }, i) in tags" :key="`tag-${i}`" class="m-input-tags__wrapper maz:inline-flex maz:h-auto maz:flex-none! maz:flex-center">
        <MazBtn
          class="m-input-tags__tag"
          :disabled
          :size="buttonSize"
          :color="tagsHoveredId === id || lastIdToDelete === id ? 'destructive' : color"
          :end-icon="tagsHoveredId === id || lastIdToDelete === id ? MazTrash : undefined"
          @click.stop="removeTag(id)"
          @mouseenter="tagsHoveredId = disabled ? undefined : id"
          @focus="tagsHoveredId = disabled ? undefined : id"
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
      :top-label="undefined"
      :assistive-text="undefined"
      :color
      :block
      :size
      input-classes="maz:w-full"
      :border="false"
      class="m-input-tags__input maz:h-auto! maz:flex-1"
      @keydown.enter="addTags"
      @keydown.delete="removeLastTag"
      @blur="addTagsOnBlur ? addTags($event) : undefined"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-input-tags__input {
  &:deep(.m-input-wrapper) {
    @apply maz:border-none maz:bg-transparent!;

    min-inline-size: 7.5em;
  }

  &:deep(.m-input-label) {
    @apply maz:inset-s-2!;
  }

  &:deep(input) {
    padding-inline: 0.4em;
  }
}
</style>
