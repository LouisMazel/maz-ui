export default {
  nuxtServerInit ({ commit }) {
    const date = new Date().toTimeString()
    const darkMode = this.$cookies.get('use-dark-theme')
    const shouldSetDarkMode = (date < '9:00' && date > '23:00') && typeof darkMode === 'undefined'
    if (shouldSetDarkMode || darkMode) {
      commit('SET_DARK_THEME', shouldSetDarkMode ? true : Boolean(darkMode))
    }
  },
  setDarkTheme ({ commit }, value) {
    this.$cookies.set('use-dark-theme', value)
    commit('SET_DARK_THEME', value)
  }
}
