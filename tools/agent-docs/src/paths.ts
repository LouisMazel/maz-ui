import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

export interface SourcePaths {
  root: string
  docsSrc: string
  docsMixins: string
  libRoot: string
  libComponents: string
  libComposables: string
  libDirectives: string
  libPlugins: string
  libCss: string
  libTailwind: string
  utilsHelpers: string
  utilsTsHelpers: string
  iconList: string
  content: string
}

export function getSourcePaths(root = ROOT): SourcePaths {
  return {
    root,
    docsSrc: resolve(root, 'apps/docs/src'),
    docsMixins: resolve(root, 'apps/docs/.vitepress/mixins'),
    libRoot: resolve(root, 'packages/maz-ui'),
    libComponents: resolve(root, 'packages/maz-ui/src/components'),
    libComposables: resolve(root, 'packages/maz-ui/src/composables'),
    libDirectives: resolve(root, 'packages/maz-ui/src/directives'),
    libPlugins: resolve(root, 'packages/maz-ui/src/plugins'),
    libCss: resolve(root, 'packages/maz-ui/src/css'),
    libTailwind: resolve(root, 'packages/maz-ui/src/tailwindcss'),
    utilsHelpers: resolve(root, 'packages/utils/src/helpers'),
    utilsTsHelpers: resolve(root, 'packages/utils/src/ts-helpers'),
    iconList: resolve(root, 'packages/icons/src/icon-list.ts'),
    content: resolve(root, 'tools/agent-docs/content'),
  }
}
