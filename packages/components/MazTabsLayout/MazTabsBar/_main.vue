<template>
  <div
    ref="MazTabsBar"
    class="maz-tabs-bar maz-flex maz-direction-column"
    :class="{
      'maz-is-dark': dark
    }"
  >
    <div class="maz-flex maz-w-100 maz-h-100">
      <button
        v-for="({ label, disabled }, index) in items"
        :key="index"
        :class="{active : tabActive === index, disabled: disabled }"
        class="maz-tabs-bar__item maz-text-center maz-flex-1 maz-flex maz-flex-center maz-h-100 maz-mh-100"
        @click.stop="disabled ? null : selectTab(index)"
      >
        {{ label }}
      </button>
    </div>
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
    dark: { type: Boolean, default: false }
  },
  data () {
    return {
      tabActive: this.value
    }
  },
  computed: {
    tabsIndicatorState () {
      return {
        transform: `translateX(${this.tabActive}00%)`,
        width: `${100 / this.items.length}%`
      }
    }
  },
  watch: {
    value (value) {
      this.tabActive = value
    }
  },
  methods: {
    selectTab (value) {
      this.tabActive = value
      this.$emit('input', value)
    }
  }
}
</script>
