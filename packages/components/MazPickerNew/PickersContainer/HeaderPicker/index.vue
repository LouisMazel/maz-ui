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
  export default {
    name: 'HeaderPicker',
    props: {
      value: { type: Object, required: true }
    },
    data () {
      return {
        transitionName: 'slidevnext',
        currentDate: this.value
      }
    },
    computed: {
      year () {
        return this.value.year()
      },
      dateFormatted () {
        return this.value.format('ddd D MMM')
      }
    },
    watch: {
      value (value) {
        const newValueIsSmaller = this.currentDate > value
        this.transitionName = newValueIsSmaller ? 'slidevprev' : 'slidevnext'
        this.$nextTick(() => { this.currentDate = value })
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
