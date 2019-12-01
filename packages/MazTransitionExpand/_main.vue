<template>
  <transition
    class="maz-transition-expand"
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition>
</template>

<script>
  export default {
    name: 'MazTransitionExpand',
    methods: {
      enter (element) {
        const width = getComputedStyle(element).width

        element.style.width = width
        element.style.position = 'absolute'
        element.style.visibility = 'hidden'
        element.style.height = 'auto'
        element.style.top = 'bottom'

        const height = getComputedStyle(element).height

        element.style.width = null
        element.style.position = null
        element.style.visibility = null
        element.style.height = 0

        // Force repaint to make sure the
        // animation is triggered correctly.
        /* eslint-disable */
        getComputedStyle(element).height
        /* eslint-enable */

        // Trigger the animation.
        // We use `setTimeout` because we need
        // to make sure the browser has finished
        // painting after setting the `height`
        // to `0` in the line above.
        this.$nextTick(() => {
          element.style.height = height
        })
      },
      afterEnter (element) {
        element.style.height = 'auto'
      },
      leave (element) {
        const height = getComputedStyle(element).height
        element.style.height = height

        // Force repaint to make sure the
        // animation is triggered correctly.
        /* eslint-disable */
        getComputedStyle(element).height
        /* eslint-enable */
        this.$nextTick(() => {
          element.style.height = 0
        })
      }
    }
  }
</script>

<style scoped>
  * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .expand-enter-active,
  .expand-leave-active {
    transition: 300ms ease-in-out;
    transition-property: opacity, height;
    overflow: hidden;
  }

  .expand-enter,
  .expand-leave-to {
    height: 0;
    opacity: 0;
  }
</style>
