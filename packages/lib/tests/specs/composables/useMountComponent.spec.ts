import { useMountComponent } from '@composables/useMountComponent'
import { createApp, defineComponent, h } from 'vue'

describe('given useMountComponent composable', () => {
  describe('when called with a component', () => {
    it('then it should return vNode, destroy function and element', () => {
      const TestComponent = defineComponent({
        template: '<div>Test</div>',
      })

      const { vNode, destroy, el } = useMountComponent(TestComponent)

      expect(vNode).toBeDefined()
      expect(destroy).toBeDefined()
      expect(el).toBeDefined()
      expect(typeof destroy).toBe('function')
      expect(el instanceof HTMLElement).toBe(true)
    })
  })

  describe('when called with props', () => {
    it('then it should pass props to component', () => {
      const TestComponent = defineComponent({
        props: ['message'],
        template: '<div>{{ message }}</div>',
      })

      const { vNode, el } = useMountComponent(TestComponent, {
        props: { message: 'Hello World' },
      })

      expect(vNode.props?.message).toBe('Hello World')
      expect(el.textContent).toBe('Hello World')
    })
  })

  describe('when called with children', () => {
    it('then it should pass children to component', () => {
      const TestComponent = defineComponent({
        template: '<div><slot /></div>',
      })

      const { vNode, el } = useMountComponent(TestComponent, {
        children: 'Child content',
      })

      expect(vNode.children).toBe('Child content')
      expect(el.textContent).toBe('Child content')
    })
  })

  describe('when called with app context', () => {
    it('then it should use app context', () => {
      const app = createApp({})
      const TestComponent = defineComponent({
        template: '<div>Test</div>',
      })

      const { vNode } = useMountComponent(TestComponent, {
        app,
      })

      expect(vNode.appContext).toBe(app._context)
    })
  })

  describe('when called with custom element', () => {
    it('then it should use custom element', () => {
      const customElement = document.createElement('section')
      const TestComponent = defineComponent({
        template: '<div>Test</div>',
      })

      const { el } = useMountComponent(TestComponent, {
        element: customElement,
      })

      expect(el).toBe(customElement)
      expect(el.tagName).toBe('SECTION')
    })
  })

  describe('when called with noRender option', () => {
    it('then it should not render the component', () => {
      const TestComponent = defineComponent({
        template: '<div>Test</div>',
      })

      const { vNode, el } = useMountComponent(TestComponent, {
        noRender: true,
      })

      expect(vNode).toBeDefined()
      expect(el.innerHTML).toBe('')
    })
  })

  describe('when destroy is called', () => {
    it('then it should clean up the component', () => {
      const TestComponent = defineComponent({
        template: '<div>Test</div>',
      })

      const { destroy, el } = useMountComponent(TestComponent)

      expect(el.innerHTML).toContain('Test')

      destroy()

      expect(el.innerHTML).toBe('')
    })
  })

  describe('when called with string component', () => {
    it('then it should work with string component', () => {
      const { vNode, el } = useMountComponent('div', {
        children: 'String component',
      })

      expect(vNode.type).toBe('div')
      expect(el.textContent).toBe('String component')
    })
  })

  describe('when component has custom props', () => {
    it('then it should pass custom props correctly', () => {
      const TestComponent = defineComponent({
        props: ['customProp'],
        template: '<div>{{ customProp }}</div>',
      })

      const { vNode } = useMountComponent(TestComponent, {
        props: { customProp: 'test-value' },
      })

      expect(vNode.props?.customProp).toBe('test-value')
    })
  })

  describe('when called with complex children', () => {
    it('then it should handle complex children structures', () => {
      const TestComponent = defineComponent({
        template: '<div><slot /></div>',
      })

      const { vNode, el } = useMountComponent(TestComponent, {
        children: [
          h('span', 'First'),
          h('span', 'Second'),
        ],
      })

      expect(vNode.children).toHaveLength(2)
      expect(el.textContent).toBe('FirstSecond')
    })
  })

  describe('when multiple components are mounted', () => {
    it('then each should be independent', () => {
      const TestComponent = defineComponent({
        props: ['id'],
        template: '<div>{{ id }}</div>',
      })

      const { el: el1, destroy: destroy1 } = useMountComponent(TestComponent, {
        props: { id: 1 },
      })

      const { el: el2, destroy: destroy2 } = useMountComponent(TestComponent, {
        props: { id: 2 },
      })

      expect(el1.textContent).toBe('1')
      expect(el2.textContent).toBe('2')
      expect(destroy1).not.toBe(destroy2)

      destroy1()
      expect(el1.innerHTML).toBe('')
      expect(el2.textContent).toBe('2')
    })
  })

  describe('when called with both props and children', () => {
    it('then it should handle both props and children', () => {
      const TestComponent = defineComponent({
        props: ['title'],
        template: '<div><h1>{{ title }}</h1><slot /></div>',
      })

      const { vNode, el } = useMountComponent(TestComponent, {
        props: { title: 'Test Title' },
        children: 'Test content',
      })

      expect(vNode.props?.title).toBe('Test Title')
      expect(vNode.children).toBe('Test content')
      expect(el.textContent).toBe('Test TitleTest content')
    })
  })
})
