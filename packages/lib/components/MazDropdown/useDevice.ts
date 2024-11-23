import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useDevice() {
  const isMobile = ref(false)
  const isTouchDevice = ref(false)

  const checkDevice = () => {
    isMobile.value = window.innerWidth <= 768 || !!window.navigator.userAgent.match(/Mobi/i)
    isTouchDevice.value = 'ontouchstart' in window
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkDevice)
  })

  return {
    isMobile,
    isTouchDevice,
  }
}
