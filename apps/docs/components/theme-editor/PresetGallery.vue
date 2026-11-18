<script lang="ts" setup>
import { MazCheck } from '@maz-ui/icons/raw/MazCheck'
import { EDITOR_PRESETS, fontName } from './presets'
import { useThemeEditor } from './useThemeEditor'

const emit = defineEmits<{
  select: [name: string]
}>()

const editor = useThemeEditor()

const ROLES = ['primary', 'secondary', 'accent'] as const
</script>

<template>
  <ul class="maz:m-0 maz:grid maz:list-none maz:grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] maz:gap-3 maz:p-0">
    <li v-for="item in EDITOR_PRESETS" :key="item.preset.name" class="maz:min-w-0">
      <button
        type="button"
        class="preset-card maz:relative maz:flex maz:size-full maz:cursor-pointer maz:flex-col maz:gap-3 maz:overflow-hidden maz:rounded-xl maz:border maz:p-3 maz:text-start maz:transition-[transform,box-shadow] maz:duration-200 maz:hover:-translate-y-0.5 maz:hover:shadow-elevation"
        :class="editor.baseName.value === item.preset.name ? 'maz:border-primary maz:ring-2 maz:ring-primary/30' : 'maz:border-divider'"
        :style="{
          background: item.preset.colors[editor.mode.value].surface,
          color: item.preset.colors[editor.mode.value].foreground,
          fontFamily: item.preset.foundation['font-family'],
        }"
        :aria-pressed="editor.baseName.value === item.preset.name"
        @click="emit('select', item.preset.name)"
      >
        <span class="maz:flex maz:items-center maz:gap-1.5" aria-hidden="true">
          <span
            v-for="role in ROLES"
            :key="role"
            class="maz:size-5 maz:shadow-[inset_0_0_0_0.071429rem_rgb(0_0_0/0.08)]"
            :style="{ background: item.preset.colors[editor.mode.value][role], borderRadius: item.preset.scales.rounded.md }"
          />
          <MazIcon v-if="editor.baseName.value === item.preset.name" :icon="MazCheck" size="1rem" class="maz:ms-auto maz:text-primary" />
        </span>
        <span class="maz:flex maz:flex-col maz:gap-0.5">
          <span class="maz:truncate maz:text-[1.0625rem] maz:font-semibold" :style="{ fontFamily: item.preset.foundation['font-display-stack'] }">{{ item.label }}</span>
          <span class="maz:truncate maz:text-xs maz:opacity-70" :title="`${fontName(item.preset.foundation['font-family'])}, radius ${item.preset.scales.rounded.md}${item.preset.systemColors ? ', follows the accent color of the OS' : ''}`">{{ fontName(item.preset.foundation['font-family']) }} · {{ item.preset.scales.rounded.md }}<template v-if="item.preset.systemColors"> · OS accent</template></span>
        </span>
        <span
          class="maz:mt-auto maz:inline-flex maz:h-7 maz:flex-center maz:px-3 maz:text-xs maz:font-semibold"
          :style="{
            background: item.preset.colors[editor.mode.value].primary,
            color: item.preset.colors[editor.mode.value]['primary-foreground'],
            borderRadius: item.preset.scales.rounded.md,
          }"
          aria-hidden="true"
        >
          Button
        </span>
      </button>
    </li>
  </ul>
</template>
