<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import { MazChevronDown } from '@maz-ui/icons/raw/MazChevronDown'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, useSlots, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { getFocusableElements } from '../utils/focusable.ts'
import MazIcon from './MazIcon.vue'
import MazLink from './MazLink.vue'

export interface MazNavigationMenuLink {
  /**
   * Text of the link
   */
  label: string
  /**
   * Short text under the label
   */
  description?: string
  /**
   * Route of the link (vue-router or Nuxt)
   */
  to?: RouteLocationRaw
  /**
   * URL of the link, for a plain link
   */
  href?: string
  /**
   * Icon shown before the label
   */
  icon?: MazIconLike
}

export interface MazNavigationMenuItem {
  /**
   * Identifier of the item, used by `v-model` and by the `content-<value>` slot. The index when missing
   */
  value?: string
  /**
   * Text of the item
   */
  label: string
  /**
   * Route of the item when it has no panel
   */
  to?: RouteLocationRaw
  /**
   * URL of the item when it has no panel
   */
  href?: string
  /**
   * Links of the panel of the item. Use the `content` slot for any other content
   */
  items?: MazNavigationMenuLink[]
  /**
   * The item opens a panel filled by the `content` or `content-<value>` slot
   * @default false
   */
  panel?: boolean
  /**
   * Disables the item
   * @default false
   */
  disabled?: boolean
}

export interface MazNavigationMenuProps {
  /**
   * The top level items: links, or buttons that open the shared panel
   */
  items: MazNavigationMenuItem[]
  /**
   * Accessible name of the navigation landmark
   * @default 'Main navigation'
   */
  label?: string
  /**
   * Delay in milliseconds before the panel opens when the pointer enters an item
   * @default 100
   */
  openDelay?: number
  /**
   * Delay in milliseconds before the panel closes when the pointer leaves the menu
   * @default 200
   */
  closeDelay?: number
}

const {
  items,
  label,
  openDelay = 100,
  closeDelay = 200,
} = defineProps<MazNavigationMenuProps>()

const emits = defineEmits<{
  /**
   * Emitted when a panel opens or closes
   * @property {string | undefined} value - The `value` of the open item, `undefined` when closed
   */
  'update:model-value': [value: string | undefined]
}>()

defineSlots<{
  /**
   * Content of the panel of an item (any item that has `panel`), also available as `content-<value>` for one item
   * @binding {MazNavigationMenuItem} item - The open item
   * @binding {Function} close - Closes the panel
   */
  content?: (props: { item: MazNavigationMenuItem, close: () => void }) => any
  /**
   * Replaces the label of an item
   * @binding {MazNavigationMenuItem} item - The item
   * @binding {boolean} open - `true` when its panel is open
   */
  item?: (props: { item: MazNavigationMenuItem, open: boolean }) => any
  /**
   * Content of the panel of one item, named after its `id` (`content-products`)
   * @binding {MazNavigationMenuItem} item - The open item
   * @binding {Function} close - Closes the panel
   */
  [key: `content-${string}`]: ((props: { item: MazNavigationMenuItem, close: () => void }) => any) | undefined
}>()

const { t } = useTranslations()

const slots = useSlots()

function hasContentSlot(id: string) {
  return `content-${id}` in slots
}

const activeId = defineModel<string | undefined>({ default: undefined })

const { shouldReduceMotion } = useReducedMotion()

const panelId = useId()
const navRef = useTemplateRef<HTMLElement>('nav')
const listRef = useTemplateRef<HTMLElement>('list')
const viewportRef = useTemplateRef<HTMLElement>('viewport')
const panelRef = useTemplateRef<HTMLElement>('panel')

const itemElements = ref<HTMLElement[]>([])
const hoveredElement = shallowRef<HTMLElement>()
const isPillVisible = ref(false)
const isGliding = ref(false)
const renderedId = ref<string | undefined>(activeId.value)
const direction = ref<'forward' | 'backward' | 'none'>('none')
const size = ref({ width: 0, height: 0 })
const offset = ref(0)

