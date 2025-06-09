<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazLinkProps } from './MazLink.vue'
import type { MazColor, MazPosition, MazSize } from './types'
import { MazChevronDown } from '@maz-ui/icons'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'
import { debounce } from '../helpers/debounce'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style: styleProp,
  id,
  items = [],
  trigger = 'both',
  color = 'transparent',
  position = 'bottom left',
  screenReaderDescription = 'Open menu dropdown',
  dropdownIconAnimation = true,
  size = 'md',
  closeOnClick = true,
  chevron = true,
  open,
  disabled,
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
  'update:open': [value: boolean]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazLink = defineAsyncComponent(() => import('./MazLink.vue'))

const instanceId = useInstanceUniqId({
  componentName: 'MazDropdown',
  providedId: id,
})

type ItemBase = Record<string, unknown> & {
  label: string
  class?: unknown
  color?: MazColor
}

type LinkItem = ItemBase & MazLinkProps & {
  target?: string
  href?: string
  to?: RouteLocationRaw
}

type ActionItem = ItemBase & {
  onClick?: () => unknown
}

export type MenuItem
  = | (LinkItem & { action?: never })
    | (ActionItem & { href?: never, to?: never, target?: never })

export interface MazDropdownProps {
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
   * @type {MenuItem[]}
   * @default []
   * @example
   * [
   *   { label: 'Profile', href: '/profile' },
   *   { label: 'Settings', onClick: () => console.log('Settings clicked') }
   * ]
   */
  items?: MenuItem[]
  /**
   * Controls whether the dropdown menu is open
   * @type {boolean}
   * @default false
   */
  open?: boolean
  /**
   * Unique identifier for the dropdown component
   * @type {string}
   */
  id?: string
  /**
   * Determines how the dropdown should be triggered
   * @type {'click' | 'hover' | 'both'}
   * @values click, hover, both
   * @default 'both'
   * @example 'click' - Opens only on click
   * @example 'hover' - Opens only on hover
   * @example 'both' - Opens on both click and hover
   */
  trigger?: 'click' | 'hover' | 'both'
  /**
   * Color theme for the dropdown button
   * @type {MazColor}
   * @values primary, secondary, info, success, warning, destructive, transparent, contrast, accent
   * @default 'transparent'
   */
  color?: MazColor
  /**
   * Position where the dropdown menu should appear relative to the trigger button
   * @type {MazPosition}
   * @values top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
   * @default 'bottom left'
   * @example 'top right' - Menu appears above and to the right
   */
  position?: MazPosition
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
   * @type {string}
   * @default 'Open menu dropdown'
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

const dropdownOpen = ref(open)
const keyboardSelectedIndex = ref<number>()

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

const setDropdownDebounced = debounce((value: boolean) => {
  setDropdown(value)
}, 200)

function onClickOutside() {
  if (dropdownOpen.value) {
    setDropdown(false)
  }
}

function toggleDropdown() {
  setDropdown(!dropdownOpen.value)
}

function onElementClick() {
  if (['click'].includes(trigger))
    toggleDropdown()
}
function onElementFocus() {
  if (['hover', 'both'].includes(trigger))
    setDropdown(true)
}
function onElementMouseenter() {
  if (['hover', 'both'].includes(trigger)) {
    if (dropdownOpen.value === false) {
      setDropdown(true)
    }
    else {
      setDropdownDebounced(true)
    }
  }
}
function onElementMouseleave() {
  if (['hover', 'both'].includes(trigger)) {
    setDropdownDebounced(false)
  }
}
function onElementBlur() {
  setDropdownDebounced(false)
}

function setDropdown(value: boolean) {
  if (disabled)
    return

  dropdownOpen.value = value
  emits('update:open', value)
}

function isActionItem(item: MenuItem): item is ActionItem {
  return 'action' in item
}

function isLinkItem(item: MenuItem): item is LinkItem {
  return 'href' in item || 'to' in item
}

async function runAction(item: ActionItem, event: Event) {
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
  if (event.key === 'Escape') {
    event.preventDefault()
    setDropdown(false)
  }
  else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    arrowHandler(event)
  }
  else if (event.key === 'Enter' && typeof keyboardSelectedIndex.value === 'number') {
    event.preventDefault()
    const item = document.querySelectorAll(`#${instanceId.value} .menuitem`)[
      keyboardSelectedIndex.value
    ] as HTMLElement

    item.click()

    closeDropdown()
  }
}

