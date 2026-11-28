import {
  dampSwipe,
  getStackLayout,
  getSwipeVelocity,
  getToastStack,
  getToastStackLayout,
  isToastStackExpanded,
  registerToast,
  setToastHeight,
  setToastStackFlag,
  shouldDismissSwipe,
  unregisterToast,
} from '@plugins/toast/stack.ts'

describe('given getStackLayout', () => {
  describe('when the stack is collapsed at the bottom', () => {
    const layout = getStackLayout([60, 60, 60, 60, 60], { inward: -1, expanded: false })

    it('then the front toast stays in place at full scale', () => {
      expect(layout[0]).toMatchObject({ y: 0, scale: 1, opacity: 1, behind: false, hidden: false })
    })

    it('then the toasts behind go up, smaller by depth', () => {
      expect(layout[1].scale).toBeCloseTo(0.95)
      expect(layout[2].scale).toBeCloseTo(0.9)
      expect(layout[1].y).toBeCloseTo(-(60 * 0.05 + 14))
      expect(layout[2].y).toBeCloseTo(-(60 * 0.1 + 28))
      expect(layout[1].behind).toBe(true)
    })

    it('then the toasts past the third are hidden but kept', () => {
      expect(layout).toHaveLength(5)
      expect(layout[2].hidden).toBe(false)
      expect(layout[3]).toMatchObject({ hidden: true, opacity: 0 })
      expect(layout[4]).toMatchObject({ hidden: true, opacity: 0 })
    })

    it('then the newest toast has the highest z-index', () => {
      expect(layout.map(item => item.zIndex)).toEqual([5, 4, 3, 2, 1])
    })
  })

  describe('when the stack is collapsed at the top', () => {
    it('then the toasts behind go down', () => {
      const layout = getStackLayout([60, 60], { inward: 1, expanded: false })

      expect(layout[1].y).toBeGreaterThan(0)
    })
  })

  describe('when the toasts have different heights', () => {
    it('then the front height drives the stack and the taller toasts are clipped', () => {
      const layout = getStackLayout([40, 100, 30], { inward: -1, expanded: false })

      expect(layout[1].y).toBeCloseTo(-(40 * 0.05 + 14))
      expect(layout[1].clip).toBe(60)
      expect(layout[2].clip).toBe(-16)
    })
  })

  describe('when the stack is expanded', () => {
    it('then the toasts are spread by the cumulative heights', () => {
      const layout = getStackLayout([40, 100, 30], { inward: -1, expanded: true })

      expect(layout.map(item => item.y)).toEqual([0, -40, -140])
      expect(layout.every(item => item.scale === 1 && item.opacity === 1 && !item.behind)).toBe(true)
    })

    it('then the toasts go down from the top', () => {
      const layout = getStackLayout([40, 100], { inward: 1, expanded: true })

      expect(layout[1].y).toBe(40)
    })
  })

  describe('when there is no toast', () => {
    it('then the layout is empty', () => {
      expect(getStackLayout([], { inward: -1, expanded: false })).toEqual([])
    })
  })
})

describe('given the swipe helpers', () => {
  describe('when the distance is below the threshold without speed', () => {
    it('then the toast is not dismissed', () => {
      expect(shouldDismissSwipe({ distance: 50, velocity: 0.01, size: 352 })).toBe(false)
    })
  })

  describe('when the distance reaches the threshold', () => {
    it('then the toast is dismissed', () => {
      expect(shouldDismissSwipe({ distance: 100, velocity: 0, size: 352 })).toBe(true)
      expect(shouldDismissSwipe({ distance: 40, velocity: 0, size: 100 })).toBe(true)
    })
  })

  describe('when the gesture is a flick', () => {
    it('then a short distance is enough', () => {
      expect(shouldDismissSwipe({ distance: 20, velocity: 0.5, size: 352 })).toBe(true)
    })

    it('then a tiny distance is not enough', () => {
      expect(shouldDismissSwipe({ distance: 5, velocity: 0.5, size: 352 })).toBe(false)
    })
  })

  describe('when the drag goes towards the inside', () => {
    it('then the toast is never dismissed', () => {
      expect(shouldDismissSwipe({ distance: -200, velocity: 1, size: 352 })).toBe(false)
    })

    it('then the offset is damped', () => {
      expect(dampSwipe(-100, 1)).toBe(-20)
      expect(dampSwipe(100, 1)).toBe(100)
      expect(dampSwipe(-100, -1)).toBe(-100)
    })
  })

  describe('when computing the velocity', () => {
    it('then it is the distance by millisecond', () => {
      expect(getSwipeVelocity(-50, 100)).toBe(0.5)
      expect(getSwipeVelocity(50, 0)).toBe(0)
    })
  })
})

describe('given the toast stacks', () => {
  afterEach(() => {
    unregisterToast('top', 1)
    unregisterToast('top', 2)
  })

  describe('when toasts are registered', () => {
    it('then the newest is first and the layout follows the registry', () => {
      registerToast('top', { id: 1, height: 50, stacked: true })
      registerToast('top', { id: 2, height: 50, stacked: true })

      expect(getToastStack('top')?.entries.map(entry => entry.id)).toEqual([2, 1])
      expect(getToastStackLayout('top', 2, 1)?.behind).toBe(false)
      expect(getToastStackLayout('top', 1, 1)?.behind).toBe(true)
    })

    it('then a height update moves the toasts', () => {
      registerToast('top', { id: 1, height: 50, stacked: true })
      registerToast('top', { id: 2, height: 50, stacked: true })
      setToastStackFlag('top', 'hovered', true)
      setToastHeight('top', 2, 80)

      expect(getToastStackLayout('top', 1, 1)?.y).toBe(80)
    })
  })

  describe('when the stack is hovered, focused or pinned', () => {
    it.each(['hovered', 'focused', 'pinned'] as const)('then it is expanded when %s', (flag) => {
      registerToast('top', { id: 1, height: 50, stacked: true })

      expect(isToastStackExpanded(getToastStack('top'))).toBe(false)

      setToastStackFlag('top', flag, true)

      expect(isToastStackExpanded(getToastStack('top'))).toBe(true)
    })
  })

  describe('when a toast is not stacked', () => {
    it('then the whole position is a list', () => {
      registerToast('top', { id: 1, height: 50, stacked: true })
      registerToast('top', { id: 2, height: 50, stacked: false })

      expect(isToastStackExpanded(getToastStack('top'))).toBe(true)
      expect(getToastStackLayout('top', 1, 1)?.behind).toBe(false)
    })
  })

  describe('when the last toast leaves', () => {
    it('then the stack is removed', () => {
      registerToast('top', { id: 1, height: 50, stacked: true })
      unregisterToast('top', 1)

      expect(getToastStack('top')).toBeUndefined()
      expect(getToastStackLayout('top', 1, 1)).toBeUndefined()
      expect(isToastStackExpanded(undefined)).toBe(true)
    })
  })

  describe('when the toast is unknown', () => {
    it('then it has no layout', () => {
      registerToast('top', { id: 1, height: 50, stacked: true })

      expect(getToastStackLayout('top', 99, 1)).toBeUndefined()
    })
  })
})
