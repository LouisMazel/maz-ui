<template>
  <div
    class="m-input-tags"
    :class="[
      {
        'maz-border-primary': isFocus && !error,
        'maz-border-danger': error,
        'maz-border-gray-200': !error && !isFocus,
      },
    ]"
    :style="{ fontSize: size }"
    @focus.capture="isFocus = true"
    @blur.capture="isFocus = false"
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
            <MazIcon :src="XIcon" class="m-input-tags__tag__icon" />
          </template>
        </MazBtn>
      </div>
    </TransitionGroup>
    <MazInput
      key="input-tags"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      :aria-label="placeholder"
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
  import { ref, PropType } from 'vue'
  import MazBtn from '../ui/MazBtn.vue'
  import MazInput from './MazInput.vue'
  import MazIcon from '../ui/MazIcon.vue'
  import XIcon from '../icons/x.svg'

  const props = defineProps({
    // Input value, can be a `Array` of `String` or `null`
    modelValue: {
      type: Array as PropType<string[] | number[]>,
      default: undefined,
    },
    // input placeholder
    placeholder: { type: String, default: undefined },
    // When is `true` the input is disable
    disabled: { type: Boolean, default: false },
    // When is `true` the input has the dark theme
    dark: { type: Boolean, default: false },
    // When is `true` the input has the error style (red)
    error: { type: Boolean, default: false },
    // input size (`'em'` / `'rem'`)
    size: { type: String, default: undefined },
    // color option
    color: { type: String, default: 'primary' },
  })

  const isFocus = ref(false)
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
    maz-overflow-hidden maz-rounded-lg maz-border-2 maz-px-[0.25em];

    &__tag {
      @apply maz-my-[0.25em] maz-mr-[0.25em];

      &__icon {
        @apply maz-h-[1.25em] maz-w-[1.25em];

        margin-left: -0.25em;
      }
    }

    &__input {
      @apply maz-min-w-[7.5em];

      &:deep(input) {
        @apply maz-px-[0.4em];
      }
    }
  }
</style>
