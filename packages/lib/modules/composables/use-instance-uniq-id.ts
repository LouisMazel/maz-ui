import { computed, getCurrentInstance } from 'vue'

export function useInstanceUniqId({
  componentName,
  providedId,
}: {
  componentName: string
  providedId?: string
}) {
  const instance = getCurrentInstance()
  return computed(() => providedId ?? `${componentName}-${instance?.uid}`)
}
