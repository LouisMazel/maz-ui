<script lang="ts">
/* eslint-disable import/first */
export type { NormalizeStringOptions } from '../modules/helpers/normalize-string'
export type { Color } from './MazInput.vue'
</script>

<script lang="ts" setup generic="T extends string, O extends ItemOption">
import type {
  Color,
  Props as MazInputProps,
} from './MazInput.vue'
import { normalizeString, type NormalizeStringOptions } from '../modules/helpers/normalize-string'
/* eslint-disable vuejs-accessibility/label-has-for */
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import MazCardSpotlight from './MazCardSpotlight.vue'
import MazCheckbox from './MazCheckbox.vue'

export type ItemOption = {
  label: string
  value: string
} & Record<string, any>

export interface MazCheckListProps<T, O> {
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
   * @default { enabled: false }
   */
  search?: {
    enabled?: boolean
  } & MazInputProps<string>
  /**
   * The options to normalize the search query
   */
  searchOptions?: NormalizeStringOptions
  /**
   * The color of the checklist (card, checkbox and search input)
   * @default primary
   */
  color?: Color
}

const props = withDefaults(
  defineProps<MazCheckListProps<T, O>>(),
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

const SearchIcon = defineAsyncComponent(
  () => import('../icons/magnifying-glass.svg'),
)
const NoResultsIcon = defineAsyncComponent(
  () => import('../icons/no-symbol.svg'),
)

const internalQuery = ref<string | undefined>(props.query)

watch(
  () => props.query,
  (value) => {
    internalQuery.value = value
  },
)

const filteredItems = computed(() => {
  if (!internalQuery.value) {
    return props.items
  }

  const normalizedQuery = normalizeString(internalQuery.value, props.searchOptions)
  return props.items?.filter(({ label }) =>
    normalizeString(label, props.searchOptions).includes(normalizedQuery),
  )
})

function updateQuery(value?: string) {
  internalQuery.value = value
  emits('update:query', value)
}
</script>

<template>
  <div class="m-checklist maz-flex maz-flex-col maz-gap-4">
    <label v-if="search?.enabled" for="query" class="maz-flex maz-items-center maz-justify-between maz-gap-4">
      <span v-if="$slots.title || title" class="maz-flex-none maz-truncate">
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
      content-class="maz-flex maz-flex-col maz-maz-gap-2 maz-overflow-y-auto maz-bg-color maz-px-3 maz-py-2"
    >
      <div v-if="filteredItems?.length === 0" class="maz-flex maz-h-full maz-flex-center">
        <!-- @slot use this slot to customize the no results area -->
        <slot name="no-results">
          <div class="maz-flex maz-h-full maz-flex-col maz-gap-3 maz-flex-center">
            <NoResultsIcon class="maz-text-3xl maz-text-muted" />

            <span class="maz-text-muted">
              <!-- @slot use this slot to customize the no results message -->
              <slot name="no-results-text"> No results found </slot>
            </span>
          </div>
        </slot>
      </div>
      <label
        v-for="item of filteredItems"
        :key="item.value"
        :for="item.value"
        class="m-checklist-item maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-gap-4 maz-rounded maz-px-3 maz-py-2 maz-text-left hover:maz-bg-color-light"
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
          <span class="cap-f">
            {{ item.label }}
          </span>
        </slot>
      </label>
    </MazCardSpotlight>
  </div>
</template>
