<script lang="ts" setup>
import type { MazBtnProps } from './MazBtn.vue'
import type { Color, Size } from './types'
import { computed, defineAsyncComponent } from 'vue'
import MazBtn from './MazBtn.vue'

const props = withDefaults(defineProps<MazPaginationProps>(), {
  modelValue: 1,
  buttonProps: undefined,
  pageRange: 2,
  resultsSize: undefined,
  activeColor: 'primary',
  size: 'md',
})
const emits = defineEmits<
  /**
   * Emitted when the current page number is changed.
   * @property {number} value - new page number
   */
  (event: 'update:model-value', value: number) => void
>()
const ChevronLeft = defineAsyncComponent(() => import('../../icons/chevron-left.svg'))
const ChevronDoubleLeft = defineAsyncComponent(() => import('../../icons/chevron-double-left.svg'))
const Ellipsis = defineAsyncComponent(() => import('../../icons/ellipsis-horizontal.svg'))

const DEFAULT_BUTTONS_PROPS: Partial<MazBtnProps> = {
  size: 'md',
  color: 'theme',
  outline: true,
  noElevation: true,
  fab: true,
}

export interface MazPaginationProps {
  /** @model The current page number. */
  modelValue?: number
  /**
   * Props apply to the MazBtn components.
   */
  buttonProps?: Partial<MazBtnProps>
  /**
   * Number of results in this page. Useful for accessibility to set aria-setsize attribute. Partial of MazBtn props.
   */
  resultsSize?: number
  /**
   * Color of the active button.
   */
  activeColor?: Color
  /**
   * Color of the active button.
   */
  size?: Size
  /**
   * Total number of pages.
   */
  totalPages: number
  /**
   * Number of buttons to display before and after the current page.
   */
  pageRange?: number
  /**
   * Enable loading state of current button
   */
  loading?: boolean
}

const buttonsPropsMerged = computed<MazBtnProps>(() => ({
  ...DEFAULT_BUTTONS_PROPS,
  ...props.buttonProps,
}))

const previousPage = computed(() => (props.modelValue > 1 ? props.modelValue - 1 : 1))
const nextPage = computed(() =>
  props.modelValue < props.totalPages ? props.modelValue + 1 : props.totalPages,
)

const allPages = computed(() =>
  Array.from({ length: props.totalPages }, (_, index) => {
    const itemNumber = index + 1
    return {
      number: itemNumber,
      isActive: itemNumber === props.modelValue,
      loading: itemNumber === props.modelValue && props.loading,
    }
  }),
)

const firstOne = computed(() =>
  props.modelValue - props.pageRange > 1 ? allPages.value.slice(0, 1) : [],
)

const lastOne = computed(() =>
  props.modelValue < props.totalPages - props.pageRange ? allPages.value.slice(-1) : [],
)

const rangeStartAt = computed(() => {
  return props.modelValue - props.pageRange - 1 < 0
    ? 0
    : props.modelValue - props.pageRange - 1 > props.totalPages - props.pageRange
      ? props.totalPages - props.pageRange
      : props.modelValue - props.pageRange - 1
})
const rangeEndAt = computed(() =>
  props.modelValue + props.pageRange > props.totalPages
    ? props.totalPages
    : props.modelValue + props.pageRange < props.pageRange
      ? props.pageRange
      : props.modelValue + props.pageRange,
)
const range = computed(() => allPages.value.slice(rangeStartAt.value, rangeEndAt.value))

const firstDivider = computed(() =>
  props.modelValue - props.pageRange > 2 ? [{ divider: true }] : [],
)
const lastDivider = computed(() =>
  props.modelValue < props.totalPages - props.pageRange - 1 ? [{ divider: true }] : [],
)

const pages = computed(() => [
  ...firstOne.value,
  ...firstDivider.value,
  ...range.value,
  ...lastDivider.value,
  ...lastOne.value,
])

function setPageNumber(page: number) {
  if (page === props.modelValue)
    return

  emits('update:model-value', page)
}
</script>

