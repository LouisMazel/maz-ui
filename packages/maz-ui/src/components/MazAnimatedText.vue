<script setup lang="ts">
import type { MazColor } from './types.ts'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { vReveal } from '../directives/vReveal.ts'
import { runScramble, runTypewriter, splitHighlights } from '../utils/animatedText.ts'
import { observeIntersection } from '../utils/reveal.ts'

export type MazAnimatedTextEffect = 'scramble' | 'rotate' | 'typewriter' | 'shimmer' | 'highlight'
export type MazAnimatedTextHighlightType = 'marker' | 'underline' | 'circle'

export interface MazAnimatedTextProps {
  /**
   * The text to animate
   * @example "Hello"
   */
  text?: string
  /**
   * The last word(s) to be highlighted
   * @example "world"
   */
  lastWord?: string
  /**
   * The delay of the animation
   * @default 0
   */
  delay?: number
  /**
   * The direction of the animation
   * @default "up"
   * @values "up", "down", "left", "right"
   */
  direction?: 'up' | 'down' | 'left' | 'right'
  /**
   * The tag to use for the text
   * @default "span"
   */
  tag?: string
  /**
   * The delay between each word
   * @default 75
   */
  wordDelay?: number
  /**
   * The column gap between each word
   * @default 0.5
   */
  columnGap?: number
  /**
   * The row gap between each word
   * @default 0
   */
  rowGap?: number
  /**
   * The duration of the animation in milliseconds. With an `effect`: the decoding of `scramble`, the cycle of `shimmer`, the drawing of `highlight`
   * @default 2000 (1000 for `scramble`, 2000 for `shimmer`, 800 for `highlight`)
   */
  duration?: number
  /**
   * Play the animation only once
   * @default true
   */
  once?: boolean
  /**
   * Another animation instead of the words coming in: `scramble` decodes the text letter by letter, `rotate` changes
   * one word of the sentence in a loop (see `words`), `typewriter` types the text, `shimmer` crosses the text with a
   * band of light (loading states), `highlight` draws a marker, an underline or a circle around keywords. Reduced
   * motion shows the final text at once
   */
  effect?: MazAnimatedTextEffect
  /**
   * Average time in milliseconds to type a character (`typewriter`). Without it, a human rhythm of about 90ms. The
   * pauses after the commas and the full stops are kept, scaled to it
   * @example 40
   */
  typeSpeed?: number
  /**
   * The words that take turns at the end of the sentence (`rotate`). Put `{word}` in `text` to place them elsewhere
   * @example ["fast", "beautiful", "accessible"]
   */
  words?: string[]
  /**
   * Time in milliseconds a word stays before the next one (`rotate`)
   * @default 2500
   */
  interval?: number
  /**
   * The words to highlight in `text` (`highlight`). Without it, put `<mark>` elements in the default slot
   * @example "accessible"
   */
  highlight?: string | string[]
  /**
   * The shape drawn around the highlighted words (`highlight`)
   * @default "marker"
   * @values "marker", "underline", "circle"
   */
  highlightType?: MazAnimatedTextHighlightType
  /**
   * The color of the highlight (`highlight`)
   * @default "primary"
   */
  color?: MazColor
  /**
   * The gradient from color
   * @default "info"
   */
  gradientFrom?: MazColor
  /**
   * The gradient via color
   * @default "secondary"
   */
  gradientVia?: MazColor
  /**
   * The gradient to color
   * @default "secondary"
   */
  gradientTo?: MazColor
}

defineOptions({
  inheritAttrs: false,
})

const {
  text = '',
  lastWord,
  delay = 0,
  wordDelay = 75,
  direction = 'up',
  tag = 'span',
  columnGap = 0.5,
  rowGap = 0,
  duration,
  once = true,
  effect,
  words: rotatingWords = [],
  typeSpeed,
  interval = 2500,
  highlight,
  highlightType = 'marker',
  color = 'primary',
  gradientFrom = 'primary',
  gradientVia = 'info',
  gradientTo = 'secondary',
} = defineProps<MazAnimatedTextProps>()

defineSlots<{
  /** Text with `<mark>` elements to highlight (`highlight`). Replaces `text` */
  default?: () => unknown
}>()