function keyboardOpenDropdown(event: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key) && dropdownOpen.value === false) {
    event.preventDefault()
    setDropdown(true)
  }
}

function arrowHandler(event: KeyboardEvent) {
  event.preventDefault()
  const code = event.key

  if (!dropdownOpen.value)
    setDropdown(true)

  const itemLength = items?.length

  if (!itemLength)
    return

  if (typeof keyboardSelectedIndex.value === 'number') {
    if (keyboardSelectedIndex.value === itemLength - 1 && code === 'ArrowDown') {
      keyboardSelectedIndex.value = 0
    }
    else if (keyboardSelectedIndex.value === 0 && code === 'ArrowUp') {
      keyboardSelectedIndex.value = itemLength - 1
    }
    else {
      keyboardSelectedIndex.value
          = code === 'ArrowDown' ? keyboardSelectedIndex.value + 1 : keyboardSelectedIndex.value - 1
    }
  }
  else {
    keyboardSelectedIndex.value = code === 'ArrowDown' ? 0 : itemLength - 1
  }
}

watch(
  () => dropdownOpen.value,
  (value) => {
    if (value) {
      document.addEventListener('keydown', keydownHandler)
    }
    else {
      document.removeEventListener('keydown', keydownHandler)
    }

    keyboardSelectedIndex.value = undefined
  },
)
watch(
  () => open,
  value => setDropdown(value),
)
</script>

