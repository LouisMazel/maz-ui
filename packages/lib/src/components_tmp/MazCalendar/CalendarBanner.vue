<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class CalendarBanner extends Vue {}
</script>

<template>
  <div class="bg-info-l py-1 px-4 text-center text-sm text-info-default">
    <span>
      <slot />
    </span>
  </div>
</template>
