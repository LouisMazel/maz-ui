import type { MazSelectCountryProps } from '@/components/MazSelectCountry.vue'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MazLazyImg from '@/components/MazLazyImg.vue'
import MazSelectCountry from '@/components/MazSelectCountry.vue'

vi.mock('@maz-ui/translations', () => ({
  useTranslations: () => ({
    t: (key: string) => key,
    locale: { value: 'en-US' },
  }),
}))

vi.mock('@maz-ui/utils/helpers/getBrowserLocale', () => ({
  getBrowserLocale: () => 'en-US',
}))

vi.mock('@maz-ui/utils/helpers/getCountryFlagUrl', () => ({
  getCountryFlagUrl: (code: string) => `https://flagcdn.com/h20/${code.toLowerCase()}.png`,
}))

vi.mock('../composables/useDisplayNames', () => ({
  useDisplayNames: () => ({
    getAllDisplayNames: () => ({
      value: [
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
        { code: 'DE', name: 'Germany' },
      ],
    }),
  }),
}))

async function getWrapper({
  props,
  slots,
  attrs,
  shallow = true,
}: {
  props?: Partial<MazSelectCountryProps>
  slots?: Record<string, string>
  attrs?: Record<string, string>
  shallow?: boolean
} = {}) {
  const component = shallow ? shallowMount : mount
  const wrapper = component(MazSelectCountry, {
    props,
    slots,
    attrs,
    global: {
      stubs: {
        teleport: true,
      },
    },
  })

  await vi.dynamicImportSettled()

  return wrapper
}

