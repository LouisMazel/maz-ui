<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'

const props = defineProps<{
  isActive?: boolean
  disabled?: boolean
  parentId?: string
}>()

const emit = defineEmits<(e: 'select') => void>()

const slots = useSlots()

function handleSelect() {
  if (!props.disabled) {
    emit('select')
  }
}

const itemRef = ref<HTMLElement | null>(null)
const registerMenuItem = inject('registerMenuItem') as Function
const unregisterMenuItem = inject('unregisterMenuItem') as Function
const activeSubmenuId = inject('activeSubmenuId') as Ref<string | null>

const itemId = ref<string>('')
const hasSubmenu = computed(() => !!slots.submenu)
const isSubmenuOpen = computed(() => activeSubmenuId.value === itemId.value)

onMounted(() => {
  if (itemRef.value) {
    itemId.value = registerMenuItem(
      itemRef.value,
      hasSubmenu.value,
      !!props.parentId,
      props.parentId,
    )
  }
})

onBeforeUnmount(() => {
  if (itemRef.value) {
    unregisterMenuItem(itemRef.value)
  }
})

function handleItemKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect()
  }
}
</script>

<template>
  <div
    ref="itemRef"
    class="dropdown-item"
    :class="{
      'is-active': isActive,
      'has-submenu': hasSubmenu,
    }"
    role="menuitem"
    :aria-selected="isActive"
    :aria-haspopup="hasSubmenu"
    :aria-expanded="isSubmenuOpen"
    tabindex="-1"
    @click="handleSelect"
    @keydown.stop="handleItemKeyDown"
  >
    <slot />
    <div
      v-if="hasSubmenu"
      v-show="isSubmenuOpen"
      class="dropdown-submenu"
      role="menu"
      :aria-label="`Sous-menu de ${$slots.default?.()?.[0]?.children}`"
    >
      <slot name="submenu" />
    </div>
  </div>
</template>

<style scoped>
.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-item:hover:not(.disabled),
.dropdown-item.is-active:not(.disabled) {
  background-color: #f5f5f5;
}

.dropdown-item:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

/* Style pour les items avec sous-menu */
.has-submenu::after {
  content: '›';
  margin-left: 0.5em;
  transform: rotate(0);
  transition: transform 0.2s;
}

.has-submenu[aria-expanded='true']::after {
  transform: rotate(90deg);
}

@media (max-width: 768px) {
  .dropdown-item {
    padding: 12px 16px;
    min-height: 44px;
  }
}
</style>
