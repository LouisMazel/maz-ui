import { describe, expect, it } from 'vitest'
import { baseRules } from '../base'
import { GLOBAL_IGNORES } from '../global'
import { markdown } from '../markdown'
import { sonarjsRules, sonarjsTestRules } from '../sonarjs'
import { testRules } from '../test'
import { vueRules, vueSfcOnlyRules } from '../vue'

describe('baseRules', () => {
  it('downgrades `no-console` to `warn` in development', () => {
    const rules = baseRules(false)
    expect(rules['no-console']).toEqual(['warn'])
  })

  it('escalates `no-console` to `error` in production', () => {
    const rules = baseRules(true)
    expect(rules['no-console']).toEqual(['error'])
  })

  it('declares the expected core rules', () => {
    const rules = baseRules(true)
    expect(rules['ts/no-unused-vars']).toEqual([
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ])
    expect(rules.complexity).toEqual(['error', { max: 20 }])
    expect(rules['no-useless-assignment']).toBe('error')
  })
})

describe('GLOBAL_IGNORES', () => {
  it('includes the common build / dependency folders', () => {
    expect(GLOBAL_IGNORES).toContain('**/node_modules')
    expect(GLOBAL_IGNORES).toContain('**/dist')
    expect(GLOBAL_IGNORES).toContain('**/coverage')
    expect(GLOBAL_IGNORES).toContain('**/.nuxt')
  })
})

describe('markdown', () => {
  it('scopes to inline code blocks and relaxes a few rules', () => {
    expect(markdown.files).toEqual(['**/*.md/**'])
    expect(markdown.rules['no-console']).toBe('off')
    expect(markdown.rules['ts/no-unused-vars']).toBe('off')
  })
})

describe('sonarjs rules', () => {
  it('keeps key quality rules on while turning off noisy ones', () => {
    expect(sonarjsRules['sonarjs/cognitive-complexity']).toEqual(['error', 20])
    expect(sonarjsRules['sonarjs/no-identical-functions']).toBe('error')
    expect(sonarjsRules['sonarjs/no-duplicate-string']).toBe('off')
  })

  it('relaxes constraints in test files', () => {
    expect(sonarjsTestRules['sonarjs/no-nested-functions']).toBe('off')
    expect(sonarjsTestRules['sonarjs/cognitive-complexity']).toBe('off')
  })
})

describe('testRules', () => {
  it('disables max-nested-callbacks for test files', () => {
    expect(testRules['max-nested-callbacks']).toBe('off')
  })
})

describe('vueRules', () => {
  it('enforces kebab-case for custom event names', () => {
    expect(vueRules['vue/custom-event-name-casing']).toEqual(['error', 'kebab-case'])
  })

  it('disables `no-useless-assignment` only inside SFCs', () => {
    expect(vueSfcOnlyRules['no-useless-assignment']).toBe('off')
  })
})
