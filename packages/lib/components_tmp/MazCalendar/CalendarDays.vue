<template>
  <div
    class="calendar-slot flex items-center gap-2 border-b border-gray-stroke py-1"
    :class="{ 'px-2': noWeekSwitch }"
  >
    <div v-if="!noWeekSwitch" class="flex w-7 items-center justify-center">
      <CalendarWeekButton
        variant="previous"
        :disabled="!canBackWeek"
        @click="$emit('previous-week', $event)"
      />
    </div>
    <div v-for="(day, index) in days" :key="index" class="flex flex-1 flex-col truncate">
      <span v-if="!noShowDay" class="w-full truncate text-center text-sm font-normal capitalize">
        {{ formattedDay(day.date) }}
      </span>
      <span v-if="!noShowDate" class="w-full truncate text-center text-sm font-bold">
        {{ formattedDate(day.date) }}
      </span>
    </div>
    <div v-if="!noWeekSwitch" class="flex w-7 items-center justify-center">
      <CalendarWeekButton
        variant="next"
        :disabled="!canForwardWeek"
        @click="$emit('next-week', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'nuxt-property-decorator'
  import type { Day } from './types'

  import CalendarWeekButton from './CalendarWeekButton.vue'

  @Component({
    components: { CalendarWeekButton },
  })
  export default class CalendarDays extends Vue {
    @Prop({ required: true, type: Array })
    days!: Day[]

    @Prop({ default: 'dddd', type: String })
    dayFormat!: string

    @Prop({ default: 'll', type: String })
    dateFormat!: string

    @Prop({ type: Boolean, default: false })
    noWeekSwitch!: boolean

    @Prop({ type: Boolean, default: false })
    canBackWeek!: boolean

    @Prop({ default: false, type: Boolean })
    canForwardWeek!: boolean

    @Prop({ default: false, type: Boolean })
    noShowDay!: boolean

    @Prop({ default: false, type: Boolean })
    noShowDate!: boolean

    formattedDay(date: string) {
      return this.$dayjs(date).format(this.dayFormat)
    }

    formattedDate(date: string) {
      return this.$dayjs(date).format(this.dateFormat)
    }
  }
</script>
