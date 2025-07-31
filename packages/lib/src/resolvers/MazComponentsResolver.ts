/* eslint-disable regexp/no-unused-capturing-group */

import type { IconName } from '@maz-ui/icons/icon-list'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import { iconsList } from '@maz-ui/icons/icon-list'
import { pascalCase } from '@maz-ui/utils/src/helpers/pascalCase.js'

/**
 * Resolver for Maz-UI (components)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazComponentsResolver(options?: { devMode?: boolean }): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      const { devMode = false } = options || {}
      const base = devMode ? 'maz-ui/src/components' : 'maz-ui/components'
      const extension = devMode ? '.vue' : ''

      if (/^(Maz[A-Z])/.test(name) && !iconsList.includes(name as IconName)) {
        return { from: `${base}/${name}${extension}` }
      }
      else if (/^(maz-[a-z])/.test(name)) {
        return { from: `${base}/${pascalCase(name)}` }
      }
    },
  }
}
