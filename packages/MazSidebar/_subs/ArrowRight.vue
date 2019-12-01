<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    :class="{ 'is-white': dark }"
  >
    <path
      class="arrow"
      d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
    />
    <path
      fill="none"
      d="M0 0h24v24H0V0z"
    />
  </svg>
</template>

<script>
  export default {
    name: 'ArrowRight',
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
