import type { ComponentDoc } from 'vue-docgen-api'
import type { ComponentApi } from '../../types'

import { docgenDescriptions, mergeDescriptions, parseDocgen } from '../components'

function api(overrides: Partial<ComponentApi> = {}): ComponentApi {
  return {
    name: 'MazThing',
    docId: 'components/maz-thing',
    import: `import MazThing from 'maz-ui/components/MazThing'`,
    props: [],
    events: [],
    slots: [],
    expose: [],
    ...overrides,
  }
}

const doc = {
  displayName: 'MazThing',
  exportName: 'default',
  props: [
    { name: 'size', description: 'The size' },
    { name: 'empty', description: '   ' },
  ],
  events: [{ name: 'close', description: 'Emitted on close' }],
  slots: [
    {
      name: 'header',
      description: 'Header slot',
      bindings: [
        { title: 'binding', name: 'is-open', description: 'Open state' },
        { title: 'binding', name: 'close', description: 'Closes it' },
        { title: 'binding', name: 'toggle-all', description: 'Toggles everything' },
        { title: 'binding', description: 'No name' },
      ],
    },
  ],
  expose: [{ name: 'open', description: 'Opens it' }],
} as unknown as ComponentDoc

describe('given docgenDescriptions', () => {
  describe('when the component has no docgen documentation', () => {
    it('then every map is empty', () => {
      const descriptions = docgenDescriptions(undefined)

      expect(descriptions.props.size).toBe(0)
      expect(descriptions.events.size).toBe(0)
      expect(descriptions.slots.size).toBe(0)
      expect(descriptions.expose.size).toBe(0)
    })
  })

  describe('when the component documents props, events, slots and expose', () => {
    it('then blank descriptions and unnamed bindings are ignored', () => {
      const descriptions = docgenDescriptions(doc)

      expect([...descriptions.props.keys()]).toEqual(['size'])
      expect(descriptions.events.get('close')).toBe('Emitted on close')
      expect(descriptions.slots.get('header')?.description).toBe('Header slot')
      expect([...(descriptions.slots.get('header')?.bindings.keys() ?? [])]).toEqual(['is-open', 'close', 'toggle-all'])
      expect(descriptions.expose.get('open')).toBe('Opens it')
    })
  })
})

describe('given mergeDescriptions', () => {
  describe('when vue-component-meta misses the descriptions', () => {
    it('then the docgen descriptions fill them, matching camelCase and kebab-case binding names', () => {
      const merged = mergeDescriptions(api({
        props: [{ name: 'size', type: 'string', required: false, strictValues: false }],
        events: [{ name: 'close' }],
        slots: [{ name: 'header', bindings: [{ name: 'isOpen', type: 'boolean' }, { name: 'close', type: '() => void' }, { name: 'toggleAll', type: '() => void' }, { name: 'other', type: 'string' }] }],
        expose: [{ name: 'open' }],
      }), docgenDescriptions(doc))

      expect(merged.props[0].description).toBe('The size')
      expect(merged.events[0].description).toBe('Emitted on close')
      expect(merged.slots[0].description).toBe('Header slot')
      expect(merged.slots[0].bindings.map(binding => binding.description)).toEqual(['Open state', 'Closes it', 'Toggles everything', undefined])
      expect(merged.expose[0].description).toBe('Opens it')
    })
  })

  describe('when vue-component-meta already has the descriptions', () => {
    it('then they are kept', () => {
      const merged = mergeDescriptions(api({
        props: [{ name: 'size', type: 'string', required: false, strictValues: false, description: 'Meta size' }],
        events: [{ name: 'close', description: 'Meta close' }],
        slots: [{ name: 'header', description: 'Meta header', bindings: [{ name: 'close', description: 'Meta binding' }] }],
        expose: [{ name: 'open', description: 'Meta open' }],
      }), docgenDescriptions(doc))

      expect(merged.props[0].description).toBe('Meta size')
      expect(merged.events[0].description).toBe('Meta close')
      expect(merged.slots[0].description).toBe('Meta header')
      expect(merged.slots[0].bindings[0].description).toBe('Meta binding')
      expect(merged.expose[0].description).toBe('Meta open')
    })
  })

  describe('when docgen does not know the slot', () => {
    it('then the slot is left untouched', () => {
      const merged = mergeDescriptions(api({ slots: [{ name: 'footer', bindings: [{ name: 'close' }] }] }), docgenDescriptions(doc))

      expect(merged.slots[0]).toEqual({ name: 'footer', bindings: [{ name: 'close' }] })
    })
  })
})

describe('given parseDocgen', () => {
  describe('when the component file cannot be parsed', () => {
    it('then it returns undefined instead of failing the generation', async () => {
      await expect(parseDocgen('/does/not/exist/MazNothing.vue')).resolves.toBeUndefined()
    })
  })
})
