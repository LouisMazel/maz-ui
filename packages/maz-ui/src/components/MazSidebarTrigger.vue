<script lang="ts" setup>
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { useSidebar } from '../composables/useSidebar.ts'
import MazMorphIcon from './MazMorphIcon.vue'

const sidebar = useSidebar()
const { t } = useTranslations()
</script>

<template>
  <button
    type="button"
    class="m-sidebar-trigger m-reset-css maz:inline-flex maz:cursor-interactive maz:flex-center maz:rounded-md maz:bg-transparent maz:p-2 maz:text-foreground maz:focus-ring maz:transition-colors maz:duration-(--duration-fast) maz:ease-in-out maz:hover:bg-foreground/5 maz:motion-reduce:transition-none"
    :aria-expanded="sidebar.open.value"
    :aria-controls="sidebar.id.value"
    :aria-label="sidebar.open.value ? t('aria.closeSidebar') : t('aria.openSidebar')"
    @click="sidebar.toggle()"
  >
    <slot>
      <MazMorphIcon name="menu-close" :active="sidebar.open.value" size="1.5rem" />
    </slot>
  </button>
</template>
