import { isServer } from '@maz-ui/utils/helpers/isServer'

export function noTransition<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  if (isServer()) {
    return fn(...args)
  }

  const style = document.createElement('style')
  style.textContent = `.no-transitions *,
.no-transitions *::before,
.no-transitions *::after {
  transition-property: transform, opacity, scale, rotate, translate !important;
  }`
  document.head.appendChild(style)
  document.documentElement.classList.add('no-transitions')

  setTimeout(() => {
    document.documentElement.classList.remove('no-transitions')
    style.remove()
  }, 500)

  return fn(...args)
}
