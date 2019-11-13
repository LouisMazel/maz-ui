<template>
  <div class="home">
    <div class="container">
      <h2 class="text-center my-3">
        A components & CSS library to build your interface
      </h2>
    </div>
    <NavFooter />
  </div>
</template>

<script>
  import NavFooter from '@/components/NavFooter'

  export default {
    name: 'Home',
    components: {
      NavFooter
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    h2 {
      color: var(--maz-text-color);
    }
  }
</style>
