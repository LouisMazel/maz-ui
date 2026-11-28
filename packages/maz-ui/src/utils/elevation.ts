/**
 * Elevation of a surface: `true` keeps the historical shadow, `0` to `3` are the levels of the theme
 */
export type MazElevation = boolean | 0 | 1 | 2 | 3

const ELEVATION_CLASS: Record<1 | 2 | 3, string> = {
  1: 'maz:shadow-elevation-1',
  2: 'maz:shadow-elevation-2',
  3: 'maz:shadow-elevation-3',
}

export function getElevationClass(elevation: MazElevation | undefined): string | undefined {
  if (elevation === true)
    return 'maz:shadow-elevation maz:drop-shadow-md'

  if (!elevation)
    return undefined

  return ELEVATION_CLASS[elevation]
}
