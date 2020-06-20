<template>
  <div
    id="app"
    class="maz-flex maz-direction-column maz-bg-color maz-text-color"
  >
    <!-- :class="{
      'maz-is-dark': hasDarkTheme,
      documentation: isDocPage
    }" -->
    <NavHeader />
    <nuxt />
  </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
export default {
  components: {
    NavHeader
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/main.scss';
</style>