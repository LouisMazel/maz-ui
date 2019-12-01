<template>
  <div
    id="app"
    class="flex flex-direction-column"
    :class="{
      'is-dark': isDark
    }"
  >
    <NavHeader />
    <router-view />
  </div>
</template>

<script>
  import NavHeader from './components/NavHeader'

  export default {
    name: 'App',
    components: {
      NavHeader
    },
    data () {
      return {
        isDark: false
      }
    }
  }
</script>

<style lang="scss">
  #app.is-dark {
    background-color: var(--maz-bg-color-dark);

    h1,
    h2,
    h3 {
      color: var(--maz-text-color-dark);
    }
  }
</style>
