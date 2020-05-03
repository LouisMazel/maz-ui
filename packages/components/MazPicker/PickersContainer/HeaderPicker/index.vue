<template>
  <div
    class="header-picker p-2 bg-primary text-white"
  >
    <TransitionGroup
      :name="transitionName"
      tag="div"
      class="header-picker__year dots-text"
    >
      <span
        v-for="y in [year]"
        :key="y"
      >
        {{ y }}
      </span>
    </TransitionGroup>
    <TransitionGroup
      :name="transitionName"
      tag="div"
      class="header-picker__date dots-text"
    >
      <span
        v-for="date in [dateFormatted]"
        :key="date"
        class="dots-text"
      >
        {{ dateFormatted ? date : '-' }}
      </span>
    </TransitionGroup>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getFormattedValuesIntl } from './../../utils'

  export default {
    name: 'HeaderPicker',
    props: {
      value: { type: Object, default: null },
      locale: { type: String, required: true }
    },
    data () {
      return {
        transitionName: 'slidevnext',
        currentDate: null
      }
    },
    computed: {
      isRangeMode () {
        return !!this.value && Object.keys(this.value).includes('start')
      },
      currentValue () {
        if (this.isRangeMode) {
          return this.value.end || moment()
        }
        return this.value || moment()
      },
      year () {
        return this.currentValue.year()
      },
      dateFormatted () {
        const dates = []
        const { locale } = this
        if (this.isRangeMode) {
          dates.push(this.value.start, this.value.end)
        } else {
          dates.push(this.value)
        }
        return getFormattedValuesIntl({ locale, dates })
      }
    },
    watch: {
      value () {
        const newValueIsSmaller = this.currentDate > this.currentValue
        this.transitionName = newValueIsSmaller ? 'slidevprev' : 'slidevnext'
        this.$nextTick(() => { this.currentDate = this.currentValue })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-picker {
    overflow: hidden;

    &__year {
      opacity: .7;
      height: 21px;
    }

    &__date {
      min-height: 0;
      height: 26px;
      font-size: 1.285em;
    }
  }
</style>
