import MazInputTags from '@components/MazInputTags.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
import { runAxe } from '@tests/helpers/axe'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

function mountTags(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(MazInputTags, {
    props,
    attachTo: document.body,
    ...options,
  })
}

type Wrapper = ReturnType<typeof mountTags>

function getLastEmitted(wrapper: Wrapper) {
  return wrapper.emitted('update:model-value')?.at(-1)?.[0]
}

async function typeAndPress(wrapper: Wrapper, value: string, key = 'Enter') {
  const input = wrapper.find('input')

  await input.setValue(value)
  await input.trigger('keydown', { key })
}

describe('given a MazInputTags with tags', () => {
  describe('when it is rendered', () => {
    it('then each tag is a pastel badge with a remove button', () => {
      const wrapper = mountTags({
        modelValue: ['vue', 'nuxt'],
        size: 'md',
      })

      const tags = wrapper.findAll('.m-input-tags__tag')

      expect(tags.map(tag => tag.text())).toEqual(['vue', 'nuxt'])
      expect(tags[0]?.classes()).toEqual(expect.arrayContaining([
        'm-badge',
        '--pastel',
        '--primary',
        '--md',
      ]))
      expect(tags[0]?.find('.m-badge__remove').attributes('aria-label')).toBe('test vue')
    })
  })

  describe('when the remove button of a tag is clicked', () => {
    it('then the tag is removed', async () => {
      const wrapper = mountTags({
        modelValue: ['vue', 'nuxt'],
      })

      await wrapper.find('.m-badge__remove').trigger('click')

      expect(getLastEmitted(wrapper)).toEqual(['nuxt'])
    })
  })

  describe('when the component is disabled', () => {
    it('then the tags cannot be removed and the input is disabled', () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
        disabled: true,
      })

      expect(wrapper.find('.m-badge__remove').exists()).toBe(false)
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('--disabled')
    })
  })
})

describe('given a MazInputTags', () => {
  describe('when a text is typed and Enter is pressed', () => {
    it('then the text is added as a tag', async () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
      })

      await typeAndPress(wrapper, ' nuxt ')

      expect(getLastEmitted(wrapper)).toEqual(['vue', 'nuxt'])
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    })
  })

  describe('when there is no tag yet', () => {
    it('then the first tag is added', async () => {
      const wrapper = mountTags()

      await typeAndPress(wrapper, 'vue')

      expect(getLastEmitted(wrapper)).toEqual(['vue'])
    })
  })

  describe('when a comma is typed', () => {
    it('then the text is added as a tag, an empty text is ignored', async () => {
      const wrapper = mountTags()

      await typeAndPress(wrapper, 'vue', ',')

      expect(getLastEmitted(wrapper)).toEqual(['vue'])

      await typeAndPress(wrapper, '  ', ',')

      expect(wrapper.emitted('update:model-value')).toHaveLength(1)
    })
  })

  describe('when comma separated texts are added', () => {
    it('then each text is a tag, without duplicates', async () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
      })

      await typeAndPress(wrapper, 'nuxt, vue, vite, nuxt,')

      expect(getLastEmitted(wrapper)).toEqual(['vue', 'nuxt', 'vite'])
    })
  })

  describe('when only existing tags are added', () => {
    it('then nothing is emitted and the input is cleared', async () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
      })

      await typeAndPress(wrapper, 'vue')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    })
  })

  describe('when Enter is pressed on an empty input', () => {
    it('then nothing is added', async () => {
      const wrapper = mountTags()

      await typeAndPress(wrapper, '')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when a key is pressed during a composition', () => {
    it('then it is ignored', async () => {
      const wrapper = mountTags()

      await wrapper.find('input').setValue('vue')
      await wrapper.find('input').trigger('keydown', { key: 'Enter', isComposing: true })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when the input is blurred with a text', () => {
    it('then the text is added as a tag', async () => {
      const wrapper = mountTags()

      await wrapper.find('input').setValue('vue')
      await wrapper.find('input').trigger('blur')

      expect(getLastEmitted(wrapper)).toEqual(['vue'])
    })
  })

  describe('when the input is blurred with add-tags-on-blur disabled', () => {
    it('then the text is kept', async () => {
      const wrapper = mountTags({ addTagsOnBlur: false })

      await wrapper.find('input').setValue('vue')
      await wrapper.find('input').trigger('blur')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('vue')
    })
  })

  describe('when the field is clicked', () => {
    it('then the input is focused, except when disabled', async () => {
      const wrapper = mountTags()

      await wrapper.find('.m-input-tags__field').trigger('click')

      expect(document.activeElement).toBe(wrapper.find('input').element)

      const disabledWrapper = mountTags({ disabled: true })
      await disabledWrapper.find('.m-input-tags__field').trigger('click')

      expect(document.activeElement).not.toBe(disabledWrapper.find('input').element)
    })
  })
})

describe('given a MazInputTags with tags and an empty input', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when Backspace is pressed twice', () => {
    it('then the last tag is marked, then removed', async () => {
      const wrapper = mountTags({
        modelValue: ['vue', 'nuxt'],
      })
      const input = wrapper.find('input')

      await input.trigger('keydown', { key: 'Backspace' })

      expect(wrapper.findAll('.m-input-tags__tag')[1]?.classes()).toContain('--destructive')
      expect(wrapper.emitted('update:model-value')).toBeUndefined()

      await input.trigger('keydown', { key: 'Delete' })

      expect(getLastEmitted(wrapper)).toEqual(['vue'])
    })
  })

  describe('when the mark expires or another key is pressed', () => {
    it('then the last tag is not marked anymore', async () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
      })
      const input = wrapper.find('input')

      await input.trigger('keydown', { key: 'Backspace' })
      vi.advanceTimersByTime(2000)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-input-tags__tag').classes()).not.toContain('--destructive')

      await input.trigger('keydown', { key: 'Backspace' })
      await input.trigger('keydown', { key: 'a' })

      expect(wrapper.find('.m-input-tags__tag').classes()).not.toContain('--destructive')
    })
  })

  describe('when Backspace is pressed with a text in the input', () => {
    it('then no tag is marked', async () => {
      const wrapper = mountTags({
        modelValue: ['vue'],
      })

      await wrapper.find('input').setValue('nu')
      await wrapper.find('input').trigger('keydown', { key: 'Backspace' })

      expect(wrapper.find('.m-input-tags__tag').classes()).not.toContain('--destructive')
    })
  })

  describe('when Backspace is pressed without tag', () => {
    it('then nothing happens', async () => {
      const wrapper = mountTags()

      await wrapper.find('input').trigger('keydown', { key: 'Backspace' })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })
})

