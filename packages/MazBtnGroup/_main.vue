<template>
  <div class="maz-btn-group flex">
    <MazBtn
      v-for="({ label, value: val }, i) in items"
      :key="`maz-btn-group-item-${i}`"
      class="maz-btn-group__item flex-1"
      :class="{ 'rounded': rounded }"
      :active="val === value"
      :outline="val !== value"
      :rounded="rounded"
      v-bind="$attrs"
      @click="$emit('input', val)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>

<script>
  import MazBtn from '../MazBtn'

  export default {
    name: 'MazBtnGroup',
    components: {
      MazBtn
    },
    props: {
      value: {
        required: true,
        validator: prop => ['string', 'number', 'boolean'].includes(typeof prop) || prop === null
      },
      items: { type: Array, required: true },
      rounded: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-btn-group {
    &__item {
      margin-right: -1px;
      z-index: 0;
      border-radius: 0;

      &.active,
      &:focus {
        z-index: 1;
      }

      &:first-child:not(.rounded) {
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }

      &:last-child:not(.rounded) {
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }

      &:first-child.rounded {
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
      }

      &:last-child.rounded {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
  }
</style>
