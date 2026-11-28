<script lang="ts" setup>
import type { TranslationKey } from '@maz-ui/translations'
import type { MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { isApple } from '@maz-ui/utils/helpers/isApple'
import { matchesShortcut } from '@maz-ui/utils/helpers/shortcut'
import { computed, onMounted, ref } from 'vue'
import { useEventListener } from '../composables/useEventListener.ts'

export interface MazKbdProps {
  /**
   * The keys: a shortcut as a string (`'mod+k'`, `'Ctrl + Shift + P'`) or one entry per key (`['mod', 'k']`).
   * `mod` is the key of the shortcuts of the platform: `⌘` on Apple, `Ctrl` elsewhere.
   * Leave it empty to show the content of the default slot as a single key
   * @example 'mod+k'
   */
  keys?: string | string[]
  /**
   * Platform that gives the symbols of the keys. By default it is read from the browser once the component is mounted
   * (the server and the first render use `other`, so there is no hydration mismatch)
   * @values auto, apple, other
   * @default 'auto'
   */
  platform?: 'auto' | 'apple' | 'other'
  /**
   * Size of the keys
   * @values mini, xs, sm, md, lg, xl
   * @default 'md'
   */
  size?: MazSize
  /**
   * The keys press down while the user really types the shortcut (only while the component is mounted)
   * @default false
   */
  live?: boolean
}

export interface MazKbdEmits {
  /**
   * Emitted when the user types the shortcut (`live`)
   */
  (event: 'press', value: KeyboardEvent): void
}

const { keys, platform = 'auto', size = 'md', live = false } = defineProps<MazKbdProps>()
const emit = defineEmits<MazKbdEmits>()

defineSlots<{
  /**
   * A single key, when `keys` is not set
   */
  default?: () => unknown
}>()

const { t } = useTranslations()

const detectedApple = ref(false)
const pressed = ref(false)

onMounted(() => {
  detectedApple.value = isApple()
})

const apple = computed(() => (platform === 'auto' ? detectedApple.value : platform === 'apple'))

const SIZE_CLASS: Record<MazSize, string> = {
  mini: 'maz:text-[0.625rem]',
  xs: 'maz:text-xs',
  sm: 'maz:text-xs',
  md: 'maz:text-sm',
  lg: 'maz:text-base',
  xl: 'maz:text-lg',
}

const NAMED: Record<string, { apple: string, other: string, name?: TranslationKey }> = {
  mod: { apple: '⌘', other: 'Ctrl', name: 'kbd.command' },
  cmd: { apple: '⌘', other: 'Win', name: 'kbd.command' },
  command: { apple: '⌘', other: 'Win', name: 'kbd.command' },
  meta: { apple: '⌘', other: 'Win', name: 'kbd.command' },
  win: { apple: '⌘', other: 'Win', name: 'kbd.command' },
  ctrl: { apple: '⌃', other: 'Ctrl', name: 'kbd.control' },
  control: { apple: '⌃', other: 'Ctrl', name: 'kbd.control' },
  alt: { apple: '⌥', other: 'Alt', name: 'kbd.option' },
  option: { apple: '⌥', other: 'Alt', name: 'kbd.option' },
  opt: { apple: '⌥', other: 'Alt', name: 'kbd.option' },
  shift: { apple: '⇧', other: 'Shift', name: 'kbd.shift' },
  enter: { apple: '↵', other: 'Enter' },
  return: { apple: '↵', other: 'Enter' },
  esc: { apple: 'Esc', other: 'Esc' },
  escape: { apple: 'Esc', other: 'Esc' },
  space: { apple: 'Space', other: 'Space' },
  tab: { apple: '⇥', other: 'Tab' },
  backspace: { apple: '⌫', other: 'Backspace' },
  delete: { apple: '⌦', other: 'Del' },
  del: { apple: '⌦', other: 'Del' },
  up: { apple: '↑', other: '↑' },
  down: { apple: '↓', other: '↓' },
  left: { apple: '←', other: '←' },
  right: { apple: '→', other: '→' },
  arrowup: { apple: '↑', other: '↑' },
  arrowdown: { apple: '↓', other: '↓' },
  arrowleft: { apple: '←', other: '←' },
  arrowright: { apple: '→', other: '→' },
}

function isSymbol(text: string) {
  return text.length === 1 && (text.codePointAt(0) ?? 0) > 127
}

const rawKeys = computed(() => {
  if (Array.isArray(keys))
    return keys.map(key => key.trim()).filter(Boolean)
  if (!keys)
    return []

  return keys.length > 1 && keys.endsWith('++')
    ? [...keys.slice(0, -2).split('+').map(key => key.trim()).filter(Boolean), '+']
    : keys.split('+').map(key => key.trim()).filter(Boolean)
})

const items = computed(() => rawKeys.value.map((key) => {
  const named = NAMED[key.toLowerCase()]

  return {
    key,
    text: named ? named[apple.value ? 'apple' : 'other'] : (key.length === 1 ? key.toUpperCase() : key),
    symbol: isSymbol(named ? named[apple.value ? 'apple' : 'other'] : key),
    name: named?.name ? t(named.name) : undefined,
  }
}))

const shortcut = computed(() => rawKeys.value.join('+'))

useEventListener(() => (live && rawKeys.value.length ? globalThis : undefined) as Window | undefined, 'keydown', (event: KeyboardEvent) => {
  if (event.repeat || !matchesShortcut(event, shortcut.value, { apple: apple.value }))
    return

  pressed.value = true
  emit('press', event)
})

useEventListener(() => (live ? globalThis : undefined) as Window | undefined, 'keyup', () => {
  pressed.value = false
})

useEventListener(() => (live ? globalThis : undefined) as Window | undefined, 'blur', () => {
  pressed.value = false
})
</script>

<template>
  <span dir="ltr" class="m-kbd m-reset-css maz:inline-flex maz:items-center maz:gap-1 maz:align-middle" :class="[SIZE_CLASS[size], { '--pressed': pressed }]">
    <template v-if="items.length">
      <template v-for="(item, index) in items" :key="`${item.key}-${index}`">
        <span v-if="index > 0 && !apple" class="m-kbd__separator maz:text-muted" aria-hidden="true">+</span>
        <kbd class="m-kbd__key" :class="{ 'm-kbd__key--symbol': item.symbol }" :aria-label="item.name">{{ item.text }}</kbd>
      </template>
    </template>
    <kbd v-else class="m-kbd__key"><slot /></kbd>
  </span>
</template>

<style scoped>
.m-kbd__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-inline-size: 1.75em;
  block-size: 1.75em;
  padding-inline: 0.5em;
  border: 1px solid color-mix(in oklab, var(--maz-foreground) 18%, transparent);
  border-block-end-width: 2px;
  border-radius: 0.4em;
  background-color: color-mix(in oklab, var(--maz-foreground) 5%, var(--maz-container, transparent));
  box-shadow: 0 1px 0 color-mix(in oklab, var(--maz-foreground) 10%, transparent);
  color: var(--maz-foreground);
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  transition:
    transform calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    box-shadow calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-kbd__key--symbol {
  font-size: 1.3em;
}

.m-kbd.--pressed .m-kbd__key {
  transform: translateY(1px);
  border-block-end-width: 1px;
  box-shadow: none;
  background-color: color-mix(in oklab, var(--maz-primary) 28%, var(--maz-container, transparent));
}

@media (prefers-reduced-motion: reduce) {
  .m-kbd__key {
    transition: none;
  }
}
</style>
