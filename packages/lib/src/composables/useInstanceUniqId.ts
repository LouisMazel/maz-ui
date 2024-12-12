import { computed, useId } from 'vue'

export function useInstanceUniqId({
  componentName,
  providedId,
}: {
  componentName: string
  providedId?: string
}) {
  return computed(() => providedId ?? `${componentName}-${useId().replace(/:/g, '')}`)
}
