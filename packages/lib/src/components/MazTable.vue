<script lang="ts">
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import { useTranslations } from '@maz-ui/translations'

export interface MazTableHeadersEnriched {
  label: string
  key?: string
  sortable?: boolean
  hidden?: boolean
  srOnly?: boolean
  width?: string
  maxWidth?: string
  classes?: ThHTMLAttributes['class']
  scope?: ThHTMLAttributes['scope']
  align?: ThHTMLAttributes['align']
  rowspan?: ThHTMLAttributes['rowspan']
  colspan?: ThHTMLAttributes['colspan']
  headers?: ThHTMLAttributes['headers']
}

type MazTableHeadersNormalized = MazTableHeadersEnriched & {
  thHeaders?: ThHTMLAttributes['headers']
  sorted?: 'ASC' | 'DESC'
}

export type MazTableRow<T extends MazTableRow<T>> = Record<string, any> & {
  selected?: boolean
  action?: (row: T) => unknown
  classes?: HTMLAttributes['class']
}

export type MazTableHeader = string | MazTableHeadersEnriched

export interface MazTableProps<T extends MazTableRow<T>> {
  /**
   * CSS class of the table element
   * @type {HTMLAttributes['class']}
   */
  tableClass?: HTMLAttributes['class']
  /**
   * CSS style of the table element
   * @type {HTMLAttributes['style']}
   */
  tableStyle?: HTMLAttributes['style']
  /**
   * List of selected rows
   * @type {(string | boolean | number)[]}
   * @model
   */
  modelValue?: (string | boolean | number)[]
  /**
   * Size of the table
   * @type {MazSize}
   * @values xl, lg, md, sm, xs, mini
   * @default md
   */
  size?: MazSize
  /**
   * Size of the search inputs
   * @type {MazSize}
   * @values xl, lg, md, sm, xs, mini
   */
  inputSize?: MazSize
  /**
   * Title of the table
   * @type {string}
   */
  title?: string
  /**
   * Headers of the table
   * @type {MazTableHeader[]}
   */
  headers?: MazTableHeader[]
  /**
   * Enable sort feature on all columns
   * @type {boolean}
   * @default false
   */
  sortable?: boolean
  /**
   * Align all headers
   * @type {string}
   * @default left
   */
  headersAlign?: ThHTMLAttributes['align']
  /**
   * Rows of the table
   * @type {T[]}
   */
  rows?: T[]
  /**
   * Add hover effect on rows
   * @type {boolean}
   * @default false
   */
  hoverable?: boolean
  /**
   * Enable search feature in table header
   * @type {boolean}
   * @default false
   */
  search?: boolean
  /**
   * Disable search in rows - useful to filter data yourself or make search request to server
   * @type {boolean}
   * @default false
   */
  hideSearchInRow?: boolean
  /**
   * Disable search by column (remove select input "search by")
   * @type {boolean}
   * @default false
   */
  hideSearchBy?: boolean
  /**
   * Search query in input
   * @type {string}
   * @model
   */
  searchQuery?: string
  /**
   * Add background color to odd rows
   * @type {boolean}
   * @default false
   */
  backgroundOdd?: boolean
  /**
   * Add background color to even rows
   * @type {boolean}
   * @default false
   */
  backgroundEven?: boolean
  /**
   * Add shadow to the table
   * @type {boolean}
   * @default false
   */
  elevation?: boolean
  /**
   * add divider between rows
   * @type {boolean}
   * @default false
   */
  divider?: boolean
  /**
   * Caption of the table
   * @type {string}
   */
  caption?: string
  /**
   * Caption side
   * @type {string}
   * @values top, bottom
   * @default bottom
   */
  captionSide?: 'top' | 'bottom'
  /**
   * Add pagination in table footer
   * @type {boolean}
   * @default false
   */
  pagination?: boolean
  /**
   * Current page of pagination
   * @type {number}
   * @model
   * @default 1
   */
  page?: number
  /**
   * Number of items per page
   * @type {number}
   * @model
   * @default 20
   */
  pageSize?: number
  /**
   * Total number of pages
   * @type {number}
   */
  totalPages?: number
  /**
   * Don't paginate rows - useful to make pagination request with your server
   * @type {boolean}
   * @default true
   */
  paginateRows?: boolean
  /**
   * Total number of items
   * @type {number}
   */
  totalItems?: number
  /**
   * Loading state
   * @type {boolean}
   * @default false
   */
  loading?: boolean
  /**
   * Enable selection of rows
   * @type {boolean}
   * @default false
   */
  selectable?: boolean
  /**
   * Enable selection of rows - key of the selected row
   * @type {string}
   */
  selectedKey?: string
  /**
   * Table layout
   * @type {string}
   * @values auto, fixed
   */
  tableLayout?: 'auto' | 'fixed'
  /**
   * Color of the component
   * @type {MazColor}
   * @default primary
   */
  color?: MazColor
  /**
   * Translations of the table
   * @type {DeepPartial<MazUiTranslationsNestedSchema['table']>}
   * @default Translations from @maz-ui/translations
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['table']>
  /**
   * Size radius of the component's border
   * @type {string}
   * @values none, sm, md, lg, xl, full
   * @default lg
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Enable scrollable on table
   * @type {boolean}
   * @default false
   */
  scrollable?: boolean
}

