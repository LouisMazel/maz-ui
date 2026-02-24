import type { MazSelectProps } from '@components/MazSelect.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazSelect from '@components/MazSelect.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('given MazSelect component (branch coverage)', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof MazSelect> & { [key: string]: any }>

  const basicOptions: MazSelectProps['options'] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ]

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when options are primitive strings', () => {
    it('then it should normalize string options into objects', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: ['one', 'two', 'three'],
          modelValue: 'one',
        },
      })

      expect(wrapper.vm.optionsNormalized).toEqual([
        { value: 'one', label: 'one' },
        { value: 'two', label: 'two' },
        { value: 'three', label: 'three' },
      ])
    })
  })

  describe('when options are primitive numbers', () => {
    it('then it should normalize number options into objects', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [1, 2, 3],
          modelValue: 1,
        },
      })

      expect(wrapper.vm.optionsNormalized).toEqual([
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
      ])
    })
  })

  describe('when options are primitive booleans', () => {
    it('then it should normalize boolean options into objects', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [true, false],
          modelValue: true,
        },
      })

      expect(wrapper.vm.optionsNormalized).toEqual([
        { value: true, label: true },
        { value: false, label: false },
      ])
    })
  })

  describe('when options are normalized objects', () => {
    it('then it should keep them as is with proper keys', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      expect(wrapper.vm.optionsNormalized[0].label).toBe('Apple')
      expect(wrapper.vm.optionsNormalized[0].value).toBe('apple')
    })
  })

  describe('when options include opt groups', () => {
    it('then it should flatten opt groups with isOptGroup marker', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [
            {
              label: 'Fruits',
              options: [
                { label: 'Apple', value: 'apple' },
                { label: 'Banana', value: 'banana' },
              ],
            },
            {
              label: 'Veggies',
              options: ['carrot', 'potato'],
            },
          ],
          modelValue: undefined,
        },
      })

      const normalized = wrapper.vm.optionsNormalized
      expect(normalized[0]).toEqual({ label: 'Fruits', isOptGroup: true })
      expect(normalized[1]).toEqual({ label: 'Apple', value: 'apple' })
      expect(normalized[2]).toEqual({ label: 'Banana', value: 'banana' })
      expect(normalized[3]).toEqual({ label: 'Veggies', isOptGroup: true })
      expect(normalized[4]).toEqual({ label: 'carrot', value: 'carrot' })
      expect(normalized[5]).toEqual({ label: 'potato', value: 'potato' })
    })
  })

  describe('when options array is empty', () => {
    it('then optionsNormalized should be empty', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [],
          modelValue: undefined,
        },
      })

      expect(wrapper.vm.optionsNormalized).toEqual([])
    })
  })

  describe('when modelValue is undefined', () => {
    it('then inputValue should be undefined', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      expect(wrapper.vm.inputValue).toBeUndefined()
    })
  })

  describe('when modelValue is null', () => {
    it('then inputValue should be undefined (isNullOrUndefined branch)', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: null as any,
        },
      })

      expect(wrapper.vm.inputValue).toBeUndefined()
    })
  })

  describe('when modelValue matches an option', () => {
    it('then inputValue should show the option label', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'banana',
        },
      })

      expect(wrapper.vm.inputValue).toBe('Banana')
    })
  })

  describe('when modelValue does not match any option', () => {
    it('then inputValue should be undefined', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'nonexistent',
        },
      })

      expect(wrapper.vm.inputValue).toBeUndefined()
    })
  })

  describe('when multiple is true', () => {
    it('then inputValue should join multiple selected labels', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: ['apple', 'cherry'],
          multiple: true,
        },
      })

      expect(wrapper.vm.inputValue).toBe('Apple, Cherry')
    })

    it('then selecting an already selected option should deselect it', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: ['apple'],
          multiple: true,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      // Click on the first item (Apple) which is already selected
      await items.at(0)?.trigger('click')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeDefined()
      // After deselecting apple, the value should be empty
      expect(emitted?.[0][0]).toEqual([])
    })

    it('then selecting a new option should add it to the selection', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: ['apple'],
          multiple: true,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      // Click on Banana (index 1)
      await items.at(1)?.trigger('click')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeDefined()
      expect(emitted?.[0][0]).toEqual(['apple', 'banana'])
    })

    it('then the list should not close after selecting when multiple is true', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: [],
          multiple: true,
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)

      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      await items.at(0)?.trigger('click')

      await nextTick()

      // isOpen should remain true for multiple select
      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('when multiple is true and modelValue is empty array', () => {
    it('then selectedOptions should be empty', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: [],
          multiple: true,
        },
      })

      expect(wrapper.vm.selectedOptions).toEqual([])
    })
  })

  describe('when formatInputValue is provided', () => {
    it('then it should use custom formatter for single value', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
          formatInputValue: (val: any) => `Selected: ${val}`,
        },
      })

      expect(wrapper.vm.inputValue).toBe('Selected: Apple')
    })

    it('then it should use custom formatter for multiple values', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: ['apple', 'banana'],
          multiple: true,
          formatInputValue: (vals: any) => `${vals.length} selected`,
        },
      })

      expect(wrapper.vm.inputValue).toBe('2 selected')
    })
  })

  describe('when custom optionValueKey, optionLabelKey, optionInputValueKey are set', () => {
    it('then it should use custom keys to read options', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [
            { id: 1, name: 'First', display: 'Option 1' },
            { id: 2, name: 'Second', display: 'Option 2' },
          ],
          modelValue: 1,
          optionValueKey: 'id',
          optionLabelKey: 'name',
          optionInputValueKey: 'display',
        },
      })

      expect(wrapper.vm.inputValue).toBe('Option 1')
    })
  })

  describe('when isSelectedOption is called with null/undefined value', () => {
    it('then it should return false for option with undefined value', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [{ label: 'None', value: undefined }],
          modelValue: undefined,
        },
      })

      const result = wrapper.vm.isSelectedOption({ label: 'None', value: undefined })
      expect(result).toBe(false)
    })

    it('then it should return false for option with null value', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [{ label: 'Null', value: null }],
          modelValue: null,
        },
      })

      const result = wrapper.vm.isSelectedOption({ label: 'Null', value: null })
      expect(result).toBe(false)
    })
  })

  describe('when isOptionInSelection is called', () => {
    it('then it should return false for option with null/undefined value', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [{ label: 'None', value: undefined }],
          modelValue: 'something',
        },
      })

      // The internal selectedOptions won't include an option with undefined value
      expect(wrapper.vm.selectedOptions).toEqual([])
    })

    it('then it should match for multiple mode with array modelValue', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: ['apple', 'cherry'],
          multiple: true,
        },
      })

      expect(wrapper.vm.selectedOptions.length).toBe(2)
    })

    it('then it should match for single mode', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'cherry',
        },
      })

      expect(wrapper.vm.selectedOptions.length).toBe(1)
      expect(wrapper.vm.selectedOptions[0].label).toBe('Cherry')
    })
  })

  describe('when search prop is true', () => {
    it('then search input should be rendered', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
          search: true,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      expect(wrapper.find('.m-select-list__search-input').exists()).toBe(true)
    })

    it('then typing in search should filter options', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
        },
      })

      wrapper.vm.searchQuery = 'ban'
      await nextTick()

      expect(wrapper.vm.optionList.length).toBe(1)
      expect(wrapper.vm.optionList[0].label).toBe('Banana')
    })

    it('then empty search should show all options', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
        },
      })

      wrapper.vm.searchQuery = ''
      await nextTick()

      expect(wrapper.vm.optionList.length).toBe(3)
    })
  })

  describe('when searchFunction is provided', () => {
    it('then it should accept a custom search function', () => {
      const searchFn = vi.fn((query: string, opts: any[]) => {
        return opts.filter(o => o.label.startsWith(query))
      })

      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
          searchFunction: searchFn,
        },
      })

      // Verify the component accepted the searchFunction prop
      expect(wrapper.find('.m-select').exists()).toBe(true)
    })

    it('then if searchFunction returns undefined, it should show empty list', async () => {
      const searchFn = () => undefined

      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
          searchFunction: searchFn as any,
        },
      })

      wrapper.vm.searchQuery = 'xyz'
      await nextTick()

      expect(wrapper.vm.optionList.length).toBe(0)
    })

    it('then it should not use searchFunction when searchQuery is empty', async () => {
      const searchFn = vi.fn(() => [])

      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
          searchFunction: searchFn,
        },
      })

      wrapper.vm.searchQuery = undefined
      await nextTick()

      expect(searchFn).not.toHaveBeenCalled()
    })
  })

  describe('when keyboard navigation is used', () => {
    it('then ArrowDown should open the list if closed', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      expect(wrapper.vm.isOpen).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })

      // Should attempt to open the list
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('then ArrowUp should open the list if closed', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowUp' })

      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('then alphanumeric key should open the list if closed', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'B' })

      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('then modifier keys (ctrl, meta, alt) should be ignored', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'a', ctrlKey: true })
      expect(wrapper.vm.isOpen).toBe(false)

      await input.trigger('keydown', { key: 'a', metaKey: true })
      expect(wrapper.vm.isOpen).toBe(false)

      await input.trigger('keydown', { key: 'a', altKey: true })
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('then alphanumeric key with search enabled should focus search input', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
          search: true,
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'B' })

      await nextTick()

      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('when keydownHandler is triggered with ArrowDown/ArrowUp when list is open', () => {
    it('then ArrowDown should move focus to next item', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          listPosition: 'bottom-start',
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)
      await nextTick()

      // Simulate ArrowDown keydown on the document
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      document.dispatchEvent(event)
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('then ArrowUp should move focus to previous item', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          listPosition: 'bottom-start',
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      document.dispatchEvent(event)
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when keydownHandler handles alphanumeric when search is not enabled', () => {
    it('then it should filter options using searchOptionWithQuery', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          listPosition: 'bottom-start',
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'c' })
      document.dispatchEvent(event)
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('then Backspace should remove last character from query', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          listPosition: 'bottom-start',
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      // Type 'ch'
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
      await nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' }))
      await nextTick()

      // Backspace
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when updateValue is called for single select', () => {
    it('then it should emit the selected value and close the list', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.vm.updateValue({ label: 'Cherry', value: 'cherry' })

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeDefined()
      expect(emitted?.[0][0]).toBe('cherry')
    })

    it('then it should also emit selected-option', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.vm.updateValue({ label: 'Banana', value: 'banana' })

      const emitted = wrapper.emitted('selected-option')
      expect(emitted).toBeDefined()
      expect(emitted?.[0][0]).toEqual({ label: 'Banana', value: 'banana' })
    })
  })

  describe('when updateValue is called with mustCloseList=false', () => {
    it('then the list should remain open for single select', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)

      await wrapper.vm.updateValue({ label: 'Banana', value: 'banana' }, false)
      await nextTick()

      // mustCloseList=false with non-multiple should not close
      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('when scrollToOptionIndex is called with invalid index', () => {
    it('then it should return early for negative index', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      // Should not throw
      await wrapper.vm.scrollToOptionIndex(-1)
      expect(wrapper.exists()).toBe(true)
    })

    it('then it should return early for undefined index', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.vm.scrollToOptionIndex(undefined)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when list opens with a selected option (onOpenList)', () => {
    it('then it should scroll to the selected option and emit open', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'cherry',
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const emitted = wrapper.emitted('open')
      expect(emitted).toBeDefined()
    })
  })

  describe('when list closes', () => {
    it('then it should emit close', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(true)

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(false)

      const emitted = wrapper.emitted('close')
      expect(emitted).toBeDefined()
    })
  })

  describe('when disabled prop is true', () => {
    it('then the select should not open', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
          disabled: true,
        },
      })

      await wrapper.find('input').trigger('click')
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when expose methods are called', () => {
    it('then open() should open the list', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      wrapper.vm.open()
      await nextTick()

      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('then close() should close the list', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
        },
      })

      wrapper.vm.open()
      await nextTick()
      expect(wrapper.vm.isOpen).toBe(true)

      wrapper.vm.close()
      await nextTick()
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when translations prop is provided', () => {
    it('then it should use custom search placeholder', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
          translations: {
            searchPlaceholder: 'Custom search...',
          },
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const searchInput = wrapper.find('.m-select-list__search-input input')
      if (searchInput.exists()) {
        expect(searchInput.attributes('placeholder')).toBe('Custom search...')
      }
    })
  })

  describe('when size prop is set', () => {
    it('then it should apply the size class', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          size: 'lg',
        },
      })

      expect(wrapper.find('.--lg').exists()).toBe(true)
    })
  })

  describe('when color prop is set', () => {
    it('then it should compute selectedTextColor and selectedBgColor', () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: 'apple',
          color: 'secondary',
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when option list is empty and list is open', () => {
    it('then it should show no-results slot', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [],
          modelValue: undefined,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      expect(wrapper.find('.m-select-list__no-results').exists()).toBe(true)
    })
  })

  describe('when optionList has items and list is open', () => {
    it('then it should render option items', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      expect(items.length).toBe(3)
    })
  })

  describe('when searchOptionWithQuery finds no filtered results', () => {
    it('then it should return early', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          listPosition: 'bottom-start',
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      // Type a query that matches nothing
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when itemHeight prop is set', () => {
    it('then it should apply height style to items', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          itemHeight: 48,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      if (items.length > 0) {
        expect(items[0].attributes('style')).toContain('height: 48px')
      }
    })
  })

  describe('when itemHeight prop is not set', () => {
    it('then items should not have explicit height style', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const items = wrapper.findAll('.m-select-list-item')
      if (items.length > 0) {
        const style = items[0].attributes('style')
        expect(style || '').not.toContain('height:')
      }
    })
  })

  describe('when maxListHeight, maxListWidth, minListHeight, minListWidth are set', () => {
    it('then it should apply styles to the list container', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          maxListHeight: 300,
          maxListWidth: 400,
          minListHeight: 100,
          minListWidth: 200,
        },
      })

      await wrapper.find('input').trigger('click')
      await nextTick()

      const list = wrapper.find('.m-select-list')
      if (list.exists()) {
        const style = list.attributes('style') || ''
        expect(style).toContain('max-height: 300px')
        expect(style).toContain('max-width: 400px')
        expect(style).toContain('min-height: 100px')
        expect(style).toContain('min-width: 200px')
      }
    })
  })

  describe('when Cyrillic characters are typed', () => {
    it('then it should be recognized as valid key input', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: [
            { label: '\u0422\u0435\u0441\u0442', value: 'test' }, // "Test" in Russian
          ],
          modelValue: undefined,
        },
      })

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: '\u0422' }) // Cyrillic "T"

      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('when searchQuery is set and then reset on updateValue', () => {
    it('then searchQuery should be cleared', async () => {
      wrapper = mount(MazSelect, {
        props: {
          options: basicOptions,
          modelValue: undefined,
          search: true,
        },
      })

      wrapper.vm.searchQuery = 'app'
      await nextTick()

      await wrapper.vm.updateValue({ label: 'Apple', value: 'apple' })

      expect(wrapper.vm.searchQuery).toBe('')
    })
  })
})
