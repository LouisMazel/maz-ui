import { reactive } from 'vue'

export interface ToastStackEntry {
  id: number
  height: number
  stacked: boolean
}

export interface ToastStackState {
  entries: ToastStackEntry[]
  hovered: boolean
  focused: boolean
  pinned: boolean
}

export interface ToastStackLayoutOptions {
  /**
   * Direction of the stack, from the edge of the screen to its center (`1` for the top positions, `-1` for the bottom ones)
   */
  inward: 1 | -1
  /**
   * Spread the toasts in a list
   */
  expanded: boolean
  /**
   * Visible part of a toast behind another one, in px
   * @default 14
   */
  peek?: number
  /**
   * Scale lost by each level of depth
   * @default 0.05
   */
  scaleStep?: number
  /**
   * Number of toasts visible in the collapsed stack
   * @default 3
   */
  maxVisible?: number
}

export interface ToastStackItemLayout {
  y: number
  scale: number
  opacity: number
  zIndex: number
  behind: boolean
  hidden: boolean
  clip: number
}

export const STACK_PEEK = 14
export const STACK_SCALE_STEP = 0.05
export const STACK_MAX_VISIBLE = 3
export const SWIPE_MAX_DISTANCE = 100
export const SWIPE_DISTANCE_RATIO = 0.4
export const SWIPE_VELOCITY = 0.11
export const SWIPE_MIN_FLICK_DISTANCE = 10

export function getStackLayout(heights: number[], options: ToastStackLayoutOptions): ToastStackItemLayout[] {
  const {
    inward,
    expanded,
    peek = STACK_PEEK,
    scaleStep = STACK_SCALE_STEP,
    maxVisible = STACK_MAX_VISIBLE,
  } = options

  const count = heights.length
  const frontHeight = heights[0] ?? 0
  let offset = 0

  return heights.map((height, index) => {
    const zIndex = count - index

    if (expanded) {
      const item: ToastStackItemLayout = {
        y: inward * offset + 0,
        scale: 1,
        opacity: 1,
        zIndex,
        behind: false,
        hidden: false,
        clip: -16,
      }
      offset += height
      return item
    }

    const scale = Math.max(1 - index * scaleStep, 0)
    const hidden = index >= maxVisible

    return {
      y: inward * (frontHeight * (1 - scale) + peek * index) + 0,
      scale,
      opacity: hidden ? 0 : 1,
      zIndex,
      behind: index > 0,
      hidden,
      clip: index > 0 && height > frontHeight ? height - frontHeight : -16,
    }
  })
}

export function shouldDismissSwipe({ distance, velocity, size }: { distance: number, velocity: number, size: number }) {
  if (distance <= 0) {
    return false
  }

  const threshold = Math.min(size * SWIPE_DISTANCE_RATIO, SWIPE_MAX_DISTANCE)

  return distance >= threshold || (velocity >= SWIPE_VELOCITY && distance >= SWIPE_MIN_FLICK_DISTANCE)
}

export function getSwipeVelocity(distance: number, elapsed: number) {
  return elapsed > 0 ? Math.abs(distance) / elapsed : 0
}

export function dampSwipe(offset: number, direction: 1 | -1) {
  return offset * direction >= 0 ? offset : offset * 0.2
}

const stacks = reactive<Record<string, ToastStackState>>({})

let nextId = 0

export function createToastId() {
  nextId += 1
  return nextId
}

export function getToastStack(key: string): ToastStackState | undefined {
  return stacks[key]
}

export function registerToast(key: string, entry: ToastStackEntry) {
  const stack = stacks[key] ??= { entries: [], hovered: false, focused: false, pinned: false }
  stack.entries = [entry, ...stack.entries.filter(item => item.id !== entry.id)]
}

export function unregisterToast(key: string, id: number) {
  const stack = stacks[key]

  if (!stack) {
    return
  }

  stack.entries = stack.entries.filter(item => item.id !== id)

  if (stack.entries.length === 0) {
    delete stacks[key]
  }
}

export function setToastHeight(key: string, id: number, height: number) {
  const entry = stacks[key]?.entries.find(item => item.id === id)

  if (entry && entry.height !== height) {
    entry.height = height
  }
}

export function setToastStackFlag(key: string, flag: 'hovered' | 'focused' | 'pinned', value: boolean) {
  const stack = stacks[key]

  if (stack && stack[flag] !== value) {
    stack[flag] = value
  }
}

export function isToastStackExpanded(stack: ToastStackState | undefined) {
  if (!stack) {
    return true
  }

  return stack.hovered || stack.focused || stack.pinned || stack.entries.some(entry => !entry.stacked)
}

export function getToastStackLayout(key: string, id: number, inward: 1 | -1): ToastStackItemLayout | undefined {
  const stack = stacks[key]

  if (!stack) {
    return undefined
  }

  const index = stack.entries.findIndex(entry => entry.id === id)

  if (index === -1) {
    return undefined
  }

  return getStackLayout(stack.entries.map(entry => entry.height), {
    inward,
    expanded: isToastStackExpanded(stack),
  })[index]
}
