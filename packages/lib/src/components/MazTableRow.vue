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
    @apply odd:maz-bg-color-lighter dark:odd:maz-bg-color-light;
  }

  &.--background-even {
    @apply even:maz-bg-color-lighter dark:even:maz-bg-color-light;
  }

  &.--hoverable {
    &:hover {
      @apply maz-cursor-pointer maz-bg-color-dark;
    }
  }
}
</style>
