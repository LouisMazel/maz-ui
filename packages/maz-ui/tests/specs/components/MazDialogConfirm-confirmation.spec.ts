import type { VueWrapper } from '@vue/test-utils'
import MazDialogConfirm from '@components/MazDialogConfirm.vue'
import { useMazDialogConfirm } from '@components/MazDialogConfirm/useMazDialogConfirm.ts'
import { flushPromises, mount } from '@vue/test-utils'

const { showDialogAndWaitChoice, dialogState } = useMazDialogConfirm()

async function getWrapper(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazDialogConfirm, {
    props: { identifier: 'confirmation-dialog', message: 'Delete?', acceptText: 'Delete', rejectText: 'Keep', ...props },
    attachTo: document.body,
    global: { stubs: { transition: false, teleport: false } },
  })
  const promise = showDialogAndWaitChoice('confirmation-dialog')
  promise.catch(() => {})
  await flushPromises()
  await vi.waitFor(() => expect(findField() ?? findButton('Delete') ?? findButton('Remove')).toBeTruthy())

  return { wrapper, promise }
}

function findButton(text: string) {
  return [...document.body.querySelectorAll('button')].find(button => button.textContent?.trim() === text)
}

function findField() {
  return document.body.querySelector('.m-dialog-confirm-confirmation input') as HTMLInputElement | null
}

async function type(value: string) {
  const field = findField() as HTMLInputElement
  field.value = value
  field.dispatchEvent(new Event('input', { bubbles: true }))
  await flushPromises()
}

describe('given a confirm dialog with a confirmation text', () => {
  let current: VueWrapper | undefined

  afterEach(() => {
    current?.unmount()
    dialogState.value = []
    document.body.innerHTML = ''
  })

  describe('when it opens', () => {
    it('then it shows a labelled field and disables the accept button', async () => {
      current = (await getWrapper({ confirmation: 'my-project' })).wrapper

      expect(findField()).not.toBeNull()
      expect(findField()?.getAttribute('aria-label')).toBe('test')
      expect(findButton('Delete')?.disabled).toBe(true)
      expect(findButton('Keep')?.disabled).toBe(false)
    })
  })

  describe('when the user types a different text', () => {
    it('then the accept button stays disabled', async () => {
      current = (await getWrapper({ confirmation: 'my-project' })).wrapper

      await type('my-proj')

      expect(findButton('Delete')?.disabled).toBe(true)
    })
  })

  describe('when the user types the text', () => {
    it('then the accept button is enabled and accepts', async () => {
      const { wrapper, promise } = await getWrapper({ confirmation: 'my-project' })
      current = wrapper

      await type('my-project')
      expect(findButton('Delete')?.disabled).toBe(false)

      findButton('Delete')?.click()

      await expect(promise).resolves.toBe('accept')
    })

    it('then Enter in the field accepts', async () => {
      const { wrapper, promise } = await getWrapper({ confirmation: 'my-project' })
      current = wrapper

      await type('my-project')
      findField()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

      await expect(promise).resolves.toBe('accept')
    })
  })

  describe('when the user presses Enter before typing the text', () => {
    it('then nothing is accepted', async () => {
      const { wrapper, promise } = await getWrapper({ confirmation: 'my-project' })
      current = wrapper
      const onSettled = vi.fn()
      promise.then(onSettled, onSettled)

      findField()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      await flushPromises()

      expect(onSettled).not.toHaveBeenCalled()
    })
  })

  describe('when the user rejects', () => {
    it('then the reject button works without typing', async () => {
      const { wrapper, promise } = await getWrapper({ confirmation: 'my-project' })
      current = wrapper

      findButton('Keep')?.click()

      await expect(promise).rejects.toBe('reject')
    })
  })

  describe('when the footer slot receives accept', () => {
    it('then it does nothing until the text is typed', async () => {
      const wrapper = mount(MazDialogConfirm, {
        props: { identifier: 'confirmation-dialog', message: 'Delete?', confirmation: 'ok' },
        slots: { 'footer-button': '<template #footer-button="{ accept }"><button class="custom" @click="accept()">Go</button></template>' },
        attachTo: document.body,
        global: { stubs: { transition: false, teleport: false } },
      })
      current = wrapper
      const promise = showDialogAndWaitChoice('confirmation-dialog')
      const onSettled = vi.fn()
      promise.then(onSettled, onSettled)
      await flushPromises()

      ;(document.body.querySelector('.custom') as HTMLButtonElement).click()
      await flushPromises()
      expect(onSettled).not.toHaveBeenCalled()

      await vi.waitFor(() => expect(findField()).not.toBeNull())
      await type('ok')
      ;(document.body.querySelector('.custom') as HTMLButtonElement).click()

      await expect(promise).resolves.toBe('accept')
    })
  })

  describe('when the dialog has no confirmation text', () => {
    it('then there is no field and the accept button is enabled', async () => {
      current = (await getWrapper()).wrapper

      expect(findField()).toBeNull()
      expect(findButton('Delete')?.disabled).toBe(false)
    })
  })

  describe('when custom buttons are given', () => {
    it('then the accept ones are disabled until the text is typed', async () => {
      const { wrapper } = await getWrapper({
        confirmation: 'x',
        buttons: [
          { text: 'Remove', type: 'accept', color: 'destructive' },
          { text: 'Back', type: 'reject' },
        ],
      })
      current = wrapper
      await vi.waitFor(() => expect(findButton('Remove')).toBeDefined())

      expect(findButton('Remove')?.disabled).toBe(true)
      expect(findButton('Back')?.disabled).toBe(false)

      await type('x')

      expect(findButton('Remove')?.disabled).toBe(false)
    })
  })
})
