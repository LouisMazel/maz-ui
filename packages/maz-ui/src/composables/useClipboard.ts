import { isClient } from '@maz-ui/utils/helpers/isClient'
import { getCurrentScope, onScopeDispose, readonly, ref } from 'vue'

export interface UseClipboardOptions {
  /**
   * Time in milliseconds during which `copied` stays `true` after a copy
   * @default 1500
   */
  copiedDuring?: number
}

/**
 * Copy a text to the clipboard, with a `copied` state that goes back to `false` after a delay.
 */
export function useClipboard({ copiedDuring = 1500 }: UseClipboardOptions = {}) {
  const copied = ref(false)
  const error = ref<unknown>()
  const isSupported = isClient() && !!navigator.clipboard?.writeText

  let resetTimer: ReturnType<typeof setTimeout> | undefined

  function reset() {
    clearTimeout(resetTimer)
    copied.value = false
  }

  /** Copies the text, `true` when it is in the clipboard */
  async function copy(text: string): Promise<boolean> {
    error.value = undefined

    if (!isSupported) {
      error.value = new Error('The Clipboard API is not available (it needs a secure context: https or localhost)')
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => {
        copied.value = false
      }, copiedDuring)

      return true
    }
    catch (caught) {
      error.value = caught
      reset()

      return false
    }
  }

  if (getCurrentScope()) {
    onScopeDispose(() => clearTimeout(resetTimer))
  }

  return {
    copy,
    copied: readonly(copied),
    error: readonly(error),
    isSupported,
    reset,
  }
}
