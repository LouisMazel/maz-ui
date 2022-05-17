<template>
  <svg
    mlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    class="maz-arrow-icon"
    :class="[{ 'is-white': dark }, orientation]"
  >
    <path
      :fill="hex"
      :class="[hex]"
      class="arrow"
      d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
    />
    <path fill="none" d="M0 0h24v24H0V0z" />
  </svg>
</template>

<script lang="ts" setup>
  defineProps({
    dark: { type: Boolean, default: false },
    hex: { type: String, default: undefined },
    size: { type: Number, default: 24 },
    orientation: { type: String, default: 'bottom' },
  })
</script>

<style lang="postcss" scoped>
  .maz-arrow-icon {
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    path.arrow {
      @apply maz-fill-current;
    }

    &.is-white path.arrow {
      fill: white;
    }

    &.top {
      transform: rotate(180deg);
    }

    &.right {
      transform: rotate(-90deg);
    }

    &.left {
      transform: rotate(90deg);
    }
  }
</style>
