<template>
  <div class="footer-picker p-2 flex justify-end">
    <MazBtn
      outline
      size="md"
      class="mr-2"
    >
      Now
    </MazBtn>
    <MazBtn
      outline
      size="md"
      color="success"
      class="footer-picker__validate"
    >
      <i class="material-icons">
        check
      </i>
    </MazBtn>
  </div>
</template>

<script>
  export default {
    name: 'FooterPicker'
  }
</script>

<style lang="scss" scoped>
  .footer-picker {
    border-top: 1px solid $hover-color;

    &__validate {
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }

  .is-dark .footer-picker {
    border-top: 1px solid $hover-color-dark;
  }
</style>
