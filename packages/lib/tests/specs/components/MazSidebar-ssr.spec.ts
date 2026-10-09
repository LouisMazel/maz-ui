import MazSidebar from '@components/MazSidebar.vue'
import { mount } from '@vue/test-utils'

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => true),
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    useSSRContext: vi.fn(),
  }
})

const { useSSRContext } = await import('vue')

describe('given MazSidebar component running on the server', () => {
  describe('when the SSR context exposes a Node H3 event with a cookie', () => {
    it('then the initial open state reflects the request cookie', () => {
      vi.mocked(useSSRContext).mockReturnValue({
        event: { node: { req: { headers: { cookie: 'maz-sidebar-open=false' } } } },
      } as never)

      const wrapper = mount(MazSidebar, { props: { open: true } })

      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })
  })

  describe('when the SSR context exposes a Web H3 event with a Headers object', () => {
    it('then the initial open state reflects the request cookie', () => {
      vi.mocked(useSSRContext).mockReturnValue({
        event: { headers: { get: (name: string) => name === 'cookie' ? 'maz-sidebar-open=false' : null } },
      } as never)

      const wrapper = mount(MazSidebar, { props: { open: true } })

      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })
  })

  describe('when the SSR context exposes a vue-server-renderer request shape', () => {
    it('then the initial open state reflects the request cookie', () => {
      vi.mocked(useSSRContext).mockReturnValue({
        req: { headers: { cookie: 'maz-sidebar-open=false' } },
      } as never)

      const wrapper = mount(MazSidebar, { props: { open: true } })

      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })
  })

  describe('when no SSR context is available', () => {
    it('then it falls back to the prop default without throwing', () => {
      vi.mocked(useSSRContext).mockImplementation(() => {
        throw new Error('No active SSR context')
      })

      const wrapper = mount(MazSidebar, { props: { open: true } })

      expect(wrapper.find('aside').classes()).toContain('--expanded')
    })
  })

  describe('when the request has no Cookie header', () => {
    it('then it falls back to the prop default', () => {
      vi.mocked(useSSRContext).mockReturnValue({
        event: { node: { req: { headers: {} } } },
      } as never)

      const wrapper = mount(MazSidebar, { props: { open: true } })

      expect(wrapper.find('aside').classes()).toContain('--expanded')
    })
  })
})
