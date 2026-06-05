import type { ComputedRef } from 'vue'
import { GLOBAL_CONFIG_INJECTION_KEY, useGlobalConfig } from '@composables/useGlobalConfig'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

function mountComp(config?: unknown, props: Record<string, unknown> = {}) {
  let api: { roundedSize: ComputedRef<string> }
  const Comp = defineComponent({
    props: {
      roundedSize: { type: String, default: undefined },
    },
    setup() {
      api = useGlobalConfig('MazBtn', { roundedSize: 'md' })
      return () => h('div')
    },
  })
  mount(Comp, {
    props,
    global: config === undefined ? {} : { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config } },
  })
  return api!
}

describe('given no provided config', () => {
  describe('when the instance prop is not passed', () => {
    it('then it resolves to the library fallback', () => {
      const api = mountComp(undefined)
      expect(api.roundedSize.value).toBe('md')
    })
  })

  describe('when the instance prop is passed', () => {
    it('then it resolves to the instance prop', () => {
      const api = mountComp(undefined, { roundedSize: 'full' })
      expect(api.roundedSize.value).toBe('full')
    })
  })
})

describe('given a global config and a component config', () => {
  describe('when the instance prop is not passed', () => {
    it('then it resolves to the component config over the global', () => {
      const api = mountComp({ global: { roundedSize: 'sm' }, MazBtn: { roundedSize: 'lg' } })
      expect(api.roundedSize.value).toBe('lg')
    })
  })

  describe('when only the global config is set', () => {
    it('then it resolves to the global config', () => {
      const api = mountComp({ global: { roundedSize: 'sm' } })
      expect(api.roundedSize.value).toBe('sm')
    })
  })

  describe('when the instance prop is passed', () => {
    it('then it resolves to the instance prop over every config', () => {
      const api = mountComp({ global: { roundedSize: 'sm' }, MazBtn: { roundedSize: 'lg' } }, { roundedSize: 'none' })
      expect(api.roundedSize.value).toBe('none')
    })
  })
})
