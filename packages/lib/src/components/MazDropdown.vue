<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazLinkProps } from './MazLink.vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor, MazSize } from './types'
import { MazChevronDown } from '@maz-ui/icons'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { isClient } from '@maz-ui/utils/src/helpers/isClient.js'
import { computed, defineAsyncComponent, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import MazPopover from './MazPopover.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style: styleProp,
  id,
  items = [],
  trigger = 'adaptive',
  color = 'transparent',
  position = 'auto',
  screenReaderDescription,
  dropdownIconAnimation = true,
  size = 'md',
  closeOnClick = true,
  chevron = true,
  disabled = false,
  preferPosition = 'bottom-start',
} = defineProps<MazDropdownProps>()

const emits = defineEmits<{
  /**
   * Emitted when a menu item is clicked
   * @property {Event} event - The native click event from the menu item interaction
   */
  'menuitem-clicked': [event: Event]
  /**
   * Emitted when the dropdown open state changes
   * @property {boolean} value - The new open state (true when opened, false when closed)
   */
  'update:model-value': [value: boolean]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazLink = defineAsyncComponent(() => import('./MazLink.vue'))

const instanceId = useInstanceUniqId({
  componentName: 'MazDropdown',
  providedId: id,
})

const { t } = useTranslations()

type MazDropdownItemBase = Record<string, unknown> & {
  label: string
  class?: unknown
  color?: MazColor
}

type MazDropdownLinkItem = MazDropdownItemBase & MazLinkProps & {
  target?: string
  href?: string
  to?: RouteLocationRaw
}

type MazDropdownActionItem = MazDropdownItemBase & {
  onClick?: () => unknown
}

export type MazDropdownMenuItem
  = | (MazDropdownLinkItem & { action?: never })
    | (MazDropdownActionItem & { href?: never, to?: never, target?: never })

export interface MazDropdownProps extends Omit<MazPopoverProps, 'modelValue'> {
  /**
   * Controls whether the dropdown menu is open
   * @model
   * @type {boolean}
   * @default false
   */
  modelValue?: boolean
  /**
   * Inline styles to apply to the component root element
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * CSS classes to apply to the component root element
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /**
   * Menu items to display in the dropdown
   * Each item can be either a link (with href/to properties) or an action (with onClick function)
   * @type {MazDropdownMenuItem[]}
   * @default []
   * @example
   * [
   *   { label: 'Profile', href: '/profile' },
   *   { label: 'Settings', onClick: () => console.log('Settings clicked') }
   * ]
   */
  items?: MazDropdownMenuItem[]
  /**
   * Unique identifier for the dropdown component
   * @type {string}
   */
  id?: string
  /**
   * Determines how the dropdown should be triggered
   * @type {MazPopoverProps['trigger']}
   * @values click, hover, manual, adaptive
   * @default 'adaptive'
   */
  trigger?: MazPopoverProps['trigger']
  /**
   * Color theme for the dropdown button
   * @type {MazColor}
   * @values primary, secondary, info, success, warning, destructive, transparent, contrast, accent
   * @default 'transparent'
   */
  color?: MazColor
  /**
   * Position of the menu relative to trigger
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default 'auto'
   */
  position?: MazPopoverProps['position']

  /**
   * Preferred position of the menu relative to trigger when auto position is used
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default 'bottom-start'
   */
  preferPosition?: MazPopoverProps['preferPosition']
  /**
   * Controls whether the dropdown menu closes when a menu item is clicked
   * @type {boolean}
   * @default true
   */
  closeOnClick?: boolean
  /**
   * Disables the dropdown functionality
   * @type {boolean}
   * @default false
   */
  disabled?: boolean
  /**
   * Controls whether to show the chevron icon in the trigger button
   * @type {boolean}
   * @default true
   */
  chevron?: boolean
  /**
   * Accessible description for screen readers describing the dropdown functionality
   * If not provided, the default translation of MazTranslations plugin will be used
   * @type {string}
   * @default MazTranslationsSchema['dropdown']['screenReaderDescription']
   */
  screenReaderDescription?: string
  /**
   * Additional CSS classes to apply to the dropdown menu panel
   * Useful for customizing the dropdown appearance (background, border, etc.)
   * @type {HTMLAttributes['class']}
   */
  menuPanelClass?: HTMLAttributes['class']
  /**
   * Inline styles to apply to the dropdown menu panel
   * Useful for custom styling. You may use `!important` to override default styles
   * @type {HTMLAttributes['style']}
   */
  menuPanelStyle?: HTMLAttributes['style']
  /**
   * Makes the dropdown button expand to full width of its container
   * @type {boolean}
   * @default false
   */
  block?: boolean
  /**
   * Icon to use instead of the default chevron for the dropdown indicator
   * Can be either an icon name string or a Vue component
   * @type {string | IconComponent}
   * @example 'arrow-down'
   * @example ArrowDownIcon (import { ArrowDownIcon } from '@maz-ui/icons')
   */
  dropdownIcon?: string | IconComponent
  /**
   * Controls whether the dropdown icon rotates when the dropdown is opened
   * @type {boolean}
   * @default true
   */
  dropdownIconAnimation?: boolean
  /**
   * Size of the dropdown button
   * @type {MazSize}
   * @values mini, xs, sm, md, lg, xl
   * @default 'md'
   */
  size?: MazSize
}

const modelValue = defineModel<boolean>({
  required: false,
  default: false,
})

const iconClassSize = computed(() => {
  if (size === 'xl')
    return 'maz-text-lg'
  if (size === 'lg')
    return 'maz-text-base'
  if (size === 'md')
    return 'maz-text-base'
  if (size === 'sm')
    return 'maz-text-base'
  if (size === 'xs')
    return 'maz-text-sm'
  if (size === 'mini')
    return 'maz-text-sm'
  return 'maz-text-lg'
})

function setDropdown(value: boolean) {
  if (disabled)
    return

  modelValue.value = value
}

function isLinkItem(item: MazDropdownMenuItem): item is MazDropdownLinkItem {
  return 'href' in item || 'to' in item
}

async function runAction(item: MazDropdownActionItem, event: Event) {
  emits('menuitem-clicked', event)

  await item.onClick?.()

  if (closeOnClick) {
    closeDropdown()
  }
}

function closeDropdown() {
  if (closeOnClick)
    setDropdown(false)
}

function keydownHandler(event: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    arrowHandler(event)
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    const item = document.activeElement as HTMLElement | undefined

    item?.click()

    closeDropdown()
  }
}

