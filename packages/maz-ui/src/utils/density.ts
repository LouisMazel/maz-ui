/**
 * - `default`: the heights of maz-ui 5
 * - `compact`: controls about 14% shorter (a `md` control goes from 42px to 36px), tighter paddings and menu rows
 */
// Removed in v6 (plans/ROADMAP.md): `compact` becomes the default density
export type MazUiDensity = 'default' | 'compact'

export const DEFAULT_DENSITY: MazUiDensity = 'default'

const DENSITY_CLASS_COMPACT = 'm-density-compact'

/**
 * The class of `<html>` read by the CSS of maz-ui (`m-density-compact`), none for the default density
 */
export function getDensityClasses(density: MazUiDensity | undefined): string[] {
  return (density ?? DEFAULT_DENSITY) === 'compact'
    ? [DENSITY_CLASS_COMPACT]
    : []
}

export function applyDensityClasses(density: MazUiDensity | undefined) {
  if (typeof document === 'undefined')
    return

  const { classList } = document.documentElement

  classList.remove(DENSITY_CLASS_COMPACT)
  classList.add(...getDensityClasses(density))
}
