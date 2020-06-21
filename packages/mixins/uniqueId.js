export default {
  computed: {
    uniqueId () {
      const id = this.id || this.$attrs.id
      return id ? `${id}` : `${this.$options.name}-${this._uid}`
    }
  }
}
