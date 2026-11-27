import { ref } from 'vue'
import { useWindow } from './useWindow.ts'

export interface UseWindowSizeOptions {
  /**
   * The window object to use
   * @default window - in browser, undefined in SSR
   */
  internalWindow?: Window
  /**
   * Initial width of the window (useful in SSR)
   * @default Number.POSITIVE_INFINITY
   */
  initialWidth?: number
  /**
   * Initial height of the window (useful in SSR)
   * @default Number.POSITIVE_INFINITY
   */
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
}

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const {
    internalWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    includeScrollbar = true,
  } = options

  const { window, on } = useWindow({ internalWindow })

  const width = ref(initialWidth)
  const height = ref(initialHeight)

  function update() {
    if (window) {
      if (includeScrollbar) {
        width.value = window.innerWidth
        height.value = window.innerHeight
      }
      else {
        width.value = window.document.documentElement.clientWidth
        height.value = window.document.documentElement.clientHeight
      }
    }
  }

  update()

  on('resize', update, { passive: true })

  return { width, height }
}