const STROKES: Record<MazAnimatedTextHighlightType, { box: string, path: string }> = {
  marker: { box: '0 0 100 20', path: 'M2 11 C 18 6, 30 15, 48 10 S 82 7, 98 10' },
  underline: { box: '0 0 100 10', path: 'M1 6 C 20 2, 35 9, 55 5 S 85 3, 99 6' },
  circle: { box: '0 0 100 40', path: 'M52 3 C 20 1, 3 14, 6 24 C 9 35, 40 38, 66 36 C 92 33, 98 18, 88 9 C 80 3, 60 1, 40 3' },
}

const words = computed(() => text.split(' '))

const options = computed(() => ({
  effect: `slide-${direction}` as const,
  blur: true,
  delay,
  duration: duration ?? 2000,
  once,
  stagger: wordDelay,
}))

const gradientStyle = computed(() => {
  if (!lastWord) {
    return undefined
  }

  const toVar = (name: MazColor) => name === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${name})`

  const colors: string[] = [
    toVar(gradientFrom),
    ...(gradientVia
      ? [toVar(gradientVia)]
      : []),
    toVar(gradientTo),
  ]

  return `linear-gradient(to right, ${colors.join(', ')})`
})
const { shouldReduceMotion } = useReducedMotion()

const root = useTemplateRef<HTMLElement>('effectRoot')
const armed = ref(false)
const display = ref('')
const typing = ref(false)
const visible = ref(false)
const paused = ref(false)
const played = ref(false)
const activeIndex = ref(0)
const previousIndex = ref(-1)

const hasOverlay = computed(() => effect === 'scramble' || effect === 'typewriter')
const effectDuration = computed(() => duration ?? (effect === 'scramble' ? 1000 : effect === 'highlight' ? 800 : 2000))
const segments = computed(() => splitHighlights(text, highlight))
const rotateParts = computed(() => {
  const [before = '', after = ''] = text.split('{word}')

  return text.includes('{word}') ? { before, after } : { before: `${text} `, after: '' }
})
const effectStyle = computed(() => ({
  '--m-animated-text-duration': `${effectDuration.value}ms`,
  '--m-animated-text-color': color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})`,
}))

let cancel: (() => void) | undefined
let stopObserving: (() => void) | undefined
let timer: ReturnType<typeof setInterval> | undefined
let startTimer: ReturnType<typeof setTimeout> | undefined

function stopRun() {
  cancel?.()
  cancel = undefined
  clearTimeout(startTimer)
  typing.value = false
}

function finish() {
  cancel = undefined
  typing.value = false
  armed.value = false
}

function run() {
  stopRun()

  if (!hasOverlay.value || shouldReduceMotion.value) {
    armed.value = false
    return
  }

  armed.value = true
  display.value = effect === 'scramble' ? text.replaceAll(/[\p{L}\p{N}]/gu, ' ') : ''

  startTimer = setTimeout(() => {
    if (effect === 'scramble') {
      cancel = runScramble(text, { duration: effectDuration.value, onFrame: value => (display.value = value), onDone: finish })
    }
    else {
      typing.value = true
      cancel = runTypewriter(text, { onType: value => (display.value = value), onDone: finish, speed: typeSpeed })
    }
  }, delay)
}

function onVisible(entering: boolean) {
  visible.value = entering

  if (entering) {
    if (!played.value || !once) {
      played.value = true

      if (hasOverlay.value)
        run()
    }
  }
  else if (!once && effect !== 'rotate') {
    played.value = false
    stopRun()
    armed.value = false
  }
}

function startRotation() {
  clearInterval(timer)
  timer = undefined

  if (effect !== 'rotate' || rotatingWords.length < 2 || shouldReduceMotion.value || !visible.value || paused.value)
    return

  timer = setInterval(() => {
    previousIndex.value = activeIndex.value
    activeIndex.value = (activeIndex.value + 1) % rotatingWords.length
  }, interval)
}

function drawMarks() {
  if (effect !== 'highlight' || !root.value)
    return

  for (const [index, mark] of [...root.value.querySelectorAll('mark')].entries()) {
    mark.style.setProperty('--m-i', String(index))

    if (mark.querySelector('.m-animated-text__stroke'))
      continue

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    svg.setAttribute('class', `m-animated-text__stroke m-animated-text__stroke--${highlightType}`)
    svg.setAttribute('viewBox', STROKES[highlightType].box)
    svg.setAttribute('preserveAspectRatio', 'none')
    svg.setAttribute('aria-hidden', 'true')
    path.setAttribute('d', STROKES[highlightType].path)
    path.setAttribute('pathLength', '1')
    svg.append(path)
    mark.append(svg)
  }
}

