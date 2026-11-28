<script lang="ts" setup generic="T extends MazSegmentedValue, O extends MazSegmentedOption<T> = MazSegmentedOption<T>">
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { VTooltipBindingValue } from '../directives/vTooltip.ts'
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazColor, MazSize } from './types.ts'
import { computed, defineAsyncComponent, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useRovingFocus } from '../composables/useRovingFocus.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { createLazyTooltipDirective } from '../utils/lazyTooltip.ts'
import { resolveMazIconProps } from '../utils/resolveMazIconProps.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import { getColor } from './types.ts'

export type MazSegmentedValue = string | number | boolean

export interface MazSegmentedOption<T = MazSegmentedValue> {
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
  /** Tooltip of the segment: a text, or the options of the `v-tooltip` directive (`{ text, position, color... }`). The tooltip code is only loaded when a segment has one */
  tooltip?: VTooltipBindingValue
  /** Disable this segment */
  disabled?: boolean
  /**
   * Badge or counter displayed after the label
   * Inherit all props of MazBadge component
   */
  badge?: MazBadgeProps & {
    /** Content of the badge. `true` renders a dot without text, `false` hides the badge */
    content: MazSegmentedValue
  }
}

export interface MazSegmentedProps<T = MazSegmentedValue, O extends MazSegmentedOption<T> = MazSegmentedOption<T>> {
  /**
   * @model The value of the selected segment, or with `multiple` the array of the selected values
   * @type {T | T[]}
   */
  modelValue?: T | T[]
  /** The segments. Extra fields of an option are passed to the `item` slot */
  options: O[]
  /**
   * Color of the selected segment. Without it, the selected segment is a neutral raised surface
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
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
   * Several segments can be on at once (toggle group): `v-model` is an array of values, the segments are toggle buttons
   * (`aria-pressed`) in a `group`, each selected one has its own pill
   * @default false
   */
  multiple?: boolean
  /**
   * The pill stretches toward the new segment on its way (a drop of ink)
   * @default false
   */
  stretch?: boolean
  /**
   * The pill slides to the selected segment
   * @default true
   */
  animated?: boolean
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
  multiple = false,
  stretch = false,
  animated = true,
  disabled = false,
  ariaLabel,
  ariaLabelledby,
  id,
} = defineProps<MazSegmentedProps<T, O>>()

const emits = defineEmits<{
  /**
   * Emitted when the selected segment changes
   * @property {T} value the value of the selected segment
   */
  'update:model-value': [value: T | T[]]
  /**
   * Emitted when the selected segment changes
   * @property {T} value the value of the selected segment, or the array of the selected values with `multiple`
   */
  'change': [value: T | T[]]
}>()

defineSlots<{
  /** Content of a segment */
  'item'?: (props: {
    /** The option of the segment */
    option: O
    /** `true` if the segment is selected */
    selected: boolean
    /** Index of the segment */
    index: number
  }) => unknown
  /** Content of the badge of a segment */
  'badge-content'?: (props: {
    /** Content of the badge provided in the option */
    content: string | number | boolean
    /** The option of the segment */
    option: O
  }) => unknown
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))

const vTooltip = createLazyTooltipDirective()

/** A badge with `content: true` is a dot: no text, so no padding nor line box */
const DOT_BADGE_STYLE = {
  padding: 0,
  width: '0.5em',
  height: '0.5em',
  borderRadius: '9999px',
} as const

const model = defineModel<T | T[]>()

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

const selectedValues = computed<T[]>(() => {
  if (Array.isArray(model.value))
    return model.value

  return model.value === undefined
    ? []
    : [model.value]
})

const selectedIndex = computed(() => multiple
  ? -1
  : options.findIndex(option => option.value === selectedValues.value[0]))

function isSelected(index: number) {
  return multiple
    ? selectedValues.value.includes(options[index]?.value as T)
    : index === selectedIndex.value
}

function isDisabled(index: number) {
  return disabled || !!options[index]?.disabled
}

