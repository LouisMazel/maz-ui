<script
  lang="ts"
  setup
  generic="T extends ModelValueSimple, U extends MazSelectOption"
>
import type { Color, ModelValueSimple, Position, Size } from '@components/types'
import MazInput from '@components/MazInput.vue'
import { useInstanceUniqId } from '@composables/useInstanceUniqId'
import { useStringMatching } from '@composables/useStringMatching'
import { vClosable } from '@directives/vClosable'
import { debounceCallback } from '@helpers/debounceCallback'
import { normalizeString } from '@helpers/normalizeString'

import {
  type ComponentPublicInstance,
  computed,
  defineAsyncComponent,
  type HTMLAttributes,
  nextTick,
  onBeforeMount,
  ref,
} from 'vue'

export type NormalizedOption = Record<string, ModelValueSimple>
export interface MazSelectOptionWithOptGroup {
  label: string
  options: (NormalizedOption | string | number | boolean)[]
}
export type MazSelectOption =
  | NormalizedOption
  | string
  | number
  | boolean
  | MazSelectOptionWithOptGroup

export interface MazSelectProps<T extends ModelValueSimple, U extends MazSelectOption> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the select */
  id?: string
  /** The value of the select */
  modelValue?: T | T[]
  /** The options of the select */
  options?: U[]
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
   * @default 'bottom left'
   */
  listPosition?: Position
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
  size?: Size
  /**
   * The color of the select
   * @default 'primary'
   */
  color?: Color
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
  /** if true, the option list is opened by default */
  open?: boolean
  /** Enable the multiple selection */
  multiple?: boolean
  /** Make the input required in the form */
  required?: boolean
  /** Disable the component */
  disabled?: boolean
  /** The input will be displayed in full width */
  block?: boolean
  /** The exclude selectors for the v-closable directive - will exclude the elements from the directive */
  excludeSelectors?: string[]
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
  listPosition: 'bottom left',
  itemHeight: undefined,
  maxListHeight: 240,
  maxListWidth: undefined,
  minListWidth: undefined,
  minListHeight: undefined,
  size: 'md',
  color: 'primary',
  options: undefined,
  excludeSelectors: undefined,
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
  'close': [value?: Event]
  /**
   * On list is opened
   * @event 'open'
   * @property {boolean} value - if the list is opened or not
   */
  'open': [value: boolean]
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
  'focus': [value: Event]
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
   * @property {ModelValueSimple | ModelValueSimple[]} value - the new value
   */
  'update:model-value': [value: T | T[]]
  /**
   * On selected value, returns the option object
   * @event 'selected-option'
   * @property {MazSelectOption} value - the option object
   */
  'selected-option': [value: U]
}>()

const MazCheckbox = defineAsyncComponent(() => import('@components/MazCheckbox.vue'))

const SearchIcon = defineAsyncComponent(() => import('@icons/magnifying-glass.svg'))
const ChevronDownIcon = defineAsyncComponent(() => import('@icons/chevron-down.svg'))
const NoSymbolIcon = defineAsyncComponent(() => import('@icons/no-symbol.svg'))

defineExpose<{
  openList: typeof openList
  closeList: typeof closeList
}>({
  /** Method to open the option list */
  openList,
  /** Method to close the option list */
  closeList,
})

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
  providedId: props.id,
})

function getOptionPayload(option: string | number | boolean): NormalizedOption {
  return {
    [props.optionValueKey]: option,
    [props.optionLabelKey]: option,
    [props.optionInputValueKey]: option,
  }
}
function getNormalizedOptionPayload(option: NormalizedOption): NormalizedOption {
  return {
    ...option,
    [props.optionValueKey]: option[props.optionValueKey],
    [props.optionLabelKey]: option[props.optionLabelKey],
    [props.optionInputValueKey]: option[props.optionInputValueKey],
  }
}

function getNormalizedOptions(options: U[]) {
  const normalizedOptions: NormalizedOption[] = []

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
      normalizedOptions.push(getNormalizedOptionPayload(option as NormalizedOption))
    }
  }

  return normalizedOptions
}

const optionsNormalized = computed<NormalizedOption[]>(() => getNormalizedOptions(props.options ?? []))

