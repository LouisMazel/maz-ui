import type { LinterResult } from 'stylelint'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import stylelint from 'stylelint'

const { loggerSpies } = vi.hoisted(() => {
  const spies = {
    setLevel: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    box: vi.fn(),
  }
  return { loggerSpies: spies }
})

vi.mock('../src/configs/logger', () => ({
  createLogger: () => loggerSpies,
}))

const {
  baseRules,
  defineConfig,
  GLOBAL_IGNORES,
  logicalRules,
  scssRules,
  TAILWIND_AT_RULES,
  tailwindRules,
} = await import('../src/index')

const FIXTURES_DIR = fileURLToPath(new URL('./fixtures/', import.meta.url))

function loadFixture(name: string): string {
  return readFileSync(`${FIXTURES_DIR}${name}`, 'utf-8')
}

interface RunOptions {
  fixture: string
  config: ReturnType<typeof defineConfig>
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

function containsExtend(extendsList: unknown, name: string): boolean {
  if (!Array.isArray(extendsList))
    return false
  return extendsList.some(e => typeof e === 'string' && (e === name || e.includes(`/${name}/`) || e.endsWith(`/${name}`)))
}

function containsPlugin(plugins: unknown, name: string): boolean {
  if (!Array.isArray(plugins))
    return false
  return plugins.some(p => typeof p === 'string' && (p === name || p.includes(`/${name}/`) || p.endsWith(`/${name}`)))
}

describe('defineConfig', () => {
  describe('default options', () => {
    it('extends stylelint-config-standard and recess-order', () => {
      const config = defineConfig()
      expect(containsExtend(config.extends, 'stylelint-config-standard')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-recess-order')).toBe(true)
    })

    it('enables logical-properties rule by default', () => {
      const config = defineConfig()
      expect(containsPlugin(config.plugins, 'stylelint-use-logical-spec')).toBe(true)
      expect(config.rules?.['liberty/use-logical-spec']).toEqual(['always'])
    })

    it('applies the baseRules opinions', () => {
      const config = defineConfig()
      expect(config.rules?.['selector-class-pattern']).toBeNull()
      expect(config.rules?.['no-descending-specificity']).toBeNull()
    })

    it('uses GLOBAL_IGNORES merged with no user ignores', () => {
      const config = defineConfig()
      expect(config.ignoreFiles).toEqual(GLOBAL_IGNORES)
    })
  })

  describe('option: order', () => {
    it('omits the recess-order extends when order is false', () => {
      const config = defineConfig({ order: false })
      expect(containsExtend(config.extends, 'stylelint-config-recess-order')).toBe(false)
      expect(containsPlugin(config.plugins, 'stylelint-order')).toBe(false)
    })

    it('wires up stylelint-order with alphabetical rule when order is alphabetical', () => {
      const config = defineConfig({ order: 'alphabetical' })
      expect(containsExtend(config.extends, 'stylelint-config-recess-order')).toBe(false)
      expect(containsPlugin(config.plugins, 'stylelint-order')).toBe(true)
      expect(config.rules?.['order/properties-alphabetical-order']).toBe(true)
    })
  })

  describe('option: vue', () => {
    it('extends stylelint-config-recommended-vue and registers postcss-html for .vue files', () => {
      const config = defineConfig({ vue: true })
      expect(containsExtend(config.extends, 'stylelint-config-recommended-vue')).toBe(true)
      const override = (config.overrides ?? []).find(o => Array.isArray(o.files) && o.files.includes('**/*.vue'))
      expect(override).toBeDefined()
      expect(override?.customSyntax).toMatch(/postcss-html/u)
    })

    it('does not enable Vue when vue is explicitly false', () => {
      const config = defineConfig({ vue: false })
      expect(containsExtend(config.extends, 'stylelint-config-recommended-vue')).toBe(false)
    })
  })

  describe('option: html', () => {
    it('extends stylelint-config-html and registers postcss-html for .html files', () => {
      const config = defineConfig({ html: true })
      expect(containsExtend(config.extends, 'stylelint-config-html')).toBe(true)
      const override = (config.overrides ?? []).find(o => Array.isArray(o.files) && o.files.includes('**/*.html'))
      expect(override).toBeDefined()
      expect(override?.customSyntax).toMatch(/postcss-html/u)
    })
  })

  describe('option: tailwind', () => {
    it('whitelists Tailwind v4 at-rules', () => {
      const config = defineConfig({ tailwind: true })
      const rule = config.rules?.['at-rule-no-unknown']
      expect(rule).toBeDefined()
      expect((rule as [boolean, { ignoreAtRules: string[] }])[1].ignoreAtRules).toEqual(expect.arrayContaining(['theme', 'apply', 'layer', 'variant', 'reference']))
    })

    it('forces import-notation to string (Tailwind prefix(...) modifier)', () => {
      const config = defineConfig({ tailwind: true })
      expect(config.rules?.['import-notation']).toBe('string')
    })

    it('exposes the at-rule list from TAILWIND_AT_RULES', () => {
      expect(TAILWIND_AT_RULES).toEqual(expect.arrayContaining(['theme', 'apply', 'utility', 'variant']))
    })

    it('does not load the plugin under the minimal policy (whitelist-only)', () => {
      const config = defineConfig({ tailwind: true })
      const ruleNames = (config.plugins as { ruleName?: string }[] ?? []).map(p => p?.ruleName).filter(Boolean)
      expect(ruleNames).not.toEqual(expect.arrayContaining(['tailwindcss/no-invalid-apply']))
      expect(config.rules?.['tailwindcss/no-invalid-apply']).toBeUndefined()
      expect(config.rules?.['tailwindcss/no-invalid-theme-function']).toBeUndefined()
    })

    it('applies the recommended policy when tailwind is "recommended"', () => {
      const config = defineConfig({ tailwind: 'recommended' })
      expect(config.rules?.['tailwindcss/no-invalid-apply']).toBe(true)
      expect(config.rules?.['tailwindcss/no-invalid-theme-function']).toBe(true)
      expect(config.rules?.['tailwindcss/no-apply']).toBe(true)
      expect(config.rules?.['tailwindcss/no-arbitrary-value']).toBe(true)
      expect(config.rules?.['tailwindcss/no-atomic-class']).toBe(true)
      expect(config.rules?.['tailwindcss/no-css-layer']).toBeUndefined()
    })

    it('applies the strict policy when tailwind is "strict"', () => {
      const config = defineConfig({ tailwind: 'strict' })
      expect(config.rules?.['tailwindcss/no-css-layer']).toBe(true)
      expect(config.rules?.['tailwindcss/no-tailwind-directive']).toBe(true)
      expect(config.rules?.['tailwindcss/no-screen-directive']).toBe(true)
    })

    it('does not load the plugin when tailwind is false', () => {
      const config = defineConfig({ tailwind: false })
      const ruleNames = (config.plugins as { ruleName?: string }[] ?? []).map(p => p?.ruleName).filter(Boolean)
      expect(ruleNames).not.toEqual(expect.arrayContaining(['tailwindcss/no-invalid-apply']))
      expect(config.rules?.['tailwindcss/no-invalid-apply']).toBeUndefined()
    })
  })

  describe('option: scss', () => {
    it('extends stylelint-config-standard-scss and adds scss override', () => {
      const config = defineConfig({ scss: true })
      expect(containsExtend(config.extends, 'stylelint-config-standard-scss')).toBe(true)
      const override = (config.overrides ?? []).find(o => Array.isArray(o.files) && o.files.includes('**/*.scss'))
      expect(override).toBeDefined()
      expect(override?.customSyntax).toMatch(/postcss-scss/u)
    })

    it('whitelists Tailwind at-rules through the scss/at-rule-no-unknown rule when both are enabled', () => {
      const config = defineConfig({ scss: true, tailwind: true })
      const rule = config.rules?.['scss/at-rule-no-unknown']
      expect(rule).toBeDefined()
      expect((rule as [boolean, { ignoreAtRules: string[] }])[1].ignoreAtRules.length).toBeGreaterThan(0)
    })
  })

  describe('option: logical', () => {
    it('disables logical-properties rule when logical is false', () => {
      const config = defineConfig({ logical: false })
      expect(containsPlugin(config.plugins, 'stylelint-use-logical-spec')).toBe(false)
      expect(config.rules?.['liberty/use-logical-spec']).toBeUndefined()
    })
  })

  describe('option: logLevel', () => {
    beforeEach(() => {
      loggerSpies.setLevel.mockClear()
      loggerSpies.box.mockClear()
      loggerSpies.debug.mockClear()
      loggerSpies.verbose.mockClear()
    })

    it('forwards the logLevel option to the logger via setLevel', () => {
      defineConfig({ logLevel: 'debug' })
      expect(loggerSpies.setLevel).toHaveBeenCalledWith('debug')
    })

    it('defaults the logger level to "default" when no logLevel is provided', () => {
      defineConfig()
      expect(loggerSpies.setLevel).toHaveBeenCalledWith('default')
    })

    it('emits the resolved-config summary as a titled box', () => {
      defineConfig({ logLevel: 'default', tailwind: 'recommended', vue: true })
      expect(loggerSpies.box).toHaveBeenCalledOnce()
      const arg = loggerSpies.box.mock.calls[0][0]
      expect(arg).toMatchObject({ title: '@maz-ui/stylelint-config' })
      expect(arg.message).toContain('vue')
      expect(arg.message).toContain('tailwind')
      expect(arg.message).toContain('recommended')
    })

    it('emits debug logs when feature blocks add plugins or extends', () => {
      defineConfig({ logLevel: 'debug', vue: true, tailwind: 'recommended', logical: true })
      const messages = loggerSpies.debug.mock.calls.map(call => String(call[0]))
      expect(messages.some(m => m.includes('Vue: extended'))).toBe(true)
      expect(messages.some(m => m.includes('Tailwind: loaded'))).toBe(true)
      expect(messages.some(m => m.includes('Logical: loaded'))).toBe(true)
      expect(messages.some(m => m.includes('Order: extended'))).toBe(true)
    })

    it('emits debug logs for user-supplied rules, plugins, overrides and extends', () => {
      defineConfig({
        logLevel: 'debug',
        rules: { 'color-no-invalid-hex': null },
        plugins: ['custom-plugin'],
        overrides: [{ files: ['**/*.legacy.css'], rules: {} }],
        extends: ['stylelint-config-clean-order'],
      })
      const messages = loggerSpies.debug.mock.calls.map(call => String(call[0]))
      expect(messages.some(m => m.includes('User: merged 1 rule override'))).toBe(true)
      expect(messages.some(m => m.includes('User: appended 1 plugin'))).toBe(true)
      expect(messages.some(m => m.includes('User: appended 1 per-file override'))).toBe(true)
      expect(messages.some(m => m.includes('User: extended stylelint-config-clean-order'))).toBe(true)
    })

    it('emits verbose logs with the final config shape', () => {
      defineConfig({ logLevel: 'verbose' })
      const messages = loggerSpies.verbose.mock.calls.map(call => String(call[0]))
      expect(messages.some(m => m.includes('Final extends'))).toBe(true)
      expect(messages.some(m => m.includes('Final plugin count'))).toBe(true)
    })
  })

  describe('option: ignores', () => {
    it('merges with the default ignore list', () => {
      const config = defineConfig({ ignores: ['custom/**'] })
      expect(config.ignoreFiles).toContain('custom/**')
      expect(config.ignoreFiles).toContain('**/node_modules/**')
    })

    it('replaces the default ignore list when ignoresOverride is set', () => {
      const config = defineConfig({ ignoresOverride: ['only-this/**'] })
      expect(config.ignoreFiles).toEqual(['only-this/**'])
    })
  })

  describe('option: rules and overrides (raw stylelint passthrough)', () => {
    it('merges custom rules on top of resolved rules', () => {
      const config = defineConfig({
        rules: {
          'color-no-invalid-hex': null,
        },
      })
      expect(config.rules?.['color-no-invalid-hex']).toBeNull()
    })

    it('appends user overrides after the built-in ones', () => {
      const config = defineConfig({
        vue: true,
        overrides: [{ files: ['**/legacy.css'], rules: { 'color-no-invalid-hex': null } }],
      })
      expect(config.overrides?.at(-1)).toEqual({
        files: ['**/legacy.css'],
        rules: { 'color-no-invalid-hex': null },
      })
    })

    it('appends user plugins on top of built-in ones', () => {
      const config = defineConfig({
        plugins: ['my-custom-plugin'],
      })
      expect(containsPlugin(config.plugins, 'stylelint-use-logical-spec')).toBe(true)
      expect(config.plugins).toContain('my-custom-plugin')
    })

    it('appends user extends after the built-in ones so they win the cascade', () => {
      const config = defineConfig({
        extends: ['stylelint-config-clean-order', 'stylelint-config-tailwindcss'],
      })
      expect(containsExtend(config.extends, 'stylelint-config-standard')).toBe(true)
      expect(config.extends?.at(-2)).toBe('stylelint-config-clean-order')
      expect(config.extends?.at(-1)).toBe('stylelint-config-tailwindcss')
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
      const config = defineConfig({ logical: false, order: false })
      const result = await runStylelint({ fixture: 'valid.css', config })
      expect(result.errored).toBe(false)
    })
  })

  describe('when the fixture uses physical properties and logical is on', () => {
    it('reports warnings on the physical declarations', async () => {
      const config = defineConfig({ logical: true, order: false })
      const result = await runStylelint({ fixture: 'physical-properties.css', config })
      expect(result.errored).toBe(true)
      const messages = result.results.flatMap(r => r.warnings.map(w => w.text))
      expect(messages.join('\n')).toMatch(/margin-left|padding-right/)
    })
  })

  describe('when the fixture uses Tailwind directives and tailwind is off', () => {
    it('flags @theme/@apply/@layer as unknown at-rules', async () => {
      const config = defineConfig({ logical: false, order: false, tailwind: false })
      const result = await runStylelint({ fixture: 'tailwind.css', config })
      expect(result.errored).toBe(true)
    })
  })

  describe('when the fixture uses Tailwind directives and tailwind is on', () => {
    it('does not flag the Tailwind at-rules', async () => {
      const config = defineConfig({ logical: false, order: false, tailwind: true })
      const result = await runStylelint({ fixture: 'tailwind.css', config })
      const atRuleMessages = result.results.flatMap(r => r.warnings).filter(w => w.rule === 'at-rule-no-unknown')
      expect(atRuleMessages).toHaveLength(0)
    })
  })

  describe('when the fixture has an invalid hex color', () => {
    it('reports a Stylelint warning', async () => {
      const config = defineConfig({ logical: false, order: false })
      const result = await runStylelint({ fixture: 'invalid-color.css', config })
      expect(result.errored).toBe(true)
      const warnings = result.results.flatMap(r => r.warnings)
      expect(warnings.length).toBeGreaterThan(0)
    })
  })
})

describe('resolved configuration shape', () => {
  describe('with empty options', () => {
    it('extends only standard + recess-order, loads only the logical plugin, applies the global ignore list', () => {
      const config = defineConfig()
      expect(config.extends).toHaveLength(2)
      expect(containsExtend(config.extends, 'stylelint-config-standard')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-recess-order')).toBe(true)
      expect(config.plugins).toHaveLength(1)
      expect(containsPlugin(config.plugins, 'stylelint-use-logical-spec')).toBe(true)
      expect(config.overrides).toBeUndefined()
      expect(config.ignoreFiles).toEqual(GLOBAL_IGNORES)
    })
  })

  describe('with everything turned on', () => {
    it('extends standard + recess + standard-scss + recommended-vue + html, registers the tailwind plugin instances under recommended, registers scss + vue/html overrides', () => {
      const config = defineConfig({
        vue: true,
        html: true,
        tailwind: 'recommended',
        scss: true,
        logical: true,
        order: 'recess',
      })
      expect(containsExtend(config.extends, 'stylelint-config-standard')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-recess-order')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-standard-scss')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-recommended-vue')).toBe(true)
      expect(containsExtend(config.extends, 'stylelint-config-html')).toBe(true)
      expect(containsPlugin(config.plugins, 'stylelint-use-logical-spec')).toBe(true)
      const ruleNames = (config.plugins as { ruleName?: string }[] ?? []).map(p => p?.ruleName).filter(Boolean)
      expect(ruleNames).toEqual(expect.arrayContaining(['tailwindcss/no-invalid-apply', 'tailwindcss/no-invalid-theme-function', 'tailwindcss/no-atomic-class']))
      expect(config.overrides).toContainEqual(expect.objectContaining({ files: ['**/*.scss'] }))
      expect(config.overrides).toContainEqual(expect.objectContaining({ files: expect.arrayContaining(['**/*.vue', '**/*.html']) }))
    })
  })

  describe('with everything turned off', () => {
    it('extends only standard, loads no plugins, registers no overrides', () => {
      const config = defineConfig({
        vue: false,
        html: false,
        tailwind: false,
        scss: false,
        logical: false,
        order: false,
      })
      expect(config.extends).toHaveLength(1)
      expect(containsExtend(config.extends, 'stylelint-config-standard')).toBe(true)
      expect(config.plugins).toBeUndefined()
      expect(config.overrides).toBeUndefined()
    })
  })
})
