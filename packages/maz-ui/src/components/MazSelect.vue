<script
  lang="ts"
  setup
  generic="Option extends MazSelectOption, Value extends MazInputValue, Multiple extends boolean"
>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { GenericInstanceType } from '@maz-ui/utils/ts-helpers/GenericInstanceType'
import type { HTMLAttributes } from 'vue'
import type { MazInputValue } from './MazInput.vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor, MazSize } from './types'
import { MazMagnifyingGlass } from '@maz-ui/icons/lazy/MazMagnifyingGlass'
import { MazChevronDown } from '@maz-ui/icons/raw/MazChevronDown'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { debounceCallback } from '@maz-ui/utils/helpers/debounceCallback'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { normalizeString } from '@maz-ui/utils/helpers/normalizeString'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { hasSlotContent } from '../utils/hasSlotContent'
import { SIZE_TEXT_CLASS } from './constants.ts'
import MazIcon from './MazIcon.vue'
import MazInput from './MazInput.vue'
import MazPopover from './MazPopover.vue'
import SelectListbox from './MazSelect/SelectListbox.vue'

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

export interface MazSelectProps<Value extends MazInputValue, Option extends MazSelectOption, Multiple extends boolean> {
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
   * Static label displayed above the input field. Unlike the floating label, this remains fixed
   * @type {string}
   * @example "User Information"
   */
  topLabel?: string
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
  /**
   * The prefer position of the list
   * @type {MazPopoverProps['preferPosition']}
   * @default 'bottom-start'
   */
  preferPosition?: MazPopoverProps['preferPosition']
  /**
   * The fallback position of the list
   * @type {MazPopoverProps['fallbackPosition']}
   * @default 'top-start'
   */
  fallbackPosition?: MazPopoverProps['fallbackPosition']
  /** The height of the option list item */
  itemHeight?: number
  /**
   * The max height of the option list
   * @default 240
   */
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
   * Tolerance of the search to typos: the minimal similarity (from 0 to 1) of a whole option with the query, for the
   * options that do not contain it. `1` disables the typo tolerance, `0` matches any option.
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

const {
  id = undefined,
  class: classProp = undefined,
  multiple = false,
  style = undefined,
  modelValue = undefined,
  optionValueKey = 'value',
  optionLabelKey = 'label',
  optionInputValueKey = 'label',
  listPosition = 'auto',
  preferPosition = 'bottom-start',
  fallbackPosition = 'top-start',
  itemHeight = undefined,
  maxListHeight = 240,
  maxListWidth = undefined,
  minListWidth = undefined,
  minListHeight = undefined,
  color = 'primary',
  transition = 'scale-fade',
  searchThreshold = 0.75,
  autocomplete = 'off',
  formatInputValue,
  translations,
  searchFunction,
  search,
  options,
  label,
  topLabel,
  placeholder,
} = defineProps<MazSelectProps<Value, Option, Multiple> & {
  multiple?: boolean
}>()

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

const popoverComponent = useTemplateRef('popover')
const inputRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('input')
const searchInputRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('searchInput')
const listboxRef = useTemplateRef('listbox')

// Readable for every color: a neutral one (no chroma, e.g. a very light preset `secondary`) goes near the text color, a vivid one keeps its tone
const selectedTextColor = computed(() => `light-dark(oklch(from var(--maz-${color}) min(l, calc(0.25 + c * 2)) c h), oklch(from var(--maz-${color}) max(l, calc(0.92 - c * 2)) c h))`)
// Tinted from the text color: a neutral color stays visible (its own 10% would vanish on the surface)
const selectedBgColor = 'color-mix(in srgb, var(--selected-text-color) 12%, transparent)'

const { t } = useTranslations()
const messages = computed(() => ({
  searchPlaceholder: translations?.searchPlaceholder || t('select.searchPlaceholder'),
} satisfies MazUiTranslationsNestedSchema['select']))

const isOpen = defineModel('open', { default: false })

const { size } = useGlobalConfig<{ size: MazSize }>('MazSelect', { size: 'md' })

const instanceId = useInstanceUniqId({
  componentName: 'MazSelect',
  providedId: id,
})

function getOptionPayload(option: string | number | boolean) {
  return {
    [optionValueKey]: option,
    [optionLabelKey]: option,
    [optionInputValueKey]: option,
  } satisfies MazSelectNormalizedOption
}
function getNormalizedOptionPayload(option: MazSelectNormalizedOption) {
  return {
    ...option,
    [optionValueKey]: option[optionValueKey],
    [optionLabelKey]: option[optionLabelKey],
    [optionInputValueKey]: option[optionInputValueKey],
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

const optionsNormalized = computed(() => getNormalizedOptions(options ?? [] satisfies MazSelectNormalizedOption[]))

function isOptionInSelection(option: MazSelectNormalizedOption): boolean {
  if (isNullOrUndefined(option[optionValueKey])) {
    return false
  }

  if (multiple) {
    return Array.isArray(modelValue) && modelValue.includes(option[optionValueKey] as Value)
  }

  return modelValue === option[optionValueKey]
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
      selectedOption => selectedOption[optionValueKey] === option[optionValueKey],
    ) ?? false

  return hasOption && !isNullOrUndefined(option[optionValueKey])
}

const inputValue = computed(() => {
  if (multiple && modelValue && Array.isArray(modelValue)) {
    const values = modelValue
      .map(
        value =>
          optionsNormalized.value?.find(option => option[optionValueKey] === value)?.[
            optionInputValueKey
          ],
      )

    if (formatInputValue) {
      return formatInputValue(values as unknown as Multiple extends true ? Value[] : Value)
    }

    return values.join(', ')
  }

  const selectedOption = optionsNormalized.value?.find(
    option => option[optionValueKey] === modelValue,
  )

  const value = isNullOrUndefined(modelValue)
    ? undefined
    : selectedOption?.[optionInputValueKey]

  if (formatInputValue) {
    return formatInputValue(value as unknown as Multiple extends true ? Value[] : Value)
  }

  return value
})

const searchQuery = ref<string>()
const query = ref<string>('')

type FuzzySearchModule = typeof import('@maz-ui/utils/helpers/fuzzySearch')

/** The search engine is loaded with the search input: the keyboard search of a closed select only needs substrings */
const fuzzySearchModule = shallowRef<FuzzySearchModule>()

watch(() => search, async (enabled) => {
  if (enabled && !fuzzySearchModule.value) {
    fuzzySearchModule.value = await import('@maz-ui/utils/helpers/fuzzySearch')
  }
}, { immediate: true })

const searchableOptions = computed(() => optionsNormalized.value.filter(option => !option.isOptGroup))
const hasOptGroups = computed(() => searchableOptions.value.length !== optionsNormalized.value.length)

const optionsSearch = computed(() => fuzzySearchModule.value?.createFuzzySearch(searchableOptions.value, {
  keys: [
    option => option[optionLabelKey],
    {
      key: option => option[optionInputValueKey],
      weight: 0.9,
    },
    {
      key: option => option[optionValueKey],
      weight: 0.8,
    },
  ],
  typoThreshold: searchThreshold,
  sort: hasOptGroups.value ? 'original' : 'relevance',
}))

function searchInValue(value: unknown, query: string) {
  return (typeof value === 'string' || typeof value === 'number') && normalizeString(value).includes(normalizeString(query))
}

/** The matched options under the headers of their groups, in the order of the list */
function withOptGroups(matchedOptions: MazSelectNormalizedOption[]) {
  const matched = new Set(matchedOptions)
  const result: MazSelectNormalizedOption[] = []
  let group: MazSelectNormalizedOption | undefined

  for (const option of optionsNormalized.value) {
    if (option.isOptGroup) {
      group = option
    }
    else if (matched.has(option)) {
      if (group) {
        result.push(group)
        group = undefined
      }

      result.push(option)
    }
  }

  return result
}

function getFilteredOptionWithQuery(query?: string) {
  if (!query) {
    return optionsNormalized.value
  }

  const matchedOptions = optionsSearch.value?.search(query).map(result => result.item)
    ?? searchableOptions.value.filter(option => [option[optionLabelKey], option[optionInputValueKey], option[optionValueKey]].some(value => searchInValue(value, query)))

  return hasOptGroups.value
    ? withOptGroups(matchedOptions)
    : matchedOptions
}

const optionList = computed(() => {
  if (searchFunction && search && searchQuery.value) {
    return getNormalizedOptions(searchFunction(searchQuery.value, options ?? []) ?? [])
  }

  return getFilteredOptionWithQuery(searchQuery.value)
})

const listboxId = computed(() => `${instanceId.value}-listbox`)
const hasListbox = computed(() => isOpen.value && !!optionList.value?.length)
const listboxLabel = computed(() => label || topLabel || placeholder || t('aria.options'))

function getOptionId(index: number) {
  return `${instanceId.value}-option-${index}`
}

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
    option => option[optionValueKey] === filteredOptions[0][optionValueKey],
  )

