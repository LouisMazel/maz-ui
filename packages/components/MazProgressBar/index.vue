<template>
  <div class="maz-progress-bar maz-flex maz-align-center maz-bg-color-light">
    <div
      class="maz-progress-bar__bg"
      :style="[getOuterStyle]"
    />
    <div
      class="maz-progress-bar__line maz-border-radius"
      :class="[{
        'maz-border-radius-0': noRadius
      }, `maz-progress-bar__line--${color}`]"
      :style="getLineStyle"
    >
      <div
        v-if="anim"
        class="maz-progress-bar__line__anim maz-border-radius"
        :class="[{
          'maz-border-radius-0': !noRadius
        }]"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazProgressBar',
  props: {
    // progress value integer
    percent: { type: Number, required: true },
    // disable border radius
    noRadius: { type: Boolean, default: false },
    // enable white animation progress
    anim: { type: Boolean, default: false },
    // progress bar height
    height: { type: Number, default: 4 },
    // use basic colors from 'maz-ui' or hex/name colors, you can use array with hex colors to set an linear-gradient background
    color: { type: [String, Array, Function], default: 'primary' }
  },
  computed: {
    getOuterStyle (){
      const { height } = this
      return {
        height: `${height}px`
      }
    },
    getLineStyle () {
      const { percent, height, color } = this
      let result = {
        width: `${percent}%`,
        height: `${height}px`
      }

      if (typeof(color) === 'string') {
        result.backgroundColor = color
      } else if (Array.isArray(color)) {
        result.backgroundImage = `linear-gradient(to right, ${color.join(', ')})`
      } else if (typeof(color) === 'function') {
        result.backgroundColor = color(percent)
      }
      return result
    }
  },
  mounted () {
    const { percent } = this
    const test = percent >= 0 && percent <= 100
    if (!test) throw new Error('[MazUi][ProgressBar] The progress bar percent should between 0 and 100')
  }
}
</script>

<style lang="scss" scoped>
  .maz-progress-bar {
    color: $text-color;
    font-size: 14px;
    position: relative;
    width: 100%;

    &__bg {
      width: 100%;
      position: relative;
    }

    &__line {
      position: absolute;
      top: 0;
      left: 0;
      background-color: $default-color;
      transition: all 500ms ease-in-out;

      @each $name, $color in $color_types {
        &--#{$name} {
          background-color: $color;
        }
      }

      &__anim {
        background-color: white;
        height: inherit;
        border-radius: 10px;
        opacity: 0;
        animation: n-anim 2s cubic-bezier(0, 0, .2, 1) infinite;
      }
    }

    @keyframes n-anim {
      0% {
        width: 0;
        opacity: .2;
      }

      70% {
        width: 0;
        opacity: .6;
      }

      100% {
        width: 100%;
        opacity: 0;
      }
    }

    @keyframes n-flow {
      from { filter: hue-rotate(0deg); }
      to { filter: hue-rotate(360deg); }
    }
  }

</style>