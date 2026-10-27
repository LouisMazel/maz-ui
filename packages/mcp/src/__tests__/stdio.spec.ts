import { createContext } from '../context'
import { startStdioServer } from '../server'
import { BUNDLE_DIR, getEmptyCwd } from './helpers'

const transports = vi.hoisted(() => ({ created: 0 }))

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: class {
    start = vi.fn(() => Promise.resolve())
    close = vi.fn(() => Promise.resolve())
    send = vi.fn(() => Promise.resolve())

    constructor() {
      transports.created++
    }
  },
}))

describe('given startStdioServer', () => {
  describe('when it starts', () => {
    it('then it connects the server to a stdio transport', async () => {
      const server = await startStdioServer({ cwd: getEmptyCwd(), bundledDir: BUNDLE_DIR })

      expect(transports.created).toBe(1)
      expect(server.isConnected()).toBe(true)
      await server.close()
    })
  })
})

describe('given createContext', () => {
  describe('when no knowledge is given', () => {
    it('then it loads the knowledge from the options', () => {
      const context = createContext({ cwd: getEmptyCwd(), bundledDir: BUNDLE_DIR })

      expect(context.knowledge.source.kind).toBe('bundled')
      expect(context.cwd).toBe(getEmptyCwd())
      expect(context.search.search('MazBtn')[0].doc.id).toBe('components/maz-btn')
    })
  })

  describe('when no cwd is given', () => {
    it('then it uses the current directory', () => {
      const context = createContext({ bundledDir: BUNDLE_DIR, docsDir: BUNDLE_DIR })

      expect(context.cwd).toBe(process.cwd())
    })
  })
})
