<template>
  <div
    class="maz-base-component maz-overflow-hidden"
    :style="[
      { height: `${height}px` }
    ]"
  >
    <div
      ref="MazTabsContent"
      :style="[
        tabsContainerState
      ]"
      class="maz-tabs-content maz-flex maz-align-start"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import Ro from 'resize-observer-polyfill'

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
    async resizeObserver () {
      const { $children, currentTab } = this

      const resizeObserver = new Ro(entries => {
        for (const entry of entries) {
          console.log('okokokok')
          const { offsetHeight, classList } = entry.target
          if (offsetHeight && !classList.value.includes('maz-h-0')) this.height = entry.target.offsetHeight
        }
      })
      $children.forEach(d => resizeObserver.unobserve(d.$el))
      setTimeout(() => { resizeObserver.observe($children[currentTab].$el) }, 500)
    }
  }
}
</script>
