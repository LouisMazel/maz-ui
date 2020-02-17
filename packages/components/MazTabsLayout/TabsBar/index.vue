<template>
  <div
    ref="TabsBar"
    class="tabs-bar flex flex-direction-column"
    :class="{
      'is-dark': dark
    }"
  >
    <div class="flex w-100 align-center">
      <button
        v-for="({ label, disabled }, index) in items"
        :key="index"
        :class="{active : value === index, disabled: disabled }"
        class="tabs-bar__item text-center flex-1 align-center flex justify-center h-100 mh-100"
        @click="disabled ? null : $emit('input', index)"
      >
        {{ label }}
      </button>
    </div>
    <div
      :style="tabsIndicatorState"
      class="tabs-bar__indicator"
    >
      <div class="sub-bar" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabsBar',
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
