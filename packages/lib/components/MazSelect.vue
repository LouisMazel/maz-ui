<template>
  <div
    ref="mazSelectElement"
    class="m-select"
    :class="[{ '--is-open': hasListOpened, '--disabled': disabled }, props.class]"
    :style="style"
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
      @focus.prevent.stop="openList"
      @click.prevent.stop="openList"
      @change="emits('change', $event)"
      @keydown="mainInputKeyboardHandler"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          type="button"
          class="m-select-input__toggle-button maz-custom"
          @click.stop="toggleList"
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
            @update:model-value="tmpModelValueIndex = 0"
          >
            <template #left-icon>
              <SearchIcon class="maz-h-[1.3rem] maz-w-[1.3rem]" />
            </template>
          </MazInput>
        </div>
        <!--
          @slot No results slot - Displayed when no results corresponding with seeach query
        -->
        <slot v-if="!optionsList || optionsList.length <= 0" name="no-results">
          <span class="m-select-list__no-results">
            <NoSymbolIcon class="maz-h-6 maz-w-6 maz-text-normal" />
          </span>
        </slot>
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
                '--is-selected': isSelectedOption(option),
                '--is-none-value': isNullOrUndefined(option[optionValueKey]),
              },
            ]"
            :style="{ minHeight: `${itemHeight}px` }"
            @click.prevent.stop="updateValue(option)"
          >
            <MazCheckbox
              v-if="multiple"
              tabindex="-1"
              :model-value="isSelectedOption(option)"
              size="sm"
              :color="color"
            />
            <!--
              @slot Custom option
                @binding {Object} option
                @binding {Boolean} is-selected
            -->
            <slot :option="option" :is-selected="isSelectedOption(option)">
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

