const ANIMATION_NAME = 'maz-autofill-start'
const STYLE_ELEMENT_ID = 'maz-autofill-sync'

function ensureStylesInjected() {
  if (typeof document === 'undefined')
    return
  if (document.getElementById(STYLE_ELEMENT_ID))
    return

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  style.textContent = `
@keyframes ${ANIMATION_NAME} { from {} to {} }
[data-maz-autofill-sync]:-webkit-autofill,
[data-maz-autofill-sync]:autofill {
  animation-name: ${ANIMATION_NAME};
  animation-duration: 1ms;
}
`
  document.head.appendChild(style)
}

/**
 * Detects browser autofill on an input and syncs the value.
 *
 * Browsers do not fire the `input` event when autofilling, so v-model stays
 * out of sync with the DOM (empty state, label does not float, value cleared
 * on next re-render). This attaches a CSS animation on `:-webkit-autofill` /
 * `:autofill` and listens to `animationstart` to detect autofill and emit
 * the value.
 *
 * @param input The input element to watch
 * @param onSync Callback invoked with the autofilled value
 * @returns Cleanup function to stop watching
 */
export function onAutofillSync(
  input: HTMLInputElement,
  onSync: (value: string) => void,
): () => void {
  ensureStylesInjected()
  input.setAttribute('data-maz-autofill-sync', '')

  function handleAnimationStart(event: AnimationEvent) {
    if (event.animationName !== ANIMATION_NAME)
      return
    onSync((event.target as HTMLInputElement).value)
  }

  input.addEventListener('animationstart', handleAnimationStart)

  return () => {
    input.removeEventListener('animationstart', handleAnimationStart)
    input.removeAttribute('data-maz-autofill-sync')
  }
}
