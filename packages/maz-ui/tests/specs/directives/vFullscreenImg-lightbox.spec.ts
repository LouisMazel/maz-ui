import type { App } from 'vue'
import { vFullscreenImg } from '@directives/vFullscreenImg.ts'
import { flushPromises } from '@vue/test-utils'
import { createApp, defineComponent, h, reactive, withDirectives } from 'vue'

type Binding = string | Record<string, unknown> | undefined

function image(src: string, binding: Binding = undefined) {
  return withDirectives(h('img', { src, alt: `alt ${src}` }), [[vFullscreenImg, binding ?? src]])
}

const hostOptions = reactive<{ value: Record<string, unknown> }>({ value: {} })

const Host = defineComponent({
  setup: () => () => h('main', [
    h('section', { id: 'one' }, [image('a1.jpg', { src: 'a1.jpg', ...hostOptions.value }), image('a2.jpg', { src: 'a2.jpg', ...hostOptions.value })]),
    h('section', { id: 'two' }, [image('b1.jpg', { src: 'b1.jpg', ...hostOptions.value }), image('b2.jpg', { src: 'b2.jpg', ...hostOptions.value }), image('b3.jpg', { src: 'b3.jpg', ...hostOptions.value })]),
    h('section', { id: 'named-1' }, [image('c1.jpg', { src: 'c1.jpg', group: 'trip' })]),
    h('section', { id: 'named-2' }, [image('c2.jpg', { src: 'c2.jpg', group: 'trip' })]),
  ]),
})

let app: App | undefined

function getThumbnail(src: string) {
  return document.querySelector<HTMLElement>(`section img[src="${src}"]`)!
}

async function settle() {
  await vi.dynamicImportSettled()
  await flushPromises()
}

async function openFrom(src: string) {
  getThumbnail(src).click()
  await settle()
  document.querySelector('.m-lightbox__image')?.dispatchEvent(new Event('load'))
  await settle()
}

function getCounter() {
  return document.querySelector('.m-lightbox__counter')?.textContent?.trim()
}

beforeEach(() => {
  hostOptions.value = {}
  app = createApp(Host)
  app.mount(document.body.appendChild(document.createElement('div')))
})

afterEach(async () => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  await settle()
  app?.unmount()
  document.body.innerHTML = ''
})

describe('given thumbnails with the directive', () => {
  describe('when they are mounted', () => {
    it('then they are keyboard accessible buttons', () => {
      const thumbnail = getThumbnail('a1.jpg')

      expect(thumbnail.getAttribute('tabindex')).toBe('0')
      expect(thumbnail.getAttribute('role')).toBe('button')
      expect(thumbnail.getAttribute('aria-haspopup')).toBe('dialog')
      expect(thumbnail.classList.contains('maz:cursor-zoom-in')).toBe(true)
    })
  })

  describe('when a thumbnail is clicked', () => {
    it('then it opens a dialog without loading anything before', async () => {
      expect(document.querySelector('[role="dialog"]')).toBeNull()

      await openFrom('a1.jpg')

      expect(document.querySelector('[role="dialog"]')).not.toBeNull()
      expect(document.querySelector('.m-lightbox__image')?.getAttribute('src')).toBe('a1.jpg')
    })
  })

  describe('when Enter or Space is pressed on a thumbnail', () => {
    it('then it opens the lightbox', async () => {
      getThumbnail('a1.jpg').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      await settle()

      expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    })

    it('then Space opens it too', async () => {
      getThumbnail('b1.jpg').dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await settle()

      expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    })
  })
})

describe('given images in different containers', () => {
  describe('when an image of the first container is opened', () => {
    it('then the group is the images of its container only', async () => {
      await openFrom('a2.jpg')

      expect(getCounter()).toBe('2 / 2')
    })
  })

  describe('when an image of the second container is opened', () => {
    it('then the counter counts its three images', async () => {
      await openFrom('b2.jpg')

      expect(getCounter()).toBe('2 / 3')
    })
  })

  describe('when images share a group name', () => {
    it('then they are browsed together across containers', async () => {
      await openFrom('c1.jpg')

      expect(getCounter()).toBe('1 / 2')
    })
  })
})

