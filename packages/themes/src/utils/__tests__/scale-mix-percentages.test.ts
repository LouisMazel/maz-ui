import { SCALE_MIX_PERCENTAGES, SCALED_COLOR_NAMES } from '../scale-mix-percentages'

describe('given the scale mix percentages table', () => {
  describe('when accessing palette steps', () => {
    it('exposes 11 steps from 50 to 950', () => {
      const keys = Object.keys(SCALE_MIX_PERCENTAGES).map(Number)
      expect(keys.sort((a, b) => a - b)).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])
    })

    it('uses white mixing below 500 and black mixing above', () => {
      expect(SCALE_MIX_PERCENTAGES[50]).toMatchObject({ mixWith: 'white' })
      expect(SCALE_MIX_PERCENTAGES[400]).toMatchObject({ mixWith: 'white' })
      expect(SCALE_MIX_PERCENTAGES[600]).toMatchObject({ mixWith: 'black' })
      expect(SCALE_MIX_PERCENTAGES[950]).toMatchObject({ mixWith: 'black' })
    })

    it('uses identity for step 500', () => {
      expect(SCALE_MIX_PERCENTAGES[500]).toEqual({ mixWith: null })
    })
  })

  describe('when accessing the scaled color names list', () => {
    it('lists every color name that should receive a 50-950 scale', () => {
      expect(SCALED_COLOR_NAMES).toEqual([
        'primary',
        'secondary',
        'accent',
        'destructive',
        'success',
        'warning',
        'info',
        'contrast',
        'surface',
        'foreground',
        'divider',
        'muted',
        'overlay',
        'shadow',
      ])
    })
  })
})
