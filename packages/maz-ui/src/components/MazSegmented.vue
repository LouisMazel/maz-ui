<script lang="ts" setup generic="T extends string | number | boolean">
import type { CSSProperties } from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazColor, MazSize } from './types'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { resolveMazIconProps } from '../utils/resolveMazIconProps'
import { getColor } from './types'

export interface MazSegmentedOption<T = string | number | boolean> {
  /** Text of the segment */
  label?: string
  /** Value of the segment */
  value: T
  /** Icon of the segment (before the label, or alone) */
  icon?: MazIconLike
  /** Accessible name of the segment, required when it only has an icon */
  ariaLabel?: string
  /** Tooltip of the segment (native `title`), useful when it only has an icon */
  title?: string
  /** Disable this segment */
  disabled?: boolean
}

export interface MazSegmentedProps<T = string | number | boolean> {
  /** @model The value of the selected segment */
  modelValue?: T
  /** The segments */
  options: MazSegmentedOption<T>[]
  /**
   * Color of the selected segment. Without it, the selected segment is a neutral raised surface
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   */
  color?: MazColor
  /**
   * Size of the control: same height as the `MazBtn` of the same size
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Size of the rounded of the control and of its segments
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'md'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Take the full width, the segments share it equally
   * @default false
   */
  block?: boolean
  /**
   * Disable the whole control
   * @default false
   */
  disabled?: boolean
  /** Accessible name of the control */
  ariaLabel?: string
  /** Id of the element that names the control */
  ariaLabelledby?: string
  /** Id of the control (auto-generated if not provided) */
  id?: string
}

const {
  options,
  color,
  block = false,
  disabled = false,
  ariaLabel,
  ariaLabelledby,
  id,
} = defineProps<MazSegmentedProps<T>>()

const emits = defineEmits<{
  /**
   * Emitted when the selected segment changes
   * @property {T} value the value of the selected segment
   */
  'update:model-value': [value: T]
  /**
   * Emitted when the selected segment changes
   * @property {T} value the value of the selected segment
   */
  'change': [value: T]
}>()

defineSlots<{
  /** Content of a segment */
  item: (props: {
    /** The option of the segment */
    option: MazSegmentedOption<T>
    /** `true` if the segment is selected */
    selected: boolean
  }) => unknown
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const model = defineModel<T>()

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: NonNullable<MazSegmentedProps['roundedSize']> }>('MazSegmented', {
  size: 'md',
  roundedSize: 'md',
})

const instanceId = useInstanceUniqId({ componentName: 'MazSegmented', providedId: id })

const resolvedColor = computed(() => color
  ? getColor(color)
  : undefined)

const rootRef = ref<HTMLDivElement>()
/** Not reactive: only read to measure and focus the segments */
const segmentRefs: HTMLButtonElement[] = []

const selectedIndex = computed(() => options.findIndex(option => option.value === model.value))

function isDisabled(index: number) {
  return disabled || !!options[index]?.disabled
}

function select(index: number) {
  const option = options[index]
  if (!option || isDisabled(index) || option.value === model.value)
    return
  model.value = option.value
  emits('change', option.value)
}

/** Roving tabindex: only the selected segment (or the first enabled one) is in the tab sequence */
function getTabIndex(index: number) {
  const focusable = selectedIndex.value >= 0 && !isDisabled(selectedIndex.value)
    ? selectedIndex.value
    : options.findIndex((_, i) => !isDisabled(i))
  return index === focusable
    ? 0
    : -1
}

function getNextEnabledIndex(fromIndex: number, step: 1 | -1) {
  const count = options.length
  for (let offset = 1; offset <= count; offset++) {
    const index = (fromIndex + step * offset + count) % count
    if (!isDisabled(index))
      return index
  }
  return fromIndex
}

function onKeydown(event: KeyboardEvent, index: number) {
  const isRtl = !!rootRef.value && globalThis.getComputedStyle(rootRef.value).direction === 'rtl'
  const forwardKeys = isRtl
    ? ['ArrowLeft', 'ArrowDown']
    : ['ArrowRight', 'ArrowDown']
  const backwardKeys = isRtl
    ? ['ArrowRight', 'ArrowUp']
    : ['ArrowLeft', 'ArrowUp']

  let target: number | undefined
  if (forwardKeys.includes(event.key))
    target = getNextEnabledIndex(index, 1)
  else if (backwardKeys.includes(event.key))
    target = getNextEnabledIndex(index, -1)
  else if (event.key === 'Home')
    target = getNextEnabledIndex(-1, 1)
  else if (event.key === 'End')
    target = getNextEnabledIndex(options.length, -1)

  if (target === undefined || isDisabled(target))
    return

  event.preventDefault()
  segmentRefs[target]?.focus()
  select(target)
}

