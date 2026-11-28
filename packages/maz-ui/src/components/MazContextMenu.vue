<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { MazColor, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, shallowRef, useTemplateRef, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useRovingFocus } from '../composables/useRovingFocus.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import MazBtn from './MazBtn.vue'
import MazPopover from './MazPopover.vue'

export interface MazContextMenuItem {
  /** The text of the item */
  label?: string
  /** Icon at the start of the item: a name, a component or a `MazIconProps` object */
  icon?: MazIconLike
  /** A keyboard shortcut shown at the end of the item, as it is displayed (`⌘D`) */
  shortcut?: string
  /** Called when the item is chosen. `onClick` is the same, to reuse the items of `MazDropdown` */
  action?: () => unknown
  onClick?: () => unknown
  /** Route to go to, with the router of the app */
  to?: RouteLocationRaw
  /** URL to go to */
  href?: string
  /** Target of the link (`_blank`...) */
  target?: string
  /** The item can not be chosen */
  disabled?: boolean
  /** Color of the text, `destructive` for a dangerous action */
  color?: MazColor
  /** A line between two groups of items, the other keys are ignored */
  separator?: boolean
  /** CSS classes of the item */
  class?: HTMLAttributes['class']
}

export interface MazContextMenuProps {
  /**
   * The items of the menu
   * @default []
   */
  items?: MazContextMenuItem[]
  /**
   * Accessible name of the menu
   * @default 'Context menu'
   */
  label?: string
  /**
   * Size of the items
   * @values mini, xs, sm, md, lg, xl
   * @default sm
   */
  itemsSize?: MazSize
  /**
   * Opens the menu with a long press on touch screens
   * @default true
   */
  longPress?: boolean
  /**
   * The native menu of the browser stays available
   * @default false
   */
  disabled?: boolean
  /**
   * A highlight slides between the items under the pointer (never with the keyboard)
   * @default true
   */
  animated?: boolean
  /**
   * CSS classes of the menu panel
   */
  menuPanelClass?: HTMLAttributes['class']
  /**
   * Id of the menu
   */
  id?: string
}

defineOptions({
  name: 'MazContextMenu',
})

const {
  items = [],
  label,
  itemsSize = 'sm',
  longPress = true,
  disabled = false,
  animated = true,
  menuPanelClass,
  id,
} = defineProps<MazContextMenuProps>()

const emits = defineEmits<{
  /**
   * Emitted when an item is chosen
   * @property {MazContextMenuItem} item the chosen item
   */
  select: [item: MazContextMenuItem]
  /** Emitted when the menu opens */
  open: []
  /** Emitted when the menu closes */
  close: []
}>()

defineSlots<{
  /** The zone that opens the menu */
  default?: () => unknown
  /**
   * Replaces an item
   * @binding {MazContextMenuItem} item the item
   * @binding {() => void} close closes the menu
   */
  item?: (props: { item: MazContextMenuItem, close: () => void }) => unknown
}>()

/**
 * Open state of the menu
 * @model
 */
const isOpen = defineModel<boolean>({ default: false })

const LONG_PRESS_DELAY = 500
const LONG_PRESS_TOLERANCE = 10
const NATIVE_EVENT_GRACE = 500

const { t } = useTranslations()
const instanceId = useInstanceUniqId({ componentName: 'MazContextMenu', providedId: id })

const menuLabel = computed(() => label ?? t('contextMenu.label'))
const labelId = computed(() => `${instanceId.value}-label`)

const point = shallowRef({ x: 0, y: 0 })
const menuRef = useTemplateRef<HTMLElement>('menu')
const zoneRef = useTemplateRef<HTMLElement>('zone')
const hoveredItem = shallowRef<HTMLElement>()

let returnFocusTo: HTMLElement | null = null
let openedByKeyboardAt = Number.NEGATIVE_INFINITY
let pressTimer: ReturnType<typeof setTimeout> | undefined
let pressOrigin: { x: number, y: number } | undefined
let ignoreNextClick = false

function getMenuItems() {
  return [...menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []]
}

const { onKeydown: onRovingKeydown, focusItem, currentIndex } = useRovingFocus({
  items: getMenuItems,
  container: menuRef,
  orientation: 'vertical',
  typeahead: true,
})