let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let isOpenedByHover = false

const normalizedItems = computed(() => items.map((item, index) => ({
  ...item,
  id: item.value ?? String(index),
  hasPanel: !!item.items?.length || !!item.panel,
})))

const activeItem = computed(() => normalizedItems.value.find(item => item.id === activeId.value))
const renderedItem = computed(() => normalizedItems.value.find(item => item.id === renderedId.value))
const isOpen = computed(() => !!activeItem.value)

function triggerId(id: string) {
  return `${panelId}-trigger-${id}`
}

const { style: pillStyle } = useSlidingIndicator({
  container: listRef,
  active: hoveredElement,
  stretch: true,
})

function clearTimers() {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
}

function indexOfId(id: string | undefined) {
  return normalizedItems.value.findIndex(item => item.id === id)
}

function setActive(id: string | undefined) {
  if (id === activeId.value)
    return

  if (id) {
    const previous = indexOfId(activeId.value)

    direction.value = previous === -1
      ? 'none'
      : indexOfId(id) > previous
        ? 'forward'
        : 'backward'
  }

  activeId.value = id
  emits('update:model-value', id)
}

function close() {
  clearTimers()
  isOpenedByHover = false
  setActive(undefined)
}

function focusTrigger(id: string | undefined) {
  if (!id)
    return

  navRef.value?.querySelector<HTMLElement>(`[id="${triggerId(id)}"]`)?.focus()
}

function open(id: string, byHover: boolean) {
  clearTimers()
  isOpenedByHover = byHover
  setActive(id)
}

function onItemEnter(event: PointerEvent, index: number) {
  hoveredElement.value = itemElements.value[index]
  isPillVisible.value = true

  if (event.pointerType === 'touch')
    return

  clearTimeout(closeTimer)
  clearTimeout(openTimer)

  const item = normalizedItems.value[index]!

  if (item.disabled)
    return

  if (!item.hasPanel) {
    if (isOpen.value && isOpenedByHover)
      close()
    return
  }

  if (isOpen.value)
    open(item.id, isOpenedByHover)
  else
    openTimer = setTimeout(open, openDelay, item.id, true)
}

function onNavEnter() {
  clearTimeout(closeTimer)
}

function onNavLeave(event: PointerEvent) {
  if (event.pointerType === 'touch')
    return

  clearTimeout(openTimer)

  if (!isOpen.value) {
    isPillVisible.value = false
    return
  }

  if (isOpenedByHover)
    closeTimer = setTimeout(close, closeDelay)
}

function onListLeave() {
  if (!isOpen.value) {
    isPillVisible.value = false
    return
  }

  hoveredElement.value = itemElements.value[indexOfId(activeId.value)]
}

function onTriggerClick(id: string) {
  if (activeId.value === id && !isOpenedByHover)
    close()
  else
    open(id, false)
}

function onFocusin(index: number) {
  hoveredElement.value = itemElements.value[index]
  isPillVisible.value = true
}

function onFocusout(event: FocusEvent) {
  const next = event.relatedTarget as Node | null

  if (next && navRef.value?.contains(next))
    return

  isPillVisible.value = false

  if (isOpen.value)
    close()
}

