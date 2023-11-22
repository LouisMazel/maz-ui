<template>
  <TransitionGroup
    class="m-transition-expand"
    name="maz-expand"
    tag="div"
    @enter="(el: Element) => enter(el as HTMLElement)"
    @after-enter="(el: Element) => afterEnter(el as HTMLElement)"
    @leave="(el: Element) => leave(el as HTMLElement)"
  >
    <slot></slot>
  </TransitionGroup>
</template>

<script lang="ts" setup>
  import { nextTick } from 'vue'

  withDefaults(
    defineProps<{
      // Expand animation duration in milliseconds
      animationDuration?: string
    }>(),
    {
      animationDuration: '300ms',
    },
  )

  const enter = (element: HTMLElement) => {
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
    getComputedStyle(element).height

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
    element.style.height = 'auto'
  }

  const leave = (element: HTMLElement) => {
    const height = getComputedStyle(element).height
    element.style.height = height

    // Force repaint to make sure the
    // animation is triggered correctly.
    getComputedStyle(element).height

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

    :deep(> *) {
      @apply maz-duration-[v-bind(animationDuration)];
    }
  }
</style>
