<script lang="ts">
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type MazSidebarTooltipMode = 'always' | 'closed'

export interface MazSidebarContext {
  id: ComputedRef<string>
  open: Ref<boolean>
  state: ComputedRef<'expanded' | 'collapsed'>
  side: ComputedRef<'start' | 'end'>
  collapsible: ComputedRef<'offcanvas' | 'icon' | 'hover' | 'none'>
  mode: ComputedRef<'push' | 'overlay'>
  tooltipMode: ComputedRef<MazSidebarTooltipMode>
  toggle: () => void
  setOpen: (value: boolean) => void
}

export const mazSidebarKey: InjectionKey<MazSidebarContext> = Symbol('MazSidebar')

export interface MazSidebarProps {
  /** Unique identifier for the sidebar (auto-generated if not provided) */
  id?: string
  /** Whether the sidebar is open */
  open?: boolean
  /** Side of the sidebar */
  side?: 'start' | 'end'
  /**
   * How the sidebar collapses
   * - offcanvas: completely hidden
   * - icon: only icons visible
   * - hover: only icons visible by default, expands on mouse hover or keyboard focus
   *   (transient visual state — does not update `v-model:open` nor the persistence cookie)
   * - none: always fully visible
   */
  collapsible?: 'offcanvas' | 'icon' | 'hover' | 'none'
  /**
   * How the sidebar affects layout
   * - push: sidebar is in document flow
   * - overlay: sidebar floats over content with a backdrop
   */
  mode?: 'push' | 'overlay'
  /** Width of the expanded sidebar */
  width?: string
  /** Width of the collapsed sidebar in icon mode */
  iconWidth?: string
  /**
   * When descendant `MazSidebarMenuButton` components should display their tooltip.
   * - `always`: tooltip shows on hover regardless of the sidebar state
   * - `closed`: tooltip only shows on hover when the sidebar is collapsed
   *
   * Individual buttons can override this via their own `tooltipMode` prop.
   * @default 'closed'
   */
  tooltipMode?: MazSidebarTooltipMode
  /**
   * Persist the open/collapsed state in a cookie so it survives reloads.
   * Restoration happens on client mount (SSR-safe). For zero-flash SSR, read
   * the cookie server-side and forward it via `v-model:open`.
   * @default true
   */
  persist?: boolean
  /**
   * Cookie key used when `persist` is enabled. Set a unique key per sidebar
   * instance if you mount several sidebars on the same site.
   * @default 'maz-sidebar-open'
   */
  persistKey?: string
}
</script>

<script lang="ts" setup>
import { getCookie, setCookie } from '@maz-ui/utils/helpers/cookie'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, defineAsyncComponent, onMounted, provide, ref, useSSRContext, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

interface MazSidebarSSRContext {
  event?: {
    node?: { req?: { headers?: { cookie?: string } } }
    headers?: { get?: (name: string) => string | null }
  }
  req?: { headers?: { cookie?: string } }
}

const {
  id,
  open = true,
  side = 'start',
  collapsible = 'offcanvas',
  mode = 'push',
  width = '16rem',
  iconWidth = '3rem',
  tooltipMode = 'closed',
  persist = true,
  persistKey = 'maz-sidebar-open',
} = defineProps<MazSidebarProps>()

const emit = defineEmits<{
  /** Emitted when open state changes */
  'update:open': [value: boolean]
}>()

const MazBackdrop = defineAsyncComponent(() => import('./MazBackdrop.vue'))

function readPersistedOpen(): boolean | null {
  if (!persist)
    return null

  let cookieHeader: string | undefined
  if (isServer()) {
    try {
      const ctx = useSSRContext<MazSidebarSSRContext>()
      cookieHeader
        = ctx?.event?.node?.req?.headers?.cookie
          ?? ctx?.event?.headers?.get?.('cookie')
          ?? ctx?.req?.headers?.cookie
          ?? undefined
    }
    catch {
      // No SSR context available — fall through to client-side read on hydration
    }
  }

  const raw = getCookie(persistKey, cookieHeader)
  return raw === null ? null : raw === 'true'
}

const persistedInitial = readPersistedOpen()
const internalOpen = ref(persistedInitial ?? open)

watch(
  () => open,
  (v) => {
    internalOpen.value = v
  },
)

const isMouseInside = ref(false)
const isFocusInside = ref(false)
const isHoverExpanded = computed(() => isMouseInside.value || isFocusInside.value)

