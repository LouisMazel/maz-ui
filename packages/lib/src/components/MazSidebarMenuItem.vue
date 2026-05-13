<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarMenuItem) Must be used inside MazSidebar')
</script>

<template>
  <li class="m-sidebar-menu-item m-reset-css maz:m-0 maz:list-none maz:p-0" role="none">
    <slot />
  </li>
</template>
