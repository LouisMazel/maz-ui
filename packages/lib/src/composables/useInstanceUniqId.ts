import { computed, useId } from 'vue'

export function useInstanceUniqId({
  componentName,
  providedId,
}: {
  componentName: string
  providedId?: string
}) {
  const generatedId = useId()

  return computed(() => {
    if (providedId)
      return providedId

    return `${componentName}-${generatedId.replace(/:/g, '')}`
  })
}
