export const markdown = {
  ignores: ['**/*.md'],
  rules: {
    'ts/no-unused-vars': 'off',
    'sonarjs/unused-import': 'off',
    'sonarjs/no-labels': 'off',
    'sonarjs/label-position': 'off',
    'no-console': 'off',
  } as const,
}
