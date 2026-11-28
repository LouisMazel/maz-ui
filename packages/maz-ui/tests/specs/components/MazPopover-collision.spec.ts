import MazPopover from '@components/MazPopover.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { mount } from '@vue/test-utils'

const floating = vi.hoisted(() => ({
  hide: vi.fn((options?: unknown) => ({ name: 'hide', options, fn: () => ({}) })),
  shift: vi.fn((options?: unknown) => ({ name: 'shift', options, fn: () => ({}) })),
  flip: vi.fn((options?: unknown) => ({ name: 'flip', options, fn: () => ({}) })),
}))

vi.mock('@floating-ui/vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/vue')>()
  return { ...actual, hide: floating.hide, shift: floating.shift, flip: floating.flip }
})

function mountPopover(props: Record<string, unknown> = {}, provide: Record<symbol, unknown> = {}) {
  return mount(MazPopover, {
    props: { modelValue: true, position: 'bottom', ...props },
    slots: { trigger: '<button>Trigger</button>', default: 'Content' },
    attachTo: document.body,
    global: { stubs: { teleport: true }, provide },
  })
}

describe('given a popover', () => {
  beforeEach(() => {
    floating.hide.mockClear()
    floating.shift.mockClear()
    floating.flip.mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when no collision padding is given', () => {
    it('then the edges of the viewport keep 5px', () => {
      mountPopover()

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: 5 })
      expect(floating.shift).toHaveBeenLastCalledWith({ padding: 5 })
    })
  })

  describe('when a collision padding is given for a sticky header', () => {
    it('then the panel avoids it and hides when its trigger goes under it', () => {
      mountPopover({ collisionPadding: { top: 64 } })

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: { top: 64 } })
      expect(floating.shift).toHaveBeenLastCalledWith({ padding: { top: 64 } })
      expect(floating.flip).toHaveBeenLastCalledWith(expect.objectContaining({ padding: { top: 64 } }))
    })
  })

  describe('when the collision padding is a global default', () => {
    it('then every popover uses it', () => {
      mountPopover({}, { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { MazPopover: { collisionPadding: { top: 80 } } } })

      expect(floating.hide).toHaveBeenLastCalledWith({ padding: { top: 80 } })
    })
  })
})
