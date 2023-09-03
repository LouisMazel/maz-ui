<template>
  <div class="bg-info-l py-1 px-4 text-center text-sm text-info-default">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'nuxt-property-decorator'

  @Component({})
  export default class CalendarBanner extends Vue {}
</script>