export interface MazTableProvide {
  size: Ref<MazSize>
  hoverable: Ref<boolean>
  backgroundEven: Ref<boolean>
  backgroundOdd: Ref<boolean>
}

export const mazTableKey: InjectionKey<MazTableProvide> = Symbol('maz-table')
</script>

<script lang="ts" setup generic="T extends MazTableRow<T>">
import type { HTMLAttributes, InjectionKey, Ref, ThHTMLAttributes } from 'vue'
import type { MazSelectOption } from './MazSelect.vue'
import type { MazColor, MazSize } from './types'
import { MazArrowUp, MazChevronDoubleLeft, MazChevronLeft, MazMagnifyingGlass } from '@maz-ui/icons'

import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  provide,
  ref,
  toRefs,
  useSlots,
  watch,
} from 'vue'

const props = withDefaults(defineProps<MazTableProps<T>>(), {
  size: 'md',
  headersAlign: 'left',
  page: 1,
  pageSize: 20,
  captionSide: 'bottom',
  divider: false,
  color: 'primary',
  roundedSize: 'lg',
  scrollable: false,
  paginateRows: true,
})

const emits = defineEmits<{
  /**
   * Emitted when a row is selected
   * @arg {(Row | string | number | boolean)[]} value - List of selected rows (if selectedKey is defined, it will be the value of the selectedKey of the row)
   */
  (event: 'update:model-value', value: (MazTableRow<T> | string | number | boolean)[] | undefined): void
  /**
   * Emitted when entering a value in the search input
   * @arg {string} searchQuery - Search query
   */
  (event: 'update:search-query', searchQuery: string | undefined): void
  /**
   * Emitted when the current page of pagination changes
   * @arg {number} page - Current page
   */
  (event: 'update:page', page: number): void
  /**
   * Emitted when the page size of pagination changes
   * @arg {number} pageSize - Current page size
   */
  (event: 'update:page-size', pageSize: number): void
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazCheckbox = defineAsyncComponent(() => import('./MazCheckbox.vue'))
const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))
const MazLoadingBar = defineAsyncComponent(() => import('./MazLoadingBar.vue'))
const MazSelect = defineAsyncComponent(() => import('./MazSelect.vue'))
const MazTableCell = defineAsyncComponent(() => import('./MazTableCell.vue'))
const MazTableRowComponent = defineAsyncComponent(() => import('./MazTableRow.vue'))
const MazTableTitle = defineAsyncComponent(() => import('./MazTableTitle.vue'))

const { t } = useTranslations()
/* eslint-disable complexity */
const messages = computed(() => ({
  noResults: props.translations?.noResults ?? t('table.noResults'),
  actionColumnTitle: props.translations?.actionColumnTitle ?? t('table.actionColumnTitle'),
  searchByInput: {
    all: props.translations?.searchByInput?.all ?? t('table.searchByInput.all'),
    placeholder: props.translations?.searchByInput?.placeholder ?? t('table.searchByInput.placeholder'),
  },
  searchInput: {
    placeholder: props.translations?.searchInput?.placeholder ?? t('table.searchInput.placeholder'),
  },
  pagination: {
    all: props.translations?.pagination?.all ?? t('table.pagination.all'),
    rowsPerPage: props.translations?.pagination?.rowsPerPage ?? t('table.pagination.rowsPerPage'),
    of: props.translations?.pagination?.of ?? t('table.pagination.of'),
  },
} satisfies MazUiTranslationsNestedSchema['table']))
/* eslint-enable complexity */