describe('given an open lightbox', () => {
  describe('when the next key is pressed', () => {
    it('then it shows the next image of the group', async () => {
      await openFrom('b1.jpg')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await settle()

      expect(getCounter()).toBe('2 / 3')
    })
  })

  describe('when the right to left page is browsed', () => {
    it('then ArrowLeft shows the next image', async () => {
      document.documentElement.dir = 'rtl'
      await openFrom('b1.jpg')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await settle()
      document.documentElement.removeAttribute('dir')

      expect(getCounter()).toBe('2 / 3')
    })
  })

  describe('when the thumbnail is open', () => {
    it('then it is hidden while the lightbox is open and visible again after', async () => {
      const thumbnail = getThumbnail('b1.jpg')
      await openFrom('b1.jpg')
      expect(thumbnail.classList.contains('maz:invisible')).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()

      expect(thumbnail.classList.contains('maz:invisible')).toBe(false)
    })
  })

  describe('when it is closed with Escape', () => {
    it('then the focus goes back to the thumbnail and the dialog is removed', async () => {
      const thumbnail = getThumbnail('b2.jpg')
      thumbnail.focus()
      await openFrom('b2.jpg')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()

      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(document.activeElement).toBe(thumbnail)
    })
  })

  describe('when it was navigated before closing', () => {
    it('then the focus goes back to the thumbnail of the shown image', async () => {
      await openFrom('b1.jpg')

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
      await settle()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()

      expect(document.activeElement).toBe(getThumbnail('b3.jpg'))
    })
  })
})

describe('given the disabled option', () => {
  describe('when a thumbnail is clicked', () => {
    it('then nothing opens', async () => {
      hostOptions.value = { disabled: true }
      await flushPromises()
      getThumbnail('a1.jpg').click()
      await settle()

      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(getThumbnail('a1.jpg').getAttribute('role')).toBeNull()
    })
  })
})

describe('given keyboard events from a child of the thumbnail', () => {
  describe('when Enter is pressed on a child', () => {
    it('then it does not open', async () => {
      const thumbnail = getThumbnail('a1.jpg')
      const child = document.createElement('span')
      thumbnail.append(child)

      child.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      await settle()

      expect(document.querySelector('[role="dialog"]')).toBeNull()
    })
  })

  describe('when another key is pressed on the thumbnail', () => {
    it('then it does not open', async () => {
      getThumbnail('a1.jpg').dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
      await settle()

      expect(document.querySelector('[role="dialog"]')).toBeNull()
    })
  })
})

describe('given a lightbox already open', () => {
  describe('when another thumbnail is clicked', () => {
    it('then it keeps the same lightbox', async () => {
      await openFrom('a1.jpg')

      getThumbnail('a2.jpg').click()
      await settle()

      expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1)
      expect(getCounter()).toBe('1 / 2')
    })
  })
})

describe('given the disabled option toggled', () => {
  describe('when it is disabled then enabled again', () => {
    it('then the thumbnail loses then recovers its behavior', async () => {
      hostOptions.value = { disabled: true }
      await flushPromises()
      expect(getThumbnail('a1.jpg').getAttribute('role')).toBeNull()

      hostOptions.value = { disabled: false }
      await flushPromises()
      expect(getThumbnail('a1.jpg').getAttribute('role')).toBe('button')

      await openFrom('a1.jpg')
      expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    })
  })

  describe('when it stays disabled across updates', () => {
    it('then nothing is set up', async () => {
      hostOptions.value = { disabled: true }
      await flushPromises()
      hostOptions.value = { disabled: true, scaleOnHover: true }
      await flushPromises()

      expect(getThumbnail('a1.jpg').classList.contains('m-fullscreen-img-instance')).toBe(false)
    })
  })
})

describe('given hover options', () => {
  describe('when they are enabled', () => {
    it('then the thumbnail gets the hover classes', async () => {
      hostOptions.value = { scaleOnHover: true, blurOnHover: true }
      await flushPromises()

      const classes = getThumbnail('a1.jpg').classList
      expect(classes.contains('maz:hover:scale-[1.04]')).toBe(true)
      expect(classes.contains('maz:hover:blur-[0.1875rem]')).toBe(true)
      expect(classes.contains('maz:duration-200')).toBe(true)
    })
  })
})

describe('given thumbnails with caption and full source', () => {
  describe('when the lightbox opens', () => {
    it('then the caption of the member is shown', async () => {
      hostOptions.value = { caption: 'Nice view' }
      await flushPromises()

      await openFrom('a1.jpg')

      expect(document.querySelector('.m-lightbox__caption')?.textContent?.trim()).toBe('Nice view')
    })
  })
})

describe('given an unmounted app', () => {
  describe('when the thumbnails are removed', () => {
    it('then their listeners and attributes are cleaned', async () => {
      const thumbnail = getThumbnail('a1.jpg')

      app?.unmount()
      app = undefined

      expect(thumbnail.getAttribute('role')).toBeNull()
      expect(thumbnail.classList.contains('m-fullscreen-img-instance')).toBe(false)
      thumbnail.click()
      await settle()
      expect(document.querySelector('[role="dialog"]')).toBeNull()
    })
  })
})
