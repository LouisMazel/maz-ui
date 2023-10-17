import { type getCurrentInstance, computed } from 'vue'

export const useInstanceUniqId = ({
  componentName,
  instance,
  providedId,
}: {
  componentName: string
  instance?: ReturnType<typeof getCurrentInstance>
  providedId?: string
}) => {
  return computed(() => providedId ?? `${componentName}-${instance?.uid}`)
}
