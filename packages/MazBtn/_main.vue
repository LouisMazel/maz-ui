<template>
  <button
    :id="uniqueId"
    class="maz-btn btn"
    :class="[
      classes,
      { hidden: loader }
    ]"
    :type="type"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <slot />
    <div
      v-if="loader"
      class="maz-btn__spinner flex align-center justify-center"
    >
      <MazSpinner
        :size="25"
        dark
      />
    </div>
  </button>
</template>

<script>
  import MazSpinner from '../MazSpinner'
  import uniqueId from './../mixins/uniqueId'

  export default {
    name: 'MazBtn',
    components: {
      MazSpinner
    },
    mixins: [uniqueId],
    props: {
      id: { type: String, default: 'MazBtn' },
      color: { type: String, default: 'primary' },
      size: { type: String, default: null },
      type: { type: String, default: 'button' },
      loader: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      outline: { type: Boolean, default: false },
      rounded: { type: Boolean, default: false },
      fab: { type: Boolean, default: false },
      active: { type: Boolean, default: false }
    },
    computed: {
      isDisabled () {
        const { disabled, loader } = this
        return loader || disabled
      },
      classes () {
        const { color, size, outline, rounded, isDisabled, fab, active } = this
        return [
          ...(color ? [`btn--${color}`] : [null]),
          ...(size ? [`btn--${size}`] : [null]),
          ...(outline ? [`btn--${color}--outline`] : [null]),
          ...(rounded ? [`btn--rounded`] : [null]),
          ...(fab ? [`btn--fab`] : [null]),
          ...(isDisabled ? [`btn--disabled`] : [null]),
          ...(active ? [`active`] : [null])
        ]
      }
    },
    methods: {
      handleClick (evt) {
        this.$emit('click', evt)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-btn {
    position: relative;

    &.hidden {
      color: transparent;
    }

    &__spinner {
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
