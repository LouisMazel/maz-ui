<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarSeparator) Must be used inside MazSidebar')
</script>

<template>
  <hr class="m-sidebar-separator maz:my-2 maz:border-0 maz:border-t maz:border-divider">
</template>
