<script
  lang="ts"
  setup
  generic="T extends MazInputValue, U extends MazSelectOption"
>
import type { ComponentPublicInstance, HTMLAttributes } from 'vue'
import type { MazInputValue } from './MazInput.vue'
import type { MazColor, MazSize } from './types'
import { MazChevronDown, MazMagnifyingGlass, MazNoSymbol } from '@maz-ui/icons'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { useStringMatching } from '../composables/useStringMatching'
import { debounceCallback } from '../utils/debounceCallback'

import { isClient } from '../utils/isClient'
import { normalizeString } from '../utils/normalizeString'
import MazInput from './MazInput.vue'
import MazPopover, { type MazPopoverProps } from './MazPopover.vue'

export type MazSelectNormalizedOption = Record<string, MazInputValue>
export interface MazSelectOptionWithOptGroup {
  label: string
  options: (MazSelectNormalizedOption | string | number | boolean)[]
}
export type MazSelectOption
  = | MazSelectNormalizedOption
    | string
    | number
    | boolean
    | MazSelectOptionWithOptGroup

export interface MazSelectProps<T extends MazInputValue, U extends MazSelectOption> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the select */
  id?: string
  /** The value of the select */
  modelValue?: T | T[]
  /** The options of the select */
  options: U[]
  /**
   * The key of the option value
   * @default 'value'
   */
  optionValueKey?: string
  /**
   * The key of the option label
   * @default 'label'
   */
  optionLabelKey?: string
  /**
   * The key of the option input value
   * @default 'label'
   */
  optionInputValueKey?: string
  /**
   * The position of the list
   * @default 'bottom-start'
   */
  listPosition?: MazPopoverProps['position']
  /** The height of the option list item */
  itemHeight?: number
  /** The max height of the option list */
  maxListHeight?: number
  /** The max width of the option list */
  maxListWidth?: number
  /** The min height of the option list */
  minListHeight?: number
  /** The min width of the option list */
  minListWidth?: number
  /**
   * The size of the select
   * @default 'md'
   */
  size?: MazSize
  /**
   * The color of the select
   * @default 'primary'
   */
  color?: MazColor
  /** Display search input in option list */
  search?: boolean
  /**
   * The placeholder of the search input
   * @default 'Search in options'
   */
  searchPlaceholder?: string
  /**
   * Replace the default search function to provide a custom search function
   * @default undefined
   */
  searchFunction?: (query: string, options: U[]) => U[] | undefined
  /**
   * The threshold for the search input where 1 is a perfect match and 0 is a match with any character
   * @default 0.75
   */
  searchThreshold?: number
  /** Enable the multiple selection */
  multiple?: boolean
  /** Make the input required in the form */
  required?: boolean
  /** Disable the component */
  disabled?: boolean
  /** The input will be displayed in full width */
  block?: boolean
  /** The exclude selectors for the v-closable directive - will exclude the elements from the directive */
  excludedSelectors?: string[]
  /**
   * The autocomplete attribute of the input
   * @default 'off'
   */
  autocomplete?: string
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazSelectProps<T, U>>(), {
  id: undefined,
  class: undefined,
  multiple: undefined,
  style: undefined,
  modelValue: undefined,
  optionValueKey: 'value',
  optionLabelKey: 'label',
  optionInputValueKey: 'label',
  listPosition: 'bottom-start',
  itemHeight: undefined,
  maxListHeight: 240,
  maxListWidth: undefined,
  minListWidth: undefined,
  minListHeight: undefined,
  size: 'md',
  color: 'primary',
  excludedSelectors: undefined,
  searchPlaceholder: 'Search in options',
  searchThreshold: 0.75,
  autocomplete: 'off',
})

const emits = defineEmits<{
  /**
   * On list is closed
   * @event 'close'
   * @property {Event} value - the event
   */
  'close': []
  /**
   * On list is opened
   * @event 'open'
   */
  'open': []
  /**
   * On input blur
   * @event 'blur'
   * @property {Event} value - the event
   */
  'blur': [value: Event]
  /**
   * On input focus
   * @event 'focus'
   * @property {Event} value - the event
   */
  'focus': [value?: Event]
  /**
   * On input change value
   * @event 'change'
   * @property {Event} value - the event
   */
  'change': [value: Event]
  /**
   * On input value
   * @event 'input'
   * @property {Event} value - the event
   */
  'input': [value: Event]
  /**
   * On model value update, returns the new value
   * @event 'update:model-value'
   * @property {MazInputValue | MazInputValue[]} value - the new value
   */
  'update:model-value': [value: T | T[]]
  /**
   * On selected value, returns the option object
   * @event 'selected-option'
   * @property {MazSelectOption} value - the option object
   */
  'selected-option': [value: U]
}>()

