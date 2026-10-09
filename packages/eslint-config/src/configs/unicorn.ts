export const unicorn = {
  files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}'],
  rules: {
    'unicorn/prefer-global-this': 'error',
  } as const,
}
