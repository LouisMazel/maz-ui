<template>
  <div
    ref="mazSelectElement"
    class="m-select"
    :class="{ '--is-open': hasListOpened, '--disabled': disabled }"
    @blur.capture="closeList"
  >
    <MazInput
      :id="instanceId"
      ref="mazInputComponent"
      class="m-select-input"
      v-bind="$attrs"
      :required="required"
      :border-active="listOpened"
      :color="color"
      :model-value="mazInputValue"
      autocomplete="off"
      :size="size"
      :disabled="disabled"
      @focus.stop="openList"
      @change="emits('change', $event)"
      @click.stop="openList"
      @keydown="mainInputKeyboardHandler"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          type="button"
          class="m-select-input__toggle-button maz-custom"
          @click.stop="openList"
        >
          <ChevronDownIcon class="m-select-chevron maz-text-xl" />
        </button>
      </template>
    </MazInput>
    <Transition :name="listTransition">
      <div
        v-if="hasListOpened"
        ref="optionsListElement"
        class="m-select-list"
        :class="{
          '--top': listPosition.includes('top'),
          '--left': listPosition.includes('left'),
          '--right': listPosition.includes('right'),
          '--bottom': listPosition.includes('bottom'),
        }"
        :style="{
          maxHeight: `${maxListHeight}px`,
          maxWidth: `${maxListWidth}px`,
        }"
      >
        <div v-if="search" tabindex="-1" class="m-select-list__search-wrapper">
          <MazInput
            ref="searchInputComponent"
            v-model="searchQuery"
            size="sm"
            :color="color"
            :placeholder="searchPlaceholder"
            name="search"
            autocomplete="off"
            tabindex="-1"
            class="m-select-list__search-input"
            @keydown="keyboardHandler"
          >
            <template #left-icon>
              <SearchIcon class="maz-h-[1.3rem] maz-w-[1.3rem]" />
            </template>
          </MazInput>
        </div>
        <span v-if="!optionsList || optionsList.length <= 0" class="m-select-list__no-results">
          <NoSymbolIcon class="maz-h-6 maz-w-6 maz-text-normal" />
        </span>
        <div v-else class="m-select-list__scroll-wrapper" tabindex="-1">
          <button
            v-for="(option, i) in optionsList"
            :key="i"
            tabindex="-1"
            type="button"
            class="m-select-list-item maz-custom"
            :class="[
              {
                '--is-keyboard-selected': tmpModelValueIndex === i,
                '--is-selected':
                  selectedOption?.[optionValueKey] === option[optionValueKey] &&
                  !isNullOrUndefined(option[optionValueKey]),
                '--is-none-value': isNullOrUndefined(option[optionValueKey]),
              },
              `--${color}`,
            ]"
            :style="{ minHeight: `${itemHeight}px` }"
            @click.prevent.stop="updateValue(option)"
          >
            <slot
              :option="option"
              :is-selected="selectedOption?.[optionValueKey] === option[optionValueKey]"
              :selected-option="selectedOption?.[optionValueKey]"
            >
              <span>
                {{ option[optionLabelKey] }}
              </span>
            </slot>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
  export type MazSelectOption = Record<string, ModelValueSimple>
  export type { Color, Size, ModelValueSimple, Position } from './types'
</script>

