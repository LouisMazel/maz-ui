<template>
  <MazBtn
    class="pagination-arrow-btn maz-flex maz-flex-center maz-flex-fixed"
    size="sm"
    fab
    @click="handleClick"
  >
    <ArrowIcon
      color="#6F6A6A"
      :orientation="right ? 'right' : 'left'"
      :dark="dark"
      :size="28"
    />
  </MazBtn>
</template>

<script>
import ArrowIcon from '../../_subs/ArrowIcon'
import MazBtn from '../../MazBtn'

export default {
  name: 'PaginationArrowBtn',
  components: {
    ArrowIcon, MazBtn
  },
  props: {
    right: { type: Boolean, default: false },
    dark: { type: Boolean, default: false }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