const MazCheckbox = defineAsyncComponent(() => import('./MazCheckbox.vue'))

const popoverComponent = useTemplateRef('popoverComponent')

const selectedTextColor = computed(() => `hsl(var(--maz-${props.color}))`)
const selectedBgColor = computed(() => `hsl(var(--maz-${props.color}-500) / 0.2)`)

const isOpen = defineModel<boolean>('open', { required: false, default: false })

const instanceId = useInstanceUniqId({
  componentName: 'MazSelect',
  providedId: props.id,
})

function getOptionPayload(option: string | number | boolean): MazSelectNormalizedOption {
  return {
    [props.optionValueKey]: option,
    [props.optionLabelKey]: option,
    [props.optionInputValueKey]: option,
  }
}
function getNormalizedOptionPayload(option: MazSelectNormalizedOption): MazSelectNormalizedOption {
  return {
    ...option,
    [props.optionValueKey]: option[props.optionValueKey],
    [props.optionLabelKey]: option[props.optionLabelKey],
    [props.optionInputValueKey]: option[props.optionInputValueKey],
  }
}

function getNormalizedOptions(options: U[] | undefined) {
  const normalizedOptions: MazSelectNormalizedOption[] = []

  if (!options?.length) {
    return []
  }

  for (const option of options) {
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
      normalizedOptions.push(getOptionPayload(option))
    }
    else if (
      typeof option === 'object'
      && 'options' in option
      && Array.isArray(option.options)
    ) {
      normalizedOptions.push(
        { label: option.label, isOptGroup: true },
        ...option.options.map(opt =>
          typeof opt === 'string' || typeof opt === 'number' || typeof opt === 'boolean'
            ? getOptionPayload(opt)
            : getNormalizedOptionPayload(opt),
        ),
      )
    }
    else {
      normalizedOptions.push(getNormalizedOptionPayload(option as MazSelectNormalizedOption))
    }
  }

  return normalizedOptions
}

const optionsNormalized = computed<MazSelectNormalizedOption[]>(() => getNormalizedOptions(props.options ?? []))

function isOptionInSelection(option: MazSelectNormalizedOption): boolean {
  if (isNullOrUndefined(option[props.optionValueKey])) {
    return false
  }

  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option[props.optionValueKey] as T)
  }

  return props.modelValue === option[props.optionValueKey]
}

const selectedOptions = computed(
  () => optionsNormalized.value?.filter(isOptionInSelection) ?? [],
)

const mazInputComponent = useTemplateRef<ComponentPublicInstance<typeof MazInput>>('mazInputComponent')
const searchInputComponent = useTemplateRef<ComponentPublicInstance<typeof MazInput>>('searchInputComponent')
const optionListElement = ref<HTMLDivElement>()
const optionListScrollWrapper = ref<HTMLDivElement>()

function isNullOrUndefined(value: unknown) {
  return value === undefined || value === null
}

function isSelectedOption(option: MazSelectNormalizedOption) {
  const hasOption
      = selectedOptions.value?.some(
        selectedOption => selectedOption[props.optionValueKey] === option[props.optionValueKey],
      ) ?? false

  return hasOption && !isNullOrUndefined(option[props.optionValueKey])
}

const inputValue = computed(() => {
  if (props.multiple && props.modelValue && Array.isArray(props.modelValue)) {
    return props.modelValue
      .map(
        value =>
          optionsNormalized.value?.find(option => option[props.optionValueKey] === value)?.[
            props.optionInputValueKey
          ],
      )
      .join(', ')
  }

  const selectedOption = optionsNormalized.value?.find(
    option => option[props.optionValueKey] === props.modelValue,
  )

  return isNullOrUndefined(props.modelValue)
    ? undefined
    : selectedOption?.[props.optionInputValueKey]
})

const searchQuery = ref<string>()
const query = ref<string>('')

