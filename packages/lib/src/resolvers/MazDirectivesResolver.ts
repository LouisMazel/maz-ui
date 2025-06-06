import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * Resolver for Maz-UI (directives)
 *
 * @author @louismazel
 * @link https://maz-ui.com
 */
export function MazDirectivesResolver(options?: { devMode?: boolean }): ComponentResolver {
  return {
    type: 'directive',
    resolve: (name: string) => {
      const { devMode = false } = options || {}
      const base = devMode ? 'maz-ui/src/directives/index.ts' : 'maz-ui/directives'

      return { from: base, as: `v${name}`, name: `v${name}` }
    },
  }
}
