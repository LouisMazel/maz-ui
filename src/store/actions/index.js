export default {
  setDarkTheme ({ commit }, value) {
    commit('SET_DARK_THEME', value)
    if (value) {
      localStorage.setItem('use-dark-theme', value)
    } else localStorage.removeItem('use-dark-theme')
  }
}