function select(index: number) {
  const option = options[index]
  if (!option || isDisabled(index))
    return

  if (multiple) {
    const values = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter(value => value !== option.value)
      : [...selectedValues.value, option.value]
    const ordered = options.filter(({ value }) => values.includes(value)).map(({ value }) => value)

    model.value = ordered
    emits('change', ordered)
    return
  }

  if (option.value === model.value)
    return

  model.value = option.value
  emits('change', option.value)
}

const focusedIndex = ref(0)

/** Roving tabindex: only the selected segment (or the focused one with `multiple`, or the first enabled one) is in the tab sequence */
function getTabIndex(index: number) {
  const current = multiple
    ? focusedIndex.value
    : selectedIndex.value
  const focusable = current >= 0 && !isDisabled(current)
    ? current
    : options.findIndex((_, i) => !isDisabled(i))
  return index === focusable
    ? 0
    : -1
}

function onClick(index: number) {
  focusedIndex.value = index
  select(index)
}

const { onKeydown, currentIndex } = useRovingFocus({
  container: rootRef,
  items: () => segmentRefs.slice(0, options.length),
  orientation: 'both',
  activateOnFocus: !multiple,
  onActivate: index => select(index),
  currentIndex: focusedIndex,
})

watch(selectedIndex, (index) => {
  if (index >= 0)
    currentIndex.value = index
}, { immediate: true })

/** The pill slides under the selected segment; no transition on the first placement */
const activeSegment = shallowRef<HTMLButtonElement>()

function syncActive() {
  activeSegment.value = multiple
    ? undefined
    : segmentRefs[selectedIndex.value]
}

const { style: indicatorStyle } = useSlidingIndicator({
  container: rootRef,
  active: activeSegment,
  stretch,
  animated,
})

onMounted(async () => {
  await nextTick()
  syncActive()
})

watch(() => [selectedIndex.value, options.length], async () => {
  await nextTick()
  segmentRefs.length = options.length
  syncActive()
})

const SIZE_CLASS = {
  mini: 'maz:h-5 maz:px-2 maz:text-xs',
  xs: 'maz:h-7 maz:px-2.5 maz:text-sm',
  sm: 'maz:h-9 maz:px-3',
  md: 'maz:h-11 maz:px-4',
  lg: 'maz:h-13 maz:px-5',
  xl: 'maz:h-15 maz:px-7 maz:text-xl',
} as const satisfies Record<MazSize, string>

/**
 * The classes keep the heights of the default density, the style gives the ones of the active density:
 * the height of the control without the padding of the track, and the horizontal padding scaled
 */
const SEGMENT_PADDING_X = { mini: 2, xs: 2.5, sm: 3, md: 4, lg: 5, xl: 7 } as const satisfies Record<MazSize, number>

const segmentStyle = computed(() => ({
  height: `calc(var(--maz-control-height-${size.value}, 3rem) - var(--maz-space, 0.25rem))`,
  paddingInline: `calc(var(--maz-space, 0.25rem) * ${SEGMENT_PADDING_X[size.value]} * var(--maz-density-ratio, 1))`,
}))