describe('mazSelectCountry', () => {
  it('renders component with default props', async () => {
    const wrapper = await getWrapper()
    expect(wrapper.find('.m-select-country').exists()).toBe(true)
    expect(wrapper.find('.m-select-country__select').exists()).toBe(true)
  })

  it('renders with custom class and style', async () => {
    const wrapper = await getWrapper({
      props: {
        class: 'custom-class',
        style: 'width: 300px;',
      },
    })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.attributes('style')).toBe('width: 300px;')
  })

  it('renders with primary color by default', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('color')).toBe('primary')
  })

  it('renders with custom color', async () => {
    const wrapper = await getWrapper({
      props: {
        color: 'secondary',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('color')).toBe('secondary')
  })

  it('renders with medium size by default', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('size')).toBe('md')
  })

  it('renders with custom size', async () => {
    const wrapper = await getWrapper({
      props: {
        size: 'lg',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('size')).toBe('lg')
  })

  it('renders with search enabled by default', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('search')).toBe(true)
  })

  it('renders with search disabled', async () => {
    const wrapper = await getWrapper({
      props: {
        search: false,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('search')).toBe(false)
  })

  it('renders with label', async () => {
    const wrapper = await getWrapper({
      props: {
        label: 'Select Country',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('label')).toBe('Select Country')
  })

  it('renders with placeholder', async () => {
    const wrapper = await getWrapper({
      props: {
        placeholder: 'Choose a country',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('placeholder')).toBe('Choose a country')
  })

  it('renders with hint', async () => {
    const wrapper = await getWrapper({
      props: {
        hint: 'Select your country',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('hint')).toBe('Select your country')
  })

  it('renders with error state', async () => {
    const wrapper = await getWrapper({
      props: {
        error: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('error')).toBe('true')
  })

  it('renders with warning state', async () => {
    const wrapper = await getWrapper({
      props: {
        warning: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('warning')).toBe('true')
  })

  it('renders with success state', async () => {
    const wrapper = await getWrapper({
      props: {
        success: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('success')).toBe('true')
  })

  it('renders with disabled state', async () => {
    const wrapper = await getWrapper({
      props: {
        disabled: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('disabled')).toBe('true')
  })

  it('renders with required state', async () => {
    const wrapper = await getWrapper({
      props: {
        required: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('required')).toBe('true')
  })

  it('renders with block layout', async () => {
    const wrapper = await getWrapper({
      props: {
        block: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('block')).toBe('true')
  })

  it('renders with custom list position', async () => {
    const wrapper = await getWrapper({
      props: {
        listPosition: 'top-start',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('listposition')).toBe('top-start')
  })

  it('renders with custom max list width', async () => {
    const wrapper = await getWrapper({
      props: {
        maxListWidth: 400,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('maxlistwidth')).toBe('400')
  })

  it('renders with custom min list width', async () => {
    const wrapper = await getWrapper({
      props: {
        minListWidth: 150,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('minlistwidth')).toBe('150')
  })

  it('renders with custom max list height', async () => {
    const wrapper = await getWrapper({
      props: {
        maxListHeight: 300,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('maxlistheight')).toBe('300')
  })

  it('renders with custom min list height', async () => {
    const wrapper = await getWrapper({
      props: {
        minListHeight: 100,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('minlistheight')).toBe('100')
  })

  it('renders with custom item height', async () => {
    const wrapper = await getWrapper({
      props: {
        itemHeight: 50,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('itemheight')).toBe('50')
  })

  it('renders with custom search threshold', async () => {
    const wrapper = await getWrapper({
      props: {
        searchThreshold: 2,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('searchthreshold')).toBe('2')
  })

  it('renders with custom autocomplete', async () => {
    const wrapper = await getWrapper({
      props: {
        autocomplete: 'country',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('autocomplete')).toBe('country')
  })

  it('renders with model value', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('modelValue')).toBe('FR')
  })

  it('renders with custom options', async () => {
    const options = [
      { code: 'FR', name: 'France' },
      { code: 'US', name: 'United States' },
    ]
    const wrapper = await getWrapper({
      props: {
        options,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('options')).toEqual(options)
  })

  it('renders with show code in list disabled by default', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('optioninputvaluekey')).toBe('name')
  })

  it('renders with show code in list enabled', async () => {
    const wrapper = await getWrapper({
      props: {
        displayCode: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('optioninputvaluekey')).toBe('code')
  })

  it('renders with flags hidden', async () => {
    const wrapper = await getWrapper({
      props: {
        hideFlags: true,
      },
    })
    expect(wrapper.classes()).toContain('--no-flags')
  })

  it('renders with custom format input value function', async () => {
    const formatInputValue = vi.fn()
    const wrapper = await getWrapper({
      props: {
        formatInputValue,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('formatInputValue')).toBe(formatInputValue)
  })

  it('renders with custom search function', async () => {
    const searchFunction = vi.fn()
    const wrapper = await getWrapper({
      props: {
        searchFunction,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('searchFunction')).toBe(searchFunction)
  })

  it('renders with custom translations', async () => {
    const translations = {
      searchPlaceholder: 'Search countries',
    }
    const wrapper = await getWrapper({
      props: {
        translations,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('translations')).toStrictEqual(translations)
  })

  it('renders with custom display names options', async () => {
    const displayNamesOptions = {
      type: 'region' as const,
      languageDisplay: 'standard' as const,
      fallback: 'code' as const,
      style: 'short' as const,
    }
    const wrapper = await getWrapper({
      props: {
        displayNamesOptions,
      },
    })
    expect(wrapper.props('displayNamesOptions')).toEqual(displayNamesOptions)
  })

  it('renders with custom codes type', async () => {
    const wrapper = await getWrapper({
      props: {
        codesType: 'iso' as const,
      },
    })
    expect(wrapper.props('codesType')).toBe('iso')
  })

  it('renders with custom locale', async () => {
    const wrapper = await getWrapper({
      props: {
        locale: 'fr-FR',
      },
    })
    expect(wrapper.props('locale')).toBe('fr-FR')
  })

  it('renders with custom preferred codes', async () => {
    const preferredCodes = ['FR', 'US']
    const wrapper = await getWrapper({
      props: {
        preferredCodes,
      },
    })
    expect(wrapper.props('preferredCodes')).toEqual(preferredCodes)
  })

  it('renders with custom ignored codes', async () => {
    const ignoredCodes = ['XX', 'YY']
    const wrapper = await getWrapper({
      props: {
        ignoredCodes,
      },
    })
    expect(wrapper.props('ignoredCodes')).toEqual(ignoredCodes)
  })

  it('renders with custom only codes', async () => {
    const onlyCodes = ['FR', 'US', 'DE']
    const wrapper = await getWrapper({
      props: {
        onlyCodes,
      },
    })
    expect(wrapper.props('onlyCodes')).toEqual(onlyCodes)
  })

  it('emits update:model-value when value changes', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })

    await mazSelect.vm.$emit('update:model-value', 'FR')

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['FR'])
  })

  it('renders flag when model value is set and flags are not hidden', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
      },
      shallow: false,
    })
    await vi.dynamicImportSettled()

    const mazLazyImg = wrapper.findComponent(MazLazyImg)

    expect(mazLazyImg.exists()).toBe(true)
    expect(mazLazyImg.props('src')).toBe('https://flagcdn.com/h20/fr.png')
  })

  it('does not render flag when flags are hidden', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
        hideFlags: true,
      },
    })
    const mazLazyImg = wrapper.findComponent({ name: 'MazLazyImg' })
    expect(mazLazyImg.exists()).toBe(false)
  })

  it('renders with custom option value key', async () => {
    const wrapper = await getWrapper({
      props: {
        optionValueKey: 'id',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionValueKey')).toBe('id')
  })

  it('renders with custom option label key', async () => {
    const wrapper = await getWrapper({
      props: {
        optionLabelKey: 'title',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionLabelKey')).toBe('title')
  })

  it('renders with custom option input value key', async () => {
    const wrapper = await getWrapper({
      props: {
        optionInputValueKey: 'value',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionInputValueKey')).toBe('value')
  })

  it('renders with code as option input value key when display code is enabled', async () => {
    const wrapper = await getWrapper({
      props: {
        displayCode: true,
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionInputValueKey')).toBe('code')
  })

  it('renders with multiple disabled', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('multiple')).toBe(false)
  })

  it('renders with default option keys', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('optionValueKey')).toBe('code')
    expect(mazSelect.props('optionLabelKey')).toBe('name')
    expect(mazSelect.props('optionInputValueKey')).toBe('name')
  })

  it('renders with default list dimensions', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('maxListWidth')).toBe(250)
    expect(mazSelect.props('minListWidth')).toBe(200)
  })

  it('renders with default display names options', async () => {
    const wrapper = await getWrapper()
    const expectedOptions = {
      type: 'region',
      languageDisplay: 'standard',
      fallback: 'code',
      style: 'long',
    }
    expect(wrapper.props('displayNamesOptions')).toEqual(expectedOptions)
  })

  it('renders country item without flag when hideFlags is true', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
        hideFlags: true,
      },
      shallow: false,
    })

    const mazLazyImg = wrapper.findAll('.maz-size-5.maz-rounded')

    expect(mazLazyImg.length).toBe(0)
  })

  it('renders country item with code when showCodeInList is true', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
        showCodeInList: true,
        open: true,
      },
      shallow: false,
    })

    await wrapper.vm.$nextTick()
    await vi.dynamicImportSettled()

    // Wait for the dropdown to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 100))

    const code = wrapper.find('.maz-truncate .maz-text-muted')

    expect(code.exists()).toBe(true)
    if (code.exists()) {
      expect(code.text()).toBe('AF')
    }
  })

  it('provides selector-flag slot', async () => {
    const wrapper = await getWrapper({
      props: {
        modelValue: 'FR',
      },
      slots: {
        'selector-flag': '<div class="custom-flag">Custom Flag</div>',
      },
      shallow: false,
    })

    expect(wrapper.find('.custom-flag').exists()).toBe(true)
  })

  it('provides no-results slot', async () => {
    const wrapper = await getWrapper({
      props: {
        options: [],
        open: true,
      },
      slots: {
        'no-results': '<div class="no-results">No countries found</div>',
      },
      shallow: false,
    })

    expect(wrapper.find('.no-results').exists()).toBe(true)
  })

  it('provides country-list-flag slot', async () => {
    const wrapper = await getWrapper({
      props: {
        open: true,
      },
      slots: {
        'country-list-flag': '<div class="custom-list-flag">Custom List Flag</div>',
      },
      shallow: false,
    })

    expect(wrapper.find('.custom-list-flag').exists()).toBe(true)
    expect(wrapper.find('.custom-list-flag').text()).toBe('Custom List Flag')
  })

  it('provides country-list-code slot', async () => {
    const wrapper = await getWrapper({
      props: {
        showCodeInList: true,
        open: true,
      },
      slots: {
        'country-list-code': '<span class="custom-code">CODE</span>',
      },
      shallow: false,
    })

    expect(wrapper.find('.custom-code').exists()).toBe(true)
    expect(wrapper.find('.custom-code').text()).toBe('CODE')
  })

  it('provides country-list-name slot', async () => {
    const wrapper = await getWrapper({
      props: {
        open: true,
      },
      slots: {
        'country-list-name': '<span class="custom-name">Custom Name</span>',
      },
      shallow: false,
    })

    expect(wrapper.find('.custom-name').exists()).toBe(true)
    expect(wrapper.find('.custom-name').text()).toBe('Custom Name')
  })

  it('generates unique instance id when no id provided', async () => {
    const wrapper = await getWrapper()
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('id')).toMatch(/^MazSelectCountry-/)
  })

  it('uses provided id when given', async () => {
    const wrapper = await getWrapper({
      props: {
        id: 'custom-id',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.props('id')).toBe('custom-id')
  })

  it('inherits attributes correctly', async () => {
    const wrapper = await getWrapper({
      attrs: {
        'data-test': 'country-select',
      },
    })
    const mazSelect = wrapper.findComponent({ name: 'MazSelect' })
    expect(mazSelect.attributes('data-test')).toBe('country-select')
  })
})
