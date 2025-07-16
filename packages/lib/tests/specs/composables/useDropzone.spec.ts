import { useDropzone } from '@composables/useDropzone'
import { createApp, nextTick, ref } from 'vue'

// Mock DragEvent and DataTransfer for testing
class MockDataTransfer {
  files: FileList
  items: DataTransferItemList

  constructor() {
    this.files = [] as any
    this.items = [] as any
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
      const app = createApp({
        setup() {
          const { files, isOverDropZone, isOverError } = useDropzone(mockElement)
          return { files, isOverDropZone, isOverError }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      expect(vm.files).toBeNull()
      expect(vm.isOverDropZone).toBe(false)
      expect(vm.isOverError).toBe(false)

      app.unmount()
    })
  })

  describe('when dragenter event is fired', () => {
    it('then it should set isOverDropZone to true', async () => {
      const app = createApp({
        setup() {
          const { isOverDropZone } = useDropzone(mockElement)
          return { isOverDropZone }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(vm.isOverDropZone).toBe(true)
      app.unmount()
    })
  })

  describe('when dragleave event is fired', () => {
    it('then it should set isOverDropZone to false', async () => {
      const app = createApp({
        setup() {
          const { isOverDropZone } = useDropzone(mockElement)
          return { isOverDropZone }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const enterEvent = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })
      const leaveEvent = new DragEvent('dragleave', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(enterEvent)
      await nextTick()
      expect(vm.isOverDropZone).toBe(true)

      mockElement.dispatchEvent(leaveEvent)
      await nextTick()
      expect(vm.isOverDropZone).toBe(false)

      app.unmount()
    })
  })

  describe('when drop event is fired with files', () => {
    it('then it should set files and call onDrop callback', async () => {
      const onDrop = vi.fn()

      const app = createApp({
        setup() {
          const { files, isOverDropZone } = useDropzone(mockElement, { onDrop })
          return { files, isOverDropZone }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(vm.files).toEqual([file])
      expect(vm.isOverDropZone).toBe(false)
      expect(onDrop).toHaveBeenCalledWith([file], event)

      app.unmount()
    })
  })

  describe('when multiple is false', () => {
    it('then it should only accept one file', async () => {
      const onDrop = vi.fn()

      const app = createApp({
        setup() {
          const { files } = useDropzone(mockElement, { onDrop, multiple: false })
          return { files }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' })
      const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file1)
      dataTransfer.items.add(file2)

      const event = new DragEvent('drop', { dataTransfer })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(vm.files).toEqual([file1])
      expect(onDrop).toHaveBeenCalledWith([file1], event)

      app.unmount()
    })
  })

  describe('when using reactive target', () => {
    it('then it should update event listeners when target changes', async () => {
      const targetRef = ref<HTMLElement | null>(mockElement)

      const app = createApp({
        setup() {
          const { isOverDropZone } = useDropzone(targetRef)
          return { isOverDropZone, targetRef }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })

      mockElement.dispatchEvent(event)
      await nextTick()
      expect(vm.isOverDropZone).toBe(true)

      const newElement = document.createElement('div')
      document.body.appendChild(newElement)
      vm.targetRef = newElement
      await nextTick()

      const leaveEvent = new DragEvent('dragleave', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(leaveEvent)
      await nextTick()

      expect(vm.isOverDropZone).toBe(true)

      document.body.removeChild(newElement)
      app.unmount()
    })
  })

  describe('when using function as options', () => {
    it('then it should treat function as onDrop callback', async () => {
      const onDrop = vi.fn()

      const app = createApp({
        setup() {
          const { files } = useDropzone(mockElement, onDrop)
          return { files }
        },
        template: '<div></div>',
      })

      const vm = app.mount(document.createElement('div'))

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })

      mockElement.dispatchEvent(event)
      await nextTick()

      expect(vm.files).toEqual([file])
      expect(onDrop).toHaveBeenCalledWith([file], event)

      app.unmount()
    })
  })
})