const { style: highlightStyle } = useSlidingIndicator({
  container: menuRef,
  active: hoveredItem,
  orientation: 'vertical',
  animated,
})

function cancelPress() {
  clearTimeout(pressTimer)
  pressTimer = undefined
  pressOrigin = undefined
}

function openAt(x: number, y: number, byKeyboard = false) {
  if (disabled)
    return

  cancelPress()

  if (!isOpen.value)
    returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null

  point.value = { x, y }

  if (byKeyboard)
    openedByKeyboardAt = Date.now()

  isOpen.value = true

  void focusMenu(byKeyboard)
}

async function focusMenu(firstItem: boolean) {
  await nextTick()
  await nextTick()

  currentIndex.value = 0

  if (firstItem && getMenuItems().length > 0)
    focusItem(getMenuItems().findIndex(item => !item.hasAttribute('disabled')))
  else
    menuRef.value?.focus({ preventScroll: true })
}

function close() {
  isOpen.value = false
}

function onContextmenu(event: MouseEvent) {
  if (disabled)
    return

  event.preventDefault()

  if (Date.now() - openedByKeyboardAt < NATIVE_EVENT_GRACE)
    return

  // A new right click moves the open menu to the new point
  openAt(event.clientX, event.clientY)
}

function onZoneKeydown(event: KeyboardEvent) {
  if (disabled || (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)))
    return

  event.preventDefault()

  const target = event.target instanceof HTMLElement ? event.target : (event.currentTarget as HTMLElement)
  const rect = target.getBoundingClientRect()

  openAt(rect.left + Math.min(rect.width / 2, 48), rect.top + rect.height / 2, true)
}

function onPointerdown(event: PointerEvent) {
  if (disabled || !longPress || event.pointerType === 'mouse')
    return

  cancelPress()
  pressOrigin = { x: event.clientX, y: event.clientY }
  pressTimer = setTimeout(() => {
    ignoreNextClick = true
    openAt(pressOrigin!.x, pressOrigin!.y)
  }, LONG_PRESS_DELAY)
}

function onPointermove(event: PointerEvent) {
  if (!pressOrigin)
    return

  if (Math.hypot(event.clientX - pressOrigin.x, event.clientY - pressOrigin.y) > LONG_PRESS_TOLERANCE)
    cancelPress()
}

function onClickCapture(event: MouseEvent) {
  if (!ignoreNextClick)
    return

  ignoreNextClick = false
  event.preventDefault()
  event.stopPropagation()
}

async function runItem(item: MazContextMenuItem) {
  emits('select', item)
  close()
  await (item.action ?? item.onClick)?.()
}

function onMenuKeydown(event: KeyboardEvent) {
  const { key } = event
  const isContainer = event.target === menuRef.value
  const items = getMenuItems()

  if (key === 'Tab') {
    event.preventDefault()
    close()
    return
  }

  if (key === 'Enter' || key === ' ') {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]')

    if (item) {
      event.preventDefault()
      item.click()
    }

    return
  }

  hoveredItem.value = undefined

  if (isContainer && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
    event.preventDefault()

    const goesFirst = key === 'ArrowDown' || key === 'Home'

    focusItem(goesFirst ? 0 : items.length - 1)
    return
  }

  onRovingKeydown(event)
}

function onMenuPointerOver(event: PointerEvent) {
  if (event.pointerType === 'touch')
    return

  const item = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]:not(:disabled, [aria-disabled="true"])')

  hoveredItem.value = item && menuRef.value?.contains(item) ? item : undefined
}

watch(isOpen, (value) => {
  if (value) {
    emits('open')
    return
  }

  hoveredItem.value = undefined
  cancelPress()
  emits('close')

  const hadFocus = !!menuRef.value?.contains(document.activeElement) || document.activeElement === document.body

  if (hadFocus && returnFocusTo?.isConnected)
    returnFocusTo.focus({ preventScroll: true })
})

// The popover is manual: the click outside of the menu is handled here
function onDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node

  // A right click in the zone moves the menu (`contextmenu`), anywhere else it closes it
  if (menuRef.value?.contains(target) || (event.button === 2 && zoneRef.value?.contains(target)))
    return

  close()
}

watch(isOpen, (open) => {
  if (open)
    document.addEventListener('pointerdown', onDocumentPointerdown, true)
  else
    document.removeEventListener('pointerdown', onDocumentPointerdown, true)
})

