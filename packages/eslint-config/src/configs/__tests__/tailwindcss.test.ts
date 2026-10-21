import { describe, expect, it } from 'vitest'
import { mazPlugin } from '../../plugin'
import { TAILWINDCSS_DEFAULT_FILES, tailwindcssConfigs } from '../tailwindcss'

describe('tailwindcssConfigs', () => {
  it('returns a single flat-config block scoped to the default files', () => {
    const blocks = tailwindcssConfigs('recommended', {})
    expect(blocks).toHaveLength(1)
    expect(blocks[0].files).toBe(TAILWINDCSS_DEFAULT_FILES)
  })

  it('wires the `maz` plugin alongside `better-tailwindcss`', () => {
    const [block] = tailwindcssConfigs('recommended', {})
    expect(block.plugins?.maz).toBe(mazPlugin)
    expect(block.plugins).toHaveProperty('better-tailwindcss')
  })

  it('disables the noisy better-tailwindcss rules by default', () => {
    const [block] = tailwindcssConfigs('recommended', {})
    expect(block.rules?.['better-tailwindcss/no-unknown-classes']).toBe('off')
    expect(block.rules?.['better-tailwindcss/enforce-consistent-line-wrapping']).toBe('off')
  })

  it('forwards `entryPoint`, `tailwindConfig`, `cwd`, `tsconfig`, `detectComponentClasses` to plugin settings', () => {
    const [block] = tailwindcssConfigs('recommended', {
      entryPoint: '/app/app.css',
      tailwindConfig: '/app/tailwind.config.ts',
      detectComponentClasses: true,
      cwd: '/app',
      tsconfig: '/app/tsconfig.json',
    })
    const settings = (block.settings as any)['better-tailwindcss']
    expect(settings).toEqual({
      entryPoint: '/app/app.css',
      tailwindConfig: '/app/tailwind.config.ts',
      detectComponentClasses: true,
      cwd: '/app',
      tsconfig: '/app/tsconfig.json',
    })
  })

  it('omits `better-tailwindcss` settings when nothing is provided', () => {
    const [block] = tailwindcssConfigs('recommended', {})
    expect((block.settings as any)['better-tailwindcss']).toEqual({})
  })

  describe('noArbitraryPx wiring', () => {
    it('enables the rule with defaults when option is undefined', () => {
      const [block] = tailwindcssConfigs('recommended', {})
      expect(block.rules?.['maz/tailwind-no-arbitrary-px']).toEqual([
        'error',
        { baseFontSize: 16, unit: 'rem' },
      ])
    })

    it('enables the rule with defaults when option is `true`', () => {
      const [block] = tailwindcssConfigs('recommended', { noArbitraryPx: true })
      expect(block.rules?.['maz/tailwind-no-arbitrary-px']).toEqual([
        'error',
        { baseFontSize: 16, unit: 'rem' },
      ])
    })

    it('disables the rule when option is `false`', () => {
      const [block] = tailwindcssConfigs('recommended', { noArbitraryPx: false })
      const [severity] = block.rules?.['maz/tailwind-no-arbitrary-px'] as [string, unknown]
      expect(severity).toBe('off')
    })

    it('passes custom `baseFontSize`, `unit`, and `severity`', () => {
      const [block] = tailwindcssConfigs('recommended', {
        noArbitraryPx: { baseFontSize: 10, unit: 'em', severity: 'warn' },
      })
      expect(block.rules?.['maz/tailwind-no-arbitrary-px']).toEqual([
        'warn',
        { baseFontSize: 10, unit: 'em' },
      ])
    })

    it('fills missing keys when an object is partially provided', () => {
      const [block] = tailwindcssConfigs('recommended', {
        noArbitraryPx: { baseFontSize: 12 },
      })
      expect(block.rules?.['maz/tailwind-no-arbitrary-px']).toEqual([
        'error',
        { baseFontSize: 12, unit: 'rem' },
      ])
    })

    it('defaults baseFontSize and severity when only `unit` is provided', () => {
      const [block] = tailwindcssConfigs('recommended', {
        noArbitraryPx: { unit: 'em' },
      })
      expect(block.rules?.['maz/tailwind-no-arbitrary-px']).toEqual([
        'error',
        { baseFontSize: 16, unit: 'em' },
      ])
    })
  })
})