<script lang="ts" setup>
  // NEXT: multiselect
  import { ref, computed, onBeforeMount, nextTick, type PropType, getCurrentInstance } from 'vue'
  import MazInput from './MazInput.vue'
  import type { Color, ModelValueSimple, Position, Size } from './types'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'

  import SearchIcon from './../icons/magnifying-glass.svg'
  import ChevronDownIcon from './../icons/chevron-down.svg'
  import NoSymbolIcon from './../icons/no-symbol.svg'

  const instance = getCurrentInstance()

  const props = defineProps({
    modelValue: {
      type: [Number, String, Boolean] as PropType<ModelValueSimple>,
      default: undefined,
    },
    id: { type: String, default: undefined },
    options: { type: Array as PropType<MazSelectOption[]>, default: undefined },
    optionValueKey: { type: String, default: 'value' },
    optionLabelKey: { type: String, default: 'label' },
    optionInputValueKey: { type: String, default: 'label' },
    listPosition: {
      type: String as PropType<Position>,
      default: 'bottom left',
      validator: (value: Position) => {
        return ['top', 'top right', 'top left', 'bottom', 'bottom right', 'bottom left'].includes(
          value,
        )
      },
    },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
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
    search: { type: Boolean, default: false },
    searchPlaceholder: { type: String, default: 'Search in options' },
  })

  const emits = defineEmits(['close', 'open', 'update:model-value', 'blur', 'focus', 'change'])

  const listOpened = ref(false)
  const tmpModelValueIndex = ref<number>()

  const hasListOpened = computed(() => listOpened.value || props.open)

  const instanceId = useInstanceUniqId({
    componentName: 'MazSelect',
    instance,
    providedId: props.id,
  })

  onBeforeMount(() => {
    if (!props.options?.length) {
      console.warn('[maz-ui](MazSelect) you must provide options')
    }

    if (selectedOption.value) {
      tmpModelValueIndex.value = props.options?.findIndex(
        (option) => option[props.optionValueKey] === selectedOption.value?.[props.optionValueKey],
      )
    }
  })

  const mazSelectElement = ref<HTMLDivElement>()
  const mazInputComponent = ref<typeof MazInput>()
  const searchInputComponent = ref<typeof MazInput>()
  const optionsListElement = ref<HTMLDivElement>()

  const selectedOption = computed(
    () => props.options?.find((option) => props.modelValue === option[props.optionValueKey]),
  )

  const isNullOrUndefined = (value: unknown) => {
    return value === undefined || value === null
  }

  const mazInputValue = computed(() => {
    return isNullOrUndefined(selectedOption.value?.[props.optionValueKey])
      ? undefined
      : selectedOption.value?.[props.optionInputValueKey] ??
          selectedOption.value?.[props.optionLabelKey]
  })

  const listTransition = computed(() =>
    props.listPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert',
  )

  const searchQuery = ref<string>()

  const searchInValue = (value?: ModelValueSimple, query?: string) => {
    return query && value?.toString().toLocaleLowerCase().includes(query.toLocaleLowerCase())
  }

  const optionsList = computed(() => {
    return searchQuery.value
      ? props.options?.filter((option) => {
          const searchValue = option[props.optionLabelKey]
          const searchValue3 = option[props.optionValueKey]
          const searchValue2 = option[props.optionInputValueKey]

          return (
            searchInValue(searchValue, searchQuery.value) ||
            searchInValue(searchValue3, searchQuery.value) ||
            searchInValue(searchValue2, searchQuery.value)
          )
        })
      : props.options
  })

  const closeList = async (event?: FocusEvent | KeyboardEvent) => {
    if (
      event &&
      (('relatedTarget' in event &&
        mazSelectElement.value?.contains(event.relatedTarget as Node)) ||
        event.type === 'keydown')
    ) {
      return event.preventDefault()
    }

    await nextTick()
    listOpened.value = false
    emits('close', event)
  }

  const openList = async (event?: Event) => {
    event?.preventDefault()

    if (props.disabled) return

    listOpened.value = true
    await scrollToSelected()
    emits('focus', event)
    emits('open', listOpened.value)
  }

  const mainInputKeyboardHandler = (event: KeyboardEvent) => {
    if (event.key?.length === 1) {
      event.preventDefault()
      openList(event)

      searchQuery.value = event.key

      if (props.search) {
        searchInputComponent.value?.input.focus()
      }
    } else {
      keyboardHandler(event)
    }
  }

  const keyboardHandler = (event: KeyboardEvent) => {
    const code = event.code

    const isArrow = ['ArrowUp', 'ArrowDown'].includes(code)
    const isEnter = 'Enter' === code
    const isEscape = 'Escape' === code && hasListOpened.value

    if (isArrow) {
      arrowHandler(event, tmpModelValueIndex.value)
    } else if (isEnter) {
      enterHandler(event, tmpModelValueIndex.value)
    } else if (isEscape) {
      closeList()
    }
  }

  const arrowHandler = (event: KeyboardEvent, currentIndex?: number) => {
    event.preventDefault()
    const code = event.code

    if (!hasListOpened.value) openList(event)

    const optionsLength = optionsList.value?.length

    if (!optionsLength) {
      return
    }

    if (typeof currentIndex === 'number') {
      if (currentIndex === optionsLength - 1 && code === 'ArrowDown') {
        tmpModelValueIndex.value = 0
      } else if (currentIndex === 0 && code === 'ArrowUp') {
        tmpModelValueIndex.value = optionsLength - 1
      } else {
        tmpModelValueIndex.value = code === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1
      }
    } else {
      tmpModelValueIndex.value = code === 'ArrowDown' ? 0 : optionsLength - 1
    }

    scrollToSelected()
  }

  const enterHandler = (event: KeyboardEvent, currentIndex?: number) => {
    event.preventDefault()

    if (!hasListOpened.value) {
      return openList(event)
    }

    const newValue = currentIndex
      ? optionsList.value?.[currentIndex] ?? optionsList.value?.[0]
      : optionsList.value?.[0]

    if (!isNullOrUndefined(newValue)) {
      updateValue(newValue as MazSelectOption)
    }
  }

  const scrollToSelected = async (itemIndex = tmpModelValueIndex.value) => {
    if (typeof itemIndex === 'number') {
      await nextTick()

      optionsListElement.value?.querySelectorAll('.m-select-list-item')[itemIndex]?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'start',
      })
    }
  }

  const updateValue = (selectedOption: MazSelectOption, mustCloseList = true) => {
    tmpModelValueIndex.value = optionsList.value?.findIndex(
      (option) => selectedOption[props.optionValueKey] === option[props.optionValueKey],
    )
    if (mustCloseList) {
      nextTick(() => closeList())
    }
    searchQuery.value = undefined
    return emits('update:model-value', selectedOption[props.optionValueKey])
  }
