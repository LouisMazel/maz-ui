<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class CalendarSlotsButton extends Vue {
  @Prop({ type: Boolean, default: false })
    noXOffset!: boolean
}
</script>

<template>
  <div
    class="calendar-slot flex w-full gap-2 border-t border-gray-stroke py-2"
    :class="{ 'px-2': noXOffset }"
  >
    <div v-if="!noXOffset" class="w-7" />
    <div class="flex-1">
      <slot>
        <span class="text-sm">
          <slot name="text" />
        </span>
      </slot>
    </div>
    <div v-if="!noXOffset" class="w-7" />
  </div>
</template>
