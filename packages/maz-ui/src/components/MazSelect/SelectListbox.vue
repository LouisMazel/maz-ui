<script lang="ts" setup generic="Option extends Record<string, unknown>">
import type { FuzzySearchSegment } from '@maz-ui/utils/helpers/fuzzySearch'
import type { MazColor } from '../types.ts'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazNoSymbol } from '@maz-ui/icons/lazy/MazNoSymbol'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../../composables/useReducedMotion.ts'
import { useResizeObserver } from '../../composables/useResizeObserver.ts'

export interface SelectListboxProps<Option> {
  /** The id of the listbox */
  id: string
  /** The options, the optgroup headers have `isOptGroup: true` */
  options: Option[]
  /** The accessible name of the listbox */
  label: string
  /** The id of an option, from its index */
  getOptionId: (index: number) => string
  /** Whether the option is selected */
  isSelected: (option: Option) => boolean
  /** Whether the option has no value (muted) */
  isEmptyValue?: (option: Option) => boolean
  /** The key of the label displayed by default */
  labelKey?: string
  /** Display a checkbox in the options and set aria-multiselectable */
  multiple?: boolean
  /** The color of the checkboxes */
  color?: MazColor
  /** The height of an option */
  itemHeight?: number
  /**
   * The focus stays on an input (aria-activedescendant): the options are not focusable and the active one is highlighted
   * @default false
   */
  virtualFocus?: boolean
  /** The index of the active option with `virtualFocus` */
  activeIndex?: number
  /** The text of an option split into the parts matching the search (underlined), the label by default */
  getSegments?: (option: Option) => FuzzySearchSegment[] | undefined
}

const {
  options,
  getOptionId,
  isSelected,
  isEmptyValue,
  labelKey = 'label',
  multiple = false,
  virtualFocus = false,
  activeIndex = -1,
  getSegments,
} = defineProps<SelectListboxProps<Option>>()

const emits = defineEmits<{
  /** An option is chosen */
  select: [option: Option, index: number]
}>()

defineSlots<{
  'default'?: (props: { option: Option, index: number, isSelected: boolean, isActive: boolean }) => unknown
  'optgroup'?: (props: { label: string }) => unknown
  'no-results'?: () => unknown
}>()

const MazCheckbox = defineAsyncComponent(() => import('../MazCheckbox.vue'))

const { t } = useTranslations()
const { shouldReduceMotion } = useReducedMotion()

const wrapperRef = useTemplateRef('wrapper')

const ITEM_SELECTOR = '.m-select-list-item'
const ENTER_DURATION = 400

const hoveredElement = shallowRef<HTMLElement | null>(null)
const focusedElement = shallowRef<HTMLElement | null>(null)
const highlightTarget = shallowRef<HTMLElement | null>(null)
const highlightBox = ref<{ x: number, y: number, width: number, height: number }>()
const isSliding = ref(false)
const isMoving = ref(false)
const isEntering = ref(false)

let enterTimer: ReturnType<typeof setTimeout> | undefined

function resolveHighlightElement() {
  if (hoveredElement.value?.isConnected) {
    return hoveredElement.value
  }

  if (virtualFocus) {
    return activeIndex >= 0 && typeof document !== 'undefined'
      ? document.getElementById(getOptionId(activeIndex))
      : null
  }

  return focusedElement.value?.isConnected
    ? focusedElement.value
    : null
}

function placeHighlight() {
  const element = resolveHighlightElement()
  highlightTarget.value = element && wrapperRef.value ? element : null

  if (!element || !wrapperRef.value) {
    isMoving.value = false
    highlightBox.value = undefined
    return
  }

  isMoving.value = isSliding.value && !!highlightBox.value && !shouldReduceMotion.value
  highlightBox.value = { x: element.offsetLeft, y: element.offsetTop, width: element.offsetWidth, height: element.offsetHeight }
}

watch(
  [hoveredElement, focusedElement, () => activeIndex, () => options, wrapperRef],
  async () => {
    await nextTick()
    placeHighlight()
  },
  { flush: 'post' },
)

useResizeObserver(
  [wrapperRef, highlightTarget],
  () => placeHighlight(),
  { box: 'border-box' },
)

const highlightedId = computed(() => highlightBox.value
  ? highlightTarget.value?.id
  : undefined)

watch(() => activeIndex, () => {
  hoveredElement.value = null
  isSliding.value = false
})

