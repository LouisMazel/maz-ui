<template>
  <div
    ref="mazSelect"
    class="m-select"
    :class="{ '--is-open': hasListOpen, '--disabled': disabled }"
    @blur.capture="closeList"
    @keydown.esc="closeList"
  >
    <MazInput
      ref="mazInput"
      class="m-select-input"
      v-bind="$attrs"
      :color="color"
      :model-value="mazInputValue"
      readonly
      :size="size"
      :disabled="disabled"
      @focus.stop="openList"
      @click.stop="openList"
      @keydown="keyboardHandler($event)"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          type="button"
          class="m-select-input__toggle-button maz-custom maz-flex maz-h-full maz-bg-transparent maz-flex-center"
          @click.stop="openList"
        >
          <MazIcon
            :src="ChevronDownIcon"
            class="m-select-chevron maz-h-5 maz-w-5 maz-text-normal"
          />
        </button>
      </template>
    </MazInput>
    <Transition :name="listTransition">
      <div
        v-if="hasListOpen || open"
        ref="optionsList"
        class="m-select-list"
        :style="{
          maxHeight: `${maxListHeight}px`,
          maxWidth: `${maxListWidth}px`,
        }"
      >
        <button
          v-for="(option, i) in options"
          :key="i"
          tabindex="-1"
          type="button"
          class="m-select-list-item maz-custom"
          :class="[
            {
              '--is-keyboard-selected': tmpModelValueIndex === i,
              '--is-selected':
                selectedOption?.[optionValueKey] === option[optionValueKey],
            },
            `--${color}`,
          ]"
          :style="{ height: `${itemHeight}px` }"
          @click.prevent.stop="updateValue(option)"
        >
          <slot
            :option="option"
            :is-selected="
              selectedOption?.[optionValueKey] === option[optionValueKey]
            "
          >
            {{ option[optionLabelKey] }}
          </slot>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
  export type MazSelectOptions = Record<string, ModelValueSimple>
  export type { Color, Size, ModelValueSimple, Position } from './types'
</script>

