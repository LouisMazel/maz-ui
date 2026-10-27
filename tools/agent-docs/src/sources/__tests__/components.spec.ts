import type { ComponentMeta, EventMeta, PropertyMeta, SlotMeta } from 'vue-component-meta'

import { cleanType, propValues, slotBindings, toComponentApi, toEventApi, toPropApi, toSlotApi, unionMembers } from '../components'

function prop(overrides: Partial<PropertyMeta> = {}): PropertyMeta {
  return {
    name: 'color',
    global: false,
    description: '',
    tags: [],
    required: false,
    type: 'string | undefined',
    default: undefined,
    ...overrides,
  } as unknown as PropertyMeta
}

function event(overrides: Partial<EventMeta> = {}): EventMeta {
  return { name: 'close', type: '[]', signature: '', tags: [], ...overrides } as unknown as EventMeta
}

function slot(overrides: Partial<SlotMeta> = {}): SlotMeta {
  return { name: 'default', type: '{}', description: '', ...overrides } as unknown as SlotMeta
}

describe('given unionMembers', () => {
  describe('when the type is a simple union', () => {
    it('then splits on the pipes', () => {
      expect(unionMembers('"sm" | "md" | undefined')).toEqual(['"sm"', '"md"', 'undefined'])
    })
  })

  describe('when pipes are nested in generics, objects, functions or strings', () => {
    it('then only splits the top level', () => {
      expect(unionMembers('Record<string, "a" | "b"> | { size: "sm" | "md" } | (() => void) | "x|y" | ((value: string) => boolean)')).toEqual([
        'Record<string, "a" | "b">',
        '{ size: "sm" | "md" }',
        '(() => void)',
        '"x|y"',
        '((value: string) => boolean)',
      ])
    })
  })

  describe('when the type has an arrow function at the top level', () => {
    it('then keeps the arrow inside the member', () => {
      expect(unionMembers('() => void | string')).toEqual(['() => void', 'string'])
    })
  })

  describe('when the type is single quoted', () => {
    it('then ignores pipes in the quotes', () => {
      expect(unionMembers('\'a|b\' | number')).toEqual(['\'a|b\'', 'number'])
    })
  })

  describe('when the type is empty', () => {
    it('then returns no member', () => {
      expect(unionMembers('')).toEqual([])
    })
  })
})

describe('given cleanType', () => {
  describe('when the type is optional and spans several lines', () => {
    it('then removes undefined and collapses whitespace', () => {
      expect(cleanType('string\n  | number\n  | undefined')).toBe('string | number')
    })
  })

  describe('when the type is too long', () => {
    it('then truncates it', () => {
      const long = Array.from({ length: 60 }, (_, index) => `"value-${index}"`).join(' | ')
      const result = cleanType(long)

      expect(result).toHaveLength(240)
      expect(result.endsWith('...')).toBe(true)
    })
  })

  describe('when the type contains an em dash', () => {
    it('then normalizes it', () => {
      expect(cleanType('"a—b"')).toBe('"a - b"')
    })
  })
})

describe('given propValues', () => {
  describe('when the type is a union of string literals', () => {
    it('then returns strict values', () => {
      expect(propValues('"sm" | "md" | null | undefined', undefined)).toEqual({ values: ['sm', 'md'], strict: true })
    })
  })

  describe('when the type is an open type documented by a values tag', () => {
    it('then returns non strict values without filler words', () => {
      expect(propValues('MazSize | MazSizeUnit', '`\'mini\' | \'xs\'` or a CSS unit like `\'2rem\'`')).toEqual({ values: ['mini', 'xs', '2rem'], strict: false })
    })
  })

  describe('when literals are mixed with an open type', () => {
    it('then merges literals and tag values as non strict', () => {
      expect(propValues('"auto" | number', '`\'auto\'` or `\'16\'`')).toEqual({ values: ['auto', '16'], strict: false })
    })
  })

  describe('when a single literal is accepted', () => {
    it('then returns it as non strict', () => {
      expect(propValues('"only"', undefined)).toEqual({ values: ['only'], strict: false })
    })
  })

  describe('when the type has no literal and no tag', () => {
    it('then returns no values', () => {
      expect(propValues('string', undefined)).toEqual({ strict: false })
    })
  })
})

describe('given slotBindings', () => {
  describe('when the slot type has bindings with functions and objects', () => {
    it('then returns each binding with its type', () => {
      expect(slotBindings('{ isOpen: boolean; close: () => void; option?: { label: string; value: number }; }')).toEqual([
        { name: 'isOpen', type: 'boolean' },
        { name: 'close', type: '() => void' },
        { name: 'option', type: '{ label: string; value: number }' },
      ])
    })
  })

  describe('when the slot has no binding', () => {
    it('then returns an empty list', () => {
      expect(slotBindings('{}')).toEqual([])
      expect(slotBindings('any')).toEqual([])
    })
  })

  describe('when a member cannot be parsed', () => {
    it('then skips it', () => {
      expect(slotBindings('{ [key: string]; valid: string }')).toEqual([{ name: 'valid', type: 'string' }])
    })
  })
})

