import { DialogHandler } from '@plugins/dialog/DialogHandler'
import { computed, createApp, defineComponent, h, nextTick, ref } from 'vue'

describe('given DialogHandler confirm', () => {
  let handler: DialogHandler
  let counter = 0
  const yes = () => `Yes ${counter}`
  const no = () => `No ${counter}`

  beforeEach(() => {
    counter += 1
    handler = new DialogHandler(createApp({}), {
      identifier: `dialog-${counter}`,
      acceptText: yes(),
      rejectText: no(),
    })
  })

  afterEach(() => {
    const active = (handler as unknown as { activeDialogs: Map<string, { destroy: () => void }> }).activeDialogs
    active.forEach(entry => entry.destroy())
  })

  const findButton = (text: string) =>
    [
      ...document.body.querySelectorAll('button'),
    ].reverse().find(b => b.textContent?.trim() === text)

  async function clickButton(text: string) {
    await vi.waitFor(() => expect(findButton(text)).toBeDefined())
    findButton(text)?.click()
    await nextTick()
  }

  describe('when the user clicks the accept button', () => {
    it('then the promise resolves with true', async () => {
      const promise = handler.confirm({ title: 'Title', message: 'Message' })
      await clickButton(yes())

      await expect(promise).resolves.toBe(true)
    })
  })

  describe('when the user clicks the reject button', () => {
    it('then the promise resolves with false', async () => {
      const promise = handler.confirm({ title: 'Title', message: 'Message' })
      await clickButton(no())

      await expect(promise).resolves.toBe(false)
    })
  })

  describe('when no options are given and the dialog is destroyed by a newer dialog with the same identifier', () => {
    it('then the first promise resolves with false', async () => {
      const first = handler.confirm()
      await nextTick()
      const second = handler.confirm({ identifier: `dialog-${counter}` })
      await nextTick()

      await expect(first).resolves.toBe(false)

      await clickButton(yes())

      await expect(second).resolves.toBe(true)
    })
  })

  describe('when the dialog is closed with the escape key', () => {
    it('then the promise resolves with false', async () => {
      const promise = handler.confirm({ message: 'Message' })
      await nextTick()
      await vi.waitFor(() => expect(findButton(yes())).toBeDefined())
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }))

      await expect(promise).resolves.toBe(false)
    })
  })

  describe('when the dialog is closed programmatically', () => {
    it('then onClose is called once', async () => {
      const onClose = vi.fn()
      const { close } = handler.open({ message: 'Message', onClose })
      await nextTick()
      close()

      expect(onClose).toHaveBeenCalledOnce()
    })
  })

  describe('when reactive accept props are given', () => {
    it('then the accept button follows the reactive state', async () => {
      const blocked = ref(true)
      const promise = handler.confirm({
        message: 'Message',
        acceptProps: computed(() => ({ disabled: blocked.value, color: 'success' as const, type: 'accept' as const })),
      })
      await vi.waitFor(() => expect(findButton(yes())?.disabled).toBe(true))

      blocked.value = false

      await vi.waitFor(() => expect(findButton(yes())?.disabled).toBe(false))

      await clickButton(yes())

      await expect(promise).resolves.toBe(true)
    })

    it('then a getter is supported for the reject props and close works', async () => {
      const promise = handler.confirm({
        message: 'Message',
        rejectProps: () => ({
          color: 'destructive' as const,
          type: 'reject' as const,
          text: no(),
        }),
      })
      await clickButton(no())

      await expect(promise).resolves.toBe(false)
    })

    it('then close and destroy of the handle target the inner dialog', async () => {
      const onClose = vi.fn()
      const { close, destroy } = handler.open({
        message: 'Message',
        acceptProps: () => ({ type: 'accept' as const }),
        onClose,
      })
      await nextTick()
      close()

      expect(onClose).toHaveBeenCalledOnce()

      destroy()
    })

    it('then close does nothing when the dialog is not active', async () => {
      const onClose = vi.fn()
      const { close } = handler.open({
        message: 'Message',
        acceptProps: ref({ type: 'accept' as const }),
        onClose,
      })
      await clickButton(yes())
      close()

      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('when a content component is given', () => {
    it('then it is rendered with reactive props, accept and reject', async () => {
      const count = ref(1)
      const Content = defineComponent({
        props: {
          count: { type: Number, default: 0 },
          accept: { type: Function, default: undefined },
        },
        setup(props) {
          return () => h('button', {
            id: 'content-accept',
            onClick: () => props.accept?.('custom'),
          }, `Items ${props.count}`)
        },
      })
      const promise = handler.confirm({
        content: Content,
        contentProps: () => ({ count: count.value }),
      })
      await nextTick()

      expect(document.body.querySelector('#content-accept')?.textContent).toBe('Items 1')

      count.value = 2
      await nextTick()

      expect(document.body.querySelector('#content-accept')?.textContent).toBe('Items 2')

      ;(document.body.querySelector('#content-accept') as HTMLElement).click()
      await nextTick()

      await expect(promise).resolves.toBe(true)
    })

    it('then a render function without contentProps is rendered', async () => {
      handler.confirm({
        content: () => h('p', { id: 'rich' }, 'Rich'),
      })
      await nextTick()

      expect(document.body.querySelector('#rich')?.textContent).toBe('Rich')
    })
  })
})
