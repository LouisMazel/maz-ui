<template>
  <div class="m-dropdown">
    <MazBtn
      color="transparent"
      size="md"
      :aria-expanded="isDropdownOpen"
      aria-haspopup="menu"
      :fab="fab"
      class="maz-z-[1000]"
      @click="toggleDropdown"
      @focus="setDropdown(true)"
      @blur="setDropdown(false)"
      @mouseenter="setDropdown(true)"
      @mouseleave="setDropdown(false)"
    >
      <slot></slot>
    </MazBtn>

    <Transition name="maz-slide">
      <ul
        v-if="isDropdownOpen"
        role="menu"
        aria-label="Menu"
        class="maz-origin-top-right"
        @keydown="handleKeyDown"
        @mouseenter="setDropdown(true)"
        @mouseleave="setDropdown(false)"
      >
        <li
          v-for="(item, index) in items"
          :key="index"
          :role="item.selected ? 'menuitemcheckbox' : 'menuitem'"
          :aria-checked="item.selected ? 'true' : 'false'"
          @click="toggleItem(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import MazBtn, { type Size } from './MazBtn.vue'
  import { debounce } from '../modules'

  const isDropdownOpen = ref(true)
  const items = ref([
    { label: 'Item 1', selected: false },
    { label: 'Item 2', selected: false },
    { label: 'Item 3', selected: false },
  ])

  withDefaults(
    defineProps<{
      fab?: boolean
      size?: Size
    }>(),
    {
      size: 'md',
    },
  )

  function toggleDropdown() {
    setDropdown(!isDropdownOpen.value)
  }

  const setDropdown = debounce((value) => {
    isDropdownOpen.value = value as boolean
  }, 100)

  function toggleItem(item: (typeof items.value)[0]) {
    item.selected = !item.selected
    setDropdown(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDropdown(false)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
</script>

<style lang="postcss">
  .m-dropdown {
    @apply maz-flex maz-flex-col maz-items-start;

    ul {
      @apply maz-flex maz-flex-col maz-overflow-auto maz-rounded maz-elevation dark:maz-border dark:maz-border-color-light;

      li {
        @apply maz-cursor-pointer maz-bg-color maz-px-4 maz-py-2 maz-transition-colors maz-duration-300 maz-ease-in-out hover:maz-bg-color-light;
      }
    }
  }
</style>
