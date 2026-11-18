<script lang="ts" setup>
import { computed, ref } from 'vue'
import EditorField from './EditorField.vue'
import { PREVIEW_ATTRIBUTE } from './scoped-css'
import { useThemeEditor } from './useThemeEditor'

const editor = useThemeEditor()

const ROUNDED = [
  { key: 'xs', className: 'maz:rounded-xs' },
  { key: 'sm', className: 'maz:rounded-sm' },
  { key: 'md', className: 'maz:rounded-md' },
  { key: 'lg', className: 'maz:rounded-lg' },
  { key: 'xl', className: 'maz:rounded-xl' },
  { key: '2xl', className: 'maz:rounded-2xl' },
  { key: '3xl', className: 'maz:rounded-3xl' },
] as const

const SHADOWS = [
  { key: 'sm', className: 'maz:shadow-sm', hint: 'Small lifts: inputs, chips.' },
  { key: 'md', className: 'maz:shadow-md', hint: 'Menus and popovers.' },
  { key: 'lg', className: 'maz:shadow-lg', hint: 'Floating panels.' },
  { key: 'xl', className: 'maz:shadow-xl', hint: 'Dialogs.' },
  { key: 'elevation', className: 'maz:shadow-elevation', hint: 'Cards, containers and dropdowns of maz-ui.' },
] as const

const fineTune = ref(false)

const RADIUS_PATH = ['scales', 'rounded', 'md'] as const

const radius = computed(() => {
  const value = editor.get(RADIUS_PATH)
  if (value.endsWith('rem'))
    return Number.parseFloat(value)
  if (value.endsWith('px'))
    return Number.parseFloat(value) / 16

  return undefined
})
</script>

<template>
  <div class="maz:flex maz:flex-col maz:gap-8">
    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Radius
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          One value drives the scale: the other steps derive from <code class="maz:text-code">md</code> unless you set them.
        </p>
      </header>

      <EditorField label="Medium radius" :paths="[RADIUS_PATH]" :value="editor.get(RADIUS_PATH)">
        <MazSlider
          v-if="radius !== undefined"
          :model-value="radius"
          :min="0"
          :max="2"
          :step="0.0625"
          :divider="false"
          aria-label="Medium radius in rem"
          @update:model-value="editor.set(RADIUS_PATH, `${$event}rem`)"
        />
        <MazInput
          v-else
          :model-value="editor.get(RADIUS_PATH)"
          aria-label="Medium radius"
          size="sm"
          block
          debounce
          @update:model-value="editor.set(RADIUS_PATH, $event)"
        />
      </EditorField>

      <div v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:grid maz:grid-cols-7 maz:gap-2" aria-hidden="true">
        <div v-for="item in ROUNDED" :key="item.key" class="maz:flex maz:flex-col maz:items-center maz:gap-1">
          <span class="maz:aspect-square maz:w-full maz:border-2 maz:border-primary maz:bg-primary-100 maz:dark:bg-primary-900" :class="item.className" />
          <span class="maz:font-mono maz:text-xs maz:text-muted">{{ item.key }}</span>
        </div>
      </div>

      <MazSwitch v-model="fineTune" label="Set each step" />
      <div v-if="fineTune" class="maz:grid maz:gap-3 maz:mob-l:grid-cols-2">
        <EditorField v-for="item in ROUNDED.filter(entry => entry.key !== 'md')" :key="item.key" :label="`rounded-${item.key}`" :paths="[['scales', 'rounded', item.key]]">
          <MazInput
            :model-value="editor.get(['scales', 'rounded', item.key])"
            :aria-label="`rounded-${item.key}`"
            placeholder="From md"
            size="sm"
            block
            debounce
            @update:model-value="editor.set(['scales', 'rounded', item.key], $event)"
          />
        </EditorField>
      </div>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Density and borders
        </h3>
      </header>
      <EditorField label="Spacing unit" :paths="[['foundation', 'space']]" hint="Base unit of p-*, m-*, gap-* and of the component paddings (Tailwind: 0.25rem).">
        <MazInput
          :model-value="editor.get(['foundation', 'space'])"
          aria-label="Spacing unit"
          size="sm"
          block
          debounce
          @update:model-value="editor.set(['foundation', 'space'], $event)"
        />
      </EditorField>
      <EditorField label="Border width" :paths="[['foundation', 'border-width']]" hint="Default width of border and of the component outlines.">
        <MazInput
          :model-value="editor.get(['foundation', 'border-width'])"
          aria-label="Border width"
          size="sm"
          block
          debounce
          @update:model-value="editor.set(['foundation', 'border-width'], $event)"
        />
      </EditorField>
    </section>

    <section class="maz:flex maz:flex-col maz:gap-4">
      <header>
        <h3 class="maz:m-0 maz:text-title-4">
          Shadows
        </h3>
        <p class="maz:m-0 maz:mt-1 maz:text-body-sm maz:text-muted">
          Any box-shadow. The color comes from <code class="maz:text-code">shadow</code> when you use <code class="maz:text-code">var(--maz-shadow)</code>.
        </p>
      </header>
      <div v-for="item in SHADOWS" :key="item.key" class="maz:grid maz:grid-cols-[3.5rem_minmax(0,1fr)] maz:items-center maz:gap-4">
        <span v-bind="{ [PREVIEW_ATTRIBUTE]: '' }" class="maz:size-14 maz:rounded-md maz:border maz:border-divider" :class="item.className" aria-hidden="true" />
        <EditorField :label="`shadow-${item.key}`" :paths="[['scales', 'shadow', item.key]]" :hint="item.hint">
          <MazInput
            :model-value="editor.get(['scales', 'shadow', item.key])"
            :aria-label="`shadow-${item.key}`"
            size="sm"
            block
            debounce
            input-classes="maz:font-mono maz:text-xs"
            @update:model-value="editor.set(['scales', 'shadow', item.key], $event)"
          />
        </EditorField>
      </div>
    </section>
  </div>
</template>
