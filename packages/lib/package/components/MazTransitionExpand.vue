<template>
  <Transition
    class="m-transition-expand"
    name="maz-expand"
    tag="div"
    @enter="(el) => enter(el as HTMLElement)"
    @after-enter="(el) => afterEnter(el as HTMLElement)"
    @leave="(el) => leave(el as HTMLElement)"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue'

  enum States {
    NONE = 'none',
    ENTERING = 'entering',
    AFTER_ENTERING = 'entering',
    LEAVING = 'entering',
  }

  const state = ref<States>(States.NONE)

  const enter = (element: HTMLElement) => {
    if (state.value !== States.NONE) {
      return
    }

    const width = getComputedStyle(element).width

    element.style.width = width
    element.style.position = 'absolute'
    element.style.visibility = 'hidden'
    element.style.height = 'auto'
    element.style.top = 'bottom'

    const height = getComputedStyle(element).height

    element.style.width = ''
    element.style.position = ''
    element.style.visibility = ''
    element.style.height = '0px'

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
    nextTick(() => {
      element.style.height = height
    })
  }

  const afterEnter = (element: HTMLElement) => {
    if (state.value !== States.NONE) {
      return
    }

    element.style.height = 'auto'
  }

  const leave = (element: HTMLElement) => {
    if (state.value !== States.NONE) {
      return
    }

    const height = getComputedStyle(element).height
    element.style.height = height

    // Force repaint to make sure the
    // animation is triggered correctly.
    /* eslint-disable */
    getComputedStyle(element).height
    /* eslint-enable */
    nextTick(() => {
      element.style.height = '0px'
    })
  }
</script>

<style lang="postcss" scoped>
  .m-transition-expand,
  .m-transition-expand * {
    will-change: height;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>
