import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { registerIcon, registerIconLoader } from '../../registry.ts'
import { hasIcon, MazIconLoading, MazIconPrimitive } from '../MazIconPrimitive.ts'

const STAR = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg>'

function render(props: Record<string, unknown>) {
  return renderToString(h(MazIconPrimitive, props as { icon: string }))
}

beforeAll(() => {
  registerIcon('test-star', STAR)
  registerIcon('test-invalid', 'not a svg')
})

describe('given a registered name', () => {
  describe('when it is rendered', () => {
    it('then its svg is the root, 1em and decorative', async () => {
      expect(await render({ icon: 'test-star' })).toBe('<svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg>')
    })
  })

  describe('when it is rendered with a class, a title, the size of its file and attributes', () => {
    it('then the svg has them, and is an image named by its title', async () => {
      const html = await render({
        icon: 'test-star',
        class: 'size-6',
        title: 'Star',
        width: false,
        height: false,
        svgAttributes: { 'data-id': 1 },
      })

      expect(html).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" data-id="1" role="img" aria-label="Star" class="size-6"><title>Star</title><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg>')
    })
  })

  describe('when it is rendered with an aria-label and a title', () => {
    it('then it is an image named by its aria-label, not hidden', async () => {
      const html = await render({
        'icon': 'test-star',
        'title': 'Star',
        'aria-label': 'Favorite',
      })

      expect(html).toContain('role="img" aria-label="Favorite"')
      expect(html.match(/aria-label=/g)).toHaveLength(1)
      expect(html).not.toContain('aria-hidden')
    })
  })

  describe('when it is rendered with a label in its svg attributes', () => {
    it('then it is an image named by it', async () => {
      const html = await render({
        icon: 'test-star',
        title: 'Star',
        svgAttributes: { 'aria-labelledby': 'label' },
      })

      expect(html).toContain('aria-labelledby="label" role="img"')
      expect(html).not.toContain('aria-label=')
    })
  })

  describe('when it is rendered with aria-hidden false and no name', () => {
    it('then the parent decides', async () => {
      const html = await render({
        'icon': 'test-star',
        'aria-hidden': 'false',
      })

      expect(html).toContain('aria-hidden="false"')
      expect(html).not.toContain('role=')
    })
  })

  describe('when the parent removes its accessibility attributes', () => {
    it('then the svg has none', async () => {
      const html = await render({
        'icon': 'test-star',
        'title': 'Star',
        'role': null,
        'aria-hidden': null,
        'aria-label': null,
      })

      expect(html).not.toContain('role=')
      expect(html).not.toContain('aria-hidden')
      expect(html).not.toContain('aria-label')
      expect(html).toContain('<title>Star</title>')
    })
  })

  describe('when it is rendered with a width only', () => {
    it('then the svg has the width, and its height follows the ratio', async () => {
      const html = await render({ icon: 'test-star', width: 48 })

      expect(html).toContain('<svg width="48" xmlns')
      expect(html).not.toContain('height=')
    })
  })

  describe('when it is rendered with a height only', () => {
    it('then the svg has the height, and its width follows the ratio', async () => {
      const html = await render({ icon: 'test-star', height: '2rem', width: false })

      expect(html).toContain('<svg height="2rem" xmlns')
      expect(html).not.toContain('width=')
    })
  })

  describe('when its SVG is not valid', () => {
    it('then nothing is rendered', async () => {
      expect(await render({ icon: 'test-invalid' })).toBe('<!---->')
    })
  })

  describe('when its registration is checked', () => {
    it('then it is registered, an unknown name is not', () => {
      expect(hasIcon('test-star')).toBe(true)
      expect(hasIcon('test-unknown')).toBe(false)
    })
  })
})