<template>
  <nav class="m-pagination m-reset-css" role="navigation" aria-label="page navigation">
    <ul>
      <li>
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === 1"
          aria-label="First Page, Page 1"
          :aria-setsize="resultsSize ?? undefined"
          aria-posinset="1"
          :size="size"
          @click="setPageNumber(1)"
        >
          <span class="maz-sr-only">
            <!--
              @slot Accessible text for screen reader of the previous page button
                @binding {number} page - first page number
            -->
            <slot name="first-page-sr" :page="1">First Page, page 1</slot>
          </span>
          <ChevronDoubleLeft />
        </MazBtn>
      </li>

      <li>
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === 1"
          :aria-label="`Previous Page, Page ${previousPage}`"
          :aria-setsize="resultsSize ?? undefined"
          :aria-posinset="previousPage"
          :size="size"
          @click="setPageNumber(previousPage)"
        >
          <span class="maz-sr-only">
            <!--
              @slot Accessible text for screen reader of the first page button
                @binding {number} page - previous page number
            -->
            <slot name="previous-page-sr" :page="previousPage">
              Previous Page, page {{ previousPage }}
            </slot>
          </span>
          <ChevronLeft />
        </MazBtn>
      </li>

      <li
        v-for="(page, i) in pages"
        :id="'number' in page ? `button-${i}-${page.number}` : `ellipsis-${i}`"
        :key="'number' in page ? `button-${i}-${page.number}` : `ellipsis-${i}`"
      >
        <template v-if="'number' in page">
          <MazBtn
            v-bind="{
              ...buttonsPropsMerged,
              color: page.isActive ? activeColor : buttonsPropsMerged.color,
              outline: page.isActive ? false : buttonsPropsMerged.outline,
            }"
            :size="size"
            :aria-label="`Page ${page.number}`"
            :aria-current="page.isActive ? 'true' : 'false'"
            :aria-setsize="resultsSize ?? undefined"
            :loading="page.loading"
            :aria-posinset="page.number"
            :class="{ active: page.isActive }"
            @click="page.isActive ? undefined : setPageNumber(page.number)"
          >
            <span class="maz-sr-only">
              <!--
                @slot Accessible text for screen reader of the current page button
                  @binding {number} page - current page number
              -->
              <slot name="page-sr" :page="page.number">Page {{ page.number }}</slot>
            </span>
            {{ page.number }}
          </MazBtn>
        </template>

        <template v-else-if="page.divider">
          <div v-bind="buttonsPropsMerged" class="flex p-2 flex-center">
            <Ellipsis />
          </div>
        </template>
      </li>

      <li>
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === totalPages"
          :aria-label="`Next Page, Page ${nextPage}`"
          :aria-setsize="resultsSize ?? undefined"
          :aria-posinset="nextPage"
          :size="size"
          @click="setPageNumber(nextPage)"
        >
          <span class="maz-sr-only">
            <!--
              @slot Accessible text for screen reader of the next page button
                @binding {number} page - next page number
            -->
            <slot name="next-page-sr" :page="nextPage">Next Page, page {{ nextPage }}</slot>
          </span>
          <ChevronLeft class="-maz-rotate-180" />
        </MazBtn>
      </li>

      <li>
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === totalPages"
          :aria-label="`Next Page, Page ${totalPages}`"
          :aria-setsize="resultsSize ?? undefined"
          :aria-posinset="totalPages"
          :size="size"
          @click="setPageNumber(totalPages)"
        >
          <span class="maz-sr-only">
            <!--
              @slot Accessible text for screen reader of the last page button
                @binding {number} page - last page number
            -->
            <slot name="last-page-sr" :page="totalPages">Last Page, page {{ totalPages }}</slot>
          </span>
          <ChevronDoubleLeft class="-maz-rotate-180" />
        </MazBtn>
      </li>
    </ul>
  </nav>
</template>

<style lang="postcss" scoped>
  .m-pagination {
  ul {
    @apply !maz-m-0 maz-inline-flex !maz-list-none maz-items-center maz-gap-2 -maz-space-x-px !maz-p-0 maz-align-top maz-text-base;

    li {
      @apply maz-m-0;
    }
  }
}
</style>
