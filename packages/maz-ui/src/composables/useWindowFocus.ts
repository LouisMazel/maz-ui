import type { UseWindowOptions } from './useWindow.ts'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useWindow } from './useWindow.ts'

export interface UseWindowFocusOptions extends UseWindowOptions {
  /**
   * Value on the server and, inside a component, until it is mounted (same markup as the server on hydration)
   * @default false
   */
  initialValue?: boolean
}

/**
 * Reactive focus of the window (`isFocused`), updated on `focus` and `blur`.
 *
 * @example
 * const { isFocused } = useWindowFocus()
 */
export function useWindowFocus(options: UseWindowFocusOptions = {}) {
  const { initialValue = false, ...windowOptions } = options
  const { window, on } = useWindow(windowOptions)

  const inComponent = getCurrentInstance() !== null
  const isFocused = ref(window && !inComponent ? window.document.hasFocus() : initialValue)

  if (window && inComponent) {
    onMounted(() => {
      isFocused.value = window.document.hasFocus()
    })
  }

  on('focus', () => {
    isFocused.value = true
  })
  on('blur', () => {
    isFocused.value = false
  })

  return { isFocused }
}
