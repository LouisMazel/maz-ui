<script lang="ts" setup>
import ColorField from './ColorField.vue'
import EditorField from './EditorField.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const WEIGHTS = ['400', '500', '600', '700'].map(value => ({ label: value, value }))
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-8">
    <p class="maz:m-0 maz:text-body-sm maz:text-muted">
      Tokens read by the components only. Backgrounds are edited for the {{ editor.mode.value }} mode, switch the mode in Colors.
    </p>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Buttons and fields
        </h3>
      </header>
      <EditorField label="Button weight" :paths="[['components', 'btn', 'font-weight']]">
        <MazRadioButtons
          :model-value="editor.get(['components', 'btn', 'font-weight'])"
          :options="WEIGHTS"
          size="xs"
          @update:model-value="editor.set(['components', 'btn', 'font-weight'], $event)"
        />
      </EditorField>
      <div v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:flex maz:flex-wrap maz:gap-2">
        <MazBtn size="sm">
          Primary
        </MazBtn>
        <MazBtn size="sm" color="surface" outlined>
          Outlined
        </MazBtn>
      </div>
      <EditorField label="Top label weight" :paths="[['components', 'input', 'top-label-font-weight']]" hint="Label above the fields (top-label prop).">
        <MazRadioButtons
          :model-value="editor.get(['components', 'input', 'top-label-font-weight'])"
          :options="WEIGHTS"
          size="xs"
          @update:model-value="editor.set(['components', 'input', 'top-label-font-weight'], $event)"
        />
      </EditorField>
      <ColorField label="Field background" :path="['components', 'input', 'bg', editor.mode.value]" hint="Inputs, selects, checkboxes, switches, date pickers." />
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Surfaces
        </h3>
      </header>
      <ColorField label="Container background" :path="['components', 'container', 'bg', editor.mode.value]" hint="Cards, containers, dialogs, drawers, popovers and menus." />
      <ColorField label="Glass background" :path="['components', 'glass', 'bg', editor.mode.value]" hint="Translucent material of the glass utility. Usually a color with alpha." />
      <ColorField label="Glass border" :path="['components', 'glass', 'border', editor.mode.value]" />
      <div class="maz:grid maz:gap-3 maz:mob-l:grid-cols-2">
        <EditorField label="Glass blur" :paths="[['components', 'glass', 'blur']]">
          <MazInput
            :model-value="editor.get(['components', 'glass', 'blur'])"
            aria-label="Glass blur"
            placeholder="24px"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['components', 'glass', 'blur'], $event)"
          />
        </EditorField>
        <EditorField label="Glass saturation" :paths="[['components', 'glass', 'saturate']]">
          <MazInput
            :model-value="editor.get(['components', 'glass', 'saturate'])"
            aria-label="Glass saturation"
            placeholder="1.4"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['components', 'glass', 'saturate'], $event)"
          />
        </EditorField>
      </div>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Dialogs
        </h3>
      </header>
      <div class="maz:grid maz:gap-3 maz:mob-l:grid-cols-2">
        <EditorField label="Max width" :paths="[['components', 'dialog', 'max-width']]">
          <MazInput
            :model-value="editor.get(['components', 'dialog', 'max-width'])"
            aria-label="Dialog max width"
            placeholder="38rem"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['components', 'dialog', 'max-width'], $event)"
          />
        </EditorField>
        <EditorField label="Min width" :paths="[['components', 'dialog', 'min-width']]">
          <MazInput
            :model-value="editor.get(['components', 'dialog', 'min-width'])"
            aria-label="Dialog min width"
            placeholder="32rem"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['components', 'dialog', 'min-width'], $event)"
          />
        </EditorField>
      </div>
    </section>
  </div>
</template>
