<template>
  <div class="component-container pos-r br-8 bg-white p-4 m-4">
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'ComponentContainer'
  }
</script>

<style lang="scss" scoped>
  .component-container {
    border: 1px solid var(--maz-text-color-dark);
    overflow: hidden;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }
</style>
