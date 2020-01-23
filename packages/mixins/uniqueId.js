export default {
  computed: {
    uniqueId () {
      if (this.id) {
        return `${this.id}`
      } else {
        return `${this.$options.name}-${this._uid}`
      }
    }
  }
}
