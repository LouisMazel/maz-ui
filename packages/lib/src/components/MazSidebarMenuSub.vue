<script lang="ts" setup>
import type { Component } from 'vue'
import { MazChevronDown } from '@maz-ui/icons/lazy/MazChevronDown'
import { ref, useId } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

export interface MazSidebarMenuSubProps {
  /** Label for the sub-menu trigger button */
  label?: string
  /** Icon component or SVG string */
  icon?: Component | string
  /** Whether the sub-menu is open by default */
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<MazSidebarMenuSubProps>(), {
  label: undefined,
  icon: undefined,
  defaultOpen: false,
})

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarMenuSub) Must be used inside MazSidebar')

const isOpen = ref(props.defaultOpen)

const subMenuId = `maz-sidebar-sub-${useId()}`

function toggle() {
  isOpen.value = !isOpen.value
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') {
    isOpen.value = true
  }
  else if (event.key === 'ArrowLeft') {
    isOpen.value = false
  }
}
</script>

<template>
  <div class="m-sidebar-menu-sub">
    <button
      type="button"
      class="m-sidebar-menu-sub__trigger"
      :aria-expanded="isOpen"
      :aria-controls="subMenuId"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span v-if="icon || $slots.icon" class="m-sidebar-menu-sub__icon maz:shrink-0">
        <slot name="icon">
          <component :is="icon" v-if="icon" class="maz:size-5" />
        </slot>
      </span>
      <span class="m-sidebar-menu-sub__label maz:flex-1 maz:truncate maz:text-start">
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        class="m-sidebar-menu-sub__chevron maz:shrink-0 maz:transition-transform"
        :class="{ 'maz:rotate-180': isOpen }"
        aria-hidden="true"
      >
        <slot name="chevron">
          <MazChevronDown />
        </slot>
      </span>
    </button>

    <Transition name="m-sidebar-sub-anim">
      <ul
        v-if="isOpen"
        :id="subMenuId"
        class="m-sidebar-menu-sub__list maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-1 maz:p-0 maz:ps-3"
        role="menu"
      >
        <slot />
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.m-sidebar-menu-sub {
  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    inline-size: 100%;
    padding-block: 0.5rem;
    padding-inline: 0.75rem;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: transparent;
    color: inherit;
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

  &__list {
    overflow: hidden;
  }
}

.m-sidebar-sub-anim-enter-active,
.m-sidebar-sub-anim-leave-active {
  transition:
    max-block-size 200ms ease-in-out,
    opacity 200ms ease-in-out;
  max-block-size: 500px;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.m-sidebar-sub-anim-enter-from,
.m-sidebar-sub-anim-leave-to {
  max-block-size: 0;
  opacity: 0;
}
</style>
