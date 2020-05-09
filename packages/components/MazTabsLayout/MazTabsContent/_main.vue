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
  data () {
    return {
      height: 0
    }
  },
  computed: {
    currentTab () {
      const tabsBarComponent = this.$parent.$children.find(c => typeof c.$refs.MazTabsBar !== 'undefined')
      const { value } = tabsBarComponent
      return value
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