function searchInValue(value?: MazInputValue, query?: string) {
  return query && value && normalizeString(value).includes(normalizeString(query))
}

function getFilteredOptionWithQuery(query?: string) {
  if (!query) {
    return optionsNormalized.value
  }

  return optionsNormalized.value?.filter((option) => {
    const searchValue = option[props.optionLabelKey]
    const searchValue3 = option[props.optionValueKey]
    const searchValue2 = option[props.optionInputValueKey]

    const threshold = props.searchThreshold

    return (
      searchInValue(searchValue, query)
      || searchInValue(searchValue2, query)
      || searchInValue(searchValue3, query)
      || (typeof searchValue === 'string'
        && useStringMatching(searchValue, query, threshold).isMatching.value)
      || (typeof searchValue2 === 'string'
        && useStringMatching(searchValue2, query, threshold).isMatching.value)
      || (typeof searchValue3 === 'string'
        && useStringMatching(searchValue3, query, threshold).isMatching.value)
    )
  })
}

const optionList = computed(() => props.searchFunction && props.search && searchQuery.value
  ? getNormalizedOptions(props.searchFunction(searchQuery.value, props.options ?? []) ?? [])
  : getFilteredOptionWithQuery(searchQuery.value),
)

function onCloseList() {
  emits('close')
}

async function onOpenList() {
  const selectedIndex = optionList.value?.findIndex(
    option => isSelectedOption(option),
  )

  await scrollToOptionIndex(selectedIndex)

  emits('open')
}

function focusMainInput() {
  mazInputComponent.value?.$el?.querySelector('input')?.focus()
}
function emitInputMainInput() {
  mazInputComponent.value?.$el?.querySelector('input')?.dispatchEvent(new Event('input'))
}

function focusSearchInputAndSetQuery(q: string) {
  searchQuery.value = q
  searchInputComponent.value?.$el?.querySelector('input')?.focus()
}

function searchOptionWithQuery(keyPressed: string) {
  if (keyPressed === 'Backspace' && query.value && query.value.length > 0) {
    query.value = query.value.slice(0, -1)
  }
  else {
    query.value += keyPressed
  }

  const filteredOptions = getFilteredOptionWithQuery(query.value)

  if (!filteredOptions?.length) {
    return
  }

  const optionIndex = optionList.value?.findIndex(
    option => option[props.optionValueKey] === filteredOptions[0][props.optionValueKey],
  )

  if (typeof optionIndex !== 'number' || optionIndex === -1) {
    return
  }

  scrollToOptionIndex(optionIndex)

  debounceCallback(() => {
    query.value = ''
  }, 1000)
}

function mainInputKeyboardHandler(event: KeyboardEvent) {
  const keyPressed = event.key

  if ((keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp' || /^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed)) && !isOpen.value) {
    event.preventDefault()
    popoverComponent.value?.open()
  }

  if (/^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed) && props.search) {
    focusSearchInputAndSetQuery(keyPressed)
  }
}

async function scrollToOptionIndex(index?: number) {
  await nextTick()

  if (typeof index !== 'number' || index < 0) {
    return
  }

  const item = optionListElement.value?.querySelector<HTMLButtonElement>(`.m-select-list-item:nth-child(${index + 1})`)

  if (item && optionListScrollWrapper.value) {
    const wrapperRect = optionListScrollWrapper.value.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const scrollTop = item.offsetTop - wrapperRect.height / 2 + itemRect.height / 2

    optionListScrollWrapper.value.scrollTo({
      top: scrollTop,
      behavior: 'auto',
    })

    item.focus({ preventScroll: true })
  }
}

function updateValue(inputOption: MazSelectNormalizedOption, mustCloseList = true) {
  if (mustCloseList && !props.multiple) {
    nextTick(() => {
      popoverComponent.value?.close()
    })
  }

  searchQuery.value = ''

  const isAlreadySelected = selectedOptions.value?.some(
    option => option[props.optionValueKey] === inputOption[props.optionValueKey],
  )

  let newValue = selectedOptions.value

  if (isAlreadySelected && props.multiple) {
    newValue = newValue?.filter(
      option => option[props.optionValueKey] !== inputOption[props.optionValueKey],
    )
  }
  else if (props.multiple) {
    newValue.push(inputOption)
  }
  else {
    newValue = [inputOption]
  }

  const selectedValues = newValue.map(option => option[props.optionValueKey])

  emits('update:model-value', (props.multiple ? selectedValues : selectedValues[0]) as T | T[])
  emits('selected-option', inputOption as U)
  emitInputMainInput()
  focusMainInput()
}

