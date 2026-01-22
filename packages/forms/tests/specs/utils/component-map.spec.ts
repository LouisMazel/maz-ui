import type { FormComponentName } from '../../../src/utils/schema-helpers'
import {
  createAsyncComponent,
  createAsyncComponents,
  createSchemaAsyncComponents,
  getComponentImport,
  getUsedComponentNames,
} from '../../../src/utils/component-map'

describe('component-map', () => {
  describe('Given the getComponentImport function', () => {
    describe('When requesting a valid component', () => {
      it('returns import function for MazInput', () => {
        const importFn = getComponentImport('MazInput')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazTextarea', () => {
        const importFn = getComponentImport('MazTextarea')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazSelect', () => {
        const importFn = getComponentImport('MazSelect')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazSelectCountry', () => {
        const importFn = getComponentImport('MazSelectCountry')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazCheckbox', () => {
        const importFn = getComponentImport('MazCheckbox')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazSwitch', () => {
        const importFn = getComponentImport('MazSwitch')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazRadio', () => {
        const importFn = getComponentImport('MazRadio')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazRadioButtons', () => {
        const importFn = getComponentImport('MazRadioButtons')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazInputNumber', () => {
        const importFn = getComponentImport('MazInputNumber')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazInputPrice', () => {
        const importFn = getComponentImport('MazInputPrice')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazInputCode', () => {
        const importFn = getComponentImport('MazInputCode')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazInputTags', () => {
        const importFn = getComponentImport('MazInputTags')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazInputPhoneNumber', () => {
        const importFn = getComponentImport('MazInputPhoneNumber')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazDatePicker', () => {
        const importFn = getComponentImport('MazDatePicker')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })

      it('returns import function for MazSlider', () => {
        const importFn = getComponentImport('MazSlider')

        expect(importFn).toBeDefined()
        expect(typeof importFn).toBe('function')
      })
    })
  })

  describe('Given the createAsyncComponent function', () => {
    describe('When creating an async component with default options', () => {
      it('returns a component for MazInput', () => {
        const component = createAsyncComponent('MazInput')

        expect(component).toBeDefined()
      })

      it('returns a component for MazTextarea', () => {
        const component = createAsyncComponent('MazTextarea')

        expect(component).toBeDefined()
      })
    })

    describe('When creating an async component with custom options', () => {
      it('accepts delay option', () => {
        const component = createAsyncComponent('MazInput', { delay: 500 })

        expect(component).toBeDefined()
      })

      it('accepts timeout option', () => {
        const component = createAsyncComponent('MazInput', { timeout: 10000 })

        expect(component).toBeDefined()
      })

      it('accepts onError callback', () => {
        const onError = vi.fn()
        const component = createAsyncComponent('MazInput', { onError })

        expect(component).toBeDefined()
      })

      it('accepts all options together', () => {
        const component = createAsyncComponent('MazInput', {
          delay: 100,
          timeout: 5000,
          onError: () => {},
        })

        expect(component).toBeDefined()
      })
    })
  })

  describe('Given the createAsyncComponents function', () => {
    describe('When creating multiple async components', () => {
      it('returns components for specified names', () => {
        const names: FormComponentName[] = ['MazInput', 'MazTextarea', 'MazSelect']
        const components = createAsyncComponents(names)

        expect(components.MazInput).toBeDefined()
        expect(components.MazTextarea).toBeDefined()
        expect(components.MazSelect).toBeDefined()
      })

      it('returns empty object for empty names array', () => {
        const components = createAsyncComponents([])

        expect(Object.keys(components)).toHaveLength(0)
      })

      it('applies options to all components', () => {
        const names: FormComponentName[] = ['MazInput', 'MazCheckbox']
        const components = createAsyncComponents(names, { delay: 300 })

        expect(components.MazInput).toBeDefined()
        expect(components.MazCheckbox).toBeDefined()
      })
    })
  })

  describe('Given the getUsedComponentNames function', () => {
    describe('When schema has unique components', () => {
      it('returns all unique component names', () => {
        const schema = {
          sections: [
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
                { component: 'MazTextarea' as FormComponentName },
              ],
            },
            {
              fields: [
                { component: 'MazSelect' as FormComponentName },
              ],
            },
          ],
        }

        const names = getUsedComponentNames(schema)

        expect(names).toHaveLength(3)
        expect(names).toContain('MazInput')
        expect(names).toContain('MazTextarea')
        expect(names).toContain('MazSelect')
      })
    })

    describe('When schema has duplicate components', () => {
      it('returns unique component names only', () => {
        const schema = {
          sections: [
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
                { component: 'MazInput' as FormComponentName },
                { component: 'MazTextarea' as FormComponentName },
              ],
            },
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
              ],
            },
          ],
        }

        const names = getUsedComponentNames(schema)

        expect(names).toHaveLength(2)
        expect(names).toContain('MazInput')
        expect(names).toContain('MazTextarea')
      })
    })

    describe('When schema is empty', () => {
      it('returns empty array', () => {
        const schema = {
          sections: [],
        }

        const names = getUsedComponentNames(schema)

        expect(names).toHaveLength(0)
      })
    })

    describe('When sections have no fields', () => {
      it('returns empty array', () => {
        const schema = {
          sections: [
            { fields: [] },
            { fields: [] },
          ],
        }

        const names = getUsedComponentNames(schema)

        expect(names).toHaveLength(0)
      })
    })
  })

  describe('Given the createSchemaAsyncComponents function', () => {
    describe('When schema has multiple component types', () => {
      it('creates async components for all used component types', () => {
        const schema = {
          sections: [
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
                { component: 'MazTextarea' as FormComponentName },
              ],
            },
            {
              fields: [
                { component: 'MazCheckbox' as FormComponentName },
              ],
            },
          ],
        }

        const components = createSchemaAsyncComponents(schema)

        expect(components.MazInput).toBeDefined()
        expect(components.MazTextarea).toBeDefined()
        expect(components.MazCheckbox).toBeDefined()
        expect(components.MazSelect).toBeUndefined()
      })
    })

    describe('When schema has single component type', () => {
      it('creates async component only for used type', () => {
        const schema = {
          sections: [
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
                { component: 'MazInput' as FormComponentName },
              ],
            },
          ],
        }

        const components = createSchemaAsyncComponents(schema)

        expect(components.MazInput).toBeDefined()
        expect(Object.keys(components)).toHaveLength(1)
      })
    })

    describe('When schema is empty', () => {
      it('returns empty object', () => {
        const schema = {
          sections: [],
        }

        const components = createSchemaAsyncComponents(schema)

        expect(Object.keys(components)).toHaveLength(0)
      })
    })

    describe('When custom options are provided', () => {
      it('applies options to created components', () => {
        const schema = {
          sections: [
            {
              fields: [
                { component: 'MazInput' as FormComponentName },
              ],
            },
          ],
        }

        const components = createSchemaAsyncComponents(schema, { delay: 100 })

        expect(components.MazInput).toBeDefined()
      })
    })
  })
})
