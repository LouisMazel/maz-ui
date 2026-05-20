<script lang="ts">
import type { MazIconLike } from '../composables/useMazIconProps'

export interface MazSidebarMenuSubProps {
  /** Label for the sub-menu trigger button */
  label?: string
  /**
   * Icon to display before the label. Accepts a bare icon value (Vue component, raw SVG string, URL)
   * or a full `MazIconProps` object for fine-grained control.
   */
  icon?: MazIconLike
  /** Whether the sub-menu is open by default */
  defaultOpen?: boolean
}
</script>

<script lang="ts" setup>
import { MazChevronDown } from '@maz-ui/icons/lazy/MazChevronDown'
import { computed, defineAsyncComponent, ref, useId } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'
import { useMazIconProps } from '../composables/useMazIconProps'
import { mazSidebarKey } from './MazSidebar.vue'

const { icon, defaultOpen = false } = defineProps<MazSidebarMenuSubProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazExpandAnimation = defineAsyncComponent(() => import('./MazExpandAnimation.vue'))

const sidebar = useInjectStrict(
  mazSidebarKey,
  undefined,
  '[maz-ui](MazSidebarMenuSub) Must be used inside MazSidebar',
)

const isIconCollapsed = computed(
  () => (sidebar.collapsible.value === 'icon' || sidebar.collapsible.value === 'hover')
    && sidebar.state.value === 'collapsed',
)

const isOpen = ref(defaultOpen)
const subMenuId = `maz-sidebar-sub-${useId()}`

const { iconProps } = useMazIconProps(() => icon, () => ({ size: 'sm' as const }))

function toggle() {
  isOpen.value = !isOpen.value
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight')
    isOpen.value = true
  else if (event.key === 'ArrowLeft')
    isOpen.value = false
}
</script>

<template>
  <div class="m-sidebar-menu-sub m-reset-css">
    <button
      type="button"
      class="m-sidebar-menu-sub__trigger focus-visible:maz:outline-2 focus-visible:maz:outline-offset-2 focus-visible:maz:outline-primary motion-reduce:maz:transition-none maz:relative maz:flex maz:w-full maz:cursor-pointer maz:items-center maz:gap-2 maz:rounded-md maz:bg-transparent maz:px-[min(calc((var(--maz-sidebar-icon-width,3rem)-1.25rem)/2),calc((100%-1.25rem)/2))] maz:py-2 maz:font-medium maz:text-foreground maz:transition-colors maz:duration-150 maz:ease-in-out maz:hover:bg-surface-600 maz:dark:hover:bg-surface-800/20"
      :aria-expanded="isOpen"
      :aria-controls="subMenuId"
      :aria-label="label"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span class="m-sidebar-menu-sub__icon maz:flex maz:shrink-0 maz:flex-center">
        <slot name="icon">
          <MazIcon v-if="iconProps" v-bind="iconProps" />
        </slot>
      </span>

      <span
        class="m-sidebar-menu-sub__label motion-reduce:maz:transition-none maz:flex-1 maz:truncate maz:text-start maz:transition-opacity maz:duration-150"
        :class="isIconCollapsed ? 'maz:opacity-0' : 'maz:opacity-100'"
        :aria-hidden="isIconCollapsed || undefined"
      >
        <slot name="label">{{ label }}</slot>
      </span>

      <span
        v-if="!isIconCollapsed"
        class="m-sidebar-menu-sub__chevron motion-reduce:maz:transition-none maz:shrink-0 maz:transition-transform maz:duration-200"
        :class="{ 'maz:rotate-180': isOpen }"
        aria-hidden="true"
      >
        <slot name="chevron">
          <MazChevronDown />
        </slot>
      </span>
    </button>

    <MazExpandAnimation :model-value="isOpen && !isIconCollapsed" duration="200ms">
      <ul
        :id="subMenuId"
        class="m-sidebar-menu-sub__list maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-1 maz:p-0 maz:ps-3"
        role="menu"
      >
        <slot />
      </ul>
    </MazExpandAnimation>
  </div>
</template>
