<template>
  <transition name="maz-slide">
    <div
      v-if="isOpen"
      class="year-month-selector maz-p-2 maz-flex maz-direction-column"
    >
      <div class="maz-flex maz-justify-end maz-align-center">
        <div
          v-if="value === 'year'"
          class="maz-flex maz-align-center"
        >
          <MazBtn
            fab
            no-shadow
            size="mini"
            color="grey"
            class="maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
            tabindex="-1"
            @click="updateYears('prev')"
          >
            <ArrowIcon
              orientation="left"
              color="text-grey"
            />
          </MazBtn>
          <MazBtn
            fab
            no-shadow
            size="mini"
            color="grey"
            class="maz-flex maz-flex-center maz-mr-1 maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
            tabindex="-1"
            @click="updateYears('next')"
          >
            <ArrowIcon
              orientation="right"
              color="text-grey"
            />
          </MazBtn>
        </div>
        <MazBtn
          fab
          no-shadow
          size="mini"
          color="grey"
          tabindex="-1"
          class="year-month-selector__close maz-bg-transparent maz-hover-bg-color maz-no-focus-bg"
          @click="closePanel"
        >
          <i class="material-icons maz-text-color maz-fs-20">
            close
          </i>
        </MazBtn>
      </div>
      <div class="maz-flex-1 maz-flex maz-flex-wrap maz-space-between maz-align-center maz-pt-2">
        <MazBtn
          v-for="(m, i) in months"
          :key="i"
          :active="currentMonth === i"
          :class="[
            currentMonth !== i ? 'maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-primary': 'maz-focus-primary',
            { 'mx-3': hasDouble }
          ]"
          class="year-month-selector__btn maz-bg-transparent maz-no-shadow maz-px-3 maz-flex-20 maz-mx-1"
          tabindex="-1"
          @click="selectMonth(i)"
        >
          {{ m | capitalize }}
        </MazBtn>
        <MazBtn
          v-for="year in years"
          :key="year"
          :active="currentYear === year"
          size="md"
          tabindex="-1"
          :class="[currentYear !== year ? 'maz-hover-bg-color maz-no-focus-bg maz-border maz-border-color maz-text-primary': 'maz-focus-primary']"
          class="year-month-selector__btn maz-bg-transparent maz-no-shadow"
          @click="selectYear(year)"
        >
          {{ year }}
        </MazBtn>
      </div>
    </div>
  </transition>
</template>

<script>
import { getMonthsByFormat } from '../../../modules/month'
import ArrowIcon from './../../../../_subs/ArrowIcon'
import MazBtn from '../../../../MazBtn'

const ArrayRange = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => {
    const n = start + idx
    return n
  })
}

export default {
  name: 'YearMonthSelector',
  components: { ArrowIcon, MazBtn },
  props: {
    value: { type: String, default: null },
    month: { type: Object, required: true },
    hasDouble: { type: Boolean, required: true }
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
      this.months = getMonthsByFormat(this.hasDouble ? 'MMMM' : 'MMM')
    },
    getYears (offset = this.hasDouble ? 17 : 7) {
      this.months = []
      this.years = ArrayRange(this.month.year - offset, this.month.year + offset)
    },
    selectMonth (monthNumber) {
      this.$emit('change-month-year', { month: monthNumber, year: this.currentYear })
      this.closePanel()
    },
    selectYear (year) {
      this.$emit('change-month-year', { month: this.currentMonth, year: year })
      this.closePanel()
    },
    updateYears (period) {
      const offset = this.hasDouble ? 17 : 7
      const offsetYears = period === 'next' ? offset : -offset
      this.years = ArrayRange(this.years[0] + offsetYears, this.years[this.years.length - 1] + offsetYears)
    }
  }
}
</script>
