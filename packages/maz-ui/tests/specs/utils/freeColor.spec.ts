import { isFreeColor, mixColor, resolveColor, resolveColorForeground, shiftColorLightness } from '@/utils/freeColor.ts'

describe('given the free color helpers', () => {
  describe('when checking a color', () => {
    it.each(['#e11d48', '#fff', 'oklch(0.7 0.1 20)', 'rgb(0 0 0)', 'var(--brand)', 'color-mix(in srgb, red, blue)'])('then %s is a free color', (color) => {
      expect(isFreeColor(color)).toBe(true)
    })

    it.each(['primary', 'destructive', 'transparent', 'surface'])('then %s is a theme color', (color) => {
      expect(isFreeColor(color)).toBe(false)
    })
  })

  describe('when resolving a color', () => {
    it('then a theme color becomes its variable', () => {
      expect(resolveColor('primary')).toBe('var(--maz-primary)')
    })

    it('then a free color is unchanged', () => {
      expect(resolveColor('#e11d48')).toBe('#e11d48')
      expect(resolveColor('var(--brand)')).toBe('var(--brand)')
    })
  })

  describe('when resolving the foreground of a color', () => {
    it('then a theme color uses its foreground token', () => {
      expect(resolveColorForeground('success')).toBe('var(--maz-success-foreground)')
    })

    it('then a free color derives a black or white text from its lightness', () => {
      expect(resolveColorForeground('#e11d48')).toBe('oklch(from #e11d48 clamp(0, calc((0.65 - l) * 1000), 1) 0 0)')
    })
  })

  describe('when shifting the lightness', () => {
    it('then a negative offset darkens the color', () => {
      expect(shiftColorLightness('primary', -0.1)).toBe('oklch(from var(--maz-primary) clamp(0, calc(l - 0.1), 1) c h)')
    })

    it('then a positive offset lightens a free color', () => {
      expect(shiftColorLightness('#e11d48', 0.06)).toBe('oklch(from #e11d48 clamp(0, calc(l + 0.06), 1) c h)')
    })
  })

  describe('when mixing a color with transparent', () => {
    it('then it returns a color-mix of the resolved color', () => {
      expect(mixColor('info', 20)).toBe('color-mix(in srgb, var(--maz-info) 20%, transparent)')
      expect(mixColor('#e11d48', 60)).toBe('color-mix(in srgb, #e11d48 60%, transparent)')
    })
  })
})
