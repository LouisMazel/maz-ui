<script lang="ts" setup>
import { MazChevronUpDown } from '@maz-ui/icons/raw/MazChevronUpDown'
import { useSidebar } from '../composables/useSidebar'
import MazIcon from './MazIcon.vue'

const sidebar = useSidebar()
</script>

<template>
  <button
    type="button"
    class="m-sidebar-trigger m-reset-css focus-visible:maz:outline-2 focus-visible:maz:outline-offset-2 focus-visible:maz:outline-primary motion-reduce:maz:transition-none maz:inline-flex maz:cursor-pointer maz:flex-center maz:rounded-md maz:bg-transparent maz:p-2 maz:text-foreground maz:transition-colors maz:duration-150 maz:ease-in-out maz:hover:bg-surface-600 maz:dark:hover:bg-surface-800/20"
    :aria-expanded="sidebar.open.value"
    :aria-controls="sidebar.id.value"
    :aria-label="sidebar.open.value ? 'Close sidebar' : 'Open sidebar'"
    @click="sidebar.toggle()"
  >
    <slot>
      <MazIcon :icon="MazChevronUpDown" size="1.5rem" class="maz:rotate-90" aria-hidden="true" />
    </slot>
  </button>
</template>
