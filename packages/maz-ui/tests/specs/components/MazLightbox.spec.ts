import type { VueWrapper } from '@vue/test-utils'
import MazLightbox from '@components/MazLightbox.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { flushPromises, mount } from '@vue/test-utils'

const images = [
  { src: 'https://example.com/1.jpg', alt: 'First', caption: 'First caption' },
  { src: 'https://example.com/2.jpg', alt: 'Second' },
  { src: 'https://example.com/3.jpg', alt: 'Third' },
]

const labels: Record<string, string> = {
  'lightbox.close': 'Close',
  'lightbox.previous': 'Previous image',
  'lightbox.next': 'Next image',
  'lightbox.label': 'Image viewer',
  'lightbox.loading': 'Loading...',
}

let wrapper: VueWrapper | undefined

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => labels[key] ?? key } as never)
})

function firePointer(target: Element, type: string, x: number, y: number) {
  const event = Object.assign(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }), {
    pointerId: 1,
    pointerType: 'touch',
  })
  target.dispatchEvent(event)
}

async function openLightbox(props: Record<string, unknown> = {}) {
  wrapper = mount(MazLightbox, {
    props: {
      'modelValue': true,
      'index': 0,
      images,
      'onUpdate:modelValue': (value: boolean) => wrapper?.setProps({ modelValue: value }),
      'onUpdate:index': (value: number) => wrapper?.setProps({ index: value }),
      ...props,
    },
    attachTo: document.body,
  })
  await flushPromises()
  document.querySelector('.m-lightbox__image')?.dispatchEvent(new Event('load'))
  await flushPromises()

  return wrapper
}

function getDialog() {
  return document.querySelector<HTMLElement>('[role="dialog"]')
}

function getStage() {
  return document.querySelector<HTMLElement>('.m-lightbox__stage')!
}

function getButton(label: string) {
  return document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  document.documentElement.removeAttribute('dir')
  document.body.innerHTML = ''
})

