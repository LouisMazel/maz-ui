<template>
  <div
    ref="MazTabsContent"
    :style="[
      tabsContainerState,
      { height: height }
    ]"
    class="tabs-content maz-flex maz-align-start"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MazTabsContent',
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
    },
    height () {
      let height
      this.$nextTick(() => {
        height = this.$children[this.currentTab].$el.offsetHeight
      })
      return height
    }
  }
}
</script>
