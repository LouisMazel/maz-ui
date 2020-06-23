<template>
  <div
    id="app"
    class="maz-flex maz-direction-column maz-bg-color maz-text-color"
    :class="{
      'maz-is-dark': hasDarkTheme
    }"
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
    if (date < '06:15' || date > '21:20') {
      if (localStorage.getItem('use-dark-theme') === null) this.setDarkTheme(true)
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
