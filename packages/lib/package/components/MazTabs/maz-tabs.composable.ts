import { ref } from 'vue'

const currentTab = ref<number>()

export const useMazTabs = () => {
  return {
    currentTab,
  }
}
oo
