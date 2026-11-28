import MazBackdrop from '@components/MazBackdrop.vue'
import { flushPromises, mount } from '@vue/test-utils'

function mountBackdrop(slot = '<button class="first">First</button><button class="last">Last</button>') {
  return mount(MazBackdrop, {
    props: { modelValue: false },
    slots: { default: slot },
    attachTo: document.body,
    global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
  })
}

async function open(wrapper: ReturnType<typeof mountBackdrop>) {
  await wrapper.setProps({ modelValue: true })
  await flushPromises()
}

function pressEscape(init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, ...init })
  document.dispatchEvent(event)
  return event
}

describe('given two backdrops opened one above the other', () => {
  let lower: ReturnType<typeof mountBackdrop>
  let upper: ReturnType<typeof mountBackdrop>

  beforeEach(async () => {
    lower = mountBackdrop()
    upper = mountBackdrop()
    await open(lower)
    await open(upper)
  })

  afterEach(() => {
    lower.unmount()
    upper.unmount()
  })

  describe('when Escape is pressed', () => {
    beforeEach(async () => {
      pressEscape()
      await flushPromises()
    })

    it('then only the upper backdrop closes', () => {
      expect(upper.vm.present).toBe(false)
      expect(lower.vm.present).toBe(true)
    })
  })

  describe('when Escape is pressed twice', () => {
    beforeEach(async () => {
      pressEscape()
      await flushPromises()
      await upper.setProps({ modelValue: false })
      await flushPromises()
      pressEscape()
      await flushPromises()
    })

    it('then both backdrops close, the upper one first', () => {
      expect(upper.vm.present).toBe(false)
      expect(lower.vm.present).toBe(false)
    })
  })
})

describe('given an open backdrop', () => {
  let wrapper: ReturnType<typeof mountBackdrop>

  beforeEach(async () => {
    wrapper = mountBackdrop()
    await open(wrapper)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('when an element inside handles Escape first and prevents its default', () => {
    beforeEach(async () => {
      document.addEventListener('keydown', preventEscape, { once: true })
      pressEscape()
      await flushPromises()
    })

    function preventEscape(event: KeyboardEvent) {
      event.preventDefault()
    }

    it('then the backdrop stays open', () => {
      expect(wrapper.vm.present).toBe(true)
    })
  })

  describe('when Tab is pressed on its last focusable element', () => {
    let event: KeyboardEvent

    beforeEach(() => {
      wrapper.find<HTMLButtonElement>('.last').element.focus()
      event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      document.dispatchEvent(event)
    })

    it('then the focus goes back to its first focusable element', () => {
      expect(event.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(wrapper.find('.first').element)
    })
  })
})

describe('given an open backdrop with an input without type', () => {
  let wrapper: ReturnType<typeof mountBackdrop>

  beforeEach(async () => {
    wrapper = mountBackdrop('<input class="field"><button class="last">Last</button>')
    await open(wrapper)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('when it opens', () => {
    it('then the input is focused first', () => {
      expect(document.activeElement).toBe(wrapper.find('.field').element)
    })
  })
})
