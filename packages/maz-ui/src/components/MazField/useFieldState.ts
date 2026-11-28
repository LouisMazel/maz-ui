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

const STATE_COLOR_VAR: Record<MazFieldState, string> = {
  error: 'var(--maz-destructive)',
  success: 'var(--maz-success)',
  warning: 'var(--maz-warning)',
}

/**
 * Value of `--m-field-color`, the color of the focused border (`field-focus` utility):
 * the one of the validation state, else the color of the field.
 */
export function getFieldFocusColor(color: string, state?: MazFieldState): string {
  if (state)
    return STATE_COLOR_VAR[state]

  return color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})`
}
