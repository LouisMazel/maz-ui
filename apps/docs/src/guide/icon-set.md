# Icon Set (840+ icons)

The library includes **840+ carefully**

## Icon Naming Convention

All icons follow a consistent naming pattern:

- Vue components: `Maz` + PascalCase (e.g., `MazUserCircle`)
- SVG files: kebab-case (e.g., `user-circle.svg`)

## Find your icon

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <div class="maz-flex maz-gap-2 maz-items-start">
      <MazInput v-model="search" label="Search icon" @update:model-value="search = $event.trim()" :left-icon="MazIcons.MazMagnifyingGlass" class="flex-1" :assistive-text="`${filteredIcons.length} icons found`" />
    </div>
    <MazTabs v-model="currentTab">
      <MazTabsBar :items="tabs" />
    </MazTabs>
    <div class="maz-grid maz-grid-cols-3 maz-gap-2">
      <div v-for="icon in filteredIcons" :key="icon.name" class="maz-flex maz-flex-col maz-items-center maz-gap-3 maz-text-center maz-border maz-border-solid maz-border-divider maz-rounded maz-p-4 maz-truncate hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-400">
        <Component :is="icon.component" class="maz-size-8" />
        <span class="maz-text-xs maz-text-muted maz-truncate">{{ icon.name }}</span>
        <div class="maz-flex maz-flex-row maz-gap-2 maz-w-full">
          <MazBtn v-tooltip="{ text: 'Copy Name', panelClass: 'maz-text-xs' }" class="maz-flex-1" size="xs" color="background" outlined @click="copyIcon(icon.name)" :icon="MazClipboardDocument" />
          <MazBtn v-tooltip="{ text: 'Copy Import', panelClass: 'maz-text-xs' }" class="maz-flex-1" size="xs" color="background" outlined @click="copyIconImport(icon.name)" :icon="MazClipboardDocumentList" />
        </div>
      </div>
    </div>
  </div>
</ComponentDemo>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'maz-ui/composables/useToast'
import { vTooltip } from 'maz-ui/directives/vTooltip'
import { MazClipboardDocument, MazClipboardDocumentList } from '@maz-ui/icons'

const MazIcons = await import('@maz-ui/icons')

const icons = Object.entries(MazIcons).sort(([nameA, _], [nameB, __]) => nameA.localeCompare(nameB)).map(([name, component]) => ({
  name,
  component,
}))

const { commonIcons, flags, flagsSquare, logos, all } = icons.reduce((acc, iconComponent) => {
  if (iconComponent.name.startsWith('MazFlagSquare')) {
    acc.flagsSquare.push(iconComponent)
  }
  else if (iconComponent.name.startsWith('MazFlag') && iconComponent.name.length >= 8) acc.flags.push(iconComponent)
  else if (iconComponent.name.startsWith('MazLogo') && iconComponent.name.length >= 8) acc.logos.push(iconComponent)
  else if (iconComponent.name.startsWith('Maz')) acc.commonIcons.push(iconComponent)

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

  const baseIcons = _currentTab === 1 ? all : _currentTab === 2 ? commonIcons : _currentTab === 3 ? logos : _currentTab === 4 ? flags : _currentTab === 5 ? flagsSquare : all

  const _search = search.value?.toLowerCase().replace(/\s/g, '')
  if (!_search) return baseIcons

  return baseIcons.filter(icon => icon.name.toLowerCase().includes(_search) || _search.includes(icon.name.toLowerCase()))
})

const copyIcon = (icon) => {
  navigator.clipboard.writeText(icon)
  success('Icon copied to clipboard')
}

const copyIconImport = (icon) => {
  navigator.clipboard.writeText(`import { ${icon} } from '@maz-ui/icons'`)
  success('Icon import copied to clipboard')
}
</script>
