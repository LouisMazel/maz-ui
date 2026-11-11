<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarFooter) Must be used inside MazSidebar')
</script>

<template>
  <footer
    class="m-sidebar-footer m-reset-css maz:shrink-0"
    :class="{ 'maz:border-t maz:border-divider': sidebar.variant.value !== 'floating' }"
  >
    <slot />
  </footer>
</template>
