<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '../composables/useResizeObserver.ts'

export interface MazMiddleTruncateProps {
  /**
   * The text to cut in the middle when it does not fit. It stays whole in the accessible name
   */
  text: string
  /**
   * Number of characters kept at the end. By default the extension and a few characters before it (`-2026.pdf`)
   */
  endChars?: number
  /**
   * The character that replaces the cut part
   * @default '…'
   */
  ellipsis?: string
  /**
   * Open the full text from the center on hover and on focus when the text is cut
   * @default true
   */
  reveal?: boolean
}

const {
  text,
  endChars = undefined,
  ellipsis = '…',
  reveal = true,
} = defineProps<MazMiddleTruncateProps>()

const EXTENSION = /\.[a-z0-9]{1,8}$/i
const EXTENSION_CONTEXT = 5
const DEFAULT_END = 6

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const visibleRef = useTemplateRef<HTMLElement>('visibleRef')
const displayed = ref<string>()

let context: CanvasRenderingContext2D | null | undefined

const tailLength = computed(() => {
  const chars = [...text]

  if (endChars !== undefined)
    return Math.min(Math.max(endChars, 0), chars.length)

  const extension = EXTENSION.exec(text)?.[0].length

  return Math.min(extension ? extension + EXTENSION_CONTEXT : DEFAULT_END, chars.length)
})

const isTruncated = computed(() => displayed.value !== undefined && displayed.value !== text)

function getContext() {
  if (context === undefined)
    context = document.createElement('canvas').getContext('2d')

  return context
}

function applyFont(canvas: CanvasRenderingContext2D, element: HTMLElement) {
  const style = globalThis.getComputedStyle(element)

  canvas.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`

  if ('letterSpacing' in canvas)
    canvas.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
}

function compute() {
  const element = visibleRef.value
  const canvas = element && getContext()

  if (!element || !canvas)
    return

  const available = element.clientWidth

  if (available <= 0)
    return

  applyFont(canvas, element)

  if (canvas.measureText(text).width <= available) {
    displayed.value = text
    return
  }

  const chars = [...text]
  const tail = chars.slice(chars.length - tailLength.value).join('')
  const fits = (count: number) => canvas.measureText(`${chars.slice(0, count).join('')}${ellipsis}${tail}`).width <= available
  const maxStart = Math.max(chars.length - tailLength.value - 1, 0)

  let low = 0
  let high = maxStart

  while (low < high) {
    const middle = Math.ceil((low + high) / 2)

    if (fits(middle))
      low = middle
    else
      high = middle - 1
  }

  displayed.value = `${chars.slice(0, low).join('')}${ellipsis}${tail}`
}

onMounted(async () => {
  compute()
  await nextTick()
  await document.fonts?.ready
  compute()
})

useResizeObserver(rootRef, compute)

watch(() => [text, endChars, ellipsis], compute, { flush: 'post' })
</script>

<template>
  <span
    ref="rootRef"
    class="m-middle-truncate m-reset-css"
    :class="{ 'm-middle-truncate--truncated': isTruncated, 'm-middle-truncate--reveal': isTruncated && reveal }"
    :tabindex="isTruncated && reveal ? 0 : undefined"
  >
    <span class="maz:sr-only">{{ text }}</span>
    <span ref="visibleRef" class="m-middle-truncate__text" aria-hidden="true">{{ displayed ?? text }}</span>
    <span v-if="isTruncated && reveal" class="m-middle-truncate__full" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<style scoped>
.m-middle-truncate {
  position: relative;
  display: block;
  min-inline-size: 0;
  max-inline-size: 100%;
}

.m-middle-truncate__text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-middle-truncate--reveal {
  outline: var(--maz-focus-ring-width, 2px) solid transparent;
  outline-offset: 2px;
}

.m-middle-truncate--reveal:focus-visible {
  outline-color: var(--maz-focus-ring-color, var(--maz-primary));
}

.m-middle-truncate__full {
  position: absolute;
  inset-block: -0.25em;
  inset-inline-start: 50%;
  z-index: 10;
  box-sizing: border-box;
  min-inline-size: 100%;
  max-inline-size: min(90vw, 60rem);
  padding-inline: 0.5em;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  visibility: hidden;
  background: var(--maz-container-bg, var(--maz-surface));
  border-radius: 0.375rem;
  box-shadow: var(--maz-shadow-elevation-2, 0 4px 12px rgb(0 0 0 / 15%));
  opacity: 0;
  clip-path: inset(0 50% 0 50% round 0.375rem);
  translate: -50% 0;
  inline-size: max-content;
  transition:
    clip-path calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    visibility 0s linear calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1));
}

.m-middle-truncate--reveal:focus-visible .m-middle-truncate__full,
.m-middle-truncate--reveal:focus-within .m-middle-truncate__full {
  visibility: visible;
  opacity: 1;
  clip-path: inset(0 0 0 0 round 0.375rem);
  transition-delay: 0s;
}

@media (hover: hover) {
  .m-middle-truncate--reveal:hover .m-middle-truncate__full {
    visibility: visible;
    opacity: 1;
    clip-path: inset(0 0 0 0 round 0.375rem);
    transition-delay: 0s;
  }
}
</style>
