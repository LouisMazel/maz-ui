<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useInstanceUniqId } from '../../composables/useInstanceUniqId.ts'
import { useReducedMotion } from '../../composables/useReducedMotion.ts'

export interface MazTimePickerWheelItem {
  key: string | number
  label: string
  disabled?: boolean
}

const { items, modelValue, label, disabled = false } = defineProps<{
  items: MazTimePickerWheelItem[]
  modelValue?: string | number
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:model-value': [value: string | number]
  'commit': []
}>()

const PAGE = 5
const SETTLE_DELAY = 140
const FALLBACK_ITEM_HEIGHT = 36

const list = useTemplateRef<HTMLElement>('list')
const { shouldReduceMotion } = useReducedMotion()
const instanceId = useInstanceUniqId({ componentName: 'MazTimePickerWheel' })

const selectedIndex = computed(() => items.findIndex(item => item.key === modelValue))
const centeredIndex = ref(Math.max(0, selectedIndex.value))
let timer: ReturnType<typeof setTimeout> | undefined
let programmatic = false

function itemHeight() {
  const item = list.value?.querySelector<HTMLElement>('[role="option"]')

  return (item && Number.parseFloat(getComputedStyle(item).height)) || FALLBACK_ITEM_HEIGHT
}

function optionId(index: number) {
  return `${instanceId.value}-option-${index}`
}

function scrollToIndex(index: number, smooth: boolean) {
  const element = list.value
  if (!element)
    return

  const top = index * itemHeight()
  if (Math.abs(element.scrollTop - top) < 1)
    return

  programmatic = smooth
  element.scrollTo({ top, behavior: smooth && !shouldReduceMotion.value ? 'smooth' : 'instant' })
  if (!smooth || shouldReduceMotion.value)
    programmatic = false
}

function readIndex() {
  const element = list.value

  return element
    ? Math.min(items.length - 1, Math.max(0, Math.round(element.scrollTop / itemHeight())))
    : 0
}

function settle() {
  clearTimeout(timer)
  const index = readIndex()
  centeredIndex.value = index

  if (programmatic) {
    programmatic = false
    return
  }

  const item = items[index]
  if (!item || item.disabled) {
    scrollToIndex(Math.max(0, selectedIndex.value), true)
    return
  }

  if (item.key !== modelValue)
    emit('update:model-value', item.key)
}

function onScroll() {
  centeredIndex.value = readIndex()
  clearTimeout(timer)
  timer = setTimeout(settle, SETTLE_DELAY)
}

function findEnabled(from: number, step: 1 | -1) {
  for (let index = from; index >= 0 && index < items.length; index += step) {
    if (!items[index]?.disabled)
      return index
  }

  return -1
}

function pick(index: number) {
  const item = items[index]
  if (!item || item.disabled || disabled)
    return

  centeredIndex.value = index
  if (item.key !== modelValue)
    emit('update:model-value', item.key)
  scrollToIndex(index, true)
}

function move(delta: number) {
  const base = selectedIndex.value >= 0 ? selectedIndex.value : centeredIndex.value
  const step = delta > 0 ? 1 : -1
  const target = Math.min(items.length - 1, Math.max(0, base + delta))
  let index = findEnabled(target, step)

  if (index === -1)
    index = findEnabled(target, step === 1 ? -1 : 1)
  if (index !== -1)
    pick(index)
}

function onKeydown(event: KeyboardEvent) {
  if (disabled)
    return

  const actions: Record<string, () => void> = {
    ArrowDown: () => move(1),
    ArrowUp: () => move(-1),
    PageDown: () => move(PAGE),
    PageUp: () => move(-PAGE),
    Home: () => pick(Math.max(0, findEnabled(0, 1))),
    End: () => pick(Math.max(0, findEnabled(items.length - 1, -1))),
    Enter: () => emit('commit'),
  }

  const action = actions[event.key]
  if (action) {
    event.preventDefault()
    action()
  }
}

onMounted(() => {
  scrollToIndex(Math.max(0, selectedIndex.value), false)
  centeredIndex.value = Math.max(0, selectedIndex.value)
})

onBeforeUnmount(() => clearTimeout(timer))

watch(() => [modelValue, items.length], async () => {
  await nextTick()
  if (selectedIndex.value >= 0)
    scrollToIndex(selectedIndex.value, true)
})
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/interactive-supports-focus, vuejs-accessibility/click-events-have-key-events -->
  <div class="m-time-wheel">
    <div
      ref="list"
      class="m-time-wheel__list"
      role="listbox"
      :tabindex="disabled ? -1 : 0"
      :aria-label="label"
      :aria-disabled="disabled || undefined"
      :aria-activedescendant="selectedIndex >= 0 ? optionId(selectedIndex) : undefined"
      @scroll.passive="onScroll"
      @scrollend="settle"
      @keydown="onKeydown"
    >
      <div
        v-for="(item, index) in items"
        :id="optionId(index)"
        :key="item.key"
        role="option"
        class="m-time-wheel__item"
        :class="{ '--centered': index === centeredIndex, '--disabled': item.disabled }"
        :aria-selected="index === selectedIndex"
        :aria-disabled="item.disabled || undefined"
        @click="pick(index)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
  <!-- eslint-enable vuejs-accessibility/interactive-supports-focus, vuejs-accessibility/click-events-have-key-events -->
</template>

<style scoped>
.m-time-wheel {
  --m-time-wheel-item: 2.25rem;

  position: relative;
  border-radius: 0.5rem;
  outline: var(--maz-focus-ring-width, 2px) solid transparent;
}

.m-time-wheel:has(.m-time-wheel__list:focus-visible) {
  outline-color: var(--maz-focus-ring-color, var(--maz-primary));
}

.m-time-wheel__list {
  box-sizing: border-box;
  overflow-y: auto;
  block-size: calc(var(--m-time-wheel-item) * 5);
  min-inline-size: 3.5rem;
  padding-block: calc(var(--m-time-wheel-item) * 2);
  border-radius: 0.5rem;
  outline: none;
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  overscroll-behavior: contain;
  mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent);
}

.m-time-wheel__list::-webkit-scrollbar {
  display: none;
}

.m-time-wheel__item {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: var(--m-time-wheel-item);
  color: var(--maz-muted, color-mix(in oklab, var(--maz-foreground) 55%, transparent));
  font-variant-numeric: tabular-nums;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  cursor: pointer;
  user-select: none;
  transition:
    color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-time-wheel__item.--centered {
  color: var(--maz-foreground);
  font-weight: 600;
  transform: scale(1.12);
}

.m-time-wheel__item.--disabled {
  opacity: 0.35;
  cursor: default;
}

@media (prefers-reduced-motion: reduce) {
  .m-time-wheel__item {
    transition: none;
  }

  .m-time-wheel__item.--centered {
    transform: none;
  }
}
</style>
