<template>
  <button
    :id="uniqueId"
    class="maz-btn btn"
    :class="[
      classes
    ]"
    v-bind="$attrs"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <span
      class="flex align-center justify-center"
      :class="{
        hidden: loader
      }"
    >
      <slot />
    </span>
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
      loader: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      type: { type: String, default: 'primary' },
      size: { type: String, default: null },
      outline: { type: Boolean, default: false },
      rounded: { type: Boolean, default: false }
    },
    computed: {
      isDisabled () {
        const { disabled, loader } = this
        return loader || disabled
      },
      classes () {
        const { type, size, outline, rounded, isDisabled } = this
        return [
          ...(type ? [`btn--${type}`] : [null]),
          ...(size ? [`btn--${size}`] : [null]),
          ...(outline ? [`btn--${type}--outline`] : [null]),
          ...(rounded ? [`btn--rounded`] : [null]),
          ...(isDisabled ? [`btn--disabled`] : [null])
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-btn {
    position: relative;

    .hidden {
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
