<template>
  <div
    ref="MazTabsBar"
    class="maz-tabs-bar"
    :class="{
      'maz-is-dark': dark,
      'align-left': alignLeft
    }"
  >
    <a
      v-for="({ label, disabled }, index) in items"
      :key="index"
      ref="MazTabsBarItem"
      :class="{active : tabActive === index, disabled: disabled }"
      class="maz-tabs-bar__item maz-flex maz-flex-center maz-dots-text"
      :href="noUseAnchor ? null : `#${labelNormalize(label)}`"
      @click="disabled ? null : selectTab(index)"
    >
      {{ label }}
    </a>
    <div
      :style="tabsIndicatorState"
      class="maz-tabs-bar__indicator"
    >
      <div class="maz-sub-bar" />
    </div>
  </div>
</template>

<script>

const toSnakeCase = string => {
  return string.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
}

const getIndexOfCurrentAnchor = (tabs) => {
  if (typeof window === 'undefined') return 0
  const anchor = window.location.hash.replace('#', '')
  const index = tabs.findIndex(({ label }) => toSnakeCase(label) === anchor)
  return index === -1 ? 0 : index
}

export default {
  name: 'MazTabsBar',
  props: {
    // tabs objects - ex: `[ { label: 'First Tab' }, { label: 'Second Tab', disabled: true }]`
    items: { type: Array, required: true },
    // current tab active
    value: { type: Number, default: 1 },
    // set the dark theme
    dark: { type: Boolean, default: false },
    // the tabs bar will be align on left
    alignLeft: { type: Boolean, default: false },
    // you should use the history mode with VueRouter
    noUseAnchor: { type: Boolean, default: false }
  },
  data () {
    return {
      tabActive: this.noUseAnchor ? this.value - 1 : getIndexOfCurrentAnchor(this.items),
      tabsIndicatorState: {}
    }
  },
  watch: {
    tabActive: {
      handler (value) {
        this.$emit('input', value + 1)
        this.getTabsIndicatorState()
      },
      immediate: true
    }
  },
  methods: {
    labelNormalize (label) {
      return toSnakeCase(label)
    },
    selectTab (value) {
      this.tabActive = value
      this.$emit('input', value + 1)
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
