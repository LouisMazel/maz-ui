<template>
  <div
    class="component-container pos-r br-8 bg-white p-4 my-4 shadow-container"
    :class="{ 'is-dark': dark }"
  >
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'ComponentContainer',
    props: {
      dark: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    // border: 1px solid var(--maz-text-color-dark);
    color: var(--maz-text-color);

    &.is-dark {
      color: var(--maz-text-color-dark);
      background-color: var(--maz-bg-color-dark);
    }
  }
</style>