function arrowHandler(event: KeyboardEvent) {
  event.preventDefault()
  const code = event.key

  const itemLength = items?.length
  if (!itemLength)
    return

  const currentElement = document.activeElement as HTMLElement
  const itemsElements = document.querySelectorAll<HTMLElement>(`#${instanceId.value}-menu .menuitem`)
  const currentIndex = Array.from(itemsElements).indexOf(currentElement)

  if (currentIndex === -1) {
    (itemsElements[0] as HTMLElement)?.focus()
    return
  }

  const nextIndex = code === 'ArrowDown'
    ? (currentIndex + 1) % itemLength
    : (currentIndex - 1 + itemLength) % itemLength

  itemsElements[nextIndex]?.focus()
}

watch(
  modelValue,
  (value) => {
    if (!isClient())
      return

    if (value) {
      document.addEventListener('keydown', keydownHandler)
    }
    else {
      document.removeEventListener('keydown', keydownHandler)
    }
  },
)
</script>

<template>
  <MazPopover
    :trigger
    :model-value
    class="m-dropdown m-reset-css"
    role="menu"
    :style="styleProp"
    :prefer-position
    color="background"
    :position
    :disabled
    :keep-open-on-hover="trigger === 'hover' || trigger === 'adaptive'"
    :class="[classProp]"
    :block
    @update:model-value="setDropdown"
  >
    <template #trigger="{ toggle, close, isOpen, open }">
      <div
        :id="instanceId"
        tabindex="-1"
        class="m-dropdown__wrapper"
        :aria-expanded="modelValue"
        aria-haspopup="menu"
      >
        <span :id="`${instanceId}-labelspan`" class="maz-sr-only">
          <!--
            @slot description for screen readers (hidden from visual display)
            Provides accessibility information about the dropdown functionality
            @default 'Open menu dropdown'
          -->
          <slot name="screen-reader-description">
            {{ screenReaderDescription || t('dropdown.screenReaderDescription') }}
          </slot>
        </span>
        <!--
          @slot trigger element for the dropdown
          @default MazBtn component with default styling
          @binding {() => void} close - Function to close the dropdown
          @binding {() => void} open - Function to open the dropdown
          @binding {() => void} toggle - Function to toggle the dropdown
          @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
        -->
        <slot name="trigger" :is-open="isOpen" :toggle="toggle" :close="close" :open="open">
          <MazBtn
            :aria-labelledby="`${instanceId}-labelspan`"
            :color
            :disabled
            v-bind="$attrs"
            :block
            :size
          >
            <!-- @slot Text content of the trigger element -->
            <slot />

            <template v-if="chevron || $slots['dropdown-icon']" #right-icon>
              <!--
                @slot Dropdown indicator icon
                @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
                @default MazChevronDown icon with rotation animation
              -->
              <slot name="dropdown-icon" :is-open="isOpen" :toggle="toggle" :close="close" :open="open">
                <MazIcon v-if="typeof dropdownIcon === 'string'" :name="dropdownIcon" :class="[{ '--open': modelValue && dropdownIconAnimation }, iconClassSize]" />
                <Component
                  :is="dropdownIcon" v-else-if="dropdownIcon" :class="[{ '--open': modelValue && dropdownIconAnimation }, iconClassSize]"
                  class="m-dropdown__icon"
                />
                <MazChevronDown
                  v-else
                  :class="[{ '--open': modelValue && dropdownIconAnimation }, iconClassSize]"
                  class="m-dropdown__icon"
                />
              </slot>
            </template>
          </MazBtn>
        </slot>
      </div>
    </template>

    <template #default="{ open, close, isOpen, toggle }">
      <div
        :id="`${instanceId}-menu`"
        role="menu"
        aria-label="Menu"
        class="m-dropdown__menu"
        tabindex="-1"
        :class="menuPanelClass"
        :style="menuPanelStyle"
      >
        <!--
          @slot Dropdown menu panel content
          @binding {MazDropdownMenuItem[]} items - Array of menu items passed via the items prop
          @binding {() => void} close - Function to close the dropdown
          @binding {() => void} open - Function to open the dropdown
          @binding {() => void} toggle - Function to toggle the dropdown
          @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
          @binding {() => void} toggle - Function to toggle the dropdown
        -->
        <slot name="dropdown" :items="items" :open="open" :close="close" :is-open="isOpen" :toggle="toggle">
          <template v-for="(item, index) in items" :key="index">
            <!--
              @slot Menu item component
              @binding {MenuItem} item - Individual menu item object with properties like label, href, onClick, etc.
              @binding {() => void} close - Function to close the dropdown
              @binding {() => void} open - Function to open the dropdown
              @binding {() => void} toggle - Function to toggle the dropdown
              @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
              @binding {() => void} toggle - Function to toggle the dropdown
            -->
            <slot name="menuitem" :item="item" :open="open" :close="close" :is-open="isOpen" :toggle="toggle">
              <template v-if="isLinkItem(item)">
                <MazLink
                  :target="item.href ? item.target ?? '_self' : undefined"
                  :to="item.to"
                  :href="item.href"
                  :color="item.color ?? 'contrast'"
                  v-bind="item"
                  :underline-only-hover="item.underlineOnlyHover ?? false"
                  class="menuitem"
                  :class="[item.class]"
                  @click.stop="closeDropdown"
                >
                  <!--
                    @slot Label content for menu item
                    @binding {MenuItem} item - Individual menu item object containing label and other properties
                    @binding {() => void} close - Function to close the dropdown
                    @binding {() => void} open - Function to open the dropdown
                    @binding {() => void} toggle - Function to toggle the dropdown
                    @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
                    @binding {() => void} toggle - Function to toggle the dropdown
                  -->
                  <slot name="menuitem-label" :item="item" :open="open" :close="close" :is-open="isOpen" :toggle="toggle">
                    {{ item.label }}
                  </slot>
                </MazLink>
              </template>
              <template v-else>
                <button
                  type="button"
                  v-bind="{ ...item, onClick: undefined }"
                  class="menuitem menuitem__button"
                  :class="[item.class, item.color ? `--${item.color}` : '']"
                  @click.stop="runAction(item, $event)"
                  @keypress.enter.stop.prevent="runAction(item, $event)"
                >
                  <!--
                    @slot Label content for menu item
                    @binding {MenuItem} item - Individual menu item object containing label and other properties
                    @binding {() => void} close - Function to close the dropdown
                    @binding {() => void} open - Function to open the dropdown
                    @binding {() => void} toggle - Function to toggle the dropdown
                    @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
                    @binding {() => void} toggle - Function to toggle the dropdown
                  -->
                  <slot name="menuitem-label" :item="item" :open="open" :close="close" :is-open="isOpen" :toggle="toggle">
                    {{ item.label }}
                  </slot>
                </button>
              </template>
            </slot>
          </template>
        </slot>
      </div>
    </template>
  </MazPopover>
