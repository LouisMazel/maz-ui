<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarHeader) Must be used inside MazSidebar')
</script>

<template>
  <header class="m-sidebar-header m-reset-css maz:shrink-0 maz:border-b maz:border-divider">
    <slot />
  </header>
</template>
