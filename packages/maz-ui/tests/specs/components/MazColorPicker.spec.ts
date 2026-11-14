import MazColorPicker from '@components/MazColorPicker.vue'
import MazInput from '@components/MazInput.vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

type Wrapper = ReturnType<typeof mount>

async function mountPicker(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(MazColorPicker, {
    props: {
      'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
    attrs,
    attachTo: document.body,
    global: {
      stubs: { teleport: false, Teleport: false },
    },
  })
  await flushPromises()
  return wrapper
}

function emittedValues(wrapper: Wrapper) {
  return (wrapper.emitted('update:modelValue') ?? []).map(args => args[0])
}

function input(wrapper: Wrapper) {
  return wrapper.find<HTMLInputElement>('input:not([type="range"])')
}

async function type(wrapper: Wrapper, value: string) {
  await input(wrapper).setValue(value)
  await flushPromises()
}

async function openPopover(wrapper: Wrapper) {
  await wrapper.find('.m-color-picker__trigger').trigger('click')
  await flushPromises()
  await vi.dynamicImportSettled()
  await flushPromises()
}

function panel() {
  return document.body.querySelector('.m-color-picker-panel')
}

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('given MazColorPicker component', () => {
  describe('when rendered in popover mode without value', () => {
    it('then it renders the input, an empty swatch trigger and no panel', async () => {
      const wrapper = await mountPicker()
      const trigger = wrapper.find('.m-color-picker__trigger')

      expect(input(wrapper).element.value).toBe('')
      expect(trigger.attributes('aria-label')).toBe('test')
      expect(trigger.attributes('aria-haspopup')).toBe('dialog')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(trigger.attributes('type')).toBe('button')
      expect(trigger.find('span').exists()).toBe(false)
      expect(panel()).toBeNull()
    })
  })

  describe('when rendered with a value', () => {
    it('then the input shows the raw value and the swatch shows the color', async () => {
      const wrapper = await mountPicker({ modelValue: '#336699' })

      expect(input(wrapper).element.value).toBe('#336699')
      expect(wrapper.find('.m-color-picker__trigger span').attributes('style')).toContain('rgb(51, 102, 153)')
    })

    it('then an unparsable value shows no swatch', async () => {
      const wrapper = await mountPicker({ modelValue: 'not-a-color' })

      expect(input(wrapper).element.value).toBe('not-a-color')
      expect(wrapper.find('.m-color-picker__trigger span').exists()).toBe(false)
    })
  })

  describe('when rendered with an id, attrs and a class', () => {
    it('then the id and attrs go to the input and the class to the root', async () => {
      const wrapper = await mountPicker({ id: 'my-color' }, { 'placeholder': 'Pick', 'class': 'custom-class', 'data-test': 'x' })

      expect(input(wrapper).attributes('id')).toBe('my-color')
      expect(input(wrapper).attributes('placeholder')).toBe('Pick')
      expect(input(wrapper).attributes('data-test')).toBe('x')
      expect(wrapper.find('.m-popover').classes()).toContain('custom-class')
      expect(input(wrapper).classes()).not.toContain('custom-class')
    })

    it('then an id is generated when not provided', async () => {
      const wrapper = await mountPicker()

      expect(input(wrapper).attributes('id')).toBeTruthy()
    })
  })

  describe('when the trigger is clicked', () => {
    it('then the popover opens with the panel and emits open', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await openPopover(wrapper)

      expect(panel()).not.toBeNull()
      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-expanded')).toBe('true')
      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('then a second click closes the popover and emits close', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await openPopover(wrapper)
      await openPopover(wrapper)

      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when the user clicks outside the popover', () => {
    it('then the popover closes and emits close', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await openPopover(wrapper)
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await flushPromises()

      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-expanded')).toBe('false')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then a click in the input or the panel keeps it open', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await openPopover(wrapper)
      input(wrapper).element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      panel()!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await flushPromises()

      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-expanded')).toBe('true')
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('then the listener is removed on unmount', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })
      const removeSpy = vi.spyOn(document, 'removeEventListener')

      await openPopover(wrapper)
      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), true)
    })
  })

  describe('when the popover is closed with Escape', () => {
    it('then the state follows and close is emitted', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await openPopover(wrapper)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await flushPromises()

      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-expanded')).toBe('false')
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when disabled', () => {
    it('then the input and the trigger are disabled and the popover stays closed', async () => {
      const wrapper = await mountPicker({ disabled: true })
      const trigger = wrapper.find('.m-color-picker__trigger')

      expect(input(wrapper).attributes('disabled')).toBeDefined()
      expect(trigger.attributes('disabled')).toBeDefined()

      trigger.element.removeAttribute('disabled')
      await trigger.trigger('click')
      await flushPromises()

      expect(panel()).toBeNull()
      expect(wrapper.emitted('open')).toBeUndefined()
    })
  })

  describe('when the user types a color', () => {
    it('then a hex value is emitted in the hex format', async () => {
      const wrapper = await mountPicker()

      await type(wrapper, '#F00')

      expect(emittedValues(wrapper)).toEqual(['#ff0000'])
    })

    it('then any CSS format is converted to the chosen format', async () => {
      const rgb = await mountPicker({ format: 'rgb' })
      const hsl = await mountPicker({ format: 'hsl' })
      const oklch = await mountPicker({ format: 'oklch' })

      await type(rgb, '#ff8800')
      await type(hsl, 'rgb(255 0 0)')
      await type(oklch, 'oklch(1 0 0)')

      expect(emittedValues(rgb)).toEqual(['rgb(255 136 0)'])
      expect(emittedValues(hsl)).toEqual(['hsl(0 100% 50%)'])
      expect(emittedValues(oklch)).toEqual(['oklch(1 0 0)'])
    })

    it('then the alpha is kept by default', async () => {
      const wrapper = await mountPicker()

      await type(wrapper, 'rgb(255 0 0 / 0.5)')

      expect(emittedValues(wrapper)).toEqual(['#ff000080'])
    })

    it('then the alpha is dropped when alpha is false', async () => {
      const wrapper = await mountPicker({ alpha: false })

      await type(wrapper, 'rgb(255 0 0 / 0.5)')

      expect(emittedValues(wrapper)).toEqual(['#ff0000'])
    })

    it('then a named color is resolved through the browser', async () => {
      vi.stubGlobal('CSS', {
        supports: () => true,
      })
      vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({ color: 'rgb(102, 51, 153)' } as CSSStyleDeclaration)
      const wrapper = await mountPicker()

      await type(wrapper, 'rebeccapurple')

      expect(emittedValues(wrapper)).toEqual(['#663399'])
      vi.restoreAllMocks()
    })

    it('then an invalid value emits nothing and keeps the typed text', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await type(wrapper, '#zzz')

      expect(emittedValues(wrapper)).toEqual([])
      expect(input(wrapper).element.value).toBe('#zzz')
    })

    it('then a non string value from the input is treated as empty', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      wrapper.findComponent(MazInput).vm.$emit('update:model-value', 42)
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual([undefined])
    })

    it('then clearing the field emits undefined', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await type(wrapper, '   ')

      expect(emittedValues(wrapper)).toEqual([undefined])
      expect(wrapper.find('.m-color-picker__trigger span').exists()).toBe(false)
    })
  })

  describe('when the field is blurred', () => {
    it('then the text is restored from the model', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await input(wrapper).trigger('focus')
      await type(wrapper, '#zzz')
      await input(wrapper).trigger('blur')
      await flushPromises()

      expect(input(wrapper).element.value).toBe('#ff0000')
    })

    it('then the text is empty when the model is empty', async () => {
      const wrapper = await mountPicker()

      await type(wrapper, '#zzz')
      await input(wrapper).trigger('blur')
      await flushPromises()

      expect(input(wrapper).element.value).toBe('')
    })
  })

  describe('when the model changes from the outside', () => {
    it('then the text and the swatch follow while not focused', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await wrapper.setProps({ modelValue: 'hsl(120 100% 50%)' })

      expect(input(wrapper).element.value).toBe('hsl(120 100% 50%)')
      expect(wrapper.find('.m-color-picker__trigger span').attributes('style')).toContain('rgb(0, 255, 0)')
    })

    it('then the text is kept while the field is focused', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await input(wrapper).trigger('focus')
      await wrapper.setProps({ modelValue: '#00ff00' })

      expect(input(wrapper).element.value).toBe('#ff0000')
    })

    it('then an unparsable value updates the text but keeps the color', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await wrapper.setProps({ modelValue: 'nope' })

      expect(input(wrapper).element.value).toBe('nope')
    })

    it('then a cleared model empties the text', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })

      await type(wrapper, '#00ff00')
      await wrapper.setProps({ modelValue: undefined })

      expect(input(wrapper).element.value).toBe('')
      expect(wrapper.find('.m-color-picker__trigger span').exists()).toBe(false)
    })

    it('then a cleared model empties the text before any emission', async () => {
      const wrapper = await mountPicker({ modelValue: '#00ff00' })

      await wrapper.setProps({ modelValue: undefined })

      expect(input(wrapper).element.value).toBe('')
    })

    it('then the last emitted value set again by the parent is applied', async () => {
      const wrapper = await mountPicker({ modelValue: '#00ff00' })

      await type(wrapper, '#ff0000')
      await input(wrapper).trigger('blur')
      await wrapper.setProps({ modelValue: '#0000ff' })
      await wrapper.setProps({ modelValue: '#ff0000' })

      expect(input(wrapper).element.value).toBe('#ff0000')
      expect(wrapper.find('.m-color-picker__trigger span').attributes('style')).toContain('rgb(255, 0, 0)')
    })

    it('then the value emitted by the component does not reset the hue of a gray', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })
      await openPopover(wrapper)

      const hue = document.body.querySelector<HTMLInputElement>('input[type="range"].--hue')!
      hue.value = '200'
      hue.dispatchEvent(new Event('input'))
      await flushPromises()

      const area = document.body.querySelector('[role="slider"]')!
      area.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', shiftKey: true }))
      await flushPromises()

      expect(document.body.querySelector<HTMLInputElement>('input[type="range"].--hue')!.value).toBe('200')
    })
  })

  describe('when the panel is used', () => {
    it('then moving the hue emits the color in the format', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000', format: 'hsl' })
      await openPopover(wrapper)

      const hue = document.body.querySelector<HTMLInputElement>('input[type="range"].--hue')!
      hue.value = '120'
      hue.dispatchEvent(new Event('input'))
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['hsl(120 100% 50%)'])
      expect(input(wrapper).element.value).toBe('hsl(120 100% 50%)')
    })

    it('then moving the opacity emits the alpha', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff0000' })
      await openPopover(wrapper)

      const alpha = document.body.querySelector<HTMLInputElement>('input[type="range"].--alpha')!
      alpha.value = '50'
      alpha.dispatchEvent(new Event('input'))
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['#ff000080'])
    })

    it('then alpha false hides the opacity slider and drops the alpha', async () => {
      const wrapper = await mountPicker({ modelValue: '#ff000080', alpha: false, format: 'rgb' })
      await openPopover(wrapper)

      expect(document.body.querySelector('input[type="range"].--alpha')).toBeNull()

      const hue = document.body.querySelector<HTMLInputElement>('input[type="range"].--hue')!
      hue.value = '120'
      hue.dispatchEvent(new Event('input'))
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['rgb(0 255 0)'])
    })

    it('then clicking a swatch emits its color', async () => {
      const wrapper = await mountPicker({
        modelValue: '#ff0000',
        swatches: ['#00ff00', 'rgb(0 0 255 / 0.5)'],
      })
      await openPopover(wrapper)

      const swatches = document.body.querySelectorAll<HTMLButtonElement>('.m-color-picker-panel__swatch')
      swatches[0].click()
      await flushPromises()
      swatches[1].click()
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['#00ff00', '#0000ff80'])
    })

    it('then a swatch with alpha is flattened when alpha is false', async () => {
      const wrapper = await mountPicker({
        alpha: false,
        swatches: ['rgb(0 0 255 / 0.5)'],
      })
      await openPopover(wrapper)

      document.body.querySelector<HTMLButtonElement>('.m-color-picker-panel__swatch')!.click()
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['#0000ff'])
    })

    it('then the eye dropper button follows the eyeDropper prop', async () => {
      vi.stubGlobal('EyeDropper', class {})
      const enabled = await mountPicker({
        translations: { eyeDropper: 'Pipette' },
      })
      await openPopover(enabled)

      expect(document.body.querySelector('button[aria-label="Pipette"]')).not.toBeNull()

      document.body.innerHTML = ''
      const disabled = await mountPicker({
        eyeDropper: false,
        translations: { eyeDropper: 'Pipette' },
      })
      await openPopover(disabled)

      expect(document.body.querySelector('button[aria-label="Pipette"]')).toBeNull()
    })

    it('then picking from the screen keeps the hue of the current color', async () => {
      vi.stubGlobal('EyeDropper', class {
        open = vi.fn().mockResolvedValue({ sRGBHex: '#808080' })
      })
      const wrapper = await mountPicker({
        modelValue: '#00ff00',
        translations: { eyeDropper: 'Pipette' },
      })
      await openPopover(wrapper)

      document.body.querySelector<HTMLButtonElement>('button[aria-label="Pipette"]')!.click()
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['#808080'])
      expect(document.body.querySelector<HTMLInputElement>('input[type="range"].--hue')!.value).toBe('120')
    })

    it('then the panel receives the default labels', async () => {
      const wrapper = await mountPicker({
        modelValue: '#ff0000',
        swatches: ['#00ff00'],
      })
      await openPopover(wrapper)

      expect(document.body.querySelector('[role="slider"]')!.getAttribute('aria-label')).toBe('test')
      expect(document.body.querySelector('[role="slider"]')!.getAttribute('aria-valuetext')).toBe('test')
      expect(document.body.querySelector('input.--hue')!.getAttribute('aria-label')).toBe('test')
      expect(document.body.querySelector('input.--alpha')!.getAttribute('aria-label')).toBe('test')
      expect(document.body.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('test')
      expect(document.body.querySelector('.m-color-picker-panel__swatch')!.getAttribute('aria-label')).toBe('test')
    })
  })

  describe('when custom translations are provided', () => {
    it('then they override every label', async () => {
      const wrapper = await mountPicker({
        modelValue: '#ff0000',
        swatches: ['#00ff00'],
        translations: {
          openPicker: 'Ouvrir',
          area: 'Zone',
          areaValue: 'S {saturation} B {brightness}',
          hue: 'Teinte',
          alpha: 'Opacite',
          eyeDropper: 'Pipette',
          swatches: 'Pastilles',
          selectSwatch: 'Choisir {color}',
        },
      })
      await openPopover(wrapper)

      expect(wrapper.find('.m-color-picker__trigger').attributes('aria-label')).toBe('Ouvrir')
      expect(document.body.querySelector('[role="slider"]')!.getAttribute('aria-label')).toBe('Zone')
      expect(document.body.querySelector('[role="slider"]')!.getAttribute('aria-valuetext')).toBe('S 100 B 100')
      expect(document.body.querySelector('input.--hue')!.getAttribute('aria-label')).toBe('Teinte')
      expect(document.body.querySelector('input.--alpha')!.getAttribute('aria-label')).toBe('Opacite')
      expect(document.body.querySelector('[role="group"]')!.getAttribute('aria-label')).toBe('Pastilles')
      expect(document.body.querySelector('.m-color-picker-panel__swatch')!.getAttribute('aria-label')).toBe('Choisir #00ff00')
    })
  })

  describe('when rendered inline', () => {
    it('then the panel and the input are in the page without a popover', async () => {
      const wrapper = await mountPicker({ inline: true, modelValue: '#ff0000', id: 'inline-id' }, { class: 'custom-class', placeholder: 'Pick' })

      expect(wrapper.find('.m-popover').exists()).toBe(false)
      expect(wrapper.find('.m-color-picker.--inline').classes()).toContain('custom-class')
      expect(wrapper.find('.m-color-picker-panel').exists()).toBe(true)
      expect(wrapper.find('.m-color-picker-panel input#inline-id').exists()).toBe(true)
      expect(input(wrapper).attributes('placeholder')).toBe('Pick')
      expect(wrapper.find('.m-color-picker__trigger').exists()).toBe(false)
    })

    it('then typing and panel interactions emit the color', async () => {
      const wrapper = await mountPicker({
        inline: true,
        format: 'rgb',
        swatches: ['#00ff00'],
      })

      await type(wrapper, '#ff0000')
      await wrapper.find('.m-color-picker-panel__swatch').trigger('click')
      await wrapper.find('input.--hue').setValue('240')
      await flushPromises()

      expect(emittedValues(wrapper)).toEqual(['rgb(255 0 0)', 'rgb(0 255 0)', 'rgb(0 0 255)'])
    })

    it('then blur restores the text and focus keeps it', async () => {
      const wrapper = await mountPicker({ inline: true, modelValue: '#ff0000' })

      await input(wrapper).trigger('focus')
      await wrapper.setProps({ modelValue: '#00ff00' })
      expect(input(wrapper).element.value).toBe('#ff0000')

      await input(wrapper).trigger('blur')
      expect(input(wrapper).element.value).toBe('#00ff00')
    })

    it('then disabled disables the input and the panel', async () => {
      const wrapper = await mountPicker({ inline: true, disabled: true })

      expect(input(wrapper).attributes('disabled')).toBeDefined()
      expect(wrapper.find('.m-color-picker-panel').classes()).toContain('--disabled')
    })
  })
})
