<script lang="ts" setup>
import type { TypographyLevel } from '@maz-ui/themes'
import { computed, ref } from 'vue'
import EditorField from './EditorField.vue'
import { fontName } from './presets'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const SANS = ['ui-sans-serif', 'system-ui', 'sans-serif'].join(', ')

const FONTS = [
  {
    key: 'font-family',
    label: 'Body',
    hint: 'Text, labels, inputs and buttons.',
    choices: [
      ['Manrope', `Manrope, ${SANS}`],
      ['Inter', `Inter, ${SANS}`],
      ['Geist', `Geist, ${SANS}`],
      ['Poppins', `Poppins, ${SANS}`],
      ['System', `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ${SANS}`],
    ],
  },
  {
    key: 'font-display-stack',
    label: 'Titles',
    hint: 'Display and titles of the type scale.',
    choices: [
      ['Manrope', `Manrope, ${SANS}`],
      ['Geist', `Geist, ${SANS}`],
      ['Poppins', `Poppins, ${SANS}`],
      ['Fraunces', 'Fraunces, ui-serif, Georgia, serif'],
      ['System', `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ${SANS}`],
    ],
  },
  {
    key: 'font-mono-stack',
    label: 'Code',
    hint: 'Code blocks, inline code, keys.',
    choices: [
      ['Geist Mono', '\'Geist Mono\', ui-monospace, SFMono-Regular, Menlo, monospace'],
      ['System', 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'],
    ],
  },
] as const

const LEVELS: readonly { level: TypographyLevel, sample: string, className: string }[] = [
  { level: 'display', sample: 'Make it yours', className: 'maz:text-display' },
  { level: 'title-1', sample: 'Page title', className: 'maz:text-title-1' },
  { level: 'title-2', sample: 'Section title', className: 'maz:text-title-2' },
  { level: 'title-3', sample: 'Card and dialog title', className: 'maz:text-title-3' },
  { level: 'title-4', sample: 'Small title', className: 'maz:text-title-4' },
  { level: 'body-lg', sample: 'A lead paragraph that introduces the page.', className: 'maz:text-body-lg' },
  { level: 'body', sample: 'The default reading text of your app.', className: 'maz:text-body' },
  { level: 'body-sm', sample: 'Dense text, descriptions and hints.', className: 'maz:text-body-sm' },
  { level: 'label', sample: 'Labels, tabs and menu items', className: 'maz:text-label' },
  { level: 'caption', sample: 'Captions, metadata, timestamps', className: 'maz:text-caption' },
  { level: 'overline', sample: 'OVERLINE', className: 'maz:text-overline' },
  { level: 'code', sample: 'const theme = \'yours\'', className: 'maz:text-code' },
]

const KEYS = [
  { key: 'size', label: 'Size', placeholder: '1rem' },
  { key: 'weight', label: 'Weight', placeholder: '400' },
  { key: 'leading', label: 'Line height', placeholder: '1.5' },
  { key: 'tracking', label: 'Letter spacing', placeholder: '0' },
] as const

const FONT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Body', value: 'var(--maz-font-family)' },
  { label: 'Titles', value: 'var(--maz-font-display-stack)' },
  { label: 'Code', value: 'var(--maz-font-mono-stack)' },
] as const

const openLevel = ref<TypographyLevel | undefined>('title-1')

const baseFontSize = computed(() => {
  const value = editor.get(['foundation', 'base-font-size'])

  return value.endsWith('px')
    ? Number.parseFloat(value)
    : undefined
})

function summary(level: TypographyLevel): string {
  return KEYS.map(({ key }) => editor.get(['typography', level, key])).filter(Boolean).join(' · ')
}

