<template>
  <div
    ref="MazTabsBar"
    class="maz-base-component maz-tabs-bar"
    :class="{
      'maz-is-dark': dark,
      'align-left': alignLeft
    }"
  >
    <MazBtn
      v-for="({ label, disabled }, i) in items"
      :key="i"
      ref="MazTabsBarItem"
      no-shadow
      color="transparent"
      :class="{active : valueComputed === i, disabled: disabled }"
      class="maz-tabs-bar__item"
      :to="noUseAnchor ? null : `#${labelNormalize(label)}`"
      style="padding: 0 10px;"
      @click.native.prevent="disabled ? null : setValue($event, i)"
    >
      {{ label }}
    </MazBtn>
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
    value: { type: Number, default: null },
    // set the dark theme
    dark: { type: Boolean, default: false },
    // the tabs bar will be align on left
    alignLeft: { type: Boolean, default: false },
    // you should use the history mode with VueRouter && do not use `v-model` value
    noUseAnchor: { type: Boolean, default: false }
  },
  data () {
    return {
      currentTab: this.noUseAnchor ? 0 : getIndexOfCurrentAnchor(this.items),
      tabsIndicatorState: {}
    }
  },
  computed: {
    valueComputed: {
      get () {
        const { value } = this
        return value ? value - 1 : this.currentTab
      },
      set (value) {
        this.getTabsIndicatorState()
        this.currentTab = value
        // return the number of current active tab
        // @arg Number
        this.$emit('input', value + 1)
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        this.tabActive = value - 1
        this.getTabsIndicatorState()
      },
      immediate: true
    }
  },
  mounted () {
    this.getTabsIndicatorState()
  },
  methods: {
    setValue (e, i) {
      e.preventDefault()
      this.valueComputed = i
    },
    labelNormalize (label) {
      return toSnakeCase(label)
    },
    async getTabsIndicatorState () {
      await this.$nextTick()
      const tabsItem = this.$refs.MazTabsBarItem ? this.$refs.MazTabsBarItem[this.valueComputed] : null
      const indicatorWidth = tabsItem ? tabsItem.$el.clientWidth : 0
      const translateXValue = tabsItem ? tabsItem.$el.offsetLeft : 0
      this.tabsIndicatorState = {
        transform: `translateX(${translateXValue}px)`,
        width: `${indicatorWidth}px`
      }
    }
  }
}
</script>
