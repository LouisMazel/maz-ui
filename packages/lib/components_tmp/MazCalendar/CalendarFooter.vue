<template>
  <div
    class="calendar-slot flex w-full gap-2 border-t border-gray-stroke py-2"
    :class="{ 'px-2': noXOffset }"
  >
    <div v-if="!noXOffset" class="w-7"></div>
    <div class="flex-1">
      <slot>
        <span class="text-sm">
          <slot name="text"></slot>
        </span>
      </slot>
    </div>
    <div v-if="!noXOffset" class="w-7"></div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class CalendarSlotsButton extends Vue {
    @Prop({ type: Boolean, default: false })
    noXOffset!: boolean
  }
</script>