/** The indicator slides under the selected segment; no transition on the first placement */
const indicatorStyle = ref<CSSProperties>({ opacity: 0 })
const animated = ref(false)

function placeIndicator() {
  const segment = segmentRefs[selectedIndex.value]
  if (!segment) {
    indicatorStyle.value = { opacity: 0 }
    return
  }
  indicatorStyle.value = {
    width: `${segment.offsetWidth}px`,
    height: `${segment.offsetHeight}px`,
    transform: `translateX(${segment.offsetLeft}px)`,
  }
}

let resizeObserver: ResizeObserver | undefined

onMounted(async () => {
  await nextTick()
  placeIndicator()
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(() => placeIndicator())
    resizeObserver.observe(rootRef.value)
  }
  requestAnimationFrame(() => {
    animated.value = true
  })
})

onBeforeUnmount(() => resizeObserver?.disconnect())

watch(() => [selectedIndex.value, options.length], async () => {
  await nextTick()
  segmentRefs.length = options.length
  placeIndicator()
})

const SIZE_CLASS = {
  mini: 'maz:h-5 maz:px-2 maz:text-xs',
  xs: 'maz:h-7 maz:px-2.5 maz:text-sm',
  sm: 'maz:h-9 maz:px-3',
  md: 'maz:h-11 maz:px-4',
  lg: 'maz:h-13 maz:px-5',
  xl: 'maz:h-15 maz:px-7 maz:text-xl',
} as const satisfies Record<MazSize, string>

/** Same icon sizes as `MazBtn`, so the icons of a segmented control and of buttons line up */
const ICON_SIZE = {
  mini: '1em',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<MazSize, NonNullable<import('./MazIcon.vue').MazIconProps['size']>>

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-sm',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

function setSegmentRef(el: HTMLButtonElement | null, index: number) {
  if (el)
    segmentRefs[index] = el
}

function iconProps(icon: MazIconLike) {
  return resolveMazIconProps(icon, { size: ICON_SIZE[size.value] })
}
</script>

<template>
  <div
    :id="instanceId"
    ref="rootRef"
    class="m-segmented m-reset-css maz:relative maz:isolate maz:max-w-full maz:items-center maz:bg-foreground/6 maz:p-0.5"
    :class="[
      block ? 'maz:flex maz:w-full' : 'maz:inline-flex',
      ROUNDED_CLASS[roundedSize],
      { '--disabled maz:disabled-opacity': disabled },
    ]"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-disabled="disabled || undefined"
  >
    <div
      aria-hidden="true"
      class="m-segmented__indicator maz:pointer-events-none maz:absolute maz:top-0.5 maz:left-0 maz:-z-1 maz:shadow-sm"
      :class="[
        ROUNDED_CLASS[roundedSize],
        resolvedColor ? '' : 'maz:bg-container maz:dark:bg-foreground/18',
        { 'maz:transition-[transform,width] maz:duration-200 maz:ease-out maz:motion-reduce:transition-none': animated },
      ]"
      :style="[indicatorStyle, resolvedColor ? { backgroundColor: `var(--maz-${resolvedColor})` } : {}]"
    />

    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      :ref="(el) => setSegmentRef(el as HTMLButtonElement | null, index)"
      type="button"
      role="radio"
      class="m-segmented__segment maz:inline-flex maz:min-w-0 maz:flex-center maz:gap-1.5 maz:border-none maz:bg-transparent maz:type-label maz:whitespace-nowrap maz:transition-colors maz:duration-150 maz:outline-none maz:focus-visible:ring-2 maz:focus-visible:ring-primary/50"
      :class="[
        SIZE_CLASS[size],
        ROUNDED_CLASS[roundedSize],
        block && 'maz:flex-1',
        isDisabled(index) ? 'maz:disabled-cursor' : 'maz:cursor-interactive',
        index === selectedIndex ? '--selected' : 'maz:text-muted maz:hover:text-foreground',
        { '--disabled maz:disabled-opacity': option.disabled && !disabled },
      ]"
      :style="index === selectedIndex ? { color: resolvedColor ? `var(--maz-${resolvedColor}-foreground)` : 'var(--maz-foreground)' } : undefined"
      :aria-checked="index === selectedIndex"
      :aria-label="option.ariaLabel"
      :title="option.title"
      :disabled="isDisabled(index)"
      :tabindex="getTabIndex(index)"
      @click="select(index)"
      @keydown="onKeydown($event, index)"
    >
      <!-- @slot item - Content of a segment -->
      <slot name="item" :option="option" :selected="index === selectedIndex">
        <MazIcon v-if="option.icon" v-bind="iconProps(option.icon)" />
        <span v-if="option.label" class="maz:truncate">{{ option.label }}</span>
      </slot>
    </button>
  </div>
</template>
