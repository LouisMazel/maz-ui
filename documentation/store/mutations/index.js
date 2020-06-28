export default {
  SET_DARK_THEME (state, value) {
    state.darkTheme = value
    this.$cookies.set('use-dark-theme', value)
  }
}
