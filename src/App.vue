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
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'App',
    components: {
      NavHeader
    },
    computed: {
      ...mapGetters(['hasDarkTheme'])
    },
    mounted () {
      const date = new Date().toTimeString()
      if (date > '16:30') {
        this.setDarkTheme(true)
      }
    },
    methods: {
      ...mapActions(['setDarkTheme'])
    }
  }
</script>

<style lang="scss">
  #app.is-dark {
    background-color: $bg-color-dark;

    h3,
    h4,
    h5,
    h6,
    p {
      color: $text-color-dark;
    }
  }
</style>
