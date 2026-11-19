import { getPreset, warnSavedPresetFallback } from '../get-preset.ts'

vi.mock('../preset-loaders.ts', () => ({
  presetRegistry: {
    restricted: true,
    loaders: {
      ocean: () => Promise.resolve({ name: 'ocean' }),
    },
  },
}))

describe('get-preset with the presets of the app', () => {
  describe('given getPreset function', () => {
    describe('when the preset is in the presets of the app', () => {
      it('then it returns the preset', async () => {
        const result = await getPreset('ocean')

        expect(result.name).toBe('ocean')
      })
    })

    describe('when the preset is not in the presets of the app', () => {
      it('then it throws an error naming the presets option', async () => {
        await expect(getPreset('nova')).rejects.toThrow(
          '[@maz-ui/themes] Preset "nova" is not in the presets of the app: add it to the "presets" option of MazUi (@maz-ui/vite-plugin), or to "theme.presets" with @maz-ui/nuxt',
        )
      })
    })

    describe('when the name is a property of Object', () => {
      it('then it throws an error naming the presets option', async () => {
        await expect(getPreset('toString' as never)).rejects.toThrow('[@maz-ui/themes] Preset "toString" is not in the presets of the app')
      })
    })
  })

  describe('given warnSavedPresetFallback function', () => {
    describe('when the saved preset cannot be loaded', () => {
      it('then it warns with the error message', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        warnSavedPresetFallback(new TypeError('[@maz-ui/themes] Preset "nova" is not in the presets of the app'))

        expect(warn).toHaveBeenCalledWith('[@maz-ui/themes] Preset "nova" is not in the presets of the app. The configured preset is used instead.')
        warn.mockRestore()
      })
    })
  })
})
