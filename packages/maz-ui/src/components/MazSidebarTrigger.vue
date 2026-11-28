<script lang="ts" setup>
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed } from 'vue'
import { useSidebar } from '../composables/useSidebar.ts'
import MazMorphIcon from './MazMorphIcon.vue'

const sidebar = useSidebar()
const { t } = useTranslations()

const isRail = computed(() => sidebar.state.value === 'collapsed' && sidebar.collapsible.value !== 'offcanvas' && sidebar.mode.value === 'push')
const isFloating = computed(() => sidebar.variant.value === 'floating')
</script>

<template>
  <button
    type="button"
    class="m-sidebar-trigger m-reset-css maz:cursor-interactive maz:flex-center maz:rounded-md maz:bg-transparent maz:text-foreground maz:focus-ring maz:transition-colors maz:duration-(--duration-fast) maz:ease-in-out maz:hover:bg-foreground/5 maz:motion-reduce:transition-none"
    :class="isRail ? 'maz:mx-auto maz:flex maz:p-0.5' : ['maz:inline-flex', isFloating ? 'maz:p-1' : 'maz:p-2']"
    :aria-expanded="sidebar.open.value"
    :aria-controls="sidebar.id.value"
    :aria-label="sidebar.open.value ? t('aria.closeSidebar') : t('aria.openSidebar')"
    @click="sidebar.toggle()"
  >
    <slot>
      <MazMorphIcon name="menu-close" :active="sidebar.open.value" :size="isFloating ? '1.125rem' : '1.5rem'" />
    </slot>
  </button>
</template>
