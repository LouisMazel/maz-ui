<template>
  <div
    class="dark-switch-banner maz-w-100 maz-p-3 maz-flex maz-flex-center maz-border-color maz-border-top-1 maz-border-top-solid"
  >
    <p class="maz-text-muted">
      Switch Dark Theme
    </p>
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
        return this.setDarkTheme(val)
      }
    }
  },
  methods: {
    ...mapActions(['setDarkTheme'])
  }
}
</script>