onMounted(() => {
  if (!effect || !root.value)
    return

  if (effect === 'highlight')
    drawMarks()

  stopObserving = observeIntersection(root.value, entry => onVisible(entry.isIntersecting))
})

onUpdated(drawMarks)

watch(() => text, async () => {
  if (hasOverlay.value && played.value) {
    run()
  }
  else if (effect === 'highlight') {
    await nextTick()
    drawMarks()
  }
})

watch([visible, paused, () => rotatingWords.length, () => interval, shouldReduceMotion], startRotation)

watch(() => highlightType, () => {
  for (const stroke of root.value?.querySelectorAll('.m-animated-text__stroke') ?? [])
    stroke.remove()

  drawMarks()
})

onBeforeUnmount(() => {
  stopRun()
  stopObserving?.()
  clearInterval(timer)
})
</script>

<template>
  <div class="m-reset-css m-animated-text" :style="{ '--maz-gradient-style': gradientStyle }">
    <!-- eslint-disable better-tailwindcss/no-deprecated-classes -->
    <component :is="tag" v-if="!effect" v-reveal="options" v-bind="$attrs" class="m-animated-text__root maz:inline-flex maz:flex-wrap" :style="{ columnGap: `${columnGap}rem`, rowGap: `${rowGap}rem` }">
      <span
        v-for="(word, index) in words"
        :key="word + index"
        class="m-animated-text__word maz:inline-flex"
      >
        <span
          class="m-animated-text__word-inner maz:inline-flex"
          data-maz-reveal-item
        >
          {{ word }}
        </span>
      </span>

      <span
        v-if="lastWord"
        class="m-animated-text__last-word maz:inline-flex"
        data-maz-reveal-item
      >
        <span class="m-animated-text__last-word-inner maz:relative maz:inline-flex">
          <span class="m-animated-text__last-word-inner-text maz:relative">{{ lastWord }}</span>
        </span>
      </span>
    </component>
    <component
      :is="tag"
      v-else
      ref="effectRoot"
      v-bind="$attrs"
      class="m-animated-text__effect"
      :class="[`m-animated-text__effect--${effect}`, { 'm-animated-text__effect--armed': armed, 'm-animated-text__effect--idle': !visible, 'm-animated-text__effect--played': played }]"
      :style="effectStyle"
      :aria-live="effect === 'rotate' ? 'off' : undefined"
      @pointerenter="paused = true"
      @pointerleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <template v-if="hasOverlay">
        <span class="m-animated-text__sizer">{{ text }}</span>
        <span v-if="armed" class="m-animated-text__overlay" aria-hidden="true">{{ display }}<span v-if="typing" class="m-animated-text__caret" /></span>
      </template>

      <template v-else-if="effect === 'rotate'">
        {{ rotateParts.before }}<span class="m-animated-text__rotator"><span
          v-for="(word, index) in rotatingWords"
          :key="word + index"
          class="m-animated-text__rotator-word"
          :data-state="index === activeIndex ? 'active' : index === previousIndex ? 'out' : 'idle'"
          :aria-hidden="index === activeIndex ? undefined : 'true'"
        >{{ word }}</span></span>{{ rotateParts.after }}
      </template>

      <span v-else-if="effect === 'shimmer'" class="m-animated-text__shimmer">{{ text }}</span>

      <template v-else-if="effect === 'highlight'">
        <slot v-if="$slots.default" />
        <template v-else>
          <template v-for="(segment, index) in segments" :key="index">
            <mark v-if="segment.mark">{{ segment.text }}</mark>
            <template v-else>
              {{ segment.text }}
            </template>
          </template>
        </template>
      </template>
    </component>
  </div>
</template>

<style scoped>
.m-animated-text__root {
  --maz-reveal-distance: 20px;
  --maz-reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

:where(.dark, [data-theme='dark']) .m-animated-text__last-word-inner::before {
  opacity: 0.5;
}

.m-animated-text__last-word-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  z-index: 0;
  opacity: 0.4;
  background-image: var(--maz-gradient-style);
  filter: blur(16px);
}

.m-animated-text__effect {
  --m-hl-duration: var(--m-animated-text-duration, 800ms);

  isolation: isolate;
}

.m-animated-text__effect--scramble,
.m-animated-text__effect--typewriter {
  display: inline-grid;
}

