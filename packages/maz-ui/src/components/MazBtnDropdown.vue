<script setup lang="ts">
import type { VTooltipBindingValue } from '../directives/vTooltip'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazDropdownMenuItem, MazDropdownProps } from './MazDropdown.vue'
import type { MazPopoverPosition } from './MazPopover.vue'
import type { MazSize } from './types'
import { MazChevronDown } from '@maz-ui/icons/raw/MazChevronDown'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { vTooltip } from '../directives/vTooltip'
import MazBtn from './MazBtn.vue'
import MazDropdown from './MazDropdown.vue'

const {
  items = [],
  menuLabel,
  color = 'primary',
  pastel,
  outlined,
  loading,
  disabled,
  actionDisabled,
  menuDisabled,
  itemsSize = 'sm',
  position = 'bottom-end',
  trigger = 'click',
  type = 'button',
  startIcon,
  block,
  tooltip,
} = defineProps<MazBtnDropdownProps>()

const emit = defineEmits<{
  /**
   * Emitted when the main action is clicked
   * @property {MouseEvent} event - the click event
   */
  click: [event: MouseEvent]
}>()

const TOGGLE_PADDING_CLASS: Record<MazSize, string> = {
  xl: 'maz:px-3!',
  lg: 'maz:px-3!',
  md: 'maz:px-2.5!',
  sm: 'maz:px-2!',
  xs: 'maz:px-1!',
  mini: 'maz:px-0.5!',
}

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: NonNullable<MazBtnProps['roundedSize']> }>('MazBtnDropdown', {
  size: 'md',
  roundedSize: 'md',
})

/**
 * Split button: the main action on the left, its variants in a menu behind the chevron on the right.
 * Without `items`, it is a simple button.
 */
export interface MazBtnDropdownProps {
  /**
   * Variants of the main action, listed in the menu of the chevron; without items, the chevron is hidden
   * @default []
   */
  items?: MazDropdownMenuItem[]
  /**
   * Accessible name of the chevron, also shown as its native tooltip (e.g. "Other versions")
   */
  menuLabel: string
  /**
   * Size of both parts
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   * @default 'md'
   */
  size?: MazBtnProps['size']
  /**
   * Color of both parts
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'transparent' | 'surface' | 'container'`
   * @default 'primary'
   */
  color?: MazBtnProps['color']
  /**
   * Size of the rounded of the outer corners (the inner ones stay square)
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'md'
   */
  roundedSize?: MazBtnProps['roundedSize']
  /**
   * If true, both parts have a pastel color
   * @default false
   */
  pastel?: boolean
  /**
   * If true, both parts have the "border" style
   * @default false
   */
  outlined?: boolean
  /**
   * Enable the loader of the main action
   * @default false
   */
  loading?: boolean
  /**
   * Disable both parts
   * @default false
   */
  disabled?: boolean
  /**
   * Disable only the main action: the menu stays usable (e.g. the main target is not available but its variants are)
   * @default false
   */
  actionDisabled?: boolean
  /**
   * Disable only the menu
   * @default false
   */
  menuDisabled?: boolean
  /**
   * Size of the menu items
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   * @default 'sm'
   */
  itemsSize?: MazBtnProps['size']
  /**
   * Position of the menu relative to the chevron
   * @values `'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'`
   * @default 'bottom-end'
   */
  position?: MazPopoverPosition
  /**
   * How the menu opens: on click of the chevron, on hover, or adaptive (hover on desktop, click on touch devices)
   * @values `'click' | 'hover' | 'manual' | 'adaptive'`
   * @default 'click'
   */
  trigger?: MazDropdownProps['trigger']
  /**
   * Native type of the main action (`submit` to submit a form)
   * @values `'button' | 'submit' | 'reset'`
   * @default 'button'
   */
  type?: MazBtnProps['type']
  /**
   * Icon displayed before the content of the main action
   */
  startIcon?: MazBtnProps['startIcon']
  /**
   * If true, the component takes the full width of its container: the main action grows, the chevron keeps its size
   * @default false
   */
  block?: boolean
  /**
   * Tooltip of the main action only (the chevron keeps its native `title`): a text, or the options of the `v-tooltip` directive (`{ text, position, color... }`)
   */
  tooltip?: VTooltipBindingValue
}
</script>

<template>
  <span
    class="m-btn-dropdown m-reset-css maz:items-stretch maz:gap-px"
    :class="block ? 'maz:flex maz:w-full' : 'maz:inline-flex'"
    role="group"
  >
    <MazBtn
      v-tooltip="tooltip"
      :size
      :color
      :rounded-size
      :pastel
      :outlined
      :loading
      :type
      :start-icon
      :disabled="disabled || actionDisabled"
      class="m-btn-dropdown__action"
      :class="{ 'maz:rounded-e-none!': items.length > 0, 'maz:min-w-0 maz:flex-1': block }"
      @click="emit('click', $event)"
    >
      <!--
        @slot default - The content of the main action
      -->
      <slot />
    </MazBtn>
    <MazDropdown
      v-if="items.length > 0"
      :items
      :items-size
      :position
      :disabled="disabled || menuDisabled"
      :chevron="false"
      close-on-click
      :trigger
    >
      <template #trigger>
        <MazBtn
          :size
          :color
          :rounded-size
          :pastel
          :outlined
          :disabled="disabled || menuDisabled"
          :icon="MazChevronDown"
          :title="menuLabel"
          :aria-label="menuLabel"
          class="m-btn-dropdown__toggle maz:rounded-s-none!"
          :class="TOGGLE_PADDING_CLASS[size]"
        />
      </template>
      <template #menuitem-label="{ item }">
        <!--
          @slot menuitem-label - The label of a menu item
            @binding {MazDropdownMenuItem} item - the menu item
        -->
        <slot name="menuitem-label" :item>
          {{ item.label }}
        </slot>
      </template>
    </MazDropdown>
  </span>
</template>
