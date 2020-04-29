<template>
  <transition name="slide">
    <div
      v-if="isOpen"
      class="year-month-selector bg-color-light p-2 flex direction-column"
    >
      <div class="flex justify-end">
        <MazBtn
          fab
          size="mini"
          color="primary"
          outline
          @click="closePanel"
        >
          <span class="fs-16">
            ✕
          </span>
        </MazBtn>
      </div>
      <div class="flex-1 flex flex--wrap space-between align-center pt-2">
        <MazBtn
          v-for="(m, i) in months"
          :key="i"
          :active="currentMonth === i"
          class="month-button"
          outline
          size="md"
          @click="selectMonth(i)"
        >
          {{ m }}
        </MazBtn>
        <MazBtn
          v-for="year in years"
          :key="year"
          :active="currentYear === year"
          outline
          size="md"
          @click="selectYear(year)"
        >
          {{ year }}
        </MazBtn>
      </div>
    </div>
  </transition>
</template>

<script>
  import { getMonthsShort } from '../../../modules/month'

  const ArrayRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      return n
    })
  }

  export default {
    name: 'YearMonthSelector',
    props: {
      value: { type: String, default: null },
      month: { type: Object, required: true }
    },
    data () {
      return {
        years: [],
        months: []
      }
    },
    computed: {
      isOpen () {
        return this.value !== null
      },
      currentMonth () {
        return this.month.month
      },
      currentYear () {
        return this.month.year
      },
      isMonthMode () {
        return this.value === 'month'
      }
    },
    watch: {
      value: {
        handler () {
          this.isMonthMode ? this.getMonths() : this.getYears()
        },
        immediate: true
      }
    },
    methods: {
      closePanel () {
        this.$emit('input', null)
      },
      getMonths () {
        this.years = []
        this.months = getMonthsShort()
      },
      getYears () {
        this.months = []
        this.years = ArrayRange(this.month.year - 7, this.month.year + 7)
      },
      selectMonth (monthNumber) {
        this.$emit('change-month-year', { month: monthNumber, year: this.currentYear })
        this.closePanel()
      },
      selectYear (year) {
        this.$emit('change-month-year', { month: this.currentMonth, year: year })
        this.closePanel()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .year-month-selector {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
</style>
