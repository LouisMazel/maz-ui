<template>
  <svg
    mlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    class="arrow-icon"
    :class="[{ 'is-white': dark }, orientation]"
  >
    <path
      :fill="color"
      :class="[color]"
      class="arrow"
      d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
    />
    <path
      fill="none"
      d="M0 0h24v24H0V0z"
    />
  </svg>
</template>

<script>
export default {
  name: 'ArrowIcon',
  props: {
    dark: { type: Boolean, default: false },
    color: { type: String, default: null },
    size: { type: Number, default: 24 },
    orientation: { type: String, default: 'bottom' }
  }
}
</script>