<script lang="ts" setup>
  // NEXT: listPosition & multiselect & search in list
  import { ref, computed, onBeforeMount, nextTick, type PropType } from 'vue'
  import MazInput from './MazInput.vue'
  import MazIcon from './MazIcon.vue'
  import type { Color, ModelValueSimple, Position, Size } from './types'
  import ChevronDownIcon from '@package/icons/chevron-down.svg'

  const props = defineProps({
    modelValue: {
      type: [Number, String, Boolean] as PropType<ModelValueSimple>,
      default: undefined,
    },
    options: { type: Array as PropType<MazSelectOptions[]>, required: true },
    optionValueKey: { type: String, default: 'value' },
    optionLabelKey: { type: String, default: 'label' },
    optionInputValueKey: { type: String, default: 'label' },
    listPosition: {
      type: String as PropType<Position>,
      default: 'bottom left',
      validator: (value: Position) => {
        return [
          'top',
          'top right',
          'top left',
          'bottom',
          'bottom right',
          'bottom left',
        ].includes(value)
      },
    },
    disabled: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: string) => {
        return [
          'primary',
          'secondary',
          'warning',
          'danger',
          'info',
          'success',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
    itemHeight: { type: Number, default: 40 },
    maxListHeight: { type: Number, default: 240 },
    maxListWidth: { type: Number, default: undefined },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
  })
  const emits = defineEmits(['close', 'open', 'update:model-value', 'blur'])

  const hasListOpen = ref(false)
  const tmpModelValueIndex = ref<number>()

  onBeforeMount(() => {
    if (selectedOption.value)
      tmpModelValueIndex.value = props.options.findIndex(
        (option) =>
          option[props.optionValueKey] ===
          selectedOption.value?.[props.optionLabelKey],
      )
  })

  const mazSelect = ref<HTMLDivElement>()
  const mazInput = ref<typeof MazInput>()
  const optionsList = ref<HTMLDivElement>()

  const selectedOption = computed(() =>
    props.options.find(
      (option) => props.modelValue === option[props.optionValueKey],
    ),
  )

  const mazInputValue = computed(
    () => selectedOption.value?.[props.optionInputValueKey],
  )

  const listTransition = computed(() =>
    props.listPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert',
  )

  const closeList = async (event?: FocusEvent | KeyboardEvent) => {
    if (
      event &&
      (('relatedTarget' in event &&
        mazSelect.value?.contains(event.relatedTarget as Node)) ||
        event.type === 'keydown')
    ) {
      return event.preventDefault()
    }

    await nextTick()
    hasListOpen.value = false
    emits('close', event)
  }

  const openList = (event?: Event) => {
    event?.preventDefault()
    if (props.disabled) return
    hasListOpen.value = true
    scrollToSelected()
    emits('open', hasListOpen.value)
  }

  const keyboardHandler = (event: KeyboardEvent) => {
    const code = event.code

    const currentIndex = tmpModelValueIndex.value

    if (code === 'ArrowUp' || code === 'ArrowDown') {
      event.preventDefault()
      if (!hasListOpen.value) openList(event)

      const optionsLength = props.options.length

      if (typeof currentIndex !== 'number') {
        return (tmpModelValueIndex.value =
          code === 'ArrowDown' ? 0 : optionsLength - 1)
      } else {
        if (currentIndex === optionsLength - 1 && code === 'ArrowDown') {
          tmpModelValueIndex.value = 0
        } else if (currentIndex === 0 && code === 'ArrowUp') {
          tmpModelValueIndex.value = optionsLength - 1
        } else {
          tmpModelValueIndex.value =
            code === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1
        }
        updateValue(props.options[tmpModelValueIndex.value], false)
      }
      scrollToSelected()
    } else if (code === 'Enter' && hasListOpen.value) {
      event.preventDefault()
      if (typeof currentIndex === 'number') {
        const newValue = props.options[currentIndex]
        if (newValue.value !== props.modelValue) updateValue(newValue)
        else {
          closeList()
        }
      }
    } else if (hasListOpen.value) {
      searching(event)
    }
  }

  const searchQuery = ref<string>('')

  const searching = ({ key, code }: KeyboardEvent) => {
    let queryTimer: ReturnType<typeof setTimeout> | undefined = undefined

    clearTimeout(queryTimer)
    queryTimer = setTimeout(() => {
      searchQuery.value = ''
    }, 2000)

    if (code === 'Backspace') {
      searchQuery.value = searchQuery.value.substring(
        0,
        searchQuery.value.length - 1,
      )
    } else if (key.match(/^[a-z0-9]+$/i) && key.length === 1) {
      searchQuery.value += key.toLowerCase()

      const resultIndex = props.options.findIndex((option) => {
        if (typeof option[props.optionLabelKey] === 'string') {
          const label = option[props.optionLabelKey] as string

          return label.toLowerCase().startsWith(searchQuery.value)
        }
      })

      tmpModelValueIndex.value = resultIndex
      scrollToSelected()
    }
  }

  const scrollToSelected = async (itemIndex = tmpModelValueIndex.value) => {
    if (itemIndex) {
      await nextTick()
      optionsList.value?.scrollTo({
        top: itemIndex * props.itemHeight - props.itemHeight,
      })
    }
  }

  const updateValue = (
    selectedOption: MazSelectOptions,
    mustCloseList = true,
  ) => {
    tmpModelValueIndex.value = props.options.findIndex(
      (option) =>
        selectedOption[props.optionValueKey] === option[props.optionValueKey],
    )
    if (mustCloseList) closeList()
    return emits('update:model-value', selectedOption[props.optionValueKey])
  }
</script>

<style lang="postcss" scoped>
  .m-select {
    @apply maz-relative;

    &:not(.--disabled) {
      @apply maz-cursor-pointer;

      &:deep(.m-input-input) {
        @apply maz-cursor-pointer;
      }
    }

    &-input:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input.--has-label:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input {
      &__toggle-button {
        @apply maz-pl-0;
      }
    }

    &-chevron {
      @apply maz-transition-all maz-duration-300 maz-ease-out;
    }

    &.--is-open {
      & .m-select-chevron {
        transform: rotate(180deg);
      }
    }

    &-list {
      @apply maz-absolute maz-z-100 maz-overflow-auto
        maz-rounded-lg maz-bg-color maz-text-normal maz-elevation;

      min-width: 3.5rem;

      &-item {
        @apply maz-flex maz-w-full maz-items-center maz-bg-transparent
          maz-px-4 maz-text-left maz-text-normal hover:maz-bg-color-light;

        &.--is-keyboard-selected {
          @apply maz-bg-color-light maz-font-medium;
        }

        &.--is-selected {
          @apply maz-font-semibold;

          &.--primary {
            @apply maz-bg-primary maz-text-primary-contrast;
          }

          &.--secondary {
            @apply maz-bg-secondary maz-text-secondary-contrast;
          }

          &.--info {
            @apply maz-bg-info maz-text-info-contrast;
          }

          &.--success {
            @apply maz-bg-success maz-text-success-contrast;
          }

          &.--warning {
            @apply maz-bg-warning maz-text-warning-contrast;
          }

          &.--danger {
            @apply maz-bg-danger maz-text-danger-contrast;
          }

          &.--black {
            @apply maz-bg-black maz-text-black-contrast;
          }

          &.--white {
            @apply maz-bg-white maz-text-white-contrast;
          }

          &.--transparent {
            @apply maz-bg-color;
          }
        }
      }
    }

    & button.maz-custom {
      @apply maz-cursor-pointer maz-appearance-none maz-border-none;
    }
  }
</style>
