import MazDialog from '@components/MazDialog.vue'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

const wrappers: ReturnType<typeof mount>[] = []

function getWrapper(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  const wrapper = mount(MazDialog, {
    props: { modelValue: false, title: 'Title', ...props },
    slots: { default: '<p>Body</p>', ...slots } as never,
    attachTo: document.body,
    global: { stubs: { transition: false, teleport: false } },
  })
  wrappers.push(wrapper)

  return wrapper
}

describe('given a dialog with a trigger slot', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  })

  afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('when open is called while the dialog is already open', () => {
    it('then the model update is emitted once', async () => {
      const wrapper = getWrapper({}, {
        trigger: ({ open }: { open: () => void }) => h('button', { class: 'my-trigger', onClick: open }, 'Open'),
      })

      await wrapper.find('.my-trigger').trigger('click')
      await wrapper.find('.my-trigger').trigger('click')

      expect(wrapper.emitted('update:model-value')).toHaveLength(1)
    })
  })

  describe('when close is called from the trigger slot', () => {
    it('then the dialog is closed', async () => {
      const wrapper = getWrapper({ modelValue: true }, {
        trigger: ({ close }: { close: () => void }) => h('button', { class: 'my-close', onClick: close }, 'Close'),
      })

      await wrapper.find('.my-close').trigger('click')
      await vi.advanceTimersByTimeAsync(500)

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([false])
    })
  })
})

describe('given a scrollable dialog', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  })

  afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    vi.useRealTimers()
    vi.unstubAllGlobals()
    delete (Element.prototype as Partial<Element>).scrollTo
  })

  describe('when it opens', () => {
    it('then its content is scrolled back to the top', async () => {
      const scrollTo = vi.fn()
      Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
      const wrapper = getWrapper({ scrollable: true })

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await vi.advanceTimersByTimeAsync(10)

      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    })
  })

  describe('when it closes', () => {
    it('then the content is not scrolled', async () => {
      const scrollTo = vi.fn()
      Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
      const wrapper = getWrapper({ scrollable: true, modelValue: true })

      await wrapper.setProps({ modelValue: false })
      await nextTick()
      await vi.advanceTimersByTimeAsync(10)

      expect(scrollTo).not.toHaveBeenCalled()
    })
  })
})
