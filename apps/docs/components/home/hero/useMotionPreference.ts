import { useMutationObserver } from 'maz-ui/composables/useMutationObserver'
import { useReducedMotion } from 'maz-ui/composables/useReducedMotion'
import { computed, onMounted, ref } from 'vue'

const FORCED_CLASS = 'm-motion-reduced'

export function useMotionPreference() {
  const { shouldReduceMotion } = useReducedMotion()
  const forced = ref(false)
  const root = ref<HTMLElement>()

  function read() {
    forced.value = document.documentElement.classList.contains(FORCED_CLASS)
  }

  onMounted(() => {
    root.value = document.documentElement
    read()
  })

  useMutationObserver(root, read, { attributes: true, attributeFilter: ['class'] })

  return computed(() => forced.value || shouldReduceMotion.value)
}
