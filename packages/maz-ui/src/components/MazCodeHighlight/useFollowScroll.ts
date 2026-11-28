import { ref, shallowRef } from 'vue'

/**
 * Scroll of a block that can grow at its end (code, logs): keeps its scroll after a render, follows the bottom while the
 * user did not scroll up, and tells when the last line is out of view (to show a "scroll to bottom" button).
 * `findElement` reads the scrollable element of the last render, `follow` tells if the bottom is followed.
 */
export function useFollowScroll(findElement: () => HTMLElement | undefined, follow: () => boolean) {
  const scroll = { top: 0, left: 0, atBottom: true }
  /** The last line of the block is out of view: the scroll-to-bottom button shows. */
  const awayFromBottom = ref(false)
  /** The scrollable element of the last render: the target of the scroll-to-bottom button */
  const element = shallowRef<HTMLElement>()

  function isAtBottom(target: HTMLElement) {
    return target.scrollHeight - target.scrollTop - target.clientHeight <= 4
  }

  function updateAwayFromBottom(target: HTMLElement) {
    awayFromBottom.value = target.scrollHeight - target.clientHeight > 4 && !isAtBottom(target)
  }

  function onScroll(event: Event) {
    const target = event.target as HTMLElement
    if (target !== findElement())
      return
    scroll.top = target.scrollTop
    scroll.left = target.scrollLeft
    scroll.atBottom = isAtBottom(target)
    updateAwayFromBottom(target)
  }

  /** Scrolls the block to its last line and follows the next ones again (with `follow`). */
  function scrollToBottom() {
    const target = findElement()
    if (!target)
      return
    target.scrollTop = target.scrollHeight
    scroll.top = target.scrollTop
    scroll.atBottom = true
    awayFromBottom.value = false
  }

  /** Reads the element of the last render, restores its scroll (or follows the bottom) and shows the button when needed */
  function sync(restore: boolean) {
    const target = findElement()
    element.value = target
    if (!target)
      return
    if (follow() && scroll.atBottom) {
      scrollToBottom()
      return
    }
    if (restore) {
      target.scrollTop = scroll.top
      target.scrollLeft = scroll.left
    }
    updateAwayFromBottom(target)
  }

  return { awayFromBottom, element, onScroll, scrollToBottom, sync }
}
