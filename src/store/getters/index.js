export default {
  hasDarkTheme (state) {
    return localStorage.getItem('use-dark-theme') === 'true' || state.darkTheme
  }
}
