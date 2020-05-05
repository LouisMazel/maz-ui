<template>
  <div
    class="dark-switch-banner w-100 p-3 flex flex-center border-color border-top-1 border-top-solid"
  >
    <p class="text-muted">
      Switch Dark Theme
    </p>
    <MazSwitch
      v-model="darkTheme"
      class="ml-2"
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
