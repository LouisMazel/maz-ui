<script lang="ts" setup>
import { nextTick } from 'vue'

export interface MazTransitionExpandProps {
  /** Duration of the animation in milliseconds */
  animationDuration?: string
}

withDefaults(defineProps<MazTransitionExpandProps>(), {
  animationDuration: '300ms',
})

function enter(element: HTMLElement) {
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

  // eslint-disable-next-line ts/no-unused-expressions
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

function afterEnter(element: HTMLElement) {
  element.style.height = 'auto'
}

function leave(element: HTMLElement) {
  const height = getComputedStyle(element).height
  element.style.height = height

  // Force repaint to make sure the
  // animation is triggered correctly.

  // eslint-disable-next-line ts/no-unused-expressions
  getComputedStyle(element).height

  nextTick(() => {
    element.style.height = '0px'
  })
}
</script>

<template>
  <TransitionGroup
    class="m-transition-expand m-reset-css"
    name="maz-expand"
    tag="div"
    @enter="(el: Element) => enter(el as HTMLElement)"
    @after-enter="(el: Element) => afterEnter(el as HTMLElement)"
    @leave="(el: Element) => leave(el as HTMLElement)"
  >
    <slot />
  </TransitionGroup>
</template>

<style lang="postcss" scoped>
  .m-transition-expand,
.m-transition-expand * {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;

  :deep(> *) {
    transition-duration: v-bind('animationDuration');
  }
}
</style>
