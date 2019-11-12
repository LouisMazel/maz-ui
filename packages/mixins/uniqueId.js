export default {
  computed: {
    uniqueId () {
      return `${this.id}-${this._uid}`
    }
  }
}
