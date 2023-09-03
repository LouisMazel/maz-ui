<template>
  <div class="flex w-full flex-1 items-center justify-center py-2 text-center">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'nuxt-property-decorator'

  @Component({})
  export default class CalendarDays extends Vue {}
</script>
