import type { LinterResult } from 'stylelint'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import stylelint from 'stylelint'
import {
  baseRules,
  defineMazStylelintConfig,
  GLOBAL_IGNORES,
  logicalRules,
  scssRules,
  TAILWIND_AT_RULES,
  tailwindRules,
} from '../src/index'

const FIXTURES_DIR = fileURLToPath(new URL('./fixtures/', import.meta.url))

function loadFixture(name: string): string {
  return readFileSync(`${FIXTURES_DIR}${name}`, 'utf-8')
}

interface RunOptions {
  fixture: string
  config: ReturnType<typeof defineMazStylelintConfig>
  syntax?: 'css' | 'html' | 'scss'
}

function runStylelint({ fixture, config, syntax = 'css' }: RunOptions): Promise<LinterResult> {
  const code = loadFixture(fixture)
  return stylelint.lint({
    code,
    config: { ...config, ignoreFiles: undefined },
    customSyntax: syntax === 'css' ? undefined : syntax === 'html' ? 'postcss-html' : 'postcss-scss',
  })
}

describe('defineMazStylelintConfig', () => {
  describe('default options', () => {
    it('extends stylelint-config-standard and recess-order', () => {
      const config = defineMazStylelintConfig()
      expect(config.extends).toContain('stylelint-config-standard')
      expect(config.extends).toContain('stylelint-config-recess-order')
    })

    it('enables logical-properties rule by default', () => {
      const config = defineMazStylelintConfig()
      expect(config.plugins).toContain('stylelint-use-logical-spec')
      expect(config.rules?.['liberty/use-logical-spec']).toEqual(['always'])
    })

    it('applies the baseRules opinions', () => {
      const config = defineMazStylelintConfig()
      expect(config.rules?.['selector-class-pattern']).toBeNull()
      expect(config.rules?.['no-descending-specificity']).toBeNull()
    })

    it('uses GLOBAL_IGNORES merged with no user ignores', () => {
      const config = defineMazStylelintConfig()
      expect(config.ignoreFiles).toEqual(GLOBAL_IGNORES)
    })
  })

  describe('option: order', () => {
    it('omits the recess-order extends when order is false', () => {
      const config = defineMazStylelintConfig({ order: false })
      expect(config.extends).not.toContain('stylelint-config-recess-order')
    })

    it('omits the recess-order extends when order is alphabetical (no built-in extends)', () => {
      const config = defineMazStylelintConfig({ order: 'alphabetical' })
      expect(config.extends).not.toContain('stylelint-config-recess-order')
    })
  })

  describe('option: vue', () => {
    it('extends stylelint-config-recommended-vue and registers postcss-html for .vue files', () => {
      const config = defineMazStylelintConfig({ vue: true })
      expect(config.extends).toContain('stylelint-config-recommended-vue')
      expect(config.overrides).toContainEqual(expect.objectContaining({
        files: expect.arrayContaining(['**/*.vue']),
        customSyntax: 'postcss-html',
      }))
    })

    it('does not enable Vue when vue is explicitly false', () => {
      const config = defineMazStylelintConfig({ vue: false })
      expect(config.extends).not.toContain('stylelint-config-recommended-vue')
    })
  })

  describe('option: html', () => {
    it('extends stylelint-config-html and registers postcss-html for .html files', () => {
      const config = defineMazStylelintConfig({ html: true })
      expect(config.extends).toContain('stylelint-config-html')
      const override = (config.overrides ?? []).find(o => Array.isArray(o.files) && o.files.includes('**/*.html'))
      expect(override).toBeDefined()
      expect(override?.customSyntax).toBe('postcss-html')
    })
  })

  describe('option: tailwind', () => {
    it('whitelists Tailwind v4 at-rules', () => {
      const config = defineMazStylelintConfig({ tailwind: true })
      const rule = config.rules?.['at-rule-no-unknown']
      expect(rule).toBeDefined()
      expect((rule as [boolean, { ignoreAtRules: string[] }])[1].ignoreAtRules).toEqual(expect.arrayContaining(['theme', 'apply', 'layer', 'variant', 'reference']))
    })

    it('forces import-notation to string (Tailwind prefix(...) modifier)', () => {
      const config = defineMazStylelintConfig({ tailwind: true })
      expect(config.rules?.['import-notation']).toBe('string')
    })

    it('exposes the at-rule list from TAILWIND_AT_RULES', () => {
      expect(TAILWIND_AT_RULES).toEqual(expect.arrayContaining(['theme', 'apply', 'utility', 'variant']))
    })
  })

  describe('option: scss', () => {
    it('extends stylelint-config-recommended-scss and adds scss override', () => {
      const config = defineMazStylelintConfig({ scss: true })
      expect(config.extends).toContain('stylelint-config-recommended-scss')
      expect(config.overrides).toContainEqual(expect.objectContaining({
        files: ['**/*.scss'],
        customSyntax: 'postcss-scss',
      }))
    })

    it('whitelists Tailwind at-rules through the scss/at-rule-no-unknown rule when both are enabled', () => {
      const config = defineMazStylelintConfig({ scss: true, tailwind: true })
      const rule = config.rules?.['scss/at-rule-no-unknown']
      expect(rule).toBeDefined()
      expect((rule as [boolean, { ignoreAtRules: string[] }])[1].ignoreAtRules.length).toBeGreaterThan(0)
    })
  })

  describe('option: logical', () => {
    it('disables logical-properties rule when logical is false', () => {
      const config = defineMazStylelintConfig({ logical: false })
      expect(config.plugins ?? []).not.toContain('stylelint-use-logical-spec')
      expect(config.rules?.['liberty/use-logical-spec']).toBeUndefined()
    })
  })

  describe('option: ignores', () => {
    it('merges with the default ignore list', () => {
      const config = defineMazStylelintConfig({ ignores: ['custom/**'] })
      expect(config.ignoreFiles).toContain('custom/**')
      expect(config.ignoreFiles).toContain('**/node_modules/**')
    })

    it('replaces the default ignore list when ignoresOverride is set', () => {
      const config = defineMazStylelintConfig({ ignoresOverride: ['only-this/**'] })
      expect(config.ignoreFiles).toEqual(['only-this/**'])
    })
  })

  describe('option: rules and overrides (raw stylelint passthrough)', () => {
    it('merges custom rules on top of resolved rules', () => {
      const config = defineMazStylelintConfig({
        rules: {
          'color-no-invalid-hex': null,
        },
      })
      expect(config.rules?.['color-no-invalid-hex']).toBeNull()
    })

    it('appends user overrides after the built-in ones', () => {
      const config = defineMazStylelintConfig({
        vue: true,
        overrides: [{ files: ['**/legacy.css'], rules: { 'color-no-invalid-hex': null } }],
      })
      expect(config.overrides?.at(-1)).toEqual({
        files: ['**/legacy.css'],
        rules: { 'color-no-invalid-hex': null },
      })
    })

    it('appends user plugins on top of built-in ones', () => {
      const config = defineMazStylelintConfig({
        plugins: ['my-custom-plugin'],
      })
      expect(config.plugins).toContain('stylelint-use-logical-spec')
      expect(config.plugins).toContain('my-custom-plugin')
    })
  })

  describe('exports', () => {
    it('exports the individual rule sets for advanced usage', () => {
      expect(baseRules).toBeDefined()
      expect(tailwindRules).toBeDefined()
      expect(logicalRules).toBeDefined()
      expect(scssRules(true)).toBeDefined()
      expect(scssRules(false)).toBeDefined()
    })
  })
})

