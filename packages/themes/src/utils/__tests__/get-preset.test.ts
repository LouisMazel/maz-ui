import type { ThemePreset, ThemePresetOverrides } from '../../types'
import { describe, expect, it } from 'vitest'
import { getPreset, isPresetObject } from '../get-preset'

describe('get-preset', () => {
  describe('given isPresetObject function', () => {
    describe('when preset has name property and is object', () => {
      it('then it returns true', () => {
        const preset = {
          name: 'custom',
          colors: {},
          blur: {},
        }

        const result = isPresetObject(preset)

        expect(result).toBe(true)
      })
    })

    describe('when preset is a string', () => {
      it('then it returns false', () => {
        const preset = 'accor'

        const result = isPresetObject(preset as unknown as ThemePreset)

        expect(result).toBe(false)
      })
    })

    describe('when preset is an object without name property', () => {
      it('then it returns false', () => {
        const preset: ThemePresetOverrides = {
          colors: {},
        }

        const result = isPresetObject(preset)

        expect(result).toBe(false)
      })
    })

    describe('when preset is null', () => {
      it('then it returns false', () => {
        const preset = null

        const result = isPresetObject(preset as unknown as ThemePreset)

        expect(result).toBe(false)
      })
    })

    describe('when preset is undefined', () => {
      it('then it returns false', () => {
        const preset = undefined

        const result = isPresetObject(preset as unknown as ThemePreset)

        expect(result).toBe(false)
      })
    })

    describe('when preset is an object with name as null', () => {
      it('then it returns false', () => {
        const preset = {
          name: null,
          colors: {},
        }

        const result = isPresetObject(preset as unknown as ThemePreset)

        expect(result).toBe(false)
      })
    })

    describe('when preset is an object with name as empty string', () => {
      it('then it returns false', () => {
        const preset = {
          name: '',
          colors: {},
        }

        const result = isPresetObject(preset as unknown as ThemePreset)

        expect(result).toBe(false)
      })
    })
  })

  describe('given getPreset function', () => {
    describe('when valid AdsThemePreset is provided', () => {
      it('then it returns the preset object', async () => {
        const preset = {
          name: 'custom',
          colors: {},
          foundation: {},
        } as ThemePreset

        const result = await getPreset(preset)

        expect(result).toBe(preset)
      })
    })

    describe('when accor string is provided', () => {
      it('then it returns accor preset', async () => {
        const result = await getPreset('ocean')

        expect(result).toBeDefined()
        expect(result.name).toBe('ocean')
        expect(result.colors).toBeDefined()
      })
    })

    describe('when no preset is provided', () => {
      it('then it returns accor preset', async () => {
        const result = await getPreset()

        expect(result).toBeDefined()
        expect(result.name).toBe('maz-ui')
        expect(result.colors).toBeDefined()
      })
    })

    describe('when undefined is provided', () => {
      it('then it returns accor preset', async () => {
        const result = await getPreset(undefined)

        expect(result).toBeDefined()
        expect(result.name).toBe('maz-ui')
        expect(result.colors).toBeDefined()
      })
    })

    describe('when ibis string is provided', () => {
      it('then it returns ibis preset', async () => {
        const result = await getPreset('obsidian')

        expect(result).toBeDefined()
        expect(result.name).toBe('obsidian')
        expect(result.colors).toBeDefined()
      })
    })

    describe('when unknown preset string is provided', () => {
      it('then it throws TypeError', async () => {
        await expect(getPreset('unknown' as never)).rejects.toThrow(
          '[@maz-ui/themes] Preset unknown not found',
        )
      })
    })

    describe('when non-existent preset is provided', () => {
      it('then it throws TypeError with correct message format', async () => {
        const unknownPreset = 'nonexistent'

        await expect(getPreset(unknownPreset as never)).rejects.toThrow(
          `[@maz-ui/themes] Preset ${unknownPreset} not found`,
        )
      })
    })
  })
})
