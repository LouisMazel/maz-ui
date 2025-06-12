import type { ComponentResolver } from 'unplugin-vue-components/types'
import { iconsList } from './icon-list.js'

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
      if (iconsList.includes(name as any)) {
        return {
          name,
          from: base,
        }
      }
    },
  }
}
