export default {
  setDarkTheme ({ commit }, value) {
    commit('SET_DARK_THEME', value)
    localStorage.setItem('use-dark-theme', value)
  }
}
