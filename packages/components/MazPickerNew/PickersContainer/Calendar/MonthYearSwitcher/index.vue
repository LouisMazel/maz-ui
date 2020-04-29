<template>
  <div class="month-year-switcher flex space-between align-center py-2">
    <MazBtn
      fab
      no-shadow
      color="light"
      size="sm"
      class="flex flex-center bg-transparent"
      tabindex="-1"
      @click="changeMonth('prev')"
    >
      <ArrowLeft />
    </MazBtn>
    <div>
      <MazBtn
        no-shadow
        tabindex="-1"
        color="transparent"
        class="text-color p-2 mr-1"
        @click="$emit('open-month-year-selector', 'month')"
      >
        {{ monthFormatted | capitalize }}
      </MazBtn>
      <MazBtn
        tabindex="-1"
        no-shadow
        color="transparent"
        class="text-color p-2"
        @click="$emit('open-month-year-selector', 'year')"
      >
        {{ year }}
      </MazBtn>
    </div>
    <MazBtn
      fab
      no-shadow
      color="transparent"
      size="sm"
      tabindex="-1"
      class="flex flex-center"
      @click="changeMonth('next')"
    >
      <ArrowRight />
    </MazBtn>
  </div>
</template>

<script>
  import ArrowLeft from './../../../../_subs/ArrowLeft'
  import ArrowRight from './../../../../_subs/ArrowRight'

  export default {
    name: 'MonthYearSwitcher',
    components: { ArrowLeft, ArrowRight },
    props: {
      month: { type: Object, required: true }
    },
    computed: {
      monthFormatted () {
        return this.month.getFormatted()
      },
      year () {
        return this.month.getYear()
      }
    },
    methods: {
      changeMonth (val) {
        this.$emit('change-month', val)
      }
    }
  }
</script>
