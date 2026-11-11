<script lang="ts" setup generic="T">
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { FuzzySearchKey, FuzzySearchSegment } from '@maz-ui/utils/helpers/fuzzySearch'
import type { HTMLAttributes } from 'vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor, MazSize } from './types'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { createFuzzySearch, highlightMatches } from '@maz-ui/utils/helpers/fuzzySearch'
import { computed, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useFuzzySearch } from '../composables/useFuzzySearch'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { SIZE_TEXT_CLASS } from './constants.ts'
import MazInput from './MazInput.vue'
import MazPopover from './MazPopover.vue'
import SelectListbox from './MazSelect/SelectListbox.vue'

export interface MazInputAutocompleteSourceContext {
  /** Aborted when a new query is typed before the end of the request */
  signal: AbortSignal
}

export interface MazInputAutocompleteProps<T> {
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
  /** The id of the input */
  id?: string
  /**
   * The text of the input
   * @model
   */
  modelValue?: string
  /**
   * The chosen suggestion, `undefined` once the text is edited
   * @model
   * @type {T}
   */
  selected?: T
  /**
   * The suggestions searched locally (fuzzy search: prefixes, words in any order, scattered letters, typos, accents)
   * @type {T[]}
   */
  items?: T[]
  /**
   * Load the suggestions of a query (an API...): they are displayed as they are, in their order. The previous request is
   * aborted with the `signal` when a new query is typed
   * @type {(query: string, context: { signal: AbortSignal }) => Promise<T[]> | T[]}
   */
  source?: (query: string, context: MazInputAutocompleteSourceContext) => Promise<T[]> | T[]
  /**
   * The key or the function giving the text of a suggestion (displayed in the list and in the input once chosen)
   * @type {string | ((item: T) => string)}
   * @default 'label'
   */
  itemLabel?: string | ((item: T) => string)
  /**
   * The key or the function giving the identity of a suggestion (to find the selected one)
   * @type {string | ((item: T) => unknown)}
   * @default 'value'
   */
  itemValue?: string | ((item: T) => unknown)
  /**
   * The keys searched in the `items`, with their weight (see `fuzzySearch` of `@maz-ui/utils`)
   * @type {FuzzySearchKey<T>[]}
   * @default the label of the items
   */
  searchKeys?: FuzzySearchKey<T>[]
  /**
   * Tolerance of the search in the `items` to typos: the minimal similarity (from 0 to 1) of a whole value with the
   * query. `1` disables the typo tolerance
   * @default 0.75
   */
  searchThreshold?: number
  /**
   * Minimal number of characters typed to search
   * @default 1
   */
  minChars?: number
  /**
   * Delay in ms between the last character typed and the call of the `source`
   * @default 300
   */
  debounce?: number
  /** Maximum number of suggestions displayed */
  limit?: number
  /**
   * Highlight the characters matching the query in the suggestions
   * @default true
   */
  highlight?: boolean
  /**
   * Open the suggestions on focus, with `min-chars` at `0` it lists every item
   * @default false
   */
  openOnFocus?: boolean
  /** The label of the input */
  label?: string
  /** Static label displayed above the input */
  topLabel?: string
  /** The placeholder of the input */
  placeholder?: string
  /**
   * The size of the input
   * @default 'md'
   */
  size?: MazSize
  /**
   * The color of the input and of the selected suggestion
   * @default 'primary'
   */
  color?: MazColor
  /** Disable the component */
  disabled?: boolean
  /** The input will be displayed in full width */
  block?: boolean
  /**
   * The max height of the list
   * @default 240
   */
  maxListHeight?: number
  /**
   * The position of the list
   * @type {MazPopoverProps['position']}
   * @default 'auto'
   */
  listPosition?: MazPopoverProps['position']
  /**
   * The transition of the list
   * @type {MazPopoverProps['transition']}
   * @default 'scale-fade'
   */
  transition?: MazPopoverProps['transition']
  /**
   * The translations of the component
   * @type {Partial<MazUiTranslationsNestedSchema['inputAutocomplete']>}
   * @default { noResults: 'No results', loading: 'Loading...', error: 'An error occurred, try again', results: 'Results: {count}' }
   */
  translations?: Partial<MazUiTranslationsNestedSchema['inputAutocomplete']>
}

defineOptions({
  inheritAttrs: false,
})

const {
  id,
  style,
  class: classProp,
  items,
  source,
  itemLabel = 'label',
  itemValue = 'value',
  searchKeys,
  searchThreshold = 0.75,
  minChars = 1,
  debounce = 300,
  limit,
  highlight = true,
  openOnFocus = false,
  label,
  topLabel,
  placeholder,
  color = 'primary',
  disabled,
  block,
  maxListHeight = 240,
  listPosition = 'auto',
  transition = 'scale-fade',
  translations,
} = defineProps<MazInputAutocompleteProps<T>>()