function keydownHandler(event: KeyboardEvent) {
  const keyPressed = event.key

  if (keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp') {
    event.preventDefault()
    const itemLength = optionList.value?.length
    if (!itemLength)
      return

    const currentElement = document.activeElement as HTMLElement
    const itemsElements = document.querySelectorAll<HTMLElement>(`#${instanceId.value}-option-list .m-select-list-item`)
    const currentIndex = Array.from(itemsElements).indexOf(currentElement)

    if (currentIndex === -1) {
      (itemsElements[0] as HTMLElement)?.focus({ preventScroll: true })
      return
    }

    const nextIndex = keyPressed === 'ArrowDown'
      ? (currentIndex + 1) % itemLength
      : (currentIndex - 1 + itemLength) % itemLength

    itemsElements[nextIndex]?.focus()
  }
  else if (!props.search && /^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed)) {
    searchOptionWithQuery(keyPressed)
  }
}

function updateListPosition() {
  nextTick(() => {
    popoverComponent.value?.updatePosition()
  })
}

watch(
  isOpen,
  (value) => {
    if (!isClient())
      return

    if (value) {
      document.addEventListener('keydown', keydownHandler)
    }
    else {
      document.removeEventListener('keydown', keydownHandler)
    }
  },
  { immediate: true },
)

defineExpose({
  open: () => {
    popoverComponent.value?.open()
  },
})
</script>

<template>
  <MazPopover
    ref="popoverComponent"
    v-model="isOpen"
    class="m-select m-reset-css"
    :class="[
      { '--is-open': isOpen, '--disabled': disabled },
      props.class,
      `--${size}`,
    ]"
    :style
    trigger="click"
    :block
    :offset="0"
    :prefer-position="listPosition"
    :position-delay="100"
    fallback-position="top-start"
    @close="onCloseList"
    @open="onOpenList"
  >
    <template #trigger>
      <MazInput
        :id="instanceId"
        ref="mazInputComponent"
        class="m-select-input"
        v-bind="$attrs"
        :required="required"
        :border-active="isOpen"
        :color="color"
        :model-value="inputValue"
        :size="size"
        :block
        :autocomplete
        :disabled
        readonly
        @change="emits('change', $event)"
        @input="emits('input', $event)"
        @focus="emits('focus', $event)"
        @blur="emits('blur', $event)"
        @keydown="mainInputKeyboardHandler"
      >
        <template #right-icon>
          <button
            tabindex="-1"
            type="button"
            class="m-select-input__toggle-button maz-custom"
            :aria-label="`${isOpen ? 'collapse' : 'expand'} list of options`"
          >
            <MazChevronDown class="m-select-chevron" />
          </button>
        </template>
      </MazInput>
    </template>

    <template #default>
      <div
        :id="`${instanceId}-option-list`"
        ref="optionListElement"
        class="m-select-list"
        :class="`--${size}`"
        :style="[{
          'maxHeight': `${maxListHeight}px`,
          'maxWidth': `${maxListWidth}px`,
          'minHeight': `${minListHeight}px`,
          'minWidth': `${minListWidth}px`,
          '--selected-bg-color': selectedBgColor,
          '--selected-text-color': selectedTextColor,
        }]"
      >
        <MazInput
          v-if="search"
          ref="searchInputComponent"
          v-model="searchQuery"
          size="sm"
          :disabled
          :color
          :placeholder="searchPlaceholder"
          name="search"
          inputmode="search"
          autocomplete="off"
          block
          tabindex="-1"
          class="m-select-list__search-input maz-flex-none"
          :left-icon="MazMagnifyingGlass"
          @update:model-value="updateListPosition"
        />
        <!--
            @slot No results slot - Displayed when no results corresponding with search query
          -->
        <slot v-if="!optionList || optionList.length <= 0" name="no-results">
          <span class="m-select-list__no-results">
            <MazNoSymbol class="maz-size-6 maz-text-foreground" />
          </span>
        </slot>
        <div v-else ref="optionListScrollWrapper" class="m-select-list__scroll-wrapper" tabindex="-1">
          <template v-for="(option, i) in optionList" :key="i">
            <!--
                @slot Custom optgroup label
                  @binding {String} label - the label of the optgroup
              -->
            <slot v-if="option.label && option.isOptGroup" name="optgroup" :label="option.label">
              <span class="m-select-list-optgroup">
                {{ option.label }}
              </span>
            </slot>

            <button
              v-else
              type="button"
              :tabindex="multiple ? -1 : 0"
              class="m-select-list-item maz-custom maz-flex-none"
              :class="[
                {
                  '--is-selected': isSelectedOption(option),
                  '--is-none-value': isNullOrUndefined(option[optionValueKey]),
                },
              ]"
              :style="itemHeight ? { height: `${itemHeight}px` } : undefined"
              @click.prevent.stop="updateValue(option, true)"
            >
              <MazCheckbox
                v-if="multiple"
                :model-value="isSelectedOption(option)"
                size="sm"
                :color
              />
              <!--
                  @slot Custom option
                    @binding {Object} option - the option object
                    @binding {Boolean} is-selected - if the option is selected
                -->
              <slot :option="option" :is-selected="isSelectedOption(option)">
                <span>
                  {{ option[optionLabelKey] }}
                </span>
              </slot>
            </button>
          </template>
        </div>
      </div>
    </template>
  </MazPopover>
