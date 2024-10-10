<script lang="ts" setup generic="T extends string, O extends ItemOption">
/* eslint-disable vuejs-accessibility/label-has-for */
import type {
  Color,
  Props as MazInputProps,
} from './MazInput.vue'
import { normalizeString } from 'maz-ui'
import { computed, defineAsyncComponent, ref, watch } from 'vue'

export type ItemOption = {
  label: string
  value: string
} & Record<string, any>

export interface MazCheckListProps<T, O> {
  modelValue?: T[]
  query?: string
  items?: O[]
  title?: string
  elevation?: boolean
  search?: {
    enabled?: boolean
  } & MazInputProps
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
      debounce: 300,
    }),
    color: 'primary',
  },
)
const emits = defineEmits<{
  'update:query': [value?: string]
  'update:model-value': [value?: T[]]
}>()
const SearchIcon = defineAsyncComponent(
  () => import('maz-ui/icons/magnifying-glass.svg'),
)
const NoResultsIcon = defineAsyncComponent(
  () => import('maz-ui/icons/no-symbol.svg'),
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

  const normalizedQuery = normalizeString(internalQuery.value, {
    removeSpecialCharacters: false,
  })
  return props.items?.filter(({ label }) =>
    normalizeString(label, {
      removeSpecialCharacters: false,
    }).includes(normalizedQuery),
  )
})

function updateQuery(value?: string) {
  internalQuery.value = value
  emits('update:query', value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <label v-if="search?.enabled" for="query" class="flex flex-col gap-2">
      <span v-if="$slots.title || title">
        <slot name="title">
          {{ title }}
        </slot>
      </span>
      <MazInput
        id="query"
        :model-value="internalQuery"
        block
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
      class="h-56"
      :no-elevation="!elevation"
      :padding="false"
      content-class="flex flex-col gap-2 overflow-y-auto bg-color px-3 py-2"
    >
      <div v-if="filteredItems?.length === 0" class="flex h-full flex-center">
        <slot name="no-results">
          <div class="flex h-full flex-col gap-3 flex-center">
            <NoResultsIcon class="text-3xl text-muted" />

            <span class="text-muted">
              <slot name="no-results-text"> No results found </slot>
            </span>
          </div>
        </slot>
      </div>
      <label
        v-for="{ label, value } of filteredItems"
        :key="value"
        :for="value"
        class="flex w-full cursor-pointer items-center gap-4 rounded px-3 py-2 text-left hover:bg-color-light"
      >
        <MazCheckbox
          :id="value"
          :model-value="props.modelValue"
          :value
          :color
          @update:model-value="(event) => emits('update:model-value', event)"
        />
        <slot
          :selected-values="modelValue"
          :item="{ label, value }"
          name="item"
        >
          <span class="cap-f">
            {{ label }}
          </span>
        </slot>
      </label>
    </MazCardSpotlight>
  </div>
</template>
