<template>
  <div class="pagination-dots-divider flex align-center justify-center flex-fixed">
    ...
  </div>
</template>

<script>
  export default {
    name: 'PaginationDotsDivider'
  }
</script>

<style lang="scss" scoped>
  .pagination-dots-divider {
    color: $text-color;
    user-select: none;
    height: 35px;
    width: 35px;
    margin-right: 10px;
  }

  .maz-pagination.is-dark {
    .pagination-dots-divider {
      color: $muted-color-dark;
    }
  }
</style>
