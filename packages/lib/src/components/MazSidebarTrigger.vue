<script lang="ts" setup>
import { useMazSidebar } from '../composables/useMazSidebar'

export interface MazSidebarTriggerProps {
  /** Additional CSS class */
  class?: string
}

defineProps<MazSidebarTriggerProps>()

const sidebar = useMazSidebar()
</script>

<template>
  <button
    type="button"
    class="m-sidebar-trigger"
    :aria-expanded="sidebar.open.value"
    :aria-controls="sidebar.id.value"
    :aria-label="sidebar.open.value ? 'Close sidebar' : 'Open sidebar'"
    @click="sidebar.toggle()"
  >
    <slot>
      <span class="m-sidebar-trigger__icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </span>
    </slot>
  </button>
</template>

<style scoped>
.m-sidebar-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: var(--maz-color-bg-lighter, rgb(0 0 0 / 5%));
  }

  &:focus-visible {
    outline: 2px solid var(--maz-color-primary, #3b82f6);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
</style>
