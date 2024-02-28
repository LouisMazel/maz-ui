<template>
  <div
    :id="instanceId"
    v-click-outside="onClickOutside"
    class="m-dropdown"
    :style="style"
    :class="[props.class]"
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
      <span :id="`${instanceId}-labelspan`" class="maz-sr-only">
        <slot name="screen-reader-description">
          {{ screenReaderDescription }}
        </slot>
      </span>
      <!--
        @slot Custom Element
          @binding {Boolen} is-open close function
          @default `<MazBtn />`
      -->
      <slot name="element" :is-open="dropdownOpen">
        <MazBtn
          :color="color"
          :disabled="disabled"
          :aria-labelledby="`${instanceId}-labelspan`"
          v-bind="$attrs"
          tabindex="-1"
        >
          <span class="button-span">
            <!-- @slot Button text -->
            <slot></slot>

            <ChevronDownIcon
              v-if="!noChevron"
              :class="{ 'maz-rotate-180': dropdownOpen }"
              class="chevron-icon"
            />
          </span>
          <!-- @slot Menu Label -->
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
        :class="{
          '--top': position.includes('top'),
          '--left': position.includes('left'),
          '--right': position.includes('right'),
          '--bottom': position.includes('bottom'),
        }"
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
                @binding {Object} item - menu item
            -->
            <slot name="menuitem" :item="item">
              <template v-if="item.to">
                <RouterLink
                  :target="item.href ? item.target ?? '_self' : undefined"
                  :to="item.to"
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
                  <slot name="menuitem-label" :item="item">
                    {{ item.label }}
                  </slot>
                </RouterLink>
              </template>
              <template v-else-if="item.href">
                <a
                  :target="item.href ? item.target ?? '_self' : undefined"
                  :href="item.href"
                  tabindex="-1"
                  class="menuitem"
                  :class="[
                    {
                      '--is-keyboard-selected': keyboardSelectedIndex === index,
                    },
                    item.class,
                  ]"
                  @click.stop="closeOnClick"
                >
                  <slot name="menuitem-label" :item="item">
                    {{ item.label }}
                  </slot>
                </a>
              </template>
              <template v-else-if="item.action">
                <button
                  tabindex="-1"
                  type="button"
                  class="menuitem"
                  :class="[
                    {
                      '--is-keyboard-selected': keyboardSelectedIndex === index,
                    },
                    item.class,
                  ]"
                  @click.stop="!!item.action ? runAction(item, $event) : closeOnClick()"
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

