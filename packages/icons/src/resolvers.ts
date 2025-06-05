import type { ComponentResolver } from 'unplugin-vue-components/types'
import * as MazIcons from './index.js'

const icons = Object.keys(MazIcons)

/**
 * Resolver for @maz-ui/icons
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazIconsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (icons.includes(name)) {
        return {
          name,
          from: '@maz-ui/icons'
        }
      }
    },
  }
}