function getTopLevelControls() {
  return itemElements.value
    .map(element => element?.querySelector<HTMLElement>('a, button'))
    .filter((element): element is HTMLElement => !!element && !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true')
}

async function focusFirstLink() {
  await nextTick()
  getFocusableElements(panelRef.value)[0]?.focus()
}

function onTriggerKeydown(event: KeyboardEvent, index: number) {
  const item = normalizedItems.value[index]!
  const isRtl = getComputedStyle(navRef.value!).direction === 'rtl'
  const forward = isRtl
    ? 'ArrowLeft'
    : 'ArrowRight'
  const backward = isRtl
    ? 'ArrowRight'
    : 'ArrowLeft'

  if (event.key === 'ArrowDown' && item.hasPanel) {
    event.preventDefault()
    open(item.id, false)
    focusFirstLink()
  }
  else if (event.key === 'Tab' && !event.shiftKey && item.hasPanel && activeId.value === item.id) {
    const first = getFocusableElements(panelRef.value)[0]

    if (first) {
      event.preventDefault()
      first.focus()
    }
  }
  else if (event.key === forward || event.key === backward) {
    const controls = getTopLevelControls()
    const current = controls.indexOf(event.currentTarget as HTMLElement)
    const step = event.key === forward
      ? 1
      : -1
    const target = controls[(current + step + controls.length) % controls.length]

    if (target) {
      event.preventDefault()
      target.focus()
    }
  }
}

function onPanelKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab')
    return

  const focusable = getFocusableElements(panelRef.value)
  const active = document.activeElement

  if (event.shiftKey && active === focusable[0]) {
    event.preventDefault()
    focusTrigger(activeId.value)
  }
  else if (!event.shiftKey && active === focusable.at(-1)) {
    const controls = getTopLevelControls()
    const trigger = navRef.value?.querySelector<HTMLElement>(`[id="${triggerId(activeId.value!)}"]`)
    const next = controls[controls.indexOf(trigger!) + 1]

    if (next) {
      event.preventDefault()
      next.focus()
      close()
    }
  }
}

function onNavKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isOpen.value)
    return

  event.preventDefault()
  event.stopPropagation()

  const id = activeId.value
  const isInsidePanel = !!panelRef.value?.contains(document.activeElement)

  close()

  if (isInsidePanel)
    focusTrigger(id)
}

function onDocumentPointerdown(event: PointerEvent) {
  if (!navRef.value?.contains(event.target as Node))
    close()
}

function measure() {
  const content = viewportRef.value?.querySelector<HTMLElement>(`[data-content="${renderedId.value}"]`)
  const nav = navRef.value
  const trigger = itemElements.value[indexOfId(renderedId.value)]

  if (!content || !nav || !trigger)
    return

  const width = content.offsetWidth
  const height = content.offsetHeight
  const navRect = nav.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()
  const center = triggerRect.left - navRect.left + triggerRect.width / 2

  size.value = { width, height }
  offset.value = Math.max(0, Math.min(center - width / 2, navRect.width - width))
}

async function reveal(wasOpen: boolean) {
  const animate = wasOpen && !shouldReduceMotion.value

  isGliding.value = animate
  renderedId.value = activeId.value

  await nextTick()
  measure()

  if (animate)
    return

  await nextTick()
  viewportRef.value?.getBoundingClientRect()
  isGliding.value = !shouldReduceMotion.value
}

watch(activeId, (id, previous) => {
  if (id) {
    document.addEventListener('pointerdown', onDocumentPointerdown)
    reveal(!!previous)
  }
  else {
    document.removeEventListener('pointerdown', onDocumentPointerdown)
  }
}, { flush: 'post' })

useResizeObserver(
  () => viewportRef.value?.querySelector<HTMLElement>(`[data-content="${renderedId.value}"]`),
  measure,
)
useResizeObserver(navRef, measure)

onBeforeUnmount(() => {
  clearTimers()
  document.removeEventListener('pointerdown', onDocumentPointerdown)
})

function setItemElement(element: unknown, index: number) {
  if (element)
    itemElements.value[index] = element as HTMLElement
}

const viewportStyle = computed(() => ({
  left: '0px',
  transform: `translateX(${offset.value}px)`,
}))

const panelStyle = computed(() => ({
  width: `${size.value.width}px`,
  height: `${size.value.height}px`,
}))

