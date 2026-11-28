<script lang="ts" setup>
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, reactive, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'

export interface MazRollingTextProps {
  /**
   * The text or the number to display. Only the characters that change roll
   */
  value: string | number
  /**
   * Options of `Intl.NumberFormat` used when `value` is a number
   */
  format?: Intl.NumberFormatOptions
  /**
   * Any BCP 47 locale used to format numbers. Falls back to the locale of `@maz-ui/translations`
   * when its plugin is installed, then to the locale of the browser
   */
  locale?: string
  /**
   * `up`: the new characters come from the bottom, `down`: from the top, `auto`: numbers roll up when
   * they increase and down when they decrease, text rolls up
   * @default 'auto'
   */
  direction?: 'up' | 'down' | 'auto'
  /**
   * Roll the characters. When `false`, the text changes instantly
   * @default true
   */
  animated?: boolean
  /**
   * HTML tag of the root element
   * @default 'span'
   */
  tag?: string
  /**
   * Delay each changed character a little (capped) to get a wave effect
   * @default true
   */
  stagger?: boolean
}

export interface MazRollingTextEmits {
  /**
   * Emitted when the last rolling character has finished its animation
   */
  (event: 'animation-end'): void
}

interface Cell {
  id: string
  char: string
  prev?: string
  generation: number
  delay: number
  sign: 1 | -1
  rolling: boolean
}

const {
  value,
  format,
  locale,
  direction = 'auto',
  animated = true,
  tag = 'span',
  stagger = true,
} = defineProps<MazRollingTextProps>()
const emit = defineEmits<MazRollingTextEmits>()
const STAGGER_STEP = 25
const STAGGER_MAX = 150

const { shouldReduceMotion } = useReducedMotion()

function getTranslationsLocale() {
  try {
    return useTranslations().locale
  }
  catch {
    return undefined
  }
}

const translationsLocale = getTranslationsLocale()

const isNumeric = computed(() => typeof value === 'number')

const text = computed(() =>
  typeof value === 'number'
    ? new Intl.NumberFormat(locale || translationsLocale?.value || undefined, format).format(value)
    : value,
)

const RTL_CHARACTER = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/u
const STRONG_CHARACTER = /[\p{L}\u0590-\u08FF]/u

const textDirection = computed<'ltr' | 'rtl'>(() => {
  if (isNumeric.value)
    return 'ltr'

  const firstStrong = [...text.value].find(char => STRONG_CHARACTER.test(char))

  return firstStrong && RTL_CHARACTER.test(firstStrong)
    ? 'rtl'
    : 'ltr'
})

function toCells(characters: string[], numeric: boolean): Cell[] {
  return characters.map((char, index) => ({
    id: numeric ? `r${characters.length - 1 - index}` : `l${index}`,
    char,
    generation: 0,
    delay: 0,
    sign: 1,
    rolling: false,
  }))
}

const cells = reactive<Cell[]>(toCells([...text.value], isNumeric.value))

watch([text, isNumeric, () => value], ([newText, numeric, newValue], [oldText, wasNumeric, oldValue]) => {
  if (newText === oldText && numeric === wasNumeric)
    return

  const characters = [...newText]

  if (!animated || shouldReduceMotion.value) {
    cells.splice(0, cells.length, ...toCells(characters, numeric))
    return
  }

  const sign = direction === 'down' || (direction === 'auto' && typeof newValue === 'number' && typeof oldValue === 'number' && newValue < oldValue) ? -1 : 1
  const previous = new Map(cells.map(cell => [cell.id, cell]))
  let changedIndex = 0

  const next = toCells(characters, numeric).map((cell) => {
    const old = previous.get(cell.id)

    if (old?.char === cell.char)
      return old

    cell.prev = old?.char
    cell.generation = (old?.generation ?? 0) + 1
    cell.rolling = true
    cell.sign = sign
    cell.delay = stagger ? Math.min(changedIndex * STAGGER_STEP, STAGGER_MAX) : 0
    changedIndex++

    return cell
  })

  cells.splice(0, cells.length, ...next)
})

function getStyle(cell: Cell) {
  return { '--m-rolling-from': `${cell.sign * 100}%`, 'animationDelay': `${cell.delay}ms` }
}

function onRollEnd(cell: Cell) {
  cell.rolling = false
  cell.prev = undefined

  if (!cells.some(item => item.rolling))
    emit('animation-end')
}

function onLeaveEnd(cell: Cell) {
  cell.prev = undefined
}
</script>

<template>
  <component
    :is="tag"
    class="m-rolling-text m-reset-css maz:relative maz:inline-block maz:whitespace-pre"
    :class="{ 'm-rolling-text--numeric maz:tabular-nums': isNumeric }"
    :dir="textDirection"
  >
    <span class="maz:sr-only">{{ text }}</span>

    <span class="m-rolling-text__chars" aria-hidden="true"><span
      v-for="cell in cells"
      :key="cell.id"
      class="m-rolling-text__cell"
    ><span
      v-if="cell.prev !== undefined"
      :key="`out-${cell.generation}`"
      class="m-rolling-text__char m-rolling-text__char--out"
      :style="getStyle(cell)"
      @animationend="onLeaveEnd(cell)"
    >{{ cell.prev }}</span><span
      :key="`in-${cell.generation}`"
      class="m-rolling-text__char"
      :class="{ 'm-rolling-text__char--in': cell.rolling }"
      :style="getStyle(cell)"
      @animationend="cell.rolling && onRollEnd(cell)"
    >{{ cell.char }}</span></span></span>
  </component>
</template>

<style scoped>
.m-rolling-text {
  unicode-bidi: isolate;
}

.m-rolling-text--numeric {
  direction: ltr;
}

.m-rolling-text__cell {
  position: relative;
  display: inline-block;
}

.m-rolling-text__char--out {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  animation: m-rolling-text-out calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-in, ease-in) both;
  pointer-events: none;
}

.m-rolling-text__char--in {
  animation: m-rolling-text-in calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out) both;
}

@keyframes m-rolling-text-in {
  from {
    opacity: 0;
    transform: translateY(var(--m-rolling-from));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes m-rolling-text-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(calc(var(--m-rolling-from) * -1));
  }
}
</style>
