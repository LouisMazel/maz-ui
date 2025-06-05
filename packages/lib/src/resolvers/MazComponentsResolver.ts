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
export function MazComponentsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^(Maz[A-Z])/.test(name) && !icons.includes(name)) {
        return { from: `maz-ui/components/${name}` }
      }
      else if (/^(maz-[a-z])/.test(name)) {
        return { from: `maz-ui/components/${pascalCase(name)}` }
      }
    },
  }
}