const selectedOptions = computed(
  () =>
    optionsNormalized.value?.filter((option) => {
      return props.multiple
        ? Array.isArray(props.modelValue)
          ? props.modelValue.includes(option[props.optionValueKey] as T)
          && !isNullOrUndefined(option[props.optionValueKey])
          : false
        : props.modelValue === option[props.optionValueKey]
          && !isNullOrUndefined(option[props.optionValueKey])
    }) ?? [],
)

onBeforeMount(() => {
  if (!props.options?.length) {
    console.warn('[maz-ui](MazSelect) you must provide options')
  }

  updateTmpModelValueIndex()
})

const mazSelectElement = ref<HTMLDivElement>()
const mazInputComponent = ref<ComponentPublicInstance<typeof MazInput>>()
const searchInputComponent = ref<ComponentPublicInstance<typeof MazInput>>()
const optionListElement = ref<HTMLDivElement>()

function isNullOrUndefined(value: unknown) {
  return value === undefined || value === null
}

function isSelectedOption(option: NormalizedOption) {
  const hasOption
      = selectedOptions.value?.some(
        selectedOption => selectedOption[props.optionValueKey] === option[props.optionValueKey],
      ) ?? false

  return hasOption && !isNullOrUndefined(option[props.optionValueKey])
}

const mazInputValue = computed(() => {
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

const listTransition = computed(() =>
  props.listPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert',
)

const searchQuery = ref<string>('')
const query = ref<string>('')

function searchInValue(value?: ModelValueSimple, query?: string) {
  return query && value && normalizeString(value).includes(normalizeString(query))
}

function getFilteredOptionWithQuery(query: string) {
  return query
    ? optionsNormalized.value?.filter((option) => {
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
    : optionsNormalized.value
}

const optionList = computed(() => {
  return props.searchFunction && props.search && searchQuery.value
    ? getNormalizedOptions(props.searchFunction(searchQuery.value, props.options ?? []) ?? [])
    : getFilteredOptionWithQuery(searchQuery.value)
})

async function closeList(event?: Event) {
  if (!hasListOpened.value)
    return
  if (
    event
    && (('relatedTarget' in event
      && mazSelectElement.value?.contains(event.relatedTarget as Node))
    || event.type === 'keydown')
  ) {
    return event.preventDefault()
  }

  const eventTargetId
      = event
      && 'relatedTarget' in event
      && event.relatedTarget instanceof HTMLElement
      && event.relatedTarget.getAttribute('id')

  if (props.excludeSelectors?.includes(`#${eventTargetId}`)) {
    return event?.preventDefault()
  }

  await nextTick()
  listOpened.value = false
  tmpModelValueIndex.value = 0
  emits('close', event)
}

async function openList(event: Event) {
  if (props.disabled || hasListOpened.value)
    return

  event?.preventDefault()
  listOpened.value = true
  await scrollToOptionIndex()
  emits('focus', event)
  emits('open', listOpened.value)
}

function focusMainInput() {
  ;(mazInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
}
function emitInputMainInput() {
  ;(mazInputComponent.value?.$el as HTMLElement).querySelector('input')?.dispatchEvent(new Event('input'))
}

function toggleList(event: Event) {
  if (listOpened.value) {
    closeList(event)
  }
  else {
    focusMainInput()
  }
}

function focusSearchInputAndSetQuery(q: string) {
  searchQuery.value = q
  ;(searchInputComponent.value?.$el as HTMLElement).querySelector('input')?.focus()
}

function searchOptionWithQuery(keyPressed: string) {
  if (keyPressed === 'Backspace' && query.value.length > 0) {
    query.value = query.value.slice(0, -1)
  }
  else {
    query.value += keyPressed
  }

  const filteredOptions = getFilteredOptionWithQuery(query.value)

  if (filteredOptions?.length) {
    tmpModelValueIndex.value = optionList.value?.findIndex(
      option => option[props.optionValueKey] === filteredOptions[0][props.optionValueKey],
    )

    if (typeof tmpModelValueIndex.value === 'number' && tmpModelValueIndex.value >= 0) {
      scrollToOptionIndex(tmpModelValueIndex.value)
    }
  }

  debounceCallback(() => {
    query.value = ''
  }, 1000)
}

function mainInputKeyboardHandler(event: KeyboardEvent) {
  const keyPressed = event.key

  if (/^[\dA-Za-z\u0400-\u04FF]$/.test(keyPressed)) {
    event.preventDefault()
    openList(event)

    if (props.search) {
      focusSearchInputAndSetQuery(keyPressed)
    }
    else {
      searchOptionWithQuery(keyPressed)
    }
  }
  else {
    keyboardHandler(event)
  }
}

function keyboardHandler(event: KeyboardEvent, shouldSelectWithSpace = true) {
  const code = event.code

  const isArrow = ['ArrowUp', 'ArrowDown'].includes(code)
  const shouldSelect = (shouldSelectWithSpace ? ['Enter', 'Space'] : ['Enter']).includes(code)
  const shouldCloseList = code === 'Escape' && hasListOpened.value

  if (isArrow) {
    arrowHandler(event, tmpModelValueIndex.value)
  }
  else if (shouldSelect) {
    enterHandler(event, tmpModelValueIndex.value)
  }
  else if (shouldCloseList) {
    closeList(event)
  }
}

function arrowHandler(event: KeyboardEvent, currentIndex?: number) {
  event.preventDefault()
  const code = event.code

  if (!hasListOpened.value)
    openList(event)

  const optionsLength = optionList.value?.length

  if (!optionsLength) {
    return
  }

  if (typeof currentIndex === 'number') {
    if (currentIndex === optionsLength - 1 && code === 'ArrowDown') {
      tmpModelValueIndex.value = 0
    }
    else if (currentIndex === 0 && code === 'ArrowUp') {
      tmpModelValueIndex.value = optionsLength - 1
    }
    else {
      tmpModelValueIndex.value = code === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1
    }
  }
  else {
    tmpModelValueIndex.value = code === 'ArrowDown' ? 0 : optionsLength - 1
  }

  scrollToOptionIndex(tmpModelValueIndex.value)
}

function enterHandler(event: KeyboardEvent, currentIndex?: number) {
  if (!hasListOpened.value) {
    return
  }

  event.preventDefault()

  const newValue = currentIndex
    ? optionList.value?.[currentIndex] ?? optionList.value?.[0]
    : optionList.value?.[0]

  if (!isNullOrUndefined(newValue)) {
    updateValue(newValue as Record<string, ModelValueSimple>)
  }
}

async function scrollToOptionIndex(index?: number) {
  await nextTick()

  if (typeof index !== 'number') {
    updateTmpModelValueIndex()
  }

  const selectedIndex = index ?? tmpModelValueIndex.value

  if (typeof selectedIndex === 'number' && selectedIndex >= 0) {
    const item = optionListElement.value
      ?.querySelectorAll('.m-select-list-item')

    item?.[selectedIndex]?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'start',
    })
  }
}

function updateTmpModelValueIndex(inputOption?: NormalizedOption) {
  const index = optionList.value?.findIndex((option) => {
    if (props.multiple && Array.isArray(props.modelValue)) {
      if (inputOption) {
        return inputOption[props.optionValueKey] === option[props.optionValueKey]
      }
      const values = [...props.modelValue].reverse()
      return values[0] === option[props.optionValueKey]
    }
    else {
      return selectedOptions.value?.[0]?.[props.optionValueKey] === option[props.optionValueKey]
    }
  })

  tmpModelValueIndex.value = index && index >= 0 ? index : 0
}

function updateValue(inputOption: NormalizedOption, mustCloseList = true) {
  if (mustCloseList && !props.multiple) {
    nextTick(() => closeList())
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
  updateTmpModelValueIndex(inputOption)
  focusMainInput()
}
</script>

<template>
  <div
    ref="mazSelectElement"
    v-closable="{
      exclude: excludeSelectors,
      handler: closeList,
    }"
    class="m-select m-reset-css"
    :class="[
      { '--is-open': hasListOpened, '--disabled': disabled, '--block': block },
      props.class,
      `--${size}`,
    ]"
    :style="[style, { '--keyboard-selected-bg-color': keyboardSelectedBgColor, '--selected-bg-color': selectedBgColor, '--selected-text-color': selectedTextColor }]"
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
      :size="size"
      block
      :autocomplete
      :disabled="disabled"
      @focus.prevent.stop="openList"
      @blur.prevent.stop="closeList"
      @click.prevent.stop="openList"
      @change="emits('change', $event)"
      @input="emits('input', $event)"
      @keydown="mainInputKeyboardHandler"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          type="button"
          class="m-select-input__toggle-button maz-custom"
          :aria-label="`${hasListOpened ? 'collapse' : 'expand'} list of options`"
          @click.stop="toggleList"
        >
          <ChevronDownIcon class="m-select-chevron maz-text-xl" />
        </button>
      </template>
    </MazInput>
    <Transition :name="listTransition">
      <div
        v-if="hasListOpened"
        ref="optionListElement"
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
          minHeight: `${minListHeight}px`,
          minWidth: `${minListWidth}px`,
        }"
      >
        <MazInput
          v-if="search"
          ref="searchInputComponent"
          v-model="searchQuery"
          size="sm"
          :color="color"
          :placeholder="searchPlaceholder"
          name="search"
          inputmode="search"
          block
          autocomplete="off"
          tabindex="-1"
          class="m-select-list__search-input maz-flex-none"
          :left-icon="SearchIcon"
          @keydown="keyboardHandler($event, false)"
          @update:model-value="tmpModelValueIndex = 0"
        />
        <!--
          @slot No results slot - Displayed when no results corresponding with search query
        -->
        <slot v-if="!optionList || optionList.length <= 0" name="no-results">
          <span class="m-select-list__no-results">
            <NoSymbolIcon class="maz-h-6 maz-w-6 maz-text-normal" />
          </span>
        </slot>
        <div v-else class="m-select-list__scroll-wrapper" tabindex="-1">
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
              tabindex="-1"
              type="button"
              class="m-select-list-item maz-custom maz-flex-none"
              :class="[
                {
                  '--is-keyboard-selected': tmpModelValueIndex === i,
                  '--is-selected': isSelectedOption(option),
                  '--is-none-value': isNullOrUndefined(option[optionValueKey]),
                },
              ]"
              :style="itemHeight ? { height: `${itemHeight}px` } : undefined"
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
    </Transition>
  </div>
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

  &.--block {
    @apply maz-w-full;
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
    @apply maz-text-[1.2em] maz-text-normal maz-transition-all maz-duration-300 maz-ease-out;
  }

  &.--is-open {
    & .m-select-chevron {
      transform: rotate(180deg);
    }
  }

  .m-select-list {
    @apply maz-absolute maz-z-default-backdrop maz-flex maz-flex-col maz-gap-1 maz-overflow-hidden maz-rounded maz-bg-color maz-p-2 maz-elevation dark:maz-border dark:maz-border-color-light;

    &-optgroup {
      @apply maz-flex-none maz-p-0.5 maz-text-start maz-text-[0.875em] maz-text-muted;
    }

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

    &__scroll-wrapper {
      @apply maz-flex maz-flex-1 maz-flex-col maz-gap-1 maz-overflow-auto;
    }

    &__no-results {
      @apply maz-flex maz-p-4 maz-flex-center;
    }

    &-item {
      @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-3 maz-truncate maz-rounded maz-bg-transparent maz-px-3 maz-py-[0.5em] maz-text-start maz-text-[1em] maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-color-light hover:maz-bg-color-light;

      span {
        @apply maz-truncate;
      }

      &.--is-keyboard-selected {
        @apply maz-bg-color-light dark:maz-bg-color-lighter;

        &.--is-selected {
          background-color: var(--keyboard-selected-bg-color);

          &:hover {
            background-color: var(--keyboard-selected-bg-color);
          }
        }
      }

      &.--is-none-value {
        @apply maz-text-muted;
      }

      &.--is-selected {
        color: var(--selected-text-color);
        background-color: var(--selected-bg-color);

        &:hover {
          background-color: var(--selected-bg-color);
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
