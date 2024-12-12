<script lang="ts">
/* eslint-disable import/first */
export interface HeadersEnriched {
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

type HeadersNormalized = HeadersEnriched & {
  thHeaders?: ThHTMLAttributes['headers']
  sorted?: 'ASC' | 'DESC'
}

export type Row<T extends Row<T>> = Record<string, any> & {
  selected?: boolean
  action?: (row: T) => unknown
  classes?: HTMLAttributes['class']
}

export type Header = string | HeadersEnriched

export interface MazTableTranslations {
  searchByAllLabel?: string
  searchByPlaceholder?: string
  searchPlaceholder?: string
  paginationAllLabel?: string
  noResults?: string
  actionHeader?: string
  paginationRowsPerPage?: string
  paginationOf?: string
}

export interface MazTableProps<T extends Row<T>> {
  /** class of the table element */
  tableClass?: HTMLAttributes['class']
  /** style of the table element */
  tableStyle?: StyleValue
  /** v-model of the table - list of selected rows */
  modelValue?: (string | boolean | number)[]
  /**
   * size of the table
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   * @default `'md'`
   */
  size?: Size
  /**
   * Size of the search inputs
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   */
  inputSize?: Size
  /** title of the table */
  title?: string
  /** headers of the table */
  headers?: Header[]
  /** allow sort feature to all columns */
  sortable?: boolean
  /** align all headers */
  headersAlign?: ThHTMLAttributes['align']
  /** rows of the table - type: `Record<string, string | boolean | number>[]` ; */
  rows?: T[]
  /** add hover effect on rows */
  hoverable?: boolean
  /** enable search feature into the table header */
  search?: boolean
  /** disabled search in rows - useful to filtering data yourself or make search request to server */
  noSearchInRow?: boolean
  /** placeholder of the search input */
  searchPlaceholder?: string
  /** Disabled search by column (remove select input "search by") */
  noSearchBy?: boolean
  /** placeholder of the search by select */
  searchByPlaceholder?: string
  /** label of the search by of all options */
  searchByAllLabel?: string
  /** search query in input */
  searchQuery?: string
  /** add background color to odd rows */
  backgroundOdd?: boolean
  /** add background color to even rows */
  backgroundEven?: boolean
  /** add shodow to the table */
  elevation?: boolean
  /** no divider between rows */
  divider?: boolean
  /** caption of the table */
  caption?: string
  /**
   * caption side
   * @values `'top' | 'bottom'`
   */
  captionSide?: 'top' | 'bottom'
  /** add pagination into the table footer */
  pagination?: boolean
  /** current page of pagination */
  page?: number
  /** number of items per page */
  pageSize?: number
  /** pages count */
  totalPages?: number
  /** label of the pagination all option */
  paginationAllLabel?: string
  /** no paginate rows - useful to make paginate request with your server */
  noPaginateRows?: boolean
  /** total number of items */
  totalItems?: number
  /** loading state */
  loading?: boolean
  /** Enable selection of rows */
  selectable?: boolean
  /** Enable selection of rows - key of the selected row */
  selectedKey?: string
  /**
   * table layout
   * @values `'auto' | 'fixed'`
   */
  tableLayout?: 'auto' | 'fixed'
  /** color of the loading bar */
  color?: Color
  /**
   * translations
   * @default `{ searchByAllLabel: 'All', searchByPlaceholder: 'Search by', searchPlaceholder: 'Search', paginationAllLabel: 'All', noResults: 'No results' }`
   * @type {Translations}
   */
  translations?: MazTableTranslations
  /**
   * Size radius of the component's border
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'lg'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Enable scrollable on table
   * @default `false`
   */
  scrollable?: boolean
}

export interface MazTableProvide {
  size: Ref<Size>
  hoverable: Ref<boolean>
  backgroundEven: Ref<boolean>
  backgroundOdd: Ref<boolean>
}

export const mazTableKey = 'maz-table' as const
</script>

<script lang="ts" setup generic="T extends Row<T>">
import type { MazSelectOption } from '@components/MazSelect.vue'
import type { Color, Size } from '@components/types'

import {
  computed,
  defineAsyncComponent,
  type HTMLAttributes,
  onBeforeMount,
  provide,
  type Ref,
  ref,
  type StyleValue,
  type ThHTMLAttributes,
  toRefs,
  useSlots,
  watch,
} from 'vue'

const props = withDefaults(defineProps<MazTableProps<T>>(), {
  tableClass: undefined,
  tableStyle: undefined,
  modelValue: undefined,
  title: undefined,
  size: 'md',
  rows: undefined,
  searchQuery: undefined,
  headers: undefined,
  headersAlign: 'left',
  caption: undefined,
  page: 1,
  pageSize: 20,
  totalItems: undefined,
  selectedKey: undefined,
  captionSide: 'bottom',
  tableLayout: undefined,
  searchPlaceholder: 'Search',
  searchByPlaceholder: 'Search by',
  searchByAllLabel: 'All',
  paginationAllLabel: 'All',
  color: 'primary',
  totalPages: undefined,
  roundedSize: 'lg',
  scrollable: false,
})
const emits = defineEmits<{
  /**
   * emitted when a row is selected
   * @property {(Row | string | number | boolean)[]} value list of selected rows (if selectedKey is defined, it will be the value of the selectedKey of the row)
   */
  (event: 'update:model-value', value: (Row<T> | string | number | boolean)[] | undefined): void
  /**
   * emitted when enter a value in the search input
   * @property {string} searchQuery search query
   */
  (event: 'update:search-query', searchQuery: string | undefined): void
  /**
   * emitted when the current page of the pagination change
   * @property {number} page current page
   */
  (event: 'update:page', page: number): void
  /**
   * emitted when the page size of the pagination change
   * @property {number} pageSize current page size
   */
  (event: 'update:page-size', pageSize: number): void
}>()

const MazBtn = defineAsyncComponent(() => import('@components/MazBtn.vue'))
const MazCheckbox = defineAsyncComponent(() => import('@components/MazCheckbox.vue'))
const MazInput = defineAsyncComponent(() => import('@components/MazInput.vue'))
const MazLoadingBar = defineAsyncComponent(() => import('@components/MazLoadingBar.vue'))
const MazSelect = defineAsyncComponent(() => import('@components/MazSelect.vue'))
const MazTableCell = defineAsyncComponent(() => import('@components/MazTableCell.vue'))
const MazTableRow = defineAsyncComponent(() => import('@components/MazTableRow.vue'))
const MazTableTitle = defineAsyncComponent(() => import('@components/MazTableTitle.vue'))

const ArrowIcon = defineAsyncComponent(() => import('@icons/arrow-up.svg'))
const ChevronDoubleIcon = defineAsyncComponent(() => import('@icons/chevron-double-left.svg'))
const ChevronIcon = defineAsyncComponent(() => import('@icons/chevron-left.svg'))
const SearchIcon = defineAsyncComponent(() => import('@icons/magnifying-glass.svg'))

const defaultTranslations: Required<MazTableTranslations> = {
  noResults: 'No results',
  actionHeader: 'Actions',
  searchByAllLabel: 'All',
  searchByPlaceholder: 'Search by',
  searchPlaceholder: 'Search',
  paginationAllLabel: 'All',
  paginationRowsPerPage: 'Rows per page',
  paginationOf: 'of',
}

const t = computed<Required<MazTableTranslations>>(() => {
  const { translations, searchByAllLabel, searchByPlaceholder, searchPlaceholder, paginationAllLabel } = props

  return {
    ...defaultTranslations,
    ...translations,
    searchByAllLabel,
    searchByPlaceholder,
    searchPlaceholder,
    paginationAllLabel,
  }
})

const hasDivider = computed<boolean>(
  () => props.divider && !props.backgroundEven && !props.backgroundOdd,
)

const { size, hoverable, backgroundEven, backgroundOdd } = toRefs(props)

provide<MazTableProvide>(mazTableKey, {
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
  { label: t.value.paginationAllLabel, value: Number.POSITIVE_INFINITY },
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
  return props.totalPages
    ?? (pageSizeModel.value === Number.POSITIVE_INFINITY || !props.rows?.length)
    ? 1
    : Math.ceil(props.rows.length / pageSizeModel.value)
})

function firstPage() {
  currentPageModel.value = 1
}
function lastPage() {
  currentPageModel.value = totalPagesInternal.value
}

function previousPage() {
  currentPageModel.value = currentPageModel.value - 1
}
function nextPage() {
  currentPageModel.value = currentPageModel.value + 1
}

const rowsOfPage = computed(() => {
  if (
    !props.pagination
    || props.noPaginateRows
    || pageSizeModel.value === Number.POSITIVE_INFINITY
  ) {
    return rowsNormalized.value
  }

  const start = (currentPage.value - 1) * pageSizeModel.value
  const end = start + pageSizeModel.value

  return rowsNormalized.value.slice(start, end)
})

watch(
  () => [props.rows, props.modelValue],
  () => {
    rowsNormalized.value = getNormalizedRows()
  },
)

const sortedColumnIndex = ref<number>()
const sortType = ref<'ASC' | 'DESC'>()

const headersNormalized = ref<HeadersNormalized[]>(getNormalizedHeaders())

const searchByKey = ref<string>()
const searchByOptions = computed<MazSelectOption[]>(() => [
  { label: props.searchByAllLabel, value: null },
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
  if (props.noSearchInRow || typeof searchQueryModel.value !== 'string')
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

const hasHeader = computed<boolean>(() => props.search || !!props.title || !!slots.title)
const hasFooter = computed<boolean>(() => props.pagination)

function getNormalizedHeaders(): HeadersNormalized[] {
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
  // if (props.selectedKey === undefined) {
  //   return
  // }

  return rowsFiltered.value
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
        <slot name="title">
          <span class="m-table-header-title">
            {{ title }}
          </span>
        </slot>
      </div>

      <div v-if="search" class="m-table-header-search">
        <MazSelect
          v-if="!noSearchBy"
          v-model="searchByKey"
          :rounded-size
          :color
          :style="{ width: '8rem' }"
          :placeholder="t.searchByPlaceholder"
          :size="inputSize ?? size"
          :options="searchByOptions"
        />
        <MazInput
          v-model="searchQueryModel"
          :size="inputSize ?? size"
          :rounded-size
          :color
          :debounce="300"
          :placeholder="t.searchPlaceholder"
          :left-icon="SearchIcon"
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
            @slot caption - add caption on top or bottom of the table
          -->
          <slot name="caption">
            {{ caption }}
          </slot>
        </caption>

        <thead v-if="headersNormalized">
          <!--
            @slot thead - content in thead element
          -->
          <slot name="thead">
            <MazTableRow no-hoverable>
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
                  @slot header - replace column header
                    @binding {Object} header - header data
                    @binding {String} label - header label
                -->
                  <slot name="header" :header="header" :label="header.label">
                    <!--
                      @slot header-label-{key} - replace column header label
                        @binding {Object} header - header data
                        @binding {String} label - header label
                    -->
                    <slot :name="`header-label-${header.key}`" :header="header" :label="header.label">
                      {{ header.label }}
                    </slot>

                    <div v-if="header.sortable ?? sortable" class="m-table-sort-icon-wrapper">
                      <ArrowIcon
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
                  @slot actions-header - replace text of actions header
                -->
                <slot name="actions-header">
                  {{ t.actionHeader }}
                </slot>
              </MazTableTitle>
            </MazTableRow>
          </slot>
        </thead>

        <MazLoadingBar v-if="loading" :color="color" class="!maz-absolute" />

        <tbody :class="{ '--divider': hasDivider }">
          <slot>
            <template v-if="rowsFiltered.length > 0">
              <MazTableRow
                v-for="(row, rowIndex) in rowsFiltered"
                :key="rowIndex"
                :class="row.classes"
                @click="row.action && row.action(row)"
              >
                <MazTableCell v-if="isSelectable" class="m-table-select-column">
                  <!--
                    @slot select - replace checkbox component
                      @binding {Object} row - row data
                      @binding {Boolean} selected - if selected or not
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
                    @slot cell - replace all row cells
                      @binding {Object} row - row data
                      @binding {Boolean} value - cell value
                  -->
                  <slot v-if="key" name="cell" :row="row" :value="row[key]">
                    <!--
                      @slot cell-{key} - replace row cells of column
                        @binding {Object} row - row data
                        @binding {Boolean} value - cell value
                    -->
                    <slot :name="`cell-${key}`" :row="row" :value="row[key]">
                      {{ row[key] }}
                    </slot>
                  </slot>
                </MazTableCell>
                <MazTableCell v-if="$slots.actions">
                  <!--
                    @slot actions - will add actions column
                      @binding {Object} row - row data
                  -->
                  <slot name="actions" :row="row" />
                </MazTableCell>
              </MazTableRow>
            </template>
            <template v-else>
              <MazTableRow>
                <MazTableCell
                  :colspan="
                    headersNormalized.length + (isSelectable ? 1 : 0) + ($slots.actions ? 1 : 0)
                  "
                >
                  <!--
                    @slot no-results - replace no results
                  -->
                  <slot name="no-results">
                    <p class="maz-text-center maz-text-muted">
                      <!--
                        @slot no-results-text - replace no results test only
                      -->
                      <slot name="no-results-text">
                        {{ t.noResults }}
                      </slot>
                    </p>
                  </slot>
                </MazTableCell>
              </MazTableRow>
            </template>
          </slot>
        </tbody>
      </table>
    </div>

    <div v-if="hasFooter" class="m-table-footer">
      <div class="m-table-spacer" />

      <div v-if="pagination" class="m-table-footer-pagination">
        <div class="m-table-footer-pagination-items-per-page">
          <span class="maz-hidden maz-text-sm tab-s:maz-block"> {{ t.paginationRowsPerPage }} </span>
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
          {{ currentPageModel }} - {{ rowsFiltered.length }} {{ t.paginationOf }} {{ totalPagesInternal }}
        </span>

        <div class="m-table-footer-pagination-buttons">
          <MazBtn
            :disabled="currentPageModel === 1"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            no-elevation
            @click="firstPage"
          >
            <ChevronDoubleIcon class="maz-text-base" />
          </MazBtn>

          <MazBtn
            :disabled="currentPageModel === 1"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            no-elevation
            @click="previousPage"
          >
            <ChevronIcon class="maz-text-base" />
          </MazBtn>
          <MazBtn
            :disabled="currentPageModel === totalPagesInternal"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            no-elevation
            @click="nextPage"
          >
            <ChevronIcon class="maz-rotate-180 maz-text-base" />
          </MazBtn>

          <MazBtn
            :disabled="currentPageModel === totalPagesInternal"
            :size="inputSize ?? size"
            color="transparent"
            :rounded-size
            no-elevation
            @click="lastPage"
          >
            <ChevronDoubleIcon class="maz-rotate-180 maz-text-base" />
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
    @apply maz-flex maz-max-w-full maz-items-center maz-justify-between maz-gap-2 maz-bg-color maz-py-2;

    &-search {
      @apply maz-flex maz-items-center maz-gap-2;
    }

    &-title {
      @apply maz-font-semibold;
    }
  }

  &-footer {
    @apply maz-flex maz-max-w-full maz-justify-between maz-gap-2 maz-bg-color maz-p-2;

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
    @apply maz-border maz-border-solid maz-border-color-light;

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
    @apply maz-table maz-w-full maz-border-collapse maz-bg-color;

    table-layout: v-bind('tableLayout');

    &.--has-layout {
      @apply maz-w-full;
    }

    &.--elevation {
      @apply maz-elevation;
    }

    & .m-table-select-column {
      @apply maz-w-[2.9rem];
    }

    caption {
      @apply maz-p-3;

      caption-side: v-bind('captionSide');
    }

    thead {
      @apply maz-break-all maz-border-b maz-border-color-light;

      th {
        @apply maz-gap-2 maz-break-all maz-font-normal maz-text-muted maz-tracking-tight;

        &.--hidden {
          @apply maz-hidden;
        }

        &.--sortable {
          @apply maz-cursor-pointer hover:maz-bg-color-dark;
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
              @apply maz-block maz-text-normal;

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
        @apply maz-divide-y maz-divide-color-light;
      }
    }
  }
}
</style>