onBeforeUnmount(() => {
  cancelPress()
  document.removeEventListener('pointerdown', onDocumentPointerdown, true)
})

defineExpose({
  /**
   * Opens the menu at a point of the screen
   * @param x horizontal position, in pixels from the left of the viewport
   * @param y vertical position, in pixels from the top of the viewport
   */
  openAt: (x: number, y: number) => openAt(x, y),
  /** Closes the menu */
  close,
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="zone"
    class="m-context-menu"
    :class="{ '--long-press': longPress && !disabled }"
    @contextmenu="onContextmenu"
    @keydown="onZoneKeydown"
    @pointerdown="onPointerdown"
    @pointermove="onPointermove"
    @pointerup="cancelPress"
    @pointercancel="cancelPress"
    @click.capture="onClickCapture"
  >
    <!-- @slot The zone that opens the menu -->
    <slot />

    <MazPopover
      v-model="isOpen"
      trigger="manual"
      role="menu"
      position="bottom-start"
      transition="scale-fade"
      :offset="0"
      :position-reference="point"
      :aria-labelledby="labelId"
      :trap-focus="false"
      :panel-class="['m-context-menu-panel', menuPanelClass]"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
      <div
        ref="menu"
        role="none"
        tabindex="-1"
        class="m-context-menu__menu maz:relative maz:flex maz:max-h-[calc(100dvh-1rem)] maz:min-w-48 maz:scrollbar-themed maz:flex-col maz:gap-(--maz-menu-gap,0.25rem) maz:overflow-auto maz:p-(--maz-menu-padding,0.5rem) maz:outline-hidden"
        @keydown="onMenuKeydown"
        @keyup.space.prevent
        @pointerover="onMenuPointerOver"
        @pointerleave="hoveredItem = undefined"
      >
        <span :id="labelId" class="maz:sr-only" aria-hidden="true">{{ menuLabel }}</span>
        <span
          v-if="hoveredItem"
          aria-hidden="true"
          class="m-context-menu__highlight maz:pointer-events-none maz:absolute maz:inset-s-0 maz:top-0 maz:rounded-md maz:bg-foreground/6"
          :style="highlightStyle"
        />
        <template v-for="(item, index) in items" :key="index">
          <div v-if="item.separator" role="separator" class="m-context-menu__separator maz:mx-1 maz:my-0.5 maz:h-px maz:bg-divider" />
          <!--
            @slot Replaces an item
            @binding {MazContextMenuItem} item the item
            @binding {() => void} close closes the menu
          -->
          <slot v-else name="item" :item :close>
            <MazBtn
              role="menuitem"
              tabindex="-1"
              justify="start"
              color="transparent"
              class="m-context-menu__item maz:relative"
              :class="[item.class, item.color && `--text-${item.color}`]"
              :size="itemsSize"
              :disabled="item.disabled"
              :start-icon="item.icon"
              :to="item.to"
              :href="item.href"
              :target="item.target"
              @click.stop="runItem(item)"
            >
              <span class="maz:flex maz:w-full maz:items-center maz:gap-6">
                <span>{{ item.label }}</span>
                <kbd v-if="item.shortcut" dir="ltr" class="m-context-menu__kbd">{{ item.shortcut }}</kbd>
              </span>
            </MazBtn>
          </slot>
        </template>
      </div>
    </MazPopover>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-context-menu.--long-press :deep(*) {
  -webkit-touch-callout: none;
}

.m-context-menu__menu {
  --maz-focus-ring-offset: -2px;
}

.m-context-menu__item {
  @apply maz:text-start maz:whitespace-nowrap;

  &.--transparent:disabled:not(.--loading) {
    background-color: transparent;
    border-color: transparent;
    opacity: 0.5;
  }

  &.--transparent:not(:disabled):hover {
    background-color: transparent;
  }

  &.--transparent:not(:disabled):focus-visible {
    background-color: color-mix(in oklab, var(--maz-foreground) 6%, transparent);
  }

  &.--text-destructive {
    @apply maz:text-destructive-600 maz:dark:text-destructive-400;
  }
}

.m-context-menu__kbd {
  margin-inline-start: auto;
  font-family: inherit;
  font-size: 0.85em;
  opacity: 0.6;
  white-space: nowrap;
}
</style>
