<script lang="ts" setup>
import type { MazFieldState } from './useFieldState.ts'
import { computed } from 'vue'
import { useReducedMotion } from '../../composables/useReducedMotion.ts'

export interface MazFieldMessageProps {
  /** Id of the element, referenced by `aria-describedby` of the field */
  id?: string
  /** The message. When it changes, the previous one fades out and the new one rolls in */
  text: string
  /** Validation state: it colors the message */
  state?: MazFieldState
  /**
   * Animate the change of the message
   * @default true
   */
  animated?: boolean
}

const { id, text, state, animated = true } = defineProps<MazFieldMessageProps>()

const { shouldReduceMotion } = useReducedMotion()

const colorClass = computed(() => {
  if (state === 'error')
    return 'maz:text-destructive-600'
  if (state === 'success')
    return 'maz:text-success-600'
  if (state === 'warning')
    return 'maz:text-warning-600'

  return 'maz:text-muted'
})

const hasTransition = computed(() => animated && !shouldReduceMotion.value)
</script>

<template>
  <div :id class="m-field-message maz:text-body-sm" :class="colorClass" aria-live="polite">
    <Transition name="m-field-message" mode="out-in" :css="hasTransition">
      <span :key="text" class="m-field-message__text">{{ text }}</span>
    </Transition>
  </div>
</template>

<style scoped>
.m-field-message__text {
  display: block;
}

.m-field-message-enter-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-field-message-leave-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    transform calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.m-field-message-enter-from {
  opacity: 0;
  transform: translateY(0.375em);
}

.m-field-message-leave-to {
  opacity: 0;
  transform: translateY(-0.375em);
}
</style>