watch(() => options, () => {
  isSliding.value = false
})

watch(wrapperRef, (element) => {
  clearTimeout(enterTimer)
  isEntering.value = !!element

  if (element) {
    enterTimer = setTimeout(() => {
      isEntering.value = false
      placeHighlight()
    }, ENTER_DURATION)
  }
}, { flush: 'post' })

onBeforeUnmount(() => clearTimeout(enterTimer))

function getItemFromEvent(event: Event) {
  return (event.target as HTMLElement | null)?.closest<HTMLElement>(ITEM_SELECTOR) ?? null
}

function onPointerOver(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    return
  }

  const item = getItemFromEvent(event)

  if (item && item !== hoveredElement.value) {
    isSliding.value = true
    hoveredElement.value = item
  }
}

function onPointerLeave() {
  isSliding.value = true
  hoveredElement.value = null
}

function onFocusIn(event: FocusEvent) {
  const item = getItemFromEvent(event)

  if (item) {
    isSliding.value = false
    hoveredElement.value = null
    focusedElement.value = item
  }
}

function onFocusOut(event: FocusEvent) {
  if (!wrapperRef.value?.contains(event.relatedTarget as Node | null)) {
    focusedElement.value = null
  }
}

const highlightStyle = computed(() => highlightBox.value
  ? {
      transform: `translate(${highlightBox.value.x}px, ${highlightBox.value.y}px)`,
      width: `${highlightBox.value.width}px`,
      height: `${highlightBox.value.height}px`,
      opacity: 1,
      transitionProperty: isMoving.value ? 'transform, opacity' : 'opacity',
    }
  : { opacity: 0 })

function getOptionElement(index: number) {
  const id = getOptionId(index)

  return [
    ...wrapperRef.value?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [],
  ].find(element => element.id === id)
}

/**
 * Scroll to a rendered option
 * @param index The index of the option
 * @param options `center` puts the option in the middle of the list (instead of the nearest edge), `focus` focuses it
 */
function scrollToIndex(index: number, { center = false, focus = false } = {}) {
  const item = getOptionElement(index)
  const wrapper = wrapperRef.value

  if (!item || !wrapper) {
    return
  }

  if (center) {
    const wrapperRect = wrapper.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    wrapper.scrollTo?.({
      top: item.offsetTop - wrapperRect.height / 2 - itemRect.height,
      behavior: 'auto',
    })
  }
  else {
    item.scrollIntoView?.({ block: 'nearest' })
  }

  if (focus) {
    setTimeout(() => {
      item.focus({ preventScroll: true })
    }, 100)
  }
}

defineExpose({
  /** Scroll to an option, and focus it */
  scrollToIndex,
})
</script>