const hasDivider = computed<boolean>(
  () => props.divider && !props.backgroundEven && !props.backgroundOdd,
)

const { size, hoverable, backgroundEven, backgroundOdd } = toRefs(props)

provide(mazTableKey, {
  size,
  hoverable,
  backgroundEven,
  backgroundOdd,
})

const rowsNormalized = ref<T[]>(getNormalizedRows())

const isSelectable = computed<boolean>(() => props.selectable || !!props.selectedKey)

const currentPage = ref(props.page)
watch(
  () => props.page,
  (value) => {
    currentPage.value = value
  },
)
const currentPageModel = computed({
  get: () => currentPage.value,
  set: (value) => {
    currentPage.value = value
    emits('update:page', value)
  },
})

const pageSizeOptions = computed<MazSelectOption[]>(() => [
  { label: messages.value.pagination.all, value: Number.POSITIVE_INFINITY },
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 50, value: 50 },
  { label: 100, value: 100 },
  { label: 200, value: 200 },
])
const pageSizeModelInternal = ref(props.pageSize)
watch(
  () => props.pageSize,
  (value) => {
    pageSizeModelInternal.value = value
  },
)
const pageSizeModel = computed({
  get: () => pageSizeModelInternal.value,
  set: (value) => {
    pageSizeModelInternal.value = value
    emits('update:page-size', value)
  },
})

const totalPagesInternal = computed(() => {
  if (props.totalPages) {
    return props.totalPages
  }

  return (pageSizeModel.value === Number.POSITIVE_INFINITY || !totalItemsInternal.value)
    ? 1
    : Math.ceil(totalItemsInternal.value / pageSizeModel.value)
})

const totalItemsInternal = computed(() => props.totalItems ?? props.rows?.length)

const rowsOfPage = computed(() => {
  if (
    !props.pagination
    || !props.paginateRows
    || pageSizeModel.value === Number.POSITIVE_INFINITY
  ) {
    return rowsNormalized.value
  }

  const start = (currentPage.value - 1) * pageSizeModel.value
  const end = start + pageSizeModel.value

  return rowsNormalized.value.slice(start, end)
})

const rowsFromTo = computed(() => {
  return {
    from: (currentPage.value - 1) * pageSizeModel.value + 1,
    to: Math.min(currentPage.value * pageSizeModel.value, totalItemsInternal.value ?? 0),
  }
})

function firstPage() {
  currentPageModel.value = 1
}
function lastPage() {
  currentPageModel.value = totalPagesInternal.value
}

function previousPage() {
  currentPageModel.value--
}
function nextPage() {
  currentPageModel.value++
}

watch(
  () => [props.rows, props.modelValue],
  () => {
    rowsNormalized.value = getNormalizedRows()
  },
)

const sortedColumnIndex = ref<number>()
const sortType = ref<'ASC' | 'DESC'>()

const headersNormalized = ref<MazTableHeadersNormalized[]>(getNormalizedHeaders())

const searchByKey = ref<string>()
const searchByOptions = computed<MazSelectOption[]>(() => [
  { label: messages.value.searchByInput.all, value: null },
  ...headersNormalized.value.map((header) => {
    return {
      label: header.label,
      value: header.key,
    }
  }),
])

const searchQueryModelInternal = ref(props.searchQuery)
watch(
  () => props.searchQuery,
  (value) => {
    searchQueryModelInternal.value = value
  },
)
const searchQueryModel = computed({
  get: () => searchQueryModelInternal.value,
  set: (value) => {
    searchQueryModelInternal.value = value
    emits('update:search-query', value)
  },
})