describe('given toPropApi', () => {
  describe('when the prop has description, values, default and model', () => {
    it('then returns the full API', () => {
      const result = toPropApi(prop({
        name: 'modelValue',
        type: '"a" | "b" | undefined',
        description: 'The value',
        tags: [{ name: 'description', text: 'More details' }],
        default: '"a"',
        required: true,
      }), new Set(['modelValue']))

      expect(result).toEqual({
        name: 'modelValue',
        type: '"a" | "b"',
        description: 'The value - More details',
        required: true,
        default: '"a"',
        values: ['a', 'b'],
        strictValues: true,
        model: 'modelValue',
      })
    })
  })

  describe('when the description comes from the model tag and the default from a tag', () => {
    it('then uses the tags', () => {
      const result = toPropApi(prop({
        name: 'open',
        type: 'boolean',
        tags: [{ name: 'model', text: 'Open state' }, { name: 'default', text: 'false' }],
      }), new Set())

      expect(result).toEqual({ name: 'open', type: 'boolean', description: 'Open state', required: false, default: 'false', strictValues: false })
    })
  })

  describe('when the default is undefined', () => {
    it('then omits it', () => {
      expect(toPropApi(prop({ default: 'undefined', tags: [{ name: 'default', text: 'undefined' }] }), new Set())).not.toHaveProperty('default')
    })
  })

  describe('when a tag has no text', () => {
    it('then ignores it', () => {
      expect(toPropApi(prop({ tags: [{ name: 'description' }] as PropertyMeta['tags'] }), new Set())).not.toHaveProperty('description')
    })
  })
})

describe('given toEventApi', () => {
  describe('when the event has a payload and a description', () => {
    it('then returns both', () => {
      const result = toEventApi({ ...event({ name: 'update:model-value', type: '[value: string | undefined]' }), description: 'Emitted\non change' } as EventMeta)

      expect(result).toEqual({ name: 'update:model-value', description: 'Emitted on change', payload: 'value: string | undefined' })
    })
  })

  describe('when the event has no payload', () => {
    it('then returns the name only', () => {
      expect(toEventApi(event({ type: '[]' }))).toEqual({ name: 'close' })
    })
  })
})

describe('given toSlotApi', () => {
  describe('when the slot has a description and bindings', () => {
    it('then returns them', () => {
      expect(toSlotApi(slot({ name: 'header', description: 'Header\nslot', type: '{ close: () => void; }' }))).toEqual({
        name: 'header',
        description: 'Header slot',
        bindings: [{ name: 'close', type: '() => void' }],
      })
    })
  })

  describe('when the slot has no description', () => {
    it('then omits it', () => {
      expect(toSlotApi(slot())).toEqual({ name: 'default', bindings: [] })
    })
  })
})

describe('given toComponentApi', () => {
  describe('when the component meta has props, models, events, slots and exposed members', () => {
    const meta = {
      props: [
        prop({ name: 'modelValue', type: 'string' }),
        prop({ name: 'isOpen', type: 'boolean' }),
        prop({ name: 'key', global: true }),
      ],
      events: [
        event({ name: 'update:model-value', type: '[value: string]' }),
        event({ name: 'update:is-open', type: '[value: boolean]' }),
        event({ name: 'update:unknown', type: '[value: boolean]' }),
      ],
      slots: [slot({ name: 'default' })],
      exposed: [
        { name: 'focus', description: 'Focus the input', type: '() => void' },
        { name: 'blur', description: '', type: '() => void' },
        { name: '$el', description: '', type: 'any' },
        { name: 'modelValue', description: '', type: 'string' },
      ],
    } as unknown as ComponentMeta

    it('then builds the API with v-model props and public exposed members', () => {
      const api = toComponentApi(meta, 'MazInputPhoneNumber')

      expect(api.name).toBe('MazInputPhoneNumber')
      expect(api.docId).toBe('components/maz-input-phone-number')
      expect(api.import).toBe('import MazInputPhoneNumber from \'maz-ui/components/MazInputPhoneNumber\'')
      expect(api.props.map(entry => [entry.name, entry.model])).toEqual([['modelValue', 'modelValue'], ['isOpen', 'isOpen']])
      expect(api.events.map(entry => entry.name)).toEqual(['update:model-value', 'update:is-open', 'update:unknown'])
      expect(api.slots).toEqual([{ name: 'default', bindings: [] }])
      expect(api.expose).toEqual([{ name: 'focus', description: 'Focus the input' }, { name: 'blur' }])
    })
  })
})
