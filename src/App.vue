<template>
  <div
    id="app"
    class="flex direction-column bg-color"
    :class="{
      'is-dark': hasDarkTheme,
      documentation: isDocPage
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
    ...mapGetters(['hasDarkTheme']),
    isDocPage () {
      return this.$route.matched.some(m => m.name === 'Documentation')
    }
  },
  mounted () {
    const date = new Date().toTimeString()
    if (date < '06:30' || date > '21:00') {
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
    h3,
    h4,
    h5,
    h6,
    p,
    ul,
    li,
    ol {
      color: $text-color-dark;
    }
  }
</style>
