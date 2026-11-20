import { defineBuildConfig } from 'unbuild'

// The Vite plugin runs in Node: outside of the Vite build of the icons, after it (it does not empty `dist`)
export default defineBuildConfig({
  entries: [
    { input: 'src/vite/index', name: 'vite' },
    { input: 'src/cli', name: 'cli' },
  ],
  declaration: true,
  clean: false,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
  },
})
