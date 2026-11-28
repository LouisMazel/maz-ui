import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const floating = vi.hoisted(() => ({
  hide: vi.fn((options?: unknown) => ({ name: 'hide', options, fn: () => ({}) })),
  shift: vi.fn((options?: unknown) => ({ name: 'shift', options, fn: () => ({}) })),
}))

vi.mock('@floating-ui/vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/vue')>()
  return { ...actual, hide: floating.hide, shift: floating.shift }
})

function mountInside(position: string | undefined, props: Record<string, unknown> = {}) {
  const host = document.createElement('div')

  if (position)
    host.style.position = position

  document.body.append(host)

  return mount(MazPopover, {
    props: { modelValue: true, position: 'bottom', collisionPadding: { top: 88 }, ...props },
    slots: { trigger: '<button>Trigger</button>', default: 'Content' },
    attachTo: host,
    global: { stubs: { teleport: true } },
  })
}

describe('given a popover with a collision padding', () => {
  beforeEach(() => {
    floating.hide.mockClear()
    floating.shift.mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when its trigger is inside a sticky element', () => {
    it('then the padding does not apply to the hiding', async () => {
      mountInside('sticky')
      await nextTick()

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: 0 })
    })

    it('then the padding still applies to the shift', async () => {
      mountInside('sticky')
      await nextTick()

      expect(floating.shift).toHaveBeenLastCalledWith({ padding: { top: 88 } })
    })
  })

  describe('when its trigger is inside a fixed element', () => {
    it('then the padding does not apply to the hiding', async () => {
      mountInside('fixed')
      await nextTick()

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: 0 })
    })
  })

  describe('when its trigger is in the normal flow', () => {
    it('then the padding applies to the hiding', async () => {
      mountInside(undefined)
      await nextTick()

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: { top: 88 } })
    })
  })

  describe('when the popover is closed', () => {
    it('then the padding applies to the hiding', async () => {
      mountInside('sticky', { modelValue: false })
      await nextTick()

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: { top: 88 } })
    })
  })
})
