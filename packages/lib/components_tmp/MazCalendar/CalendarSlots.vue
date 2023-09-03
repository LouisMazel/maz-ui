<template>
  <div class="calendar-slots relative flex w-full gap-2 py-2">
    <div v-if="!noXOffset" class="w-7"></div>
    <div
      v-for="({ slots }, dayIndex) in daysWithSlotsArray"
      :key="dayIndex"
      class="flex-1 space-y-0.5"
    >
      <CalendarSlot
        v-for="(slot, slotIndex) in slots"
        :key="slotIndex"
        :time-slot="slot"
        :format="slotFormat"
        :selected-slots="selectedSlots"
        :max-slots-reached="maxSlotsReached"
        :show-end-date-slot="showEndDateSlot"
        @click="selectSlot(slot)"
      />
    </div>
    <div v-if="!noXOffset" class="w-7"></div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import CalendarSlot from './CalendarSlot.vue'
  import type { Day, DaySlot } from './types'

  @Component({
    components: { CalendarSlot },
  })
  export default class CalendarSlots extends Vue {
    @Prop({ type: Boolean, default: false })
    noXOffset!: boolean

    @Prop({ type: () => [], required: true })
    days!: Day[]

    @Prop({ default: () => [], type: Array })
    selectedSlots!: DaySlot[]

    @Prop({ default: 'LT', type: String })
    slotFormat!: string

    @Prop({ type: Boolean, default: false })
    maxSlotsReached!: boolean

    @Prop({ type: Boolean, default: false })
    showEndDateSlot?: boolean

    selectSlot(slot: DaySlot) {
      this.$emit('select-slot', slot)
    }

    get daysWithSlotsArray() {
      return this.days.map((day) => ({
        ...day,
        slots: day.slots ?? [],
      }))
    }
  }
</script>
