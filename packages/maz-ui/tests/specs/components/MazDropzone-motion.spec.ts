import MazDropzone from '@components/MazDropzone.vue'
import { flushPromises, mount } from '@vue/test-utils'

URL.createObjectURL = vi.fn(() => 'blob:mock')
URL.revokeObjectURL = vi.fn()

const file = new File(['content'], 'photo.png', { type: 'image/png' })

function createFileData(extra: Record<string, unknown> = {}) {
  return {
    file,
    name: 'photo.png',
    size: 7,
    sizeInMb: '0.01',
    type: 'image/png',
    ...extra,
  }
}

async function mountDropzone(files: Record<string, unknown>[] = []) {
  const wrapper = mount(MazDropzone, { props: { modelValue: [] } as never, attachTo: document.body })

  await flushPromises()

  if (files.length > 0)
    await wrapper.setProps({ modelValue: files } as never)

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given MazDropzone motion', () => {
  describe('when a file is dragged over the zone', () => {
    it('then a marching border is drawn', async () => {
      const wrapper = await mountDropzone()

      expect(wrapper.find('.m-dropzone__march').exists()).toBe(false)

      ;(wrapper.vm as unknown as { isOverDropZone: boolean }).isOverDropZone = true
      await flushPromises()

      const march = wrapper.find('.m-dropzone__march')

      expect(march.exists()).toBe(true)
      expect(march.attributes('aria-hidden')).toBe('true')
    })

    it('then the border is not drawn when the file is refused', async () => {
      const wrapper = await mountDropzone()
      const vm = wrapper.vm as unknown as { isOverDropZone: boolean, isOverError: boolean }

      vm.isOverDropZone = true
      vm.isOverError = true
      await flushPromises()

      expect(wrapper.find('.m-dropzone__march').exists()).toBe(false)
    })
  })

  describe('when a file is uploading with a progress', () => {
    it('then a progress bar reflects it', async () => {
      const wrapper = await mountDropzone([createFileData({ uploading: true, progress: 40 })])
      const progress = wrapper.find('.m-dropzone__progress')

      expect(progress.attributes('role')).toBe('progressbar')
      expect(progress.attributes('aria-valuenow')).toBe('40')
      expect(progress.attributes('aria-label')).toBe('photo.png')
      expect(wrapper.find('.m-dropzone__progress-bar').attributes('style')).toContain('scaleX(0.4)')
    })

    it('then the progress is clamped between 0 and 100', async () => {
      const wrapper = await mountDropzone([createFileData({ uploading: true, progress: 250 })])

      expect(wrapper.find('.m-dropzone__progress-bar').attributes('style')).toContain('scaleX(1)')
    })
  })

  describe('when a file has no progress or is not uploading', () => {
    it('then no progress bar is rendered', async () => {
      const wrapper = await mountDropzone([
        createFileData({ uploading: true }),
        createFileData({ name: 'other.png', uploading: false, progress: 50 }),
      ])

      expect(wrapper.find('.m-dropzone__progress').exists()).toBe(false)
    })
  })
})
