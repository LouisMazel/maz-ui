# Icon Set (840+ icons)

The library includes **840+ carefully crafted icons**

## Icon Naming Convention

All icons follow a consistent naming pattern:

- Static Vue components: `Maz` + PascalCase (e.g., `MazUserCircle`)
- Lazy Vue components: `LazyMaz` + PascalCase (e.g., `LazyMazUserCircle`)
- SVG files: kebab-case (e.g., `user-circle.svg`)

## Find your icon

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <div class="maz-flex maz-gap-2 maz-items-start">
      <MazInput v-model="search" label="Search icon" @update:model-value="search = $event.trim()" :left-icon="SearchIcon" class="flex-1" :assistive-text="`${filteredIcons.length} icons found`" />
    </div>
    <MazTabs v-model="currentTab">
      <MazTabsBar :items="tabs" />
    </MazTabs>
    <div class="maz-grid maz-grid-cols-3 maz-gap-2">
      <div v-for="icon in filteredIcons" :key="icon.name" class="maz-flex maz-flex-col maz-items-center maz-gap-3 maz-text-center maz-border maz-border-solid maz-border-divider maz-rounded maz-p-4 maz-truncate hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-400">
        <component :is="icon.component" class="maz-size-8" />
        <span class="maz-text-xs maz-text-muted maz-truncate">{{ icon.name }}</span>
        <div class="maz-flex maz-flex-row maz-gap-2 maz-w-full">
          <MazBtn v-tooltip="{ text: 'Copy Name', panelClass: 'maz-text-xs' }" class="maz-flex-1" size="xs" color="background" outlined @click="copyIcon(icon.name)" :icon="ClipboardDocumentIcon" />
          <MazBtn v-tooltip="{ text: 'Copy Static Import', panelClass: 'maz-text-xs' }" class="maz-flex-1" size="xs" color="background" outlined @click="copyStaticImport(icon.name)" :icon="ClipboardDocumentListIcon" />
          <MazBtn v-tooltip="{ text: 'Copy Lazy Import', panelClass: 'maz-text-xs' }" class="maz-flex-1" size="xs" color="info" outlined @click="copyLazyImport(icon.name)" :icon="ClipboardDocumentListIcon" />
        </div>
      </div>
    </div>
  </div>
</ComponentDemo>

<script setup>
import { computed, ref, shallowRef } from 'vue'
import { useToast } from 'maz-ui/composables/useToast'
import { vTooltip } from 'maz-ui/directives/vTooltip'

const LazyIcons = shallowRef()
const SearchIcon = shallowRef()
const ClipboardDocumentIcon = shallowRef()
const ClipboardDocumentListIcon = shallowRef()

const lazyIconModule = await import('@maz-ui/icons/lazy')
LazyIcons.value = lazyIconModule
SearchIcon.value = lazyIconModule.MazMagnifyingGlass
ClipboardDocumentIcon.value = lazyIconModule.MazClipboardDocument
ClipboardDocumentListIcon.value = lazyIconModule.MazClipboardDocumentList

const icons = Object.entries(LazyIcons.value)
  .filter(([name]) => name.startsWith('Maz'))
  .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
  .map(([name, component]) => ({ name, component }))

const { commonIcons, flags, flagsSquare, logos, all } = icons.reduce((acc, iconComponent) => {
  if (iconComponent.name.startsWith('MazFlagSquare')) {
    acc.flagsSquare.push(iconComponent)
  }
  else if (iconComponent.name.startsWith('MazFlag') && iconComponent.name.length >= 8) {
    acc.flags.push(iconComponent)
  }
  else if (iconComponent.name.startsWith('MazLogo') && iconComponent.name.length >= 8) {
    acc.logos.push(iconComponent)
  }
  else if (iconComponent.name.startsWith('Maz')) {
    acc.commonIcons.push(iconComponent)
  }

  acc.all.push(iconComponent)

  return acc
}, {
  commonIcons: [],
  flags: [],
  flagsSquare: [],
  logos: [],
  all: [],
})

const currentTab = ref(1)

const tabs = [
  { label: 'All', badge: { color: 'secondary', content: all.length, roundedSize: 'full' } },
  { label: 'Icons', badge: { color: 'secondary', content: commonIcons.length, roundedSize: 'full' } },
  { label: 'Logos', badge: { color: 'secondary', content: logos.length, roundedSize: 'full' } },
  { label: 'Flags', badge: { color: 'secondary', content: flags.length, roundedSize: 'full' } },
  { label: 'Flags Square', badge: { color: 'secondary', content: flagsSquare.length, roundedSize: 'full' } },
]

const { success } = useToast()

const search = ref()

const filteredIcons = computed(() => {
  const _currentTab = currentTab.value

  const tabMap = { 1: all, 2: commonIcons, 3: logos, 4: flags, 5: flagsSquare }
  const baseIcons = tabMap[_currentTab] || all

  const _search = search.value?.toLowerCase().replace(/\s/g, '')
  if (!_search) return baseIcons

  return baseIcons.filter(icon => icon.name.toLowerCase().includes(_search) || _search.includes(icon.name.toLowerCase()))
})

const copyIcon = (icon) => {
  navigator.clipboard.writeText(icon)
  success('Icon name copied to clipboard')
}

const copyStaticImport = (icon) => {
  navigator.clipboard.writeText(`import { ${icon} } from '@maz-ui/icons'`)
  success('Static import copied to clipboard')
}

const copyLazyImport = (icon) => {
  navigator.clipboard.writeText(`import { Lazy${icon} } from '@maz-ui/icons'`)
  success('Lazy import copied to clipboard')
}
</script>
