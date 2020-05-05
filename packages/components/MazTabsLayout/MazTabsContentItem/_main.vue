<template>
  <div
    :id="_uid"
    ref="MazTabsContentItem"
    :class="{
      'maz-h-0' : !isCurrent && hasHZero
    }"
    class="tabs-content-item"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MazTabsContentItem',
  data () {
    return {
      currentIndex: null,
      hasHZero: true
    }
  },
  computed: {
    currentTab () {
      const tabsBarComponent = this.$parent.$parent.$children.find(c => typeof c.$refs.MazTabsBar !== 'undefined')
      const { value } = tabsBarComponent
      return value
    },
    isCurrent () {
      const isCurrent = this.currentTab === this.currentIndex
      return isCurrent
    }
  },
  watch: {
    isCurrent (oldValue, newValue) {
      if (newValue) {
        setTimeout(() => {
          this.hasHZero = true
        }, 300)
      } else this.hasHZero = false
    }
  },
  mounted () {
    this.getCurrentIndex()
  },
  methods: {
    getCurrentIndex () {
      this.$nextTick(() => {
        this.currentIndex = this.$parent.$children.findIndex(c => c._uid === this._uid)
      })
    }
  }
}
</script>
