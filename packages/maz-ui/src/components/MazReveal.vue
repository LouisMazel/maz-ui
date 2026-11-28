<script lang="ts" setup>
import type { RevealEffect } from '../utils/reveal.ts'
import { computed } from 'vue'
import { vReveal } from '../directives/vReveal.ts'

export interface MazRevealProps {
  /**
   * HTML tag of the root element
   * @default 'div'
   */
  tag?: string
  /**
   * The effect
   * @default 'slide-up'
   * @values 'fade', 'slide-up', 'slide-down', 'slide-start', 'slide-end', 'slide-left', 'slide-right', 'blur', 'scale', 'curtain-up', 'curtain-down', 'curtain-start', 'curtain-end', 'iris', 'settle', 'lines', 'words'
   */
  effect?: RevealEffect
  /**
   * Delay before the reveal, in milliseconds
   * @default 0
   */
  delay?: number
  /**
   * Duration of the reveal in milliseconds
   * @default the `--maz-motion-slower` token
   */
  duration?: number
  /**
   * Reveal once. When `false`, the content hides again when it leaves the screen
   * @default true
   */
  once?: boolean
  /**
   * Delay in milliseconds between the children (or the lines and words)
   */
  stagger?: number
  /**
   * `enter` reveals when the block enters the screen, `scroll` links the progress to the scroll
   * @default 'enter'
   * @values 'enter', 'scroll'
   */
  mode?: 'enter' | 'scroll'
  /**
   * Visible ratio (0 to 1) that triggers the reveal
   */
  threshold?: number
  /**
   * Add a blur to the effect
   * @default false
   */
  blur?: boolean
}

const { tag = 'div', effect = 'slide-up', delay, duration, once = true, stagger, mode, threshold, blur } = defineProps<MazRevealProps>()

const options = computed(() => ({ effect, delay, duration, once, stagger, mode, threshold, blur }))
</script>

<template>
  <component :is="tag" v-reveal="options" class="m-reveal">
    <slot />
  </component>
</template>
