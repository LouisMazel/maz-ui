<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazTableKey } from './MazTable.vue'

export interface MazTableRowProps {
  /** Override hoverable of table props */
  noHoverable?: boolean
}

defineProps<MazTableRowProps>()
const { hoverable, backgroundEven, backgroundOdd } = useInjectStrict(mazTableKey)
</script>

<template>
  <tr
    class="m-table-row m-reset-css"
    :class="{
      '--hoverable': hoverable && !noHoverable,
      '--background-odd': backgroundOdd,
      '--background-even': backgroundEven,
    }"
  >
    <slot />
  </tr>
</template>

<style lang="postcss" scoped>
  .m-table-row {
  &.--background-odd {
    @apply odd:maz-bg-surface-300 dark:odd:maz-bg-surface-400;
  }

  &.--background-even {
    @apply even:maz-bg-surface-300 dark:even:maz-bg-surface-400;
  }

  &.--hoverable {
    &:hover {
      @apply maz-cursor-pointer maz-bg-surface-600;
    }
  }
}
</style>
