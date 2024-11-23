import type { Ref } from 'vue'
import type { Position } from './types'

export function usePosition(
  triggerEl: Ref<HTMLElement | null>,
  menuEl: Ref<HTMLElement | null>,
  position: Ref<Position>,
) {
  const computePosition = () => {
    console.log('computePosition', triggerEl.value, menuEl.value)
    if (!triggerEl.value || !menuEl.value)
      return
    console.log('computePosition')

    const triggerRect = triggerEl.value.getBoundingClientRect()
    const menuRect = menuEl.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    if (position.value === 'auto') {
      // Calcul de l'espace disponible dans chaque direction
      const spaces = {
        top: triggerRect.top,
        bottom: viewportHeight - triggerRect.bottom,
        left: triggerRect.left,
        right: viewportWidth - triggerRect.right,
      }

      const maxSpace = Math.max(...Object.values(spaces))
      const bestPosition = Object.entries(spaces).find(([_, value]) => value === maxSpace)?.[0] as Position
      position.value = bestPosition
    }

    let top = 0
    let left = 0

    switch (position.value) {
      case 'bottom':
        top = triggerRect.bottom + window.scrollY
        left = triggerRect.left
        break
      case 'bottom-right':
        top = triggerRect.bottom + window.scrollY
        left = triggerRect.right - menuRect.width
        break
      case 'bottom-left':
        top = triggerRect.bottom + window.scrollY
        left = triggerRect.left
        break
      case 'top':
        top = triggerRect.top + window.scrollY - menuRect.height
        left = triggerRect.left
        break
      case 'top-right':
        top = triggerRect.top + window.scrollY - menuRect.height
        left = triggerRect.right - menuRect.width
        break
      case 'top-left':
        top = triggerRect.top + window.scrollY - menuRect.height
        left = triggerRect.left
        break
      case 'left':
        top = triggerRect.top + window.scrollY
        left = triggerRect.left - menuRect.width
        break
      case 'right':
        top = triggerRect.top + window.scrollY
        left = triggerRect.right
        break
    }

    // Ajustement si le menu dépasse de l'écran
    if (left + menuRect.width > viewportWidth) {
      left = viewportWidth - menuRect.width - 8
    }
    if (left < 0) {
      left = 8
    }
    if (top + menuRect.height > viewportHeight) {
      top = viewportHeight - menuRect.height - 8
    }
    if (top < 0) {
      top = 8
    }

    return { top: `${top}px`, left: `${left}px` }
  }

  return { computePosition }
}