describe('given a lightbox with three images', () => {
  describe('when it is open', () => {
    it('then it renders a modal dialog', async () => {
      await openLightbox()

      const dialog = getDialog()
      expect(dialog).not.toBeNull()
      expect(dialog?.getAttribute('aria-modal')).toBe('true')
      expect(dialog?.getAttribute('aria-label')).toBe('First')
    })

    it('then it shows the counter and the caption', async () => {
      await openLightbox()

      expect(document.querySelector('.m-lightbox__counter')?.textContent?.trim()).toBe('1 / 3')
      expect(document.querySelector('.m-lightbox__caption')?.textContent?.trim()).toBe('First caption')
    })

    it('then it uses the alt as caption when there is no caption', async () => {
      await openLightbox({ index: 1 })

      expect(document.querySelector('.m-lightbox__caption')?.textContent?.trim()).toBe('Second')
    })

    it('then it labels the buttons', async () => {
      await openLightbox()

      expect(getButton('Close')).not.toBeNull()
      expect(getButton('Previous image')).not.toBeNull()
      expect(getButton('Next image')).not.toBeNull()
    })
  })

  describe('when the model is false', () => {
    it('then nothing is rendered', async () => {
      await openLightbox({ modelValue: false })

      expect(getDialog()).toBeNull()
    })
  })

  describe('when the next button is clicked', () => {
    it('then the index and the counter move forward', async () => {
      const lightbox = await openLightbox()

      getButton('Next image').click()
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
      expect(lightbox.emitted('next')).toHaveLength(1)
      expect(document.querySelector('.m-lightbox__counter')?.textContent?.trim()).toBe('2 / 3')
    })
  })

  describe('when the arrow keys are pressed in a left to right page', () => {
    it('then ArrowRight goes to the next image and ArrowLeft goes back', async () => {
      const lightbox = await openLightbox()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await flushPromises()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await flushPromises()

      expect(lightbox.emitted('update:index')).toEqual([[1], [0]])
    })
  })

  describe('when the arrow keys are pressed in a right to left page', () => {
    it('then ArrowLeft goes to the next image', async () => {
      document.documentElement.dir = 'rtl'
      const lightbox = await openLightbox()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
    })
  })

  describe('when Home and End are pressed', () => {
    it('then it goes to the last and to the first image', async () => {
      const lightbox = await openLightbox()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
      await flushPromises()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
      await flushPromises()

      expect(lightbox.emitted('update:index')).toEqual([[2], [0]])
    })
  })

  describe('when the loop is disabled on the first image', () => {
    it('then the previous button is disabled', async () => {
      await openLightbox({ loop: false })

      expect(getButton('Previous image').disabled).toBe(true)
      expect(getButton('Next image').disabled).toBe(false)
    })
  })

  describe('when Escape is pressed', () => {
    it('then it closes and emits before-close and close', async () => {
      const lightbox = await openLightbox()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await flushPromises()

      expect(lightbox.emitted('update:modelValue')?.[0]).toEqual([false])
      expect(lightbox.emitted('before-close')).toHaveLength(1)
      expect(lightbox.emitted('close')).toHaveLength(1)
      expect(getDialog()).toBeNull()
    })
  })

  describe('when it opens from a focused button and closes', () => {
    it('then the focus goes back to the button', async () => {
      const trigger = document.createElement('button')
      document.body.append(trigger)
      trigger.focus()

      await openLightbox()
      getButton('Close').click()
      await flushPromises()

      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('when the image is clicked and zoom is enabled', () => {
    it('then it zooms in and out', async () => {
      await openLightbox()
      const image = document.querySelector('.m-lightbox__image')!

      image.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 300, clientY: 200 }))
      await flushPromises()
      expect(getDialog()?.classList.contains('--zoomed')).toBe(true)

      image.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()
      expect(getDialog()?.classList.contains('--zoomed')).toBe(false)
    })
  })

  describe('when the zoom keys are pressed', () => {
    it('then plus zooms in and zero resets', async () => {
      await openLightbox()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
      await flushPromises()
      expect(getDialog()?.classList.contains('--zoomed')).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: '0' }))
      await flushPromises()
      expect(getDialog()?.classList.contains('--zoomed')).toBe(false)
    })
  })

  describe('when the image is clicked and zoom is disabled', () => {
    it('then it does not zoom', async () => {
      await openLightbox({ zoom: false })

      document.querySelector('.m-lightbox__image')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()

      expect(getDialog()?.classList.contains('--zoomed')).toBe(false)
    })
  })

  describe('when the stage outside the image is clicked', () => {
    it('then it closes', async () => {
      const lightbox = await openLightbox()

      getStage().dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await flushPromises()

      expect(lightbox.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the user swipes towards the start', () => {
    it('then it goes to the next image', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      firePointer(stage, 'pointermove', 400, 300)
      firePointer(stage, 'pointermove', 100, 300)
      firePointer(stage, 'pointerup', 100, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
    })
  })

  describe('when the user swipes towards the end in a right to left page', () => {
    it('then it goes to the next image', async () => {
      document.documentElement.dir = 'rtl'
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 100, 300)
      firePointer(stage, 'pointermove', 200, 300)
      firePointer(stage, 'pointermove', 500, 300)
      firePointer(stage, 'pointerup', 500, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')?.[0]).toEqual([1])
    })
  })

  describe('when the user drags the image down', () => {
    it('then it closes', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 100)
      firePointer(stage, 'pointermove', 500, 150)
      firePointer(stage, 'pointermove', 500, 400)
      firePointer(stage, 'pointerup', 500, 400)
      await flushPromises()

      expect(lightbox.emitted('close')).toHaveLength(1)
    })
  })

  describe('when the user drags a little', () => {
    it('then it stays open on the same image', async () => {
      const lightbox = await openLightbox()
      const stage = getStage()

      firePointer(stage, 'pointerdown', 500, 300)
      await new Promise(resolve => setTimeout(resolve, 80))
      firePointer(stage, 'pointermove', 480, 300)
      firePointer(stage, 'pointerup', 480, 300)
      await flushPromises()

      expect(lightbox.emitted('update:index')).toBeUndefined()
      expect(getDialog()).not.toBeNull()
    })
  })
})

describe('given a lightbox with one image', () => {
  describe('when it is open', () => {
    it('then it shows no navigation and no counter', async () => {
      await openLightbox({ images: ['https://example.com/1.jpg'] })

      expect(getButton('Next image')).toBeNull()
      expect(document.querySelector('.m-lightbox__counter')).toBeNull()
    })
  })
})

describe('given an image with a high-resolution source', () => {
  describe('when it is open', () => {
    it('then it starts with src', async () => {
      await openLightbox({ images: [{ src: 'https://example.com/small.jpg', fullSrc: 'https://example.com/big.jpg' }] })

      expect(document.querySelector('.m-lightbox__image')?.getAttribute('src')).toBe('https://example.com/small.jpg')
    })
  })
})

describe('given a custom caption slot', () => {
  describe('when it is open', () => {
    it('then it renders the slot', async () => {
      await openLightbox({}).then(() => wrapper?.unmount())
      wrapper = mount(MazLightbox, {
        props: { modelValue: true, images },
        slots: { caption: '<b class="custom">Custom</b>' },
        attachTo: document.body,
      })
      await flushPromises()

      expect(document.querySelector('.custom')?.textContent).toBe('Custom')
    })
  })
})
