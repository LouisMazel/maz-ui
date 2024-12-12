<script lang="ts" setup>
import type { Color } from '@components/types'
import { computed, type HTMLAttributes, onMounted, onUnmounted, ref, type StyleValue } from 'vue'

export interface MazCardSpotlightProps {
  /**
   * The color of the component.
   * @default primary
   */
  color?: Color
  /**
   * Remove the elevation of the component
   * @default false
   */
  noElevation?: boolean
  /**
   * Add padding to the content
   * @default true
   */
  padding?: boolean
  /**
   * The classes to apply to the content div
   */
  contentClass?: HTMLAttributes['class']
  /**
   * Style apply to the content div
   */
  contentStyle?: StyleValue
  /**
   * The opacity of the inner div - should be between 0 and 1
   * When 0 the spotlight is completely visible
   * When 1 the spotlight is only visible on borders
   * @default 0.95
   */
  innerOpacity?: number
}

const props = withDefaults(defineProps<MazCardSpotlightProps>(), {
  noElevation: false,
  color: 'primary',
  padding: true,
  contentClass: undefined,
  contentStyle: undefined,
  innerOpacity: 0.95,
})

const blobElement = ref<HTMLDivElement>()
const fakeblobElement = ref<HTMLDivElement>()
const blobVisible = ref<boolean>(false)

function animateBlob({ clientX, clientY }: { clientX: number, clientY: number }) {
  blobVisible.value = true
  const rec = fakeblobElement.value?.getBoundingClientRect()

  if (rec) {
    blobElement.value?.animate?.(
      [
        {
          transform: `translate(${clientX - rec.left - rec.width / 2}px,${
            clientY - rec.top - rec.height / 2
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

<template>
  <div
    class="m-card-spotlight m-reset-css"
    :class="{ 'maz-elevation': !noElevation }"
    :style="{ 'backgroundColor': alphaColor20, '--inner-opacity': innerOpacity }"
  >
    <div class="inner">
      <div class="content" :class="[{ 'maz-p-4': padding }, contentClass]">
        <slot />
      </div>
    </div>
    <div
      v-show="blobVisible"
      ref="blobElement"
      class="blob"
      :style="{ backgroundColor: alphaColor }"
    />
    <div v-show="blobVisible" ref="fakeblobElement" class="fakeblob" />
  </div>
</template>

<style lang="postcss" scoped>
  .m-card-spotlight {
  @apply maz-relative maz-inline-flex maz-overflow-hidden maz-rounded maz-p-[var(--maz-border-width)];

  .inner {
    @apply maz-relative maz-h-auto maz-w-full maz-overflow-hidden;

    border-radius: calc(var(--maz-border-radius) - var(--maz-border-width));

    &::before {
      content: '';

      @apply maz-absolute maz-left-0 maz-top-0 maz-z-1 maz-h-full maz-w-full maz-bg-color;

      opacity: var(--inner-opacity);
    }
  }

  .content {
    @apply maz-relative maz-z-2 maz-h-full maz-w-full;
  }

  .blob {
    @apply maz-absolute maz-left-0 maz-top-0 maz-z-[0] maz-h-64 maz-w-64 maz-rounded-full maz-blur-2xl;
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
}
</style>