const emits = defineEmits<{
  /**
   * A suggestion is chosen
   * @property {T} item - the suggestion
   */
  select: [item: T]
  /** The list is opened */
  open: []
  /** The list is closed */
  close: []
  /**
   * The input is focused
   * @property {Event} event - the event
   */
  focus: [event: Event]
  /**
   * The input is blurred
   * @property {Event} event - the event
   */
  blur: [event: Event]
  /**
   * The `source` failed
   * @property {unknown} error - the error thrown
   */
  error: [error: unknown]
}>()

const slots = defineSlots<{
  /**
   * A suggestion
   * @binding {T} item - the suggestion
   * @binding {number} index - its index in the list
   * @binding {boolean} is-active - highlighted with the keyboard
   * @binding {boolean} is-selected - the chosen suggestion
   * @binding {FuzzySearchSegment[]} segments - the text split into the parts matching the query or not
   */
  'item'?: (props: { item: T, index: number, isActive: boolean, isSelected: boolean, segments: FuzzySearchSegment[] }) => unknown
  /**
   * No suggestion for the query
   * @binding {string} query - the text typed
   */
  'empty'?: (props: { query: string }) => unknown
  /** The `source` is loading */
  'loading'?: () => unknown
  /**
   * The `source` failed
   * @binding {unknown} error - the error thrown
   * @binding {function} retry - call the `source` again
   */
  'error'?: (props: { error: unknown, retry: () => void }) => unknown
  /** Content above the suggestions */
  'header'?: () => unknown
  /** Content below the suggestions */
  'footer'?: () => unknown
  /** Content of the inline-start edge of the input */
  'start-icon'?: () => unknown
  /** Content of the inline-end edge of the input */
  'end-icon'?: () => unknown
}>()

const query = defineModel<string>({ default: '' })
const selected = defineModel<T | undefined>('selected')

const { t } = useTranslations()
const messages = computed(() => ({
  noResults: translations?.noResults || t('inputAutocomplete.noResults'),
  loading: translations?.loading || t('inputAutocomplete.loading'),
  error: translations?.error || t('inputAutocomplete.error'),
  results: translations?.results || t('inputAutocomplete.results'),
} satisfies MazUiTranslationsNestedSchema['inputAutocomplete']))

const { size } = useGlobalConfig<{ size: MazSize }>('MazInputAutocomplete', { size: 'md' })

const instanceId = useInstanceUniqId({
  componentName: 'MazInputAutocomplete',
  providedId: id,
})

const listboxRef = useTemplateRef('listbox')

const listboxId = computed(() => `${instanceId.value}-listbox`)

function getOptionId(index: number) {
  return `${instanceId.value}-option-${index}`
}

function getLabel(item: T): string {
  if (typeof itemLabel === 'function') {
    return itemLabel(item)
  }

  if (item !== null && typeof item === 'object') {
    const value = (item as Record<string, unknown>)[itemLabel]

    return value === undefined || value === null
      ? ''
      : String(value)
  }

  return item === undefined || item === null
    ? ''
    : String(item)
}

function getValue(item: T): unknown {
  if (typeof itemValue === 'function') {
    return itemValue(item)
  }

  if (item !== null && typeof item === 'object' && itemValue in item) {
    return (item as Record<string, unknown>)[itemValue]
  }

  return item
}

const keys = computed<FuzzySearchKey<T>[]>(() => searchKeys ?? [
  {
    key: getLabel,
    name: 'label',
  },
])

const isQueryLongEnough = computed(() => query.value.trim().length >= minChars)

const { results: localResults } = useFuzzySearch(
  () => (source
    ? []
    : items),
  () => (isQueryLongEnough.value ? query.value : ''),
  () => ({
    keys: keys.value,
    typoThreshold: searchThreshold,
    limit,
  }),
)

const sourceItems = shallowRef<T[]>([])
const isLoading = ref(false)
const sourceError = shallowRef<unknown>()
let sourceController: AbortController | undefined
let sourceTimeout: ReturnType<typeof setTimeout> | undefined

function cancelSource() {
  clearTimeout(sourceTimeout)
  sourceController?.abort()
  sourceController = undefined
}

async function loadSource(value: string) {
  if (!source) {
    return
  }

  cancelSource()

  const controller = new AbortController()
  sourceController = controller
  isLoading.value = true
  sourceError.value = undefined

  try {
    const result = await source(value, { signal: controller.signal })

    if (controller.signal.aborted) {
      return
    }

    sourceItems.value = limit
      ? result.slice(0, limit)
      : result
  }
  catch (error) {
    if (controller.signal.aborted) {
      return
    }

    sourceItems.value = []
    sourceError.value = error ?? new Error('source failed')
    emits('error', error)
  }
  finally {
    if (sourceController === controller) {
      isLoading.value = false
      sourceController = undefined
    }
  }
}

