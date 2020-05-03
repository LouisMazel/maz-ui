export default {
  computed: {
    uniqueId () {
      const id = this.id || this.$attrs.id
      if (id) {
        return `${id}`
      } else {
        return `${this.$options.name}-${this._uid}`
      }
    }
  }
}
