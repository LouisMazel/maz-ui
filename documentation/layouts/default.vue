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
    const darkMode = this.$cookies.get('use-dark-theme')
    if (typeof darkMode === 'boolean') {
      this.setDarkTheme(darkMode)
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
