<template>
  <div class="maz-base-component maz-progress-bar maz-flex maz-align-center maz-bg-color-light">
    <div
      class="maz-progress-bar__bg maz-border-radius"
      :class="[{
        'maz-border-radius-0': noRadius
      }, bgColor ? `maz-bg-${bgColor}` : null]"
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
        v-if="animated"
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
    // progress value integer, should be between `0` and `100`
    percent: { type: Number, required: true },
    // disable border radius
    noRadius: { type: Boolean, default: false },
    // enable white animation progress
    animated: { type: Boolean, default: false },
    // progress bar height
    height: { type: Number, default: 4 },
    // use basic colors from 'maz-ui' or hex/name colors, you can use array with hex colors to set an linear-gradient background
    color: { type: [String, Array, Function], default: 'primary' },
    // use basic colors from 'maz-ui'
    bgColor: { type: [String, Array, Function], default: null }
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
    if (!test) throw new Error('[ProgressBar] The progress bar percent should between 0 and 100')
  }
}
</script>
