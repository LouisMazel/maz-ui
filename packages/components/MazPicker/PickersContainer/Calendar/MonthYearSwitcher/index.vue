<template>
  <div class="month-year-switcher flex space-between align-center py-2">
    <MazBtn
      fab
      no-shadow
      color="grey"
      size="mini"
      class="flex flex-center bg-transparent hover-color focus-none"
      tabindex="-1"
      @click="changeMonth('prev')"
    >
      <ArrowIcon orientation="left" />
    </MazBtn>
    <div>
      <MazBtn
        no-shadow
        tabindex="-1"
        size="lg"
        color="grey"
        class="text-color bg-transparent hover-color focus-none p-2 mr-1"
        @click="$emit('open-month-year-selector', 'month')"
      >
        {{ getMonthFormatted() }}
      </MazBtn>
      <MazBtn
        tabindex="-1"
        no-shadow
        color="grey"
        size="lg"
        class="text-color bg-transparent hover-color focus-none p-2"
        @click="$emit('open-month-year-selector', 'year')"
      >
        {{ year }}
      </MazBtn>
    </div>
    <MazBtn
      fab
      no-shadow
      color="grey"
      size="mini"
      tabindex="-1"
      class="flex flex-center bg-transparent hover-color focus-none"
      @click="changeMonth('next')"
    >
      <ArrowIcon orientation="right" />
    </MazBtn>
  </div>
</template>

<script>
  import ArrowIcon from './../../../../_subs/ArrowIcon'

  export default {
    name: 'MonthYearSwitcher',
    components: { ArrowIcon },
    props: {
      months: { type: Array, required: true }
    },
    computed: {
      year () {
        const years = this.months.map(m => m.getYear())
        return Array.from(new Set(years)).join(' - ')
      }
    },
    methods: {
      changeMonth (val) {
        this.$emit('change-month', val)
      },
      getMonthFormatted () {
        return this.months.map(m => this.$options.filters.capitalize(m.getFormatted())).join(' - ')
      }
    }
  }
</script>
