<script
  lang="ts"
  setup
  generic="Value extends MazInputValue, Option extends MazSelectOption, Multiple extends boolean"
>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { GenericInstanceType } from '@maz-ui/utils'
import type { HTMLAttributes } from 'vue'
import type { MazInputValue } from './MazInput.vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor, MazSize } from './types'
import { MazChevronDown, MazMagnifyingGlass, MazNoSymbol } from '@maz-ui/icons'
import { useTranslations } from '@maz-ui/translations'
import { debounceCallback } from '@maz-ui/utils/helpers/debounceCallback'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { normalizeString } from '@maz-ui/utils/helpers/normalizeString'
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
import MazInput from './MazInput.vue'
import MazPopover from './MazPopover.vue'

export interface MazSelectNormalizedOption {
  [key: string]: MazInputValue
}
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

export interface MazSelectProps<Value extends MazInputValue = MazInputValue, Option extends MazSelectOption = MazSelectOption, Multiple extends boolean = false> {
  /**
   * Style attribut of the component root element
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * Class attribut of the component root element
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /** The id of the select */
  id?: string
  /**
   * The label of the select
   */
  label?: string
  /**
   * The placeholder of the select
   */
  placeholder?: string
  /**
   * The value of the select
   * @type {Value | Value[]}
   */
  modelValue?: Multiple extends true ? Value[] : Value
  /**
   * The options of the select
   * @type {Option[]}
   */
  options: Option[]
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
   * The position of the list (auto by default - will switch between bottom-start and top-start)
   * @type {MazPopoverProps['position']}
   * @default 'auto'
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
   * Replace the default search function to provide a custom search function
   * @default undefined
   */
  searchFunction?: (query: string, options: Option[]) => Option[] | undefined
  /**
   * The threshold for the search input where 1 is a perfect match and 0 is a match with any character
   * @default 0.75
   */
  searchThreshold?: number
  /** Enable the multiple selection */
  multiple?: Multiple
  /** Make the input required in the form */
  required?: boolean
  /** Disable the component */
  disabled?: boolean
  /** The input will be displayed in full width */
  block?: boolean
  /**
   * The autocomplete attribute of the input
   * @default 'off'
   */
  autocomplete?: string
  /**
   * The translations of the component
   * @type {Partial<MazUiTranslationsNestedSchema['select']>}
   * @default {
   *   searchPlaceholder: 'Search in options',
   * }
   */
  translations?: Partial<MazUiTranslationsNestedSchema['select']>

  /**
   * The function to format the input value
   * @type {(value: Multiple extends true ? Value[] : Value) => string}
   * @default undefined
   */
  formatInputValue?: (value: Multiple extends true ? Value[] : Value) => string

  /**
   * The transition name of the panel list options
   * @type {MazPopoverProps['transition']}
   * @default 'scale-fade'
   */
  transition?: MazPopoverProps['transition']
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazSelectProps<Value, Option, Multiple>>(), {
  id: undefined,
  class: undefined,
  multiple: undefined,
  style: undefined,
  modelValue: undefined,
  optionValueKey: 'value',
  optionLabelKey: 'label',
  optionInputValueKey: 'label',
  listPosition: undefined,
  itemHeight: undefined,
  maxListHeight: 240,
  maxListWidth: undefined,
  minListWidth: undefined,
  minListHeight: undefined,
  size: 'md',
  color: 'primary',
  transition: 'scale-fade',
  searchThreshold: 0.75,
  autocomplete: 'off',
})

const emits = defineEmits<MazSelectEmits>()

interface MazSelectEmits {
  /**
   * On list is closed
   * @property {Event} value - the event
   */
  'close': []
  /**
   * On list is opened
   */
  'open': []
  /**
   * On input blur
   * @property {Event} value - the event
   */
  'blur': [value: Event]
  /**
   * On input focus
   * @property {Event} value - the event
   */
  'focus': [value?: Event]
  /**
   * On input change value
   * @property {Event} value - the event
   */
  'change': [value: Event]
  /**
   * On input value
   * @property {Event} value - the event
   */
  'input': [value: Event]
  /**
   * On model value update, returns the new value
   * @property {MazInputValue | MazInputValue[]} value - the new value
   */
  'update:model-value': [value: Multiple extends true ? Value[] : Value]
  /**
   * On selected value, returns the option object
   * @property {MazSelectOption} value - the option object
   */
  'selected-option': [value: Option]
}

const MazCheckbox = defineAsyncComponent(() => import('./MazCheckbox.vue'))

