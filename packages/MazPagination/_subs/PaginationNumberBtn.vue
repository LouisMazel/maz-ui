<template>
  <button
    class="pagination-number-btn flex align-center justify-center flex-fixed"
    :disabled="disabled"
    :class="{
      'active': active
    }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
  export default {
    name: 'PaginationNumberBtn',
    props: {
      active: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .pagination-number-btn {
    border: 0;
    padding: 0;
    margin: 0;
    outline: none;
    line-height: 1;
    cursor: pointer;
    height: 35px;
    width: 35px;
    background-color: transparent;
    border-radius: 50%;
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

    &.active {
      background-color: black;
      color: white;

      &:hover {
        background-color: lighten(black, 20%);
      }
    }
  }
</style>
