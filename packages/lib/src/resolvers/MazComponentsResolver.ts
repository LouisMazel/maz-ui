/* eslint-disable regexp/no-unused-capturing-group */

import type { ComponentResolver } from 'unplugin-vue-components/types'
import * as MazIcons from '@maz-ui/icons'
import { pascalCase } from '../formatters/pascalCase'

const icons = Object.keys(MazIcons)

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

      if (/^(Maz[A-Z])/.test(name) && !icons.includes(name)) {
        return { from: `${base}/${name}${extension}` }
      }
      else if (/^(maz-[a-z])/.test(name)) {
        return { from: `${base}/${pascalCase(name)}` }
      }
    },
  }
}
