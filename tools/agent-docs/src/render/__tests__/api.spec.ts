import type { ComponentApi, PropApi } from '../../types'

import { modelDirective, renderComponentApi, renderProp } from '../api'

function prop(overrides: Partial<PropApi> = {}): PropApi {
  return { name: 'size', type: 'string', required: false, strictValues: false, ...overrides }
}

describe('given modelDirective', () => {
  describe('when the model is modelValue', () => {
    it('then returns v-model', () => {
      expect(modelDirective('modelValue')).toBe('v-model')
    })
  })

  describe('when the model is another prop', () => {
    it('then returns the argument in kebab case', () => {
      expect(modelDirective('isOpen')).toBe('v-model:is-open')
    })
  })
})

describe('given renderProp', () => {
  describe('when the prop only has a type', () => {
    it('then renders the kebab name and the type without trailing colon', () => {
      expect(renderProp(prop({ name: 'hideLoader', type: 'boolean' }))).toBe('- `hide-loader` (`boolean`)')
    })
  })

  describe('when the prop is required, has a default, a model and a description', () => {
    it('then renders every detail and closes the sentence', () => {
      expect(renderProp(prop({ name: 'modelValue', required: true, default: '\'a\'', model: 'modelValue', description: 'The value' })))
        .toBe('- `model-value` (`string`, required, default: `\'a\'`, `v-model`): The value.')
    })
  })

  describe('when the description already ends with punctuation', () => {
    it('then does not add a period', () => {
      expect(renderProp(prop({ description: 'Is it?' }))).toBe('- `size` (`string`): Is it?')
    })
  })

  describe('when the values are not listed in the type', () => {
    it('then renders them and flags non exhaustive lists', () => {
      expect(renderProp(prop({ type: 'MazSize', values: ['sm', 'md'], strictValues: true }))).toBe('- `size` (`MazSize`): Values: `\'sm\'`, `\'md\'`.')
      expect(renderProp(prop({ type: 'MazSize | string', values: ['sm'], strictValues: false }))).toBe('- `size` (`MazSize | string`): Values: `\'sm\'` (non exhaustive).')
    })
  })

  describe('when the values are already in the type', () => {
    it('then does not repeat them', () => {
      expect(renderProp(prop({ type: '"sm" | \'md\'', values: ['sm', 'md'], strictValues: true }))).toBe('- `size` (`"sm" | \'md\'`)')
    })
  })

  describe('when the type contains a backtick', () => {
    it('then uses a double backtick code span', () => {
      expect(renderProp(prop({ type: '`tpl`' }))).toBe('- `size` (`` `tpl` ``)')
    })
  })
})

describe('given renderComponentApi', () => {
  const api: ComponentApi = {
    name: 'MazSelect',
    docId: 'components/maz-select',
    description: 'A select',
    import: 'import MazSelect from \'maz-ui/components/MazSelect\'',
    props: [
      prop({ name: 'class', type: 'HTML attribute' }),
      prop({ name: 'style', type: 'HTML attribute' }),
      prop({ name: 'label' }),
    ],
    events: [
      { name: 'open' },
      { name: 'update:model-value', payload: 'value: string', description: 'On change' },
    ],
    slots: [
      { name: 'default', bindings: [] },
      { name: 'item', description: 'An option', bindings: [{ name: 'option', type: 'Option', description: 'the option' }, { name: 'index' }] },
    ],
    expose: [{ name: 'open', description: 'Open the list' }, { name: 'close' }],
  }

  describe('when the component has every section', () => {
    it('then renders props without class and style, events, slots and exposed members', () => {
      expect(renderComponentApi(api, 3)).toBe([
        '### MazSelect API',
        '',
        '`import MazSelect from \'maz-ui/components/MazSelect\'`',
        '',
        'A select',
        '',
        '#### Props',
        '',
        '- `label` (`string`)',
        '',
        '#### Events',
        '',
        '- `@open`',
        '- `@update:model-value` (payload: `value: string`): On change',
        '',
        '#### Slots',
        '',
        '- `#default`',
        '- `#item`: An option Bindings: `option: Option` (the option), `index`.',
        '',
        '#### Exposed (template ref)',
        '',
        '- `open`: Open the list',
        '- `close`',
      ].join('\n'))
    })
  })

  describe('when the component has no props, events, slots nor exposed members', () => {
    it('then renders the empty props section only', () => {
      expect(renderComponentApi({ ...api, description: undefined, props: [], events: [], slots: [], expose: [] })).toBe([
        '## MazSelect API',
        '',
        '`import MazSelect from \'maz-ui/components/MazSelect\'`',
        '',
        '### Props',
        '',
        'No props.',
      ].join('\n'))
    })
  })
})
