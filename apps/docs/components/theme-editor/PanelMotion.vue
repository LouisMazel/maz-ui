<script lang="ts" setup>
import { MazPlay } from '@maz-ui/icons/raw/MazPlay'
import { ref } from 'vue'
import EditorField from './EditorField.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const DURATIONS = [
  { key: 'motion-fast', label: 'Fast', hint: 'Hovers, small toggles.' },
  { key: 'motion-normal', label: 'Normal', hint: 'Default of the transitions.' },
  { key: 'motion-slow', label: 'Slow', hint: 'Panels, dialogs, large moves.' },
] as const

const EASINGS = [
  { key: 'easing-out', label: 'Ease out', hint: 'Elements that enter.' },
  { key: 'easing-in', label: 'Ease in', hint: 'Elements that leave.' },
  { key: 'easing-in-out', label: 'Ease in-out', hint: 'Elements that move.' },
] as const

const CURSORS = [
  { label: 'pointer', value: 'pointer' },
  { label: 'default', value: 'default' },
] as const

const DISABLED_CURSORS = [
  { label: 'not-allowed', value: 'not-allowed' },
  { label: 'default', value: 'default' },
] as const

const played = ref(false)
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-8">
    <section class="maz:flex maz:flex-col maz:gap-4">
      <header class="maz:flex maz:items-start maz:gap-3">
        <div class="maz:flex-1">
          <h3 class="maz:m-0 maz:text-title-4">
            Motion
          </h3>
          <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
            Durations and easings of every transition of the components.
          </p>
        </div>
        <MazBtn size="xs" color="surface" outlined :start-icon="MazPlay" @click="played = !played">
          Play
        </MazBtn>
      </header>

      <div v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:flex maz:flex-col maz:gap-2 maz:rounded-lg maz:border maz:border-divider maz:p-3" aria-hidden="true">
        <div v-for="item in DURATIONS" :key="item.key" class="maz:flex maz:items-center maz:gap-3">
          <span class="maz:w-14 maz:font-mono maz:text-xs maz:text-muted">{{ item.label }}</span>
          <span class="maz:relative maz:h-3 maz:flex-1">
            <span
              class="maz:absolute maz:inset-s-0 maz:top-0 maz:size-3 maz:rounded-full maz:bg-primary"
              :style="{
                insetInlineStart: played ? 'calc(100% - 0.75rem)' : '0',
                transitionProperty: 'inset-inline-start',
                transitionDuration: `var(--maz-${item.key})`,
                transitionTimingFunction: 'var(--maz-easing-in-out)',
              }"
            />
          </span>
        </div>
      </div>

      <div class="maz:grid maz:gap-3 maz:mob-l:grid-cols-3">
        <EditorField v-for="item in DURATIONS" :key="item.key" :label="item.label" :paths="[['foundation', item.key]]" :hint="item.hint">
          <MazInput
            :model-value="editor.get(['foundation', item.key])"
            :aria-label="`${item.label} duration`"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['foundation', item.key], $event)"
          />
        </EditorField>
      </div>
      <EditorField v-for="item in EASINGS" :key="item.key" :label="item.label" :paths="[['foundation', item.key]]" :hint="item.hint">
        <MazInput
          :model-value="editor.get(['foundation', item.key])"
          :aria-label="item.label"
          size="sm"
          block
          debounce
          input-classes="maz:font-mono maz:text-xs"
          @update:model-value="editor.set(['foundation', item.key], $event)"
        />
      </EditorField>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          States
        </h3>
      </header>
      <EditorField label="Disabled opacity" :paths="[['foundation', 'disabled-opacity']]" :value="editor.get(['foundation', 'disabled-opacity'])">
        <MazSlider
          :model-value="Number.parseFloat(editor.get(['foundation', 'disabled-opacity']) || '0.5')"
          :min="0.2"
          :max="0.9"
          :step="0.05"
          :divider="false"
          aria-label="Disabled opacity"
          @update:model-value="editor.set(['foundation', 'disabled-opacity'], $event)"
        />
      </EditorField>
      <div v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:flex maz:flex-wrap maz:gap-2">
        <MazBtn size="sm" disabled>
          Disabled
        </MazBtn>
        <MazInput model-value="Disabled field" size="sm" disabled aria-label="Disabled field" />
      </div>
      <EditorField label="Disabled cursor" :paths="[['foundation', 'disabled-cursor']]">
        <MazRadioButtons
          :model-value="editor.get(['foundation', 'disabled-cursor'])"
          :options="DISABLED_CURSORS"
          size="xs"
          @update:model-value="editor.set(['foundation', 'disabled-cursor'], $event)"
        />
      </EditorField>
      <EditorField label="Interactive cursor" :paths="[['foundation', 'interactive-cursor']]" hint="Cursor of the buttons, tabs and options: pointer on the web, default on native-like apps.">
        <MazRadioButtons
          :model-value="editor.get(['foundation', 'interactive-cursor']) || 'pointer'"
          :options="CURSORS"
          size="xs"
          @update:model-value="editor.set(['foundation', 'interactive-cursor'], $event)"
        />
      </EditorField>
    </section>
  </div>
</template>
