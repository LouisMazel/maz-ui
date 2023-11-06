<template>
  <div :id="instanceId" class="m-dropdown">
    <MazBtn
      :color="color"
      size="md"
      :aria-expanded="dropdownOpen"
      aria-haspopup="menu"
      :disabled="disabled"
      v-bind="$attrs"
      @click.stop="['click'].includes(trigger) ? toggleDropdown() : undefined"
      @focus="['hover', 'both'].includes(trigger) ? setDropdown(true) : undefined"
      @blur="setDropdownDebounced(false)"
      @keydown="keyboardOpenDropdown"
      @mouseenter="
        ['hover', 'both'].includes(trigger)
          ? dropdownOpen === false
            ? setDropdown(true)
            : setDropdownDebounced(true)
          : undefined
      "
      @mouseleave="['hover', 'both'].includes(trigger) ? setDropdownDebounced(false) : undefined"
    >
      <!-- @slot Menu Label -->
      <slot></slot>
    </MazBtn>

    <Transition name="maz-scale-fade">
      <div
        v-if="dropdownOpen"
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
        <template v-for="(item, index) in items">
          <!--
            @slot Custom menu item
              @binding {Object} item - menu item
          -->
          <slot name="menuitem" :item="item">
            <Component
              :is="item.to ? 'router-link' : item.action ? 'button' : 'a'"
              :key="index"
              :href="item.href"
              tabindex="-1"
              :target="item.href ? item.target ?? '_self' : undefined"
              :type="item.action ? 'button' : undefined"
              :class="[
                {
                  '--is-keyboard-selected': keyboardSelectedIndex === index,
                },
                item.class,
              ]"
              :to="item.to"
              class="menuitem"
              @click.stop="item.action ? runAction(item, $event) : closeOnClick()"
            >
              <!--
                @slot Custom menu item label
                  @binding {Object} item - menu item
              -->
              <slot name="menuitem-label" :item="item">
                {{ item.label }}
              </slot>
            </Component>
          </slot>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, getCurrentInstance } from 'vue'
  import MazBtn, { type Color } from './MazBtn.vue'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
  import { type RouteLocationRaw } from 'vue-router'
  import { debounce } from '../modules/helpers/debounce'
  import { type Position } from './types'

  export type { Color, Position }

  export type MenuItem = {
    label: string
    action?: () => unknown
    target?: string
    href?: string
    to?: RouteLocationRaw
    class?: string
  } & Record<string, unknown>

  const props = withDefaults(
    defineProps<{
      /** Menu items */
      items: MenuItem[]
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
    }>(),
    {
      id: 'maz-dropdown',
      trigger: 'both',
      color: 'transparent',
      position: 'bottom left',
    },
  )

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
    componentName: 'MazCheckbox',
    instance: getCurrentInstance(),
    providedId: props.id,
  })

  const dropdownOpen = ref(props.open)
  const keyboardSelectedIndex = ref<number>()

  function toggleDropdown() {
    setDropdown(!dropdownOpen.value)
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

    closeOnClick()
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

    .menu {
      @apply maz-absolute maz-z-default-backdrop maz-flex maz-flex-col maz-gap-0.5 maz-overflow-auto maz-rounded maz-bg-color maz-p-2 maz-elevation dark:maz-border dark:maz-border-color-light;

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
