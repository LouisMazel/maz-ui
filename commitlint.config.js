module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['root', 'docs', 'testing', 'lib', 'cli', 'release']],
  },
}
