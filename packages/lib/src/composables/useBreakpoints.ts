import type { UseWindowSizeOptions } from './useWindowSize'
import { computed } from 'vue'
import { getNumericScreensFromTailwind } from '../tailwindcss/variables/breakpoints'
import { useWindowSize } from './useWindowSize'

export interface UseBreakpointsOptions extends UseWindowSizeOptions {
  initialWidth?: number
  initialHeight?: number
  /**
   * Listen to window `orientationchange` event
   *
   * @default true
   */
  listenOrientation?: boolean

  /**
   * Whether the scrollbar should be included in the width and height
   * @default true
   */
  includeScrollbar?: boolean
  /**
   * List of breakpoints in format `{ [key: string]: string }`  (e.g. `{ 'sm': '640px', 'md': '768px' }`)
   */
  breakpoints: Record<string, string> | Record<string, number>
  /**
   * Is the breakpoint when the screen is considered not medium (tablet - e.g. `md`)
   * @default 'md'
   */
  mediumBreakPoint?: string
  /**
   * Is the breakpoint when the screen is considered not medium (laptop - e.g. `lg`)
   * @default 'lg'
   */
  largeBreakPoint?: string
}

export function useBreakpoints({
  initialWidth = 0,
  initialHeight,
  includeScrollbar,
  internalWindow,
  listenOrientation,
  breakpoints,
  mediumBreakPoint = 'md',
  largeBreakPoint = 'lg',
}: UseBreakpointsOptions) {
  const { width } = useWindowSize({
    initialWidth, // (SSR) mobile first
    initialHeight,
    includeScrollbar,
    internalWindow,
    listenOrientation,
  })

  const numericBreakpoints = getNumericScreensFromTailwind(breakpoints)

  const isLargeScreen = computed(() => width.value >= numericBreakpoints[largeBreakPoint])
  const isMediumScreen = computed(
    () =>
      width.value >= numericBreakpoints[mediumBreakPoint]
      && width.value < numericBreakpoints[largeBreakPoint],
  )
  const isSmallScreen = computed(() => {
    return width.value >= 0 && width.value < numericBreakpoints[mediumBreakPoint]
  })

  return {
    width,
    numericBreakpoints,
    isSmallScreen,
    isLargeScreen,
    isMediumScreen,
    breakpoints,
  }
}