describe('given an unknown name', () => {
  describe('when it is rendered twice in dev', () => {
    it('then a visible placeholder is rendered, with a single warning', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const html = await render({ icon: 'test-missing' })
      await render({
        icon: 'test-missing',
        width: 32,
        height: 32,
      })

      expect(html).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2" width="1em" height="1em" role="img" data-unknown-icon="test-missing"><title>Unknown icon &quot;test-missing&quot;</title><rect x="3" y="3" width="18" height="18" rx="2"></rect></svg>')
      expect(warn).toHaveBeenCalledExactlyOnceWith('[maz-ui:icons] Unknown icon "test-missing": add MazUiIcons() of @maz-ui/icons/vite (included in MazUi() of @maz-ui/vite-plugin and @maz-ui/nuxt), or register it with registerIcon() of @maz-ui/icons/registry')
      warn.mockRestore()
    })
  })

  describe('when it is rendered with a size in dev', () => {
    it('then the placeholder has them', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})

      expect(await render({
        icon: 'test-missing-sized',
        width: 32,
        height: 32,
      })).toContain('width="32" height="32"')
      vi.restoreAllMocks()
    })
  })

  describe('when it is rendered in production', () => {
    it('then nothing is rendered, without a warning', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      const warn = vi.spyOn(console, 'warn')

      expect(await render({ icon: 'test-missing-production' })).toBe('<!---->')
      expect(warn).not.toHaveBeenCalled()
      vi.unstubAllEnvs()
      warn.mockRestore()
    })
  })
})

describe('given a name of a lazy folder', () => {
  describe('when it is rendered on the server', () => {
    it('then its SVG is loaded and rendered, with the attributes of the parent once', async () => {
      const loader = vi.fn(() => Promise.resolve({ default: STAR }))
      registerIconLoader('test-lazy', loader)

      expect(hasIcon('test-lazy')).toBe(true)
      expect(await renderToString(h(MazIconPrimitive, { icon: 'test-lazy', title: 'Star', class: 'size-6' }))).toBe('<svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Star" class="size-6"><title>Star</title><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/></svg>')
      expect(loader).toHaveBeenCalledOnce()
    })
  })

  describe('when it is rendered twice before its load', () => {
    it('then its SVG is loaded once', async () => {
      const loader = vi.fn(() => Promise.resolve(STAR))
      registerIconLoader('test-lazy-twice', loader)

      const html = await renderToString(h('div', [h(MazIconPrimitive, { icon: 'test-lazy-twice' }), h(MazIconPrimitive, { icon: 'test-lazy-twice' })]))

      expect(html.match(/<svg/g)).toHaveLength(2)
      expect(loader).toHaveBeenCalledOnce()
    })
  })

  describe('when its loader returns a module without a SVG', () => {
    it('then nothing is rendered', async () => {
      registerIconLoader('test-lazy-empty', () => Promise.resolve({} as { default: string }))

      expect(await renderToString(h(MazIconPrimitive, { icon: 'test-lazy-empty' }))).toBe('<!---->')
    })
  })

  describe('when its loader fails on the server', () => {
    it('then nothing is rendered, with a warning', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      registerIconLoader('test-lazy-failing', () => Promise.reject(new Error('offline')))

      expect(await renderToString(h(MazIconPrimitive, { icon: 'test-lazy-failing' }))).toBe('<!---->')
      expect(warn).toHaveBeenCalledWith('[maz-ui:icons] The icon "test-lazy-failing" could not be loaded', expect.any(Error))
      warn.mockRestore()
    })
  })

  describe('when it is loading', () => {
    it('then an empty svg of its size takes its place, hidden', async () => {
      expect(await renderToString(h(MazIconLoading, { icon: 'test-lazy', width: 32 }))).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" aria-hidden="true" data-loading-icon="test-lazy"></svg>')
      expect(await renderToString(h(MazIconLoading, { icon: 'test-lazy' }))).toContain('width="1em" height="1em"')
    })
  })
})

describe('given a name written with a ~', () => {
  describe('when its SVG is registered', () => {
    it('then it is rendered at once', async () => {
      expect(hasIcon('~test-star')).toBe(true)
      expect(await render({ icon: '~test-star' })).toBe(await render({ icon: 'test-star' }))
    })
  })

  describe('when it has a loader', () => {
    it('then its SVG is loaded and rendered', async () => {
      const loader = vi.fn(() => Promise.resolve({ default: STAR }))
      registerIconLoader('test-tilde', loader)

      expect(hasIcon('~test-tilde')).toBe(true)
      expect(await render({ icon: '~test-tilde' })).toContain('<path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/>')
      expect(loader).toHaveBeenCalledOnce()
    })
  })

  describe('when it is unknown', () => {
    it('then it is not an icon', () => {
      expect(hasIcon('~test-unknown')).toBe(false)
    })
  })
})
