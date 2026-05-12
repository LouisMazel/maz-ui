<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, getCurrentInstance } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import MazBadge from './MazBadge.vue'
import { mazSidebarKey } from './MazSidebar.vue'

export interface MazSidebarMenuButtonProps {
  /** Route for router-link navigation */
  to?: string | Record<string, unknown>
  /** URL for anchor navigation */
  href?: string
  /** Icon component or SVG string */
  icon?: Component | string
  /** Label text */
  label?: string
  /** Badge content */
  badge?: string | number
  /** Tooltip text (auto-shown when sidebar is icon-collapsed if not provided, falls back to label) */
  tooltip?: string
  /** Whether the item is active (highlights with aria-current="page") */
  active?: boolean
  /** Whether the item is disabled */
  disabled?: boolean
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
}

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

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarMenuButton) Must be used inside MazSidebar')

const isIconCollapsed = computed(
  () => sidebar.collapsible.value === 'icon' && sidebar.state.value === 'collapsed',
)

const resolvedTooltip = computed(() => {
  if (isIconCollapsed.value) {
    return props.tooltip ?? props.label
  }
  return props.tooltip
})

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
  return { type: 'button' }
})

const SIZE_CLASSES: Record<string, string> = {
  sm: 'maz:text-sm maz:py-1',
  md: 'maz:text-base maz:py-2',
  lg: 'maz:text-lg maz:py-2.5',
}

const sizeClass = computed(() => SIZE_CLASSES[props.size])

// Auto-detect active route via RouterLink when "to" is provided
const routerActiveClass = computed(() => {
  const instance = getCurrentInstance()
  const hasRouter = !!instance?.appContext.config.globalProperties.$router
  return hasRouter && props.to ? 'router-link-active' : ''
})
</script>

<template>
  <component
    :is="tag"
    class="m-sidebar-menu-btn"
    :class="[
      sizeClass,
      {
        '--active': active,
        '--disabled': disabled,
        '--icon-collapsed': isIconCollapsed,
        [routerActiveClass]: !!routerActiveClass,
      },
    ]"
    :title="resolvedTooltip"
    :aria-current="active ? 'page' : undefined"
    :aria-disabled="disabled || undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    v-bind="linkProps"
    @click="!disabled && emit('click', $event)"
  >
    <!-- Icon slot or prop -->
    <span v-if="icon || $slots.icon" class="m-sidebar-menu-btn__icon maz:shrink-0">
      <slot name="icon">
        <component :is="icon" v-if="icon" class="maz:size-5" />
      </slot>
    </span>

    <!-- Label -->
    <span
      v-if="label || $slots.default"
      class="m-sidebar-menu-btn__label maz:flex-1 maz:truncate"
      :class="{ 'maz:sr-only': isIconCollapsed }"
    >
      <slot>{{ label }}</slot>
    </span>

    <!-- Badge -->
    <MazBadge
      v-if="badge !== undefined && !isIconCollapsed"
      class="m-sidebar-menu-btn__badge maz:ml-auto maz:shrink-0 maz:rounded-full maz:bg-primary maz:px-2 maz:py-0.5 maz:text-xs maz:font-semibold maz:text-primary-foreground"
    >
      {{ badge }}
    </MazBadge>
  </component>
</template>

<style scoped>
.m-sidebar-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  border-radius: 0.375rem;
  padding-inline: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  color: inherit;
  text-decoration: none;
  transition:
    background-color 150ms ease-in-out,
    color 150ms ease-in-out;
  outline: none;
  text-align: start;

  &:hover:not(.--disabled) {
    background-color: var(--maz-color-bg-lighter, rgb(0 0 0 / 5%));
  }

  &:focus-visible {
    outline: 2px solid var(--maz-color-primary, #3b82f6);
    outline-offset: 2px;
  }

  &.--active,
  &.router-link-active {
    background-color: var(--maz-color-primary-alpha, rgb(59 130 246 / 10%));
    color: var(--maz-color-primary, #3b82f6);
    font-weight: 600;
  }

  &.--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.--icon-collapsed {
    justify-content: center;
    padding-inline: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
</style>
