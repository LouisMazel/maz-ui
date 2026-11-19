import type { MazUiIconsOptions } from '@maz-ui/icons/vite'
import type { Plugin } from 'vite'
import type { MazUiPurgeCssOptions } from './purge-css/index.ts'
import { MazUiIcons } from '@maz-ui/icons/vite'
import { MazUiPurgeCss } from './purge-css/index.ts'
import { MazUiThemePresets } from './theme-presets/index.ts'

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
  /**
   * Named presets of @maz-ui/themes the app loads by name: the other presets are not in the build. `[]` keeps none,
   * for an app that only uses preset objects.
   * @default undefined (every preset)
   */
  presets?: string[]
}

function getOptions<T extends object>(value: boolean | T | undefined): T | undefined {
  if (value === false)
    return undefined

  return typeof value === 'object'
    ? value
    : {} as T
}

/** The Vite plugins of maz-ui: icons by name, CSS purge and theme presets */
export function MazUi(options: MazUiOptions = {}): Plugin[] {
  const icons = getOptions(options.icons)
  const purge = getOptions(options.purge)

  return [
    ...(icons ? [MazUiIcons(icons)] : []),
    ...(purge ? [MazUiPurgeCss(purge)] : []),
    ...(options.presets ? [MazUiThemePresets({ presets: options.presets })] : []),
  ]
}
