<script lang="ts">
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface MazSidebarContext {
  id: ComputedRef<string>
  open: Ref<boolean>
  state: ComputedRef<'expanded' | 'collapsed'>
  side: ComputedRef<'start' | 'end'>
  collapsible: ComputedRef<'offcanvas' | 'icon' | 'none'>
  mode: ComputedRef<'push' | 'overlay'>
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
   * - none: always fully visible
   */
  collapsible?: 'offcanvas' | 'icon' | 'none'
  /**
   * How the sidebar affects layout
   * - push: sidebar is in document flow
   * - overlay: sidebar floats over content
   */
  mode?: 'push' | 'overlay'
  /** Width of the expanded sidebar */
  width?: string
  /** Width of the collapsed sidebar in icon mode */
  iconWidth?: string
}
</script>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

const props = withDefaults(defineProps<MazSidebarProps>(), {
  id: undefined,
  open: true,
  side: 'start',
  collapsible: 'offcanvas',
  mode: 'push',
  width: '16rem',
  iconWidth: '3rem',
})

const emit = defineEmits<{
  /** Emitted when open state changes */
  'update:open': [value: boolean]
}>()

const internalOpen = ref(props.open)

watch(
  () => props.open,
  (v) => {
    internalOpen.value = v
  },
)

const state = computed<'expanded' | 'collapsed'>(() =>
  internalOpen.value ? 'expanded' : 'collapsed',
)

function toggle() {
  setOpen(!internalOpen.value)
}

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

const uniqueId = useInstanceUniqId({
  componentName: 'MazSidebar',
  providedId: props.id,
})

provide(mazSidebarKey, {
  id: uniqueId,
  open: internalOpen,
  state,
  side: computed(() => props.side),
  collapsible: computed(() => props.collapsible),
  mode: computed(() => props.mode),
  toggle,
  setOpen,
})

// ---- Overlay mode: scroll lock, focus trap, escape key ----

const SCROLL_LOCK_CLASS = '--maz-sidebar-open'

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}

function lockScroll() {
  const scrollbarWidth = getScrollbarWidth()
  if (scrollbarWidth > 0) {
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.documentElement.classList.add('--has-scrollbar')
  }
  document.documentElement.classList.add(SCROLL_LOCK_CLASS)
}

function unlockScroll() {
  document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
  document.documentElement.classList.remove('--has-scrollbar')
  document.documentElement.style.removeProperty('--scrollbar-width')
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'Escape' && internalOpen.value) {
    setOpen(false)
  }
}

const sidebarRef = ref<HTMLElement | null>(null)
let initialFocusElement: HTMLElement | null = null

