<script lang="ts" setup>
import type { MazBtnProps } from './MazBtn.vue'
import type { MazColor, MazSize } from './types'
import { MazChevronDoubleLeft, MazChevronLeft, MazEllipsisHorizontal } from '@maz-ui/icons'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { computed } from 'vue'
import MazBtn from './MazBtn.vue'

const {
  modelValue = 1,
  buttonProps,
  pageRange = 1,
  resultsSize,
  activeColor = 'background',
  totalPages,
  loading,
  size = 'md',
} = defineProps<MazPaginationProps>()

const emits = defineEmits<
  /**
   * Emitted when the current page number is changed.
   * @property {number} value - new page number
   */
  (event: 'update:model-value', value: number) => void
>()

const DEFAULT_BUTTONS_PROPS: Partial<MazBtnProps> = {
  size: 'md',
  color: 'background',
  outlined: true,
  fab: true,
}

export interface MazPaginationProps {
  /**
   * The current page number.
   * @model
   * @default 1
   */
  modelValue?: number
  /**
   * Props apply to the MazBtn components.
   * @type {Partial<MazBtnProps>}
   * @default undefined
   */
  buttonProps?: Partial<MazBtnProps>
  /**
   * Number of results in this page. Useful for accessibility to set aria-setsize attribute. Partial of MazBtn props.
   * @default undefined
   */
  resultsSize?: number
  /**
   * Color of the active button.
   * @values 'contrast', 'primary', 'secondary', 'info', 'success', 'warning', 'destructive', 'accent', 'background'
   * @default 'contrast'
   */
  activeColor?: MazColor | 'background'
  /**
   * Size of the buttons.
   * @values 'mini', 'xs', 'sm', 'md', 'lg', 'xl'
   * @default 'md'
   */
  size?: MazSize
  /**
   * Total number of pages.
   * @default 10
   */
  totalPages: number
  /**
   * Number of buttons to display before and after the current page.
   * @default 1
   */
  pageRange?: number
  /**
   * Enable loading state of current button
   * @default false
   */
  loading?: boolean
}

const { t } = useTranslations()

const buttonsPropsMerged = computed<MazBtnProps>(() => ({
  ...DEFAULT_BUTTONS_PROPS,
  ...buttonProps,
}))

const previousPage = computed(() => (modelValue > 1 ? modelValue - 1 : 1))
const nextPage = computed(() =>
  modelValue < totalPages ? modelValue + 1 : totalPages,
)

const allPages = computed(() =>
  Array.from({ length: totalPages }, (_, index) => {
    const itemNumber = index + 1
    return {
      number: itemNumber,
      isActive: itemNumber === modelValue,
      loading: itemNumber === modelValue && loading,
    }
  }),
)

const firstOne = computed(() =>
  modelValue - pageRange > 1 ? allPages.value.slice(0, 1) : [],
)

const lastOne = computed(() =>
  modelValue < totalPages - pageRange ? allPages.value.slice(-1) : [],
)

const rangeStartAt = computed(() => {
  const baseStart = modelValue - pageRange - 1
  if (baseStart < 0)
    return 0
  if (baseStart > totalPages - pageRange)
    return totalPages - pageRange
  return baseStart
})
const rangeEndAt = computed(() => {
  const baseEnd = modelValue + pageRange
  if (baseEnd > totalPages)
    return totalPages
  if (baseEnd < pageRange)
    return pageRange
  return baseEnd
})
const range = computed(() => allPages.value.slice(rangeStartAt.value, rangeEndAt.value))

const firstDivider = computed(() =>
  modelValue - pageRange > 2 ? [{ divider: true }] : [],
)
const lastDivider = computed(() =>
  modelValue < totalPages - pageRange - 1 ? [{ divider: true }] : [],
)

const pages = computed(() => [
  ...firstOne.value,
  ...firstDivider.value,
  ...range.value,
  ...lastDivider.value,
  ...lastOne.value,
])

function setPageNumber(page: number) {
  if (page === modelValue)
    return

  emits('update:model-value', page)
}
</script>

<template>
  <nav class="m-pagination m-reset-css" role="navigation" :aria-label="t('pagination.navAriaLabel')">
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
            <slot name="first-page-sr" :page="1">
              {{ t('pagination.screenReader.firstPage', { page: 1 }) }}
            </slot>
          </span>
          <MazChevronDoubleLeft />
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
              {{ t('pagination.screenReader.previousPage', { page: previousPage }) }}
            </slot>
          </span>
          <MazChevronLeft />
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
              outlined: page.isActive ? false : buttonsPropsMerged.outlined,
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
              <slot name="page-sr" :page="page.number">
                {{ t('pagination.screenReader.page', { page: page.number }) }}
              </slot>
            </span>
            {{ page.number }}
          </MazBtn>
        </template>

        <template v-else-if="page.divider">
          <div v-bind="buttonsPropsMerged" class="flex-center flex p-2">
            <MazEllipsisHorizontal />
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
            <slot name="next-page-sr" :page="nextPage">
              {{ t('pagination.screenReader.nextPage', { page: nextPage }) }}
            </slot>
          </span>
          <MazChevronLeft class="-maz-rotate-180" />
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
            <slot name="last-page-sr" :page="totalPages">
              {{ t('pagination.screenReader.lastPage', { page: totalPages }) }}
            </slot>
          </span>
          <MazChevronDoubleLeft class="-maz-rotate-180" />
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
