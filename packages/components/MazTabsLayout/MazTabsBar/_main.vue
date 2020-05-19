<template>
  <div
    ref="MazTabsBar"
    class="maz-tabs-bar"
    :class="{
      'maz-is-dark': dark,
      'align-left': alignLeft
    }"
  >
    <button
      v-for="({ label, disabled }, index) in items"
      :key="index"
      ref="MazTabsBarItem"
      :class="{active : tabActive === index, disabled: disabled }"
      class="maz-tabs-bar__item maz-flex maz-flex-center maz-dots-text"
      @click.stop="disabled ? null : selectTab(index)"
    >
      {{ label }}
    </button>
    <div
      :style="tabsIndicatorState"
      class="maz-tabs-bar__indicator"
    >
      <div class="maz-sub-bar" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazTabsBar',
  props: {
    items: { type: Array, required: true },
    value: { type: Number, default: 0 },
    dark: { type: Boolean, default: false },
    alignLeft: { type: Boolean, default: false }
  },
  data () {
    return {
      tabActive: this.value,
      tabsIndicatorState: {}
    }
  },
  watch: {
    tabActive: {
      handler (value) {
        this.$emit('input', value)
        this.getTabsIndicatorState()
      },
      immediate: true
    }
  },
  methods: {
    selectTab (value) {
      this.tabActive = value
      this.$emit('input', value)
    },
    async getTabsIndicatorState () {
      await this.$nextTick()
      const tabsItem = this.$refs.MazTabsBarItem ? this.$refs.MazTabsBarItem[this.tabActive] : null
      const indicatorWidth = tabsItem ? tabsItem.clientWidth : tabsItem
      const translateXValue = tabsItem ? tabsItem.offsetLeft : tabsItem
      this.tabsIndicatorState = {
        transform: `translateX(${translateXValue}px)`,
        width: `${indicatorWidth}px`
      }
    }
  }
}
</script>
