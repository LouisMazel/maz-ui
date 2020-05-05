<template>
  <MazBtn
    class="pagination-arrow-btn flex align-center justify-center flex-fixed"
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

export default {
  name: 'PaginationArrowBtn',
  components: {
    ArrowIcon
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
