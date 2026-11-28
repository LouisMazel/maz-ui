import type { ThemeState } from '@maz-ui/themes'
import type { Ref } from 'vue'
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref } from 'vue'

export type MazCodeColorMode = 'auto' | 'light' | 'dark'

function htmlHasDarkClass() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
}

export function useCodeColorMode(root: () => HTMLElement | null | undefined, colorMode: () => MazCodeColorMode) {
  const themeState = inject<Ref<ThemeState | undefined> | undefined>('mazThemeState', undefined)
    ?? getCurrentInstance()?.appContext.config.globalProperties.$mazThemeState as Ref<ThemeState | undefined> | undefined
  const hasDarkAncestor = ref<boolean>()
  let observer: MutationObserver | undefined

  const isDark = computed(() => {
    if (colorMode() !== 'auto')
      return colorMode() === 'dark'
    if (hasDarkAncestor.value)
      return true
    if (themeState?.value)
      return !!themeState.value.isDark
    return hasDarkAncestor.value ?? htmlHasDarkClass()
  })

  function update() {
    hasDarkAncestor.value = !!root()?.closest('.dark')
  }

  onMounted(() => {
    update()
    observer = new MutationObserver(update)
    let node: HTMLElement | null | undefined = root()
    while (node) {
      observer.observe(node, { attributes: true, attributeFilter: ['class'] })
      node = node.parentElement
    }
  })

  onUnmounted(() => observer?.disconnect())

  return { isDark }
}