const state = computed<'expanded' | 'collapsed'>(() => {
  if (collapsible === 'hover')
    return isHoverExpanded.value ? 'expanded' : 'collapsed'
  return internalOpen.value ? 'expanded' : 'collapsed'
})

function onSidebarMouseEnter() {
  if (collapsible === 'hover')
    isMouseInside.value = true
}

function onSidebarMouseLeave() {
  if (collapsible === 'hover')
    isMouseInside.value = false
}

function onSidebarFocusIn() {
  if (collapsible === 'hover')
    isFocusInside.value = true
}

function onSidebarFocusOut(event: FocusEvent) {
  if (collapsible !== 'hover')
    return
  const currentTarget = event.currentTarget as HTMLElement | null
  const nextTarget = event.relatedTarget as Node | null
  if (!currentTarget || !nextTarget || !currentTarget.contains(nextTarget))
    isFocusInside.value = false
}

function toggle() {
  setOpen(!internalOpen.value)
}

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

onMounted(() => {
  if (persistedInitial !== null && persistedInitial !== open)
    emit('update:open', persistedInitial)
})

watch(internalOpen, (value) => {
  if (persist)
    setCookie(persistKey, String(value))
})

const uniqueId = useInstanceUniqId({
  componentName: 'MazSidebar',
  providedId: id,
})

provide(mazSidebarKey, {
  id: uniqueId,
  open: internalOpen,
  state,
  side: computed(() => side),
  collapsible: computed(() => collapsible),
  mode: computed(() => mode),
  tooltipMode: computed(() => tooltipMode),
  toggle,
  setOpen,
})

const sidebarStyle = computed(() => ({
  '--maz-sidebar-width': width,
  '--maz-sidebar-icon-width': iconWidth,
}))

const isOffcanvasCollapsed = computed(
  () => collapsible === 'offcanvas' && state.value === 'collapsed',
)

const isIconCollapsed = computed(
  () => collapsible === 'icon' && state.value === 'collapsed',
)

const isHoverCollapsed = computed(
  () => collapsible === 'hover' && state.value === 'collapsed',
)

const pushWidthClass = computed(() => {
  if (collapsible === 'none')
    return 'maz:w-(--maz-sidebar-width)'
  if (isOffcanvasCollapsed.value)
    return 'maz:w-0'
  if (isIconCollapsed.value || isHoverCollapsed.value)
    return 'maz:w-(--maz-sidebar-icon-width)'
  return 'maz:w-(--maz-sidebar-width)'
})

const borderClass = computed(() =>
  side === 'start'
    ? 'maz:border-e maz:border-divider'
    : 'maz:border-s maz:border-divider',
)

defineExpose({ toggle, setOpen })
</script>

<template>
  <!-- Push mode: sidebar in document flow -->
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <aside
    v-if="mode === 'push'"
    :id="uniqueId"
    class="m-sidebar --push m-reset-css motion-reduce:maz:transition-none maz:relative maz:flex maz:h-full maz:shrink-0 maz:flex-col maz:overflow-hidden maz:bg-container maz:transition-[width,border-width] maz:duration-250 maz:ease-in-out"
    :class="[
      `--side-${side}`,
      `--${state}`,
      `--collapsible-${collapsible}`,
      pushWidthClass,
      !isOffcanvasCollapsed && borderClass,
    ]"
    :style="sidebarStyle"
    aria-label="Sidebar"
    @mouseenter="onSidebarMouseEnter"
    @mouseleave="onSidebarMouseLeave"
    @focusin="onSidebarFocusIn"
    @focusout="onSidebarFocusOut"
  >
    <slot />
  </aside>

  <!-- Overlay mode: backdrop + slide-in sidebar -->
  <MazBackdrop
    v-else
    :model-value="internalOpen"
    variant="drawer"
    :justify="side === 'start' ? 'start' : 'end'"
    :transition-name="`drawer-anim-${side}`"
    @update:model-value="setOpen"
  >
    <template #default>
      <aside
        :id="uniqueId"
        class="m-sidebar --overlay --expanded m-reset-css maz:pointer-events-auto maz:flex maz:min-h-screen maz:w-(--maz-sidebar-width) maz:flex-col maz:overflow-y-auto maz:bg-container"
        :class="[`--side-${side}`, borderClass]"
        :style="sidebarStyle"
        aria-label="Sidebar"
      >
        <slot />
      </aside>
    </template>
  </MazBackdrop>
</template>