function getSortedRows(rows: T[]) {
  return [...rows].sort((a, b) => {
    if (sortedColumnIndex.value === undefined || sortType.value === undefined)
      return 0

    const aValue = a[headersNormalized.value[sortedColumnIndex.value].key as string]
    const bValue = b[headersNormalized.value[sortedColumnIndex.value].key as string]

    // Comparez les valeurs en fonction du type de données
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortType.value === 'ASC'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    else {
      return sortType.value === 'ASC' ? aValue - bValue : bValue - aValue
    }
  })
}

function getFilteredRows(rows: T[]) {
  if (props.hideSearchInRow || typeof searchQueryModel.value !== 'string')
    return rowsOfPage.value

  const query = searchQueryModel.value.toLowerCase()

  return [...rows].filter((row) => {
    if (searchByKey.value) {
      return String(row[searchByKey.value]).toLowerCase().includes(query)
    }

    return Object.values(row).some((value) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value).toLowerCase().includes(query)
      }

      return false
    })
  })
}

const rowsFiltered = computed<T[]>(() => {
  const filteredResults = getFilteredRows(rowsOfPage.value as T[])

  return getSortedRows(filteredResults as T[])
})

const slots = useSlots()

const hasHeader = computed<boolean>((): boolean => props.search || !!props.title || !!slots.title)
const hasFooter = computed<boolean>(() => props.pagination)

function getNormalizedHeaders(): MazTableHeadersNormalized[] {
  return (
    props.headers?.map(header =>
      typeof header === 'string'
        ? { label: header, align: props.headersAlign }
        : { align: props.headersAlign, thHeaders: header.headers, ...header },
    ) ?? []
  )
}

function getNormalizedRows(): T[] {
  return (
    props.rows?.map(row => ({
      selected: props.modelValue?.includes(props.selectedKey ? row[props.selectedKey] : row),
      ...row,
    })) ?? []
  )
}

function sortColumn(columnIndex: number) {
  if (columnIndex === sortedColumnIndex.value) {
    const sortTypeValue = sortType.value === 'DESC' ? 'ASC' : undefined
    sortType.value
      = sortType.value === undefined ? 'DESC' : sortTypeValue
  }
  else {
    sortType.value = 'DESC'
  }
  sortedColumnIndex.value = sortType.value === undefined ? undefined : columnIndex
}

const allSelected = computed<boolean>({
  get: () => {
    return rowsFiltered.value.every(row => row.selected) ?? false
  },
  set: selectAll,
})

function selectAll(value: boolean) {
  for (const row of rowsFiltered.value) {
    row.selected = value
  }

  emitValues()
}

function selectRow(value: boolean, index: number) {
  rowsFiltered.value[index].selected = value

  emitValues()
}

function emitValues(selectedRows?: (T | string | number | boolean)[]) {
  selectedRows = selectedRows ?? getSelectedRows()

  const rows = selectedRows?.length ? selectedRows : undefined

  emits('update:model-value', rows)
}

function getSelectedRows(): (T | string | number | boolean)[] {
  return rowsNormalized.value
    .filter(row => row.selected)
    .map(row => (props.selectedKey ? row[props.selectedKey] : row))
}

onBeforeMount(() => {
  const selectedRows = getSelectedRows()

  if (selectedRows?.length) {
    emitValues(selectedRows)
  }
})
</script>