const popoverComponent = useTemplateRef('popover')
const inputRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('input')
const searchInputRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('searchInput')
const optionListRef = useTemplateRef('optionListRef')
const optionListWrapperRef = useTemplateRef('optionListWrapper')

const selectedTextColor = computed(() => `hsl(var(--maz-${props.color}))`)
const selectedBgColor = computed(() => `hsl(var(--maz-${props.color}-500) / 0.1)`)

const { t } = useTranslations()
const messages = computed(() => ({
  searchPlaceholder: props.translations?.searchPlaceholder || t('select.searchPlaceholder'),
} satisfies MazUiTranslationsNestedSchema['select']))

const isOpen = defineModel('open', { default: false })

const instanceId = useInstanceUniqId({
  componentName: 'MazSelect',
  providedId: props.id,
})

function getOptionPayload(option: string | number | boolean) {
  return {
    [props.optionValueKey]: option,
    [props.optionLabelKey]: option,
    [props.optionInputValueKey]: option,
  } satisfies MazSelectNormalizedOption
}
function getNormalizedOptionPayload(option: MazSelectNormalizedOption) {
  return {
    ...option,
    [props.optionValueKey]: option[props.optionValueKey],
    [props.optionLabelKey]: option[props.optionLabelKey],
    [props.optionInputValueKey]: option[props.optionInputValueKey],
  } satisfies MazSelectNormalizedOption
}

function getNormalizedOptions(options: Option[] | undefined) {
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

  return normalizedOptions satisfies MazSelectNormalizedOption[]
}

const optionsNormalized = computed(() => getNormalizedOptions(props.options ?? [] satisfies MazSelectNormalizedOption[]))

function isOptionInSelection(option: MazSelectNormalizedOption): boolean {
  if (isNullOrUndefined(option[props.optionValueKey])) {
    return false
  }

  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option[props.optionValueKey] as Value)
  }

  return props.modelValue === option[props.optionValueKey]
}

const selectedOptions = computed(
  () => optionsNormalized.value?.filter(isOptionInSelection) ?? [],
)

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
    const values = props.modelValue
      .map(
        value =>
          optionsNormalized.value?.find(option => option[props.optionValueKey] === value)?.[
            props.optionInputValueKey
          ],
      )

    if (props.formatInputValue) {
      return props.formatInputValue(values as Multiple extends true ? Value[] : Value)
    }

    return values.join(', ')
  }

  const selectedOption = optionsNormalized.value?.find(
    option => option[props.optionValueKey] === props.modelValue,
  )

  const value = isNullOrUndefined(props.modelValue)
    ? undefined
    : selectedOption?.[props.optionInputValueKey]

  if (props.formatInputValue) {
    return props.formatInputValue(value as Multiple extends true ? Value[] : Value)
  }

  return value
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

const optionList = computed(() => {
  if (props.searchFunction && props.search && searchQuery.value) {
    return getNormalizedOptions(props.searchFunction(searchQuery.value, props.options ?? []) ?? [])
  }

  return getFilteredOptionWithQuery(searchQuery.value)
})

async function onOpenList() {
  const selectedIndex = optionList.value?.findIndex(
    option => isSelectedOption(option),
  )

  await scrollToOptionIndex(selectedIndex)

  emits('open')
}

function focusMainInput() {
  inputRef.value?.$el?.querySelector('input')?.focus()
}
function emitInputMainInput() {
  inputRef.value?.$el?.querySelector('input')?.dispatchEvent(new Event('input'))
}

function focusSearchInputAndSetQuery(q: string) {
  searchQuery.value = q
  searchInputRef.value?.$el?.querySelector('input')?.focus()
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
  // Ignore keyboard shortcuts with modifier keys
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

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

  const item = optionListRef.value?.querySelector<HTMLButtonElement>(`.m-select-list-item:nth-child(${index + 1})`)

  if (item && optionListWrapperRef.value) {
    const wrapperRect = optionListWrapperRef.value.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const scrollTop = item.offsetTop - wrapperRect.height / 2 + itemRect.height / 2

    optionListWrapperRef.value.scrollTo?.({
      top: scrollTop,
      behavior: 'auto',
    })

    nextTick(() => {
      item.focus({ preventScroll: true })
    })
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

  emits('update:model-value', (props.multiple ? selectedValues : selectedValues[0]) as Multiple extends true ? Value[] : Value)
  emits('selected-option', inputOption as Option)
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
  /**
   * Open the select
   * @description This is used to open the list options
   */
  open: () => {
    popoverComponent.value?.open()
  },
  /**
   * Close the select
   * @description This is used to close the list options
   */
  close: () => {
    popoverComponent.value?.close()
  },
})
</script>