function getFocusableElements() {
  if (!sidebarRef.value)
    return []
  const selector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return [...sidebarRef.value.querySelectorAll<HTMLElement>(selector)].filter((el) => {
    const style = globalThis.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab')
    return
  const elements = getFocusableElements()
  if (!elements.length)
    return
  const first = elements[0]
  const last = elements.at(-1)
  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    }
  }
  else {
    if (document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
}

function addOverlayListeners() {
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('keydown', trapFocus)
}

function removeOverlayListeners() {
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('keydown', trapFocus)
}

watch(internalOpen, async (open) => {
  if (props.mode !== 'overlay')
    return
  if (open) {
    lockScroll()
    addOverlayListeners()
    initialFocusElement = document.activeElement as HTMLElement | null
    await nextTick()
    getFocusableElements()[0]?.focus()
  }
  else {
    unlockScroll()
    removeOverlayListeners()
    await nextTick()
    initialFocusElement?.focus()
    initialFocusElement = null
  }
})

onBeforeUnmount(() => {
  removeOverlayListeners()
  if (props.mode === 'overlay' && internalOpen.value) {
    unlockScroll()
  }
})

// ---- Styles ----

const sidebarStyle = computed(() => ({
  '--maz-sidebar-width': props.width,
  '--maz-sidebar-icon-width': props.iconWidth,
}))

defineExpose({ toggle, setOpen })
</script>

<template>
  <!-- Push mode: sidebar in document flow -->
  <aside
    v-if="mode === 'push'"
    :id="uniqueId"
    ref="sidebarRef"
    class="m-sidebar --push"
    :class="[`--side-${side}`, `--${state}`, `--collapsible-${collapsible}`]"
    :style="sidebarStyle"
    aria-label="Sidebar"
  >
    <slot />
  </aside>

  <!-- Overlay mode: sidebar floats over content -->
  <template v-else>
    <Teleport to="body">
      <Transition name="m-sidebar-backdrop-anim">
        <div
          v-if="internalOpen"
          class="m-sidebar-backdrop"
          aria-hidden="true"
          @click="setOpen(false)"
        />
      </Transition>
    </Teleport>
    <Transition :name="`m-sidebar-slide-${side}-anim`">
      <aside
        v-if="internalOpen"
        :id="uniqueId"
        ref="sidebarRef"
        class="m-sidebar --overlay --expanded"
        :class="[`--side-${side}`]"
        :style="sidebarStyle"
        aria-label="Sidebar"
      >
        <slot />
      </aside>
    </Transition>
  </template>
</template>

<style>
html.--maz-sidebar-open {
  overflow-y: hidden;
  block-size: 100vh !important;
}

html.--maz-sidebar-open.--has-scrollbar {
  padding-inline-end: var(--scrollbar-width);
}
</style>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: var(--maz-color-container, #fff);
  border-color: var(--maz-color-border, #e2e8f0);
  transition:
    inline-size 250ms ease-in-out,
    transform 250ms ease-in-out;
  transition-behavior: allow-discrete;

  &.--push {
    position: relative;
    block-size: 100%;
    inline-size: var(--maz-sidebar-width);
    overflow: hidden;

    &.--side-start {
      border-inline-end-width: 1px;
      border-inline-end-style: solid;
    }

    &.--side-end {
      border-inline-start-width: 1px;
      border-inline-start-style: solid;
    }

    &.--collapsed {
      &.--collapsible-offcanvas {
        inline-size: 0;
      }

      &.--collapsible-icon {
        inline-size: var(--maz-sidebar-icon-width);
      }
    }

    &.--collapsible-none {
      inline-size: var(--maz-sidebar-width);
    }
  }

  &.--overlay {
    @apply maz:z-default-backdrop;

    position: fixed;
    inset-block: 0;
    inline-size: var(--maz-sidebar-width);
    block-size: 100dvh;
    overflow-y: auto;

    &.--side-start {
      inset-inline-start: 0;
      border-inline-end-width: 1px;
      border-inline-end-style: solid;
    }

    &.--side-end {
      inset-inline-end: 0;
      border-inline-start-width: 1px;
      border-inline-start-style: solid;
    }
  }

  /* Transitions */
  &.m-sidebar-slide-start-anim-enter-from,
  &.m-sidebar-slide-start-anim-leave-to {
    transform: translateX(-100%);
  }

  &.m-sidebar-slide-end-anim-enter-from,
  &.m-sidebar-slide-end-anim-leave-to {
    transform: translateX(100%);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.m-sidebar-backdrop {
  @apply maz:z-1040;

  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 25%);
  backdrop-filter: blur(2px);

  &.m-sidebar-backdrop-anim-enter-active,
  &.m-sidebar-backdrop-anim-leave-active {
    transition: opacity 250ms ease-in-out;
  }

  &.m-sidebar-backdrop-anim-enter-from,
  &.m-sidebar-backdrop-anim-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

[dir='rtl'] .m-sidebar {
  &.m-sidebar-slide-start-anim-enter-from,
  &.m-sidebar-slide-start-anim-leave-to {
    transform: translateX(100%);
  }

  &.m-sidebar-slide-end-anim-enter-from,
  &.m-sidebar-slide-end-anim-leave-to {
    transform: translateX(-100%);
  }
}
</style>