</template>

<style lang="postcss" scoped>
.m-select {
  @apply maz-relative maz-inline-flex maz-align-top;

  &.--mini {
    @apply maz-text-xs;
  }

  &.--xs {
    @apply maz-text-xs;
  }

  &.--sm {
    @apply maz-text-sm;
  }

  &.--md {
    @apply maz-text-base;
  }

  &.--lg {
    @apply maz-text-lg;
  }

  &.--xl {
    @apply maz-text-xl;
  }

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
    @apply maz-text-[1.2em] maz-text-foreground maz-transition-all maz-duration-300 maz-ease-out;
  }

  &.--is-open {
    & .m-select-chevron {
      transform: rotate(180deg);
    }
  }

  & button.maz-custom {
    @apply maz-cursor-pointer maz-appearance-none maz-border-none;
  }
}

.m-select-list {
  @apply maz-z-default-backdrop maz-flex maz-flex-col maz-gap-1 maz-overflow-hidden maz-rounded maz-bg-surface maz-p-2 maz-drop-shadow-md maz-shadow-elevation;

  &-optgroup {
    @apply maz-flex-none maz-p-0.5 maz-text-start maz-text-[0.875em] maz-text-muted;
  }

  &.--mini {
    @apply maz-text-xs;
  }

  &.--xs {
    @apply maz-text-xs;
  }

  &.--sm {
    @apply maz-text-sm;
  }

  &.--md {
    @apply maz-text-base;
  }

  &.--lg {
    @apply maz-text-lg;
  }

  &.--xl {
    @apply maz-text-xl;
  }

  min-width: 3.5rem;

  &__scroll-wrapper {
    @apply maz-flex maz-flex-1 maz-flex-col maz-gap-1 maz-overflow-auto;

    /* Custom scrollbar for webkit browsers (Chrome, Safari, Edge) */
    &::-webkit-scrollbar {
      width: 0.1875rem;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      @apply maz-bg-surface-400;

      border-radius: 1000px;

      &:hover {
        @apply maz-bg-surface-500;
      }
    }

    /* Modern CSS for all browsers (fallback) */
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--maz-background-400)) transparent;
  }

  &__no-results {
    @apply maz-flex maz-p-4 maz-flex-center;
  }

  &-item {
    @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-3 maz-truncate maz-rounded maz-bg-transparent maz-px-3 maz-py-2 maz-text-start maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-surface-400 hover:maz-bg-surface-400 maz-outline-none;

    span {
      @apply maz-truncate;
    }

    &.--is-none-value {
      @apply maz-text-muted;
    }

    &.--is-selected {
      color: var(--selected-text-color);
      background-color: var(--selected-bg-color);

      &:focus {
        @apply maz-bg-surface-400;
      }

      &.--transparent {
        @apply maz-bg-surface;
      }
    }
  }
}
</style>
