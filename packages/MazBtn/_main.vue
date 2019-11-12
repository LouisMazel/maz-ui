<template>
  <button
    :id="uniqueId"
    class="maz-btn btn flex align-center justify-content-center"
    :class="[
      classes
    ]"
    v-bind="$attrs"
    :disabled="loader || disabled"
    @click="$emit('click')"
  >
    <span
      :class="{
        hidden: loader
      }"
    >
      <slot />
    </span>
    <MazSpinner
      v-if="loader"
      class="maz-btn__spinner"
      :size="30"
      white
    />
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
      size: { type: String, default: 'md' },
      outline: { type: Boolean, default: false },
      rounded: { type: Boolean, default: false }
    },
    computed: {
      classes () {
        const { type, size, outline, rounded } = this
        return [
          ...(type ? [`btn-${type}`] : [null]),
          ...(size ? [`btn-${size}`] : [null]),
          ...(outline ? [`btn-${type}-outline`] : [null]),
          ...(rounded ? [`btn-rounded`] : [null])
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
      right: 0;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: var(--maz-third-color);
      box-shadow: none;
    }
  }
</style>
