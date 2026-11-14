import MazProgressBar from '@components/MazProgressBar.vue'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'

function parts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.m-progress-bar__part').map(part => part.attributes('style'))
}

describe('given MazProgressBar component', () => {
  describe('when it has a value and a max', () => {
    it('then it fills its share of the bar and exposes the progress', () => {
      const wrapper = mount(MazProgressBar, {
        props: { value: 3, max: 5, label: 'Projects up to date' },
      })

      expect(wrapper.attributes('role')).toBe('progressbar')
      expect(wrapper.attributes('aria-valuenow')).toBe('3')
      expect(wrapper.attributes('aria-valuemax')).toBe('5')
      expect(parts(wrapper)).toEqual([
        expect.stringContaining('flex: 60 1 0%'),
      ])
      expect(wrapper.find('.m-progress-bar__rest').attributes('style')).toContain('flex: 40 1 0%')
      expect(parts(wrapper)[0]).toContain('background-color: var(--maz-primary)')
    })
  })

  describe('when the value is out of range or invalid', () => {
    it('then it is clamped between empty and full', () => {
      expect(parts(mount(MazProgressBar, {
        props: { value: 150 },
      }))).toEqual([
        expect.stringContaining('flex: 100 1 0%'),
      ])
      expect(parts(mount(MazProgressBar, {
        props: { value: -4 },
      }))).toEqual([])
      expect(parts(mount(MazProgressBar, {
        props: { value: Number.NaN },
      }))).toEqual([])
    })
  })

  describe('when it has segments without max', () => {
    it('then the segments share the full bar and describe themselves', () => {
      const wrapper = mount(MazProgressBar, {
        props: {
          segments: [
            { value: 6, color: 'info', label: 'patch' },
            { value: 2, label: 'minor' },
            { value: 2, color: 'accent', label: 'major' },
          ],
          role: 'meter',
          gap: true,
        },
      })

      expect(wrapper.attributes('role')).toBe('meter')
      expect(wrapper.attributes('aria-valuetext')).toBe('6 patch, 2 minor, 2 major')
      expect(parts(wrapper)).toEqual([
        expect.stringContaining('flex: 60 1 0%'),
        expect.stringContaining('flex: 20 1 0%'),
        expect.stringContaining('flex: 20 1 0%'),
      ])
      expect(parts(wrapper)[1]).toContain('var(--maz-primary)')
      expect(wrapper.find('.m-progress-bar__rest').exists()).toBe(false)
      expect(wrapper.classes()).toContain('maz:gap-0.5')
    })
  })

  describe('when it has segments and a max', () => {
    it('then the segments only fill their share', () => {
      const wrapper = mount(MazProgressBar, {
        props: {
          segments: [
            { value: 10 },
            { value: 15 },
          ],
          max: 100,
        },
      })

      expect(parts(wrapper)).toEqual([
        expect.stringContaining('flex: 10 1 0%'),
        expect.stringContaining('flex: 15 1 0%'),
      ])
      expect(wrapper.attributes('aria-valuenow')).toBe('25')
    })
  })

  describe('when it has a size, a rounded size and a value text', () => {
    it('then it applies them', () => {
      const wrapper = mount(MazProgressBar, {
        props: {
          value: 1,
          max: 4,
          size: 'lg',
          roundedSize: 'none',
          valueText: '1 of 4 projects',
        },
      })

      expect(wrapper.classes()).toContain('maz:h-3')
      expect(wrapper.classes()).not.toContain('maz:rounded-full')
      expect(wrapper.attributes('aria-valuetext')).toBe('1 of 4 projects')
    })
  })

  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', async () => {
      const wrapper = mount(MazProgressBar, {
        props: { value: 2, max: 3, label: 'Upload' },
        attachTo: document.body,
      })

      expect(await runAxe(wrapper)).toHaveNoViolations()
      wrapper.unmount()
    })
  })
})
