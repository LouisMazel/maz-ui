import type { MaybeRefOrGetter } from 'vue'
import type { UseEventListenerTarget } from './useEventListener.ts'
import { formatShortcut, matchesShortcut, parseShortcut } from '@maz-ui/utils/helpers/shortcut'
import { computed, toValue } from 'vue'
import { useEventListener } from './useEventListener.ts'

export interface UseShortcutOptions {
  /**
   * Where the keyboard is listened
   * @default window
   */
  target?: UseEventListenerTarget<Window | Document | HTMLElement>
  /**
   * @default 'keydown'
   */
  event?: 'keydown' | 'keyup'
  /**
   * Call `event.preventDefault()` when the shortcut matches (the browser shortcut is not triggered)
   * @default true
   */
  preventDefault?: boolean
  /**
   * Trigger while the focus is in an input, a textarea, a select or an editable element.
   * @default true when the shortcut has a ctrl, cmd or mod modifier, false for the others (a plain key, shift + key or alt + key: Option types characters on macOS)
   */
  allowInInputs?: boolean
  /**
   * Trigger again while the keys stay pressed
   * @default false
   */
  allowRepeat?: boolean
  /**
   * Disable the shortcut without removing it
   * @default true
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Force the platform, by default the one of the browser
   */
  apple?: boolean
}

function isEditable(element: EventTarget | null) {
  const target = element as HTMLElement | null

  return !!target && (
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    || target.isContentEditable
  )
}

/**
 * Platform aware keyboard shortcut: `mod` is Cmd on macOS and Ctrl elsewhere.
 * The listener is removed when the scope is disposed.
 *
 * @returns `label` (`⌘K` or `Ctrl+K`, to display next to the action) and `stop`
 *
 * @example
 * const { label } = useShortcut('mod+k', () => openPalette())
 */
export function useShortcut(
  shortcut: MaybeRefOrGetter<string>,
  handler: (event: KeyboardEvent) => void,
  options: UseShortcutOptions = {},
) {
  const {
    target = typeof window === 'undefined' ? undefined : globalThis,
    event = 'keydown',
    preventDefault = true,
    allowRepeat = false,
    enabled = true,
    apple,
  } = options

  const parsed = computed(() => parseShortcut(toValue(shortcut)))
  const label = computed(() => formatShortcut(parsed.value, { apple }))

  const stop = useEventListener(target as UseEventListenerTarget<Window>, event, (keyboardEvent: KeyboardEvent) => {
    const current = parsed.value
    const allowInInputs = options.allowInInputs ?? (current.mod || current.ctrl || current.meta)

    if (
      !toValue(enabled)
      || (!allowRepeat && keyboardEvent.repeat)
      || (!allowInInputs && isEditable(keyboardEvent.target))
      || !matchesShortcut(keyboardEvent, current, { apple })
    ) {
      return
    }

    if (preventDefault)
      keyboardEvent.preventDefault()

    handler(keyboardEvent)
  })

  return { label, stop }
}
