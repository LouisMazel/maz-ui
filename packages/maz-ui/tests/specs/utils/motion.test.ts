import { applyMotionClasses, getMotionClasses, resolveMotionOptions } from '@/utils/motion.ts'

describe('given resolveMotionOptions', () => {
  describe('when no option is given', () => {
    it('then the motion follows the preference of the user, for the library only', () => {
      expect(resolveMotionOptions(undefined)).toEqual({ mode: 'auto', scope: 'lib' })
    })
  })

  describe('when a mode is given as a string', () => {
    it('then it is the mode', () => {
      expect(resolveMotionOptions('reduced')).toEqual({ mode: 'reduced', scope: 'lib' })
    })
  })
})

describe('given getMotionClasses', () => {
  describe('when the motion is auto for the library', () => {
    it('then there is no class', () => {
      expect(getMotionClasses('auto')).toEqual([])
    })
  })

  describe('when the motion is forced for the whole page', () => {
    it('then there is a class for the mode and one for the page', () => {
      expect(getMotionClasses({ mode: 'reduced', scope: 'page' })).toEqual(['m-motion-reduced', 'm-motion-page'])
    })
  })
})

describe('given applyMotionClasses', () => {
  afterEach(() => {
    document.documentElement.className = ''
  })

  describe('when the motion changes from full to auto', () => {
    it('then the class of the previous mode is removed', () => {
      applyMotionClasses('full')
      expect(document.documentElement.classList.contains('m-motion-full')).toBe(true)

      applyMotionClasses('auto')
      expect(document.documentElement.classList.contains('m-motion-full')).toBe(false)
    })
  })
})
