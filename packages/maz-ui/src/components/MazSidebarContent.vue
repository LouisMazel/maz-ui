<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarContent) Must be used inside MazSidebar')
</script>

<template>
  <div class="m-sidebar-content m-reset-css maz:flex-1 maz:overflow-x-hidden maz:overflow-y-auto maz:p-1">
    <slot />
  </div>
</template>
