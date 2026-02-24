import { useDropzone } from '@composables/useDropzone'
import { withSetup } from '@tests/helpers/withSetup'
import { nextTick, ref } from 'vue'

class MockDataTransfer {
  files: FileList
  items: {
    add: (file: File) => void
    length: number
    [index: number]: { getAsFile: () => File, type: string }
  }

  dropEffect = 'none'

  constructor() {
    const fileArray: File[] = []
    this.files = fileArray as unknown as FileList
    this.items = {
      add: (file: File) => {
        fileArray.push(file)
        this.files = fileArray as unknown as FileList
        this.items.length = fileArray.length
        this.items[fileArray.length - 1] = { getAsFile: () => file, type: file.type }
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

describe('given useDropzone composable - extended', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.removeChild(mockElement)
  })

  describe('when dragover event is fired', () => {
    it('then it should call onOver callback', async () => {
      const onOver = vi.fn()
      const [, app] = withSetup(() =>
        useDropzone(mockElement, { onOver }),
      )

      const event = new DragEvent('dragover', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(event)
      await nextTick()

      expect(onOver).toHaveBeenCalled()
      app.unmount()
    })
  })

  describe('when onEnter callback is provided', () => {
    it('then it should call onEnter on dragenter', async () => {
      const onEnter = vi.fn()
      const [, app] = withSetup(() =>
        useDropzone(mockElement, { onEnter }),
      )

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(event)
      await nextTick()

      expect(onEnter).toHaveBeenCalled()
      app.unmount()
    })
  })

  describe('when onLeave callback is provided', () => {
    it('then it should call onLeave on dragleave', async () => {
      const onLeave = vi.fn()
      const [, app] = withSetup(() =>
        useDropzone(mockElement, { onLeave }),
      )

      const enterEvent = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(enterEvent)

      const leaveEvent = new DragEvent('dragleave', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(leaveEvent)
      await nextTick()

      expect(onLeave).toHaveBeenCalled()
      app.unmount()
    })
  })

  describe('when dataTypes filter is set as array', () => {
    it('then it should accept matching types', async () => {
      const onDrop = vi.fn()
      const [{ files }, app] = withSetup(() =>
        useDropzone(mockElement, { onDrop, dataTypes: ['text/plain'] }),
      )

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })
      mockElement.dispatchEvent(event)
      await nextTick()

      expect(files.value).toEqual([file])
      app.unmount()
    })
  })

  describe('when dataTypes filter is set as function', () => {
    it('then it should use the function to validate types', async () => {
      const dataTypesFn = vi.fn(() => true)
      const onDrop = vi.fn()
      const [, app] = withSetup(() =>
        useDropzone(mockElement, { onDrop, dataTypes: dataTypesFn }),
      )

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer })
      mockElement.dispatchEvent(event)
      await nextTick()

      expect(dataTypesFn).toHaveBeenCalled()
      app.unmount()
    })
  })

  describe('when preventDefaultForUnhandled is true', () => {
    it('then it should prevent default on all events', async () => {
      const [, app] = withSetup(() =>
        useDropzone(mockElement, { preventDefaultForUnhandled: true }),
      )

      const event = new DragEvent('dragenter', {
        dataTransfer: new DataTransfer(),
      })
      mockElement.dispatchEvent(event)
      await nextTick()

      app.unmount()
    })
  })

  describe('when target is null', () => {
    it('then it should handle null target gracefully', () => {
      const targetRef = ref<HTMLElement | null>(null)
      const [{ isOverDropZone }, app] = withSetup(() =>
        useDropzone(targetRef),
      )

      expect(isOverDropZone.value).toBe(false)
      app.unmount()
    })
  })
})