.m-animated-text__sizer,
.m-animated-text__overlay {
  grid-area: 1 / 1;
}

.m-animated-text__effect--armed .m-animated-text__sizer {
  color: transparent;
}

.m-animated-text__overlay {
  white-space: pre-wrap;
}

.m-animated-text__caret {
  display: inline-block;
  inline-size: 0.08em;
  block-size: 1em;
  margin-inline-start: 0.05em;
  vertical-align: -0.12em;
  background: currentcolor;
  animation: m-animated-text-caret 1s steps(1) infinite;
}

@keyframes m-animated-text-caret {
  50% {
    opacity: 0;
  }
}

.m-animated-text__rotator {
  display: inline-grid;
  overflow: hidden;
  padding-block: 0.12em;
  margin-block: -0.12em;
  vertical-align: bottom;
}

.m-animated-text__rotator-word {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(100%);
  transition:
    transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-animated-text__rotator-word[data-state='active'] {
  opacity: 1;
  transform: none;
}

.m-animated-text__rotator-word[data-state='out'] {
  transform: translateY(-100%);
}

.m-animated-text__shimmer {
  --m-shimmer-base: color-mix(in srgb, currentcolor 45%, transparent);

  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(110deg, var(--m-shimmer-base) 30%, currentcolor 50%, var(--m-shimmer-base) 70%);
  background-repeat: no-repeat;
  background-position: 100% 0;
  background-size: 250% 100%;
  background-clip: text;
  animation: m-animated-text-shimmer calc(var(--m-animated-text-duration, 2000ms) * var(--maz-motion-scale, 1)) linear
    infinite;
}

.m-animated-text__effect--idle .m-animated-text__shimmer {
  animation-play-state: paused;
}

.m-animated-text__shimmer:dir(rtl) {
  animation-direction: reverse;
}

@keyframes m-animated-text-shimmer {
  to {
    background-position: 0 0;
  }
}

.m-animated-text__effect--highlight {
  line-height: 1.5;
}

.m-animated-text__effect--highlight :deep(mark) {
  position: relative;
  color: inherit;
  background: none;
}

.m-animated-text__effect--highlight :deep(.m-animated-text__stroke) {
  position: absolute;
  z-index: -1;
  overflow: visible;
  pointer-events: none;
  fill: none;
  stroke: var(--m-animated-text-color);
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.m-animated-text__effect--highlight :deep(.m-animated-text__stroke path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
}

.m-animated-text__effect--highlight.m-animated-text__effect--played :deep(.m-animated-text__stroke path) {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset calc(var(--m-hl-duration) * var(--maz-motion-scale, 1))
    var(--maz-easing-in-out, ease-in-out) calc(var(--m-i, 0) * 200ms);
}

.m-animated-text__effect--highlight :deep(.m-animated-text__stroke--marker) {
  inset-block: 38% -2%;
  inset-inline: -0.15em;
  inline-size: calc(100% + 0.3em);
  block-size: 62%;
  opacity: 0.4;
  stroke-width: 0.8em;
}

.m-animated-text__effect--highlight :deep(.m-animated-text__stroke--underline) {
  inset-block: auto -0.28em;
  inset-inline: -0.05em;
  inline-size: calc(100% + 0.1em);
  block-size: 0.3em;
  stroke-width: 0.1em;
}

.m-animated-text__effect--highlight :deep(.m-animated-text__stroke--circle) {
  inset-block: -0.3em;
  inset-inline: -0.4em;
  inline-size: calc(100% + 0.8em);
  block-size: calc(100% + 0.6em);
  stroke-width: 0.07em;
}
</style>

<style>
html.m-motion-reduced .m-animated-text__shimmer {
  -webkit-text-fill-color: currentcolor;
  background: none;
  animation: none;
}

html.m-motion-reduced .m-animated-text__rotator-word {
  transition: none;
}

html.m-motion-reduced .m-animated-text__effect--highlight .m-animated-text__stroke path {
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  html:not(.m-motion-full) .m-animated-text__shimmer {
    -webkit-text-fill-color: currentcolor;
    background: none;
    animation: none;
  }

  html:not(.m-motion-full) .m-animated-text__rotator-word {
    transition: none;
  }

  html:not(.m-motion-full) .m-animated-text__effect--highlight .m-animated-text__stroke path {
    transition: none !important;
  }
}
</style>