describe('integration with the stylelint runtime', () => {
  describe('when the config is valid CSS', () => {
    it('produces no warnings against the default config', async () => {
      const config = defineMazStylelintConfig({ logical: false, order: false })
      const result = await runStylelint({ fixture: 'valid.css', config })
      expect(result.errored).toBe(false)
    })
  })

  describe('when the fixture uses physical properties and logical is on', () => {
    it('reports warnings on the physical declarations', async () => {
      const config = defineMazStylelintConfig({ logical: true, order: false })
      const result = await runStylelint({ fixture: 'physical-properties.css', config })
      expect(result.errored).toBe(true)
      const messages = result.results.flatMap(r => r.warnings.map(w => w.text))
      expect(messages.join('\n')).toMatch(/margin-left|padding-right/)
    })
  })

  describe('when the fixture uses Tailwind directives and tailwind is off', () => {
    it('flags @theme/@apply/@layer as unknown at-rules', async () => {
      const config = defineMazStylelintConfig({ logical: false, order: false, tailwind: false })
      const result = await runStylelint({ fixture: 'tailwind.css', config })
      expect(result.errored).toBe(true)
    })
  })

  describe('when the fixture uses Tailwind directives and tailwind is on', () => {
    it('does not flag the Tailwind at-rules', async () => {
      const config = defineMazStylelintConfig({ logical: false, order: false, tailwind: true })
      const result = await runStylelint({ fixture: 'tailwind.css', config })
      const atRuleMessages = result.results.flatMap(r => r.warnings).filter(w => w.rule === 'at-rule-no-unknown')
      expect(atRuleMessages).toHaveLength(0)
    })
  })

  describe('when the fixture has an invalid hex color', () => {
    it('reports a Stylelint warning', async () => {
      const config = defineMazStylelintConfig({ logical: false, order: false })
      const result = await runStylelint({ fixture: 'invalid-color.css', config })
      expect(result.errored).toBe(true)
      const warnings = result.results.flatMap(r => r.warnings)
      expect(warnings.length).toBeGreaterThan(0)
    })
  })
})

describe('snapshots of the resolved configuration', () => {
  it('matches the empty-options snapshot', () => {
    expect(defineMazStylelintConfig()).toMatchSnapshot()
  })

  it('matches the full-options snapshot', () => {
    expect(defineMazStylelintConfig({
      vue: true,
      html: true,
      tailwind: true,
      scss: true,
      logical: true,
      order: 'recess',
    })).toMatchSnapshot()
  })

  it('matches the minimal snapshot (everything off)', () => {
    expect(defineMazStylelintConfig({
      vue: false,
      html: false,
      tailwind: false,
      scss: false,
      logical: false,
      order: false,
    })).toMatchSnapshot()
  })
})
