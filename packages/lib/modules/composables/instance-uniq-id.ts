import type { getCurrentInstance } from 'vue'
import { computed } from 'vue'

export const useInstanceUniqId = ({
  componentName,
  instance,
  providedId,
}: {
  componentName: string
  instance?: ReturnType<typeof getCurrentInstance>
  providedId?: string
}) => {
  const instanceId = computed(() => providedId ?? `${componentName}-${instance?.uid}`)

  return {
    instanceId,
  }
}
