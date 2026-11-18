<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarHeader) Must be used inside MazSidebar')
</script>

<template>
  <header
    class="m-sidebar-header m-reset-css maz:shrink-0"
    :class="{ 'maz:border-b maz:border-divider': sidebar.variant.value !== 'floating' }"
  >
    <slot />
  </header>
</template>
