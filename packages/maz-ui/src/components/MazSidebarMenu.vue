<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

export interface MazSidebarMenuContext {
  /**
   * The menu button that is active: the pill slides under it
   */
  setActive: (element: HTMLElement | undefined) => void
  /**
   * `true` once the pill is placed: the active button then leaves its background to the pill
   */
  hasPill: Readonly<Ref<boolean>>
}

export const mazSidebarMenuKey: InjectionKey<MazSidebarMenuContext> = Symbol('MazSidebarMenu')
</script>

<script lang="ts" setup>
import { computed, provide, ref, shallowRef } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict.ts'
import { useSlidingIndicator } from '../composables/useSlidingIndicator.ts'
import { mazSidebarKey } from './MazSidebar.vue'

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarMenu) Must be used inside MazSidebar')

const menuRef = ref<HTMLElement>()
const activeElement = shallowRef<HTMLElement>()

const { style, isReady } = useSlidingIndicator({
  container: menuRef,
  active: activeElement,
  orientation: 'vertical',
  animated: sidebar.animated?.value ?? true,
})

provide(mazSidebarMenuKey, {
  setActive: (element) => {
    activeElement.value = element
  },
  hasPill: computed(() => isReady.value && !!activeElement.value),
})

/** The pill is a pseudo-element: the list keeps only its items */
const pillStyle = computed(() => ({
  '--m-pill-opacity': style.value.opacity ?? 1,
  '--m-pill-transform': style.value.transform,
  '--m-pill-width': style.value.width,
  '--m-pill-height': style.value.height,
  '--m-pill-duration': style.value.transitionDuration,
  '--m-pill-easing': style.value.transitionTimingFunction,
}))
</script>

<template>
  <ul
    ref="menuRef"
    class="m-sidebar-menu m-reset-css maz:relative maz:m-0 maz:flex maz:list-none maz:flex-col maz:p-0"
    :class="[sidebar.variant.value === 'floating' ? '--floating maz:gap-px' : 'maz:gap-1']"
    :style="pillStyle"
  >
    <slot />
  </ul>
</template>

<style scoped>
.m-sidebar-menu::before {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: var(--m-pill-width, 0);
  block-size: var(--m-pill-height, 0);
  border-radius: var(--maz-rounded-md, 0.375rem);
  background-color: color-mix(in oklab, var(--maz-primary) 10%, transparent);
  content: '';
  opacity: var(--m-pill-opacity, 0);
  pointer-events: none;
  transform: var(--m-pill-transform, none);
  transition-duration: var(--m-pill-duration, 0s);
  transition-property: transform, block-size, opacity;
  transition-timing-function: var(--m-pill-easing, ease-out);
}

.m-sidebar-menu.--floating::before {
  background-color: color-mix(in oklab, var(--maz-foreground) 9%, transparent);
}
</style>
