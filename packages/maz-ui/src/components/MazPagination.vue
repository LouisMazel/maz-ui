<script lang="ts" setup>
import type { MazBtnProps } from './MazBtn.vue'
import type { MazColor, MazNeutralColor, MazSize } from './types.ts'
import { MazEllipsisHorizontal } from '@maz-ui/icons/lazy/MazEllipsisHorizontal'
import { MazChevronDoubleLeft } from '@maz-ui/icons/raw/MazChevronDoubleLeft'
import { MazChevronLeft } from '@maz-ui/icons/raw/MazChevronLeft'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, ref, shallowRef } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useRovingFocus } from '../composables/useRovingFocus.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazBtn from './MazBtn.vue'
import MazIcon from './MazIcon.vue'
import MazRollingText from './MazRollingText.vue'

const {
  modelValue = 1,
  buttonProps,
  pageRange = 1,
  activeColor = 'contrast',
  totalPages,
  loading,
  animated = true,
  fixedSlots = false,
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
  color: 'container',
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
   * Color of the active button.
   * @values 'contrast', 'neutral', 'primary', 'secondary', 'info', 'success', 'warning', 'destructive', 'accent', 'surface', 'container'
   * @default 'contrast'
   */
  activeColor?: MazColor | MazNeutralColor
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
  /**
   * Always renders the same number of buttons (the pages around the current one, the first and the last, and the ellipses),
   * so the pagination does not change its width when the current page moves
   * @default false
   */
  fixedSlots?: boolean
  /**
   * The current page slides from a button to another and the numbers that change roll
   * @default true
   */
  animated?: boolean
}

const { t } = useTranslations()

const { size } = useGlobalConfig<{ size: MazSize }>('MazPagination', { size: 'md' })

const buttonsPropsMerged = computed<MazBtnProps>(() => ({
  ...DEFAULT_BUTTONS_PROPS,
  ...buttonProps,
}))

const previousPage = computed(() => (modelValue > 1
  ? modelValue - 1
  : 1))
const nextPage = computed(() =>
  modelValue < totalPages
    ? modelValue + 1
    : totalPages,
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
  modelValue - pageRange > 1
    ? allPages.value.slice(0, 1)
    : [],
)

const lastOne = computed(() =>
  modelValue < totalPages - pageRange
    ? allPages.value.slice(-1)
    : [],
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
  modelValue - pageRange > 2
    ? [
        { divider: true },
      ]
    : [],
)
const lastDivider = computed(() =>
  modelValue < totalPages - pageRange - 1
    ? [
        { divider: true },
      ]
    : [],
)

type PaginationItem = (typeof allPages.value)[number] | { divider: boolean }

/** Same number of items wherever the current page is: the first and the last page, two ellipses and `2 * pageRange + 1` pages around */
const fixedItems = computed<PaginationItem[]>(() => {
  const slots = pageRange * 2 + 5

  if (totalPages <= slots)
    return allPages.value

  const edge = pageRange * 2 + 3

  if (modelValue <= pageRange + 3)
    return [...allPages.value.slice(0, edge), { divider: true }, allPages.value.at(-1)!]

  if (modelValue >= totalPages - pageRange - 2)
    return [allPages.value[0], { divider: true }, ...allPages.value.slice(-edge)]

  return [
    allPages.value[0],
    { divider: true },
    ...allPages.value.slice(modelValue - pageRange - 1, modelValue + pageRange),
    { divider: true },
    allPages.value.at(-1)!,
  ]
})

const pages = computed<PaginationItem[]>(() => fixedSlots
  ? fixedItems.value
  : [
      ...firstOne.value,
      ...firstDivider.value,
      ...range.value,
      ...lastDivider.value,
      ...lastOne.value,
    ])

/** Index of each button among all the buttons of the navigation (first, previous, the pages, next, last) */
const pagesWithButtonIndex = computed(() => {
  let buttonIndex = 1

  return pages.value.map((page) => {
    if ('number' in page)
      buttonIndex++

    return { page, buttonIndex }
  })
})

const nextButtonIndex = computed(() => pagesWithButtonIndex.value.reduce((count, { page }) => count + ('number' in page
  ? 1
  : 0), 2))

