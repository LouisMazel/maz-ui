import type { Hsva } from '@components/MazColorPicker/color.ts'
import MazColorPickerPanel from '@components/MazColorPicker/MazColorPickerPanel.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

const labels = {
  area: 'Area',
  areaValue: (saturation: number, brightness: number) => `S${saturation} B${brightness}`,
  hue: 'Hue',
  alpha: 'Opacity',
  eyeDropper: 'Eye dropper',
  swatches: 'Presets',
  selectSwatch: (color: string) => `Select ${color}`,
}

const red: Hsva = { h: 0, s: 1, v: 1, a: 1 }
const target: Hsva = { h: 200, s: 0.5, v: 0.5, a: 0.5 }

async function mountPanel(global: Record<string, unknown> = {}) {
  const wrapper = mount(MazColorPickerPanel, {
    props: { id: 'picker', labels, modelValue: red, swatches: ['#ff0000', '#3366cc'] },
    attachTo: document.body,
    global,
  })

  await flushPromises()
  await vi.dynamicImportSettled()
  await flushPromises()

  const area = wrapper.find('[role="slider"]').element as HTMLElement

  area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 200, right: 100, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect

  return wrapper
}

describe('given MazColorPickerPanel glide', () => {
  let animate: ReturnType<typeof vi.fn>
  let frames: FrameRequestCallback[]

  beforeEach(() => {
    animate = vi.fn()
    frames = []
    HTMLElement.prototype.animate = animate as never
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).animate
    document.body.innerHTML = ''
  })

  describe('when a preset is picked', () => {
    it('then the thumb glides from its old position to the new one', async () => {
      const wrapper = await mountPanel()

      await wrapper.findAll('.m-color-picker-panel__swatch')[1]!.trigger('click')
      await wrapper.setProps({ modelValue: target })

      expect(animate).toHaveBeenCalledTimes(1)
      expect(animate.mock.calls[0]![0]).toEqual([
        { transform: 'translate(50px, -100px)' },
        { transform: 'translate(0, 0)' },
      ])
    })

    it('then the hue and opacity sliders move through the values', async () => {
      const wrapper = await mountPanel()

      await wrapper.findAll('.m-color-picker-panel__swatch')[1]!.trigger('click')
      await wrapper.setProps({ modelValue: target })

      expect(frames).toHaveLength(1)

      frames[0]!(performance.now() + 10_000)
      await flushPromises()

      expect(wrapper.find<HTMLInputElement>('#picker-hue').element.value).toBe('200')
      expect(wrapper.find<HTMLInputElement>('#picker-alpha').element.value).toBe('50')
    })
  })

  describe('when the color changes without a pick', () => {
    it('then nothing glides', async () => {
      const wrapper = await mountPanel()

      await wrapper.setProps({ modelValue: target })

      expect(animate).not.toHaveBeenCalled()
      expect(frames).toHaveLength(0)
    })

    it('then a slider input cancels a pending glide', async () => {
      const wrapper = await mountPanel()

      await wrapper.findAll('.m-color-picker-panel__swatch')[1]!.trigger('click')
      await wrapper.find('#picker-hue').setValue('90')
      await wrapper.setProps({ modelValue: target })

      expect(animate).not.toHaveBeenCalled()
    })
  })

  describe('when the motion is reduced', () => {
    it('then the thumb does not glide', async () => {
      const wrapper = await mountPanel({ provide: { [MAZ_UI_CONTEXT_INJECTION_KEY as symbol]: { motion: 'reduced' } } })

      await wrapper.findAll('.m-color-picker-panel__swatch')[1]!.trigger('click')
      await wrapper.setProps({ modelValue: target })

      expect(animate).not.toHaveBeenCalled()
    })
  })
})
