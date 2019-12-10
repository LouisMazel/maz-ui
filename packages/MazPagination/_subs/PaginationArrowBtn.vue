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

<style lang="scss" scoped>
  .pagination-arrow-btn {
    background-color: transparent;
    margin-right: 10px;
    color: $text-color;

    &:last-child {
      margin-right: 0;
    }

    &:disabled {
      cursor: unset;
    }

    &:hover,
    &:focus {
      background-color: darken(white, 20%);
      box-shadow: 0 0 0 0.2rem rgba(darken(white, 20%), 0.5);
    }
  }

  .maz-pagination.is-dark {
    .pagination-arrow-btn {
      color: $text-color-dark;

      &:hover,
      &:focus {
        background-color: lighten($hover-color-dark, 5%);
        box-shadow: 0 0 0 0.2rem darken($hover-color-dark, 5%);
      }
    }
  }
</style>