const activeButtonIndex = computed(() => {
  const active = pagesWithButtonIndex.value.find(({ page }) => 'number' in page && page.isActive)

  return active?.buttonIndex ?? 0
})

function isButtonDisabled(index: number) {
  if (index <= 1)
    return modelValue === 1
  if (index >= nextButtonIndex.value)
    return modelValue === totalPages

  return false
}

const navRef = ref<HTMLElement>()
const focusedIndex = ref<number>()

const { onKeydown, currentIndex } = useRovingFocus({
  container: navRef,
  selector: 'button',
  loop: false,
  currentIndex: computed({
    get: () => focusedIndex.value ?? activeButtonIndex.value,
    set: (index: number) => {
      focusedIndex.value = index
    },
  }),
})

/** Roving tabindex: only the current page (or the button focused with the arrows) is in the tab sequence */
function getTabIndex(index: number) {
  const current = currentIndex.value
  const focusable = isButtonDisabled(current)
    ? Array.from({ length: nextButtonIndex.value + 2 }, (_, i) => i).find(i => !isButtonDisabled(i)) ?? 0
    : current

  return index === focusable
    ? 0
    : -1
}

function onFocusout(event: FocusEvent) {
  if (!navRef.value?.contains(event.relatedTarget as Node | null))
    focusedIndex.value = undefined
}

const { variant: globalVariant, roundedSize: globalRoundedSize } = useGlobalConfig<{ variant?: string, roundedSize: keyof typeof ROUNDED_SIZE_CLASS }>('MazBtn', { variant: undefined, roundedSize: 'md' })

/** The sliding pill replaces the background of the active page when it is solid */
const hasPill = computed(() => {
  const variant = buttonsPropsMerged.value.variant ?? globalVariant?.value

  return !buttonsPropsMerged.value.pastel
    && (variant === undefined || variant === 'solid' || variant === 'outline')
})

const activeButton = shallowRef<HTMLElement>()

function setActiveButton(element: unknown, isActive: boolean) {
  if (!isActive || !element)
    return

  activeButton.value = (element as { $el?: HTMLElement }).$el ?? element as HTMLElement
}

const { style: pillStyle } = useSlidingIndicator({
  container: navRef,
  active: () => hasPill.value
    ? activeButton.value
    : undefined,
  orientation: 'vertical',
  animated,
})

const hasPillBorder = computed(() => ['surface', 'container', 'neutral'].includes(activeColor))

const pillBackground = computed(() => {
  if (activeColor === 'container')
    return 'var(--maz-container-bg, var(--maz-surface))'

  return `var(--maz-${activeColor})`
})

const pillRounded = computed(() => buttonsPropsMerged.value.fab
  ? 'maz:rounded-full'
  : ROUNDED_SIZE_CLASS[buttonsPropsMerged.value.roundedSize ?? globalRoundedSize.value])

