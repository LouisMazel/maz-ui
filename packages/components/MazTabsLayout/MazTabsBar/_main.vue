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
        :class="{active : value === index, disabled: disabled }"
        class="maz-tabs-bar__item maz-text-center maz-flex-1 maz-flex maz-flex-center maz-h-100 maz-mh-100"
        @click="disabled ? null : $emit('input', index)"
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
    value: { type: Number, required: true },
    dark: { type: Boolean, default: false }
  },
  computed: {
    tabsIndicatorState () {
      return {
        transform: `translateX(${this.value}00%)`,
        width: `${100 / this.items.length}%`
      }
    }
  }
}
</script>
