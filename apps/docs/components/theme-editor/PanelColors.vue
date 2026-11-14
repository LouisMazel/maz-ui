<script lang="ts" setup>
import { getContrastRatio } from '@maz-ui/themes/utils/resolve-preset'
import { vTooltip } from 'maz-ui/directives/vTooltip'
import { computed } from 'vue'
import ColorField from './ColorField.vue'
import ContrastPill from './ContrastPill.vue'
import EditorField from './EditorField.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const MODES = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
] as const

const GROUPS = [
  {
    title: 'Brand',
    description: 'Primary carries the main actions, secondary is a second strong brand color, accent highlights, contrast makes inverted surfaces.',
    roles: [
      'primary',
      'secondary',
      'accent',
      'contrast',
    ],
  },
  {
    title: 'Status',
    description: 'Feedback of the alerts, toasts, badges and form states.',
    roles: [
      'info',
      'success',
      'warning',
      'destructive',
    ],
  },
] as const

const SURFACES = [
  { key: 'surface', label: 'Surface', hint: 'Background of the page.' },
  {
    key: 'foreground',
    label: 'Foreground',
    hint: 'Default text.',
    on: 'surface',
  },
  {
    key: 'muted',
    label: 'Muted',
    hint: 'Secondary text, placeholders.',
    on: 'surface',
  },
  { key: 'divider', label: 'Divider', hint: 'Borders and separators.' },
  { key: 'overlay', label: 'Overlay', hint: 'Backdrop of the dialogs.' },
  { key: 'shadow', label: 'Shadow', hint: 'Color of the shadows.' },
] as const

const SCALE_OPTIONS = [
  { label: 'Relative', value: 'relative' },
  { label: 'Perceptual', value: 'perceptual' },
] as const

const SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

const colorsPath = computed(() => ['colors', editor.mode.value] as const)

function path(key: string) {
  return [...colorsPath.value, key]
}

/** Foreground with the best contrast: white or near black */
function autoForeground(role: string) {
  const background = editor.resolved.value?.[editor.mode.value].colors[role as 'primary']?.hex
  if (!background)
    return
  editor.set(path(`${role}-foreground`), getContrastRatio(background, '#ffffff') >= getContrastRatio(background, '#111111')
    ? 'oklch(1 0 0)'
    : 'oklch(0.18 0 0)')
}
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-8">
    <div class="maz:flex maz:flex-col maz:gap-2">
      <MazRadioButtons
        v-model="editor.mode.value"
        :options="MODES"
        size="sm"
        block
        equal-size
        aria-label="Colors to edit"
      />
      <p class="maz:m-0 maz:text-caption">
        Each mode has its own palette. The preview and the page follow the mode you edit.
      </p>
    </div>

    <section v-for="group in GROUPS" :key="group.title" class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          {{ group.title }}
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          {{ group.description }}
        </p>
      </header>

      <div v-for="role in group.roles" :key="role" class="maz:flex maz:flex-col maz:gap-3 maz:rounded-lg maz:border maz:border-divider maz:p-3">
        <div class="maz:flex maz:items-center maz:gap-3">
          <span
            v-bind="{ [PREVIEW_ATTRIBUTE]: '' }"
            class="maz:flex maz:h-9 maz:min-w-16 maz:flex-center maz:rounded-md maz:px-3 maz:text-label maz:capitalize"
            :style="{ background: `var(--maz-${role})`, color: `var(--maz-${role}-foreground)` }"
          >
            {{ role }}
          </span>
          <ContrastPill :ratio="editor.contrast(role, `${role}-foreground`)" />
          <MazBtn v-tooltip="{ text: 'Text color with the best contrast', position: 'top' }" size="mini" color="transparent" outlined class="maz:ms-auto" @click="autoForeground(role)">
            Auto text
          </MazBtn>
        </div>
        <div class="maz:grid maz:gap-3">
          <ColorField :label="role" :path="path(role)" />
          <ColorField label="Text on it" :path="path(`${role}-foreground`)" />
        </div>
      </div>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Surfaces and text
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          The neutral colors of the page. Keep the text at 4.5:1 on the surface.
        </p>
      </header>
      <div class="maz:grid maz:gap-4">
        <div v-for="item in SURFACES" :key="item.key" class="maz:flex maz:flex-col maz:gap-1.5">
          <ColorField :label="item.label" :path="path(item.key)" :hint="item.hint" />
          <ContrastPill v-if="'on' in item" class="maz:self-start" :ratio="editor.contrast(item.key, item.on)" />
        </div>
      </div>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <EditorField
        label="Color scales"
        :paths="[['scales', 'color']]"
        hint="Relative shifts the lightness of the base color (fast, follows the color at runtime). Perceptual keeps the hue and the order of the shades with very light or very dark brand colors."
      >
        <MazRadioButtons
          :model-value="editor.get(['scales', 'color']) || 'relative'"
          :options="SCALE_OPTIONS"
          size="sm"
          @update:model-value="editor.set(['scales', 'color'], $event === 'relative' && !editor.baseValue(['scales', 'color']) ? '' : $event)"
        />
      </EditorField>
      <div v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:flex maz:flex-col maz:gap-1" aria-hidden="true">
        <div v-for="role in ['primary', 'secondary', 'accent']" :key="role" class="maz:grid maz:grid-cols-11 maz:gap-0.5">
          <span
            v-for="step in SCALE_STEPS"
            :key="step"
            class="maz:h-5 maz:first:rounded-s-sm maz:last:rounded-e-sm"
            :style="{ background: `var(--maz-color-${role}-${step})` }"
            :title="`${role}-${step}`"
          />
        </div>
      </div>
    </section>
  </div>
</template>