defineExpose({
  /** Closes the panel */
  close,
})
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
  <nav
    ref="nav"
    class="m-navigation-menu m-reset-css maz:relative"
    :aria-label="label ?? t('navigationMenu.label')"
    @pointerenter="onNavEnter"
    @pointerleave="onNavLeave"
    @focusout="onFocusout"
    @keydown="onNavKeydown"
  >
    <div ref="list" class="maz:relative maz:inline-block" @pointerleave="onListLeave">
      <span
        class="m-navigation-menu__pill maz:pointer-events-none maz:absolute maz:start-0 maz:top-0"
        aria-hidden="true"
        :style="pillStyle"
      >
        <span
          class="m-navigation-menu__pill-fill maz:block maz:size-full maz:rounded-lg maz:bg-foreground/10"
          :class="isPillVisible ? 'maz:opacity-100' : 'maz:opacity-0'"
        />
      </span>

      <ul class="maz:m-0 maz:flex maz:list-none maz:items-center maz:gap-1 maz:p-0">
        <li
          v-for="(item, index) in normalizedItems"
          :key="item.id"
          :ref="element => setItemElement(element, index)"
          class="maz:relative maz:z-1"
          @pointerenter="onItemEnter($event, index)"
          @focusin="onFocusin(index)"
        >
          <button
            v-if="item.hasPanel"
            :id="triggerId(item.id)"
            type="button"
            class="m-navigation-menu__trigger maz:focus-ring maz:inline-flex maz:cursor-pointer maz:items-center maz:gap-1 maz:rounded-lg maz:px-3 maz:py-2 maz:text-body-sm maz:font-medium maz:text-foreground maz:disabled:disabled-state"
            :disabled="item.disabled"
            :aria-expanded="activeId === item.id"
            :aria-controls="panelId"
            @click="onTriggerClick(item.id)"
            @keydown="onTriggerKeydown($event, index)"
          >
            <!--
              @slot item - Replaces the label of an item
                @binding {MazNavigationMenuItem} item - The item
                @binding {boolean} open - `true` when its panel is open
            -->
            <slot name="item" :item="item" :open="activeId === item.id">
              {{ item.label }}
            </slot>
            <MazIcon
              :icon="MazChevronDown"
              class="m-navigation-menu__chevron maz:size-4 maz:text-muted"
              :class="{ '--open': activeId === item.id }"
            />
          </button>
          <MazLink
            v-else
            :to="item.to"
            :href="item.href"
            :disabled="item.disabled"
            color="inherit"
            class="m-navigation-menu__link maz:focus-ring maz:rounded-lg maz:px-3 maz:py-2 maz:text-body-sm maz:font-medium maz:text-foreground"
            @keydown="onTriggerKeydown($event, index)"
          >
            <slot name="item" :item="item" :open="false">
              {{ item.label }}
            </slot>
          </MazLink>
        </li>
      </ul>
    </div>

    <div
      ref="viewport"
      class="m-navigation-menu__viewport maz:absolute maz:top-full maz:z-default-backdrop maz:pt-2"
      :class="{ '--open': isOpen, '--glide': isGliding, '--reduced': shouldReduceMotion }"
      :style="viewportStyle"
    >
      <div
        :id="panelId"
        ref="panel"
        role="group"
        :aria-labelledby="renderedId ? triggerId(renderedId) : undefined"
        class="m-navigation-menu__panel maz:relative maz:overflow-hidden maz:rounded-xl maz:border maz:border-divider maz:bg-container maz:text-foreground maz:shadow-elevation"
        :class="`--${direction}`"
        :style="panelStyle"
        @keydown="onPanelKeydown"
      >
        <Transition :name="`m-navigation-menu-${direction}`">
          <div
            v-if="renderedItem"
            :key="renderedItem.id"
            :data-content="renderedItem.id"
            class="m-navigation-menu__content maz:absolute maz:top-0 maz:start-0 maz:w-max maz:max-w-[min(40rem,calc(100vw-2rem))]"
          >
            <!--
              @slot content - Content of the panel of an item (also `content-<value>` for one item)
                @binding {MazNavigationMenuItem} item - The open item
                @binding {Function} close - Closes the panel
            -->
            <slot
              v-if="hasContentSlot(renderedItem.id)"
              :name="`content-${renderedItem.id}`"
              :item="renderedItem"
              :close="close"
            />
            <slot v-else-if="renderedItem.panel" name="content" :item="renderedItem" :close="close" />
            <ul v-else class="maz:m-0 maz:grid maz:min-w-72 maz:list-none maz:gap-1 maz:p-2">
              <li v-for="link in renderedItem.items" :key="link.label">
                <MazLink
                  :to="link.to"
                  :href="link.href"
                  color="inherit"
                  class="maz:focus-ring maz:flex! maz:items-start maz:gap-3 maz:rounded-lg maz:p-3 maz:no-underline maz:hover:bg-foreground/5"
                  @click="close"
                >
                  <MazIcon v-if="link.icon" :icon="link.icon" class="maz:mt-0.5 maz:size-5 maz:shrink-0 maz:text-primary" />
                  <span class="maz:flex maz:flex-col">
                    <span class="maz:text-body-sm maz:font-medium maz:text-foreground">{{ link.label }}</span>
                    <span v-if="link.description" class="maz:text-caption maz:text-muted">{{ link.description }}</span>
                  </span>
                </MazLink>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-navigation-menu {
  --m-nav-duration: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));
  --m-nav-glide: calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1));
}

