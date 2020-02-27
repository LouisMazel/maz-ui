<template>
  <div class="calendar-picker px-2">
    <WeekDaysLabels class="my-3" />
    <MonthPicker
      :date-moment="dateMoment"
      class="mb-3"
    />
  </div>
</template>

<script>
  import WeekDaysLabels from './WeekDaysLabels'
  import MonthPicker from './MonthPicker'

  export default {
    name: 'CalendarPicker',
    components: { WeekDaysLabels, MonthPicker },
    props: {
      dateMoment: { type: Object, required: true }
    }
  }
</script>
