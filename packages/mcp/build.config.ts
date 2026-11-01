import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/cli'],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
    // Published without dependencies: `npx @maz-ui/mcp` downloads a single package instead of a hundred
    inlineDependencies: true,
    // The Node builds of the dependencies: the browser one of @vue/compiler-dom decodes the HTML entities with `document`
    resolve: { exportConditions: ['node'], preferBuiltins: true },
  },
  hooks: {
    'build:before': (ctx) => {
      // Optional peers so that releasing them releases this package, but bundled like every other dependency
      const bundledPeers = ['@maz-ui/node', '@maz-ui/utils']

      ctx.options.peerDependencies = ctx.options.peerDependencies.filter(name => !bundledPeers.includes(name))
      ctx.options.externals = ctx.options.externals.filter(external => typeof external !== 'string' || !bundledPeers.includes(external))
    },
    'rollup:dts:options': (_ctx, options) => {
      // esbuild would strip the `export type` of the inlined `.d.ts` files: rollup-plugin-dts reads them as they are
      options.plugins = [options.plugins].flat().filter(plugin => !(plugin && 'name' in plugin && plugin.name === 'esbuild'))
      // Only the types of the maz-ui packages are inlined, the third-party ones stay imports
      options.external = (id: string) => /^(?!@maz-ui\/)(?:@[\w.-]+\/)?[\w.-]+(?:\/|$)/.test(id) && !id.startsWith('.')
    },
  },
})
