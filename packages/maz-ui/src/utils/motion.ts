/**
 * - `auto`: follows `prefers-reduced-motion` of the user
 * - `reduced`: always reduced, whatever the preference
 * - `full`: never reduced, whatever the preference
 */
export type MazUiMotionMode = 'auto' | 'reduced' | 'full'

export interface MazUiMotionOptions {
  /**
   * @default 'auto'
   */
  mode?: MazUiMotionMode
  /**
   * What reduced motion stops: the animations of the components of maz-ui only (`lib`), or the ones of
   * the whole page (`page`)
   * @default 'lib'
   */
  scope?: 'lib' | 'page'
}

export type MazUiMotion = MazUiMotionMode | MazUiMotionOptions

export function resolveMotionOptions(motion: MazUiMotion | undefined): Required<MazUiMotionOptions> {
  const options = typeof motion === 'string' ? { mode: motion } : motion

  return {
    mode: options?.mode ?? 'auto',
    scope: options?.scope ?? 'lib',
  }
}

/**
 * The classes of `<html>` read by the CSS of maz-ui (`m-motion-reduced`, `m-motion-full`, `m-motion-page`)
 */
export function getMotionClasses(motion: MazUiMotion | undefined): string[] {
  const { mode, scope } = resolveMotionOptions(motion)
  const classes: string[] = []

  if (mode !== 'auto')
    classes.push(`m-motion-${mode}`)

  if (scope === 'page')
    classes.push('m-motion-page')

  return classes
}

const MOTION_CLASSES = ['m-motion-reduced', 'm-motion-full', 'm-motion-page']

export function applyMotionClasses(motion: MazUiMotion | undefined) {
  if (typeof document === 'undefined')
    return

  const { classList } = document.documentElement

  classList.remove(...MOTION_CLASSES)
  classList.add(...getMotionClasses(motion))
}
