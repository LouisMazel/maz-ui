<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

export interface MazSidebarGroupProps {
  /** Optional label for the group */
  label?: string
}

defineProps<MazSidebarGroupProps>()

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarGroup) Must be used inside MazSidebar')
</script>

<template>
  <div class="m-sidebar-group maz:flex maz:flex-col maz:gap-1 maz:py-2">
    <p
      v-if="label"
      class="m-sidebar-group__label maz:px-3 maz:py-1 maz:text-xs maz:font-semibold maz:tracking-wider maz:text-muted maz:uppercase"
      :class="{ 'maz:sr-only': sidebar.collapsible.value === 'icon' && sidebar.state.value === 'collapsed' }"
    >
      {{ label }}
    </p>
    <slot />
  </div>
</template>
