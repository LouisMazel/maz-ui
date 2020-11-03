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
import { mapGetters } from 'vuex'

import NavHeader from '@/components/NavHeader'

export default {
  components: {
    NavHeader
  },
  computed: {
    ...mapGetters(['hasDarkTheme']),
  }
}
</script>
