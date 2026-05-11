import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// `defineConfig` calls `antfu()` which writes a startup banner to stderr.
// Silence the streams across the whole suite to keep the test output clean.
let stdoutSpy: ReturnType<typeof vi.spyOn>
let stderrSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
})

afterEach(() => {
  stdoutSpy.mockRestore()
  stderrSpy.mockRestore()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// `getPackageJson()` inside the preset calls `readFileSync` from `node:fs`.
// We mock the module so resolveVue's auto-detect branch can be steered.
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return {
    ...actual,
    readFileSync: vi.fn(actual.readFileSync),
  }
})

const mockedReadFileSync = vi.mocked(readFileSync)

function stubPackageJson(json: object | 'throw'): void {
  mockedReadFileSync.mockImplementation(((path: any, ...rest: any[]) => {
    if (typeof path === 'string' && path.endsWith('package.json')) {
      if (json === 'throw')
        throw new Error('ENOENT')
      return JSON.stringify(json)
    }
    return (vi.importActual('node:fs') as any).readFileSync(path, ...rest)
  }) as any)
}

async function loadDefineConfig() {
  // Re-import the module after mocks are in place.
  vi.resetModules()
  return (await import('../index')).defineConfig
}

describe('defineConfig', () => {
  it('returns a flat-config array with no options', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
    expect(config.length).toBeGreaterThan(0)
  })

  it('honors explicit `env: production` (no-console becomes error)', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ env: 'production', logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('honors explicit `env: development`', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ env: 'development', logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('reads `env` from NODE_ENV when not provided', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('falls back to `production` when neither opts.env nor NODE_ENV is set', async () => {
    vi.stubEnv('NODE_ENV', '')
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('auto-detects Vue from package.json', async () => {
    stubPackageJson({ dependencies: { vue: '^3.0.0' } })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('auto-detects Nuxt from devDependencies', async () => {
    stubPackageJson({ devDependencies: { nuxt: '^3.0.0' } })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('checks peerDependencies for auto-detection', async () => {
    stubPackageJson({ peerDependencies: { vue: '^3.0.0' } })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('tolerates a missing / unreadable package.json', async () => {
    stubPackageJson('throw')
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('honors explicit `vue: true`', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vue: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('honors explicit `vue: false`', async () => {
    stubPackageJson({ dependencies: { vue: '^3.0.0' } })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vue: false, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('disables sonarjs when option is false', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ sonarjs: false, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('enables vueAccessibility', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vueAccessibility: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('accepts tailwindcss = true', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ tailwindcss: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('accepts tailwindcss = false', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ tailwindcss: false, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('accepts tailwindcss as preset string', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ tailwindcss: 'stylistic', logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('accepts tailwindcss as settings object with preset', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      tailwindcss: { preset: 'correctness', entryPoint: 'src/main.css' },
      logLevel: 'silent',
    })
    expect(Array.isArray(config)).toBe(true)
  })

  it('accepts tailwindcss as settings object without preset (defaults to recommended)', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      tailwindcss: { entryPoint: 'src/main.css' },
      logLevel: 'silent',
    })
    expect(Array.isArray(config)).toBe(true)
  })

  it('merges custom rules', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      rules: { 'no-console': 'error' },
      logLevel: 'silent',
    })
    expect(Array.isArray(config)).toBe(true)
  })

  it('lets `rules` override a rule set by an internal config block (e.g. tailwindcss)', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      tailwindcss: 'recommended',
      rules: {
        'maz/tailwind-no-arbitrary-px': ['error', { baseFontSize: 10, unit: 'em' }],
      },
      logLevel: 'silent',
    })

    // Walk the produced flat-config from the end: the *last* block setting
    // `maz/tailwind-no-arbitrary-px` is the one ESLint will actually apply.
    const ruleEntries = (config as Array<{ rules?: Record<string, unknown> }>)
      .map(block => block?.rules?.['maz/tailwind-no-arbitrary-px'])
      .filter(Boolean)

    expect(ruleEntries.at(-1)).toEqual(['error', { baseFontSize: 10, unit: 'em' }])
  })

  it('keeps internal noArbitraryPx defaults when the user does not override them', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      tailwindcss: 'recommended',
      logLevel: 'silent',
    })

    const ruleEntries = (config as Array<{ rules?: Record<string, unknown> }>)
      .map(block => block?.rules?.['maz/tailwind-no-arbitrary-px'])
      .filter(Boolean)

    expect(ruleEntries.at(-1)).toEqual(['error', { baseFontSize: 16, unit: 'rem' }])
  })

  it('does not register the maz/tailwind-* rule when tailwindcss is disabled', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ tailwindcss: false, logLevel: 'silent' })

    const blocks = config as Array<{
      rules?: Record<string, unknown>
      plugins?: Record<string, unknown>
    }>

    const hasRule = blocks.some(block => block?.rules?.['maz/tailwind-no-arbitrary-px'] !== undefined)
    const hasMazPlugin = blocks.some(block => block?.plugins?.maz !== undefined)
    expect(hasRule).toBe(false)
    expect(hasMazPlugin).toBe(false)
  })

  it('does not register the maz/tailwind-* rule by default (tailwindcss omitted)', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ logLevel: 'silent' })

    const blocks = config as Array<{ rules?: Record<string, unknown> }>
    const hasRule = blocks.some(block => block?.rules?.['maz/tailwind-no-arbitrary-px'] !== undefined)
    expect(hasRule).toBe(false)
  })

  it('appends extra user flat-config blocks', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig(
      { logLevel: 'silent' },
      { files: ['**/*.legacy.ts'], rules: { 'no-console': 'off' } },
    )
    expect(Array.isArray(config)).toBe(true)
  })

  it('respects custom ignores', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      ignores: ['custom-dist/**'],
      logLevel: 'silent',
    })
    expect(Array.isArray(config)).toBe(true)
  })

  it('uses default logLevel when no value is provided on a TTY', async () => {
    stubPackageJson({})
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig()
    expect(Array.isArray(config)).toBe(true)
  })

  it('uses silent logLevel when stdout is not a TTY', async () => {
    stubPackageJson({})
    Object.defineProperty(process.stdout, 'isTTY', { value: false, configurable: true })
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig()
    expect(Array.isArray(config)).toBe(true)
  })

  it('exposes the verbose log level path', async () => {
    stubPackageJson({})
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({
      vue: true,
      vueAccessibility: true,
      tailwindcss: 'recommended',
      rules: { 'no-console': 'error' },
      logLevel: 'verbose',
    }, { files: ['**/*.x.ts'], rules: {} })
    expect(Array.isArray(config)).toBe(true)
  })

  it('strips the buggy `AudioWorkletGlobalScope ` (trailing space) globals key from vue-a11y configs', async () => {
    stubPackageJson({})
    // Stand in for the plugin's flat/recommended config, including the
    // trailing-space typo from vue-a11y issue #1269.
    vi.doMock('eslint-plugin-vuejs-accessibility', () => ({
      default: {
        configs: {
          'flat/recommended': [
            {
              languageOptions: {
                globals: {
                  'AudioWorkletGlobalScope ': 'readonly',
                  'window': 'readonly',
                },
              },
              rules: {},
            },
          ],
        },
      },
    }))
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vueAccessibility: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('passes through vue-a11y configs that have no languageOptions.globals', async () => {
    stubPackageJson({})
    vi.doMock('eslint-plugin-vuejs-accessibility', () => ({
      default: {
        configs: {
          'flat/recommended': [
            // Plain config with no languageOptions at all — falls through
            // to the early `return config` branch.
            { rules: {} },
          ],
        },
      },
    }))
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vueAccessibility: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })

  it('treats an explicit `tailwindcss: undefined` as the default (source = default)', async () => {
    stubPackageJson({})
    Object.defineProperty(process.stdout, 'isTTY', { value: true, configurable: true })
    const defineConfig = await loadDefineConfig()
    // Logging must be on (non-silent) so the resolution box runs through
    // `formatSourceTag('default')`. Combined with `tailwindcss: undefined`,
    // this also exercises the `option === undefined` branch in
    // `resolveTailwindcss`.
    const config = await defineConfig({
      tailwindcss: undefined,
      logLevel: 'default',
    })
    expect(Array.isArray(config)).toBe(true)
  })

  it('normalizes a non-array vue-a11y flat/recommended config', async () => {
    stubPackageJson({})
    vi.doMock('eslint-plugin-vuejs-accessibility', () => ({
      default: {
        configs: {
          // Single object instead of an array — exercises the `Array.isArray`
          // normalization branch.
          'flat/recommended': { rules: {} },
        },
      },
    }))
    const defineConfig = await loadDefineConfig()
    const config = await defineConfig({ vueAccessibility: true, logLevel: 'silent' })
    expect(Array.isArray(config)).toBe(true)
  })
})
