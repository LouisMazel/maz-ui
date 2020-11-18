<template>
  <div
    ref="MazTabsContent"
    class="maz-base-component maz-tabs-content"
    :class="{ 'maz-overflow-hidden': hideOverflow }"
  >
    <slot />
  </div>
</template>

<script>
import { debounce } from '../../../utils'

export default {
  name: 'MazTabsContent',
  props: {
    // Set the current active tab (use it you don't use MazTabsBar)
    activeTab: { type: Number, default: null }
  },
  data () {
    return {
      currentTab: null,
      hideOverflow: false
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
        this.setOverflowHiddenTemp()
        this.currentTab = value ? value - 1 : null
      },
      immediate: true
    },
    tabsBarActiveTab: {
      handler (value) {
        if (Number.isInteger(this.activeTab)) return
        this.setOverflowHiddenTemp()
        this.currentTab = value
      },
      immediate: true
    }
  },
  methods: {
    setOverflowHiddenTemp () {
      this.hideOverflow = true
      this.allowOverFlow()
    },
    allowOverFlow: debounce(function () {
      this.hideOverflow = false
    }, 700)
  }
}
</script>
