import { isServer } from '@maz-ui/utils'

export function noTransition(fn: () => void) {
  if (isServer()) {
    fn()
    return
  }

  const style = document.createElement('style')
  style.textContent = `.no-transitions *,
.no-transitions *::before,
.no-transitions *::after {
  transition-property: transform, opacity, scale, rotate, translate !important;
  }`
  document.head.appendChild(style)
  document.documentElement.classList.add('no-transitions')
  fn()
  setTimeout(() => {
    document.documentElement.classList.remove('no-transitions')
    style.remove()
  }, 500)
}
