<template>
  <div class="component-container pos-r br-8 bg-white p-4 m-4 shadow-container">
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
  }
</style>
