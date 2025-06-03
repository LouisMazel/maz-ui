module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['root', 'docs', 'nuxt-app', 'maz-ui', 'cli', 'release', 'nuxt-module', '@mazui/cli', 'deps'],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 200],
  },
}