describe('given a MazInputTags with labels and texts', () => {
  describe('when it is rendered', () => {
    it('then the top label is linked to the input and the assistive text describes it', () => {
      const wrapper = mountTags({
        id: 'tags',
        topLabel: 'Keywords',
        label: 'Add keywords',
        assistiveText: 'Press Enter to add',
      })

      expect(wrapper.find('label').attributes('for')).toBe('tags')
      expect(wrapper.find('input').attributes('id')).toBe('tags')
      expect(wrapper.find('input').attributes('aria-label')).toBe('Add keywords')
      expect(wrapper.find('input').attributes('aria-describedby')).toBe('tags-assistive-text')
      expect(wrapper.find('.m-input-tags__assistive-text').text()).toBe('Press Enter to add')
    })
  })

  describe('when a label is set without placeholder', () => {
    it('then the label is the placeholder of the input', () => {
      const wrapper = mountTags({ label: 'Keywords' })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Keywords')
    })
  })

  describe('when a placeholder is set with the label', () => {
    it('then the placeholder wins', () => {
      const wrapper = mountTags({ label: 'Keywords', placeholder: 'Add a keyword' })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Add a keyword')
    })
  })

  describe('when a hint is set', () => {
    it('then it replaces the label', () => {
      const wrapper = mountTags({ label: 'Keywords', hint: 'Required' })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Required')
    })
  })
})

describe('given a MazInputTags with a state', () => {
  describe.each([
    ['error', 'maz:border-destructive', 'maz:text-destructive-600!'],
    ['success', 'maz:border-success', 'maz:text-success-600!'],
    ['warning', 'maz:border-warning', 'maz:text-warning-600!'],
  ])('when it is %s', (state, borderClass, textClass) => {
    it('then the field and the texts take its color', () => {
      const wrapper = mountTags({ [state]: true, topLabel: 'Tags', assistiveText: 'Text' })

      expect(wrapper.find('.m-input-tags__field').classes()).toContain(borderClass)
      expect(wrapper.find('label').classes()).toContain(textClass)
      expect(wrapper.find('.m-input-tags__assistive-text').classes()).toContain(textClass)
      expect(wrapper.classes()).toContain('--has-state')
    })
  })

  describe('when it has an error', () => {
    it('then the input is invalid', () => {
      const wrapper = mountTags({ error: true })

      expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    })
  })
})

describe('given a MazInputTags with a size, a color and a rounded size', () => {
  describe('when it is rendered', () => {
    it('then the root has the classes of the size and the color, the field the rounded', () => {
      const wrapper = mountTags({
        size: 'sm',
        color: 'secondary',
        roundedSize: 'full',
        block: true,
      })

      expect(wrapper.classes()).toEqual(expect.arrayContaining([
        '--sm',
        '--secondary',
        'maz:text-sm',
        'maz:w-full',
        '--block',
      ]))
      expect(wrapper.find('.m-input-tags__field').classes()).toContain('maz:rounded-full')
    })
  })
})

describe('given a MazUi global default for size', () => {
  describe('when no size prop is passed', () => {
    it('then the component receives the global size', () => {
      const wrapper = mountTags({}, {
        global: {
          provide: {
            [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
              global: { size: 'xl' },
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--xl')
    })
  })

  describe('when a component-scoped default differs from the global default', () => {
    it('then the component receives the component-scoped size', () => {
      const wrapper = mountTags({}, {
        global: {
          provide: {
            [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
              global: { size: 'mini' },
              MazInputTags: { size: 'lg' },
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--lg')
    })
  })

  describe('when a size prop is passed', () => {
    it('then the instance prop wins over every configured default', () => {
      const wrapper = mountTags({ size: 'sm' }, {
        global: {
          provide: {
            [GLOBAL_CONFIG_INJECTION_KEY as symbol]: {
              global: { size: 'mini' },
              MazInputTags: { size: 'lg' },
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--sm')
    })
  })
})

describe('given a MazInputTags with tags, a top label and an assistive text', () => {
  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', { timeout: 20000 }, async () => {
      mountTags({
        modelValue: ['vue', 'nuxt'],
        topLabel: 'Keywords',
        assistiveText: 'Press Enter to add',
        placeholder: 'Add a keyword',
      })

      expect(await runAxe(document.body)).toHaveNoViolations()
    })
  })
})
