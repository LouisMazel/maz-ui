import type { Mock } from 'vitest'
import type { ScriptLoaderOptions } from '../scriptLoader'
import { ScriptLoader } from '../scriptLoader'

describe('given ScriptLoader class', () => {
  let mockDocument: {
    createElement: Mock
    head: {
      append: Mock
      querySelector: Mock
      querySelectorAll: Mock
    }
  }

  let mockWindow: {
    [key: string]: any
  }

  beforeEach(() => {
    mockDocument = {
      createElement: vi.fn(),
      head: {
        append: vi.fn(),
        querySelector: vi.fn(),
        querySelectorAll: vi.fn(),
      },
    }

    mockWindow = {}

    vi.stubGlobal('document', mockDocument as any)
    vi.stubGlobal('window', mockWindow as any)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('when creating a new instance', () => {
    it('then it should throw an error if src is not provided', () => {
      expect(() => new ScriptLoader({ identifier: 'test' } as ScriptLoaderOptions)).toThrow('[ScriptLoader]: You should provide the attribut "src"')
    })

    it('then it should throw an error if identifier is not provided', () => {
      expect(() => new ScriptLoader({ src: 'https://example.com/script.js' } as ScriptLoaderOptions)).toThrow('[ScriptLoader]: You should provide the attribut "identifier"')
    })

    it('then it should create an instance with default options', () => {
      const loader = new ScriptLoader({ src: 'https://example.com/script.js', identifier: 'test' })
      expect(loader).toBeInstanceOf(ScriptLoader)
    })
  })

  describe('when calling load method', () => {
    let loader: ScriptLoader

    beforeEach(() => {
      loader = new ScriptLoader({ src: 'https://example.com/script.js', identifier: 'test' })
    })

    describe('and the script is already loaded', () => {
      it('then it should resolve with the existing script', async () => {
        mockWindow.test = { type: 'load' }
        mockDocument.head.querySelectorAll.mockReturnValue([{}])

        const result = await loader.load()
        expect(result).toBeDefined()
      })
    })

    describe('and the script is not loaded', () => {
      it('then it should inject the script', async () => {
        const mockScript = {
          addEventListener: vi.fn((event, callback) => {
            if (event === 'load') {
              callback({ type: 'load' })
            }
          }),
          dataset: {},
        }
        mockDocument.createElement.mockReturnValue(mockScript)
        mockDocument.head.querySelectorAll.mockReturnValue([])

        const result = await loader.load()
        expect(result).toEqual({ type: 'load' })
        expect(mockDocument.createElement).toHaveBeenCalledWith('script')
        expect(mockDocument.head.append).toHaveBeenCalledWith(mockScript)
      })

      it('then it should handle script load errors', async () => {
        const mockScript = {
          addEventListener: vi.fn((event, callback) => {
            if (event === 'error') {
              callback(new Error('Script load failed'))
            }
          }),
          dataset: {},
        }
        mockDocument.createElement.mockReturnValue(mockScript)
        mockDocument.head.querySelectorAll.mockReturnValue([])

        await expect(loader.load()).rejects.toThrow('[ScriptLoader](injectScript) Script load failed')
      })
    })
  })

  describe('when calling removeTag method', () => {
    let loader: ScriptLoader

    beforeEach(() => {
      loader = new ScriptLoader({ src: 'https://example.com/script.js', identifier: 'test' })
    })

    it('then it should remove the tag when given a string identifier', () => {
      const mockTag = { remove: vi.fn() }
      mockDocument.head.querySelector.mockReturnValue(mockTag)

      loader.removeTag('test')
      expect(mockDocument.head.querySelector).toHaveBeenCalledWith('[data-identifier="test"]')
      expect(mockTag.remove).toHaveBeenCalled()
    })

    it('then it should remove the tag when given an Element', () => {
      const mockTag = { remove: vi.fn() }
      loader.removeTag(mockTag as any)
      expect(mockTag.remove).toHaveBeenCalled()
    })
  })
})
