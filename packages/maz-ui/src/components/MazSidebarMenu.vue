<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarMenu) Must be used inside MazSidebar')
</script>

<template>
  <ul
    class="m-sidebar-menu m-reset-css maz:m-0 maz:flex maz:list-none maz:flex-col maz:p-0"
    :class="sidebar.variant.value === 'floating' ? 'maz:gap-px' : 'maz:gap-1'"
  >
    <slot />
  </ul>
</template>
