import type { Hsva } from '@components/MazColorPicker/color'
import MazColorPickerPanel from '@components/MazColorPicker/MazColorPickerPanel.vue'
import { flushPromises, mount } from '@vue/test-utils'

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

async function mountPanel(props: Record<string, unknown> = {}, modelValue: Hsva = red) {
  const wrapper = mount(MazColorPickerPanel, {
    props: {
      id: 'picker',
      labels,
      modelValue,
      ...props,
    },
    slots: { default: '<span class="slot-content">slot</span>' },
    attachTo: document.body,
  })
  await flushPromises()
  await vi.dynamicImportSettled()
  await flushPromises()
  return wrapper
}

function lastModel(wrapper: Awaited<ReturnType<typeof mountPanel>>) {
  const events = wrapper.emitted('update:modelValue') as Hsva[][]
  return events.at(-1)![0]
}

function mockArea(wrapper: Awaited<ReturnType<typeof mountPanel>>, rect = {
  left: 10,
  top: 20,
  width: 100,
  height: 200,
}) {
  const area = wrapper.find('[role="slider"]').element as HTMLElement
  area.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  })
  return area
}

function pointerEvent(type: string, init: Record<string, unknown> = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, {
    button: 0,
    pointerId: 1,
    clientX: 0,
    clientY: 0,
    ...init,
  })
  return event
}

afterEach(() => {
  vi.unstubAllGlobals()
  delete (globalThis as unknown as Record<string, unknown>).EyeDropper
  document.body.innerHTML = ''
})

