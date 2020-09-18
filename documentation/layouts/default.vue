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
    const darkCookieValue = this.$cookies.get('use-dark-theme')
    if ((!(date < '9:00' && date > '23:00') && typeof darkCookieValue !== 'boolean') || !darkCookieValue) {
      this.setDarkTheme(false)
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
