import MazDropzone from '@components/MazDropzone.vue'
import { mount, shallowMount } from '@vue/test-utils'

// Mock URL for file handling
vi.stubGlobal('URL', class {
  static readonly createObjectURL = vi.fn().mockImplementation(() => 'mocked-url')
  static readonly revokeObjectURL = vi.fn()
})

// Mock fetch with proper error handling
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true }),
    text: () => Promise.resolve('success'),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as Response),
))

// Mock FormData to prevent network issues
vi.stubGlobal('FormData', class {
  data = new Map()
  append(key: string, value: any) {
    this.data.set(key, value)
  }

  get(key: string) {
    return this.data.get(key)
  }

  entries() {
    return this.data.entries()
  }

  [Symbol.iterator]() {
    return this.data.entries()
  }
})

// Prevent any actual network requests from happening in tests
const originalXMLHttpRequest = globalThis.XMLHttpRequest
beforeAll(() => {
  globalThis.XMLHttpRequest = vi.fn().mockImplementation(() => ({
    open: vi.fn(),
    send: vi.fn(),
    setRequestHeader: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    abort: vi.fn(),
    readyState: 4,
    status: 200,
    statusText: 'OK',
    responseText: '',
    response: '',
  })) as any
})

afterAll(() => {
  globalThis.XMLHttpRequest = originalXMLHttpRequest
})

describe('MazDropzone', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(MazDropzone)
    expect(wrapper.exists()).toBe(true)
  })

  it('emits error when file size exceeds maximum', async () => {
    const wrapper = shallowMount(MazDropzone, {
      props: {
        maxFileSize: 1,
      },
    })

    const file = new File(['test'.repeat(1024 * 1024)], 'test.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })
    await input.trigger('change')

    // @ts-expect-error - not typed
    expect(wrapper.emitted('error')?.[0][0]?.code).toBe('FILE_SIZE_EXCEEDED')
  })

  it('emits error when file type is not allowed', async () => {
    const wrapper = shallowMount(MazDropzone, {
      props: {
        dataTypes: ['image/jpeg'],
      },
    })

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })
    await input.trigger('change')

    // @ts-expect-error - not typed
    expect(wrapper.emitted('error')?.[0][0]?.code).toBe('FILE_TYPE_NOT_ALLOWED')
  })

  it('emits add event when valid file is added', async () => {
    const wrapper = shallowMount(MazDropzone)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })
    await input.trigger('change')

    expect(wrapper.emitted('add')?.[0][0]).toBeInstanceOf(File)
  })

  it('prevents duplicate files when allowDuplicates is false', async () => {
    const wrapper = mount(MazDropzone, {
      props: {
        allowDuplicates: false,
        multiple: true,
      },
    })

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })
    await input.trigger('change')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: true,
    })
    await input.trigger('change')

    // @ts-expect-error - not typed
    expect(wrapper.emitted('error')?.[0][0]?.code).toBe('FILE_DUPLICATED')
  })

  it('respects maxFiles limit', async () => {
    const wrapper = mount(MazDropzone, {
      props: {
        maxFiles: 1,
        multiple: true,
      },
    })

    const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' })
    const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' })
    const input = wrapper.find('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file1],
      writable: true,
    })
    await input.trigger('change')

    Object.defineProperty(input.element, 'files', {
      value: [file2],
      writable: true,
    })
    await input.trigger('change')

    // @ts-expect-error - not typed
    expect(wrapper.emitted('error')?.[0][0]?.code).toBe('MAX_FILES_EXCEEDED')
  })
})
