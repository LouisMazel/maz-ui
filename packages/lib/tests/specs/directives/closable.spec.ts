import { mount } from '@vue/test-utils'
import { vClosable } from '@modules/directives/closable'
import type { Mock } from 'vitest'

describe('vClosable Directive', () => {
  let wrapper: ReturnType<typeof mount>
  let mockHandler: Mock<any, any>

  beforeEach(() => {
    mockHandler = vi.fn()
    wrapper = mount({
      template: '<div v-closable="handler"></div>',
      directives: {
        closable: vClosable,
      },
      setup() {
        return {
          handler: mockHandler,
        }
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should call handler when clicked outside the element', async () => {
    // Simulate click event outside the element
    document.dispatchEvent(new MouseEvent('touchstart'))

    // Check if handler is called
    expect(mockHandler).toHaveBeenCalled()
  })

  it('should not call handler when clicked inside the element', async () => {
    // Simulate click event inside the element
    wrapper.element.click()

    // Check if handler is not called
    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should not call handler when clicked on excluded element', async () => {
    // Add an excluded element
    const excludedElement = document.createElement('div')
    excludedElement.setAttribute('id', 'excluded')
    document.body.append(excludedElement)

    // Simulate click event on the excluded element
    excludedElement.click()

    // Check if handler is not called
    expect(mockHandler).not.toHaveBeenCalled()

    // Clean up the excluded element
    excludedElement.remove()
  })
})
