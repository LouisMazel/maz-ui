<script setup lang="ts">
import { iconList } from '@maz-ui/icons/icon-list'
import iconFiles from '@maz-ui/icons/icon-names.json'
import MazBtn from 'maz-ui/components/MazBtn'
import MazDialog from 'maz-ui/components/MazDialog'
import MazIcon from 'maz-ui/components/MazIcon'
import MazInput from 'maz-ui/components/MazInput'
import MazTabs from 'maz-ui/components/MazTabs'
import MazTabsBar from 'maz-ui/components/MazTabsBar'
import { useFuzzySearch } from 'maz-ui/composables/useFuzzySearch'
import { useToast } from 'maz-ui/composables/useToast'
import { computed, onMounted, reactive, ref, watch } from 'vue'

type Category = 'icons' | 'logos' | 'flags' | 'square-flags'

interface IconEntry {
  /** `trash`, `flag-fr` */
  name: string
  /** `MazTrash`, `MazFlagFR` */
  component: string
  /** `svg/trash.svg`, `flags/3x2/FR.svg` */
  file: string
  category: Category
  /** The country of a flag (`France`), the brand of a logo, searched with the name */
  label: string
}

const PAGE_SIZE = 96
const ICONS_DIR = '../../../../../packages/icons'

/** The SVG of each icon, loaded when the icon is displayed: the page does not download the 860+ icons */
const svgLoaders = import.meta.glob<string>('../../../../../packages/icons/{svg,flags,logos}/**/*.svg', {
  query: '?raw',
  import: 'default',
})

const normalize = (value: string) => value.toLowerCase().replaceAll(/[^a-z\d]/g, '')
/** A few components end with `Icon` (`MazLinkIcon`), not to clash with a component of maz-ui or a global of JavaScript */
const components = new Map(iconList.filter(name => name.startsWith('Maz')).map(name => [
  normalize(name.slice(3)),
  name,
]))
const regions = new Intl.DisplayNames(['en'], { type: 'region' })

function getCategory(name: string): Category {
  if (name.startsWith('flag-square-'))
    return 'square-flags'
  if (name.startsWith('flag-'))
    return 'flags'
  return name.startsWith('logo-')
    ? 'logos'
    : 'icons'
}

function getLabel(name: string, category: Category): string {
  const code = name.split('-').at(-1) ?? ''

  if (category === 'logos')
    return name.slice('logo-'.length)
  if (category === 'icons' || code.length !== 2)
    return ''

  try {
    return regions.of(code.toUpperCase()) ?? ''
  }
  catch {
    return ''
  }
}

const icons: IconEntry[] = Object.entries(iconFiles as Record<string, string>).map(([name, file]) => {
  const category = getCategory(name)

  return {
    name,
    component: components.get(normalize(name)) ?? components.get(`${normalize(name)}icon`) ?? '',
    file,
    category,
    label: getLabel(name, category),
  }
})

const CATEGORIES = [
  {
    label: 'All',
    filter: () => true,
  },
  {
    label: 'Icons',
    filter: (icon: IconEntry) => icon.category === 'icons',
  },
  {
    label: 'Logos',
    filter: (icon: IconEntry) => icon.category === 'logos',
  },
  {
    label: 'Flags',
    filter: (icon: IconEntry) => icon.category === 'flags',
  },
  {
    label: 'Square flags',
    filter: (icon: IconEntry) => icon.category === 'square-flags',
  },
]

const tabs = CATEGORIES.map(({ label, filter }) => ({
  label,
  badge: { color: 'secondary' as const, content: icons.filter(filter).length, roundedSize: 'full' as const },
}))

const currentTab = ref(1)
const query = ref('')
const limit = ref(PAGE_SIZE)

const categoryIcons = computed(() => icons.filter(CATEGORIES[currentTab.value - 1].filter))
const { items: foundIcons } = useFuzzySearch(categoryIcons, query, {
  keys: ['name', 'label'],
  debounce: 100,
})
const visibleIcons = computed(() => foundIcons.value.slice(0, limit.value))

watch([currentTab, query], () => {
  limit.value = PAGE_SIZE
})

const svgs = reactive(new Map<string, string>())
const requested = new Set<string>()