<script lang="ts" setup>
  import { ref, watch, getCurrentInstance, defineAsyncComponent, type HTMLAttributes } from 'vue'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { type RouteLocationRaw } from 'vue-router'
  import { debounce } from '../modules/helpers/debounce'
  import { vClickOutside } from '../modules/directives/click-outside'
  import { type Position } from './types'
  import { type Color } from './MazBtn.vue'

  const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
  const ChevronDownIcon = defineAsyncComponent(() => import('./../icons/chevron-down.svg'))

  export type { Color, Position }

  defineOptions({
    inheritAttrs: false,
  })

  export type MenuItem = {
    label: string
    action?: () => unknown
    target?: string
    href?: string
    to?: RouteLocationRaw
    class?: string
  } & Record<string, unknown>

  export type Props = {
    style?: HTMLAttributes['style']
    class?: HTMLAttributes['class']
    /** Menu items */
    items?: MenuItem[]
    /** Menu should be open? */
    open?: boolean
    /** id of the menu */
    id?: string
    /** Should open the dropdown on click, hover or both */
    trigger?: 'click' | 'hover' | 'both'
    /** Button color */
    color?: Color
    /** Position of the dropdown */
    position?: Position
    /** Disable close menu on menuitem clicked */
    noCloseOnClick?: boolean
    /** Disable menu */
    disabled?: boolean
    /** Remove chevron icon in main button */
    noChevron?: boolean
    /** Description read by screen reader (accessibility) */
    screenReaderDescription?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    class: undefined,
    style: undefined,
    items: () => [],
    id: undefined,
    trigger: 'both',
    color: 'transparent',
    position: 'bottom left',
    screenReaderDescription: 'Menu Dropdown',
  })

  const emits = defineEmits([
    /**
     * emitted when a menu item is clicked
     */
    'menuitem-clicked',
    /**
     * Triggers when the number changes
     *
     * @property {boolean} open new value
     */
    'update:open',
  ])

  const instanceId = useInstanceUniqId({
    componentName: 'MazDropdown',
    instance: getCurrentInstance(),
    providedId: props.id,
  })

  const dropdownOpen = ref(props.open)
  const keyboardSelectedIndex = ref<number>()

  function onClickOutside() {
    if (dropdownOpen.value) {
      setDropdown(false)
    }
  }

  function toggleDropdown() {
    setDropdown(!dropdownOpen.value)
  }

  function onElementClick() {
    if (['click'].includes(props.trigger)) toggleDropdown()
  }
  function onElementFocus() {
    if (['hover', 'both'].includes(props.trigger)) setDropdown(true)
  }
  function onElementMouseenter() {
    if (['hover', 'both'].includes(props.trigger)) {
      dropdownOpen.value === false ? setDropdown(true) : setDropdownDebounced(true)
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

  const setDropdown = (value: boolean) => {
    if (props.disabled) return

    dropdownOpen.value = value
    emits('update:open', value)
  }
  const setDropdownDebounced = debounce((value: boolean) => {
    setDropdown(value)
  }, 200)

  async function runAction(item: MenuItem, event: Event) {
    emits('menuitem-clicked', event)

    await item.action?.()

    if (!props.noCloseOnClick) {
      closeOnClick()
    }
  }

  function closeOnClick() {
    if (props.noCloseOnClick === false) setDropdown(false)
  }

  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setDropdown(false)
    } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      arrowHandler(event)
    } else if (event.key === 'Enter' && typeof keyboardSelectedIndex.value === 'number') {
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

    if (!dropdownOpen.value) setDropdown(true)

    const itemLength = props.items?.length

    if (!itemLength) return

    if (typeof keyboardSelectedIndex.value === 'number') {
      if (keyboardSelectedIndex.value === itemLength - 1 && code === 'ArrowDown') {
        keyboardSelectedIndex.value = 0
      } else if (keyboardSelectedIndex.value === 0 && code === 'ArrowUp') {
        keyboardSelectedIndex.value = itemLength - 1
      } else {
        keyboardSelectedIndex.value =
          code === 'ArrowDown' ? keyboardSelectedIndex.value + 1 : keyboardSelectedIndex.value - 1
      }
    } else {
      keyboardSelectedIndex.value = code === 'ArrowDown' ? 0 : itemLength - 1
    }
  }

  watch(
    () => dropdownOpen.value,
    (value) => {
      if (value) {
        document.addEventListener('keydown', keydownHandler)
      } else {
        document.removeEventListener('keydown', keydownHandler)
      }

      keyboardSelectedIndex.value = undefined
    },
  )
  watch(
    () => props.open,
    (value) => setDropdown(value),
  )
</script>

<style lang="postcss">
  .m-dropdown {
    @apply maz-relative maz-inline-flex maz-flex-col maz-items-start;

    & [aria-expanded='true'].m-btn {
      @apply maz-bg-color-light;
    }

    &__wrapper {
      @apply maz-h-full maz-w-full maz-outline-none;
    }

    .chevron-icon {
      @apply maz-text-lg maz-transition-transform maz-duration-200 maz-ease-in-out;
    }

    .button-span {
      @apply maz-flex maz-items-center maz-gap-2;
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
        @apply maz-cursor-pointer maz-whitespace-nowrap maz-rounded maz-px-4 maz-py-2 maz-text-left maz-outline-none maz-transition-colors maz-duration-300 maz-ease-in-out focus-within:maz-bg-color-light hover:maz-bg-color-light;

        &.--is-keyboard-selected {
          @apply maz-bg-color-light;
        }
      }
    }
  }
</style>
