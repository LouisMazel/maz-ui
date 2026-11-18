import type { Plugin } from 'vite'
import type { MazUiIconsOptions } from './icons'
import type { MazUiPurgeCssOptions } from './purge-css'
import { MazUiIcons } from './icons'
import { MazUiPurgeCss } from './purge-css'

export interface MazUiOptions {
  /**
   * Icons by name (`<MazIcon icon="x-mark" />`), with the SVG of the project and the types of the names. `false`
   * to disable it.
   * @default true
   */
  icons?: boolean | MazUiIconsOptions
  /**
   * Removes the unused CSS of maz-ui from the build. `false` to disable it.
   * @default true
   */
  purge?: boolean | MazUiPurgeCssOptions
}

function getOptions<T extends object>(value: boolean | T | undefined): T | undefined {
  if (value === false)
    return undefined

  return typeof value === 'object'
    ? value
    : {} as T
}

/** The Vite plugins of maz-ui: icons by name and CSS purge */
export function MazUi(options: MazUiOptions = {}): Plugin[] {
  const icons = getOptions(options.icons)
  const purge = getOptions(options.purge)

  return [
    ...(icons
      ? [
          MazUiIcons(icons),
        ]
      : []),
    ...(purge
      ? [
          MazUiPurgeCss(purge),
        ]
      : []),
  ]
}
