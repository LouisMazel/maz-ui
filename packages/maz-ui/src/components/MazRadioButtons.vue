<script lang="ts" setup generic="T extends string | number | boolean, Option extends MazRadioButtonsOption<T>">
import type { CSSProperties, HTMLAttributes } from 'vue'
import type { MazColor, MazNeutralColor, MazSize } from './types.ts'
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'
import { getColor } from './types.ts'

export type MazRadioButtonsOption<T = string | number | boolean> = {
  /** The label of the option */
  label: string
  /** The value of the option */
  value: T
  /** The classes to apply to the option */
  classes?: any
  /** The style to apply to the option */
  style?: HTMLAttributes['style']
  /** Second line of the card (variant `cards`) */
  description?: string
  /** Price or extra text at the end of the card (variant `cards`) */
  price?: string
} & Record<string, unknown>

export interface MazRadioButtonsProps<T = string | number | boolean, Option extends MazRadioButtonsOption<T> = MazRadioButtonsOption<T>> {
  /** @model The value of the selected option */
  modelValue?: T
  /** The options to display */
  options: Option[]
  /**
   * The name of the radio group
   * @default a unique name per instance
   */
  name?: string
  /** The color of the selected radio buttons: with a neutral color (`surface`, `container`), the selected one gets a foreground border */
  color?: MazColor | MazNeutralColor
  /** Add elevation to the radio buttons */
  elevation?: boolean
  /**
   * The orientation of the radio buttons
   * @values 'row' | 'col'
   * @default 'row'
   */
  orientation?: 'row' | 'col'
  /** Disable the wrap of the radio buttons */
  wrap?: boolean
  /** Make all radio buttons the same size */
  equalSize?: boolean
  /** Display a selector icon */
  selector?: boolean
  /** The component will be displayed in full width */
  block?: boolean
  /** Whether there is an error with the input. */
  error?: boolean
  /** Whether the input is successful. */
  success?: boolean
  /** Whether there is a warning with the input. */
  warning?: boolean
  /** The hint text to display below the input. */
  hint?: string
  /**
   * The size of the radio buttons
   * @default 'md'
   */
  size?: MazSize
  /**
   * Look of the options: `default` are buttons, `cards` are choice cards (`label`, `description` and `price` of the option)
   * whose border draws itself when they are selected
   * @values `'default' | 'cards'`
   * @default 'default'
   */
  variant?: 'default' | 'cards'
  /**
   * A frame slides to the selected option (and stretches on the way)
   * @default true
   */
  animated?: boolean
}

const {
  modelValue,
  options,
  name,
  color = 'primary',
  elevation = false,
  orientation = 'row',
  wrap = true,
  equalSize = false,
  selector = false,
  block = false,
  error,
  success,
  warning,
  hint,
  variant = 'default',
  animated = true,
} = defineProps<MazRadioButtonsProps<T, Option>>()

