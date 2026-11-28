<script lang="ts" setup generic="T extends string | number, O extends MazChecklistItemOption">
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { NormalizeStringOptions } from '@maz-ui/utils/helpers/normalizeString'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { MazInputProps } from './MazInput.vue'
import type { MazColor } from './types.ts'
import { MazMagnifyingGlass } from '@maz-ui/icons/lazy/MazMagnifyingGlass'
import { MazNoSymbol } from '@maz-ui/icons/lazy/MazNoSymbol'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { normalizeString } from '@maz-ui/utils/helpers/normalizeString'
import { computed, defineAsyncComponent, ref, shallowRef, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import MazCardSpotlight from './MazCardSpotlight.vue'
import MazCheckbox from './MazCheckbox.vue'

export type MazChecklistItemOption = {
  label: string
  value: string | number
  /** Second line of the card (variant `cards`) */
  description?: string
  /** Price or extra text at the end of the card (variant `cards`) */
  price?: string
} & Record<string, any>

export interface MazChecklistProps<T, O> {
  /**
   * The model value of the checklist (selected items)
   * @type {(T extends unknown)[]}
   */
  modelValue?: T[]
  /**
   * The query to filter the items (model)
   * @type {string}
   */
  query?: string
  /**
   * The list of items to display
   * @type {(O extends MazChecklistItemOption)[]}
   */
  items?: O[]
  /**
   * The title of the checklist
   */
  title?: string
  /**
   * Add elevation to the card
   * @default false
   */
  elevation?: boolean
  /**
   * The search input options
   * @default { enabled: false, debounce: 300, autoFocus: false }
   */
  search?: boolean | MazInputProps<string>
  /**
   * Look of the items: `default` is a list in a card, `cards` shows each item as a choice card (`label`, `description`
   * and `price` of the item) whose border draws itself when it is selected
   * @values `'default' | 'cards'`
   * @default 'default'
   */
  variant?: 'default' | 'cards'
  /**
   * The filtered items move (and the others glide to their new place) when the search changes
   * @default true
   */
  animated?: boolean
  /**
   * The options to normalize the query given to `searchFunction`. `threshold` is the tolerance of the default search to
   * typos: the minimal similarity (from 0 to 1) of a whole item with the query, `1` disables it (default 0.75). The
   * default search always ignores the case and the accents.
   */
  searchOptions?: NormalizeStringOptions & {
    threshold?: number
  }
  /**
   * Replace the default search function to provide a custom search function
   * @default undefined
   */
  searchFunction?: (query: string, items: O[]) => O[] | undefined
  /**
   * The color of the checklist (card, checkbox and search input)
   * @default primary
   */
  color?: MazColor
  /**
   * Translations of the checklist component
   * @type {DeepPartial<MazUiTranslationsNestedSchema['checklist']>}
   * @default Translations from @maz-ui/translations
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['checklist']>
}

const {
  modelValue,
  query,
  elevation = false,
  items,
  title,
  search,
  searchOptions,
  searchFunction,
  color = 'primary',
  variant = 'default',
  animated = true,
  translations,
} = defineProps<MazChecklistProps<T, O>>()

const emits = defineEmits<{
  /**
   * Emitted when the query change
   * @property value The new query
   */
  'update:query': [value?: string]
  /**
   * Emitted when the model value change
   * @property value The new value
   */
  'update:model-value': [value?: T[]]
}>()

const id = useInstanceUniqId({
  componentName: 'MazChecklist',
})

const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))

const internalQuery = ref<string | undefined>(query)

watch(
  () => query,
  (value) => {
    internalQuery.value = value
  },
)

const { t } = useTranslations()

const messages = computed<MazUiTranslationsNestedSchema['checklist']>(() => ({
  noResultsFound: translations?.noResultsFound ?? t('checklist.noResultsFound'),
  searchInput: {
    placeholder: translations?.searchInput?.placeholder ?? t('checklist.searchInput.placeholder'),
  },
}))

type FuzzySearchModule = typeof import('@maz-ui/utils/helpers/fuzzySearch')

/** The search engine is loaded with the search input */
const fuzzySearchModule = shallowRef<FuzzySearchModule>()

watch(() => !!search, async (enabled) => {
  if (enabled && !fuzzySearchModule.value) {
    fuzzySearchModule.value = await import('@maz-ui/utils/helpers/fuzzySearch')
  }
}, { immediate: true })

const itemsSearch = computed(() => fuzzySearchModule.value?.createFuzzySearch(items ?? [], {
  keys: [
    item => item.label,
    {
      key: item => item.value,
      weight: 0.8,
    },
  ],
  typoThreshold: searchOptions?.threshold,
}))

function searchInValue(value: unknown, query: string) {
  return (typeof value === 'string' || typeof value === 'number') && normalizeString(value).includes(normalizeString(query))
}

