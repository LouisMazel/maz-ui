<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazTableKey } from './MazTable.vue'

export interface MazTableRowProps {
  /** Override hoverable of table props */
  hoverable?: boolean
  /** If true, the row is a head row */
  isHead?: boolean
}

const {
  hoverable = true,
  isHead = false,
} = defineProps<MazTableRowProps>()

const { backgroundEven, backgroundOdd, hoverable: injectedHoverable } = useInjectStrict(mazTableKey)
</script>

<template>
  <tr
    class="m-table-row m-reset-css"
    :class="{
      '--hoverable': injectedHoverable && hoverable && !isHead,
      '--background-odd': backgroundOdd,
      '--background-even': backgroundEven,
    }"
  >
    <slot />
  </tr>
</template>

<style scoped>
.m-table-row {
  &.--background-odd {
    @apply odd:maz-bg-surface-600 dark:odd:maz-bg-surface-400;
  }

  &.--background-even {
    @apply even:maz-bg-surface-600 dark:even:maz-bg-surface-400;
  }

  &.--hoverable {
    @apply hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-300;
  }
}
</style>
