import { useMazIconProps } from '@composables/useMazIconProps'
import { defineComponent, h, ref } from 'vue'

const RAW_SVG = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'

const ComponentIcon = defineComponent({
  name: 'ComponentIcon',
  render: () => h('svg'),
})

describe('useMazIconProps', () => {
  describe('when called with a falsy value', () => {
    it('returns undefined for null', () => {
      const { iconProps } = useMazIconProps(() => null as never)
      expect(iconProps.value).toBeUndefined()
    })

    it('returns undefined for undefined', () => {
      const { iconProps } = useMazIconProps(() => undefined)
      expect(iconProps.value).toBeUndefined()
    })

    it('returns undefined for false', () => {
      const { iconProps } = useMazIconProps(() => false)
      expect(iconProps.value).toBeUndefined()
    })

    it('returns undefined for an empty string', () => {
      const { iconProps } = useMazIconProps(() => '')
      expect(iconProps.value).toBeUndefined()
    })
  })

  describe('when called with a bare icon value', () => {
    it('wraps a raw SVG string into a props object with default a11y', () => {
      const { iconProps } = useMazIconProps(() => RAW_SVG)
      expect(iconProps.value).toEqual({ 'aria-hidden': true, 'icon': RAW_SVG })
    })

    it('wraps a URL string', () => {
      const { iconProps } = useMazIconProps(() => '/icons/star.svg')
      expect(iconProps.value).toEqual({ 'aria-hidden': true, 'icon': '/icons/star.svg' })
    })

    it('wraps a Vue component', () => {
      const { iconProps } = useMazIconProps(() => ComponentIcon as never)
      expect(iconProps.value?.icon).toBe(ComponentIcon)
      expect(iconProps.value?.['aria-hidden']).toBe(true)
    })
  })

  describe('when called with a full MazIconProps object', () => {
    it('passes through size, title, svgAttributes, fallback and flipIconForRtl', () => {
      const { iconProps } = useMazIconProps(() => ({
        icon: RAW_SVG,
        size: 'lg',
        title: 'Star',
        svgAttributes: { 'data-testid': 'x' },
        flipIconForRtl: true,
      }))

      expect(iconProps.value).toMatchObject({
        'aria-hidden': true,
        'icon': RAW_SVG,
        'size': 'lg',
        'title': 'Star',
        'svgAttributes': { 'data-testid': 'x' },
        'flipIconForRtl': true,
      })
    })

    it('returns undefined when the props object has no icon', () => {
      const { iconProps } = useMazIconProps(() => ({ size: 'lg' } as never))
      expect(iconProps.value).toBeUndefined()
    })

    it('returns undefined when the props object icon is falsy', () => {
      const { iconProps } = useMazIconProps(() => ({ icon: undefined as unknown as string }))
      expect(iconProps.value).toBeUndefined()
    })
  })

  describe('default props merging', () => {
    it('applies defaults under the user props', () => {
      const { iconProps } = useMazIconProps(() => RAW_SVG, () => ({ size: 'sm' }))
      expect(iconProps.value?.size).toBe('sm')
    })

    it('lets user props override the defaults', () => {
      const { iconProps } = useMazIconProps(
        () => ({ icon: RAW_SVG, size: 'xl' }),
        () => ({ size: 'sm' }),
      )
      expect(iconProps.value?.size).toBe('xl')
    })
  })

  describe('decorative option', () => {
    it('omits aria-hidden when decorative is false', () => {
      const { iconProps } = useMazIconProps(() => RAW_SVG, undefined, { decorative: false })
      expect(iconProps.value?.['aria-hidden']).toBeUndefined()
    })

    it('keeps aria-hidden by default', () => {
      const { iconProps } = useMazIconProps(() => RAW_SVG)
      expect(iconProps.value?.['aria-hidden']).toBe(true)
    })
  })

  describe('reactivity', () => {
    it('reacts to ref-based input', () => {
      const source = ref<string | undefined>(undefined)
      const { iconProps } = useMazIconProps(source)

      expect(iconProps.value).toBeUndefined()
      source.value = '/icons/star.svg'
      expect(iconProps.value?.icon).toBe('/icons/star.svg')
    })

    it('reacts when defaults change', () => {
      const sizeRef = ref<'sm' | 'lg'>('sm')
      const { iconProps } = useMazIconProps(
        () => RAW_SVG,
        () => ({ size: sizeRef.value }),
      )

      expect(iconProps.value?.size).toBe('sm')
      sizeRef.value = 'lg'
      expect(iconProps.value?.size).toBe('lg')
    })
  })
})
