<script setup lang="ts">
import type { DropdownProps } from './types'
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { useDevice } from './useDevice'
import { useKeyboardNavigation } from './useKeyboardNavigation'
import { usePosition } from './usePosition'

const props = withDefaults(defineProps<DropdownProps>(), {
  trigger: 'click',
  position: 'auto',
  closeOnClickOutside: true,
  closeOnEsc: true,
  enableContextMenu: false,
  label: undefined,
  id: undefined,
})

// Refs
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const menuStyle = ref({})

// IDs uniques
const uniqueId = computed(() => props.id || `dropdown-${Math.random().toString(36).substr(2, 9)}`)
const triggerId = computed(() => `${uniqueId.value}-trigger`)
const menuId = computed(() => `${uniqueId.value}-menu`)

// Hooks
const { isMobile, isTouchDevice } = useDevice()
const { computePosition } = usePosition(triggerRef, menuRef, ref(props.position))
const {
  registerMenuItem,
  unregisterMenuItem,
  handleKeyDown,
  resetNavigation,
  currentFocusIndex,
  activeSubmenuId,
} = useKeyboardNavigation()

// Provide pour les composants enfants
provide('registerMenuItem', registerMenuItem)
provide('unregisterMenuItem', unregisterMenuItem)
provide('activeSubmenuId', activeSubmenuId)

// Touch handling
const touchStartTime = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const LONG_PRESS_DURATION = 500
const TOUCH_MOVE_THRESHOLD = 10

// Méthodes
function handleClick(event: MouseEvent) {
  if (props.trigger === 'click' || props.trigger === 'both') {
    event.preventDefault()
    toggleMenu()
  }
}

function handleContextMenu(event: MouseEvent) {
  if (props.enableContextMenu) {
    event.preventDefault()
    isOpen.value = true
    updatePosition()
  }
}

function handleMouseEnter() {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    isOpen.value = true
    updatePosition()
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover' || props.trigger === 'both') {
    isOpen.value = false
  }
}

function handleTouchStart(event: TouchEvent) {
  touchStartTime.value = Date.now()
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

function handleTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX
  const touchEndY = event.changedTouches[0].clientY
  const touchDuration = Date.now() - touchStartTime.value

  if (
    props.enableContextMenu
    && touchDuration >= LONG_PRESS_DURATION
    && Math.abs(touchEndX - touchStartX.value) < TOUCH_MOVE_THRESHOLD
    && Math.abs(touchEndY - touchStartY.value) < TOUCH_MOVE_THRESHOLD
  ) {
    event.preventDefault()
    isOpen.value = true
    updatePosition()
  }
}

function handleTriggerKeyDown(event: KeyboardEvent) {
  if (['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    toggleMenu()
  }
}

function toggleMenu() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    updatePosition()
    closeOtherDropdowns()
    if (isMobile.value) {
      document.body.classList.add('dropdown-open')
    }
  }
  else if (isMobile.value) {
    document.body.classList.remove('dropdown-open')
  }
}

function close() {
  isOpen.value = false
  resetNavigation()
  triggerRef.value?.focus()
  if (isMobile.value) {
    document.body.classList.remove('dropdown-open')
  }
}

function updatePosition() {
  menuStyle.value = isMobile.value
    ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90vw',
        maxHeight: '90vh',
      }
    : computePosition() || {}
}

function handleClickOutside(event: MouseEvent) {
  if (
    props.closeOnClickOutside
    && isOpen.value
    && containerRef.value
    && !containerRef.value.contains(event.target as Node)
  ) {
    close()
  }
}

function handleEscKey(event: KeyboardEvent) {
  if (props.closeOnEsc && isOpen.value && event.key === 'Escape') {
    close()
  }
}

function closeOtherDropdowns() {
  const event = new CustomEvent('dropdown-opened', { bubbles: true })
  containerRef.value?.dispatchEvent(event)
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscKey)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('contextmenu', handleContextMenu)

  document.addEventListener('dropdown-opened', (event) => {
    if (event.target !== containerRef.value) {
      close()
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('contextmenu', handleContextMenu)
})
</script>

<template>
  <div
    ref="containerRef"
    class="dropdown-container"
  >
    <!-- Trigger -->
    <div
      :id="triggerId"
      ref="triggerRef"
      role="button"
      :aria-haspopup="true"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      :aria-label="props.label || 'Menu déroulant'"
      tabindex="0"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @keydown="handleTriggerKeyDown"
    >
      <slot name="trigger" />
    </div>

    <!-- Menu -->
    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-show="isOpen"
          :id="menuId"
          ref="menuRef"
          class="dropdown-menu"
          :class="{ 'touch-device': isTouchDevice }"
          :style="menuStyle"
          role="menu"
          :aria-labelledby="triggerId"
          @keydown="handleKeyDown"
        >
          <div class="dropdown-menu-content">
            <slot />
          </div>
          <!-- Bouton fermer pour mobile -->
          <button
            v-if="isMobile"
            class="dropdown-close-button"
            aria-label="Fermer le menu"
            @click="close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: fixed;
  z-index: 1000;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  outline: none; /* Pour le focus ring */
}

/* Mobile styles */
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    overflow-y: auto;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .dropdown-close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }
}

/* Touch device specifics */
.dropdown-menu.touch-device {
  /* Larger touch targets */
  .dropdown-item {
    padding: 12px 20px;
    min-height: 44px; /* iOS minimum touch target size */
  }
}

/* Prevent scroll on body when menu is open on mobile */
/* :global(body.dropdown-open) {
  overflow: hidden;
} */

/* Animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}

@media (max-width: 768px) {
  .dropdown-enter-from,
  .dropdown-leave-to {
    transform: scale(0.9) translate(-50%, -50%);
  }
}
</style>
