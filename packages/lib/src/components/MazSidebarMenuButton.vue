<script lang="ts">
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazBadgeProps } from './MazBadge.vue'
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
import { vTooltip } from '../directives/vTooltip'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import { mazSidebarKey } from './MazSidebar.vue'

const props = withDefaults(defineProps<MazSidebarMenuButtonProps>(), {
  to: undefined,
  href: undefined,
  icon: undefined,
  label: undefined,
  badge: undefined,
  tooltip: undefined,
  active: undefined,
  disabled: false,
  size: 'md',
})

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
  () => sidebar.collapsible.value === 'icon' && sidebar.state.value === 'collapsed',
)

const tag = computed<Component | string>(() => {
  if (props.to)
    return resolveLinkComponent()
  if (props.href)
    return 'a'
  return 'button'
})

const linkProps = computed(() => {
  if (props.to)
    return { to: props.to }
  if (props.href)
    return { href: props.href }
  return { type: 'button' as const }
})

const { iconProps } = useMazIconProps(() => props.icon, () => ({ size: '1.25rem' }))

const badgeText = computed(() => {
  const b = props.badge
  if (b === undefined || b === null)
    return undefined
  if (typeof b === 'string' || typeof b === 'number')
    return b
  return b.text
})

const badgeBindings = computed<Partial<MazBadgeProps>>(() => {
  const b = props.badge
  if (b === undefined || b === null || typeof b === 'string' || typeof b === 'number')
    return { size: 'sm', roundedSize: 'full' }
  const { text: _text, ...rest } = b
  return { size: 'sm', roundedSize: 'full', ...rest }
})

const tooltipBinding = computed(() => {
  if (!props.tooltip) {
    return { text: ' ', trigger: 'manual' as const }
  }
  const position: 'right' | 'left' = sidebar.side.value === 'start' ? 'right' : 'left'
  return {
    text: props.tooltip,
    position,
    trigger: 'hover' as const,
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
  return hasRouter && props.to ? 'router-link-active' : ''
})

const isActive = computed(() => props.active === true)
</script>

<template>
  <component
    :is="tag"
    v-tooltip="tooltipBinding"
    class="m-sidebar-menu-btn m-reset-css focus-visible:maz:outline-2 focus-visible:maz:outline-offset-2 focus-visible:maz:outline-primary motion-reduce:maz:transition-none maz:relative maz:flex maz:w-full maz:cursor-pointer maz:items-center maz:gap-2 maz:rounded-md maz:bg-transparent maz:px-[min(calc((var(--maz-sidebar-icon-width,3rem)-1.25rem)/2),calc((100%-1.25rem)/2))] maz:font-medium maz:text-foreground maz:no-underline maz:transition-colors maz:duration-150 maz:ease-in-out maz:hover:not-disabled:bg-surface-600 maz:disabled:cursor-not-allowed maz:disabled:opacity-50 maz:dark:hover:not-disabled:bg-surface-800/20"
    :class="[
      SIZE_CLASS[size],
      isActive && 'maz:bg-primary/10 maz:font-semibold maz:text-primary',
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