function loadSvgs(entries: IconEntry[]) {
  for (const icon of entries.filter(entry => !requested.has(entry.name))) {
    requested.add(icon.name)
    svgLoaders[`${ICONS_DIR}/${icon.file}`]?.().then(svg => svgs.set(icon.name, svg))
  }
}

onMounted(() => {
  watch(visibleIcons, loadSvgs, { immediate: true })
})

const selectedIcon = ref<IconEntry>()
const isDialogOpen = ref(false)

function openIcon(icon: IconEntry) {
  selectedIcon.value = icon
  isDialogOpen.value = true
}

const snippets = computed(() => {
  const icon = selectedIcon.value

  if (!icon)
    return []

  return [
    { label: 'By name, in the icon props (with MazUi() or @maz-ui/nuxt)', code: `<MazIcon icon="${icon.name}" />` },
    { label: 'Raw SVG string, for the icon props', code: `import { ${icon.component} } from '@maz-ui/icons/raw/${icon.component}'` },
    { label: 'Component, in a template', code: `import { ${icon.component} } from '@maz-ui/icons/static/${icon.component}'` },
    { label: 'Lazy component, not visible at first render', code: `import { ${icon.component} } from '@maz-ui/icons/lazy/${icon.component}'` },
    { label: 'SVG file', code: `@maz-ui/icons/${icon.file}` },
  ]
})

const toast = useToast()

async function copy(code: string) {
  await navigator.clipboard.writeText(code)
  toast.success('Copied to the clipboard', { timeout: 2000 })
}
</script>

<template>
  <div class="vp-raw maz:flex maz:flex-col maz:gap-4">
    <MazInput
      v-model="query"
      label="Search an icon, a country, a brand"
      start-icon="magnifying-glass"
      :assistive-text="`${foundIcons.length} icons`"
      block
    />

    <MazTabs v-model="currentTab">
      <MazTabsBar :items="tabs" />
    </MazTabs>

    <div v-if="foundIcons.length > 0" class="icon-set-grid maz:grid maz:gap-2">
      <button
        v-for="icon in visibleIcons"
        :key="icon.name"
        type="button"
        class="maz:flex maz:min-w-0 maz:flex-col maz:items-center maz:gap-3 maz:rounded-md maz:border maz:border-divider maz:bg-transparent maz:p-3 maz:transition-colors maz:hover:bg-container"
        :title="icon.label || icon.name"
        @click="openIcon(icon)"
      >
        <MazIcon v-if="svgs.has(icon.name)" :icon="svgs.get(icon.name)" class="maz:text-3xl" />
        <span v-else class="maz:size-[1em] maz:text-3xl" />
        <span class="maz:w-full maz:text-xs maz:wrap-break-word maz:text-muted">{{ icon.name }}</span>
      </button>
    </div>
    <p v-else class="maz:py-8 maz:text-center maz:text-muted">
      No icon matches "{{ query }}"
    </p>

    <MazBtn v-if="foundIcons.length > limit" color="contrast" outlined block @click="limit += PAGE_SIZE">
      Show more ({{ foundIcons.length - limit }})
    </MazBtn>

    <MazDialog v-model="isDialogOpen" :title="selectedIcon?.name">
      <div v-if="selectedIcon" class="maz:flex maz:flex-col maz:gap-4">
        <div class="maz:flex maz:flex-center maz:rounded-md maz:bg-container maz:py-6">
          <MazIcon v-if="svgs.has(selectedIcon.name)" :icon="svgs.get(selectedIcon.name)" class="maz:text-6xl" />
        </div>
        <div v-for="snippet in snippets" :key="snippet.label" class="maz:flex maz:flex-col maz:gap-1">
          <span class="maz:text-sm maz:text-muted">{{ snippet.label }}</span>
          <div class="maz:flex maz:items-center maz:gap-2">
            <code class="maz:min-w-0 maz:flex-1 maz:rounded-md maz:bg-container maz:px-3 maz:py-2 maz:text-sm maz:wrap-break-word maz:whitespace-pre-wrap">{{ snippet.code }}</code>
            <MazBtn size="sm" color="contrast" outlined icon="clipboard-document" aria-label="Copy" @click="copy(snippet.code)" />
          </div>
        </div>
      </div>
    </MazDialog>
  </div>
</template>

<style scoped>
.icon-set-grid {
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
}
</style>
