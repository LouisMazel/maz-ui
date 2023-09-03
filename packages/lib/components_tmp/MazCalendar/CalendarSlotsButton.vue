<template>
  <div class="calendar-slots-button relative flex w-full gap-2" :class="{ 'px-2': noXOffset }">
    <div v-if="!noXOffset" class="w-7 flex-none"></div>
    <button v-bind="$attrs" type="button" @click="$emit('click', $event)">
      <span>
        <slot></slot>
      </span>
    </button>
    <div v-if="!noXOffset" class="w-7 flex-none"></div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'nuxt-property-decorator'

  @Component
  export default class CalendarSlotsButton extends Vue {
    @Prop({ default: 'previous', type: String })
    variant!: 'next' | 'previous'

    @Prop({ type: Boolean, default: false })
    noXOffset!: boolean
  }
</script>

<style lang="postcss" scoped>
  .calendar-slots-button > button {
    @apply flex w-full select-none items-center justify-center rounded bg-white py-0.5 px-1 text-xs font-semibold uppercase;

    &:not(:disabled) {
      @apply cursor-pointer text-neutral-80 hover:bg-neutral-l;
    }

    &:disabled {
      @apply cursor-not-allowed text-neutral-20;
    }
  }
</style>
