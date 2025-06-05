<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazLinkProps } from './MazLink.vue'
import type { MazColor, MazPosition, MazSize } from './types'
import { ChevronDown } from '@maz-ui/icons'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'
import { debounce } from '../helpers/debounce'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazDropdownProps>(), {
  class: undefined,
  style: undefined,
  id: undefined,
  items: () => [],
  trigger: 'both',
  color: 'transparent',
  position: 'bottom left',
  screenReaderDescription: 'Open menu dropdown',
  dropdownIconAnimation: true,
  size: 'md',
  closeOnClick: true,
  chevron: true,
})
const emits = defineEmits<{
  /**
   * emitted when a menu item is clicked
   * @property {Event} event - the click event
   */
  'menuitem-clicked': [event: Event]
  /**
   * Triggers when the number changes
   * @property {boolean} open new value
   */
  'update:open': [value: boolean]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazLink = defineAsyncComponent(() => import('./MazLink.vue'))

const instanceId = useInstanceUniqId({
  componentName: 'MazDropdown',
  providedId: props.id,
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
  action?: () => unknown
}

export type MenuItem =
  | (LinkItem & { action?: never })
  | (ActionItem & { href?: never, to?: never, target?: never })

export interface MazDropdownProps {
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /**
   * Menu items
   * @default '[]'
   */
  items?: MenuItem[]
  /** Menu should be open? */
  open?: boolean
  /** id of the menu */
  id?: string
  /**
   * Should open the dropdown on click, hover or both
   * @default 'both'
   */
  trigger?: 'click' | 'hover' | 'both'
  /**
   * Button color
   * @default 'transparent'
   */
  color?: MazColor
  /**
   * Position of the dropdown
   * @default 'bottom left'
   */
  position?: MazPosition
  /**
   * Disable close menu on menuitem clicked
   * @default true
   */
  closeOnClick?: boolean
  /**
   * Disable the dropdown
   * @default false
   */
  disabled?: boolean
  /**
   * Remove chevron icon in main button
   * @default false
   */
  chevron?: boolean
  /**
   * Description read by screen reader (accessibility)
   * @default 'Open menu dropdown'
   */
  screenReaderDescription?: string
  /**
   * Class for the menu panel - useful for custom dropdown panel (background, border, etc.)
   */
  menuPanelClass?: HTMLAttributes['class']
  /**
   * Style for the menu panel - useful for custom dropdown panel (background, border, etc.)
   * You may use `!important` to override the default style
   */
  menuPanelStyle?: HTMLAttributes['style']
  /**
   * If true, the button will have a full width
   */
  block?: boolean
  /**
   * Custom dropdown icon
   * You can use a string to define the icon name or a Vue component
   * @default undefined
   */
  dropdownIcon?: string | IconComponent
  /**
   * If true, the dropdown icon will rotate when the dropdown is open
   * @default true
   */
  dropdownIconAnimation?: boolean
  /**
   * Size of the button
   * @default 'md'
   */
  size?: MazSize
}

const dropdownOpen = ref(props.open)
const keyboardSelectedIndex = ref<number>()

const iconClassSize = computed(() => {
  if (props.size === 'xl')
    return 'maz-text-lg'
  if (props.size === 'lg')
    return 'maz-text-base'
  if (props.size === 'md')
    return 'maz-text-base'
  if (props.size === 'sm')
    return 'maz-text-base'
  if (props.size === 'xs')
    return 'maz-text-sm'
  if (props.size === 'mini')
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
  if (['click'].includes(props.trigger))
    toggleDropdown()
}
function onElementFocus() {
  if (['hover', 'both'].includes(props.trigger))
    setDropdown(true)
}
function onElementMouseenter() {
  if (['hover', 'both'].includes(props.trigger)) {
    if (dropdownOpen.value === false) {
      setDropdown(true)
    }
    else {
      setDropdownDebounced(true)
    }
  }
}
function onElementMouseleave() {
  if (['hover', 'both'].includes(props.trigger)) {
    setDropdownDebounced(false)
  }
}
function onElementBlur() {
  setDropdownDebounced(false)
}

function setDropdown(value: boolean) {
  if (props.disabled)
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

  await item.action?.()

  if (props.closeOnClick) {
    closeOnClick()
  }
}

function closeOnClick() {
  if (props.closeOnClick)
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

    closeOnClick()
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

  const itemLength = props.items?.length

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
  () => props.open,
  value => setDropdown(value),
)
</script>

<template>
  <div
    :id="instanceId"
    v-click-outside="onClickOutside"
    class="m-dropdown m-reset-css"
    :style
    :class="[props.class, { '--block': block }]"
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
        <!-- @slot Description for screen reader (hidden) -->
        <slot name="screen-reader-description">
          {{ screenReaderDescription }}
        </slot>
      </span>
      <!--
        @slot Custom Element
          @binding {Boolen} is-open - dropdown open state
          @default `<MazBtn />`
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
          <slot />

          <template v-if="chevron" #right-icon>
            <!--
              @slot Custom dropdown icon
                @binding {Boolean} is-open - dropdown open state
                @default `<ChevronDownIcon />`
            -->
            <slot name="dropdown-icon" :is-open="dropdownOpen">
              <MazIcon v-if="typeof dropdownIcon === 'string'" :name="dropdownIcon" :class="[{ '--open': dropdownOpen && dropdownIconAnimation }, iconClassSize]" />
              <Component
                :is="dropdownIcon" v-else-if="dropdownIcon" :class="[{ '--open': dropdownOpen && dropdownIconAnimation }, iconClassSize]"
                class="m-dropdown__icon"
              />
              <ChevronDown
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
          @slot Custom dropdown panel
            @binding {Array} items - items prop data
        -->
        <slot name="dropdown" :items="items">
          <template v-for="(item, index) in items" :key="index">
            <!--
              @slot Custom menu item
                @binding {MenuItem} item - menu item
            -->
            <slot name="menuitem" :item="item">
              <template v-if="isLinkItem(item)">
                <MazLink
                  :target="item.href ? item.target ?? '_self' : undefined"
                  :to="item.to"
                  :href="item.href"
                  :color="item.color ?? 'theme'"
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
                  @click.stop="closeOnClick"
                >
                  <!--
                    @slot Custom label for menu item
                      @binding {MenuItem} - item menu item
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
                    `--${item.color ?? 'theme'}`,
                  ]"
                  @click.stop="runAction(item, $event)"
                >
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
    @apply maz-bg-color-light;
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
    @apply maz-absolute maz-z-default-backdrop maz-flex maz-min-h-max maz-min-w-max maz-flex-col maz-gap-0.5 maz-overflow-auto maz-rounded maz-bg-color maz-p-2 maz-elevation dark:maz-border dark:maz-border-color-light;

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
      @apply maz-cursor-pointer maz-whitespace-nowrap maz-rounded maz-px-4 maz-py-2 maz-text-start maz-outline-none maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-color-light hover:maz-bg-color-light;

      &.--is-keyboard-selected {
        @apply maz-bg-color-light;
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
          @apply maz-text-warning-600 hover:maz-text-warning-800;
        }

        &.--danger {
          @apply maz-text-danger-600 hover:maz-text-danger-800;
        }

        &.--success {
          @apply maz-text-success-600 hover:maz-text-success-800;
        }

        &.--white {
          @apply maz-text-white hover:maz-text-gray-300;
        }

        &.--black {
          @apply maz-text-black hover:maz-text-gray-800;
        }

        &.--theme {
          @apply maz-text-normal hover:maz-text-black dark:hover:maz-text-white;
        }
      }
    }
  }
}
</style>
