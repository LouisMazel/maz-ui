import MazDropzone from '@components/MazDropzone.vue'
import { getFieldFocusColor } from '@components/MazField/useFieldState.ts'
import MazInput from '@components/MazInput.vue'
import MazInputCode from '@components/MazInputCode.vue'
import MazInputTags from '@components/MazInputTags.vue'
import MazMarkdownEditor from '@components/MazMarkdownEditor.vue'
import MazTextarea from '@components/MazTextarea.vue'
import { mount } from '@vue/test-utils'

describe('given getFieldFocusColor', () => {
  describe('when there is no state', () => {
    it('then it returns the variable of the color', () => {
      expect(getFieldFocusColor('secondary')).toBe('var(--maz-secondary)')
    })

    it('then the neutral color uses its foreground', () => {
      expect(getFieldFocusColor('neutral')).toBe('var(--maz-neutral-foreground)')
    })
  })

  describe('when there is a state', () => {
    it('then the state color wins over the color', () => {
      expect(getFieldFocusColor('primary', 'error')).toBe('var(--maz-destructive)')
      expect(getFieldFocusColor('primary', 'success')).toBe('var(--maz-success)')
      expect(getFieldFocusColor('primary', 'warning')).toBe('var(--maz-warning)')
    })
  })
})

describe('given a MazInput', () => {
  describe('when it has a border', () => {
    const wrapper = mount(MazInput, { props: { color: 'success' } })

    it('then the box has the shared focus border', () => {
      const classes = wrapper.find('.m-input-wrapper').classes()

      expect(classes).toContain('maz:field-focus')
      expect(classes).not.toContain('maz:focus-within-ring')
    })

    it('then the focus color follows the color', () => {
      expect(wrapper.find('.m-input').attributes('style')).toContain('--m-field-color: var(--maz-success)')
    })
  })

  describe('when it has an error', () => {
    it('then the focus color is the one of the state', () => {
      const wrapper = mount(MazInput, { props: { error: true } })

      expect(wrapper.find('.m-input').attributes('style')).toContain('--m-field-color: var(--maz-destructive)')
    })
  })

  describe('when it has no border', () => {
    const wrapper = mount(MazInput, { props: { bordered: false } })

    it('then the box has the focus ring and the shared transition', () => {
      const classes = wrapper.find('.m-input-wrapper').classes()

      expect(classes).toContain('maz:focus-within-ring')
      expect(classes).toContain('maz:field-transition')
      expect(classes).not.toContain('maz:field-focus')
    })
  })
})

describe('given a MazTextarea', () => {
  describe('when it has a border', () => {
    it('then it has the shared focus border and its color', () => {
      const wrapper = mount(MazTextarea, { props: { color: 'info' } })

      expect(wrapper.find('.m-textarea').classes()).toContain('maz:field-focus')
      expect(wrapper.find('.m-textarea').attributes('style')).toContain('--m-field-color: var(--maz-info)')
    })
  })

  describe('when it has no border', () => {
    it('then it has the focus ring instead', () => {
      const wrapper = mount(MazTextarea, { props: { bordered: false } })

      expect(wrapper.find('.m-textarea').classes()).toContain('maz:focus-within-ring')
      expect(wrapper.find('.m-textarea').classes()).not.toContain('maz:field-focus')
    })
  })
})

describe('given a MazInputTags', () => {
  describe('when it is rendered', () => {
    it('then the field has the shared focus border and its color', () => {
      const wrapper = mount(MazInputTags, { props: { color: 'accent' } })
      const field = wrapper.find('.m-input-tags__field')

      expect(field.classes()).toContain('maz:field-focus')
      expect(field.attributes('style')).toContain('--m-field-color: var(--maz-accent)')
    })
  })
})

describe('given a MazInputCode', () => {
  describe('when it is rendered', () => {
    it('then every box has the shared focus border', () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 3 } })
      const boxes = wrapper.findAll('.input-wrapper')

      expect(boxes).toHaveLength(3)
      expect(boxes.every(box => box.classes().includes('maz:field-focus'))).toBe(true)
    })
  })
})

describe('given a MazMarkdownEditor', () => {
  describe('when it is rendered', () => {
    it('then the box has the shared focus border and its color', () => {
      const wrapper = mount(MazMarkdownEditor, { props: { color: 'warning' } })
      const box = wrapper.find('.m-markdown-editor__box')

      expect(box.classes()).toContain('maz:field-focus')
      expect(box.attributes('style')).toContain('--m-field-color: var(--maz-warning)')
    })
  })
})

describe('given a MazDropzone', () => {
  describe('when it is enabled', () => {
    const wrapper = mount(MazDropzone)

    it('then it is reachable with the keyboard', () => {
      expect(wrapper.find('.m-dropzone').attributes('tabindex')).toBe('0')
    })

    it('then it has the shared focus border', () => {
      expect(wrapper.find('.m-dropzone').classes()).toContain('maz:field-focus')
    })

    it('then Enter opens the file picker', async () => {
      const input = wrapper.find<HTMLInputElement>('input[type="file"]')
      const click = vi.spyOn(input.element, 'click')

      await wrapper.find('.m-dropzone').trigger('keydown', { key: 'Enter' })

      expect(click).toHaveBeenCalledOnce()
    })
  })

  describe('when it is disabled', () => {
    it('then it is out of the tab order', () => {
      const wrapper = mount(MazDropzone, { props: { disabled: true } })

      expect(wrapper.find('.m-dropzone').attributes('tabindex')).toBe('-1')
    })
  })
})