describe('given MazColorPickerPanel component', () => {
  describe('when rendered with default props', () => {
    it('then it renders the area slider with its aria attributes', async () => {
      const wrapper = await mountPanel({}, { h: 0, s: 0.4, v: 0.7, a: 1 })
      const area = wrapper.find('[role="slider"]')

      expect(area.attributes('id')).toBe('picker-area')
      expect(area.attributes('tabindex')).toBe('0')
      expect(area.attributes('aria-label')).toBe('Area')
      expect(area.attributes('aria-valuemin')).toBe('0')
      expect(area.attributes('aria-valuemax')).toBe('100')
      expect(area.attributes('aria-valuenow')).toBe('40')
      expect(area.attributes('aria-valuetext')).toBe('S40 B70')
      expect(area.attributes('aria-disabled')).toBeUndefined()
    })

    it('then it renders the hue and alpha sliders and the default slot', async () => {
      const wrapper = await mountPanel({}, { h: 120.4, s: 1, v: 1, a: 0.5 })
      const hue = wrapper.find<HTMLInputElement>('#picker-hue')
      const alpha = wrapper.find<HTMLInputElement>('#picker-alpha')

      expect(hue.element.value).toBe('120')
      expect(hue.attributes('aria-label')).toBe('Hue')
      expect(hue.attributes('aria-valuetext')).toBe('120°')
      expect(alpha.element.value).toBe('50')
      expect(alpha.attributes('aria-label')).toBe('Opacity')
      expect(alpha.attributes('aria-valuetext')).toBe('50%')
      expect(wrapper.find('.slot-content').exists()).toBe(true)
    })

    it('then it positions the thumb and previews the color', async () => {
      const wrapper = await mountPanel({}, { h: 0, s: 0.25, v: 0.75, a: 1 })
      const thumb = wrapper.find('.m-color-picker-panel__area-thumb')

      expect(thumb.attributes('style')).toContain('left: 25%')
      expect(thumb.attributes('style')).toContain('top: 25%')
      expect(wrapper.find('.m-color-picker-panel__area').attributes('style')).toContain('rgb(255, 0, 0)')
    })

    it('then no swatches and no eye dropper are rendered', async () => {
      const wrapper = await mountPanel()

      expect(wrapper.find('.m-color-picker-panel__swatches').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Eye dropper"]').exists()).toBe(false)
    })
  })

  describe('when the thumb color is light or dark', () => {
    it('then the border class follows the luminance', async () => {
      const light = await mountPanel({}, { h: 0, s: 0, v: 1, a: 1 })
      const dark = await mountPanel({}, { h: 0, s: 1, v: 0.2, a: 1 })

      expect(light.find('.m-color-picker-panel__area-thumb').classes()).toContain('maz:border-foreground')
      expect(dark.find('.m-color-picker-panel__area-thumb').classes()).toContain('maz:border-white')
    })
  })

  describe('when alpha is false', () => {
    it('then the alpha slider is not rendered', async () => {
      const wrapper = await mountPanel({ alpha: false })

      expect(wrapper.find('#picker-alpha').exists()).toBe(false)
    })
  })

  describe('when disabled', () => {
    it('then everything is disabled and nothing is emitted', async () => {
      const wrapper = await mountPanel({
        disabled: true,
        swatches: ['#ff0000', '#00ff00'],
      })
      const area = mockArea(wrapper)

      expect(wrapper.classes()).toContain('--disabled')
      expect(wrapper.find('[role="slider"]').attributes('aria-disabled')).toBe('true')
      expect(wrapper.find('#picker-hue').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#picker-alpha').attributes('disabled')).toBeDefined()
      expect(wrapper.findAll('.m-color-picker-panel__swatch').every(swatch => swatch.attributes('disabled') !== undefined)).toBe(true)

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: 50, clientY: 50 }))
      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      await wrapper.find('#picker-hue').setValue('90')
      await wrapper.find('.m-color-picker-panel__swatch').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('pick')).toBeUndefined()
    })
  })

  describe('when the pointer is pressed on the area', () => {
    it('then it focuses the area, captures the pointer and updates saturation and brightness', async () => {
      const wrapper = await mountPanel({}, { h: 200, s: 0, v: 0, a: 0.5 })
      const area = mockArea(wrapper)
      area.setPointerCapture = vi.fn()
      const focus = vi.spyOn(area, 'focus')

      const event = pointerEvent('pointerdown', { clientX: 60, clientY: 120 })
      area.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
      expect(focus).toHaveBeenCalled()
      expect(area.setPointerCapture).toHaveBeenCalledWith(1)
      expect(lastModel(wrapper)).toEqual({ h: 200, s: 0.5, v: 0.5, a: 0.5 })
    })

    it('then values outside of the area are clamped', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper)

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: -500, clientY: 9999 }))
      expect(lastModel(wrapper)).toMatchObject({ s: 0, v: 0 })

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: 9999, clientY: -500 }))
      expect(lastModel(wrapper)).toMatchObject({ s: 1, v: 1 })
    })

    it('then it works without setPointerCapture', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper)

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: 60, clientY: 120 }))

      expect(lastModel(wrapper)).toMatchObject({ s: 0.5, v: 0.5 })
    })

    it('then a non primary button is ignored', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper)

      area.dispatchEvent(pointerEvent('pointerdown', { button: 2, clientX: 60, clientY: 120 }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then an area without size is ignored', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper, { left: 0, top: 0, width: 0, height: 0 })

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: 60, clientY: 120 }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then an area without height is ignored', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper, {
        left: 0,
        top: 0,
        width: 100,
        height: 0,
      })

      area.dispatchEvent(pointerEvent('pointerdown', { clientX: 60, clientY: 120 }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when the pointer moves', () => {
    it('then it updates only while the pointer is captured', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper)
      area.hasPointerCapture = vi.fn(() => false)

      area.dispatchEvent(pointerEvent('pointermove', { clientX: 60, clientY: 120 }))
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      area.hasPointerCapture = vi.fn(() => true)
      area.dispatchEvent(pointerEvent('pointermove', { clientX: 35, clientY: 70 }))

      expect(lastModel(wrapper)).toMatchObject({ s: 0.25, v: 0.75 })
    })

    it('then it does nothing without hasPointerCapture', async () => {
      const wrapper = await mountPanel()
      const area = mockArea(wrapper)

      area.dispatchEvent(pointerEvent('pointermove', { clientX: 35, clientY: 70 }))

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when keys are pressed on the area', () => {
    it.each([
      [
        'ArrowRight',
        { s: 0.51, v: 0.5 },
      ],
      [
        'ArrowLeft',
        { s: 0.49, v: 0.5 },
      ],
      [
        'ArrowUp',
        { s: 0.5, v: 0.51 },
      ],
      [
        'ArrowDown',
        { s: 0.5, v: 0.49 },
      ],
    ])('then %s moves by a small step', async (key, expected) => {
      const wrapper = await mountPanel({}, { h: 10, s: 0.5, v: 0.5, a: 1 })

      await wrapper.find('[role="slider"]').trigger('keydown', { key })

      const model = lastModel(wrapper)
      expect(model.s).toBeCloseTo(expected.s, 5)
      expect(model.v).toBeCloseTo(expected.v, 5)
      expect(model.h).toBe(10)
    })

    it('then shift uses a large step', async () => {
      const wrapper = await mountPanel({}, { h: 10, s: 0.5, v: 0.5, a: 1 })

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight', shiftKey: true })

      expect(lastModel(wrapper).s).toBeCloseTo(0.6, 5)
    })

    it('then the values stay between 0 and 1', async () => {
      const wrapper = await mountPanel({}, { h: 10, s: 1, v: 0, a: 1 })

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
      expect(lastModel(wrapper).s).toBe(1)

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowDown' })
      expect(lastModel(wrapper).v).toBe(0)
    })

    it('then other keys are ignored', async () => {
      const wrapper = await mountPanel()

      await wrapper.find('[role="slider"]').trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when the hue and alpha sliders change', () => {
    it('then the hue is emitted as a number', async () => {
      const wrapper = await mountPanel({}, { h: 0, s: 0.3, v: 0.4, a: 0.9 })

      await wrapper.find('#picker-hue').setValue('240')

      expect(lastModel(wrapper)).toEqual({ h: 240, s: 0.3, v: 0.4, a: 0.9 })
    })

    it('then the alpha is emitted between 0 and 1', async () => {
      const wrapper = await mountPanel({}, { h: 0, s: 0.3, v: 0.4, a: 0.9 })

      await wrapper.find('#picker-alpha').setValue('25')

      expect(lastModel(wrapper)).toEqual({ h: 0, s: 0.3, v: 0.4, a: 0.25 })
    })
  })

  describe('when swatches are provided', () => {
    it('then each swatch is rendered with its label and title', async () => {
      const wrapper = await mountPanel({
        swatches: ['#ff0000', 'rgb(0 0 255)', 'invalid'],
      })
      const swatches = wrapper.findAll('.m-color-picker-panel__swatch')
      const group = wrapper.find('[role="group"]')

      expect(group.attributes('aria-label')).toBe('Presets')
      expect(swatches).toHaveLength(3)
      expect(swatches[0].attributes('aria-label')).toBe('Select #ff0000')
      expect(swatches[0].attributes('title')).toBe('#ff0000')
      expect(swatches[2].attributes('disabled')).toBeDefined()
      expect(swatches[0].attributes('disabled')).toBeUndefined()
    })

    it('then the swatch matching the color is pressed with a check icon', async () => {
      const wrapper = await mountPanel({
        swatches: [
          '#ff0000',
          '#00ff00',
          '#ffffff',
          'invalid',
        ],
      })
      const swatches = wrapper.findAll('.m-color-picker-panel__swatch')

      expect(swatches.map(swatch => swatch.attributes('aria-pressed'))).toEqual(['true', 'false', 'false', 'false'])
      expect(swatches[0].findComponent({ name: 'MazIcon' }).exists()).toBe(true)
      expect(swatches[0].findComponent({ name: 'MazIcon' }).classes()).toContain('maz:text-white')
    })

    it('then a light selected swatch gets a dark check icon', async () => {
      const wrapper = await mountPanel({
        swatches: ['#ffffff'],
      }, { h: 0, s: 0, v: 1, a: 1 })
      const icon = wrapper.find('.m-color-picker-panel__swatch').findComponent({ name: 'MazIcon' })

      expect(icon.classes()).toContain('maz:text-black')
    })

    it('then a different alpha is not selected', async () => {
      const wrapper = await mountPanel({
        swatches: ['#ff0000'],
      }, { h: 0, s: 1, v: 1, a: 0.5 })

      expect(wrapper.find('.m-color-picker-panel__swatch').attributes('aria-pressed')).toBe('false')
    })

    it('then clicking a swatch emits pick with its color', async () => {
      const wrapper = await mountPanel({
        swatches: ['#00ff00', 'invalid'],
      })
      const swatches = wrapper.findAll('.m-color-picker-panel__swatch')

      await swatches[0].trigger('click')

      expect(wrapper.emitted('pick')).toEqual([
        [
          { r: 0, g: 255, b: 0, a: 1 },
        ],
      ])

      swatches[1].element.removeAttribute('disabled')
      await swatches[1].trigger('click')

      expect(wrapper.emitted('pick')).toHaveLength(1)
    })

    it('then a click on a swatch of a disabled panel emits nothing', async () => {
      const wrapper = await mountPanel({
        swatches: ['#00ff00'],
        disabled: true,
      })
      const swatch = wrapper.find('.m-color-picker-panel__swatch')

      swatch.element.removeAttribute('disabled')
      await swatch.trigger('click')

      expect(wrapper.emitted('pick')).toBeUndefined()
    })
  })

  describe('when the EyeDropper API is not available', () => {
    it('then the button is not rendered', async () => {
      const wrapper = await mountPanel({ eyeDropper: true })

      expect(wrapper.find('button[aria-label="Eye dropper"]').exists()).toBe(false)
    })
  })

  describe('when the EyeDropper API is available', () => {
    it('then the button is rendered', async () => {
      vi.stubGlobal('EyeDropper', class {})
      const wrapper = await mountPanel()
      const button = wrapper.find('button[aria-label="Eye dropper"]')

      expect(button.exists()).toBe(true)
      expect(button.attributes('title')).toBe('Eye dropper')
    })

    it('then the button is hidden when eyeDropper is false', async () => {
      vi.stubGlobal('EyeDropper', class {})
      const wrapper = await mountPanel({ eyeDropper: false })

      expect(wrapper.find('button[aria-label="Eye dropper"]').exists()).toBe(false)
    })

    it('then the button is disabled when the panel is disabled', async () => {
      vi.stubGlobal('EyeDropper', class {})
      const wrapper = await mountPanel({ disabled: true })

      expect(wrapper.find('button[aria-label="Eye dropper"]').attributes('disabled')).toBeDefined()
    })

    it('then picking a color emits pick with the current alpha', async () => {
      vi.stubGlobal('EyeDropper', class {
        open = vi.fn().mockResolvedValue({ sRGBHex: '#336699' })
      })
      const wrapper = await mountPanel({}, { h: 0, s: 1, v: 1, a: 0.4 })

      await wrapper.find('button[aria-label="Eye dropper"]').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('pick')).toEqual([
        [
          { r: 51, g: 102, b: 153, a: 0.4 },
        ],
      ])
    })

    it('then an unparsable result emits nothing', async () => {
      vi.stubGlobal('EyeDropper', class {
        open = vi.fn().mockResolvedValue({ sRGBHex: '' })
      })
      const wrapper = await mountPanel()

      await wrapper.find('button[aria-label="Eye dropper"]').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('pick')).toBeUndefined()
    })

    it('then a cancelled pick is swallowed', async () => {
      vi.stubGlobal('EyeDropper', class {
        open = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'))
      })
      const wrapper = await mountPanel()

      await wrapper.find('button[aria-label="Eye dropper"]').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('pick')).toBeUndefined()
    })
  })
})