const emits = defineEmits<{
  /**
   * Emitted when the selected option change
   * @property value The value of the selected option
   */
  'update:model-value': [value: Option['value']]
  /**
   * Emitted when the selected option change
   * @property value The value of the selected option
   */
  'change': [value: Option['value']]
  /**
   * Emitted when the a radio button lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the a radio button is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

const { size } = useGlobalConfig<{ size: MazSize }>('MazRadioButtons', { size: 'md' })

const instanceId = useInstanceUniqId({ componentName: 'MazRadioButtons' })

const NEUTRAL_BG: Partial<Record<NonNullable<MazRadioButtonsProps<T, Option>['color']>, string>> = {
  surface: 'var(--maz-surface)',
  container: 'var(--maz-container-bg, var(--maz-surface))',
}

const selectedStyle = computed<{ item: CSSProperties, selector: CSSProperties }>(() => {
  const neutralBg = NEUTRAL_BG[color]

  if (neutralBg) {
    return {
      item: { color: 'var(--maz-foreground)', backgroundColor: neutralBg, borderColor: 'var(--maz-foreground)' },
      selector: { backgroundColor: 'var(--maz-foreground)', color: neutralBg },
    }
  }

  if (color === 'neutral') {
    return {
      item: { color: 'var(--maz-neutral-foreground)', backgroundColor: 'var(--maz-neutral)', borderColor: 'var(--maz-divider)' },
      selector: { backgroundColor: 'var(--maz-neutral-foreground)', color: 'var(--maz-neutral)' },
    }
  }

  const c = getColor(color)

  return {
    item: { color: `var(--maz-${c}-foreground)`, backgroundColor: `var(--maz-${c})`, borderColor: `var(--maz-${c})` },
    selector: { backgroundColor: `oklch(from var(--maz-${c}) clamp(0, calc(l - 0.05), 1) c h)`, color: `var(--maz-${c}-foreground)` },
  }
})

// A shared default name would merge the native radios of every instance of the page in one group
const groupName = computed(() => name ?? instanceId.value)
const hintId = computed(() => `${instanceId.value}-hint`)

function selectOption(option: Option) {
  emits('update:model-value', option.value)
  emits('change', option.value)
}

function isSelected(value: Option['value']) {
  return modelValue === value
}

const isCards = computed(() => variant === 'cards')
const hasSelector = computed(() => selector || isCards.value)

const cardColor = computed(() => {
  if (color === 'neutral' || color === 'surface' || color === 'container')
    return 'var(--maz-foreground)'

  return `var(--maz-${getColor(color)})`
})

const cardSelectedStyle = computed<CSSProperties>(() => ({
  backgroundColor: `color-mix(in srgb, ${cardColor.value} 8%, var(--maz-surface))`,
}))

const wrapperRef = ref<HTMLElement>()
/** Not reactive: only read to find the selected option */
const optionRefs: HTMLElement[] = []
const activeOption = shallowRef<HTMLElement>()
const rowOffset = ref(0)

const selectedIndex = computed(() => options.findIndex(option => option.value === modelValue))

function syncActive() {
  activeOption.value = optionRefs[selectedIndex.value]
  rowOffset.value = orientation === 'row'
    ? activeOption.value?.offsetTop ?? 0
    : 0
}

function setOptionRef(el: unknown, index: number) {
  if (el)
    optionRefs[index] = el as HTMLElement
}

const { style: indicatorStyle } = useSlidingIndicator({
  container: wrapperRef,
  active: activeOption,
  orientation: orientation === 'col'
    ? 'vertical'
    : 'horizontal',
  stretch: true,
  animated,
})

useResizeObserver(wrapperRef, syncActive)

onMounted(async () => {
  await nextTick()
  syncActive()
})

watch(() => [selectedIndex.value, options.length], async () => {
  await nextTick()
  optionRefs.length = options.length
  syncActive()
})

function getOptionId(option: Option, i: number) {
  return `option-${i}-${option.value.toString()}-${groupName.value}`
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  emits('focus', event)
}

const SIZE_CLASS: Record<MazSize, string> = {
  mini: 'maz:px-1 maz:min-h-6 maz:text-xs',
  xs: 'maz:px-2 maz:min-h-8 maz:text-xs',
  sm: 'maz:px-3 maz:min-h-10 maz:text-sm',
  md: 'maz:px-4 maz:min-h-12',
  lg: 'maz:px-5 maz:min-h-14 maz:text-lg',
  xl: 'maz:px-6 maz:min-h-16 maz:text-xl',
}
</script>

<template>
  <div
    class="m-radio-buttons m-reset-css maz:inline-flex maz:flex-col maz:gap-1 maz:align-top"
    :class="{ 'maz:w-full': block }"
    role="radiogroup"
    :aria-describedby="hint ? hintId : undefined"
    :aria-invalid="error ? 'true' : undefined"
  >
    <div
      ref="wrapperRef"
      class="m-radio-buttons__wrapper maz:relative maz:inline-flex maz:gap-2"
      :class="[
        `--${orientation}`,
        orientation === 'row' ? 'maz:flex-row' : 'maz:flex-col',
        { '--wrap': wrap, 'maz:flex-wrap': wrap, '--block': block },
      ]"
    >
      <span
        v-if="animated && !isCards"
        aria-hidden="true"
        class="m-radio-buttons__indicator maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0 maz:z-1 maz:rounded-md"
        :style="[indicatorStyle, orientation === 'row' ? { top: `${rowOffset}px` } : {}, { border: `var(--maz-border-width, 1px) solid ${selectedStyle.item.borderColor}` }]"
      />
      <label
        v-for="(option, i) in options"
        :key="getOptionId(option, i)"
        :ref="(el) => setOptionRef(el, i)"
        :for="getOptionId(option, i)"
        class="m-radio-buttons__items maz:group maz:flex maz:cursor-interactive maz:gap-4 maz:border maz:border-divider maz:bg-surface maz:type-label"
        :class="[
          `--size-${size}`,
          isCards
            ? 'm-radio-buttons__items--card maz:border-draw maz:items-start maz:rounded-lg maz:p-4'
            : [SIZE_CLASS[size], 'maz:items-center maz:rounded-md maz:px-4 maz:py-2'],
          {
            '--is-selected': isSelected(option.value),
            'maz:shadow-elevation maz:drop-shadow-md': elevation,
            '--equal-size': equalSize,
          },
          option.classes,
        ]"
        :style="[
          isCards
            ? { '--maz-border-draw-color': cardColor, ...(isSelected(option.value) ? cardSelectedStyle : {}) }
            : (isSelected(option.value) ? selectedStyle.item : {}),
          option.style,
        ]"
      >
        <input
          :id="getOptionId(option, i)"
          type="radio"
          :name="groupName"
          :value="option.value"
          :checked="isSelected(option.value)"
          class="maz:sr-only maz:outline-hidden"
          @change="selectOption(option)"
          @blur="onBlur($event)"
          @focus="onFocus($event)"
        >
        <div v-if="hasSelector" class="m-radio-buttons__items__checkbox maz:flex maz:flex-center" :class="{ 'maz:mt-0.5': isCards }">
          <span
            class="maz:flex maz:size-6 maz:flex-none maz:flex-center maz:rounded-full maz:border maz:border-divider maz:bg-input maz:p-0.5 maz:text-white"
            :class="{
              '--is-selected': isSelected(option.value),
            }"
            :style="[
              isSelected(option.value) ? selectedStyle.selector : {},
            ]"
          >
            <MazDrawnIcon name="check" :drawn="isSelected(option.value)" :stroke-width="3" class="maz:size-full" />
          </span>
        </div>

        <!--
          @slot Label of the radio
            @binding {Boolean} selected - If the option is selected
            @binding {string | number | boolean} option - The value of the option
        -->
        <slot :option="option" :selected="isSelected(option.value)">
          <span v-if="isCards" class="m-radio-buttons__text maz:flex maz:min-w-0 maz:flex-1 maz:flex-col maz:gap-0.5">
            <span class="m-radio-buttons__label">{{ option.label }}</span>
            <span v-if="option.description" class="m-radio-buttons__description maz:text-body-sm maz:font-normal maz:text-muted">{{ option.description }}</span>
            <!--
              @slot Extra content of a card (variant `cards`), under the description
                @binding {Boolean} selected - If the option is selected
                @binding {string | number | boolean} option - The value of the option
            -->
            <slot name="extra" :option="option" :selected="isSelected(option.value)" />
          </span>
          <span v-if="isCards && option.price" class="m-radio-buttons__price maz:flex-none">{{ option.price }}</span>
          <span v-else-if="equalSize" class="m-radio-buttons__label maz:min-w-0 maz:truncate">{{ option.label }}</span>
          <template v-else-if="!isCards">
            {{ option.label }}
          </template>
        </slot>
      </label>
    </div>
    <span
      v-if="hint"
      :id="hintId"
      class="m-radio-buttons__hint maz:text-body-sm" :class="{
        '--error': error,
        '--success': success,
        '--warning': warning,
        'maz:text-destructive-600': error,
        'maz:text-success-600': success,
        'maz:text-warning-600': warning,
        'maz:text-muted': !error && !success && !warning,
      }"
    >{{ hint }}</span>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-radio-buttons__items {
  transition:
    background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    border-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

  &.--equal-size {
    @apply maz:min-w-0 maz:flex-1;
  }

  &:not(.--is-selected) {
    @apply maz:hover:bg-surface-600 maz:dark:hover:bg-surface-400;
  }

  &:has(input:focus-visible) {
    outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
    outline-offset: var(--maz-focus-ring-offset, 2px);
  }
}

.m-radio-buttons__items--card:not(:has(input:checked))::after {
  --maz-border-draw-progress: 0;
}

.m-radio-buttons__items__checkbox {
  span {
    transition:
      border-color 0s,
      background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

    &.--is-selected {
      @apply maz:border-transparent;
    }

    &:not(.--is-selected) {
      @apply maz:group-hover:bg-surface;
    }
  }
}
</style>
