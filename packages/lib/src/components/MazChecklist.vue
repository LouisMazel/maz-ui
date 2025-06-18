<script lang="ts" setup generic="T extends string | number, O extends MazChecklistItemOption">
import type { MazTranslationsNestedSchema } from '@maz-ui/translations/src/types.js'
import type { DeepPartial } from '@maz-ui/utils/src/ts-helpers/DeepPartial.js'
import type { NormalizeStringOptions } from '@maz-ui/utils/src/utils/normalizeString.js'
import type { MazInputProps } from './MazInput.vue'
import type { MazColor } from './types'
import { MazMagnifyingGlass, MazNoSymbol } from '@maz-ui/icons'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { normalizeString } from '@maz-ui/utils/src/utils/normalizeString.js'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { useStringMatching } from '../composables/useStringMatching'
import MazCardSpotlight from './MazCardSpotlight.vue'
import MazCheckbox from './MazCheckbox.vue'

export type MazChecklistItemOption = {
  label: string
  value: string | number
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
   * The options to normalize the search query (used by the default search function)
   * By default, the threshold is 0.75
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
   * @type {DeepPartial<MazTranslationsNestedSchema['checklist']>}
   * @default Translations from @maz-ui/translations
   */
  translations?: DeepPartial<MazTranslationsNestedSchema['checklist']>
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

const messages = computed<MazTranslationsNestedSchema['checklist']>(() => ({
  noResultsFound: translations?.noResultsFound ?? t('checklist.noResultsFound'),
  searchInput: {
    placeholder: translations?.searchInput?.placeholder ?? t('checklist.searchInput.placeholder'),
  },
}))

const filteredItems = computed(() => {
  if (!internalQuery.value || !search) {
    return items
  }

  const normalizedQuery = normalizeString(internalQuery.value, searchOptions)
  return searchFunction
    ? searchFunction(normalizedQuery, items ?? [])
    : getFilteredOptionWithQuery(normalizedQuery)
})

function searchInValue(value?: string, query?: string) {
  return query && value && normalizeString(value).includes(normalizeString(query))
}

function getFilteredOptionWithQuery(query: string) {
  return items?.filter(({ label, value }) => {
    const threshold = searchOptions?.threshold

    const normalizedQuery = normalizeString(query, searchOptions)

    const searchLabel = normalizeString(label, searchOptions)
    const searchValue = normalizeString(value, searchOptions)

    return (
      searchInValue(searchLabel, normalizedQuery)
      || searchInValue(searchValue, normalizedQuery)
      || (typeof searchLabel === 'string'
        && useStringMatching(searchLabel, normalizedQuery, threshold).isMatching.value)
      || (typeof searchValue === 'string'
        && useStringMatching(searchValue, normalizedQuery, threshold).isMatching.value)
    )
  })
}

function updateQuery(value?: string) {
  internalQuery.value = value
  emits('update:query', value)
}
</script>

<template>
  <div class="m-checklist m-reset-css">
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label :for="search ? `${id}-query` : undefined" class="search-label">
      <span v-if="$slots.title || title" class="title">
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
        :left-icon="typeof search === 'object' ? search.leftIcon ?? MazMagnifyingGlass : undefined"
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
      <div v-if="filteredItems?.length === 0" class="no-results">
        <!-- @slot use this slot to customize the no results area -->
        <slot name="no-results">
          <div class="no-results-content">
            <MazNoSymbol class="no-results-icon" />

            <span class="no-results-text">
              <!-- @slot use this slot to customize the no results message -->
              <slot name="no-results-text"> {{ messages.noResultsFound }} </slot>
            </span>
          </div>
        </slot>
      </div>
      <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
      <label
        v-for="(item) of filteredItems"
        :key="item.value"
        :for="`${id}-checklist-item-${item.value}`"
        class="m-checklist-item m-reset-css"
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
          <span class="item-label">
            {{ item.label }}
          </span>
        </slot>
      </label>
    </MazCardSpotlight>
  </div>
</template>

<style lang="postcss" scoped>
.m-checklist {
  @apply maz-flex maz-flex-col maz-gap-4;

  .search-label {
    @apply maz-flex maz-items-center maz-justify-between maz-gap-4;
  }

  .title {
    @apply maz-flex-none maz-truncate;
  }

  :deep(.card-content) {
    @apply maz-flex maz-flex-col maz-gap-2 maz-overflow-y-auto maz-bg-surface maz-px-3 maz-py-2;
  }

  .no-results {
    @apply maz-flex maz-h-full maz-flex-center;
  }

  .no-results-content {
    @apply maz-flex maz-h-full maz-flex-col maz-gap-3 maz-flex-center;
  }

  .no-results-icon {
    @apply maz-text-3xl maz-text-muted;
  }

  .no-results-text {
    @apply maz-text-muted;
  }

  .m-checklist-item {
    @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-4 maz-rounded maz-px-3 maz-py-2 maz-text-left hover:maz-bg-surface-400;
  }

  .item-label {
    @apply maz-cap-f;
  }
}
</style>
