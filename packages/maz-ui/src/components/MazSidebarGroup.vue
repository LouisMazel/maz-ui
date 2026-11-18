<script lang="ts" setup>
import { computed } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazSidebarKey } from './MazSidebar.vue'

export interface MazSidebarGroupProps {
  /** Optional label for the group */
  label?: string
}

defineProps<MazSidebarGroupProps>()

const sidebar = useInjectStrict(mazSidebarKey, undefined, '[maz-ui](MazSidebarGroup) Must be used inside MazSidebar')

const isIconCollapsed = computed(() => sidebar.collapsible.value === 'icon' && sidebar.state.value === 'collapsed')
</script>

<template>
  <div class="m-sidebar-group m-reset-css maz:flex maz:flex-col maz:gap-1 maz:py-2">
    <p
      v-if="label"
      class="m-sidebar-group__label maz:px-3 maz:py-1 maz:text-muted"
      :class="[
        sidebar.variant.value === 'floating' ? 'maz:text-caption maz:font-semibold' : 'maz:text-overline maz:uppercase',
        { 'maz:sr-only': isIconCollapsed },
      ]"
    >
      {{ label }}
    </p>
    <!-- Collapsed to icons, the label leaves a hairline between the groups, like the sidebars of macOS -->
    <span v-if="label && isIconCollapsed && sidebar.variant.value === 'floating'" aria-hidden="true" class="m-sidebar-group__separator maz:mx-auto maz:my-1 maz:h-px maz:w-6 maz:bg-divider" />
    <slot />
  </div>
</template>