.m-navigation-menu__pill-fill {
  transition: opacity var(--m-nav-duration) var(--maz-easing-out, ease-out);
}

.m-navigation-menu__chevron {
  transition: transform var(--m-nav-duration) var(--maz-easing-out, ease-out);

  &.--open {
    transform: rotate(180deg);
  }
}

.m-navigation-menu__viewport {
  visibility: hidden;
  pointer-events: none;

  &.--open {
    visibility: visible;
    pointer-events: auto;
  }

  &.--glide {
    transition: transform var(--m-nav-glide) var(--maz-easing-out, ease-out);
  }
}

.m-navigation-menu__panel {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
  transform-origin: top center;
  transition:
    opacity var(--m-nav-duration) var(--maz-easing-out, ease-out),
    transform var(--m-nav-duration) var(--maz-easing-out, ease-out);
}

.m-navigation-menu__viewport.--open .m-navigation-menu__panel {
  opacity: 1;
  transform: none;
}

.m-navigation-menu__viewport.--glide .m-navigation-menu__panel {
  transition:
    opacity var(--m-nav-duration) var(--maz-easing-out, ease-out),
    transform var(--m-nav-duration) var(--maz-easing-out, ease-out),
    inline-size var(--m-nav-glide) var(--maz-easing-out, ease-out),
    block-size var(--m-nav-glide) var(--maz-easing-out, ease-out);
}

.m-navigation-menu__viewport.--reduced .m-navigation-menu__panel {
  transform: none;
  transition: opacity var(--m-nav-duration) linear;
}

.m-navigation-menu-forward-enter-active,
.m-navigation-menu-forward-leave-active,
.m-navigation-menu-backward-enter-active,
.m-navigation-menu-backward-leave-active {
  transition:
    opacity var(--m-nav-duration) var(--maz-easing-out, ease-out),
    transform var(--m-nav-glide) var(--maz-easing-out, ease-out);
}

.m-navigation-menu-forward-enter-active,
.m-navigation-menu-backward-enter-active {
  z-index: 1;
}

.m-navigation-menu-forward-leave-active,
.m-navigation-menu-backward-leave-active {
  transition:
    opacity calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    transform var(--m-nav-glide) var(--maz-easing-out, ease-out);
}

.m-navigation-menu-forward-enter-from,
.m-navigation-menu-backward-leave-to {
  opacity: 0;
  transform: translateX(1.5rem);
}

.m-navigation-menu-forward-leave-to,
.m-navigation-menu-backward-enter-from {
  opacity: 0;
  transform: translateX(-1.5rem);
}

[dir='rtl'] {
  .m-navigation-menu-forward-enter-from,
  .m-navigation-menu-backward-leave-to {
    transform: translateX(-1.5rem);
  }

  .m-navigation-menu-forward-leave-to,
  .m-navigation-menu-backward-enter-from {
    transform: translateX(1.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-navigation-menu-forward-enter-from,
  .m-navigation-menu-forward-leave-to,
  .m-navigation-menu-backward-enter-from,
  .m-navigation-menu-backward-leave-to {
    transform: none;
  }
}
</style>
