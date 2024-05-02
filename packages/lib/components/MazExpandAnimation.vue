<template>
  <div
    class="m-expand-animation"
    :class="{ 'm-expand-animation--expanded': isOpen }"
    :aria-hidden="!isOpen"
    role="region"
  >
    <div
      class="m-expand-animation__inner"
      :class="{
        '--overflow-hidden': hasOverflowHidden,
      }"
    >
      <!-- @slot Default Slot - Display content -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  export type Props = {
    /**
     * Duration of the animation in milliseconds
     * @default '300ms'
     */
    duration?: string
    /**
     * Timing function of the animation
     * @default 'ease-in-out'
     */
    timingFunction?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    duration: '300ms',
    timingFunction: 'ease-in-out',
  })

  function parseTransitionDuration(durationString: string): number {
    durationString = durationString.trim()

    if (durationString.endsWith('ms')) {
      return Number.parseFloat(durationString)
    }

    if (durationString.endsWith('s')) {
      return Number.parseFloat(durationString) * 1000
    }

    // Si la chaîne ne correspond à aucun des formats attendus, retourner NaN (Not a Number)
    return Number.NaN
  }

  const isOpen = defineModel<boolean>()
  const hasOverflowHidden = ref(!isOpen.value)
  const durationValue = computed(() => parseTransitionDuration(props.duration) + 300)

  watch(isOpen, (value) => {
    if (value === true) {
      setTimeout(() => {
        hasOverflowHidden.value = false
      }, durationValue.value)
    } else {
      hasOverflowHidden.value = true
    }
  })
</script>

<style lang="postcss" scoped>
  .m-expand-animation {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows v-bind('duration') v-bind('timingFunction');

    &__inner.--overflow-hidden {
      overflow: hidden;
    }

    &--expanded {
      grid-template-rows: 1fr;
    }
  }
</style>
