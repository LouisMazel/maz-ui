<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class CalendarDays extends Vue {}
</script>

<template>
  <div class="flex w-full flex-1 items-center justify-center py-2 text-center">
    <slot />
  </div>
</template>
