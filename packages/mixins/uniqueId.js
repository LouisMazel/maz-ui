export default {
  data () {
    return {
      uniqueId: null
    }
  },
  mounted () {
    const id = this.id || this.$attrs.id
    this.uniqueId = id ? `${id}` : `${this.$options.name}-${this._uid}`
  }
}
