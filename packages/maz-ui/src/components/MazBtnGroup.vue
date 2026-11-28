<script lang="ts" setup>
import type { ButtonHTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazColor, MazFillVariant, MazNeutralColor, MazSize } from './types.ts'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useRovingFocus } from '../composables/useRovingFocus.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'

type MazButtonGroupOptionBase = Omit<MazBtnProps, 'block' | 'fab'> & ButtonHTMLAttributes

export interface MazButtonGroupOption extends MazButtonGroupOptionBase {
  /** Click handler for the button */
  onClick?: () => void
  /** The href for anchor links */
  href?: string
  /** The route for router-link or nuxt-link */
  to?: RouteLocationRaw
}

export interface MazButtonGroupProps {
  /**
   * The items for the button group (optional when using slot-based approach)
   * @default undefined
   */
  items?: MazButtonGroupOption[]
  /**
   * The orientation of the button group
   * @values 'row' | 'col'
   * @default 'row'
   */
  orientation?: 'row' | 'col'
  /**
   * The size of all buttons (only applies to props-based buttons)
   * @default 'md'
   */
  size?: MazSize
  /**
   * The color of all buttons (only applies to props-based buttons)
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral, transparent, surface, container
   * @default 'primary'
   */
  color?: MazColor | MazNeutralColor
  /**
   * The rounded size of the buttons
   * @default 'lg'
   */
  roundedSize?: MazBtnProps['roundedSize']
  /**
   * The fill style of all buttons (only applies to props-based buttons, a `variant` of an item wins)
   * @values `'solid' | 'soft' | 'outline' | 'ghost'`
   * @default 'solid'
   */
  variant?: MazFillVariant
  /**
   * The outlined state of the buttons
   * @deprecated Use `variant="outline"` instead
   * @default false
   */
  outlined?: boolean
  /**
   * The pastel state of the buttons
   * @deprecated Use `variant="soft"` instead
   * @default false
   */
  pastel?: boolean
  /**
   * The loading state of the buttons
   * @default false
   */
  loading?: boolean
  /**
   * The disabled state of the buttons
   * @default false
   */
  disabled?: boolean
  /**
   * @model Value of the active button (the `value` of its item, or its index): the button is highlighted and has `aria-pressed`.
   * Without it the group has no state
   */
  modelValue?: string | number
  /**
   * A pill slides to the active button (needs `v-model`)
   * @default false
   */
  indicator?: boolean
  /**
   * The group is a toolbar: one button in the tab sequence, the arrows, `Home` and `End` move the focus between them
   * @default false
   */
  toolbar?: boolean
}

const {
  items,
  orientation = 'row',
  color = 'primary',
  variant,
  modelValue,
  indicator = false,
  toolbar = false,
} = defineProps<MazButtonGroupProps>()

const emits = defineEmits<{
  /**
   * Emitted when a button is clicked and the group has a `v-model`
   * @property {string | number} value The `value` of the item, or its index
   */
  'update:model-value': [value: string | number]
}>()

function getItemValue(item: MazButtonGroupOption, index: number) {
  return (item.value as string | number | undefined) ?? index
}

function isActive(item: MazButtonGroupOption, index: number) {
  return modelValue !== undefined && getItemValue(item, index) === modelValue
}

function getItemProps(item: MazButtonGroupOption, index: number) {
  const props = variant ? { variant, ...item } : { ...item }

  if (modelValue !== undefined) {
    props.active = isActive(item, index)
    props['aria-pressed'] = props.active
  }

  return props
}

function onItemClick(item: MazButtonGroupOption, index: number) {
  if (modelValue !== undefined)
    emits('update:model-value', getItemValue(item, index))
}

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: MazBtnProps['roundedSize'] }>('MazBtnGroup', {
  size: 'md',
  roundedSize: 'md',
})

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const rootRef = ref<HTMLElement>()
const buttons = shallowRef<HTMLElement[]>([])
const activeButton = shallowRef<HTMLElement>()
const focusedIndex = ref(0)

const activeIndex = computed(() => items?.findIndex((item, index) => isActive(item, index)) ?? -1)

function readButtons() {
  buttons.value = rootRef.value
    ? [...rootRef.value.querySelectorAll<HTMLElement>('.m-btn')]
    : []
}

