import { computed, ref } from 'vue'

interface MenuItem {
  el: HTMLElement
  hasSubmenu: boolean
  isSubmenu: boolean
  parentId?: string
  id: string
}

export function useKeyboardNavigation() {
  const currentFocusIndex = ref(-1)
  const menuItems = ref<MenuItem[]>([])
  const activeSubmenuId = ref<string | null>(null)

  const visibleItems = computed(() => {
    return menuItems.value.filter(item =>
      !item.isSubmenu
      || (item.isSubmenu && item.parentId === activeSubmenuId.value),
    )
  })

  const registerMenuItem = (el: HTMLElement, hasSubmenu: boolean, isSubmenu: boolean, parentId?: string) => {
    const id = `menu-item-${Math.random().toString(36).substring(7)}`
    menuItems.value.push({ el, hasSubmenu, isSubmenu, parentId, id })
    return id
  }

  const unregisterMenuItem = (el: HTMLElement) => {
    const index = menuItems.value.findIndex(item => item.el === el)
    if (index !== -1) {
      menuItems.value.splice(index, 1)
    }
  }

  const focusItem = (index: number) => {
    if (index >= 0 && index < visibleItems.value.length) {
      currentFocusIndex.value = index
      visibleItems.value[index].el.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const currentItem = visibleItems.value[currentFocusIndex.value]

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusItem((currentFocusIndex.value + 1) % visibleItems.value.length)
        break

      case 'ArrowUp':
        event.preventDefault()
        focusItem(currentFocusIndex.value <= 0
          ? visibleItems.value.length - 1
          : currentFocusIndex.value - 1)
        break

      case 'ArrowRight':
        if (currentItem?.hasSubmenu) {
          event.preventDefault()
          activeSubmenuId.value = currentItem.id
          focusItem(0)
        }
        break

      case 'ArrowLeft':
        if (currentItem?.isSubmenu) {
          event.preventDefault()
          const parentItem = menuItems.value.find(item => item.id === currentItem.parentId)
          if (parentItem) {
            activeSubmenuId.value = parentItem.parentId || null
            focusItem(menuItems.value.indexOf(parentItem))
          }
        }
        break

      case 'Home':
        event.preventDefault()
        focusItem(0)
        break

      case 'End':
        event.preventDefault()
        focusItem(visibleItems.value.length - 1)
        break
    }
  }

  const resetNavigation = () => {
    currentFocusIndex.value = -1
    activeSubmenuId.value = null
  }

  return {
    registerMenuItem,
    unregisterMenuItem,
    handleKeyDown,
    resetNavigation,
    currentFocusIndex,
    activeSubmenuId,
  }
}
