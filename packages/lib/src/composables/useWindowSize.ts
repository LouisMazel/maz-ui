import { onMounted, onUnmounted, ref } from 'vue'
import { isClient } from '../utils/isClient'

export interface UseWindowSizeOptions {
  /**
   * The window object to use
   * @default window - in browser, undefined in SSR
   */
  internalWindow?: Window | undefined
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
    internalWindow = isClient() ? window : undefined,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    includeScrollbar = true,
  } = options

  const width = ref(initialWidth)
  const height = ref(initialHeight)

  function update() {
    if (internalWindow) {
      if (includeScrollbar) {
        width.value = internalWindow.innerWidth
        height.value = internalWindow.innerHeight
      }
      else {
        width.value = internalWindow.document.documentElement.clientWidth
        height.value = internalWindow.document.documentElement.clientHeight
      }
    }
  }

  update()

  onMounted(() => {
    if (internalWindow) {
      window.addEventListener('resize', update, { passive: true })
    }
  })

  onUnmounted(() => {
    if (internalWindow) {
      window.removeEventListener('resize', update)
    }
  })

  return { width, height }
}
