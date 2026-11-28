<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

export interface MazScrollAreaProps {
  /** The class of the component */
  class?: HTMLAttributes['class']
  /**
   * Directions that scroll
   * @values `'vertical' | 'horizontal' | 'both'`
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /**
   * Maximum height of the area (any CSS size). The area scrolls when its content is taller
   */
  maxHeight?: string
  /**
   * Maximum width of the area (any CSS size). The area scrolls when its content is wider
   */
  maxWidth?: string
  /**
   * Fade the edges where content remains, instead of a hard cut
   * @default true
   */
  fade?: boolean
  /**
   * Size of the fades (any CSS length)
   * @default '2rem'
   */
  fadeSize?: string
  /**
   * Accessible name of the area. When set, the area is a `region` landmark while it scrolls
   */
  label?: string
}

const {
  class: className = undefined,
  orientation = 'vertical',
  maxHeight = undefined,
  maxWidth = undefined,
  fade = true,
  fadeSize = '2rem',
  label = undefined,
} = defineProps<MazScrollAreaProps>()

const emits = defineEmits<{
  /** Emitted when the area scrolls */
  (name: 'scroll', event: Event): void
}>()

const scroller = useTemplateRef<HTMLElement>('scroller')

const canScroll = ref(false)
const edges = ref({ top: false, bottom: false, start: false, end: false })

let resizeObserver: ResizeObserver | undefined

function update() {
  const element = scroller.value
  if (!element)
    return

  const maxTop = element.scrollHeight - element.clientHeight
  const maxLeft = element.scrollWidth - element.clientWidth
  const left = Math.abs(element.scrollLeft)

  canScroll.value = maxTop > 1 || maxLeft > 1
  edges.value = {
    top: element.scrollTop > 1,
    bottom: maxTop - element.scrollTop > 1,
    start: left > 1,
    end: maxLeft - left > 1,
  }
}

function onScroll(event: Event) {
  update()
  emits('scroll', event)
}

onMounted(() => {
  update()

  if (typeof ResizeObserver === 'undefined' || !scroller.value)
    return

  resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(scroller.value)
  for (const child of scroller.value.children)
    resizeObserver.observe(child)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

defineExpose({
  /** The scrolling element */
  scroller,
  /** Measure the area again (after a change the observers cannot see) */
  update,
})
</script>

<template>
  <div
    ref="scroller"
    class="m-scroll-area m-reset-css maz:relative maz:scrollbar-themed"
    :class="[
      className,
      {
        'm-scroll-area--fade': fade,
        'm-scroll-area--top': edges.top,
        'm-scroll-area--bottom': edges.bottom,
        'm-scroll-area--start': edges.start,
        'm-scroll-area--end': edges.end,
        'maz:overflow-x-hidden maz:overflow-y-auto': orientation === 'vertical',
        'maz:overflow-x-auto maz:overflow-y-hidden': orientation === 'horizontal',
        'maz:overflow-auto': orientation === 'both',
      },
    ]"
    :style="{ maxHeight, maxWidth, '--m-scroll-area-fade': fadeSize }"
    :tabindex="canScroll ? 0 : undefined"
    :role="canScroll && label ? 'region' : undefined"
    :aria-label="canScroll ? label : undefined"
    @scroll.passive="onScroll"
  >
    <!--
      @slot default - The content that scrolls
    -->
    <slot />
  </div>
</template>

<style scoped>
@property --m-scroll-area-top {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}

@property --m-scroll-area-bottom {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}

@property --m-scroll-area-start {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}

@property --m-scroll-area-end {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}

.m-scroll-area {
  outline-offset: -2px;
  overscroll-behavior: contain;
}

.m-scroll-area:focus-visible {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
}

.m-scroll-area--fade {
  transition:
    --m-scroll-area-top calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    --m-scroll-area-bottom calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, ease-out),
    --m-scroll-area-start calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, ease-out),
    --m-scroll-area-end calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      #000 var(--m-scroll-area-top),
      #000 calc(100% - var(--m-scroll-area-bottom)),
      transparent
    ),
    linear-gradient(
      to right,
      transparent,
      #000 var(--m-scroll-area-start),
      #000 calc(100% - var(--m-scroll-area-end)),
      transparent
    );
  mask-composite: intersect;
}

.m-scroll-area--fade:dir(rtl) {
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      #000 var(--m-scroll-area-top),
      #000 calc(100% - var(--m-scroll-area-bottom)),
      transparent
    ),
    linear-gradient(
      to left,
      transparent,
      #000 var(--m-scroll-area-start),
      #000 calc(100% - var(--m-scroll-area-end)),
      transparent
    );
}

.m-scroll-area--top {
  --m-scroll-area-top: var(--m-scroll-area-fade);
}

.m-scroll-area--bottom {
  --m-scroll-area-bottom: var(--m-scroll-area-fade);
}

.m-scroll-area--start {
  --m-scroll-area-start: var(--m-scroll-area-fade);
}

.m-scroll-area--end {
  --m-scroll-area-end: var(--m-scroll-area-fade);
}

@supports not (scrollbar-width: thin) {
  .m-scroll-area::-webkit-scrollbar {
    inline-size: 8px;
    block-size: 8px;
  }

  .m-scroll-area::-webkit-scrollbar-track {
    background: transparent;
  }

  .m-scroll-area::-webkit-scrollbar-thumb {
    border-radius: 9999px;
    background-color: color-mix(in oklab, currentcolor 28%, transparent);
  }

  .m-scroll-area::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in oklab, currentcolor 45%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-scroll-area--fade {
    transition: none;
  }
}
</style>
