<template>
  <div class="month-year-switcher maz-flex maz-space-between maz-align-center maz-py-2">
    <MazBtn
      fab
      no-shadow
      color="grey"
      size="mini"
      class="month-year-switcher__previous maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
      tabindex="-1"
      @click="changeMonth('prev')"
    >
      <ArrowIcon orientation="left" />
    </MazBtn>
    <div
      class="maz-flex-1 maz-flex maz-flex-center"
    >
      <MazBtn
        no-shadow
        tabindex="-1"
        color="grey"
        class="maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2 maz-mr-1"
        @click="$emit('open-month-year-selector', 'month')"
      >
        <span
          v-for="(m, i) in months"
          :key="i"
        >
          {{ m.getFormatted() }}

          <span v-if="months.length > 1 && i === 0">-</span>
        </span>
      </MazBtn>
      <MazBtn
        tabindex="-1"
        no-shadow
        color="grey"
        class="maz-text-color maz-bg-transparent maz-hover-bg-color maz-no-focus-bg maz-p-2"
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
      class="maz-flex maz-flex-center maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
      @click="changeMonth('next')"
    >
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
    months: { type: Array, required: true }
  },
  computed: {
    year () {
      const years = this.months.map(m => m.getYear())
      return Array.from(new Set(years)).join(' - ')
    },
    isDouble () {
      return this.months && this.months.length > 1
    }
  },
  methods: {
    changeMonth (val) {
      this.$emit('change-month', val)
    }
  }
}
</script>