const filteredItems = computed(() => {
  if (!internalQuery.value || !search) {
    return items
  }

  if (searchFunction) {
    return searchFunction(normalizeString(internalQuery.value, searchOptions), items ?? [])
  }

  const query = internalQuery.value

  return itemsSearch.value?.search(query).map(result => result.item)
    ?? items?.filter(({ label, value }) => searchInValue(label, query) || searchInValue(value, query))
})

/** A filtered-out item leaves at once: the others glide to their new place (`maz-list-move`) */
function removeAtOnce(_element: Element, done: () => void) {
  done()
}

function updateQuery(value?: string) {
  internalQuery.value = value
  emits('update:query', value)
}
</script>

<template>
  <div class="m-checklist m-reset-css maz:flex maz:flex-col maz:gap-4">
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label :for="search ? `${id}-query` : undefined" class="search-label maz:flex maz:items-center maz:justify-between maz:gap-4">
      <span v-if="hasSlotContent($slots.title) || title" class="title maz:flex-none maz:truncate maz:type-title-4">
        <!-- @slot use this slot to customize the title -->
        <slot name="title">
          {{ title }}
        </slot>
      </span>

      <MazInput
        v-if="search"
        :id="`${id}-query`"
        :model-value="internalQuery"
        v-bind="typeof search === 'object' ? search : {}"
        :color="typeof search === 'object' && search.color ? search.color : color"
        :start-icon="typeof search === 'object' ? search.startIcon ?? MazMagnifyingGlass : undefined"
        :debounce="typeof search === 'object' ? search.debounce ?? 300 : undefined"
        :name="typeof search === 'object' ? search.name ?? 'search' : undefined"
        :placeholder="typeof search === 'object' && search.placeholder ? search.placeholder : messages.searchInput.placeholder"
        @update:model-value="(event) => updateQuery(event as string)"
      />
    </label>

    <MazCardSpotlight
      :color
      :elevation
      :padding="false"
      content-class="card-content"
    >
      <div v-if="filteredItems?.length === 0" class="no-results maz:flex maz:h-full maz:flex-center">
        <!-- @slot use this slot to customize the no results area -->
        <slot name="no-results">
          <div class="no-results-content maz:flex maz:h-full maz:flex-col maz:flex-center maz:gap-3 maz:py-8">
            <MazNoSymbol class="no-results-icon maz:text-3xl maz:text-muted" />

            <span class="no-results-text maz:text-muted">
              <!-- @slot use this slot to customize the no results message -->
              <slot name="no-results-text"> {{ messages.noResultsFound }} </slot>
            </span>
          </div>
        </slot>
      </div>
      <TransitionGroup :css="!!search && animated" name="maz-list" @leave="removeAtOnce">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label
          v-for="(item) of filteredItems"
          :key="item.value"
          :for="`${id}-checklist-item-${item.value}`"
          class="m-checklist-item m-reset-css maz:flex maz:w-full maz:cursor-interactive maz:items-center maz:gap-4 maz:text-start"
          :class="variant === 'cards'
            ? 'm-checklist-item--card maz:border-draw maz:rounded-lg maz:border maz:border-divider maz:bg-surface maz:px-4 maz:py-3 maz:hover:bg-surface-600'
            : 'maz:rounded-md maz:px-3 maz:py-2 maz:hover:bg-surface-600'"
          :style="variant === 'cards' ? { '--maz-border-draw-color': color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})` } : undefined"
        >
          <MazCheckbox
            :id="`${id}-checklist-item-${item.value}`"
            :model-value="modelValue"
            :value="item.value"
            :color
            @update:model-value="(event) => emits('update:model-value', event)"
          />
          <!-- @slot use this slot to customize the item
                @binding { selectedValues: T[], item: O }
           -->
          <slot
            :selected-values="modelValue"
            :item="item"
            name="item"
          >
            <template v-if="variant === 'cards'">
              <span class="m-checklist-item__text maz:flex maz:min-w-0 maz:flex-1 maz:flex-col">
                <span class="item-label maz:type-label maz:cap-f">
                  {{ item.label }}
                </span>
                <span v-if="item.description" class="item-description maz:text-body-sm maz:text-muted">
                  {{ item.description }}
                </span>
              </span>
              <span v-if="item.price" class="item-price maz:flex-none maz:type-label">
                {{ item.price }}
              </span>
            </template>
            <span v-else class="item-label maz:cap-f">
              {{ item.label }}
            </span>
          </slot>
        </label>
      </TransitionGroup>
    </MazCardSpotlight>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-checklist :deep(.card-content) {
  @apply maz:relative maz:flex maz:flex-col maz:gap-2 maz:overflow-y-auto maz:scrollbar-themed maz:bg-surface maz:px-3 maz:py-2;
}

.m-checklist-item--card:not(:has(input:checked))::after {
  --maz-border-draw-progress: 0;
}
</style>
