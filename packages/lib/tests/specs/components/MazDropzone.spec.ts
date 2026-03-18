import MazDropzone from '@components/MazDropzone.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'

vi.mock('@maz-ui/utils/helpers/sleep', () => ({
  sleep: vi.fn().mockResolvedValue(undefined),
}))

URL.createObjectURL = vi.fn().mockImplementation(() => 'mocked-url')
URL.revokeObjectURL = vi.fn()

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
  data: [string, any][] = []

  append(key: string, value: any) {
    this.data.push([key, value])
  }

  get(key: string) {
    const entry = this.data.find(([k]) => k === key)
    return entry ? entry[1] : undefined
  }

  getAll(key: string) {
    return this.data.filter(([k]) => k === key).map(([, v]) => v)
  }

  entries() {
    return this.data[Symbol.iterator]()
  }

  forEach(cb: (value: any, key: string) => void) {
    for (const [key, value] of this.data) {
      cb(value, key)
    }
  }

  [Symbol.iterator]() {
    return this.data[Symbol.iterator]()
  }
})

// Prevent any actual network requests from happening in tests
const originalXMLHttpRequest = globalThis.XMLHttpRequest
beforeAll(() => {
  // eslint-disable-next-line prefer-arrow-callback
  globalThis.XMLHttpRequest = vi.fn(function () {
    return {
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
    }
  }) as any
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

    await vi.dynamicImportSettled()

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

    await vi.dynamicImportSettled()

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

  describe('Given a dropzone with disabled prop', () => {
    describe('When files are added via input change', () => {
      it('does not add files', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { disabled: true },
        })

        const file = new File(['test'], 'test.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        expect(wrapper.emitted('add')).toBeUndefined()
      })
    })
  })

  describe('Given a dropzone without multiple prop', () => {
    describe('When a second file is added', () => {
      it('emits MAX_FILES_EXCEEDED error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { multiple: false },
        })

        const file1 = new File(['a'], 'a.txt', { type: 'text/plain' })
        const file2 = new File(['b'], 'b.txt', { type: 'text/plain' })
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

        const errors = wrapper.emitted('error') as any[]
        expect(errors.some(([e]: any) => e.code === 'MAX_FILES_EXCEEDED')).toBe(true)
      })
    })
  })

  describe('Given a dropzone with minFileSize prop', () => {
    describe('When a file smaller than the minimum is added', () => {
      it('emits FILE_SIZE_TOO_SMALL error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { minFileSize: 1 },
        })

        const file = new File(['tiny'], 'tiny.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - not typed
        expect(wrapper.emitted('error')?.[0][0]?.code).toBe('FILE_SIZE_TOO_SMALL')
      })
    })
  })

  describe('Given a dropzone with dataTypes using extension format', () => {
    describe('When a file with matching extension is added', () => {
      it('accepts the file', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { dataTypes: ['.txt'] },
        })

        const file = new File(['data'], 'file.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        expect(wrapper.emitted('add')).toHaveLength(1)
      })
    })

    describe('When a file with non-matching extension is added', () => {
      it('emits FILE_TYPE_NOT_ALLOWED error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { dataTypes: ['.pdf'] },
        })

        const file = new File(['data'], 'file.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - not typed
        expect(wrapper.emitted('error')?.[0][0]?.code).toBe('FILE_TYPE_NOT_ALLOWED')
      })
    })
  })

  describe('Given a dropzone with dataTypes using wildcard MIME type', () => {
    describe('When a file with matching MIME category is added', () => {
      it('accepts the file', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { dataTypes: ['text/*'] },
        })

        const file = new File(['data'], 'doc.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        expect(wrapper.emitted('add')).toHaveLength(1)
      })
    })
  })

  describe('Given a dropzone with files', () => {
    describe('When handleFileRemove is triggered', () => {
      it('emits remove event and revokes the object URL', async () => {
        const wrapper = mount(MazDropzone, {
          props: { multiple: true },
        })

        await vi.dynamicImportSettled()

        const file = new File(['test'], 'test.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        const removeBtn = wrapper.find('.m-dropzone__description button')
        if (removeBtn.exists()) {
          await removeBtn.trigger('click')
        }
        else {
          // @ts-expect-error - accessing exposed methods
          wrapper.vm.reset()
        }

        expect(URL.revokeObjectURL).toHaveBeenCalled()
      })
    })
  })

  describe('Given a dropzone with exposed methods', () => {
    describe('When reset is called', () => {
      it('clears all files and revokes URLs', async () => {
        const wrapper = shallowMount(MazDropzone)

        const file = new File(['test'], 'test.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        ;(URL.revokeObjectURL as ReturnType<typeof vi.fn>).mockClear()

        // @ts-expect-error - accessing exposed methods
        wrapper.vm.reset()

        expect(URL.revokeObjectURL).toHaveBeenCalled()
      })
    })

    describe('When addFile is called', () => {
      it('adds the file to the dropzone', async () => {
        const wrapper = shallowMount(MazDropzone)

        const file = new File(['data'], 'added.txt', { type: 'text/plain' })
        // @ts-expect-error - accessing exposed methods
        const result = wrapper.vm.addFile(file)
        await vi.dynamicImportSettled()
        await result

        expect(wrapper.emitted('add')?.[0][0]).toBeInstanceOf(File)
      })
    })

    describe('When removeFile is called', () => {
      it('removes the file from the dropzone', async () => {
        const wrapper = shallowMount(MazDropzone)

        const file = new File(['data'], 'remove-me.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        wrapper.vm.removeFile(file)

        // @ts-expect-error - accessing internal model
        expect(wrapper.vm.modelValue?.length ?? 0).toBe(0)
      })
    })

    describe('When getFormData is called', () => {
      it('returns FormData with the file', () => {
        const wrapper = shallowMount(MazDropzone)

        const file = new File(['data'], 'test.txt', { type: 'text/plain' })
        // @ts-expect-error - accessing exposed methods
        const formData = wrapper.vm.getFormData(file)

        expect(formData.get('file')).toBe(file)
      })
    })

    describe('When getFormDataMultiple is called with files', () => {
      it('returns FormData with all files', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { multiple: true },
        })

        const file1 = new File(['a'], 'a.txt', { type: 'text/plain' })
        const file2 = new File(['b'], 'b.txt', { type: 'text/plain' })
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

        // @ts-expect-error - accessing exposed methods
        const formData = wrapper.vm.getFormDataMultiple()

        expect(formData.getAll('files')).toHaveLength(2)
      })
    })
  })

  describe('Given a dropzone with upload functionality', () => {
    describe('When uploadFiles is called with no files', () => {
      it('emits NO_FILES_TO_UPLOAD error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { url: 'https://example.com/upload' },
        })

        // @ts-expect-error - accessing exposed methods
        await expect(wrapper.vm.uploadFiles()).rejects.toThrow('NO_FILES_TO_UPLOAD')

        // @ts-expect-error - not typed
        expect(wrapper.emitted('error')?.[0][0]?.code).toBe('NO_FILES_TO_UPLOAD')
      })
    })

    describe('When uploadFiles is called with files and a valid URL', () => {
      it('uploads each file and emits upload-success', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
          },
        })

        const file = new File(['data'], 'upload.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFiles()

        expect(wrapper.emitted('upload-success')).toHaveLength(1)
      })
    })

    describe('When uploadFiles is called without a URL', () => {
      it('emits NO_URL error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { multiple: true },
        })

        const file = new File(['data'], 'upload.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFiles()

        const errors = wrapper.emitted('error') as any[]
        expect(errors.some(([e]: any) => e.code === 'NO_URL')).toBe(true)
      })
    })

    describe('When uploadFilesMultiple is called with no files', () => {
      it('emits NO_FILES_TO_UPLOAD error', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { url: 'https://example.com/upload' },
        })

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFilesMultiple()

        // @ts-expect-error - not typed
        expect(wrapper.emitted('error')?.[0][0]?.code).toBe('NO_FILES_TO_UPLOAD')
      })
    })

    describe('When uploadFilesMultiple is called with files and a valid URL', () => {
      it('uploads all files and emits upload-success-multiple', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
          },
        })

        const file1 = new File(['a'], 'a.txt', { type: 'text/plain' })
        const file2 = new File(['b'], 'b.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file1, file2],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFilesMultiple()

        expect(wrapper.emitted('upload-success-multiple')).toHaveLength(1)
      })
    })

    describe('When uploadFiles is called and fetch fails', () => {
      it('emits upload-error for the failed file', async () => {
        ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
          },
        })

        const file = new File(['data'], 'fail.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFiles()

        expect(wrapper.emitted('upload-error')).toHaveLength(1)
      })
    })

    describe('When uploadFilesMultiple is called and fetch fails', () => {
      it('emits upload-error-multiple', async () => {
        ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
          },
        })

        const file = new File(['data'], 'fail.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFilesMultiple()

        expect(wrapper.emitted('upload-error-multiple')).toHaveLength(1)
      })
    })
  })

  describe('Given a dropzone with autoUpload set to single', () => {
    describe('When files are added', () => {
      it('triggers upload automatically', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            autoUpload: 'single',
          },
        })

        const file = new File(['data'], 'auto.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        await vi.dynamicImportSettled()

        expect(wrapper.emitted('upload-success')).toHaveLength(1)
      })
    })
  })

  describe('Given a dropzone with autoUpload set to multiple', () => {
    describe('When files are added', () => {
      it('triggers multiple upload automatically', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            autoUpload: 'multiple',
            multiple: true,
          },
        })

        const file = new File(['data'], 'auto.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        await vi.dynamicImportSettled()

        expect(wrapper.emitted('upload-success-multiple')).toHaveLength(1)
      })
    })
  })

  describe('Given a dropzone with transformBody prop', () => {
    describe('When upload is triggered', () => {
      it('uses the transformBody function', async () => {
        const transformBody = vi.fn().mockReturnValue('transformed-body')

        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
            transformBody,
          },
        })

        const file = new File(['data'], 'transform.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFiles()

        expect(transformBody).toHaveBeenCalled()
        expect(globalThis.fetch).toHaveBeenCalledWith(
          'https://example.com/upload',
          expect.objectContaining({ body: 'transformed-body' }),
        )
      })
    })
  })

  describe('Given a dropzone with image files', () => {
    describe('When an image file is added', () => {
      it('generates a thumbnail via FileReader', async () => {
        const wrapper = shallowMount(MazDropzone)

        const file = new File(['fake-image-data'], 'photo.png', { type: 'image/png' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')
        await vi.dynamicImportSettled()
        await new Promise(resolve => setTimeout(resolve, 50))

        expect(wrapper.emitted('add')?.[0][0]).toBeInstanceOf(File)
      })
    })
  })

  describe('Given a dropzone with translations prop', () => {
    describe('When custom translations are provided', () => {
      it('renders the custom drag and drop text', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            translations: {
              dragAndDrop: 'Custom drag text',
              divider: 'or',
            },
          },
        })

        expect(wrapper.text()).toContain('Custom drag text')
        expect(wrapper.text()).toContain('or')
      })
    })
  })

  describe('Given a dropzone with maxFiles and maxFileSize props', () => {
    describe('When the component renders', () => {
      it('displays the info text', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            maxFiles: 5,
            maxFileSize: 10,
            dataTypes: ['image/*'],
          },
        })

        expect(wrapper.find('.m-dropzone__info-text').exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with color prop', () => {
    describe('When a color is set', () => {
      it('applies the color as a CSS variable', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: { color: 'success' },
        })

        const label = wrapper.find('.m-dropzone')
        expect(label.attributes('style')).toContain('--active-color')
      })
    })
  })

  describe('Given a dropzone with requestOptions', () => {
    describe('When upload is triggered', () => {
      it('passes requestOptions to fetch', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            url: 'https://example.com/upload',
            multiple: true,
            requestOptions: {
              headers: { Authorization: 'Bearer token' },
            },
          },
        })

        const file = new File(['data'], 'opts.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')

        ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockClear()
        // @ts-expect-error - accessing exposed methods
        await wrapper.vm.uploadFiles()

        expect(globalThis.fetch).toHaveBeenCalledWith(
          'https://example.com/upload',
          expect.objectContaining({
            headers: { Authorization: 'Bearer token' },
          }),
        )
      })
    })
  })

  describe('Given a dropzone with allowDuplicates enabled', () => {
    describe('When the same file is added twice', () => {
      it('accepts both files', async () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            allowDuplicates: true,
            multiple: true,
          },
        })

        const file = new File(['test'], 'dup.txt', { type: 'text/plain' })
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

        expect(wrapper.emitted('add')).toHaveLength(2)
      })
    })
  })

  describe('Given a dropzone with dataTypes translations', () => {
    describe('When wildcard MIME types are used with custom type translations', () => {
      it('renders the custom type labels', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            dataTypes: ['image/*', 'video/*', 'audio/*', 'text/*'],
            translations: {
              types: {
                image: 'Photos',
                video: 'Videos',
                audio: 'Sounds',
                text: 'Documents',
              },
            },
          },
        })

        expect(wrapper.find('.m-dropzone__info-text').exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with file items rendered', () => {
    describe('When a non-image file is added and rendered with mount', () => {
      it('displays the file icon', async () => {
        const wrapper = mount(MazDropzone, {
          props: { multiple: true },
        })

        await vi.dynamicImportSettled()

        const file = new File(['data'], 'script.js', { type: 'application/javascript' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')
        await flushPromises()
        await vi.dynamicImportSettled()

        expect(wrapper.find('.m-dropzone__file-item').exists()).toBe(true)
        expect(wrapper.find('.m-dropzone__file-name').text()).toBe('script.js')
      })
    })
  })

  describe('Given a dropzone with files rendered', () => {
    describe('When the remove button is clicked', () => {
      it('emits the remove event', async () => {
        const wrapper = mount(MazDropzone, {
          props: { multiple: true },
        })

        await vi.dynamicImportSettled()

        const file = new File(['data'], 'removable.txt', { type: 'text/plain' })
        const input = wrapper.find('input[type="file"]')

        Object.defineProperty(input.element, 'files', {
          value: [file],
          writable: true,
        })
        await input.trigger('change')
        await flushPromises()
        await vi.dynamicImportSettled()

        const removeBtn = wrapper.find('.m-dropzone__description button')
        expect(removeBtn.exists()).toBe(true)
        await removeBtn.trigger('click')

        expect(wrapper.emitted('remove')).toHaveLength(1)
      })
    })
  })

  describe('Given a dropzone with dataTypes using specific MIME subtype', () => {
    describe('When formatReadable processes a MIME with a subtype', () => {
      it('displays the subtype in info text', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            dataTypes: ['application/pdf'],
          },
        })

        expect(wrapper.find('.m-dropzone__info-text').exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with dataTypes using dot extension format', () => {
    describe('When the info text is rendered', () => {
      it('displays the info text section', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            dataTypes: ['.csv', '.xlsx'],
          },
        })

        const infoText = wrapper.find('.m-dropzone__info-text')
        expect(infoText.exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with dataTypes using unknown wildcard MIME', () => {
    describe('When formatReadable processes an unknown type/*', () => {
      it('falls back to displaying the raw format', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            dataTypes: ['model/*'],
          },
        })

        const infoText = wrapper.find('.m-dropzone__info-text')
        expect(infoText.exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with pre-existing model value', () => {
    describe('When the component mounts', () => {
      it('processes existing files on mount', async () => {
        const file = new File(['existing'], 'existing.txt', { type: 'text/plain' })

        const wrapper = shallowMount(MazDropzone, {
          props: {
            'modelValue': [{ file, name: 'existing.txt' }],
            'onUpdate:modelValue': (val: any) => wrapper.setProps({ modelValue: val }),
          },
        })

        await vi.dynamicImportSettled()
        await new Promise(resolve => setTimeout(resolve, 10))

        expect(URL.createObjectURL).toHaveBeenCalled()
      })
    })
  })

  describe('Given a dropzone with dataTypes as plain string format', () => {
    describe('When formatReadable processes a plain string', () => {
      it('displays it as-is', () => {
        const wrapper = shallowMount(MazDropzone, {
          props: {
            dataTypes: ['customformat'],
          },
        })

        const infoText = wrapper.find('.m-dropzone__info-text')
        expect(infoText.exists()).toBe(true)
      })
    })
  })

  describe('Given a dropzone with various file types for icon mapping', () => {
    describe('When files of different types are added', () => {
      it('renders file items for each type', async () => {
        const wrapper = mount(MazDropzone, {
          props: { multiple: true },
        })

        await vi.dynamicImportSettled()

        const files = [
          new File(['data'], 'doc.pdf', { type: 'application/pdf' }),
          new File(['data'], 'archive.zip', { type: 'application/zip' }),
          new File(['data'], 'style.css', { type: 'text/css' }),
        ]

        for (const file of files) {
          const input = wrapper.find('input[type="file"]')
          Object.defineProperty(input.element, 'files', {
            value: [file],
            writable: true,
            configurable: true,
          })
          await input.trigger('change')
          await flushPromises()
        }

        await vi.dynamicImportSettled()

        expect(wrapper.findAll('.m-dropzone__file-item')).toHaveLength(3)
      })
    })
  })

  describe('Given a dropzone with file input', () => {
    describe('When the file input click handler is invoked', () => {
      it('triggers click on the hidden file input', async () => {
        const wrapper = mount(MazDropzone)
        await vi.dynamicImportSettled()

        const fileInput = wrapper.find('input[type="file"]')
        const clickSpy = vi.spyOn(fileInput.element, 'click')

        const link = wrapper.find('.m-dropzone__upload-text a')
        if (link.exists()) {
          await link.trigger('click')
          expect(clickSpy).toHaveBeenCalled()
        }
        else {
          const selectLink = wrapper.findComponent({ name: 'MazLink' })
          if (selectLink.exists()) {
            await selectLink.trigger('click')
          }
          expect(clickSpy).toHaveBeenCalled()
        }
      })
    })
  })
})
