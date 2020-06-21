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
