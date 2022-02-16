<template>
  <div
    class="month-year-switcher maz-space-between maz-align-center maz-flex maz-py-2"
  >
    <MazBtn
      fab
      no-shadow
      color="grey"
      size="mini"
      class="month-year-switcher__previous maz-hover-bg-color maz-no-focus-bg maz-flex maz-bg-transparent maz-flex-center"
      tabindex="-1"
      @click="changeMonth('prev')"
    >
      <!-- TODO: remove -->
      <ArrowIcon orientation="left" />
    </MazBtn>
    <div class="maz-flex maz-flex-1 maz-flex-center">
      <MazBtn
        no-shadow
        tabindex="-1"
        color="grey"
        class="maz-hover-bg-color maz-no-focus-bg maz-mr-1 maz-bg-transparent maz-p-2 maz-text-color"
        @click="$emit('open-month-year-selector', 'month')"
      >
        <span v-for="(m, i) in months" :key="i">
          {{ m.getFormatted() }}
          <span v-if="months.length > 1 && i === 0"> -&nbsp; </span>
        </span>
      </MazBtn>
      <MazBtn
        tabindex="-1"
        no-shadow
        color="grey"
        class="maz-hover-bg-color maz-no-focus-bg maz-bg-transparent maz-p-2 maz-text-color"
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
      class="maz-hover-bg-color maz-no-focus-bg maz-flex maz-bg-transparent maz-flex-center"
      @click="changeMonth('next')"
    >
      <!-- TODO: remove -->
      <ArrowIcon orientation="right" />
    </MazBtn>
  </div>
</template>

<script>
  import ArrowIcon from './../../../../_subs/ArrowIcon'
  import MazBtn from '../../../../MazBtn'

  export default {
    name: 'MonthYearSwitcher',
    components: { ArrowIcon, MazBtn },
    props: {
      months: { type: Array, required: true },
    },
    computed: {
      year() {
        const years = this.months.map((m) => m.getYear())
        return Array.from(new Set(years)).join(' - ')
      },
      isDouble() {
        return this.months && this.months.length > 1
      },
    },
    methods: {
      changeMonth(val) {
        this.$emit('change-month', val)
      },
    },
  }
</script>