</script>

<style lang="postcss" scoped>
  .m-select {
    @apply maz-relative;

    &:not(.--disabled):deep(.m-input-input) {
      @apply maz-cursor-pointer;
    }

    &-input:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input.--has-label:deep(.m-input-input) {
      @apply maz-pr-0;
    }

    &-input {
      &__toggle-button {
        @apply maz-flex maz-h-full maz-bg-transparent maz-pl-0 maz-flex-center;
      }

      &:deep(input) {
        @apply maz-caret-transparent;
      }
    }

    &-chevron {
      @apply maz-transition-all maz-duration-300 maz-ease-out;
    }

    .m-select-chevron {
      @apply maz-text-normal;
    }

    &.--is-open {
      & .m-select-chevron {
        transform: rotate(180deg);
      }
    }

    .m-select-list {
      @apply maz-absolute maz-z-100 maz-flex maz-flex-col maz-overflow-hidden maz-rounded maz-bg-color maz-text-normal maz-elevation;

      min-width: 3.5rem;

      &.--top {
        @apply maz-bottom-full;
      }

      &.--left {
        @apply maz-left-0;
      }

      &.--right {
        @apply maz-right-0;
      }

      &.--bottom {
        @apply maz-top-full;
      }

      &__search-wrapper {
        @apply maz-flex-none maz-bg-color maz-p-1;
      }

      &__scroll-wrapper {
        @apply maz-flex-1 maz-overflow-auto;
      }

      &__no-results {
        @apply maz-flex maz-p-4 maz-flex-center;
      }

      &-item {
        @apply maz-flex maz-w-full maz-items-center maz-truncate maz-bg-transparent maz-px-4 maz-text-left maz-text-normal hover:maz-bg-color-light;

        span {
          @apply maz-truncate;
        }

        &.--is-keyboard-selected {
          @apply maz-bg-color-lighter;
        }

        &.--is-none-value {
          @apply maz-text-muted;
        }

        &.--is-selected {
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

  html.dark {
    & .m-select-list {
      @apply maz-bg-color-light;

      /* &__search-wrapper {
        @apply maz-bg-color-light;
      } */

      &-item {
        @apply hover:maz-bg-color-lighter;
      }
    }
  }
</style>
