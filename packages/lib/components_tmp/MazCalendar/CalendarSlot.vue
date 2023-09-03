<template>
  <button
    data-cy="calendar-slot"
    :disabled="isDisabled || isNotAllowedToBeSelected"
    class="Calendar--Slot flex items-center justify-center"
    :data-count="badgeCount"
    type="button"
    :class="[
      { 'Calendar--Slot--disabled': isDisabled || isNotAllowedToBeSelected },
      { 'Calendar--Slot--has-badge': badgeCount },
      { 'Calendar--Slot--highlighted': isHightlighted },
      { 'Calendar--Slot--warning': isWarned },
      { 'Calendar--Slot--blocked': isBlocked },
      { 'Calendar--Slot--selected': isSelected },
    ]"
    @click="$emit('click', $event)"
  >
    <span class="truncate">{{ slotText }}</span>
  </button>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import type { DaySlot } from './types'

  @Component
  export default class CalendarSlot extends Vue {
    @Prop({ type: String, default: 'LT' })
    format!: string

    @Prop({ type: Object, required: true })
    timeSlot!: DaySlot

    @Prop({ type: Boolean, default: false })
    showEndDateSlot?: boolean

    @Prop({ type: Boolean, default: false })
    maxSlotsReached!: boolean

    @Prop({ default: () => [], type: Array })
    selectedSlots!: DaySlot[]

    get isDisabled() {
      return this.timeSlot.options?.disabled || this.timeSlot.options?.blocked
    }

    get isNotAllowedToBeSelected() {
      return this.maxSlotsReached && !this.isSelected
    }

    get badgeCount() {
      return this.timeSlot.options?.badge
    }

    get isHightlighted() {
      return this.timeSlot.options?.highlighted
    }

    get isWarned() {
      return this.timeSlot.options?.warning
    }

    get isBlocked() {
      return this.timeSlot.options?.blocked
    }

    get slotText() {
      return this.showEndDateSlot
        ? `${this.$dayjs(this.timeSlot.start).format(this.format)} - ${this.$dayjs(
            this.timeSlot.end,
          ).format(this.format)}`
        : this.$dayjs(this.timeSlot.start).format(this.format)
    }

    get isSelected() {
      return this.selectedSlots.some(
        ({ start, end }) =>
          this.isSameDate(this.timeSlot.start, start) && this.isSameDate(this.timeSlot.end, end),
      )
    }

    isSameDate(selectedDate: string, slotDate: string) {
      return this.$dayjs(selectedDate).isSame(slotDate)
    }
  }
</script>

<style lang="scss" scoped>
  .Calendar--Slot {
    @apply relative w-full cursor-pointer select-none rounded bg-neutral-l py-1 px-0 text-center text-sm font-normal;

    &:not(:disabled) {
      @apply hover:bg-neutral-20;
    }

    p {
      line-height: 22px;
    }

    &:focus-visible::before {
      content: '';
      @apply absolute -inset-2 rounded-md border-2 border-solid border-info-default;
    }

    &--disabled {
      @apply cursor-not-allowed bg-white text-neutral-60;
    }

    &--blocked {
      @apply bg-red-200 text-red-600;

      &:not(:disabled) {
        @apply hover:bg-red-200;
      }
    }

    &--highlighted {
      @apply bg-success-l text-success-default;

      &:not(:disabled) {
        @apply hover:bg-secondary-default/20;
      }
    }

    &--warning {
      @apply bg-yellow-300 text-yellow-900;

      &:not(:disabled) {
        @apply hover:bg-yellow-400;
      }
    }

    &--selected {
      @apply bg-green-700 text-white;

      &:not(:disabled) {
        @apply hover:bg-green-800;
      }
    }

    &--has-badge::after {
      content: attr(data-count);
      line-height: 20px;

      @apply absolute -top-2 -right-2 flex h-2.5 w-2.5 items-center justify-center rounded-md border-2 border-white bg-neutral-default text-xs text-white;
    }
  }
</style>
