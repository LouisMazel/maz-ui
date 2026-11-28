import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export type MazFieldState = 'error' | 'success' | 'warning'

export interface MazFieldStateSource {
  error?: boolean
  success?: boolean
  warning?: boolean
}

const BORDER_CLASS: Record<MazFieldState, string> = {
  error: 'maz:border-destructive',
  success: 'maz:border-success',
  warning: 'maz:border-warning',
}

const TEXT_CLASS: Record<MazFieldState, string> = {
  error: 'maz:text-destructive-600',
  success: 'maz:text-success-600',
  warning: 'maz:text-warning-600',
}

const DEFAULT_BORDER_CLASS = '--default-border maz:border-divider maz:dark:border-divider-400'

/**
 * State shared by the fields (`MazInput`, `MazTextarea`, and the fields built on them):
 * the validation state (`error` wins over `success`, which wins over `warning`) and the classes that follow it.
 */
export function useFieldState(source: MaybeRefOrGetter<MazFieldStateSource>) {
  const state = computed<MazFieldState | undefined>(() => {
    const { error, success, warning } = toValue(source)

    if (error)
      return 'error'
    if (success)
      return 'success'
    if (warning)
      return 'warning'

    return undefined
  })

  const borderClass = computed(() => (state.value ? BORDER_CLASS[state.value] : DEFAULT_BORDER_CLASS))

  const textClass = computed(() => (state.value ? TEXT_CLASS[state.value] : undefined))

  const importantTextClass = computed(() => (state.value ? `${TEXT_CLASS[state.value]}!` : undefined))

  return { state, hasState: computed(() => !!state.value), borderClass, textClass, importantTextClass }
}
