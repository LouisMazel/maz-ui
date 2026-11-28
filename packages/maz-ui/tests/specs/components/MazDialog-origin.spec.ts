import MazDialog from '@components/MazDialog.vue'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

interface FakeAnimation {
  keyframes: Keyframe[]
  onfinish: (() => void) | null
  oncancel: (() => void) | null
  cancel: ReturnType<typeof vi.fn>
}

const animations: FakeAnimation[] = []

function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect
}

const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

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

const dialogElement = () => document.querySelector('.m-dialog') as HTMLElement | null

describe('given a dialog', () => {
  beforeEach(() => {
    animations.length = 0
    Object.defineProperty(globalThis, 'innerWidth', { value: 1000, configurable: true })
    Object.defineProperty(globalThis, 'innerHeight', { value: 800, configurable: true })
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
    HTMLElement.prototype.getBoundingClientRect = vi.fn(() => rect(300, 200, 500, 400))
    Element.prototype.animate = vi.fn((keyframes: Keyframe[]) => {
      const animation: FakeAnimation = { keyframes, onfinish: null, oncancel: null, cancel: vi.fn() }
      animations.push(animation)

      return animation as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
  })

  afterEach(() => {
    delete (HTMLElement.prototype as Partial<HTMLElement>).getBoundingClientRect
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  describe('when it has a trigger slot', () => {
    it('then it renders the trigger with open, close and isOpen', () => {
      const slot = vi.fn(() => h('button', { class: 'my-trigger' }, 'Open'))
      const wrapper = getWrapper({}, { trigger: slot })

      expect(wrapper.find('.my-trigger').exists()).toBe(true)
      expect(slot).toHaveBeenCalledWith(expect.objectContaining({ isOpen: false, open: expect.any(Function), close: expect.any(Function) }))
    })

    it('then open shows the dialog and emits the model update', async () => {
      const wrapper = getWrapper({}, {
        trigger: ({ open }: { open: () => void }) => h('button', { class: 'my-trigger', onClick: open }, 'Open'),
      })

      expect(dialogElement()).toBeNull()

      await wrapper.find('.my-trigger').trigger('click')
      await nextTick()

      expect(dialogElement()).not.toBeNull()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([true])
    })

    it('then the dialog grows from the trigger element', async () => {
      const wrapper = getWrapper({}, {
        trigger: ({ open }: { open: () => void }) => h('button', { class: 'my-trigger', onClick: open }, 'Open'),
      })
      const trigger = wrapper.find('.my-trigger').element as HTMLElement
      trigger.getBoundingClientRect = vi.fn(() => rect(100, 100, 50, 20))

      await wrapper.find('.my-trigger').trigger('click')
      await nextTick()

      expect(animations).toHaveLength(1)
      expect(animations[0]?.keyframes[0]).toMatchObject({
        transform: 'translate(-200px, -100px) scale(0.1, 0.05)',
        opacity: '0',
      })
    })

    it('then isOpen follows the dialog', async () => {
      const slot = vi.fn(({ open }: { open: () => void }) => h('button', { class: 'my-trigger', onClick: open }, 'Open'))
      const wrapper = getWrapper({}, { trigger: slot })

      await wrapper.find('.my-trigger').trigger('click')
      await nextTick()

      expect(slot).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }))
    })

    it('then the model value opens it too', async () => {
      const wrapper = getWrapper({}, { trigger: () => h('button', 'Open') })

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(dialogElement()).not.toBeNull()
    })
  })

  describe('when it has no trigger slot', () => {
    it('then it renders no trigger wrapper', () => {
      const wrapper = getWrapper()

      expect(wrapper.find('.m-dialog-trigger').exists()).toBe(false)
    })
  })

  describe('when the origin prop is given', () => {
    it('then the dialog grows from the point', async () => {
      const wrapper = getWrapper({ origin: { x: 200, y: 300 } })

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(animations[0]?.keyframes[0]).toMatchObject({ transform: 'scale(0.05)', opacity: '0' })
    })

    it('then the origin prop wins over the trigger', async () => {
      const wrapper = getWrapper({ origin: { x: 200, y: 300 } }, {
        trigger: ({ open }: { open: () => void }) => h('button', { class: 'my-trigger', onClick: open }, 'Open'),
      })

      await wrapper.find('.my-trigger').trigger('click')
      await nextTick()

      expect(animations[0]?.keyframes[0]).toMatchObject({ transform: 'scale(0.05)' })
    })
  })

  describe('when there is no origin', () => {
    it('then the dialog fades and scales slightly', async () => {
      const wrapper = getWrapper()

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(animations[0]?.keyframes[0]).toMatchObject({ transform: 'scale(0.97)', opacity: '0' })
    })
  })

  describe('when animated is false', () => {
    it('then the dialog does not move', async () => {
      const wrapper = getWrapper({ animated: false, origin: { x: 200, y: 300 } })

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(dialogElement()).not.toBeNull()
      expect(animations).toHaveLength(0)
    })
  })

  describe('when it closes', () => {
    it('then it goes back to the origin and emits close at the end', async () => {
      const wrapper = getWrapper({ modelValue: true, origin: { x: 200, y: 300 } })
      animations[0]?.onfinish?.()
      await nextTick()

      await wrapper.setProps({ modelValue: false })

      expect(animations[1]?.keyframes.at(-1)).toMatchObject({ transform: 'scale(0.05)', opacity: '0' })
      expect(wrapper.emitted('close')).toBeUndefined()

      animations[1]?.onfinish?.()
      await nextTick()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when it is opened and closed quickly', () => {
    it('then it ends closed with the close event emitted once', async () => {
      const wrapper = getWrapper({ origin: { x: 200, y: 300 } })

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      animations.at(-1)?.onfinish?.()
      await nextTick()

      expect(dialogElement()).toBeNull()
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the keyboard is used', () => {
    it('then Escape closes it and the focus goes back to the previous element', async () => {
      const button = document.createElement('button')
      document.body.append(button)
      button.focus()
      const wrapper = getWrapper()

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      await nextTick()
      animations.at(-1)?.onfinish?.()
      await nextTick()
      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([false])
      expect(document.activeElement).toBe(button)
    })
  })
})

describe('given the layout of a dialog', () => {
  describe('when it uses the default alignment', () => {
    it('then it is centered on mobile with full rounded corners and a shadow', () => {
      const wrapper = getWrapper({ modelValue: true })

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('align')).toBe('center')
      const dialog = dialogElement() as HTMLElement
      expect(dialog.classList.contains('maz:rounded-xl')).toBe(true)
      expect(dialog.classList.contains('maz:shadow-elevation')).toBe(true)
      expect(dialog.classList.contains('maz:rounded-b-none')).toBe(false)
      expect(document.querySelector('.m-backdrop-content')?.className).toContain('maz:items-center')
      expect(document.querySelector('.m-backdrop-content')?.className).not.toContain('maz:items-end')
    })

    it('then it does not block the touch scroll', () => {
      getWrapper({ modelValue: true })

      expect((dialogElement() as HTMLElement).classList.contains('maz:touch-none')).toBe(false)
    })
  })

  describe('when it is scrollable', () => {
    it('then its height follows the visible viewport', () => {
      getWrapper({ modelValue: true, scrollable: true })

      const classes = (dialogElement() as HTMLElement).className
      expect(classes).toContain('maz:max-h-[calc(100dvh-2rem)]')
      expect(classes).toContain('maz:tab-s:max-h-[95dvh]')
      expect(document.querySelector('.m-dialog-content')?.className).toContain('maz:overscroll-contain')
    })
  })

  describe('when align is end', () => {
    it('then it keeps the look of a panel stuck to the bottom', () => {
      getWrapper({ modelValue: true, align: 'end' })

      expect(document.querySelector('.m-backdrop-content')?.className).toContain('maz:items-end')
      const classes = (dialogElement() as HTMLElement).className
      expect(classes).toContain('maz:rounded-b-none')
      expect(classes).toContain('maz:tab-s:rounded-b-xl')
    })
  })

  describe('when align is none', () => {
    it('then it keeps the old mobile alignment', () => {
      getWrapper({ modelValue: true, align: 'none' })

      expect(document.querySelector('.m-backdrop-content')?.className).toContain('maz:items-end maz:tab-s:items-center')
    })
  })
})
