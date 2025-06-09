import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  failOnWarn: true,
  rollup: {
    emitCJS: false,
  },
  externals: ['@antfu/eslint-config', 'eslint-plugin-sonarjs', 'eslint-plugin-tailwindcss', 'eslint-plugin-vuejs-accessibility', 'eslint'],
})
