<script lang="ts" setup generic="Option extends Record<string, unknown>">
import type { MazColor } from '../types'
import { MazNoSymbol } from '@maz-ui/icons/lazy/MazNoSymbol'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { defineAsyncComponent, useTemplateRef } from 'vue'

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

const wrapperRef = useTemplateRef('wrapper')

function getOptionElement(index: number) {
  const id = getOptionId(index)

  return [
    ...wrapperRef.value?.querySelectorAll<HTMLElement>('.m-select-list-item') ?? [],
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
      <MazNoSymbol class="maz:size-6 maz:text-foreground" aria-hidden="true" />
      <span class="maz:sr-only">{{ t('aria.noResults') }}</span>
    </span>
  </slot>

  <div
    v-else
    :id
    ref="wrapper"
    class="m-select-list__scroll-wrapper"
    tabindex="-1"
    role="listbox"
    :aria-label="label"
    :aria-multiselectable="multiple ? 'true' : undefined"
  >
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
          <span>
            {{ option[labelKey] }}
          </span>
        </slot>
      </button>
    </template>
  </div>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-select-list-item {
  @apply maz:flex maz:w-full maz:cursor-interactive maz:items-center maz:gap-3 maz:truncate maz:rounded-md maz:bg-transparent maz:px-3 maz:py-2 maz:text-start maz:transition-colors maz:duration-300 maz:ease-in-out maz:focus-within:bg-surface-600 maz:dark:focus-within:bg-surface-400 maz:hover:bg-surface-600 maz:dark:hover:bg-surface-400 maz:outline-hidden maz:border maz:border-solid maz:border-transparent;

  span {
    @apply maz:truncate;
  }

  &.--is-active {
    @apply maz:bg-surface-600 maz:dark:bg-surface-400;
  }

  &.--is-none-value {
    @apply maz:text-muted;
  }

  &.--is-selected {
    color: var(--selected-text-color);
    background-color: var(--selected-bg-color);

    &:focus-within,
    &.--is-active {
      outline: var(--selected-text-color) solid var(--maz-border-width);
      outline-offset: 2px;
    }

    &.--transparent {
      @apply maz:bg-surface;
    }
  }
}

.m-select-list__no-results {
  @apply maz:flex maz:p-4 maz:flex-center;
}

.m-select-list__scroll-wrapper {
  @apply maz:flex maz:flex-1 maz:flex-col maz:gap-1 maz:overflow-auto maz:scrollbar-themed maz:p-2;

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