function retry() {
  loadSource(query.value)
}

function searchSource(value: string) {
  cancelSource()

  if (!isQueryLongEnough.value) {
    sourceItems.value = []
    sourceError.value = undefined
    isLoading.value = false
    return
  }

  isLoading.value = true

  if (debounce) {
    sourceTimeout = setTimeout(loadSource, debounce, value)
  }
  else {
    loadSource(value)
  }
}

onBeforeUnmount(cancelSource)

/** The highlight of the suggestions of the `source`, searched in them without filtering */
const sourceSearch = computed(() => (source && highlight
  ? createFuzzySearch(sourceItems.value, {
      keys: keys.value,
      sort: 'original',
    })
  : undefined))

const displayedItems = computed<T[]>(() => (source
  ? sourceItems.value
  : localResults.value.map(result => result.item)))

const matchedIndexes = computed(() => {
  const indexes = new Map<T, number[]>()

  if (!highlight || !isQueryLongEnough.value) {
    return indexes
  }

  const results = source
    ? sourceSearch.value?.search(query.value) ?? []
    : localResults.value

  for (const result of results) {
    const labelValue = getLabel(result.item)
    const match = result.matches.find(item => item.value === labelValue && item.indexes.length > 0)

    if (match) {
      indexes.set(result.item, match.indexes)
    }
  }

  return indexes
})

const listOptions = computed(() => displayedItems.value.map((item, index) => ({
  item,
  index,
  label: getLabel(item),
})))

type ListOption = (typeof listOptions.value)[number]

function getSegments(option: ListOption) {
  return highlightMatches(option.label, matchedIndexes.value.get(option.item) ?? [])
}

function isSelectedOption(option: ListOption) {
  return selected.value !== undefined && getValue(selected.value) === getValue(option.item)
}

const isOpen = ref(false)
const activeIndex = ref(-1)

const hasItems = computed(() => listOptions.value.length > 0)
const isPanelVisible = computed(() => isOpen.value && isQueryLongEnough.value)

const status = computed(() => {
  if (!isPanelVisible.value) {
    return ''
  }

  if (isLoading.value) {
    return messages.value.loading
  }

  if (sourceError.value) {
    return messages.value.error
  }

  return hasItems.value
    ? messages.value.results.replace('{count}', String(listOptions.value.length))
    : messages.value.noResults
})

function openList() {
  if (disabled || !isQueryLongEnough.value) {
    return
  }

  isOpen.value = true
}

function closeList() {
  isOpen.value = false
  activeIndex.value = -1
}

/** The list is at least as wide as the input */
const listMinWidth = ref<number>()

watch(isOpen, (value) => {
  if (value) {
    listMinWidth.value = document.querySelector<HTMLElement>(`#${instanceId.value}-popover .m-input-wrapper`)?.offsetWidth
    emits('open')
  }
  else {
    activeIndex.value = -1
    emits('close')
  }
})

watch(listOptions, () => {
  activeIndex.value = -1
})

let isSelecting = false

watch(query, (value) => {
  if (isSelecting) {
    isSelecting = false
    return
  }

  if (selected.value !== undefined && getLabel(selected.value) !== value) {
    selected.value = undefined
  }

  if (source) {
    searchSource(value)
  }

  if (isQueryLongEnough.value) {
    openList()
  }
  else {
    closeList()
  }
})

function selectOption(option: ListOption) {
  const labelValue = option.label

  isSelecting = labelValue !== query.value
  selected.value = option.item
  query.value = labelValue
  closeList()
  emits('select', option.item)
}

function setActiveIndex(index: number) {
  activeIndex.value = index
  listboxRef.value?.scrollToIndex(index)
}

function moveActive(step: 1 | -1) {
  const length = listOptions.value.length

  if (!length) {
    return
  }

  const index = activeIndex.value === -1
    ? (step === 1
        ? 0
        : length - 1)
    : (activeIndex.value + step + length) % length

  setActiveIndex(index)
}

function onKeydown(event: KeyboardEvent) {
  if (event.isComposing) {
    return
  }

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      event.preventDefault()

      if (!isPanelVisible.value) {
        openList()

        if (event.altKey) {
          return
        }
      }

      moveActive(event.key === 'ArrowDown'
        ? 1
        : -1)
      break
    }
    case 'Enter': {
      const option = isPanelVisible.value
        ? listOptions.value[Math.max(activeIndex.value, 0)]
        : undefined

      if (option) {
        event.preventDefault()
        selectOption(option)
      }
      break
    }
    case 'Escape': {
      if (isPanelVisible.value) {
        event.preventDefault()
        event.stopPropagation()
        closeList()
      }
      else if (query.value) {
        event.preventDefault()
        query.value = ''
      }
      break
    }
    case 'Tab': {
      closeList()
      break
    }
  }
}