function isLevelModified(level: TypographyLevel): boolean {
  return editor.isModified(['typography', level])
}
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-8">
    <section class="maz:flex maz:flex-col maz:gap-5">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Fonts
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          Any CSS font stack. The preview loads Manrope, Inter, Geist, Poppins and Fraunces: load your own font in your app.
        </p>
      </header>

      <EditorField v-for="font in FONTS" :key="font.key" :label="font.label" :paths="[['foundation', font.key]]" :hint="font.hint">
        <div class="maz:flex maz:flex-wrap maz:gap-1.5">
          <MazBtn
            v-for="[name, stack] in font.choices"
            :key="name"
            size="xs"
            :color="editor.get(['foundation', font.key]) === stack ? 'primary' : 'surface'"
            :outlined="editor.get(['foundation', font.key]) !== stack"
            :style="{ fontFamily: stack }"
            @click="editor.set(['foundation', font.key], stack)"
          >
            {{ name }}
          </MazBtn>
        </div>
        <MazInput
          :model-value="editor.get(['foundation', font.key])"
          :aria-label="`${font.label} font stack`"
          size="sm"
          block
          debounce
          input-classes="maz:font-mono maz:text-xs"
          @update:model-value="editor.set(['foundation', font.key], $event)"
        />
      </EditorField>

      <EditorField
        label="Base font size"
        :paths="[['foundation', 'base-font-size']]"
        :value="editor.get(['foundation', 'base-font-size'])"
        hint="Size of 1rem: every rem of the app follows it. The preview shows it with Apply to the whole site."
      >
        <MazSlider
          v-if="baseFontSize !== undefined"
          :model-value="baseFontSize"
          :min="12"
          :max="20"
          :divider="false"
          aria-label="Base font size in pixels"
          @update:model-value="editor.set(['foundation', 'base-font-size'], `${$event}px`)"
        />
        <MazInput
          v-else
          :model-value="editor.get(['foundation', 'base-font-size'])"
          aria-label="Base font size"
          size="sm"
          block
          debounce
          @update:model-value="editor.set(['foundation', 'base-font-size'], $event)"
        />
      </EditorField>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-3">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Type scale
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          The <code class="maz:text-code">text-*</code> levels, also used by the titles, hints, tabs and labels of the components. Click a level to tune it.
        </p>
      </header>

      <ul class="maz:m-0 maz:flex maz:list-none maz:flex-col maz:gap-1 maz:p-0">
        <li v-for="item in LEVELS" :key="item.level" class="maz:rounded-lg maz:border maz:border-transparent" :class="{ 'maz:border-divider': openLevel === item.level }">
          <button
            type="button"
            class="maz:flex maz:w-full maz:cursor-pointer maz:flex-col maz:gap-1 maz:rounded-lg maz:border-0 maz:bg-transparent maz:p-3 maz:text-start maz:text-foreground maz:transition-colors maz:hover:bg-surface-600 maz:dark:hover:bg-surface-400"
            :aria-expanded="openLevel === item.level"
            @click="openLevel = openLevel === item.level ? undefined : item.level"
          >
            <span class="maz:flex maz:w-full maz:items-center maz:gap-2 maz:font-mono maz:text-xs maz:text-muted">
              <span v-if="isLevelModified(item.level)" class="maz:size-1.5 maz:rounded-full maz:bg-primary" aria-hidden="true" />
              text-{{ item.level }}
              <span class="maz:ms-auto maz:truncate">{{ summary(item.level) }}</span>
            </span>
            <span v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:block maz:w-full maz:truncate" :class="item.className" :style="{ textWrap: 'nowrap' }">{{ item.sample }}</span>
          </button>

          <div v-if="openLevel === item.level" class="maz:grid maz:gap-3 maz:px-3 maz:pb-3 maz:mob-l:grid-cols-2">
            <EditorField v-for="key in KEYS" :key="key.key" :label="key.label" :paths="[['typography', item.level, key.key]]">
              <MazInput
                :model-value="editor.get(['typography', item.level, key.key])"
                :aria-label="`${key.label} of text-${item.level}`"
                :placeholder="key.placeholder"
                size="sm"
                block
                debounce
                @update:model-value="editor.set(['typography', item.level, key.key], $event)"
              />
            </EditorField>
            <EditorField label="Font" :paths="[['typography', item.level, 'font']]" class="maz:mob-l:col-span-2">
              <MazRadioButtons
                :model-value="editor.get(['typography', item.level, 'font'])"
                :options="FONT_OPTIONS"
                size="xs"
                @update:model-value="editor.set(['typography', item.level, 'font'], $event)"
              />
            </EditorField>
            <EditorField v-if="item.level === 'caption'" label="Color" :paths="[['typography', 'caption', 'color']]" class="maz:mob-l:col-span-2">
              <MazInput
                :model-value="editor.get(['typography', 'caption', 'color'])"
                aria-label="Color of text-caption"
                placeholder="var(--maz-muted)"
                size="sm"
                block
                debounce
                @update:model-value="editor.set(['typography', 'caption', 'color'], $event)"
              />
            </EditorField>
          </div>
        </li>
      </ul>
      <p class="maz:m-0 maz:text-caption">
        Fonts in the preview: {{ fontName(editor.get(['foundation', 'font-family'])) }} for the body, {{ fontName(editor.get(['foundation', 'font-display-stack'])) }} for the titles.
      </p>
    </section>
  </div>
</template>
