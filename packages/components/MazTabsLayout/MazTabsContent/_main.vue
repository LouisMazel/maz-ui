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
      const { tabActive } = tabsBarComponent
      return tabActive
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
        this.height = this.$children[this.currentTab].$el.offsetHeight
      },
      immediate: true
    }
  }
}
</script>
