const typeEnum = require('./.cz-config')

module.exports = {
  extends: ['@commitlint/config-conventional', 'cz'],
  rules: {
    'type-enum': [2, 'always', typeEnum.types.map((i) => i.value)],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'scope-case': [2, 'always', ['lower-case', 'upper-case', 'camel-case']],
    'scope-enum': [2, 'always', typeEnum.scopes.map((i) => i.name)],
  },
}
