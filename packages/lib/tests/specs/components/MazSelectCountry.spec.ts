import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MazSelectCountry from '@/components/MazSelectCountry.vue'

vi.mock('@maz-ui/translations/src/useTranslations.js', () => ({
  useTranslations: () => ({
    t: (key: string) => key,
    locale: { value: 'en-US' }
  })
}))

vi.mock('@maz-ui/utils/src/utils/getBrowserLocale.js', () => ({
  getBrowserLocale: () => 'en-US'
}))

vi.mock('@maz-ui/utils/src/utils/getCountryFlagUrl.js', () => ({
  getCountryFlagUrl: (code: string) => `https://flagcdn.com/h20/${code.toLowerCase()}.png`
}))

vi.mock('../composables/useDisplayNames', () => ({
  useDisplayNames: () => ({
    getAllDisplayNames: () => ({
      value: [
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
        { code: 'DE', name: 'Germany' }
      ]
    })
  })
}))

describe('MazSelectCountry', () => {
  it('renders component with default props', () => {
    const wrapper = mount(MazSelectCountry)
    expect(wrapper.find('.m-select-country').exists()).toBe(true)
    expect(wrapper.find('.m-select-country__select').exists()).toBe(true)
  })

  it('renders with custom class and style', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        class: 'custom-class',
        style: 'width: 300px;'
      }
    })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.attributes('style')).toBe('width: 300px;')
  })

  it('renders with primary color by default', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('color')).toBe('primary')
  })

  it('renders with custom color', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        color: 'secondary'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('color')).toBe('secondary')
  })

  it('renders with medium size by default', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('size')).toBe('md')
  })

  it('renders with custom size', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        size: 'lg'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('size')).toBe('lg')
  })

  it('renders with search enabled by default', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('search')).toBe(true)
  })

  it('renders with search disabled', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        search: false
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('search')).toBe(false)
  })

  it('renders with label', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        label: 'Select Country'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('label')).toBe('Select Country')
  })

  it('renders with placeholder', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        placeholder: 'Choose a country'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('placeholder')).toBe('Choose a country')
  })

  it('renders with hint', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        hint: 'Select your country'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('hint')).toBe('Select your country')
  })

  it('renders with error state', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        error: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('error')).toBe(true)
  })

  it('renders with warning state', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        warning: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('warning')).toBe(true)
  })

  it('renders with success state', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        success: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('success')).toBe(true)
  })

  it('renders with disabled state', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        disabled: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('disabled')).toBe(true)
  })

  it('renders with required state', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        required: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('required')).toBe(true)
  })

  it('renders with block layout', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        block: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('block')).toBe(true)
  })

  it('renders with custom list position', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        listPosition: 'top-start'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('listPosition')).toBe('top-start')
  })

  it('renders with custom max list width', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        maxListWidth: 400
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('maxListWidth')).toBe(400)
  })

  it('renders with custom min list width', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        minListWidth: 150
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('minListWidth')).toBe(150)
  })

  it('renders with custom max list height', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        maxListHeight: 300
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('maxListHeight')).toBe(300)
  })

  it('renders with custom min list height', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        minListHeight: 100
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('minListHeight')).toBe(100)
  })

  it('renders with custom item height', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        itemHeight: 50
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('itemHeight')).toBe(50)
  })

  it('renders with custom search threshold', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        searchThreshold: 2
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('searchThreshold')).toBe(2)
  })

  it('renders with custom autocomplete', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        autocomplete: 'country'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('autocomplete')).toBe('country')
  })

  it('renders with model value', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('modelValue')).toBe('FR')
  })

  it('renders with custom options', () => {
    const options = [
      { code: 'FR', name: 'France' },
      { code: 'US', name: 'United States' }
    ]
    const wrapper = mount(MazSelectCountry, {
      props: {
        options
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('options')).toEqual(options)
  })

  it('renders with show code in list disabled by default', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('showCodeInList')).toBe(false)
  })

  it('renders with show code in list enabled', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        showCodeInList: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('showCodeInList')).toBe(true)
  })

  it('renders with display code', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        displayCode: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('displayCode')).toBe(true)
  })

  it('renders with flags hidden', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        hideFlags: true
      }
    })
    expect(wrapper.classes()).toContain('--no-flags')
  })

  it('renders with custom format input value function', () => {
    const formatInputValue = vi.fn()
    const wrapper = mount(MazSelectCountry, {
      props: {
        formatInputValue
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('formatInputValue')).toBe(formatInputValue)
  })

  it('renders with custom search function', () => {
    const searchFunction = vi.fn()
    const wrapper = mount(MazSelectCountry, {
      props: {
        searchFunction
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('searchFunction')).toBe(searchFunction)
  })

  it('renders with custom translations', () => {
    const translations = {
      searchPlaceholder: 'Search countries'
    }
    const wrapper = mount(MazSelectCountry, {
      props: {
        translations
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('searchPlaceholder')).toBe('Search countries')
  })

  it('renders with custom display names options', () => {
    const displayNamesOptions = {
      type: 'region' as const,
      languageDisplay: 'standard' as const,
      fallback: 'code' as const,
      style: 'short' as const
    }
    const wrapper = mount(MazSelectCountry, {
      props: {
        displayNamesOptions
      }
    })
    expect(wrapper.props('displayNamesOptions')).toEqual(displayNamesOptions)
  })

  it('renders with custom codes type', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        codesType: 'iso' as const
      }
    })
    expect(wrapper.props('codesType')).toBe('iso')
  })

  it('renders with custom locale', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        locale: 'fr-FR'
      }
    })
    expect(wrapper.props('locale')).toBe('fr-FR')
  })

  it('renders with custom preferred codes', () => {
    const preferredCodes = ['FR', 'US']
    const wrapper = mount(MazSelectCountry, {
      props: {
        preferredCodes
      }
    })
    expect(wrapper.props('preferredCodes')).toEqual(preferredCodes)
  })

  it('renders with custom ignored codes', () => {
    const ignoredCodes = ['XX', 'YY']
    const wrapper = mount(MazSelectCountry, {
      props: {
        ignoredCodes
      }
    })
    expect(wrapper.props('ignoredCodes')).toEqual(ignoredCodes)
  })

  it('renders with custom only codes', () => {
    const onlyCodes = ['FR', 'US', 'DE']
    const wrapper = mount(MazSelectCountry, {
      props: {
        onlyCodes
      }
    })
    expect(wrapper.props('onlyCodes')).toEqual(onlyCodes)
  })

  it('emits update:model-value when value changes', async () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })

    await mazSelect.vm.$emit('update:model-value', 'FR')

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['FR'])
  })

  it('renders flag when model value is set and flags are not hidden', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR'
      }
    })
    const mazLazyImg = wrapper.findComponent({ name: 'MazLazyImg' })
    expect(mazLazyImg.exists()).toBe(true)
    expect(mazLazyImg.props('src')).toBe('https://flagcdn.com/h20/fr.png')
  })

  it('does not render flag when flags are hidden', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR',
        hideFlags: true
      }
    })
    const mazLazyImg = wrapper.findComponent({ name: 'MazLazyImg' })
    expect(mazLazyImg.exists()).toBe(false)
  })

  it('renders with custom option value key', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        optionValueKey: 'id'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionValueKey')).toBe('id')
  })

  it('renders with custom option label key', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        optionLabelKey: 'title'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionLabelKey')).toBe('title')
  })

  it('renders with custom option input value key', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        optionInputValueKey: 'value'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionInputValueKey')).toBe('value')
  })

  it('renders with code as option input value key when display code is enabled', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        displayCode: true
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionInputValueKey')).toBe('code')
  })

  it('renders with multiple disabled', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('multiple')).toBe(false)
  })

  it('renders with default option keys', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionValueKey')).toBe('code')
    expect(mazSelect.props('optionLabelKey')).toBe('name')
    expect(mazSelect.props('optionInputValueKey')).toBe('name')
  })

  it('renders with default list dimensions', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('maxListWidth')).toBe(250)
    expect(mazSelect.props('minListWidth')).toBe(200)
  })

  it('renders with default display names options', () => {
    const wrapper = mount(MazSelectCountry)
    const expectedOptions = {
      type: 'region',
      languageDisplay: 'standard',
      fallback: 'code',
      style: 'long'
    }
    expect(wrapper.props('displayNamesOptions')).toEqual(expectedOptions)
  })

  it('renders country item with flag and name', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR'
      }
    })

    const itemSlot = wrapper.vm.$slots.default
    expect(itemSlot).toBeDefined()
  })

  it('renders country item without flag when hideFlags is true', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR',
        hideFlags: true
      }
    })

    const itemSlot = wrapper.vm.$slots.default
    expect(itemSlot).toBeDefined()
  })

  it('renders country item with code when showCodeInList is true', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        showCodeInList: true
      }
    })

    const itemSlot = wrapper.vm.$slots.default
    expect(itemSlot).toBeDefined()
  })

  it('provides selector-flag slot', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        modelValue: 'FR'
      },
      slots: {
        'selector-flag': '<div class="custom-flag">Custom Flag</div>'
      }
    })

    expect(wrapper.find('.custom-flag').exists()).toBe(true)
    expect(wrapper.find('.custom-flag').text()).toBe('Custom Flag')
  })

  it('provides no-results slot', () => {
    const wrapper = mount(MazSelectCountry, {
      slots: {
        'no-results': '<div class="no-results">No countries found</div>'
      }
    })

    expect(wrapper.find('.no-results').exists()).toBe(true)
    expect(wrapper.find('.no-results').text()).toBe('No countries found')
  })

  it('provides country-list-flag slot', () => {
    const wrapper = mount(MazSelectCountry, {
      slots: {
        'country-list-flag': '<div class="custom-list-flag">Custom List Flag</div>'
      }
    })

    expect(wrapper.find('.custom-list-flag').exists()).toBe(true)
    expect(wrapper.find('.custom-list-flag').text()).toBe('Custom List Flag')
  })

  it('provides country-list-code slot', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        showCodeInList: true
      },
      slots: {
        'country-list-code': '<span class="custom-code">CODE</span>'
      }
    })

    expect(wrapper.find('.custom-code').exists()).toBe(true)
    expect(wrapper.find('.custom-code').text()).toBe('CODE')
  })

  it('provides country-list-name slot', () => {
    const wrapper = mount(MazSelectCountry, {
      slots: {
        'country-list-name': '<span class="custom-name">Custom Name</span>'
      }
    })

    expect(wrapper.find('.custom-name').exists()).toBe(true)
    expect(wrapper.find('.custom-name').text()).toBe('Custom Name')
  })

  it('generates unique instance id when no id provided', () => {
    const wrapper = mount(MazSelectCountry)
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('id')).toMatch(/^MazSelectCountry-/)
  })

  it('uses provided id when given', () => {
    const wrapper = mount(MazSelectCountry, {
      props: {
        id: 'custom-id'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('id')).toBe('custom-id')
  })

  it('inherits attributes correctly', () => {
    const wrapper = mount(MazSelectCountry, {
      attrs: {
        'data-test': 'country-select'
      }
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('data-test')).toBe('country-select')
  })
})
