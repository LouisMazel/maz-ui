import type { ComponentResolver } from 'unplugin-vue-components/types'
import * as MazIcons from './index.js'

const icons = Object.keys(MazIcons)

/**
 * Resolver for @maz-ui/icons
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazIconsResolver(options?: { devMode?: boolean }): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { devMode = false } = options || {}
      const base = devMode ? '@maz-ui/icons/src/index.ts' : '@maz-ui/icons'
      if (icons.includes(name)) {
        return {
          name,
          from: base,
        }
      }
    },
  }
}
