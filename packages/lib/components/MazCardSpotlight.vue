<template>
  <div
    class="card"
    :class="{ 'maz-elevation': !noElevation }"
    :style="{ backgroundColor: alphaColor20 }"
  >
    <div class="inner">
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <div ref="blobElement" class="blob" :style="{ backgroundColor: alphaColor }"></div>
    <div ref="fakeblobElement" class="fakeblob"></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import type { Color } from './types'

  export type { Color }

  const props = withDefaults(
    defineProps<{
      noElevation?: boolean
      color?: Color
    }>(),
    {
      noElevation: false,
      color: 'primary',
    },
  )

  const blobElement = ref<HTMLDivElement>()
  const fakeblobElement = ref<HTMLDivElement>()

  function animateBlob(event: MouseEvent) {
    const rec = fakeblobElement.value?.getBoundingClientRect()

    if (rec) {
      blobElement.value?.animate?.(
        [
          {
            transform: `translate(${event.clientX - rec.left - rec.width / 2}px,${
              event.clientY - rec.top - rec.height / 2
            }px)`,
          },
        ],
        {
          duration: 300,
          fill: 'forwards',
        },
      )
    }
  }

  const alphaColor = computed(() => `var(--maz-color-${props.color}-alpha)`)
  const alphaColor20 = computed(() => `var(--maz-color-${props.color}-alpha-20)`)

  onMounted(() => {
    window.addEventListener('mousemove', animateBlob)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', animateBlob)
  })
</script>

<style lang="postcss" scoped>
  .card {
    @apply maz-relative maz-inline-block maz-overflow-hidden maz-rounded maz-p-[var(--maz-border-width)];

    background-color: v-bind('alphaColor20');
  }

  .inner {
    @apply maz-relative maz-overflow-hidden maz-rounded;

    &::before {
      content: '';

      @apply maz-absolute maz-left-0 maz-top-0 maz-z-1 maz-h-full maz-w-full maz-bg-color maz-opacity-[0.9];
    }
  }

  .content {
    @apply maz-relative maz-z-2;
  }

  .blob {
    @apply maz-absolute maz-left-0 maz-top-0 maz-z-[0] maz-h-64 maz-w-64 maz-rounded-full maz-blur-2xl;

    background-color: v-bind('alphaColor');
  }

  .fakeblob {
    display: hidden;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    border-radius: 50%;

    @apply maz-h-52 maz-w-52 maz-rounded-full;
  }
</style>
