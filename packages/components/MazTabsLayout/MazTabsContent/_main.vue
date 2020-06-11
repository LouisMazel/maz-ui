<template>
  <div
    ref="MazTabsContent"
    :style="[
      tabsContainerState,
      { height: `${height}px` }
    ]"
    class="maz-tabs-content maz-flex maz-align-start"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MazTabsContent',
  props: {
    // set the current active tab (use it you don't use MazTabsBar)
    activeTab: { type: Number, default: null }
  },
  data () {
    return {
      height: 0
    }
  },
  computed: {
    currentTab () {
      const { activeTab } = this
      if (Number.isInteger(activeTab)) return activeTab - 1
      const tabsBarComponent = this.$parent.$children.find(c => typeof c.$refs.MazTabsBar !== 'undefined')
      const { valueComputed } = tabsBarComponent
      return valueComputed
    },
    tabsContainerState () {
      return {
        transform: `translateX(-${this.currentTab}00%)`
      }
    }
  },
  watch: {
    currentTab: {
      async handler () {
        await this.$nextTick()
        const { currentTab } = this
        this.height = this.$children[currentTab].$el.offsetHeight
        this.resizeObserver()
      },
      immediate: true
    }
  },
  methods: {
    resizeObserver () {
      const { $children, currentTab } = this
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this.height = entry.target.offsetHeight
        }
      })

      $children.forEach(d => resizeObserver.unobserve(d.$el))
      resizeObserver.observe($children[currentTab].$el)
    }
  }
}
</script>
