import { useDropzone } from '@composables/useDropzone'
import { withSetup } from '@tests/helpers/withSetup'
import { nextTick, ref } from 'vue'

// Mock DragEvent and DataTransfer for testing
class MockDataTransfer {
  files: FileList
  items: {
    add: (file: File) => void
    length: number
    [index: number]: { getAsFile: () => File }
  }

  constructor() {
    const fileArray: File[] = []
    this.files = fileArray as unknown as FileList
    this.items = {
      add: (file: File) => {
        fileArray.push(file)

        this.files = fileArray as unknown as FileList
        this.items.length = fileArray.length
        this.items[fileArray.length - 1] = { getAsFile: () => file }
      },
      length: 0,
    }
  }
}

class MockDragEvent extends Event {
  dataTransfer: MockDataTransfer

  constructor(type: string, options: any = {}) {
    super(type, options)
    this.dataTransfer = options.dataTransfer || new MockDataTransfer()
  }
}

vi.stubGlobal('DragEvent', MockDragEvent)
vi.stubGlobal('DataTransfer', MockDataTransfer)

describe('given useDropzone composable', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
  })

  describe('when called with target element', () => {
    it('then it should return dropzone properties', () => {
      const [{ files, isOverDropZone, isOverError }, app] = withSetup(() => useDropzone(mockElement))

      expect(files.value).toBeNull()
      expect(isOverDropZone.value).toBe(false)
      expect(isOverError.value).toBe(false)

      app.unmount()
    })
  })

  describe('when dragenter event is fired', () => {
    it('then it should set isOverDropZone to true', async () => {
      const [{ isOverDropZone }, app] = withSetup(() => useDropzone(mockElement))

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(isOverDropZone.value).toBe(true)
      app.unmount()
    })
  })

  describe('when dragleave event is fired', () => {
    it('then it should set isOverDropZone to false', async () => {
      const [{ isOverDropZone }, app] = withSetup(() => useDropzone(mockElement))

      const enterEvent = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })
      const leaveEvent = new DragEvent('dragleave', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(enterEvent)
      await nextTick()
      expect(isOverDropZone.value).toBe(true)

      mockElement.dispatchEvent(leaveEvent)
      await nextTick()
      expect(isOverDropZone.value).toBe(false)

      app.unmount()
    })
  })

  describe('when drop event is fired with files', () => {
    it('then it should set files and call onDrop callback', async () => {
      const onDrop = vi.fn()

      const [{ files, isOverDropZone }, app] = withSetup(() => useDropzone(mockElement, { onDrop }))

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(files.value).toEqual([file])
      expect(isOverDropZone.value).toBe(false)
      expect(onDrop).toHaveBeenCalledWith([file], event)

      app.unmount()
    })
  })

  describe('when multiple is false', () => {
    it('then it should accept single file but reject multiple files', async () => {
      const onDrop = vi.fn()
      const onError = vi.fn()

      const [{ files }, app] = withSetup(() => useDropzone(mockElement, { onDrop, onError, multiple: false }))

      // Test with single file - should work
      const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' })
      const dataTransferSingle = new DataTransfer()
      dataTransferSingle.items.add(file1)

      const singleFileEvent = new DragEvent('drop', { dataTransfer: dataTransferSingle })
      mockElement.dispatchEvent(singleFileEvent)
      await nextTick()

      expect(files.value).toEqual([file1])
      expect(onDrop).toHaveBeenCalledWith([file1], singleFileEvent)

      // Reset for next test
      files.value = null
      onDrop.mockClear()

      // Test with multiple files - should be rejected
      const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' })
      const dataTransferMultiple = new DataTransfer()
      dataTransferMultiple.items.add(file1)
      dataTransferMultiple.items.add(file2)

      const multipleFilesEvent = new DragEvent('drop', { dataTransfer: dataTransferMultiple })
      mockElement.dispatchEvent(multipleFilesEvent)
      await nextTick()

      expect(files.value).toBeNull() // Should remain null
      expect(onDrop).not.toHaveBeenCalled() // onDrop not called
      expect(onError).toHaveBeenCalled() // onError called instead

      app.unmount()
    })
  })

  describe('when using reactive target', () => {
    it('then it should update event listeners when target changes', async () => {
      const targetRef = ref<HTMLElement | null>(mockElement)

      const [{ isOverDropZone }, app] = withSetup(() => useDropzone(targetRef))

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(event)
      await nextTick()
      expect(isOverDropZone.value).toBe(true)

      const newElement = document.createElement('div')
      document.body.appendChild(newElement)
      targetRef.value = newElement
      await nextTick()

      const leaveEvent = new DragEvent('dragleave', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(leaveEvent)
      await nextTick()

      expect(isOverDropZone.value).toBe(true)

      document.body.removeChild(newElement)
      app.unmount()
    })
  })

  describe('when using function as options', () => {
    it('then it should treat function as onDrop callback', async () => {
      const onDrop = vi.fn()

      const [{ files }, app] = withSetup(() => useDropzone(mockElement, onDrop))

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(files.value).toEqual([file])
      expect(onDrop).toHaveBeenCalledWith([file], event)

      app.unmount()
    })
  })
})
