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
      'maz:hover:bg-surface-600/50 maz:dark:hover:bg-surface-300': injectedHoverable && hoverable && !isHead,
      'maz:odd:bg-surface-600 maz:dark:odd:bg-surface-400': backgroundOdd,
      'maz:even:bg-surface-600 maz:dark:even:bg-surface-400': backgroundEven,
    }"
  >
    <slot />
  </tr>
</template>