<template>
  <!--
    @slot No results slot - Displayed when there is no option
  -->
  <slot v-if="options.length <= 0" name="no-results">
    <span class="m-select-list__no-results" role="status">
      <MazNoSymbol class="maz:size-5 maz:shrink-0" aria-hidden="true" />
      <span>{{ t('aria.noResults') }}</span>
    </span>
  </slot>

  <div
    v-else
    :id
    ref="wrapper"
    class="m-select-list__scroll-wrapper"
    :class="{ '--entering': isEntering }"
    tabindex="-1"
    role="listbox"
    :aria-label="label"
    :aria-multiselectable="multiple ? 'true' : undefined"
    @pointerover="onPointerOver"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <span class="m-select-list__highlight" role="presentation" aria-hidden="true" :style="highlightStyle" />

    <template v-for="(option, i) in options" :key="i">
      <slot v-if="option.label && option.isOptGroup" name="optgroup" :label="String(option.label)">
        <span class="m-select-list-optgroup" role="presentation">
          {{ option.label }}
        </span>
      </slot>

      <button
        v-else
        :id="getOptionId(i)"
        type="button"
        role="option"
        :aria-selected="isSelected(option) ? 'true' : 'false'"
        :tabindex="multiple || virtualFocus ? -1 : 0"
        class="m-select-list-item maz-custom maz:flex-none"
        :class="[
          {
            '--is-selected': isSelected(option),
            '--is-none-value': isEmptyValue?.(option),
            '--is-highlighted': highlightedId === getOptionId(i),
            '--is-active': virtualFocus && activeIndex === i,
          },
        ]"
        :style="itemHeight ? { height: `${itemHeight}px` } : undefined"
        @mousedown="virtualFocus && $event.preventDefault()"
        @click.prevent.stop="emits('select', option, i)"
      >
        <!-- Visual only: the state is aria-selected, a control nested in an option is not allowed -->
        <span v-if="multiple" class="m-select-list-item__checkbox maz:contents" inert>
          <MazCheckbox
            :model-value="isSelected(option)"
            size="sm"
            :color
            tabindex="-1"
          />
        </span>
        <slot
          :option
          :index="i"
          :is-selected="isSelected(option)"
          :is-active="virtualFocus && activeIndex === i"
        >
          <span v-if="getSegments?.(option)">
            <template v-for="(segment, segmentIndex) in getSegments(option)" :key="segmentIndex">
              <mark v-if="segment.match" class="m-select-list-mark">{{ segment.text }}</mark>
              <template v-else>{{ segment.text }}</template>
            </template>
          </span>
          <span v-else>
            {{ option[labelKey] }}
          </span>
        </slot>
        <MazCheck v-if="!multiple && isSelected(option)" class="m-select-list-item__check" aria-hidden="true" />
      </button>
    </template>
  </div>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-select-list-item {
  position: relative;

  @apply maz:flex maz:w-full maz:cursor-interactive maz:items-center maz:gap-3 maz:truncate maz:rounded-md maz:bg-transparent maz:px-3 maz:py-[var(--maz-menu-item-padding-y,0.5rem)] maz:text-start maz:outline-hidden maz:border maz:border-solid maz:border-transparent;

  span {
    @apply maz:truncate;
  }

  &.--is-none-value {
    @apply maz:text-muted;
  }

  &.--is-selected {
    @apply maz:font-semibold maz:text-foreground;

    background-color: color-mix(in srgb, var(--maz-foreground) 6%, transparent);

    &.--is-highlighted {
      background-color: transparent;
    }
  }
}

.m-select-list-item__check {
  @apply maz:ms-auto maz:size-4 maz:shrink-0;

  color: var(--maz-foreground);
}

.m-select-list__no-results {
  @apply maz:flex maz:items-center maz:gap-2 maz:p-4 maz:text-muted maz:flex-center;
}

.m-select-list__highlight {
  @apply maz:pointer-events-none maz:absolute maz:top-0 maz:rounded-md maz:bg-surface-600 maz:dark:bg-surface-400;

  /* stylelint-disable-next-line liberty/use-logical-spec -- the translation is the physical offsetLeft of the option */
  left: 0;
  transition-duration: calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1));
  transition-timing-function: var(--maz-easing-out, ease-out);
  will-change: transform;
}

.m-select-list-mark {
  @apply maz:bg-transparent maz:font-semibold maz:text-inherit;

  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

@keyframes m-select-item-in {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
}

.m-select-list__scroll-wrapper.--entering .m-select-list-item {
  animation: m-select-item-in calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out) backwards;
  animation-delay: calc(var(--maz-motion-scale, 1) * 15ms * var(--m-select-item-order, 0));

  &:nth-child(3) {
    --m-select-item-order: 1;
  }

  &:nth-child(4) {
    --m-select-item-order: 2;
  }

  &:nth-child(5) {
    --m-select-item-order: 3;
  }

  &:nth-child(6) {
    --m-select-item-order: 4;
  }

  &:nth-child(7) {
    --m-select-item-order: 5;
  }

  &:nth-child(n + 8) {
    --m-select-item-order: 6;
  }
}

.m-select-list__scroll-wrapper {
  @apply maz:relative maz:flex maz:flex-1 maz:flex-col maz:gap-[var(--maz-menu-gap,0.25rem)] maz:overflow-auto maz:scrollbar-themed maz:p-[var(--maz-menu-padding,0.5rem)];

  /* Custom scrollbar for webkit browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    inline-size: 0.1875rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply maz:bg-surface-600 maz:dark:bg-surface-400;

    border-radius: 1000px;
  }

  /* Modern CSS for all browsers (fallback) */
  @apply maz:scrollbar-thin maz:scrollbar-track-transparent maz:scrollbar-thumb-surface-600;
}

.m-select-list-optgroup {
  @apply maz:flex-none maz:p-0.5 maz:text-start maz:text-[0.875em] maz:text-muted;
}
</style>
