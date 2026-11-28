<script lang="ts" setup>
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'

export interface MazSplitterPanel {
  /** Unique id of the panel. It names the slot that renders the panel */
  id: string
  /** Initial size in percent. Panels without a size share the remaining space equally */
  size?: number
  /**
   * Smallest size in percent
   * @default 10
   */
  min?: number
  /**
   * Largest size in percent
   * @default 100
   */
  max?: number
  /**
   * Allow to collapse the panel with `Enter` on its handle, or by dragging it under its `min`
   * @default false
   */
  collapsible?: boolean
}

export interface MazSplitterProps {
  /** The panels, in order. One handle is added between two panels. Each panel renders in the slot named after its `id` */
  panels: MazSplitterPanel[]
  /**
   * Direction of the panels: `horizontal` puts them side by side, `vertical` stacks them
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Key of the `localStorage` entry that remembers the sizes. The saved sizes are read after the mount
   */
  storageKey?: string
  /**
   * Share of the size moved by one arrow key press, in percent (`Shift` moves ten times more)
   * @default 2
   */
  step?: number
  /**
   * Accessible name of the handles. Defaults to the translation of "Resize"
   */
  label?: string
}

const {
  panels,
  orientation = 'horizontal',
  storageKey = undefined,
  step = 2,
  label = undefined,
} = defineProps<MazSplitterProps>()

const emits = defineEmits<{
  /** Emitted when a handle is released after a drag */
  (name: 'resize-end', sizes: number[]): void
}>()

/**
 * Sizes of the panels in percent, in the order of `panels`
 */
const model = defineModel<number[]>('sizes')

const { t } = useTranslations()

const uid = useInstanceUniqId({ componentName: 'MazSplitter' })

const root = useTemplateRef<HTMLElement>('root')

const HANDLE_SIZE = 8

function computeInitial() {
  const known = panels.reduce((sum, panel) => sum + (panel.size ?? 0), 0)
  const unknown = panels.filter(panel => panel.size === undefined).length
  const share = unknown > 0 ? Math.max(0, 100 - known) / unknown : 0
  const sizes = panels.map(panel => panel.size ?? share)
  const total = sizes.reduce((sum, size) => sum + size, 0) || 1

  return sizes.map(size => (size / total) * 100)
}

function isValid(sizes: unknown): sizes is number[] {
  return Array.isArray(sizes)
    && sizes.length === panels.length
    && sizes.every(size => typeof size === 'number' && Number.isFinite(size) && size >= 0)
    && Math.abs(sizes.reduce((sum, size) => sum + size, 0) - 100) < 0.5
}

const sizes = ref<number[]>(isValid(model.value) ? [...model.value] : computeInitial())
const collapsed = ref<Record<string, number>>({})
const draggingIndex = ref<number>()
const isHydrated = ref(false)

const isVertical = computed(() => orientation === 'vertical')

function bounds(index: number) {
  const panel = panels[index]!
  return { min: panel.min ?? 10, max: panel.max ?? 100 }
}

function setSizes(next: number[], { silent = false } = {}) {
  sizes.value = next.map(size => Math.round(size * 100) / 100)
  model.value = [...sizes.value]

  if (!silent && storageKey && isHydrated.value) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sizes.value))
    }
    catch {
      // storage unavailable
    }
  }
}

watch(model, (value) => {
  if (isValid(value) && value.some((size, index) => Math.abs(size - sizes.value[index]!) > 0.01))
    sizes.value = [...value]
})

watch(() => panels.length, () => {
  setSizes(computeInitial(), { silent: true })
  collapsed.value = {}
})

onMounted(() => {
  if (storageKey) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      if (isValid(saved))
        setSizes(saved, { silent: true })
    }
    catch {
      // storage unavailable or corrupted
    }
  }

  isHydrated.value = true
})

function move(index: number, delta: number, startSizes: number[]) {
  const before = bounds(index)
  const after = bounds(index + 1)
  const total = startSizes[index]! + startSizes[index + 1]!
  const panel = panels[index]!
  const neighbor = panels[index + 1]!

  let first = startSizes[index]! + delta
  const collapseFirst = panel.collapsible && first < before.min / 2
  const collapseSecond = neighbor.collapsible && total - first < after.min / 2

  if (collapseFirst) {
    first = 0
  }
  else if (collapseSecond) {
    first = total
  }
  else {
    const lower = Math.max(before.min, total - after.max)
    const upper = Math.min(before.max, total - after.min)
    first = Math.min(upper, Math.max(lower, first))
  }

  const next = [...startSizes]
  next[index] = first
  next[index + 1] = total - first
  setSizes(next)
}

function onPointerDown(event: PointerEvent, index: number) {
  if (event.button !== 0 || !root.value)
    return

  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture?.(event.pointerId)
  target.focus({ preventScroll: true })

  const rect = root.value.getBoundingClientRect()
  const length = (isVertical.value ? rect.height : rect.width) - HANDLE_SIZE * (panels.length - 1)
  const rtl = getComputedStyle(root.value).direction === 'rtl' && !isVertical.value
  const origin = isVertical.value ? event.clientY : event.clientX
  const startSizes = [...sizes.value]

  if (length <= 0)
    return

  draggingIndex.value = index

  function onMove(moveEvent: PointerEvent) {
    const current = isVertical.value ? moveEvent.clientY : moveEvent.clientX
    const pixels = (current - origin) * (rtl ? -1 : 1)
    move(index, (pixels / length) * 100, startSizes)
  }

  function onEnd() {
    target.removeEventListener('pointermove', onMove)
    target.removeEventListener('pointerup', onEnd)
    target.removeEventListener('pointercancel', onEnd)
    draggingIndex.value = undefined
    emits('resize-end', [...sizes.value])
  }

  target.addEventListener('pointermove', onMove)
  target.addEventListener('pointerup', onEnd)
  target.addEventListener('pointercancel', onEnd)
}

