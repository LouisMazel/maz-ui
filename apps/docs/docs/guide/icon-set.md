# Icon Set (300+ icons)

The library includes **300+ carefully**

## Icon Naming Convention

All icons follow a consistent naming pattern:

- Vue components: `Maz` + PascalCase (e.g., `MazUserCircle`)
- SVG files: kebab-case (e.g., `user-circle.svg`)

## Find your icon

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <div class="maz-flex maz-gap-2 maz-items-start">
      <MazInput v-model="search" label="Search icon" @update:model-value="search = $event.trim()" :left-icon="MazIcons.MazMagnifyingGlass" class="flex-1" />
      <div class="maz-flex maz-flex-col maz-gap-1 maz-items-end">
        <p class="maz-text-muted">{{ filteredIcons.length }} icons found</p>
        <p class="maz-text-muted">
          Click to copy icon to clipboard
        </p>
      </div>
    </div>
    <div class="maz-grid maz-grid-cols-3 maz-gap-2">
      <button v-for="icon in filteredIcons" :key="icon.label" class="maz-flex maz-flex-col maz-items-center maz-gap-2 maz-text-center maz-border maz-border-solid maz-border-divider maz-rounded maz-p-4 maz-truncate hover:maz-bg-surface-400" @click="copyIcon(icon.label)">
        <Component :is="icon.value" class="maz-text-2xl" />
        <span class="maz-text-xs maz-text-muted maz-truncate">{{ icon.label }}</span>
      </button>
    </div>
  </div>
</ComponentDemo>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'maz-ui/composables/useToast'
import { vTooltip } from 'maz-ui/directives/vTooltip'

const MazIcons = await import('@maz-ui/icons')
const { success} = useToast()

const icons = Object.entries(MazIcons).map(([name, component]) => ({
  label: name,
  value: component,
}))

const search = ref()

const filteredIcons = computed(() => {
  console.log(search.value)
  if (!search.value) return icons

  return icons.filter(icon => icon.label.toLowerCase().includes(search.value.toLowerCase())).slice(0, 10)
})

const copyIcon = (icon) => {
  navigator.clipboard.writeText(icon)
  success('Icon copied to clipboard')
}
</script>
