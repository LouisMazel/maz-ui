import type { UseRovingFocusOptions } from '@composables/useRovingFocus.ts'
import { useRovingFocus } from '@composables/useRovingFocus.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { ref } from 'vue'

function createGroup(labels: string[], direction: 'ltr' | 'rtl' = 'ltr') {
  const container = document.createElement('div')
  container.style.direction = direction
  const items = labels.map((label) => {
    const button = document.createElement('button')
    button.textContent = label
    container.append(button)
    return button
  })
  document.body.append(container)
  return { container, items }
}

function press(target: HTMLElement, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  return event
}

function setup(container: HTMLElement, options: UseRovingFocusOptions = {}) {
  const [result] = withSetup(() => useRovingFocus({ container, selector: 'button', ...options }))
  container.addEventListener('keydown', event => result.onKeydown(event))
  return result
}

describe('given useRovingFocus', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('when reading the tab indexes', () => {
    it('then only the current item is in the tab sequence', () => {
      const { container } = createGroup(['A', 'B', 'C'])
      const { getTabIndex, currentIndex } = setup(container)
      currentIndex.value = 1

      expect([0, 1, 2].map(getTabIndex)).toEqual([-1, 0, -1])
    })

    it('then the first enabled item is used when the current one is disabled', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      items[0].disabled = true
      items[1].setAttribute('aria-disabled', 'true')
      const { getTabIndex, currentIndex } = setup(container)
      currentIndex.value = 0

      expect([0, 1, 2].map(getTabIndex)).toEqual([-1, -1, 0])
    })
  })

  describe('when pressing the horizontal arrows in ltr', () => {
    it('then ArrowRight moves forward, ArrowLeft backward, and the event is prevented', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      const { currentIndex } = setup(container)

      const event = press(items[0], 'ArrowRight')

      expect(event.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(items[1])
      expect(currentIndex.value).toBe(1)

      press(items[1], 'ArrowLeft')

      expect(currentIndex.value).toBe(0)
    })

    it('then the vertical arrows are ignored', () => {
      const { container, items } = createGroup(['A', 'B'])
      const { currentIndex } = setup(container)

      const event = press(items[0], 'ArrowDown')

      expect(event.defaultPrevented).toBe(false)
      expect(currentIndex.value).toBe(0)
    })
  })

  describe('when pressing the horizontal arrows in rtl', () => {
    it('then ArrowLeft moves forward and ArrowRight backward', () => {
      const { container, items } = createGroup(['A', 'B', 'C'], 'rtl')
      const { currentIndex } = setup(container)

      press(items[0], 'ArrowLeft')

      expect(currentIndex.value).toBe(1)

      press(items[1], 'ArrowRight')

      expect(currentIndex.value).toBe(0)
    })
  })

  describe('when the rtl option is forced', () => {
    it('then it replaces the computed direction', () => {
      const { container, items } = createGroup(['A', 'B'])
      const { currentIndex } = setup(container, { rtl: true })

      press(items[0], 'ArrowLeft')

      expect(currentIndex.value).toBe(1)
    })
  })

  describe('when the orientation is vertical', () => {
    it('then ArrowDown and ArrowUp move and the horizontal arrows are ignored', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      const { currentIndex } = setup(container, { orientation: 'vertical' })

      press(items[0], 'ArrowDown')

      expect(currentIndex.value).toBe(1)

      press(items[1], 'ArrowUp')

      expect(currentIndex.value).toBe(0)
      expect(press(items[0], 'ArrowRight').defaultPrevented).toBe(false)
    })
  })

  describe('when the orientation is both', () => {
    it('then every arrow moves', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      const { currentIndex } = setup(container, { orientation: 'both' })

      press(items[0], 'ArrowDown')
      press(items[1], 'ArrowRight')

      expect(currentIndex.value).toBe(2)
    })
  })

  describe('when looping', () => {
    it('then the focus wraps around by default', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      const { currentIndex } = setup(container)

      press(items[0], 'ArrowLeft')

      expect(currentIndex.value).toBe(2)

      press(items[2], 'ArrowRight')

      expect(currentIndex.value).toBe(0)
    })

    it('then the focus stays on the edges when loop is false', () => {
      const { container, items } = createGroup(['A', 'B'])
      const { currentIndex } = setup(container, { loop: false })

      const event = press(items[0], 'ArrowLeft')

      expect(event.defaultPrevented).toBe(true)
      expect(currentIndex.value).toBe(0)

      press(items[0], 'ArrowRight')
      press(items[1], 'ArrowRight')

      expect(currentIndex.value).toBe(1)
    })
  })

  describe('when items are disabled', () => {
    it('then they are skipped', () => {
      const { container, items } = createGroup(['A', 'B', 'C', 'D'])
      items[1].disabled = true
      items[2].setAttribute('aria-disabled', 'true')
      const { currentIndex } = setup(container)

      press(items[0], 'ArrowRight')

      expect(currentIndex.value).toBe(3)

      press(items[3], 'ArrowLeft')

      expect(currentIndex.value).toBe(0)
    })

    it('then they are reachable when skipDisabled is false', () => {
      const { container, items } = createGroup(['A', 'B'])
      items[1].setAttribute('aria-disabled', 'true')
      const { currentIndex } = setup(container, { skipDisabled: false })

      press(items[0], 'ArrowRight')

      expect(currentIndex.value).toBe(1)
    })

    it('then nothing moves when every other item is disabled', () => {
      const { container, items } = createGroup(['A', 'B'])
      items[1].disabled = true
      const { currentIndex } = setup(container)

      press(items[0], 'ArrowRight')

      expect(currentIndex.value).toBe(0)
    })
  })

  describe('when pressing Home and End', () => {
    it('then the first and the last enabled items are focused', () => {
      const { container, items } = createGroup(['A', 'B', 'C', 'D'])
      items[0].disabled = true
      items[3].disabled = true
      const { currentIndex } = setup(container)

      press(items[1], 'End')

      expect(currentIndex.value).toBe(2)

      press(items[2], 'Home')

      expect(currentIndex.value).toBe(1)
    })

    it('then they are ignored when homeEnd is false', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      const { currentIndex } = setup(container, { homeEnd: false })

      const event = press(items[0], 'End')

      expect(event.defaultPrevented).toBe(false)
      expect(currentIndex.value).toBe(0)
    })
  })

  describe('when typeahead is enabled', () => {
    it('then typing letters jumps to the matching item and the buffer resets after 500ms', () => {
      vi.useFakeTimers()
      const { container, items } = createGroup(['Apple', 'Banana', 'Blueberry', 'Cherry'])
      const { currentIndex } = setup(container, { typeahead: true })

      press(items[0], 'b')

      expect(currentIndex.value).toBe(1)

      press(items[1], 'b')

      expect(currentIndex.value).toBe(2)

      press(items[2], 'l')

      vi.advanceTimersByTime(600)
      press(items[2], 'c')

      expect(currentIndex.value).toBe(3)
    })

    it('then a longer buffer matches the full prefix', () => {
      const { container, items } = createGroup(['Banana', 'Blueberry'])
      const { currentIndex } = setup(container, { typeahead: true })

      press(items[0], 'b')
      press(items[0], 'l')

      expect(currentIndex.value).toBe(1)
    })

    it('then modifier keys, a leading space and unknown letters are ignored', () => {
      const { container, items } = createGroup(['Apple', 'Banana'])
      const { currentIndex } = setup(container, { typeahead: true })

      expect(press(items[0], 'b', { ctrlKey: true }).defaultPrevented).toBe(false)
      expect(press(items[0], ' ').defaultPrevented).toBe(false)
      expect(press(items[0], 'z').defaultPrevented).toBe(false)
      expect(currentIndex.value).toBe(0)
    })

    it('then it does nothing when disabled by default', () => {
      const { container, items } = createGroup(['Apple', 'Banana'])
      const { currentIndex } = setup(container)

      press(items[0], 'b')

      expect(currentIndex.value).toBe(0)
    })
  })

  describe('when activateOnFocus is enabled', () => {
    it('then onActivate is called with the index and the element when the focus moves', () => {
      const { container, items } = createGroup(['A', 'B'])
      const onActivate = vi.fn()
      setup(container, { activateOnFocus: true, onActivate })

      press(items[0], 'ArrowRight')
      press(items[1], 'ArrowLeft')
      press(items[0], 'Home')

      expect(onActivate).toHaveBeenCalledTimes(2)
      expect(onActivate).toHaveBeenNthCalledWith(1, 1, items[1])
    })

    it('then onActivate is not called by default', () => {
      const { container, items } = createGroup(['A', 'B'])
      const onActivate = vi.fn()
      setup(container, { onActivate })

      press(items[0], 'ArrowRight')

      expect(onActivate).not.toHaveBeenCalled()
    })
  })

  describe('when calling focusItem', () => {
    it('then it focuses an enabled item and ignores a disabled or missing one', () => {
      const { container, items } = createGroup(['A', 'B', 'C'])
      items[1].disabled = true
      const { focusItem, currentIndex } = setup(container)

      focusItem(2)
      focusItem(1)
      focusItem(9)

      expect(document.activeElement).toBe(items[2])
      expect(currentIndex.value).toBe(2)
    })
  })

  describe('when the items come from a getter', () => {
    it('then the handler takes the index from the argument', () => {
      const { items } = createGroup(['A', 'B', 'C'])
      const [{ onKeydown, currentIndex }] = withSetup(() => useRovingFocus({ items: () => [...items, null], rtl: false }))

      onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 1)

      expect(currentIndex.value).toBe(2)
    })

    it('then the current index of the event target is used when it is inside an item', () => {
      const { items } = createGroup(['A', 'B', 'C'])
      const inner = document.createElement('span')
      items[1].append(inner)
      const [{ onKeydown, currentIndex }] = withSetup(() => useRovingFocus({ items: () => items }))

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      Object.defineProperty(event, 'target', { value: inner })
      onKeydown(event)

      expect(currentIndex.value).toBe(2)
    })

    it('then the current index is used when the target is not an item', () => {
      const { items } = createGroup(['A', 'B', 'C'])
      const [{ onKeydown, currentIndex }] = withSetup(() => useRovingFocus({ items: () => items }))
      currentIndex.value = 1

      onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

      expect(currentIndex.value).toBe(2)
    })

    it('then the direction is read from the parent of the first item without container', () => {
      const { items } = createGroup(['A', 'B'], 'rtl')
      const [{ onKeydown, currentIndex }] = withSetup(() => useRovingFocus({ items: () => items }))

      onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }), 0)

      expect(currentIndex.value).toBe(1)
    })
  })

  describe('when there is no item', () => {
    it('then the handler does nothing', () => {
      const [{ onKeydown }] = withSetup(() => useRovingFocus())

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      onKeydown(event)

      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('when a current index ref is provided and the container is a component', () => {
    it('then the ref is shared and the root element is used', () => {
      const { container, items } = createGroup(['A', 'B'])
      const shared = ref(0)
      const [{ onKeydown }] = withSetup(() => useRovingFocus({
        container: { $el: container } as never,
        selector: 'button',
        currentIndex: shared,
      }))

      onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0)

      expect(shared.value).toBe(1)
      expect(document.activeElement).toBe(items[1])
    })
  })
})
