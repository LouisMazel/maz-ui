<template>
  <div
    class="m-input-tags"
    :class="[borderStyle, `--${color}`]"
    @focus.capture="isFocused = true"
    @blur.capture="isFocused = false"
  >
    <TransitionGroup name="maz-tags">
      <div v-for="(tag, i) in modelValue" :key="`tag-${i}`">
        <MazBtn
          class="m-input-tags__tag"
          :disabled="disabled"
          :size="size"
          :color="color"
          @click.stop="removeTag(i)"
        >
          <template #default>
            {{ tag }}
          </template>
          <template #right-icon>
            <MazIcon name="x" size="1em" class="m-input-tags__tag__icon" />
          </template>
        </MazBtn>
      </div>
    </TransitionGroup>
    <MazInput
      key="input-tags"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      :label="label"
      :aria-label="label || placeholder"
      :error="error"
      :disabled="disabled"
      :color="color"
      :size="size"
      no-border
      class="m-input-tags__input maz-flex-1"
      @keydown.enter="addTags"
      @keydown.delete="removeLastTag"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, type PropType, computed } from 'vue'

  import MazBtn from './MazBtn.vue'
  import MazInput from './MazInput.vue'
  import MazIcon from './MazIcon.vue'
  import type { Color, Size } from './types'

  const props = defineProps({
    // Input value, can be a `Array` of `String` or `null`
    modelValue: {
      type: Array as PropType<string[] | number[]>,
      default: undefined,
    },
    // input placeholder
    placeholder: { type: String, default: undefined },
    label: { type: String, default: undefined },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the error style (red)
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    warning: { type: Boolean, default: false },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: Color) => {
        return [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
  })

  const isFocused = ref(false)
  const inputValue = ref<string>()

  const emits = defineEmits(['update:model-value'])

  const addTags = (event: KeyboardEvent) => {
    if (inputValue.value) {
      event.preventDefault()
      const values = inputValue.value
        .trim()
        .split(',')
        .map((value) => (value.trim() === ',' ? undefined : value.trim()))
        .filter(Boolean)
      emits(
        'update:model-value',
        props.modelValue ? [...props.modelValue, ...values] : [...values],
      )
      inputValue.value = undefined
    }
  }

  const borderStyle = computed(() => {
    if (props.error) return 'maz-border-danger'
    if (props.success) return 'maz-border-success'
    if (props.warning) return 'maz-border-warning'

    if (isFocused.value) {
      if (props.color === 'primary') return 'maz-border-primary'
      if (props.color === 'secondary') return 'maz-border-secondary'
      if (props.color === 'info') return 'maz-border-info'
      if (props.color === 'danger') return 'maz-border-danger'
      if (props.color === 'success') return 'maz-border-success'
      if (props.color === 'warning') return 'maz-border-warning'
      if (props.color === 'black') return 'maz-border-black'
      if (props.color === 'white') return 'maz-border-white'
    }

    return 'maz-border-color-lighter'
  })

  const removeLastTag = () => {
    if (!inputValue.value || inputValue.value === '') {
      const tagsArray = JSON.parse(JSON.stringify(props.modelValue))
      tagsArray.pop()
      emits('update:model-value', tagsArray)
    }
  }

  const removeTag = (index: number) => {
    const tagsArray = JSON.parse(JSON.stringify(props.modelValue))
    tagsArray.splice(index, 1)
    emits('update:model-value', tagsArray)
  }
</script>

<style lang="postcss" scoped>
  .m-input-tags {
    @apply maz-relative maz-flex maz-flex-wrap maz-items-center
      maz-overflow-hidden maz-rounded-lg maz-border-2 maz-bg-color;

    padding-left: 0.25em;
    padding-right: 0.25em;

    &__tag {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
      margin-right: 0.25em;
    }

    &__input {
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

  html.dark .m-input-tags {
    @apply maz-bg-color-light;
  }
</style>
