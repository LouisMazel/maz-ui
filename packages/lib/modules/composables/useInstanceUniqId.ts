import { computed, useId } from 'vue'

export function useInstanceUniqId({
  componentName,
  providedId,
}: {
  componentName: string
  providedId?: string
}) {
  const id = useId()
  return computed(() => providedId ?? `${componentName}-${id}`)
}
