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
      >
        {{ value ? date : '...' | capitalize }}
      </span>
    </TransitionGroup>
  </div>
</template>

<script>

  const FORMAT_OPTIONS = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }

  export default {
    name: 'HeaderPicker',
    props: {
      value: { type: Object, required: true },
      locale: { type: String, required: true }
    },
    data () {
      return {
        transitionName: 'slidevnext',
        currentDate: this.currentValue
      }
    },
    computed: {
      currentValue () {
        return this.value.end ? this.value.end : this.value
      },
      year () {
        return this.currentValue.year()
      },
      dateFormatted () {
        return new Intl.DateTimeFormat(this.locale, FORMAT_OPTIONS).format(this.currentValue.toDate())
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
      height: 24px;
      opacity: .7;
    }

    &__date {
      height: 30px;
      min-height: 0;
      font-size: 1.285em;
    }
  }
</style>
