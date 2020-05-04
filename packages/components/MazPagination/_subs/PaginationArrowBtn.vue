<template>
  <MazBtn
    class="pagination-arrow-btn flex align-center justify-center flex-fixed"
    size="sm"
    fab
    @click="handleClick"
  >
    <component
      :is="`Arrow${right ? 'Right' : 'Left'}`"
      color="#6F6A6A"
      :dark="dark"
      :size="28"
    />
  </MazBtn>
</template>

<script>
  import ArrowLeft from '../../_subs/ArrowLeft'
  import ArrowRight from '../../_subs/ArrowRight'

  export default {
    name: 'PaginationArrowBtn',
    components: {
      ArrowLeft,
      ArrowRight
    },
    props: {
      right: { type: Boolean, default: false },
      dark: { type: Boolean, default: false }
    },
    methods: {
      handleClick (evt) {
        this.$emit('click', evt)
      }
    }
  }
</script>
