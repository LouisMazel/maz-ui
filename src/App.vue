<template>
  <div
    id="app"
    class="maz-flex maz-direction-column maz-bg-color maz-text-color"
    :class="{
      'maz-is-dark': hasDarkTheme,
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
    if (date < '06:15' || date > '21:20') {
      if (localStorage.getItem('use-dark-theme') === null) this.setDarkTheme(true)
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