<template>
  <div
    :id="instanceId"
    v-click-outside="onClickOutside"
    class="m-dropdown m-reset-css"
    :style="styleProp"
    :class="[classProp, { '--block': block }]"
  >
    <div
      role="button"
      tabindex="0"
      class="m-dropdown__wrapper"
      :aria-expanded="dropdownOpen"
      aria-haspopup="menu"
      @click.stop="onElementClick"
      @focus="onElementFocus"
      @blur="onElementBlur"
      @keydown="keyboardOpenDropdown"
      @mouseenter="onElementMouseenter"
      @mouseleave="onElementMouseleave"
    >
      <span v-if="screenReaderDescription || $slots['screen-reader-description']" :id="`${instanceId}-labelspan`" class="maz-sr-only">
        <!--
          @slot description for screen readers (hidden from visual display)
          Provides accessibility information about the dropdown functionality
          @default 'Open menu dropdown'
        -->
        <slot name="screen-reader-description">
          {{ screenReaderDescription }}
        </slot>
      </span>
      <!--
        @slot trigger element for the dropdown
        @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
        @default MazBtn component with default styling
      -->
      <slot name="element" :is-open="dropdownOpen">
        <MazBtn
          :aria-labelledby="`${instanceId}-labelspan`"
          :color
          :disabled
          v-bind="$attrs"
          tabindex="-1"
          :block
          :size
        >
          <!-- @slot Text content of the trigger element -->
          <slot />

          <template v-if="chevron" #right-icon>
            <!--
              @slot Dropdown indicator icon
              @binding {boolean} is-open - Current state of the dropdown (true when open, false when closed)
              @default MazChevronDown icon with rotation animation
            -->
            <slot name="dropdown-icon" :is-open="dropdownOpen">
              <MazIcon v-if="typeof dropdownIcon === 'string'" :name="dropdownIcon" :class="[{ '--open': dropdownOpen && dropdownIconAnimation }, iconClassSize]" />
              <Component
                :is="dropdownIcon" v-else-if="dropdownIcon" :class="[{ '--open': dropdownOpen && dropdownIconAnimation }, iconClassSize]"
                class="m-dropdown__icon"
              />
              <MazChevronDown
                v-else
                :class="[{ '--open': dropdownOpen && dropdownIconAnimation }, iconClassSize]"
                class="m-dropdown__icon"
              />
            </slot>
          </template>
        </MazBtn>
      </slot>
    </div>

    <Transition name="maz-scale-fade">
      <div
        v-show="dropdownOpen"
        role="menu"
        aria-label="Menu"
        class="menu"
        tabindex="-1"
        :class="[{
          '--top': position.includes('top'),
          '--left': position.includes('left'),
          '--right': position.includes('right'),
          '--bottom': position.includes('bottom'),
        }, menuPanelClass]"
        :style="menuPanelStyle"
        @focus="setDropdownDebounced(true)"
        @blur="setDropdownDebounced(false)"
        @mouseenter="['hover', 'both'].includes(trigger) ? setDropdownDebounced(true) : undefined"
        @mouseleave="['hover', 'both'].includes(trigger) ? setDropdownDebounced(false) : undefined"
      >
        <!--
          @slot Dropdown menu panel content
          @binding {MenuItem[]} items - Array of menu items passed via the items prop
        -->
        <slot name="dropdown" :items="items">
          <template v-for="(item, index) in items" :key="index">
            <!--
              @slot Menu item component
              @binding {MenuItem} item - Individual menu item object with properties like label, href, onClick, etc.
            -->
            <slot name="menuitem" :item="item">
              <template v-if="isLinkItem(item)">
                <MazLink
                  :target="item.href ? item.target ?? '_self' : undefined"
                  :to="item.to"
                  :href="item.href"
                  :color="item.color ?? 'contrast'"
                  v-bind="item"
                  :underline-only-hover="item.underlineOnlyHover ?? false"
                  class="menuitem"
                  tabindex="-1"
                  :class="[
                    {
                      '--is-keyboard-selected': keyboardSelectedIndex === index,
                    },
                    item.class,
                  ]"
                  @click.stop="closeDropdown"
                >
                  <!--
                    @slot Label content for menu item
                    @binding {MenuItem} item - Individual menu item object containing label and other properties
                  -->
                  <slot name="menuitem-label" :item="item">
                    {{ item.label }}
                  </slot>
                </MazLink>
              </template>
              <template v-else-if="isActionItem(item)">
                <button
                  tabindex="-1"
                  type="button"
                  v-bind="item"
                  class="menuitem menuitem__button"
                  :class="[
                    {
                      '--is-keyboard-selected': keyboardSelectedIndex === index,
                    },
                    item.class,
                    `--${item.color ?? 'contrast'}`,
                  ]"
                  @click.stop="runAction(item, $event)"
                >
                  <!--
                    @slot Label content for menu item
                    @binding {MenuItem} item - Individual menu item object containing label and other properties
                  -->
                  <slot name="menuitem-label" :item="item">
                    {{ item.label }}
                  </slot>
                </button>
              </template>
            </slot>
          </template>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style lang="postcss">
  .m-dropdown {
  @apply maz-relative maz-inline-flex maz-flex-col maz-items-start maz-align-top;

  &.--block {
    @apply maz-w-full;
  }

  & [aria-expanded='true'].m-btn {
    @apply maz-bg-surface-400;
  }

  &__wrapper {
    @apply maz-h-full maz-w-full maz-outline-none;
  }

  &__icon {
    @apply maz-transition-transform maz-duration-200 maz-ease-in-out;

    &.--open {
      @apply maz-rotate-180;
    }
  }

  .menu {
    @apply maz-absolute maz-z-default-backdrop maz-flex maz-min-h-max maz-min-w-max maz-flex-col maz-gap-0.5 maz-overflow-auto maz-rounded maz-bg-surface maz-p-2 maz-elevation dark:maz-border dark:maz-border-divider-400;

    &.--top:not(.--right, .--left) {
      @apply maz-bottom-full maz-mb-1 maz-origin-bottom;
    }

    &.--bottom:not(.--right, .--left) {
      @apply maz-top-full maz-mt-1 maz-origin-top;
    }

    &.--left:not(.--top, .--bottom) {
      @apply maz-right-full maz-mr-1 maz-origin-top-right;
    }

    &.--right:not(.--top, .--bottom) {
      @apply maz-left-full maz-ml-1 maz-origin-top-left;
    }

    &.--top.--right {
      @apply maz-bottom-full maz-right-0 maz-mb-1 maz-origin-bottom-right;
    }

    &.--top.--left {
      @apply maz-bottom-full maz-left-0 maz-mb-1 maz-origin-bottom-left;
    }

    &.--bottom.--left {
      @apply maz-left-0 maz-top-full maz-mt-1 maz-origin-top-left;
    }

    &.--bottom.--right {
      @apply maz-right-0 maz-top-full maz-mt-1 maz-origin-top-right;
    }

    .menuitem {
      @apply maz-cursor-pointer maz-whitespace-nowrap maz-rounded maz-px-4 maz-py-2 maz-text-start maz-outline-none maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-surface-400 hover:maz-bg-surface-400;

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
}
</style>