<template>
  <MazPopover
    :id="`${instanceId}-popover`"
    ref="popover"
    v-model="isOpen"
    class="m-select m-reset-css"
    :class="[
      {
        '--is-open': isOpen,
        '--disabled': disabled,
      },
      props.class,
      `--${size}`,
    ]"
    :style
    trigger="click"
    :block
    :transition
    :offset="0"
    :position="listPosition"
    prefer-position="bottom-start"
    fallback-position="top-start"
    :position-reference="`#${instanceId}-popover .m-input-wrapper`"
    @close="emits('close')"
    @open="onOpenList"
  >
    <template #trigger="{ close, open: openPicker, toggle: togglePopover }">
      <MazInput
        :id="instanceId"
        ref="input"
        class="m-select-input"
        v-bind="$attrs"
        :required="required"
        :border-active="isOpen"
        :color="color"
        :model-value="inputValue"
        :size
        :block
        :placeholder
        :label
        :autocomplete
        :disabled
        readonly
        @change="emits('change', $event)"
        @input="emits('input', $event)"
        @focus="emits('focus', $event)"
        @blur="emits('blur', $event)"
        @keydown="mainInputKeyboardHandler"
      >
        <template v-if="$slots['left-icon']" #left-icon>
          <!--
          @slot Add a custom left icon
          @binding {boolean} is-open Current open state of the popover
          @binding {function} close Function to close the popover
          @binding {function} open Function to open the popover
          @binding {function} toggle Function to toggle the popover
        -->
          <slot name="left-icon" :is-open="isOpen" :close="close" :open="openPicker" :toggle="togglePopover" />
        </template>

        <template #right-icon>
          <!--
            @slot Add and replace a custom right icon
            @binding {boolean} is-open Current open state of the popover
            @binding {function} close Function to close the popover
            @binding {function} open Function to open the popover
            @binding {function} toggle Function to toggle the popover
            @default MazChevronDown
          -->
          <slot name="right-icon" :is-open="isOpen" :close="close" :open="openPicker" :toggle="togglePopover">
            <button
              tabindex="-1"
              type="button"
              class="m-select-input__toggle-button maz-custom"
              :aria-label="`${isOpen ? 'collapse' : 'expand'} list of options`"
            >
              <MazChevronDown class="m-select-chevron" />
            </button>
          </slot>
        </template>
      </MazInput>
    </template>

    <template #default="{ close, open: openPicker, toggle: togglePopover }">
      <div
        :id="`${instanceId}-option-list`"
        ref="optionListRef"
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
          ref="searchInput"
          v-model="searchQuery"
          size="sm"
          :disabled
          :color
          :placeholder="messages.searchPlaceholder"
          name="search"
          inputmode="search"
          autocomplete="off"
          block
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

        <div v-else ref="optionListWrapper" class="m-select-list__scroll-wrapper" tabindex="-1">
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
                  @binding {Boolean} is-open - if the popover is open
                  @binding {function} close - function to close the popover
                  @binding {function} open - function to open the popover
                  @binding {function} toggle - function to toggle the popover
              -->
              <slot
                :option="(option as Option)"
                :is-selected="isSelectedOption(option)"
                :is-open="isOpen"
                :close="close"
                :open="openPicker"
                :toggle="togglePopover"
              >
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

  &-input {
    @apply maz-size-full;

    &:not(.--disabled) {
      @apply maz-cursor-pointer;
    }

    &__toggle-button {
      @apply maz-flex maz-h-full maz-bg-transparent maz-pl-0 maz-flex-center;
    }

    &:deep(input) {
      @apply maz-caret-transparent;
    }
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

  &:not(.--disabled):deep(.m-input-input) {
    @apply maz-cursor-pointer;
  }

  &-chevron {
    @apply maz-text-[1.2em] maz-text-muted maz-transition-all maz-duration-300 maz-ease-out;
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
      @apply maz-bg-surface-600 dark:maz-bg-surface-400;

      border-radius: 1000px;
    }

    /* Modern CSS for all browsers (fallback) */
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--maz-background-600)) transparent;
  }

  &__no-results {
    @apply maz-flex maz-p-4 maz-flex-center;
  }

  &-item {
    @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-3 maz-truncate maz-rounded maz-bg-transparent maz-px-3 maz-py-2 maz-text-start maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-surface-600 dark:focus-within:maz-bg-surface-400 hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-outline-none maz-border maz-border-solid maz-border-transparent;

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
        @apply maz-border-[var(--selected-text-color)];
      }

      &.--transparent {
        @apply maz-bg-surface;
      }
    }
  }
}
</style>
