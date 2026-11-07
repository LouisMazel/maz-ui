import MazPopover from '@components/MazPopover.vue'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

function createApp(modelValue: boolean) {
  return createSSRApp({
    render: () => h(MazPopover, { modelValue }, {
      trigger: () => h('button', 'Open'),
      default: () => h('p', { class: 'panel-content' }, 'Panel content'),
    }),
  })
}

async function renderOnServer(modelValue: boolean) {
  const context: { teleports?: Record<string, string> } = {}
  const html = await renderToString(createApp(modelValue), context)

  return { html, teleports: context.teleports }
}

async function hydrate(modelValue: boolean) {
  const { html } = await renderOnServer(modelValue)
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.append(container)

  createApp(modelValue).mount(container)
  await nextTick()

  const messages = [
    ...warn.mock.calls,
    ...error.mock.calls,
  ].map(([message]) => String(message))
  warn.mockRestore()
  error.mockRestore()

  return { container, messages }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a closed MazPopover', () => {
  describe('when it is rendered on the server', () => {
    it('renders the trigger without teleported content', async () => {
      const { html, teleports } = await renderOnServer(false)

      expect(html).toContain('<button>Open</button>')
      expect(teleports).toBeUndefined()
    })
  })

  describe('when it is hydrated', () => {
    it('hydrates without mismatch', async () => {
      const { messages } = await hydrate(false)

      expect(messages.filter(message => message.includes('Hydration'))).toEqual([])
    })
  })
})

describe('given an open MazPopover', () => {
  describe('when it is rendered on the server', () => {
    it('renders no panel', async () => {
      const { html, teleports } = await renderOnServer(true)

      expect(html).not.toContain('Panel content')
      expect(html).not.toContain('aria-controls')
      expect(teleports).toBeUndefined()
    })
  })

  describe('when it is hydrated', () => {
    it('hydrates without mismatch and renders the panel in the body', async () => {
      const { container, messages } = await hydrate(true)

      expect(messages.filter(message => message.includes('Hydration'))).toEqual([])
      expect(document.body.querySelector('.m-popover-panel .panel-content')).not.toBeNull()
      expect(container.querySelector('button')?.getAttribute('aria-controls')).toBe(document.body.querySelector('.m-popover-panel')?.id)
    })
  })
})
