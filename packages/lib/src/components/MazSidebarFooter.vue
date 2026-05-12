<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarFooter) Must be used inside MazSidebar')
</script>

<template>
  <footer class="m-sidebar-footer maz:shrink-0 maz:border-t maz:border-divider">
    <slot />
  </footer>
</template>
