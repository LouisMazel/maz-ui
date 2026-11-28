import { mergeButtonProps } from '@plugins/dialog/createReactiveDialog.ts'
import { DialogHandler } from '@plugins/dialog/DialogHandler.ts'
import { createApp, nextTick, ref } from 'vue'

describe('given mergeButtonProps', () => {
  describe('when only one side is defined', () => {
    it('then it returns that side untouched', () => {
      const props = { color: 'info' as const }
      expect(mergeButtonProps(props, undefined)).toBe(props)
      expect(mergeButtonProps(undefined, props)).toBe(props)
    })
  })

  describe('when both sides are plain objects', () => {
    it('then the call props are merged over the global props', () => {
      expect(mergeButtonProps({ color: 'info', size: 'lg' }, { color: 'warning' })).toEqual({ color: 'warning', size: 'lg' })
    })
  })

  describe('when a side is reactive', () => {
    it('then it returns a getter merging the resolved values', () => {
      const call = ref({ color: 'warning' as const })
      const merged = mergeButtonProps({ color: 'info', size: 'lg' }, call) as () => unknown
      expect(merged()).toEqual({ color: 'warning', size: 'lg' })

      call.value = { color: 'success' as const }
      expect(merged()).toEqual({ color: 'success', size: 'lg' })
    })

    it('then a getter global side is resolved', () => {
      const merged = mergeButtonProps(() => ({ size: 'sm' as const }), { color: 'info' as const }) as () => unknown
      expect(merged()).toEqual({ size: 'sm', color: 'info' })
    })
  })
})

describe('given a DialogHandler with global button props', () => {
  let handler: DialogHandler
  let counter = 0

  beforeEach(() => {
    counter += 1
    handler = new DialogHandler(createApp({}), {
      identifier: `merge-dialog-${counter}`,
      acceptProps: { color: 'info', size: 'lg' },
      rejectProps: { color: 'warning', size: 'lg' },
    })
  })

  afterEach(() => {
    const active = (handler as unknown as { activeDialogs: Map<string, { destroy: () => void }> }).activeDialogs
    active.forEach(entry => entry.destroy())
  })

  const getButton = (text: string) =>
    [...document.body.querySelectorAll('button')].reverse().find(b => b.textContent?.trim() === text)

  describe('when a call gives its own button props', () => {
    it('then they are merged with the global props instead of replacing them', async () => {
      handler.confirm({
        acceptText: 'Go',
        rejectText: 'Stop',
        acceptProps: { color: 'success' },
        rejectProps: { variant: 'outline' },
      })
      await vi.waitFor(() => expect(getButton('Go')).toBeDefined())
      await nextTick()

      const accept = getButton('Go')
      const reject = getButton('Stop')
      expect(accept?.classList.contains('--success')).toBe(true)
      expect(accept?.classList.contains('--lg')).toBe(true)
      expect(reject?.classList.contains('--warning')).toBe(true)
      expect(reject?.classList.contains('--lg')).toBe(true)
    })
  })

  describe('when a call gives reactive button props', () => {
    it('then they are merged with the global props', async () => {
      handler.confirm({
        acceptText: 'Reactive',
        acceptProps: () => ({ color: 'success' as const }),
      })
      await vi.waitFor(() => expect(getButton('Reactive')).toBeDefined())
      await nextTick()

      const accept = getButton('Reactive')
      expect(accept?.classList.contains('--success')).toBe(true)
      expect(accept?.classList.contains('--lg')).toBe(true)
    })
  })
})
