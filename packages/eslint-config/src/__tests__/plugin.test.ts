import { describe, expect, it } from 'vitest'
import { mazPlugin } from '../plugin.ts'
import { rules } from '../rules/index.ts'

describe('mazPlugin', () => {
  it('declares the `maz` plugin name', () => {
    expect(mazPlugin.meta?.name).toBe('maz')
  })

  it('exposes the rules registry under `rules`', () => {
    expect(mazPlugin.rules).toBe(rules)
  })

  it('registers tailwind-no-arbitrary-px', () => {
    expect(mazPlugin.rules).toHaveProperty('tailwind-no-arbitrary-px')
  })
})
