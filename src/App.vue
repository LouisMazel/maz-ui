<template>
  <div
    id="app"
    class="flex direction-column"
    :class="{
      'is-dark': hasDarkTheme
    }"
  >
    <NavHeader />
    <router-view />
  </div>
</template>

<script>
  import NavHeader from './components/NavHeader'
  import { mapGetters } from 'vuex'

  export default {
    name: 'App',
    components: {
      NavHeader
    },
    computed: {
      ...mapGetters(['hasDarkTheme'])
    }
  }
</script>

<style lang="scss">
  #app.is-dark {
    background-color: var(--maz-bg-color-dark);

    h3,
    h4,
    h5,
    h6,
    p {
      color: var(--maz-text-color-dark);
    }
  }
</style>
