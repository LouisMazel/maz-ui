<template>
  <div
    class="dark-switch-banner maz-w-100 maz-p-3 maz-flex maz-flex-center maz-border-color maz-border-top-1 maz-border-top-solid"
  >
    <strong class="maz-text-primary">
      Switch Dark Theme
    </strong>
    <MazSwitch
      v-model="darkTheme"
      class="maz-ml-2"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DarkSwitchBanner',
  computed: {
    ...mapGetters(['hasDarkTheme']),
    darkTheme: {
      get () {
        return this.hasDarkTheme
      },
      set (val) {
        this.$cookies.set('use-dark-theme', val)
        return this.setDarkTheme(val)
      }
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
