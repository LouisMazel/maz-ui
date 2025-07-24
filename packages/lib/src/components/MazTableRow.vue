<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazTableKey } from './MazTable.vue'

export interface MazTableRowProps {
  /** Override hoverable of table props */
  hoverable?: boolean
}

const {
  hoverable = true,
} = defineProps<MazTableRowProps>()

const { backgroundEven, backgroundOdd, hoverable: injectedHoverable } = useInjectStrict(mazTableKey)
</script>

<template>
  <tr
    class="m-table-row m-reset-css"
    :class="{
      '--hoverable': injectedHoverable && hoverable,
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
    @apply odd:maz-bg-surface-400;
  }

  &.--background-even {
    @apply even:maz-bg-surface-400;
  }

  &.--hoverable {
    @apply hover:maz-bg-surface-600 dark:hover:maz-bg-surface-300;
  }
}
</style>