<script lang="ts" setup>
  import {
    ref,
    computed,
    onBeforeMount,
    nextTick,
    type PropType,
    getCurrentInstance,
    defineAsyncComponent,
    defineOptions,
    type HTMLAttributes,
  } from 'vue'
  import MazInput from './MazInput.vue'
  import type { Color, ModelValueSimple, Position, Size } from './types'
  import { useInstanceUniqId } from '../modules/composables'
  import { debounceCallback } from './../modules/helpers/debounce-callback'

  export type MazSelectOption = Record<string, ModelValueSimple>
  export type { Color, Size, ModelValueSimple, Position }

  const MazCheckbox = defineAsyncComponent(() => import('./MazCheckbox.vue'))

  const SearchIcon = defineAsyncComponent(() => import('./../icons/magnifying-glass.svg'))
  const ChevronDownIcon = defineAsyncComponent(() => import('./../icons/chevron-down.svg'))
  const NoSymbolIcon = defineAsyncComponent(() => import('./../icons/no-symbol.svg'))

  const instance = getCurrentInstance()

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    modelValue: {
      type: [Number, String, Boolean, Array] as PropType<ModelValueSimple | ModelValueSimple[]>,
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
    /** Choose color of the input */
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
    /** Choose the option list item height */
    itemHeight: { type: Number, default: 40 },
    maxListHeight: { type: Number, default: 240 },
    /** Add max-width value to option list */
    maxListWidth: { type: Number, default: undefined },
    /** Choose size of the input */
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    /** Display search input in option list */
    search: { type: Boolean, default: false },
    /** Search input placeholder */
    searchPlaceholder: { type: String, default: 'Search in options' },
    /** Enable feature to select multiple values */
    multiple: { type: Boolean, default: false },
  })

  const emits = defineEmits([
    'close',
    'open',
    'blur',
    'focus',
    'change',
    'update:model-value',
    /** On selected value, returns the option object */
    'selected-option',
  ])

  const listOpened = ref(false)
  const tmpModelValueIndex = ref<number>()

  const isBlackOrTransparentColor = computed(() =>
    ['black', 'transparent', 'white'].includes(props.color),
  )

  const selectedTextColor = computed(() =>
    isBlackOrTransparentColor.value
      ? `var(--maz-color-black)`
      : `var(--maz-color-${props.color}-800)`,
  )
  const selectedBgColor = computed(() =>
    isBlackOrTransparentColor.value
      ? 'var(--maz-color-muted)'
      : `var(--maz-color-${props.color}-100)`,
  )
  const keyboardSelectedBgColor = computed(() =>
    isBlackOrTransparentColor.value
      ? 'var(--maz-color-muted)'
      : `var(--maz-color-${props.color}-200)`,
  )

  const hasListOpened = computed(() => listOpened.value || props.open)

  const instanceId = useInstanceUniqId({
    componentName: 'MazSelect',
    instance,
    providedId: props.id,
  })

  const selectedOptions = computed(
    () =>
      props.options?.filter((option) => {
        return props.multiple
          ? Array.isArray(props.modelValue)
            ? props.modelValue.includes(option[props.optionValueKey]) &&
              !isNullOrUndefined(option[props.optionValueKey])
            : false
          : props.modelValue === option[props.optionValueKey] &&
              !isNullOrUndefined(option[props.optionValueKey])
      }) ?? [],
  )

  onBeforeMount(() => {
    if (!props.options?.length) {
      console.warn('[maz-ui](MazSelect) you must provide options')
    }

    updateTmpModelValueIndex()
  })

  const mazSelectElement = ref<HTMLDivElement>()
  const mazInputComponent = ref<typeof MazInput>()
  const searchInputComponent = ref<typeof MazInput>()
  const optionsListElement = ref<HTMLDivElement>()

  const isNullOrUndefined = (value: unknown) => {
    return value === undefined || value === null
  }

  function isSelectedOption(option: MazSelectOption) {
    const hasOption =
      selectedOptions.value?.some(
        (selectedOption) => selectedOption[props.optionValueKey] === option[props.optionValueKey],
      ) ?? false
    return hasOption && !isNullOrUndefined(option[props.optionValueKey])
  }

  const mazInputValue = computed(() => {
    if (props.multiple && props.modelValue && Array.isArray(props.modelValue)) {
      return props.modelValue
        .map(
          (value) =>
            props.options?.find((option) => option[props.optionValueKey] === value)?.[
              props.optionInputValueKey
            ],
        )
        .join(', ')
    }

    return props.options?.find((option) => option[props.optionValueKey] === props.modelValue)?.[
      props.optionInputValueKey
    ]
  })

  const listTransition = computed(() =>
    props.listPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert',
  )

  const searchQuery = ref<string>('')
  const query = ref<string>('')

  function normalizeString(str: string): string {
    return str
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(/[^\dA-Za-z\u0400-\u04FF]/g, '')
  }

  const searchInValue = (value?: ModelValueSimple, query?: string) => {
    return (
      query &&
      value &&
      normalizeString(value.toString().toLocaleLowerCase().trim()).includes(
        normalizeString(query.toLocaleLowerCase().trim()),
      )
    )
  }

  function getFilteredOptionWithQuery(query: string) {
    return query
      ? props.options?.filter((option) => {
          const searchValue = option[props.optionLabelKey]
          const searchValue3 = option[props.optionValueKey]
          const searchValue2 = option[props.optionInputValueKey]

          return (
            searchInValue(searchValue, query) ||
            searchInValue(searchValue3, query) ||
            searchInValue(searchValue2, query)
          )
        })
      : props.options
  }

  const optionsList = computed(() => getFilteredOptionWithQuery(searchQuery.value))

  const closeList = async (event?: Event) => {
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
    tmpModelValueIndex.value = 0
    emits('close', event)
  }

  const openList = async (event?: Event) => {
    if (props.disabled || hasListOpened.value) return

    event?.preventDefault()
    listOpened.value = true
    await scrollToOptionIndex()
    emits('focus', event)
    emits('open', listOpened.value)
  }

  function focusMainInput() {
    ;(mazInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
  }

  function toggleList(event: Event) {
    listOpened.value ? closeList(event) : focusMainInput()
  }

  function focusSearchInputAndSetQuery(q: string) {
    searchQuery.value = q
    ;(searchInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
  }

  function searchOptionWithQuery(keyPressed: string) {
    if (keyPressed === 'Backspace' && query.value.length > 0) {
      query.value = query.value.slice(0, -1)
    } else {
      query.value += keyPressed
    }

    const filteredOptions = getFilteredOptionWithQuery(query.value)

    if (filteredOptions?.length) {
      tmpModelValueIndex.value = optionsList.value?.findIndex(
        (option) => option[props.optionValueKey] === filteredOptions[0][props.optionValueKey],
      )

      if (typeof tmpModelValueIndex.value === 'number' && tmpModelValueIndex.value >= 0) {
        scrollToOptionIndex(tmpModelValueIndex.value)
      }
    }

    debounceCallback(() => {
      query.value = ''
    }, 1000)
  }

  const mainInputKeyboardHandler = (event: KeyboardEvent) => {
    const keyPressed = event.key

    if (/^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed)) {
      event.preventDefault()
      openList(event)

      props.search ? focusSearchInputAndSetQuery(keyPressed) : searchOptionWithQuery(keyPressed)
    } else {
      keyboardHandler(event)
    }
  }

  const keyboardHandler = (event: KeyboardEvent) => {
    const code = event.code

    const isArrow = ['ArrowUp', 'ArrowDown'].includes(code)
    const shouldSelect = ['Enter', 'Space'].includes(code)
    const shouldCloseList = 'Escape' === code && hasListOpened.value

    if (isArrow) {
      arrowHandler(event, tmpModelValueIndex.value)
    } else if (shouldSelect) {
      enterHandler(event, tmpModelValueIndex.value)
    } else if (shouldCloseList) {
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

    scrollToOptionIndex(tmpModelValueIndex.value)
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

  async function scrollToOptionIndex(index?: number) {
    await nextTick()

    if (typeof index !== 'number') {
      updateTmpModelValueIndex()
    }

    const selectedIndex = index ?? tmpModelValueIndex.value

    if (typeof selectedIndex === 'number' && selectedIndex >= 0) {
      optionsListElement.value
        ?.querySelectorAll('.m-select-list-item')
        [selectedIndex]?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'start',
        })
    }
  }

  function updateTmpModelValueIndex(inputOption?: MazSelectOption) {
    const index = optionsList.value?.findIndex((option) => {
      if (props.multiple && Array.isArray(props.modelValue)) {
        if (inputOption) {
          return inputOption[props.optionValueKey] === option[props.optionValueKey]
        }
        const values = [...props.modelValue].reverse()
        return values[0] === option[props.optionValueKey]
      } else {
        return selectedOptions.value?.[0]?.[props.optionValueKey] === option[props.optionValueKey]
      }
    })

    tmpModelValueIndex.value = index && index >= 0 ? index : 0
  }

  const updateValue = (inputOption: MazSelectOption, mustCloseList = true) => {
    if (mustCloseList && !props.multiple) {
      nextTick(() => closeList())
    }

    searchQuery.value = ''

    const isAlreadySelected = selectedOptions.value?.some(
      (option) => option[props.optionValueKey] === inputOption[props.optionValueKey],
    )

    let newValue = selectedOptions.value

    if (isAlreadySelected && props.multiple) {
      newValue = newValue?.filter(
        (option) => option[props.optionValueKey] !== inputOption[props.optionValueKey],
      )
    } else if (props.multiple) {
      newValue.push(inputOption)
    } else {
      newValue = [inputOption]
    }

    const selectedValues = newValue.map((option) => option[props.optionValueKey])

    emits('update:model-value', props.multiple ? selectedValues : selectedValues[0])
    emits('selected-option', inputOption)
    updateTmpModelValueIndex(inputOption)
    focusMainInput()
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
      @apply maz-absolute maz-z-100 maz-flex maz-flex-col maz-overflow-hidden maz-rounded maz-bg-color maz-text-normal maz-drop-shadow-lg dark:maz-bg-color-light;

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
        @apply maz-flex maz-w-full maz-items-center maz-gap-3 maz-truncate maz-bg-transparent maz-px-4 maz-text-left maz-text-normal hover:maz-bg-color-lighter;

        span {
          @apply maz-truncate;
        }

        &.--is-keyboard-selected {
          @apply maz-bg-color-light dark:maz-bg-color-lighter;

          &.--is-selected {
            background-color: v-bind('keyboardSelectedBgColor');
          }
        }

        &.--is-none-value {
          @apply maz-text-muted;
        }

        &.--is-selected {
          color: v-bind('selectedTextColor');
          background-color: v-bind('selectedBgColor');

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
