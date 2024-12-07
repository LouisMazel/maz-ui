<script lang="ts" setup>
import { computed, ref, useSlots, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The number to animate
     */
    count: number
    /**
     * Duration of the animation in milliseconds
     * @default 1000
     */
    duration?: number
    /**
     * Suffix to display next to the number
     */
    prefix?: string
    /**
     * Suffix to display next to the number
     */
    suffix?: string
    /**
     * Delay before the animation starts in milliseconds
     * @default 100
     */
    delay?: number
  }>(),
  {
    duration: 1000,
    prefix: undefined,
    suffix: undefined,
    delay: 100,
  },
)
const slots = useSlots()

const hasPrefix = computed(() => !!props.prefix || !!slots.prefix)
const hasSuffix = computed(() => !!props.suffix || !!slots.suffix)

const isAnimated = ref(true)

watch(
  () => props.count,
  (count, oldCount) => {
    if (count === oldCount)
      return
    isAnimated.value = false
    setTimeout(() => {
      isAnimated.value = true
    }, props.delay)
  },
)

const durationInMs = computed(() => `${props.duration}ms`)
</script>

<template>
  <span
    class="m-animated-counter m-reset-css"
    :class="{
      '--animated': isAnimated,
      '--prefixed': hasPrefix,
      '--suffixed': hasSuffix,
    }"
    :style="{
      '--count': count,
      '--animation-duration': durationInMs,
    }"
  >
    <span class="maz-sr-only">
      <slot name="prefix">{{ prefix }}</slot>
      {{ count }}
      <slot name="suffix">{{ suffix }}</slot>
    </span>

    <span v-if="hasPrefix || hasSuffix" class="m-animated-counter__fix">
      <!-- @slot Prefix slot - Add a prefix next to the number (e.g: "$") -->
      <slot name="prefix">{{ prefix }}</slot>
      <!-- @slot Suffix slot - Add a suffix next to the number (e.g: "%") -->
      <slot name="suffix">{{ suffix }}</slot>
    </span>
  </span>
</template>

<style lang="postcss" scoped>
  .m-animated-counter {
  @apply maz-whitespace-nowrap maz-tabular-nums;

  &.--animated {
    animation: counter var(--animation-duration) ease-out forwards;
    counter-set: count var(--count-end);
  }

  &.--prefixed::after {
    content: counter(count);
  }

  &.--suffixed::before {
    content: counter(count);
  }

  &:not(.--prefixed, .--suffixed)::before {
    content: counter(count);
  }
}

@property --count {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}

@property --count-end {
  syntax: '<integer>';
  initial-value: 0;
  inherits: false;
}

@keyframes counter {
  from {
    --count-end: 0;
  }

  to {
    --count-end: var(--count);
  }
}
</style>