function toggleCollapse(index: number) {
  const first = panels[index]!
  const second = panels[index + 1]!
  const target = first.collapsible ? index : (second.collapsible ? index + 1 : undefined)
  if (target === undefined)
    return

  const panel = panels[target]!
  const neighborIndex = target === index ? index + 1 : index
  const next = [...sizes.value]

  if (collapsed.value[panel.id] === undefined && next[target]! > 0) {
    collapsed.value = { ...collapsed.value, [panel.id]: next[target]! }
    next[neighborIndex]! += next[target]!
    next[target] = 0
  }
  else {
    const restored = collapsed.value[panel.id] ?? bounds(target).min
    const amount = Math.min(restored, next[neighborIndex]!)
    const rest = { ...collapsed.value }
    delete rest[panel.id]
    collapsed.value = rest
    next[target] = amount
    next[neighborIndex]! -= amount
  }

  setSizes(next)
  emits('resize-end', [...sizes.value])
}

function reset() {
  collapsed.value = {}
  setSizes(computeInitial())
  emits('resize-end', [...sizes.value])
}

function onKeydown(event: KeyboardEvent, index: number) {
  const rtl = !isVertical.value && root.value && getComputedStyle(root.value).direction === 'rtl'
  const forward = isVertical.value ? 'ArrowDown' : (rtl ? 'ArrowLeft' : 'ArrowRight')
  const backward = isVertical.value ? 'ArrowUp' : (rtl ? 'ArrowRight' : 'ArrowLeft')
  const amount = event.shiftKey ? step * 10 : step
  const start = [...sizes.value]
  const before = bounds(index)
  const after = bounds(index + 1)
  const total = start[index]! + start[index + 1]!

  switch (event.key) {
    case forward: {
      move(index, amount, start)
      break
    }
    case backward: {
      move(index, -amount, start)
      break
    }
    case 'Home': {
      move(index, Math.max(before.min, total - after.max) - start[index]!, start)
      break
    }
    case 'End': {
      move(index, Math.min(before.max, total - after.min) - start[index]!, start)
      break
    }
    case 'Enter': {
      toggleCollapse(index)
      break
    }
    default: {
      return
    }
  }

  event.preventDefault()
}

function panelId(panel: MazSplitterPanel) {
  return `${uid.value}-${panel.id}`
}

function getPanelStyle(index: number) {
  return { flex: `${sizes.value[index]} 1 0%` }
}
</script>

<template>
  <div
    ref="root"
    class="m-splitter m-reset-css maz:flex maz:size-full maz:min-h-0 maz:min-w-0"
    :class="[isVertical ? 'maz:flex-col m-splitter--vertical' : 'maz:flex-row m-splitter--horizontal', { 'm-splitter--dragging': draggingIndex !== undefined }]"
  >
    <template v-for="(panel, index) in panels" :key="panel.id">
      <div
        :id="panelId(panel)"
        class="m-splitter__panel maz:min-h-0 maz:min-w-0 maz:overflow-auto"
        :class="{ 'm-splitter__panel--collapsed': sizes[index] === 0 }"
        :style="getPanelStyle(index)"
        :inert="sizes[index] === 0 ? true : undefined"
      >
        <!--
          @slot [panel.id] - The content of each panel, in the slot named after the `id` of the panel
        -->
        <slot :name="`${panel.id}`" :size="sizes[index]" />
      </div>

      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
      <div
        v-if="index < panels.length - 1"
        class="m-splitter__handle"
        :class="{ 'm-splitter__handle--active': draggingIndex === index }"
        role="separator"
        tabindex="0"
        :aria-label="label ?? t('aria.resize')"
        :aria-orientation="isVertical ? 'horizontal' : 'vertical'"
        :aria-controls="panelId(panel)"
        :aria-valuenow="Math.round(sizes[index]!)"
        :aria-valuemin="Math.round(bounds(index).min)"
        :aria-valuemax="Math.round(bounds(index).max)"
        @pointerdown="onPointerDown($event, index)"
        @keydown="onKeydown($event, index)"
        @dblclick="reset"
      >
        <span class="m-splitter__grip" aria-hidden="true" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.m-splitter__handle {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  background-color: var(--maz-divider, currentcolor);
  touch-action: none;
  transition: background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}

.m-splitter--horizontal > .m-splitter__handle {
  inline-size: 8px;
  cursor: col-resize;
}

.m-splitter--vertical > .m-splitter__handle {
  block-size: 8px;
  cursor: row-resize;
}

.m-splitter__handle:focus-visible {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: -2px;
}

.m-splitter__handle:hover,
.m-splitter__handle--active {
  background-color: color-mix(in oklab, var(--maz-primary) 35%, var(--maz-divider, transparent));
}

.m-splitter__grip {
  border-radius: 9999px;
  background-color: var(--maz-foreground, currentcolor);
  opacity: 0.6;
}

.m-splitter--horizontal .m-splitter__grip {
  inline-size: 3px;
  block-size: 2rem;
}

.m-splitter--vertical .m-splitter__grip {
  inline-size: 2rem;
  block-size: 3px;
}

.m-splitter--dragging {
  user-select: none;
}

.m-splitter--dragging .m-splitter__panel {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .m-splitter__handle {
    transition: none;
  }
}
</style>