function syncButtons() {
  readButtons()
  activeButton.value = buttons.value[activeIndex.value]

  if (toolbar) {
    const tabbable = buttons.value[focusedIndex.value]?.hasAttribute('disabled')
      ? buttons.value.findIndex(button => !button.hasAttribute('disabled'))
      : focusedIndex.value

    buttons.value.forEach((button, index) => {
      button.tabIndex = index === tabbable
        ? 0
        : -1
    })
  }
}

const { onKeydown, currentIndex } = useRovingFocus({
  items: () => buttons.value,
  orientation: orientation === 'col'
    ? 'vertical'
    : 'horizontal',
  currentIndex: focusedIndex,
})

function onGroupKeydown(event: KeyboardEvent) {
  if (toolbar)
    onKeydown(event)
}

function onFocusin(event: FocusEvent) {
  if (!toolbar)
    return

  const index = buttons.value.findIndex(button => button === event.target || button.contains(event.target as Node))

  if (index !== -1)
    currentIndex.value = index
}

const { style: indicatorStyle } = useSlidingIndicator({
  container: rootRef,
  active: activeButton,
  orientation: orientation === 'col'
    ? 'vertical'
    : 'horizontal',
})

let observer: MutationObserver | undefined

onMounted(() => {
  syncButtons()

  if (rootRef.value && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(syncButtons)
    observer.observe(rootRef.value, { childList: true, subtree: true })
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch([() => modelValue, () => toolbar, focusedIndex], async () => {
  await nextTick()
  syncButtons()
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="rootRef"
    class="m-button-group maz:relative maz:isolate maz:inline-flex"
    :class="[`--${orientation}`, orientation === 'row' ? 'maz:flex-row' : 'maz:flex-col']"
    :role="toolbar ? 'toolbar' : 'group'"
    :aria-orientation="toolbar ? (orientation === 'col' ? 'vertical' : 'horizontal') : undefined"
    @keydown="onGroupKeydown"
    @focusin="onFocusin"
  >
    <!-- Options-based rendering -->
    <MazBtn
      v-for="(item, index) in items"
      :key="index"
      v-bind="getItemProps(item, index)"
      :size="item.size ?? size"
      :rounded-size="item.roundedSize ?? roundedSize"
      :color="item.color ?? color"
      class="m-button-group__button"
      @click="onItemClick(item, index)"
    >
      <!--
        @slot button-[index] - Custom content for a specific button
          @binding {MazButtonGroupOption} item - The button item
          @binding {number} index - The button index
      -->
      <slot :name="`button-${index}`" :item="item" :index="index">
        {{ item.text }}
      </slot>
    </MazBtn>

    <!--
      @slot default - Slot for passing MazBtn components directly
    -->
    <slot />

    <span
      v-if="indicator && modelValue !== undefined"
      aria-hidden="true"
      class="m-button-group__indicator maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0 maz:z-2"
      :class="ROUNDED_SIZE_CLASS[roundedSize ?? 'md']"
      :style="[indicatorStyle, { '--m-group-indicator-color': color === 'neutral' || color === 'surface' || color === 'container' ? 'var(--maz-foreground)' : `var(--maz-${color})` }]"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

/* Attached look: the inner corners are square, the borders are shared and a thin line divides the buttons */
.m-button-group {
  &.--row {
    .m-button-group__button,
    :deep(.m-btn) {
      &:not(:last-child) {
        border-inline-end-width: 0;
        border-start-end-radius: 0;
        border-end-end-radius: 0;
      }

      &:not(:first-child) {
        margin-inline-start: -1px;
        border-start-start-radius: 0;
        border-end-start-radius: 0;
      }

      &:not(:first-child, .--outlined) {
        border-inline-start-color: color-mix(in srgb, currentcolor 22%, transparent);
      }

      &:focus-visible,
      &:active,
      &.--active {
        @apply maz:z-1;
      }
    }
  }

  &.--col {
    .m-button-group__button,
    :deep(.m-btn) {
      &:not(:last-child) {
        border-block-end-width: 0;
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      }

      &:not(:first-child) {
        margin-block-start: -1px;
        border-start-start-radius: 0;
        border-start-end-radius: 0;
      }

      &:not(:first-child, .--outlined) {
        border-block-start-color: color-mix(in srgb, currentcolor 22%, transparent);
      }

      &:focus-visible,
      &:active,
      &.--active {
        @apply maz:z-1;
      }
    }
  }
}

.m-button-group__indicator {
  background-color: color-mix(in srgb, var(--m-group-indicator-color) 16%, transparent);
  box-shadow: inset 0 0 0 2px var(--m-group-indicator-color);
}
</style>
