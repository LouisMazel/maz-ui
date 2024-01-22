<template>
  <tr
    class="m-table-row"
    :class="{
      '--hoverable': hoverable && !noHoverable,
      '--background-odd': backgroundOdd,
      '--background-even': backgroundEven,
    }"
  >
    <slot></slot>
  </tr>
</template>

<script lang="ts" setup>
  import { injectStrict } from './../modules/helpers/inject-strict'
  import type { MazTableProvide } from './MazTable.vue'

  export type Props = {
    /** Override hoverable of table props */
    noHoverable?: boolean
  }

  defineProps<Props>()

  const { hoverable, backgroundEven, backgroundOdd } = injectStrict<MazTableProvide>('maz-table')
</script>

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
        @apply maz-cursor-pointer maz-bg-color-light dark:maz-bg-color-lighter;
      }
    }
  }
</style>