function setPageNumber(page: number) {
  if (page === modelValue)
    return

  emits('update:model-value', page)
}
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <nav
    ref="navRef"
    class="m-pagination m-reset-css maz:relative maz:isolate"
    role="navigation"
    :aria-label="t('pagination.navAriaLabel')"
    @keydown="onKeydown"
    @focusout="onFocusout"
  >
    <div
      v-if="hasPill"
      aria-hidden="true"
      class="m-pagination__pill maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0 maz:z-1"
      :class="[pillRounded, { 'maz:border maz:border-divider': hasPillBorder, 'maz:opacity-0!': loading }]"
      :style="[pillStyle, { backgroundColor: pillBackground }]"
    />
    <ul class="maz:m-0! maz:inline-flex maz:list-none! maz:items-center maz:gap-2 maz:-space-x-px maz:p-0! maz:align-top maz:text-base">
      <li class="maz:m-0">
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === 1"
          aria-label="First Page, Page 1"
          :size="size"
          :tabindex="getTabIndex(0)"
          @click="setPageNumber(1)"
        >
          <span class="maz:sr-only">
            <!--
              @slot Accessible text for screen reader of the previous page button
                @binding {number} page - first page number
            -->
            <slot name="first-page-sr" :page="1">
              {{ t('pagination.screenReader.firstPage', { page: 1 }) }}
            </slot>
          </span>
          <MazIcon :icon="MazChevronDoubleLeft" class="maz:rtl:rotate-180" />
        </MazBtn>
      </li>

      <li class="maz:m-0">
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === 1"
          :aria-label="`Previous Page, Page ${previousPage}`"
          :size="size"
          :tabindex="getTabIndex(1)"
          @click="setPageNumber(previousPage)"
        >
          <span class="maz:sr-only">
            <!--
              @slot Accessible text for screen reader of the first page button
                @binding {number} page - previous page number
            -->
            <slot name="previous-page-sr" :page="previousPage">
              {{ t('pagination.screenReader.previousPage', { page: previousPage }) }}
            </slot>
          </span>
          <MazIcon :icon="MazChevronLeft" class="maz:rtl:rotate-180" />
        </MazBtn>
      </li>

      <li
        v-for="({ page, buttonIndex }, i) in pagesWithButtonIndex"
        :id="'number' in page ? `button-${i}-${page.number}` : `ellipsis-${i}`"
        :key="'number' in page ? `button-${i}` : `ellipsis-${i}`"
        class="maz:m-0"
      >
        <template v-if="'number' in page">
          <MazBtn
            v-bind="{
              ...buttonsPropsMerged,
              ...(page.isActive && buttonsPropsMerged.variant === 'outline' && { variant: 'solid' }),
              color: page.isActive ? activeColor : buttonsPropsMerged.color,
              outlined: page.isActive ? false : buttonsPropsMerged.outlined,
            }"
            :ref="(button) => setActiveButton(button, page.isActive)"
            :size="size"
            :tabindex="getTabIndex(buttonIndex)"
            :aria-label="`Page ${page.number}`"
            :aria-current="page.isActive ? 'page' : undefined"
            :loading="page.loading"
            :class="{ active: page.isActive }"
            @click="page.isActive ? undefined : setPageNumber(page.number)"
          >
            <span class="maz:sr-only">
              <!--
                @slot Accessible text for screen reader of the current page button
                  @binding {number} page - current page number
              -->
              <slot name="page-sr" :page="page.number">
                {{ t('pagination.screenReader.page', { page: page.number }) }}
              </slot>
            </span>
            <MazRollingText class="maz:relative maz:z-2" :value="page.number" :animated="animated" />
          </MazBtn>
        </template>

        <template v-else-if="page.divider">
          <div v-bind="buttonsPropsMerged" class="flex-center flex p-2">
            <MazEllipsisHorizontal />
          </div>
        </template>
      </li>

      <li class="maz:m-0">
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === totalPages"
          :aria-label="`Next Page, Page ${nextPage}`"
          :size="size"
          :tabindex="getTabIndex(nextButtonIndex)"
          @click="setPageNumber(nextPage)"
        >
          <span class="maz:sr-only">
            <!--
              @slot Accessible text for screen reader of the next page button
                @binding {number} page - next page number
            -->
            <slot name="next-page-sr" :page="nextPage">
              {{ t('pagination.screenReader.nextPage', { page: nextPage }) }}
            </slot>
          </span>
          <MazIcon :icon="MazChevronLeft" class="maz:-rotate-180 maz:rtl:rotate-0" />
        </MazBtn>
      </li>

      <li class="maz:m-0">
        <MazBtn
          v-bind="buttonsPropsMerged"
          :disabled="modelValue === totalPages"
          :aria-label="`Next Page, Page ${totalPages}`"
          :size="size"
          :tabindex="getTabIndex(nextButtonIndex + 1)"
          @click="setPageNumber(totalPages)"
        >
          <span class="maz:sr-only">
            <!--
              @slot Accessible text for screen reader of the last page button
                @binding {number} page - last page number
            -->
            <slot name="last-page-sr" :page="totalPages">
              {{ t('pagination.screenReader.lastPage', { page: totalPages }) }}
            </slot>
          </span>
          <MazIcon :icon="MazChevronDoubleLeft" class="maz:-rotate-180 maz:rtl:rotate-0" />
        </MazBtn>
      </li>
    </ul>
  </nav>
</template>
