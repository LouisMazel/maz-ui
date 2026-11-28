import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { EXTERNAL_LINKS_INJECTION_KEY, isExternalByDefault, useExternalLinks } from '@/utils/externalLinks.ts'

function setup(provided?: Record<string, unknown>) {
  let api!: ReturnType<typeof useExternalLinks>
  const Comp = defineComponent({
    setup() {
      api = useExternalLinks()
      return () => h('div')
    },
  })

  mount(Comp, { global: { provide: provided ? { [EXTERNAL_LINKS_INJECTION_KEY as symbol]: provided } : {} } })

  return api
}

function clickEvent() {
  return new MouseEvent('click', { cancelable: true })
}

describe('given the default external rule', () => {
  describe('when the origin is the one of the page', () => {
    it('then a link of the same origin is internal', () => {
      expect(isExternalByDefault(`${globalThis.location.origin}/docs`, undefined, globalThis.location.origin)).toBe(false)
    })

    it('then without origin, as on the server, an absolute link is external', () => {
      expect(isExternalByDefault(`${globalThis.location.origin}/docs`)).toBe(true)
    })

    it('then a relative link is internal', () => {
      expect(isExternalByDefault('/docs')).toBe(false)
      expect(isExternalByDefault('#anchor')).toBe(false)
    })

    it('then mailto and tel links are internal', () => {
      expect(isExternalByDefault('mailto:a@b.c')).toBe(false)
    })
  })

  describe('when the link has another origin', () => {
    it('then an absolute http(s) URL is external', () => {
      expect(isExternalByDefault('https://example.com/page')).toBe(true)
    })
  })

  describe('when the target is _blank', () => {
    it('then a relative link is external', () => {
      expect(isExternalByDefault('/docs', '_blank')).toBe(true)
    })
  })

  describe('when the URL is malformed', () => {
    it('then it is internal', () => {
      expect(isExternalByDefault('http://')).toBe(false)
    })
  })
})

describe('given useExternalLinks without options', () => {
  describe('when a link is clicked', () => {
    it('then only target _blank is external and the click is untouched', () => {
      const { isExternal, onLinkClick } = setup()
      const event = clickEvent()

      onLinkClick(event, 'https://example.com')

      expect(isExternal('https://example.com')).toBe(false)
      expect(isExternal('https://example.com', '_blank')).toBe(true)
      expect(isExternal(undefined, '_blank')).toBe(true)
      expect(event.defaultPrevented).toBe(false)
    })
  })
})

describe('given useExternalLinks with openExternal', () => {
  describe('when an external link is clicked', () => {
    it('then the navigation is prevented and the callback is called', () => {
      const openExternal = vi.fn()
      const { onLinkClick } = setup({ openExternal })
      const event = clickEvent()

      onLinkClick(event, 'https://example.com')

      expect(event.defaultPrevented).toBe(true)
      expect(openExternal).toHaveBeenCalledWith('https://example.com', event)
    })
  })

  describe('when an internal link is clicked', () => {
    it('then the callback is not called', () => {
      const openExternal = vi.fn()
      const { onLinkClick } = setup({ openExternal })
      const event = clickEvent()

      onLinkClick(event, '/docs')

      expect(event.defaultPrevented).toBe(false)
      expect(openExternal).not.toHaveBeenCalled()
    })
  })

  describe('when the click is already prevented or has no href', () => {
    it('then the callback is not called', () => {
      const openExternal = vi.fn()
      const { onLinkClick } = setup({ openExternal })
      const prevented = clickEvent()
      prevented.preventDefault()

      onLinkClick(prevented, 'https://example.com')
      onLinkClick(clickEvent(), undefined)

      expect(openExternal).not.toHaveBeenCalled()
    })
  })
})

describe('given useExternalLinks with openExternal and the default rule', () => {
  describe('when the component is mounted', () => {
    it('then an absolute link of the page origin is internal', () => {
      const { isExternal } = setup({ openExternal: vi.fn() })

      expect(isExternal(`${globalThis.location.origin}/docs`)).toBe(false)
      expect(isExternal('https://example.com')).toBe(true)
    })
  })
})

describe('given useExternalLinks with isExternalLink', () => {
  describe('when the rule is overridden', () => {
    it('then it decides which links are external, icon included', () => {
      const openExternal = vi.fn()
      const { isExternal, onLinkClick } = setup({ openExternal, isExternalLink: href => href.startsWith('/out') })
      const event = clickEvent()

      onLinkClick(event, '/out/a')

      expect(isExternal('/out/a')).toBe(true)
      expect(isExternal('https://example.com')).toBe(false)
      expect(openExternal).toHaveBeenCalledOnce()
    })
  })

  describe('when only the rule is set', () => {
    it('then the icon follows it and no click is handled', () => {
      const { isExternal, onLinkClick } = setup({ isExternalLink: () => true })
      const event = clickEvent()

      onLinkClick(event, 'https://example.com')

      expect(isExternal('/a')).toBe(true)
      expect(event.defaultPrevented).toBe(false)
    })
  })
})