/** Same icon sizes as `MazBtn`, so the icons of a segmented control and of buttons line up */
const ICON_SIZE = {
  mini: '1em',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<MazSize, NonNullable<import('./MazIcon.vue').MazIconProps['size']>>

/** The badge stays smaller than the label */
const BADGE_SIZE = {
  mini: 'mini',
  xs: 'mini',
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
  xl: 'md',
} as const satisfies Record<MazSize, MazSize>

const ROUNDED_CLASS = { ...ROUNDED_SIZE_CLASS, sm: 'maz:rounded-sm' }

function setSegmentRef(el: HTMLButtonElement | null, index: number) {
  if (el)
    segmentRefs[index] = el
}

function badgeProps(badge: NonNullable<MazSegmentedOption['badge']>) {
  const props: Record<string, unknown> = { ...badge }
  delete props.content

  return props
}

function iconProps(icon: MazIconLike) {
  return resolveMazIconProps(icon, { size: ICON_SIZE[size.value] })
}
</script>

<template>
  <div
    :id="instanceId"
    ref="rootRef"
    class="m-segmented m-reset-css maz:relative maz:isolate maz:max-w-full maz:items-center maz:bg-foreground/6 maz:p-0.5 maz:dark:bg-[oklch(from_var(--maz-surface)_calc(l*0.8)_c_h)]"
    :class="[
      block ? 'maz:flex maz:w-full' : 'maz:inline-flex',
      ROUNDED_CLASS[roundedSize],
      { '--disabled maz:disabled-opacity': disabled },
    ]"
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-disabled="disabled || undefined"
  >
    <div
      v-if="!multiple"
      aria-hidden="true"
      class="m-segmented__indicator maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0.5 maz:-z-1 maz:shadow-sm"
      :class="[
        ROUNDED_CLASS[roundedSize],
        resolvedColor ? '' : 'maz:bg-container maz:dark:bg-foreground/28',
        resolvedColor === 'neutral' ? 'maz:border maz:border-divider' : '',
      ]"
      :style="[indicatorStyle, resolvedColor ? { backgroundColor: `var(--maz-${resolvedColor})` } : {}]"
    />

    <button
      v-for="(option, index) in options"
      :key="String(option.value)"
      :ref="(el) => setSegmentRef(el as HTMLButtonElement | null, index)"
      v-tooltip="option.tooltip"
      type="button"
      :role="multiple ? undefined : 'radio'"
      class="m-segmented__segment maz:inline-flex maz:min-w-0 maz:flex-center maz:gap-1.5 maz:border-none maz:bg-transparent maz:type-label maz:whitespace-nowrap maz:focus-ring"
      :class="[
        SIZE_CLASS[size],
        ROUNDED_CLASS[roundedSize],
        block && 'maz:flex-1',
        isDisabled(index) ? 'maz:disabled-cursor' : 'maz:cursor-interactive',
        isSelected(index) ? '--selected' : 'maz:text-muted maz:hover:text-foreground',
        multiple && isSelected(index) && !resolvedColor ? 'maz:bg-container maz:shadow-sm maz:dark:bg-foreground/28' : '',
        resolvedColor === 'neutral' && multiple && isSelected(index) ? 'maz:border maz:border-divider' : '',
        { '--disabled maz:disabled-opacity': option.disabled && !disabled },
      ]"
      :style="[segmentStyle, isSelected(index) ? { color: resolvedColor ? `var(--maz-${resolvedColor}-foreground)` : 'var(--maz-foreground)', ...(multiple && resolvedColor ? { backgroundColor: `var(--maz-${resolvedColor})` } : {}) } : undefined]"
      :aria-checked="multiple ? undefined : isSelected(index)"
      :aria-pressed="multiple ? isSelected(index) : undefined"
      :aria-label="option.ariaLabel"
      :title="option.title"
      :disabled="isDisabled(index)"
      :tabindex="getTabIndex(index)"
      @click="onClick(index)"
      @keydown="onKeydown($event, index)"
    >
      <!--
        @slot item - Content of a segment
          @binding {MazSegmentedOption} option - the option, with its extra fields
          @binding {boolean} selected - `true` if the segment is selected
          @binding {number} index - index of the segment
      -->
      <slot name="item" :option="option" :selected="isSelected(index)" :index="index">
        <MazIcon v-if="option.icon" v-bind="iconProps(option.icon)" />
        <span v-if="option.label" class="maz:truncate">{{ option.label }}</span>
        <MazBadge
          v-if="option.badge && option.badge.content !== false"
          v-bind="badgeProps(option.badge)"
          :size="option.badge.size ?? BADGE_SIZE[size]"
          class="m-segmented__badge"
          :class="{ '--dot': option.badge.content === true }"
          :style="option.badge.content === true ? DOT_BADGE_STYLE : undefined"
        >
          <!--
            @slot badge-content - Content of the badge of a segment
              @binding {string | number | boolean} content - content of the badge provided in the option
              @binding {MazSegmentedOption} option - the option of the segment
          -->
          <slot name="badge-content" :content="option.badge.content" :option="option">
            <template v-if="typeof option.badge.content !== 'boolean'">
              {{ option.badge.content }}
            </template>
          </slot>
        </MazBadge>
      </slot>
    </button>
  </div>
</template>

<style scoped>
.m-segmented__segment {
  transition:
    color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}
</style>
