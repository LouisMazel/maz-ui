import { holdInertBackground, releaseInertBackground } from '@/utils/inertBackground'

function addToBody(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  const element = template.content.firstElementChild as HTMLElement
  document.body.appendChild(element)
  return element
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a page with a modal', () => {
  describe('when the background is held inert', () => {
    it('then the other elements are inert, except the modal, the overlays and the live regions', () => {
      const app = addToBody('<div id="app"></div>')
      const toasts = addToBody('<div class="m-toast-container"></div>')
      const panel = addToBody('<div class="m-popover-panel"></div>')
      const live = addToBody('<div aria-live="polite"></div>')
      const status = addToBody('<div role="status"></div>')
      const alert = addToBody('<div role="alert"></div>')
      const style = addToBody('<style></style>')
      const modalRoot = addToBody('<div><div class="modal"></div></div>')

      const held = holdInertBackground(modalRoot.querySelector('.modal') as HTMLElement)

      expect(held).toEqual([app])
      expect(app.hasAttribute('inert')).toBe(true)
      expect([toasts, panel, live, status, alert, style, modalRoot].some(element => element.hasAttribute('inert'))).toBe(false)
    })
  })

  describe('when the background is released', () => {
    it('then the elements are interactive again', () => {
      const app = addToBody('<div id="app"></div>')
      const modal = addToBody('<div></div>')

      releaseInertBackground(holdInertBackground(modal))

      expect(app.hasAttribute('inert')).toBe(false)
    })
  })

  describe('when an element was made inert by something else', () => {
    it('then it is neither held nor released', () => {
      const app = addToBody('<div id="app" inert></div>')
      const modal = addToBody('<div></div>')

      const held = holdInertBackground(modal)
      releaseInertBackground(held)

      expect(held).toEqual([])
      expect(app.hasAttribute('inert')).toBe(true)
    })
  })

  describe('when two modals hold the background and the first one is released first', () => {
    it('then the background stays inert until the second one is released', () => {
      const app = addToBody('<div id="app"></div>')
      const firstModal = addToBody('<div></div>')
      const firstHeld = holdInertBackground(firstModal)
      const secondModal = addToBody('<div></div>')
      const secondHeld = holdInertBackground(secondModal)

      releaseInertBackground(firstHeld)
      expect(app.hasAttribute('inert')).toBe(true)

      releaseInertBackground(secondHeld)
      expect(app.hasAttribute('inert')).toBe(false)
    })
  })

  describe('when an element not held is released', () => {
    it('then nothing changes', () => {
      const element = addToBody('<div inert></div>')

      releaseInertBackground([element])

      expect(element.hasAttribute('inert')).toBe(true)
    })
  })
})
