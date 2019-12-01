<template>
  <svg
    mlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    :class="{ 'is-white': dark }"
  >
    <path
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
    name: 'ArrowDown',
    props: {
      dark: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .is-white path.arrow {
    fill: white;
  }
</style>
