<template>
  <transition name="slide">
    <div
      v-if="isOpen"
      class="year-month-selector bg-color-light p-2 flex direction-column"
    >
      <div class="flex justify-end align-center">
        <div
          v-if="value === 'year'"
          class="flex align-center"
        >
          <MazBtn
            fab
            no-shadow
            size="mini"
            color="grey"
            class="flex flex-center mr-1 bg-transparent hover-color focus-none"
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
            class="flex flex-center mr-1 bg-transparent hover-color focus-none"
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
          class="year-month-selector__close bg-transparent hover-color focus-none"
          @click="closePanel"
        >
          <i class="material-icons text-color fs-20">
            close
          </i>
        </MazBtn>
      </div>
      <div class="flex-1 flex flex--wrap space-between align-center pt-2">
        <MazBtn
          v-for="(m, i) in months"
          :key="i"
          :active="currentMonth === i"
          :class="[currentMonth !== i ? 'hover-color focus-none border-2 border-color text-primary': 'focus-primary']"
          class="year-month-selector__btn bg-transparent no-shadow px-3"
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
          :class="[currentYear !== year ? 'hover-color focus-none border-2 border-color text-primary': 'focus-primary']"
          class="year-month-selector__btn bg-transparent no-shadow"
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
  import ArrowIcon from './../../../../_subs/ArrowIcon'

  const ArrayRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      return n
    })
  }

  export default {
    name: 'YearMonthSelector',
    components: { ArrowIcon },
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
      },
      updateYears (period) {
        const offsetYears = period === 'next' ? 14 : -14
        this.years = ArrayRange(this.years[0] + offsetYears, this.years[14] + offsetYears)
      }
    }
  }
</script>

<style lang="scss">
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
