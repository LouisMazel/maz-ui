<template>
  <div
    ref="MazTabsContent"
    class="maz-base-component maz-tabs-content maz-overflow-hidden"
  >
    <slot />
  </div>
</template>

<script>

export default {
  name: 'MazTabsContent',
  props: {
    // Set the current active tab (use it you don't use MazTabsBar)
    activeTab: { type: Number, default: null }
  },
  data () {
    return {
      currentTab: null
    }
  },
  computed: {
    tabsBarActiveTab () {
      const tabsBarComponent = this.$parent.$children.find(c => typeof c.$refs.MazTabsBar !== 'undefined')
      const { currentTab } = tabsBarComponent || { currentTab: this.$root.mazTabsLayoutActive }
      return currentTab
    }
  },
  watch: {
    activeTab: {
      handler (value) {
        this.currentTab = value ? value - 1 : null
      },
      immediate: true
    },
    tabsBarActiveTab: {
      handler (value) {
        if (Number.isInteger(this.activeTab)) return
        this.currentTab = value
      },
      immediate: true
    }
  }
}
</script>
