<template>
  <div
    class="year-month-selector flex direction-column"
    :class="{'dark': dark}"
  >
    <div class="flex justify-end">
      <CustomButton
        :color="dark ? '#757575' : '#424242'"
        :dark="dark"
        with-border
        @click="$emit('back')"
      >
        <span class="fs-16">
          ✕
        </span>
      </CustomButton>
    </div>
    <div class="flex-1 flex flex--wrap space-between align-center">
      <CustomButton
        v-for="(m, index) in months"
        :key="index"
        :color="color"
        :selected="currentMonth === index"
        :dark="dark"
        class="month-button"
        with-border
        @click="selectMonth(index)"
      >
        {{ m }}
      </CustomButton>
      <CustomButton
        v-for="year in years"
        :key="year"
        :color="color"
        :dark="dark"
        :selected="currentYear === year"
        with-border
        @click="selectYear(year)"
      >
        {{ year }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import { getMonthsShort } from '../../../../../modules/month'
import CustomButton from '../../../../../_subs/CustomButton'

const ArrayRange = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => {
    const n = start + idx
    return n
  })
}

export default {
  name: 'YearMonthSelector',
  components: {
    CustomButton
  },
  props: {
    locale: { type: String, default: null },
    dark: { type: Boolean, default: null },
    color: { type: String, default: null },
    mode: { type: String, default: null },
    month: { type: Object, default: null }
  },
  data () {
    return {
      months: null,
      years: null
    }
  },
  computed: {
    currentMonth () {
      return this.month.month
    },
    currentYear () {
      return this.month.year
    },
    isMonthMode () {
      return this.mode === 'month'
    }
  },
  mounted () {
    if (this.isMonthMode) {
      this.getMonths()
    } else {
      this.getYears()
    }
  },
  methods: {
    getMonths () {
      this.years = null
      this.months = getMonthsShort(this.locale)
    },
    getYears () {
      this.months = null
      this.years = ArrayRange(this.month.year - 7, this.month.year + 7)
    },
    selectMonth (monthNumber) {
      this.$emit('input', { month: monthNumber, year: this.currentYear })
    },
    selectYear (year) {
      this.$emit('input', { month: this.currentMonth, year: year })
    }
  }
}
</script>