<template>
  <div class="m-table m-reset-css" :class="{ '--has-header': hasHeader }">
    <div v-if="hasHeader" class="m-table-header">
      <div v-if="title || $slots.title" class="m-table-spacer">
        <!--
          @slot Replace the title of the table
        -->
        <slot name="title">
          <span class="m-table-header-title">
            {{ title }}
          </span>
        </slot>
      </div>

      <div v-if="search" class="m-table-header-search">
        <MazSelect
          v-if="!hideSearchBy"
          v-model="searchByKey"
          :rounded-size
          :color
          :style="{ width: '8rem' }"
          :placeholder="messages.searchByInput.placeholder"
          :size="inputSize ?? size"
          :options="searchByOptions"
        />
        <MazInput
          v-model="searchQueryModel"
          :size="inputSize ?? size"
          :rounded-size
          :color
          :debounce="300"
          :placeholder="messages.searchInput.placeholder"
          :left-icon="MazMagnifyingGlass"
        />
      </div>
    </div>
    <div
      class="m-table-wrapper" :class="[`--rounded-${roundedSize}`, {
        '--scrollable': scrollable,
      }]"
    >
      <table
        :class="[{ '--elevation': elevation, '--has-layout': tableLayout }, tableClass]"
        :style="tableStyle"
      >
        <caption v-if="caption || $slots.caption">
          <!--
            @slot Add caption on top or bottom of the table
          -->
          <slot name="caption">
            {{ caption }}
          </slot>
        </caption>

        <thead v-if="headersNormalized">
          <!--
            @slot Content in thead element
          -->
          <slot name="thead">
            <MazTableRowComponent is-head>
              <MazTableTitle
                v-if="isSelectable"
                align="left"
                :class="`--${size}`"
                class="m-table-select-column"
              >
                <MazCheckbox v-model="allSelected" size="sm" />
              </MazTableTitle>
              <MazTableTitle
                v-for="(header, columnIndex) in headersNormalized"
                :key="columnIndex"
                :scope="header.scope"
                :align="header.align"
                :rowspan="header.rowspan"
                :colspan="header.colspan"
                :headers="header.thHeaders"
                :style="{ width: header.width, textAlign: header.align }"
                class="maz-group"
                :class="[
                  { '--hidden': header.hidden, '--sortable': header.sortable ?? sortable },
                  header.classes,
                  `--${size}`,
                ]"
                @click="(header.sortable ?? sortable) && sortColumn(columnIndex)"
              >
                <span :class="{ 'maz-sr-only': header.srOnly }">
                  <!--
                  @slot Replace column header
                    @binding {Object} header - Header data
                    @binding {String} label - Header label
                -->
                  <slot name="header" :header="header" :label="header.label">
                    <!--
                      @slot Replace column header label
                        @binding {Object} header - Header data
                        @binding {String} label - Header label
                    -->
                    <slot :name="`header-label-${header.key}`" :header="header" :label="header.label">
                      {{ header.label }}
                    </slot>

                    <div v-if="header.sortable ?? sortable" class="m-table-sort-icon-wrapper">
                      <MazArrowUp
                        class="m-table-sort-icon maz-hidden group-hover:maz-block"
                        :class="{
                          '--sorted': columnIndex === sortedColumnIndex,
                          '--up': sortType === 'DESC',
                          '--down': sortType === 'ASC',
                        }"
                      />
                    </div>
                  </slot>
                </span>
              </MazTableTitle>
              <MazTableTitle v-if="$slots.actions" align="left" :class="`--${size}`">
                <!--
                  @slot Replace text of actions header
                -->
                <slot name="actions-header">
                  {{ messages.actionColumnTitle }}
                </slot>
              </MazTableTitle>
            </MazTableRowComponent>
          </slot>
        </thead>

        <MazLoadingBar v-if="loading" :color class="!maz-absolute" />

        <tbody :class="{ '--divider': hasDivider }">
          <slot>
            <template v-if="rowsFiltered.length > 0">
              <MazTableRowComponent
                v-for="(row, rowIndex) in rowsFiltered"
                :key="rowIndex"
                :class="row.classes"
                @click="row.action && row.action(row)"
              >
                <MazTableCell v-if="isSelectable" class="m-table-select-column">
                  <!--
                    @slot Replace checkbox component
                      @binding {Object} row - Row data
                      @binding {Boolean} selected - If selected or not
                  -->
                  <slot name="select" :row="row" :selected="row.selected">
                    <MazCheckbox
                      size="sm"
                      :model-value="row.selected"
                      @update:model-value="selectRow($event, rowIndex)"
                    />
                  </slot>
                </MazTableCell>
                <MazTableCell
                  v-for="({ key, align, classes }, dataIndex) in headersNormalized"
                  :key="dataIndex"
                  :align="align"
                  :class="classes"
                >
                  <!--
                    @slot Replace all row cells
                      @binding {Object} row - Row data
                      @binding {any} value - Cell value
                  -->
                  <slot v-if="key" name="cell" :row="row" :value="row[key]">
                    <!--
                      @slot Replace row cells of column
                        @binding {Object} row - Row data
                        @binding {any} value - Cell value
                    -->
                    <slot :name="`cell-${key}`" :row="row" :value="row[key]">
                      {{ row[key] }}
                    </slot>
                  </slot>
                </MazTableCell>
                <MazTableCell v-if="$slots.actions">
                  <!--
                    @slot Add actions column
                      @binding {Object} row - Row data
                  -->
                  <slot name="actions" :row="row" />
                </MazTableCell>
              </MazTableRowComponent>
            </template>
            <template v-else>
              <MazTableRowComponent>
                <MazTableCell
                  :colspan="
                    headersNormalized.length + (isSelectable ? 1 : 0) + ($slots.actions ? 1 : 0)
                  "
                >
                  <!--
                    @slot Replace the no results element
                  -->
                  <slot name="no-results">
                    <p class="maz-text-center maz-text-muted">
                      <!--
                        @slot no-results-text - replace no results test only
                      -->
                      <slot name="no-results-text">
                        {{ messages.noResults }}
                      </slot>
                    </p>
                  </slot>
                </MazTableCell>
              </MazTableRowComponent>
            </template>
          </slot>
        </tbody>
      </table>
    </div>

    <div v-if="hasFooter" class="m-table-footer">
      <div class="m-table-spacer" />

      <div v-if="pagination" class="m-table-footer-pagination">
        <div class="m-table-footer-pagination-items-per-page">
          <span class="maz-hidden maz-text-sm tab-s:maz-block"> {{ messages.pagination.rowsPerPage }} </span>
          <MazSelect
            v-model="pageSizeModel"
            :options="pageSizeOptions"
            :rounded-size
            :size="inputSize ?? size"
            :color="color"
            list-position="top"
            :style="{ width: '5rem' }"
          />
        </div>

        <span v-if="totalPagesInternal" class="maz-whitespace-nowrap maz-text-sm">
          {{ rowsFromTo.from }} - {{ rowsFromTo.to }} {{ messages.pagination.of }} {{ totalItemsInternal }}
        </span>

        <div class="m-table-footer-pagination-buttons">
          <MazBtn
            :disabled="currentPageModel === 1"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            @click="firstPage"
          >
            <MazChevronDoubleLeft class="maz-text-base" />
          </MazBtn>

          <MazBtn
            :disabled="currentPageModel === 1"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            @click="previousPage"
          >
            <MazChevronLeft class="maz-text-base" />
          </MazBtn>

          <MazBtn
            :disabled="currentPageModel === totalPagesInternal"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            @click="nextPage"
          >
            <MazChevronLeft class="maz-rotate-180 maz-text-base" />
          </MazBtn>

          <MazBtn
            :disabled="currentPageModel === totalPagesInternal"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            @click="lastPage"
          >
            <MazChevronDoubleLeft class="maz-rotate-180 maz-text-base" />
          </MazBtn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-table {
  @apply maz-relative maz-max-w-full;

  &-header {
    @apply maz-flex maz-max-w-full maz-items-center maz-justify-between maz-gap-2 maz-bg-surface maz-py-2;

    &-search {
      @apply maz-flex maz-items-center maz-gap-2;
    }

    &-title {
      @apply maz-font-semibold;
    }
  }

  &-footer {
    @apply maz-flex maz-max-w-full maz-justify-between maz-gap-2 maz-bg-surface maz-p-2;

    &-pagination {
      @apply maz-flex maz-items-center maz-gap-4;

      &-buttons {
        @apply maz-flex maz-items-center maz-gap-1;
      }

      &-items-per-page {
        @apply maz-flex maz-items-center maz-gap-1;
      }
    }
  }

  &-wrapper {
    @apply maz-border maz-border-solid maz-border-divider maz-overflow-hidden;

    &.--scrollable {
      @apply maz-overflow-auto;
    }

    &:not(.--rounded-none) {
      @apply maz-rounded-xl;
    }

    &.--rounded-sm {
      @apply maz-rounded-sm;

      table {
        @apply maz-rounded-sm;

        thead tr:hover:first-child {
          @apply maz-rounded-b-sm;

          th:first-child {
            @apply maz-rounded-tl-sm;
          }

          th:last-child {
            @apply maz-rounded-tr-sm;
          }
        }

        tbody tr:hover:last-child {
          @apply maz-rounded-b-sm;

          td:first-child {
            @apply maz-rounded-bl-sm;
          }

          td:last-child {
            @apply maz-rounded-br-sm;
          }
        }
      }
    }

    &.--rounded-md {
      @apply maz-rounded-md;

      table {
        @apply maz-rounded-md;

        thead tr:hover:first-child {
          @apply maz-rounded-b-md;

          th:first-child {
            @apply maz-rounded-tl-md;
          }

          th:last-child {
            @apply maz-rounded-tr-md;
          }
        }

        tbody tr:hover:last-child {
          @apply maz-rounded-b-md;

          td:first-child {
            @apply maz-rounded-bl-md;
          }

          td:last-child {
            @apply maz-rounded-br-md;
          }
        }
      }
    }

    &.--rounded-lg {
      @apply maz-rounded-lg;

      table {
        @apply maz-rounded-lg;

        thead tr:hover:first-child {
          @apply maz-rounded-b-lg;

          th:first-child {
            @apply maz-rounded-tl-lg;
          }

          th:last-child {
            @apply maz-rounded-tr-lg;
          }
        }

        tbody tr:hover:last-child {
          @apply maz-rounded-b-lg;

          td:first-child {
            @apply maz-rounded-bl-lg;
          }

          td:last-child {
            @apply maz-rounded-br-lg;
          }
        }
      }
    }

    &.--rounded-xl {
      @apply maz-rounded-xl;

      table {
        @apply maz-rounded-xl;

        thead tr:hover:first-child {
          @apply maz-rounded-b-xl;

          th:first-child {
            @apply maz-rounded-tl-xl;
          }

          th:last-child {
            @apply maz-rounded-tr-xl;
          }
        }

        tbody tr:hover:last-child {
          @apply maz-rounded-b-xl;

          td:first-child {
            @apply maz-rounded-bl-xl;
          }

          td:last-child {
            @apply maz-rounded-br-xl;
          }
        }
      }
    }
  }

  &.--has-header {
    @apply maz-rounded;
  }

  &:not(.--has-header) {
    table {
      @apply maz-rounded;
    }
  }

  table {
    @apply maz-table maz-w-full maz-border-collapse maz-bg-surface;

    table-layout: v-bind('tableLayout');

    &.--has-layout {
      @apply maz-w-full;
    }

    &.--elevation {
      @apply maz-drop-shadow-md maz-shadow-elevation;
    }

    & .m-table-select-column {
      @apply maz-w-[2.9rem];
    }

    caption {
      @apply maz-p-3;

      caption-side: v-bind('captionSide');
    }

    thead {
      @apply maz-break-all maz-border-b maz-border-divider;

      th {
        @apply maz-gap-2 maz-break-all maz-font-normal maz-text-muted maz-tracking-tight;

        &.--hidden {
          @apply maz-hidden;
        }

        &.--sortable {
          @apply maz-cursor-pointer hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-400;
        }

        &.--xl {
          @apply maz-px-5 maz-py-5 maz-text-lg;
        }

        &.--lg {
          @apply maz-px-4 maz-py-4 maz-text-base;
        }

        &.--md {
          @apply maz-px-3 maz-py-3 maz-text-sm;
        }

        &.--sm {
          @apply maz-px-2 maz-py-2 maz-text-xs;
        }

        &.--xs {
          @apply maz-px-1 maz-py-1 maz-text-xs;
        }

        &.--mini {
          @apply maz-px-0.5 maz-py-0.5 maz-text-xs;
        }

        span {
          @apply maz-inline-flex maz-items-center maz-gap-1;

          .m-table-sort-icon-wrapper {
            @apply maz-h-4 maz-w-4;
          }

          .m-table-sort-icon {
            @apply maz-text-muted maz-transition-transform maz-duration-300 maz-ease-out;

            &.--sorted {
              @apply maz-block maz-text-foreground;

              &.--up {
                @apply maz-rotate-0;
              }

              &.--down {
                @apply maz-rotate-180;
              }
            }
          }
        }
      }
    }

    tbody {
      &.--divider {
        @apply maz-divide-y maz-divide-divider;
      }
    }
  }
}
</style>
