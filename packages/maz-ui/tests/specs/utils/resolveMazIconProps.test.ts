import { defineComponent, h } from 'vue'
import { resolveMazIconProps } from '@/utils/resolveMazIconProps'

const RAW_SVG = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'

const ComponentIcon = defineComponent({
  name: 'ComponentIcon',
  render: () => h('svg'),
})

describe('given resolveMazIconProps', () => {
  describe('when called with a component and defaults', () => {
    it('then it returns the merged props, decorative by default', () => {
      expect(resolveMazIconProps(ComponentIcon, { size: '1rem' })).toEqual({
        'size': '1rem',
        'icon': ComponentIcon,
        'aria-hidden': true,
      })
    })
  })

  describe('when called with an empty or invalid value', () => {
    it('then it returns undefined', () => {
      expect(resolveMazIconProps(undefined)).toBeUndefined()
      expect(resolveMazIconProps({ size: 'sm' } as never)).toBeUndefined()
    })
  })

  describe('when called with a titled icon or as non decorative', () => {
    it('then it is not hidden from assistive technologies', () => {
      expect(resolveMazIconProps({ icon: RAW_SVG, title: 'Close' })?.['aria-hidden']).toBeUndefined()
      expect(resolveMazIconProps(RAW_SVG, undefined, { decorative: false })?.['aria-hidden']).toBeUndefined()
    })
  })
})