</template>

<style lang="postcss">
  .m-dropdown {
  @apply maz-relative maz-inline-flex maz-flex-col maz-items-start maz-align-top;

  &__wrapper {
    @apply maz-h-full maz-w-full maz-outline-none focus:maz-bg-surface-400 maz-rounded;
  }

  &__icon {
    @apply maz-transition-transform maz-duration-200 maz-ease-in-out;

    &.--open {
      @apply maz-rotate-180;
    }
  }
}

.m-dropdown__menu {
  @apply maz-flex maz-min-h-max maz-min-w-max maz-flex-col maz-gap-0.5 maz-overflow-auto maz-p-2;

  .menuitem {
    @apply maz-outline-none maz-cursor-pointer maz-whitespace-nowrap maz-rounded maz-px-4 maz-py-2 maz-text-start
     maz-transition-colors maz-duration-300 maz-ease-in-out focus:maz-bg-surface-400 hover:maz-bg-surface-400;

    &.--is-keyboard-selected {
      @apply maz-bg-surface-400;
    }

    &.menuitem__button {
      &:disabled {
        @apply maz-cursor-not-allowed maz-opacity-50;
      }

      &.--primary {
        @apply maz-text-primary hover:maz-text-primary-600;
      }

      &.--secondary {
        @apply maz-text-secondary hover:maz-text-secondary-600;
      }

      &.--info {
        @apply maz-text-info hover:maz-text-info-600;
      }

      &.--warning {
        @apply maz-text-warning-600 hover:maz-text-warning-600;
      }

      &.--destructive {
        @apply maz-text-destructive-600 hover:maz-text-destructive-600;
      }

      &.--success {
        @apply maz-text-success-600 hover:maz-text-success-600;
      }

      &.--contrast {
        @apply maz-text-contrast hover:maz-text-contrast-600;
      }
    }
  }
}
</style>
