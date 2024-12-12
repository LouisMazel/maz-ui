<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    ArrowLeft: () => import('@/assets/icons/arrow_left.svg'),
    ArrowRight: () => import('@/assets/icons/arrow_right.svg'),
  },
})
export default class CalendarWeekButton extends Vue {
  @Prop({
    default: 'previous',
    type: String,
  })
    variant!: 'next' | 'previous'

  get iconComponent(): string {
    return this.variant === 'previous' ? 'ArrowLeft' : 'ArrowRight'
  }
}
</script>

<template>
  <button class="calendar-week-button" type="button" @click="$emit('click', $event)">
    <Component
      :is="iconComponent"
      class="fill-current text-gray-text"
      name="arrow_left"
      width="24px"
      height="24px"
    />
  </button>
</template>

<style lang="scss" scoped>
  .calendar-week-button {
  @apply flex cursor-pointer select-none items-center rounded bg-white p-1 hover:bg-neutral-l;

  &:disabled {
    @apply cursor-not-allowed bg-neutral-l;
  }
}
</style>
