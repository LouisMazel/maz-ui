<template>
  <MazBtn
    class="pagination-number-btn maz-flex maz-flex-center maz-flex-fixed"
    :disabled="disabled"
    :class="{
      'active': active
    }"
    fab
    size="sm"
    @click="handleClick"
  >
    <slot />
  </MazBtn>
</template>

<script>
import MazBtn from '../../MazBtn'

export default {
  name: 'PaginationNumberBtn',
  components: { MazBtn },
  props: {
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
