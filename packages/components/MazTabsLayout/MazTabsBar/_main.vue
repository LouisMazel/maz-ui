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
      :class="{active : currentTab === i, disabled: disabled }"
      class="maz-tabs-bar__item"
      :to="useAnchor ? `#${labelNormalize(label)}` : null"
      @click.native="disabled ? null : setValue(i)"
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

const getIndexOfCurrentAnchor = (tabs, value) => {
  if (typeof window === 'undefined') return value
  const anchor = window.location.hash.replace('#', '')
  const index = tabs.findIndex(({ label }) => toSnakeCase(label) === anchor)
  console.log('STOP getIndexOfCurrentAnchor', index === -1 ? 0 : index)
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
    // you should use the history mode with VueRouter && do not use `v-model` value
    useAnchor: { type: Boolean, default: false }
  },
  data () {
    return {
      currentTab: null,
      isMounted: false
    }
  },
  computed: {
    tabsIndicatorState () {
      const { currentTab, isMounted } = this

      if (!Number.isInteger(currentTab) || !isMounted) return

      const tabsItem = this.$refs.MazTabsBarItem ? this.$refs.MazTabsBarItem[currentTab] : null
      const indicatorWidth = tabsItem ? tabsItem.$el.clientWidth : 0
      const translateXValue = tabsItem ? tabsItem.$el.offsetLeft : 0
      return {
        transform: `translateX(${translateXValue}px)`,
        width: `${indicatorWidth}px`
      }
    }
  },
  created () {
    const { value, useAnchor, items } = this
    if (value < 1 || value > items.length) throw new Error(`[Maz-ui](maz-tabs-bar) The init value should be between 1 and ${items.length}`)

    if (!useAnchor) this.setValue(value - 1)
  },
  mounted () {
    this.isMounted = true
    const { useAnchor, currentTab } = this
    if (useAnchor) {
      const valueIndex = this.value - 1
      const tabActive = useAnchor && !Number.isInteger(currentTab) ? getIndexOfCurrentAnchor(this.items, valueIndex) : valueIndex
      this.setValue(tabActive)
    }
  },
  methods: {
    setValue (i) {
      this.currentTab = i
      this.$root.mazTabsLayoutActive = i
      this.$emit('input', i + 1)
    },
    labelNormalize (label) {
      return toSnakeCase(label)
    }
  }
}
</script>
