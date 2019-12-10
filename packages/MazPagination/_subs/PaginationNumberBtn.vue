<template>
  <MazBtn
    class="pagination-number-btn flex align-center justify-center flex-fixed"
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
  export default {
    name: 'PaginationNumberBtn',
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

<style lang="scss" scoped>
  .pagination-number-btn {
    height: 35px;
    width: 35px;
    background-color: transparent;
    margin-right: 10px;
    color: $text-color;

    &:last-child {
      margin-right: 0;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &:hover,
    &:focus {
      background-color: darken(white, 20%);
      box-shadow: 0 0 0 0.2rem rgba(darken(white, 20%), 0.5);
    }

    &.active {
      background-color: black;
      color: white;

      &:hover {
        background-color: lighten(black, 20%);
      }
    }
  }

  .maz-pagination.is-dark {
    .pagination-number-btn {
      color: $text-color-dark;

      &:hover,
      &:focus {
        background-color: lighten($hover-color-dark, 5%);
        box-shadow: 0 0 0 0.2rem darken($hover-color-dark, 5%);
      }

      &.active {
        background-color: $bg-color;
        color: $text-color;
      }
    }
  }
</style>
