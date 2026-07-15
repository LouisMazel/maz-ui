<script lang="ts">
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazSidebarTooltipMode } from './MazSidebar.vue'
import { vTooltip } from '../directives/vTooltip'
import { hasSlotContent } from '../utils/hasSlotContent'

export type MazSidebarMenuButtonBadge = string | number | (MazBadgeProps & { text?: string | number })

export interface MazSidebarMenuButtonProps {
  /** Route for router-link navigation */
  to?: string | Record<string, unknown>
  /** URL for anchor navigation */
  href?: string
  /**
   * Icon to display before the label. Accepts a bare icon value (Vue component, raw SVG string, URL)
   * or a full `MazIconProps` object for fine-grained control (size, title, fallback, …).
   */
  icon?: MazIconLike
  /** Label text */
  label?: string
  /**
   * Badge content. Pass a `string`/`number` for a simple primary badge, or a full
   * `MazBadgeProps` object (with optional `text`) to customise color, size, outlined, …
   */
  badge?: MazSidebarMenuButtonBadge
  /** Tooltip text. When provided, shows a tooltip on hover via the `v-tooltip` directive. */
  tooltip?: string
  /**
   * Controls when the tooltip should be displayed.
   * - `always`: tooltip shows on hover regardless of the sidebar state
   * - `closed`: tooltip only shows on hover when the sidebar is collapsed
   *
   * Overrides the parent `MazSidebar`'s `tooltipMode`. Falls back to the
   * sidebar value (which defaults to `always`) when not provided.
   */
  tooltipMode?: MazSidebarTooltipMode
  /** Whether the item is active (highlights with `aria-current="page"`) */
  active?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
}
</script>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, defineAsyncComponent, getCurrentInstance } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'
import { useMazIconProps } from '../composables/useMazIconProps'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import { mazSidebarKey } from './MazSidebar.vue'

const { to, href, icon, badge, tooltip, tooltipMode, active, size = 'md' } = defineProps<MazSidebarMenuButtonProps>()

defineEmits<{
  click: [event: MouseEvent]
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))

const sidebar = useInjectStrict(
  mazSidebarKey,
  undefined,
  '[maz-ui](MazSidebarMenuButton) Must be used inside MazSidebar',
)

const isIconCollapsed = computed(
  () => (sidebar.collapsible.value === 'icon' || sidebar.collapsible.value === 'hover')
    && sidebar.state.value === 'collapsed',
)

const tag = computed<Component | string>(() => {
  if (to)
    return resolveLinkComponent()
  if (href)
    return 'a'
  return 'button'
})

const linkProps = computed(() => {
  if (to)
    return { to }
  if (href)
    return { href }
  return { type: 'button' as const }
})

const { iconProps } = useMazIconProps(() => icon, () => ({ size: 'sm' as const }))

const badgeText = computed(() => {
  const b = badge
  if (b === undefined || b === null)
    return undefined
  if (typeof b === 'string' || typeof b === 'number')
    return b
  return b.text
})

const badgeBindings = computed<Partial<MazBadgeProps>>(() => {
  const b = badge
  if (b === undefined || b === null || typeof b === 'string' || typeof b === 'number')
    return { size: 'sm', roundedSize: 'full' }
  const { text: _text, ...rest } = b
  return { size: 'sm', roundedSize: 'full', ...rest }
})

const effectiveTooltipMode = computed<MazSidebarTooltipMode>(
  () => tooltipMode ?? sidebar.tooltipMode.value,
)

const tooltipVisible = computed(
  () => effectiveTooltipMode.value === 'always' || sidebar.state.value === 'collapsed',
)

const tooltipBinding = computed(() => {
  if (!tooltip)
    return false as const

  return {
    text: tooltip,
    position: (sidebar.side.value === 'start' ? 'right' : 'left') as 'right' | 'left',
    trigger: (tooltipVisible.value ? 'hover' : 'manual') as 'hover' | 'manual',
  }
})

const SIZE_CLASS = {
  sm: 'maz:text-sm maz:py-1.5',
  md: 'maz:text-base maz:py-2',
  lg: 'maz:text-lg maz:py-2.5',
} as const

const routerActiveClass = computed(() => {
  const instance = getCurrentInstance()
  const hasRouter = !!instance?.appContext.config.globalProperties.$router
  return hasRouter && to ? 'router-link-active' : ''
})

const isActive = computed(() => active === true)
</script>

<template>
  <component
    :is="tag"
    v-tooltip="tooltipBinding"
    class="m-sidebar-menu-btn m-reset-css focus-visible:maz:outline-2 focus-visible:maz:outline-offset-2 focus-visible:maz:outline-primary motion-reduce:maz:transition-none maz:relative maz:flex maz:w-full maz:items-center maz:gap-2 maz:rounded-md maz:px-[min(calc((var(--maz-sidebar-icon-width,3rem)-1.25rem)/2),calc((100%-1.25rem)/2))] maz:no-underline maz:transition-colors maz:duration-150 maz:ease-in-out maz:disabled:cursor-not-allowed maz:disabled:opacity-50"
    :class="[
      SIZE_CLASS[size],
      isActive ? 'maz:cursor-auto maz:bg-primary/10 maz:font-semibold maz:text-primary' : 'maz:cursor-pointer maz:bg-transparent maz:font-medium maz:text-foreground maz:hover:not-disabled:bg-surface-600 maz:dark:not-disabled:hover:bg-surface-400',
      routerActiveClass,
      {
        '--active': isActive,
        '--disabled': disabled,
        '--icon-collapsed': isIconCollapsed,
      },
    ]"
    :aria-label="label"
    :aria-current="isActive ? 'page' : undefined"
    :aria-disabled="disabled || undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    v-bind="linkProps"
    @click="!disabled && $emit('click', $event)"
  >
    <span v-if="iconProps || hasSlotContent($slots.icon)" class="m-sidebar-menu-btn__icon maz:flex maz:shrink-0 maz:flex-center">
      <slot name="icon">
        <MazIcon v-if="iconProps" v-bind="iconProps" />
      </slot>
    </span>

    <span
      class="m-sidebar-menu-btn__label motion-reduce:maz:transition-none maz:flex-1 maz:truncate maz:text-start maz:transition-opacity maz:duration-150"
      :class="isIconCollapsed ? 'maz:opacity-0' : 'maz:opacity-100'"
      :aria-hidden="isIconCollapsed || undefined"
    >
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="!isIconCollapsed && badgeText !== undefined"
      class="m-sidebar-menu-btn__badge maz:ml-auto maz:shrink-0"
    >
      <MazBadge v-bind="badgeBindings">{{ badgeText }}</MazBadge>
    </span>
  </component>
</template>
