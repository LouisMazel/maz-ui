<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

export interface MazProgressiveBlurProps {
  /** The class of the component */
  class?: HTMLAttributes['class']
  /**
   * Edge of the parent where the blur is the strongest. `start` and `end` follow the reading direction
   * @values `'top' | 'bottom' | 'start' | 'end'`
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'start' | 'end'
  /**
   * Size of the blurred band, from the edge toward the content (its height, or its width for `start` and `end`). Any CSS length
   * @default '6rem'
   */
  height?: string
  /**
   * Blur of the edge, in pixels
   * @default 12
   */
  strength?: number
}

const {
  class: className = undefined,
  position = 'bottom',
  height = '6rem',
  strength = 12,
} = defineProps<MazProgressiveBlurProps>()

const LAYER_COUNT = 6

const layers = computed(() => {
  const weight = (LAYER_COUNT + 1) / 2

  return Array.from({ length: LAYER_COUNT }, (_, index) => ({
    blur: `${Math.round(((strength / LAYER_COUNT) * (index + 1) / weight) * 100) / 100}px`,
    from: `${(index / LAYER_COUNT) * 100}%`,
    to: `${((index + 1) / LAYER_COUNT) * 100}%`,
  }))
})
</script>

<template>
  <div
    class="m-progressive-blur m-reset-css"
    :class="[`m-progressive-blur--${position}`, className]"
    :style="{ '--m-progressive-blur-size': height }"
    aria-hidden="true"
  >
    <span
      v-for="(layer, index) in layers"
      :key="index"
      class="m-progressive-blur__layer"
      :style="{ '--m-progressive-blur-amount': layer.blur, '--m-progressive-blur-from': layer.from, '--m-progressive-blur-to': layer.to }"
    />
  </div>
</template>

<style scoped>
.m-progressive-blur {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.m-progressive-blur--bottom,
.m-progressive-blur--top {
  inset-inline: 0;
  block-size: var(--m-progressive-blur-size);
}

.m-progressive-blur--bottom {
  --m-progressive-blur-direction: to bottom;

  inset-block-end: 0;
}

.m-progressive-blur--top {
  --m-progressive-blur-direction: to top;

  inset-block-start: 0;
}

.m-progressive-blur--start,
.m-progressive-blur--end {
  inset-block: 0;
  inline-size: var(--m-progressive-blur-size);
}

.m-progressive-blur--end {
  --m-progressive-blur-direction: to right;

  inset-inline-end: 0;
}

.m-progressive-blur--start {
  --m-progressive-blur-direction: to left;

  inset-inline-start: 0;
}

.m-progressive-blur--end:dir(rtl) {
  --m-progressive-blur-direction: to left;
}

.m-progressive-blur--start:dir(rtl) {
  --m-progressive-blur-direction: to right;
}

.m-progressive-blur__layer {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(var(--m-progressive-blur-amount));
  mask-image: linear-gradient(
    var(--m-progressive-blur-direction),
    transparent var(--m-progressive-blur-from),
    #000 var(--m-progressive-blur-to)
  );
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .m-progressive-blur__layer {
    display: none;
  }

  .m-progressive-blur {
    background-image: linear-gradient(
      var(--m-progressive-blur-direction),
      transparent,
      color-mix(in oklab, var(--maz-surface, white) 85%, transparent)
    );
  }
}
</style>
