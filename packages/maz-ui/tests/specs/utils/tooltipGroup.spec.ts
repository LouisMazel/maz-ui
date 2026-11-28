import { forgetTooltip, markTooltipClosed, markTooltipOpen, resetTooltipGroup, shouldSkipTooltipDelay } from '@/utils/tooltipGroup'

describe('given the tooltip group', () => {
  beforeEach(() => {
    resetTooltipGroup()
  })

  describe('when no tooltip was opened', () => {
    it('then the delay is kept', () => {
      expect(shouldSkipTooltipDelay(1000)).toBe(false)
    })
  })

  describe('when a tooltip is open', () => {
    it('then the delay is skipped', () => {
      markTooltipOpen('a')

      expect(shouldSkipTooltipDelay(1000)).toBe(true)
    })
  })

  describe('when a tooltip closed less than 300ms ago', () => {
    it('then the delay is skipped, then kept after 300ms', () => {
      markTooltipOpen('a')
      markTooltipClosed('a', 1000)

      expect(shouldSkipTooltipDelay(1200)).toBe(true)
      expect(shouldSkipTooltipDelay(1300)).toBe(false)
    })
  })

  describe('when a tooltip that was not open closes', () => {
    it('then the group is unchanged', () => {
      markTooltipClosed('a', 1000)

      expect(shouldSkipTooltipDelay(1100)).toBe(false)
    })
  })

  describe('when an open tooltip is forgotten', () => {
    it('then it does not start the grouped delay', () => {
      markTooltipOpen('a')
      forgetTooltip('a')

      expect(shouldSkipTooltipDelay(Date.now() + 10)).toBe(false)
    })
  })
})
