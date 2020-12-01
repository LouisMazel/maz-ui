<template>
  <div
    id="app"
    class="home maz-flex maz-direction-column maz-bg-color maz-text-color"
    :class="{
      'maz-is-dark': hasDarkTheme
    }"
  >
    <NavHeader />
    <nuxt
      role="main"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import NavHeader from '@/components/NavHeader'

export default {
  components: {
    NavHeader
  },
  computed: {
    ...mapGetters(['hasDarkTheme']),
  },
  mounted () {
    const date = new Date().toTimeString()
    const darkMode = this.$cookies.get('use-dark-theme')
    const shouldSetDarkMode = (date < '9:00' && date > '23:00') && typeof darkMode === 'undefined'
    if (shouldSetDarkMode || darkMode) {
      this.setDarkTheme(shouldSetDarkMode ? true : Boolean(darkMode))
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
