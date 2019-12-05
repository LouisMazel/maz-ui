<template>
  <button
    class="pagination-arrow-btn flex align-center justify-center flex-fixed"
    @click="$emit('click')"
  >
    <component
      :is="`Arrow${right ? 'Right' : 'Left'}`"
      color="#6F6A6A"
      :size="80"
    />
  </button>
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
      right: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .pagination-arrow-btn {
    border: 0;
    padding: 0;
    margin: 0;
    outline: none;
    line-height: 1;
    cursor: pointer;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    background-color: transparent;
    margin-right: 10px;
    color: black;

    &:last-child {
      margin-right: 0;
    }

    &:disabled {
      cursor: unset;
    }

    &:hover:not(:disabled) {
      background-color: darken(white, 20%);
    }
  }
</style>
