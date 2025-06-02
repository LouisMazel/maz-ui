<script lang="ts" setup generic="T extends string, O extends ItemOption">
import type { NormalizeStringOptions } from '../helpers/normalizeString'
import type { MazInputProps } from './MazInput.vue'
import type { Color } from './types'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { normalizeString } from '../helpers/normalizeString'
import MazCardSpotlight from './MazCardSpotlight.vue'
import MazCheckbox from './MazCheckbox.vue'

export type ItemOption = {
  label: string
  value: string
} & Record<string, any>

export interface MazChecklistProps<T, O> {
  /**
   * The model value of the checklist (selected items)
   */
  modelValue?: T[]
  /**
   * The query to filter the items (model)
   */
  query?: string
  /**
   * The list of items to display
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
  search?: {
    enabled?: boolean
  } & MazInputProps<string>
  /**
   * The options to normalize the search query (used by the default search function)
   */
  searchOptions?: NormalizeStringOptions
  /**
   * Replace the default search function to provide a custom search function
   * @default undefined
   */
  searchFunction?: (query: string, items: O[]) => O[] | undefined
  /**
   * The color of the checklist (card, checkbox and search input)
   * @default primary
   */
  color?: Color
}

const props = withDefaults(
  defineProps<MazChecklistProps<T, O>>(),
  {
    modelValue: undefined,
    query: undefined,
    elevation: false,
    items: undefined,
    title: undefined,
    search: () => ({
      enabled: false,
    }),
    color: 'primary',
  },
)

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

const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))
const SearchIcon = defineAsyncComponent(() => import('../../icons/magnifying-glass.svg'))
const NoResultsIcon = defineAsyncComponent(() => import('../../icons/no-symbol.svg'))

const internalQuery = ref<string | undefined>(props.query)

watch(
  () => props.query,
  (value) => {
    internalQuery.value = value
  },
)

const filteredItems = computed(() => {
  if (!internalQuery.value || !props.search.enabled) {
    return props.items
  }

  const normalizedQuery = normalizeString(internalQuery.value, props.searchOptions)
  return props.searchFunction
    ? props.searchFunction(normalizedQuery, props.items ?? [])
    : props.items?.filter(({ label, value }) =>
        normalizeString(label, props.searchOptions).includes(normalizedQuery) || normalizeString(value, props.searchOptions).includes(normalizedQuery),
      )
})

function updateQuery(value?: string) {
  internalQuery.value = value
  emits('update:query', value)
}
</script>

<template>
  <div class="m-checklist m-reset-css">
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="search?.enabled" for="query" class="search-label">
      <span v-if="$slots.title || title" class="title">
        <!-- @slot use this slot to customize the title -->
        <slot name="title">
          {{ title }}
        </slot>
      </span>
      <MazInput
        id="query"
        :model-value="internalQuery"
        v-bind="search"
        :color
        :left-icon="search.leftIcon ?? SearchIcon"
        :debounce="search.debounce ?? 300"
        :label="search?.label"
        :name="search?.name ?? 'search'"
        :placeholder="search?.placeholder"
        @update:model-value="(event) => updateQuery(event as string)"
      />
    </label>

    <MazCardSpotlight
      :color
      :no-elevation="!elevation"
      :padding="false"
      content-class="card-content"
    >
      <div v-if="filteredItems?.length === 0" class="no-results">
        <!-- @slot use this slot to customize the no results area -->
        <slot name="no-results">
          <div class="no-results-content">
            <NoResultsIcon class="no-results-icon" />

            <span class="no-results-text">
              <!-- @slot use this slot to customize the no results message -->
              <slot name="no-results-text"> No results found </slot>
            </span>
          </div>
        </slot>
      </div>
      <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
      <label
        v-for="item of filteredItems"
        :key="item.value"
        :for="item.value"
        class="m-checklist-item m-reset-css"
      >
        <MazCheckbox
          :id="item.value"
          :model-value="props.modelValue"
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
    @apply maz-flex maz-flex-col maz-gap-2 maz-overflow-y-auto maz-bg-color maz-px-3 maz-py-2;
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
    @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-4 maz-rounded maz-px-3 maz-py-2 maz-text-left hover:maz-bg-color-light;
  }

  .item-label {
    @apply maz-cap-f;
  }
}
</style>
