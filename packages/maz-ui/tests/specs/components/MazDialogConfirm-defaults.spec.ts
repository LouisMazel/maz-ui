import MazDialogConfirm from '@components/MazDialogConfirm.vue'
import { useMazDialogConfirm } from '@components/MazDialogConfirm/useMazDialogConfirm.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { mount } from '@vue/test-utils'

function getWrapper(props: Record<string, unknown> = {}) {
  return mount(MazDialogConfirm, {
    props: { identifier: 'defaults-dialog', modelValue: true, ...props },
    global: { stubs: { Teleport: { template: '<div><slot /></div>' } } },
  })
}

describe('given a MazDialogConfirm without custom texts', () => {
  const { dialogState } = useMazDialogConfirm()

  beforeEach(() => {
    const labels: Record<string, string> = { 'dialogConfirm.accept': 'Confirm', 'dialogConfirm.cancel': 'Cancel' }
    vi.mocked(useTranslations).mockReturnValue({
      t: (key: string) => labels[key] ?? key,
      locale: { value: 'en' },
    } as unknown as ReturnType<typeof useTranslations>)
  })

  afterEach(() => {
    dialogState.value = []
  })

  describe('when rendered', () => {
    it('then the buttons use the translated default texts', async () => {
      const wrapper = getWrapper()
      await vi.dynamicImportSettled()

      const texts = wrapper.findAll('button').map(button => button.text())
      expect(texts).toContain('Confirm')
      expect(texts).toContain('Cancel')
    })

    it('then the reject button is neutral and the accept button is success', async () => {
      const wrapper = getWrapper()
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAll('button')
      const reject = buttons.find(button => button.text() === 'Cancel')
      const accept = buttons.find(button => button.text() === 'Confirm')
      expect(reject?.classes()).toContain('--neutral')
      expect(accept?.classes()).toContain('--success')
    })
  })

  describe('when acceptText and rejectText are given', () => {
    it('then they win over the translations', async () => {
      const wrapper = getWrapper({ acceptText: 'Yes', rejectText: 'No' })
      await vi.dynamicImportSettled()

      const texts = wrapper.findAll('button').map(button => button.text())
      expect(texts).toContain('Yes')
      expect(texts).toContain('No')
      expect(texts).not.toContain('Confirm')
    })
  })

  describe('when the text is given in acceptProps and rejectProps', () => {
    it('then it wins over the translations', async () => {
      const wrapper = getWrapper({ acceptProps: { text: 'Go' }, rejectProps: { text: 'Stop' } })
      await vi.dynamicImportSettled()

      const texts = wrapper.findAll('button').map(button => button.text())
      expect(texts).toContain('Go')
      expect(texts).toContain('Stop')
    })
  })
})