  if (typeof optionIndex !== 'number' || optionIndex === -1) {
    return
  }

  scrollToOptionIndex(optionIndex)

  debounceCallback(() => {
    query.value = ''
  }, 1000)
}

// eslint-disable-next-line regexp/no-unused-capturing-group
const isLetterOrNumberRegex = /^([\dA-Za-z\u0400-\u04FF])$/

function mainInputKeyboardHandler(event: KeyboardEvent) {
  // Ignore keyboard shortcuts with modifier keys
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

  const keyPressed = event.key

  if ((keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp' || keyPressed === ' ' || isLetterOrNumberRegex.test(keyPressed)) && !isOpen.value) {
    event.preventDefault()
    popoverComponent.value?.open()
  }

  if (isLetterOrNumberRegex.test(keyPressed) && search) {
    event.preventDefault()
    event.stopPropagation()
    focusSearchInputAndSetQuery(keyPressed)
  }
}

async function scrollToOptionIndex(index?: number) {
  await nextTick()

  if (typeof index !== 'number' || index < 0) {
    return
  }

  listboxRef.value?.scrollToIndex(index, {
    center: true,
    focus: true,
  })
}

function updateValue(inputOption: MazSelectNormalizedOption, mustCloseList = true) {
  if (mustCloseList && !multiple) {
    nextTick(() => {
      popoverComponent.value?.close()
    })
  }

  searchQuery.value = ''

  const isAlreadySelected = selectedOptions.value?.some(
    option => option[optionValueKey] === inputOption[optionValueKey],
  )

  let newValue = selectedOptions.value

  if (isAlreadySelected && multiple) {
    newValue = newValue?.filter(
      option => option[optionValueKey] !== inputOption[optionValueKey],
    )
  }
  else if (multiple) {
    newValue.push(inputOption)
  }
  else {
    newValue = [inputOption]
  }

  const selectedValues = newValue.map(option => option[optionValueKey])

  emits('update:model-value', (multiple ? selectedValues : selectedValues[0]) as Multiple extends true ? Value[] : Value)
  emits('selected-option', inputOption as Option)
  emitInputMainInput()
  focusMainInput()
}

function focusEdgeOption(event: KeyboardEvent) {
  const itemsElements = document.querySelectorAll<HTMLElement>(`#${instanceId.value}-option-list .m-select-list-item`)

  if (!itemsElements.length || !(document.activeElement instanceof HTMLElement) || !document.activeElement.classList.contains('m-select-list-item'))
    return

  event.preventDefault()
  itemsElements[event.key === 'Home'
    ? 0
    : itemsElements.length - 1]?.focus()
}

function keydownHandler(event: KeyboardEvent) {
  const keyPressed = event.key

  if (keyPressed === 'Home' || keyPressed === 'End') {
    focusEdgeOption(event)
  }
  else if (keyPressed === 'ArrowDown' || keyPressed === 'ArrowUp') {
    event.preventDefault()
    const itemLength = optionList.value?.length
    if (!itemLength)
      return

    const currentElement = document.activeElement as HTMLElement
    const itemsElements = document.querySelectorAll<HTMLElement>(`#${instanceId.value}-option-list .m-select-list-item`)
    const currentIndex = [...itemsElements].indexOf(currentElement)

    if (currentIndex === -1) {
      (itemsElements[0] as HTMLElement)?.focus({ preventScroll: true })
      return
    }

    const nextIndex = keyPressed === 'ArrowDown'
      ? (currentIndex + 1) % itemLength
      : (currentIndex - 1 + itemLength) % itemLength

    itemsElements[nextIndex]?.focus()
  }
  else if (!search && isLetterOrNumberRegex.test(keyPressed)) {
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

onBeforeUnmount(() => {
  document.removeEventListener('keydown', keydownHandler)
})

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
    class="m-select m-reset-css maz:relative maz:inline-flex maz:align-top"
    :class="[
      {
        '--is-open': isOpen,
        '--disabled': disabled,
      },
      classProp,
      `--${size}`,
      SIZE_TEXT_CLASS[size],
    ]"
    :style
    trigger="click"
    :block
    :transition
    :offset="0"
    :position="listPosition"
    :disabled
    :prefer-position
    :fallback-position
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
        :top-label
        :autocomplete
        :disabled
        readonly
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="String(isOpen)"
        :aria-controls="isOpen ? (hasListbox ? listboxId : `${instanceId}-option-list`) : undefined"
        @change="emits('change', $event)"
        @input="emits('input', $event)"
        @focus="emits('focus', $event)"
        @blur="emits('blur', $event)"
        @keydown="mainInputKeyboardHandler"
      >
        <template v-if="hasSlotContent($slots['start-icon'])" #start-icon>
          <!--
          @slot Add a custom inline-start icon (left in LTR, right in RTL)
          @binding {boolean} is-open Current open state of the popover
          @binding {function} close Function to close the popover
          @binding {function} open Function to open the popover
          @binding {function} toggle Function to toggle the popover
        -->
          <slot name="start-icon" :is-open="isOpen" :close="close" :open="openPicker" :toggle="togglePopover" />
        </template>

        <template #end-icon>
          <!--
            @slot Add and replace a custom inline-end icon (right in LTR, left in RTL)
            @binding {boolean} is-open Current open state of the popover
            @binding {function} close Function to close the popover
            @binding {function} open Function to open the popover
            @binding {function} toggle Function to toggle the popover
            @default MazChevronDown
          -->
          <slot name="end-icon" :is-open="isOpen" :close="close" :open="openPicker" :toggle="togglePopover">
            <button
              tabindex="-1"
              :disabled
              type="button"
              class="m-select-input__toggle-button maz-custom"
              :aria-label="isOpen ? t('aria.hideOptions') : t('aria.showOptions')"
            >
              <MazIcon :icon="MazChevronDown" class="m-select-chevron" />
            </button>
          </slot>
        </template>
      </MazInput>
    </template>

    <template #default="{ close, open: openPicker, toggle: togglePopover }">
      <div
        :id="`${instanceId}-option-list`"
        class="m-select-list"
        :class="[`--${size}`, SIZE_TEXT_CLASS[size]]"
        :style="[{
          'maxHeight': `${maxListHeight}px`,
          'maxWidth': `${maxListWidth}px`,
          'minHeight': `${minListHeight}px`,
          'minWidth': `${minListWidth}px`,
          '--selected-bg-color': selectedBgColor,
          '--selected-text-color': selectedTextColor,
        }]"
      >
        <div v-if="search" class="m-select-list__search-wrapper">
          <MazInput
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
            class="m-select-list__search-input maz:flex-none"
            :start-icon="MazMagnifyingGlass"
            @update:model-value="updateListPosition"
          />
        </div>
        <SelectListbox
          :id="listboxId"
          ref="listbox"
          :options="optionList ?? []"
          :label="listboxLabel"
          :get-option-id="getOptionId"
          :is-selected="isSelectedOption"
          :is-empty-value="option => isNullOrUndefined(option[optionValueKey])"
          :label-key="optionLabelKey"
          :multiple
          :color
          :item-height
          @select="option => updateValue(option, true)"
        >
          <template v-if="$slots['no-results']" #no-results>
            <!--
              @slot No results slot - Displayed when no results corresponding with search query
            -->
            <slot name="no-results" />
          </template>

          <template v-if="$slots.optgroup" #optgroup="{ label: optgroupLabel }">
            <!--
              @slot Custom optgroup label
                @binding {String} label - the label of the optgroup
            -->
            <slot name="optgroup" :label="optgroupLabel" />
          </template>

          <template #default="{ option, isSelected }">
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
              :is-selected="isSelected"
              :is-open="isOpen"
              :close="close"
              :open="openPicker"
              :toggle="togglePopover"
            >
              <span>
                {{ option[optionLabelKey] }}
              </span>
            </slot>
          </template>
        </SelectListbox>
      </div>
    </template>
  </MazPopover>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-select {
  &.--disabled {
    .m-select-input {
      @apply maz:disabled-cursor;
    }
  }

  &:not(.--disabled):deep(.m-input-input) {
    @apply maz:cursor-interactive;
  }

  &.--is-open {
    & .m-select-chevron {
      transform: rotate(180deg);
    }
  }

  & button.maz-custom {
    @apply maz:cursor-interactive maz:appearance-none maz:border-none;

    &:disabled {
      @apply maz:disabled-cursor;
    }
  }
}

.m-select-chevron {
  @apply maz:text-[1.2em] maz:text-muted maz:transition-all maz:duration-300 maz:ease-out;
}

.m-select-input {
  @apply maz:w-full;
  @apply maz:cursor-interactive;

  &:deep(input) {
    @apply maz:caret-transparent;
  }
}

.m-select-input__toggle-button {
  @apply maz:flex maz:h-full maz:bg-transparent maz:py-1 maz:ps-0 maz:pe-2 maz:flex-center;
}

.m-select-list {
  @apply maz:z-default-backdrop maz:flex maz:flex-col maz:gap-1 maz:overflow-hidden maz:rounded-md maz:bg-container maz:drop-shadow-md maz:shadow-elevation;

  min-inline-size: 3.5rem;
}

.m-select-list__search-wrapper {
  @apply maz:px-2 maz:pt-2;
}
</style>
