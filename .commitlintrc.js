module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'docs',
        'release',
        'deps',
        'nuxt-app',
        'vue-app',
        'cli',
        'maz-ui',
        '@maz-ui/nuxt',
        '@maz-ui/icons',
        '@maz-ui/cli',
        '@maz-ui/eslint-config',
        '@maz-ui/themes',
        '@maz-ui/translations',
        '@maz-ui/utils',
        '@maz-ui/node',
        '@maz-ui/mcp',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 200],
  },
}
