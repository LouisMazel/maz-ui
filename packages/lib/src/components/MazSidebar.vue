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
   * - overlay: sidebar floats over content with a backdrop
   */
  mode?: 'push' | 'overlay'
  /** Width of the expanded sidebar */
  width?: string
  /** Width of the collapsed sidebar in icon mode */
  iconWidth?: string
}
</script>

<script lang="ts" setup>
import { computed, defineAsyncComponent, provide, ref, watch } from 'vue'
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

const MazBackdrop = defineAsyncComponent(() => import('./MazBackdrop.vue'))

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

const sidebarStyle = computed(() => ({
  '--maz-sidebar-width': props.width,
  '--maz-sidebar-icon-width': props.iconWidth,
}))

const isOffcanvasCollapsed = computed(
  () => props.collapsible === 'offcanvas' && state.value === 'collapsed',
)

const isIconCollapsed = computed(
  () => props.collapsible === 'icon' && state.value === 'collapsed',
)

const pushWidthClass = computed(() => {
  if (props.collapsible === 'none')
    return 'maz:w-(--maz-sidebar-width)'
  if (isOffcanvasCollapsed.value)
    return 'maz:w-0'
  if (isIconCollapsed.value)
    return 'maz:w-(--maz-sidebar-icon-width)'
  return 'maz:w-(--maz-sidebar-width)'
})

const borderClass = computed(() =>
  props.side === 'start'
    ? 'maz:border-e maz:border-divider'
    : 'maz:border-s maz:border-divider',
)

defineExpose({ toggle, setOpen })
</script>

<template>
  <!-- Push mode: sidebar in document flow -->
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