function onFocus(event: Event) {
  emits('focus', event)

  if (openOnFocus) {
    if (source && !sourceItems.value.length && !isLoading.value) {
      searchSource(query.value)
    }

    openList()
  }
}

function onBlur(event: Event) {
  emits('blur', event)
  closeList()
}

defineExpose({
  /** Open the list */
  open: openList,
  /** Close the list */
  close: closeList,
})
</script>

<template>
  <MazPopover
    :id="`${instanceId}-popover`"
    :model-value="isPanelVisible"
    class="m-input-autocomplete m-reset-css maz:relative maz:inline-flex maz:align-top"
    :class="[{ '--is-open': isPanelVisible, '--disabled': disabled }, classProp]"
    :style
    trigger="manual"
    :trap-focus="false"
    :block
    :transition
    :offset="0"
    :position="listPosition"
    prefer-position="bottom-start"
    fallback-position="top-start"
    :disabled
    :position-reference="`#${instanceId}-popover .m-input-wrapper`"
    @update:model-value="value => !value && closeList()"
  >
    <template #trigger>
      <MazInput
        :id="instanceId"
        v-model="query"
        class="m-input-autocomplete-input"
        v-bind="$attrs"
        :border-active="isPanelVisible"
        :color
        :size
        :block
        :label
        :top-label
        :placeholder
        :disabled
        :loading="isLoading"
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="String(isPanelVisible)"
        :aria-controls="isPanelVisible && hasItems ? listboxId : undefined"
        :aria-activedescendant="isPanelVisible && activeIndex !== -1 ? getOptionId(activeIndex) : undefined"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      >
        <template v-if="slots['start-icon']" #start-icon>
          <slot name="start-icon" />
        </template>
        <template v-if="slots['end-icon']" #end-icon>
          <slot name="end-icon" />
        </template>
      </MazInput>

      <span class="maz:sr-only" role="status" aria-live="polite">{{ status }}</span>
    </template>

    <div
      class="m-input-autocomplete-list"
      :class="[`--${size}`, SIZE_TEXT_CLASS[size]]"
      :style="{
        'maxHeight': `${maxListHeight}px`,
        'minWidth': listMinWidth ? `${listMinWidth}px` : undefined,
        '--selected-bg-color': 'color-mix(in srgb, var(--selected-text-color) 12%, transparent)',
        '--selected-text-color': `light-dark(oklch(from var(--maz-${color}) min(l, calc(0.25 + c * 2)) c h), oklch(from var(--maz-${color}) max(l, calc(0.92 - c * 2)) c h))`,
      }"
      @mousedown.prevent
    >
      <slot name="header" />

      <div v-if="isLoading && !hasItems" class="m-input-autocomplete-list__state">
        <slot name="loading">
          {{ messages.loading }}
        </slot>
      </div>

      <div v-else-if="sourceError" class="m-input-autocomplete-list__state">
        <slot name="error" :error="sourceError" :retry>
          {{ messages.error }}
        </slot>
      </div>

      <SelectListbox
        v-else
        :id="listboxId"
        ref="listbox"
        :options="listOptions"
        :label="label || topLabel || placeholder || messages.results.replace('{count}', String(listOptions.length))"
        :get-option-id="getOptionId"
        :is-selected="isSelectedOption"
        :color
        virtual-focus
        :active-index
        @select="selectOption"
      >
        <template #no-results>
          <div class="m-input-autocomplete-list__state">
            <slot name="empty" :query>
              {{ messages.noResults }}
            </slot>
          </div>
        </template>

        <template #default="{ option, index, isSelected, isActive }">
          <slot
            name="item"
            :item="option.item"
            :index
            :is-active="isActive"
            :is-selected="isSelected"
            :segments="getSegments(option)"
          >
            <span>
              <template v-for="(segment, segmentIndex) in getSegments(option)" :key="segmentIndex">
                <mark v-if="segment.match" class="m-input-autocomplete-mark">{{ segment.text }}</mark>
                <template v-else>
                  {{ segment.text }}
                </template>
              </template>
            </span>
          </slot>
        </template>
      </SelectListbox>

      <slot name="footer" />
    </div>
  </MazPopover>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-input-autocomplete-list {
  @apply maz:flex maz:flex-col maz:gap-1 maz:overflow-hidden maz:rounded-md maz:bg-container;

  min-inline-size: 3.5rem;
}

.m-input-autocomplete-list__state {
  @apply maz:p-4 maz:text-center maz:text-muted;
}

.m-input-autocomplete-mark {
  @apply maz:bg-transparent maz:font-semibold maz:text-inherit;
}
</style>
