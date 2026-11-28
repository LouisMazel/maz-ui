<script lang="ts">
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { MazBadgeProps } from './MazBadge.vue'
import type { MazSidebarTooltipMode } from './MazSidebar.vue'
import { vTooltip } from '../directives/vTooltip.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'

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
  /**
   * Icon to display after the label (an external link arrow, a chevron...). Accepts a bare icon value
   * or a full `MazIconProps` object. Use the `end` slot for rich content.
   */
  endIcon?: MazIconLike
  /** Label text */
  label?: string
  /**
   * Badge content. Pass a `string`/`number` for a simple primary badge (a plain
   * secondary count in the `floating` variant, like the sidebars of macOS), or a full
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

<script lang="ts" setup generic="_T">
import type { Component } from 'vue'
import { computed, defineAsyncComponent, getCurrentInstance, inject, onBeforeUnmount, useTemplateRef, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict.ts'
import { useMazIconProps } from '../composables/useMazIconProps.ts'
import { useExternalLinks } from '../utils/externalLinks.ts'
import { resolveLinkComponent } from '../utils/resolveLinkComponent.ts'
import { mazSidebarKey } from './MazSidebar.vue'
import { mazSidebarMenuKey } from './MazSidebarMenu.vue'

const { to, href, disabled, icon, endIcon, badge, tooltip, tooltipMode, active, size = 'md' } = defineProps<MazSidebarMenuButtonProps>()

const emits = defineEmits<{
  click: [event: MouseEvent]
}>()

defineSlots<{
  /** Replace the icon before the label */
  icon: () => unknown
  /** The label */
  default: () => unknown
  /** Content after the label and the badge (an icon, a shortcut, a status) */
  end: () => unknown
}>()

const { onLinkClick } = useExternalLinks()

function onClick(event: MouseEvent) {
  if (disabled)
    return
  if (!to)
    onLinkClick(event, href)
  emits('click', event)
}

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBadge = defineAsyncComponent(() => import('./MazBadge.vue'))
const MazIndicator = defineAsyncComponent(() => import('./MazIndicator.vue'))

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

const { iconProps: endIconProps } = useMazIconProps(() => endIcon, () => ({ size: 'sm' as const }))

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

/** Collapsed to its icon, the badge leaves a dot of its color on the icon */
const collapsedIndicatorColor = computed(() => {
  const badgeColor = badgeBindings.value.color
  return badgeColor && badgeColor !== 'surface' && badgeColor !== 'container' && badgeColor !== 'transparent'
    ? badgeColor
    : 'primary'
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
    position: (sidebar.side.value === 'start'
      ? 'right'
      : 'left') as 'right' | 'left',
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
  return hasRouter && to
    ? 'router-link-active'
    : ''
})

const isActive = computed(() => active === true)

const menu = inject(mazSidebarMenuKey, undefined)
const buttonRef = useTemplateRef<HTMLElement | { $el: HTMLElement }>('button')

function getButtonElement(): HTMLElement | undefined {
  const target = buttonRef.value

  return target && '$el' in target
    ? target.$el
    : target ?? undefined
}

/** The active button gives its place to the pill of the menu, that slides from the previous active button */
watch(
  [isActive, buttonRef],
  () => {
    const element = getButtonElement()

    if (isActive.value && element)
      menu?.setActive(element)
  },
  { flush: 'post' },
)

onBeforeUnmount(() => {
  if (isActive.value)
    menu?.setActive(undefined)
})

const hasPill = computed(() => isActive.value && !!menu?.hasPill.value)

/** The floating variant follows the native sidebars: neutral selection, no hover fill, accent-colored icons. */
const stateClass = computed(() => {
  if (sidebar.variant.value === 'floating') {
    return [
      'maz:font-normal maz:text-foreground',
      isActive.value ? 'maz:cursor-auto maz:bg-foreground/9' : 'maz:cursor-interactive maz:bg-transparent',
    ]
  }
  return isActive.value
    ? 'maz:cursor-auto maz:bg-primary/10 maz:font-semibold maz:text-primary'
    : 'maz:cursor-interactive maz:bg-transparent maz:font-medium maz:text-foreground maz:hover:not-disabled:bg-foreground/5'
})
</script>

<template>
  <component
    :is="tag"
    ref="button"
    v-tooltip="tooltipBinding"
    class="m-sidebar-menu-btn m-reset-css maz:relative maz:flex maz:w-full maz:items-center maz:gap-2 maz:rounded-md maz:px-[min(calc((var(--maz-sidebar-icon-width,3rem)-var(--maz-sidebar-inset,0rem)-1.25rem)/2),calc((100%-1.25rem)/2))] maz:no-underline maz:focus-ring maz:transition-colors maz:duration-(--duration-fast) maz:ease-in-out maz:disabled:cursor-not-allowed maz:disabled:disabled-opacity maz:motion-reduce:transition-none"
    :class="[
      SIZE_CLASS[size],
      stateClass,
      routerActiveClass,
      {
        '--active': isActive,
        '--pill': hasPill,
        '--disabled': disabled,
        '--icon-collapsed': isIconCollapsed,
      },
    ]"
    :aria-label="label"
    :aria-current="isActive ? 'page' : undefined"
    :aria-disabled="disabled || undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    v-bind="linkProps"
    @click="onClick"
  >
    <span v-if="iconProps || hasSlotContent($slots.icon)" class="m-sidebar-menu-btn__icon maz:relative maz:flex maz:shrink-0 maz:flex-center" :class="{ 'maz:text-primary': sidebar.variant.value === 'floating' }">
      <slot name="icon">
        <MazIcon v-if="iconProps" v-bind="iconProps" />
      </slot>
      <MazIndicator
        v-if="isIconCollapsed && badgeText !== undefined && badgeText !== '' && badgeText !== 0"
        attached
        :color="collapsedIndicatorColor"
        size="xs"
        :bordered="false"
      />
    </span>

    <span
      class="m-sidebar-menu-btn__label maz:flex-1 maz:truncate maz:text-start maz:transition-[opacity,translate] maz:duration-(--duration-fast) maz:motion-reduce:transition-none"
      :class="isIconCollapsed ? 'maz:opacity-0' : 'maz:opacity-100'"
      :aria-hidden="isIconCollapsed || undefined"
    >
      <slot>{{ label }}</slot>
    </span>

    <span
      v-if="!isIconCollapsed && badgeText !== undefined"
      class="m-sidebar-menu-btn__badge maz:ml-auto maz:shrink-0"
    >
      <span v-if="sidebar.variant.value === 'floating' && typeof badge !== 'object'" class="maz:text-xs maz:text-muted maz:tabular-nums">{{ badgeText }}</span>
      <MazBadge v-else v-bind="badgeBindings">{{ badgeText }}</MazBadge>
    </span>

    <span
      v-if="!isIconCollapsed && (endIconProps || hasSlotContent($slots.end))"
      class="m-sidebar-menu-btn__end maz:flex maz:shrink-0 maz:items-center maz:gap-1 maz:text-muted"
    >
      <!-- @slot end - Content after the label and the badge (an icon, a shortcut, a status) -->
      <slot name="end">
        <MazIcon v-if="endIconProps" v-bind="endIconProps" />
      </slot>
    </span>
  </component>
</template>

<style scoped>
.m-sidebar-menu-btn {
  --maz-focus-ring-offset: -2px;

  &.--pill {
    background-color: transparent;
  }

  &.--icon-collapsed .m-sidebar-menu-btn__label {
    translate: -0.5rem 0;

    &:dir(rtl) {
      translate: 0.5rem 0;
    }
  }
}
</style>
