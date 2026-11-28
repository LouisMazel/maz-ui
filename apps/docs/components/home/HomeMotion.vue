<script lang="ts" setup>
import type { HomeData } from '../../.vitepress/data/home.data'
import { useToast } from 'maz-ui/composables/useToast'
import { vMagnetic } from 'maz-ui/directives/vMagnetic'
import { vReveal } from 'maz-ui/directives/vReveal'
import { vRipple } from 'maz-ui/directives/vRipple'
import { vTilt } from 'maz-ui/directives/vTilt'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import HomeChapter from './HomeChapter.vue'
import HomeMotionCell from './HomeMotionCell.vue'

const { data } = defineProps<{ data: HomeData }>()

const toast = useToast()
const swatch = computed(() => data.presets.find(preset => preset.name === 'ocean')!)

const reduced = ref(false)
const rtl = ref(false)

const MOTION_CLASS = 'm-motion-reduced'

watch(reduced, value => document.documentElement.classList.toggle(MOTION_CLASS, value))

onBeforeUnmount(() => document.documentElement.classList.remove(MOTION_CLASS))

const dialogOpened = ref(false)

function save() {
  toast.promise(new Promise<void>((resolve, reject) => {
    setTimeout(() => (Math.random() > 0.25 ? resolve() : reject(new Error('offline'))), 1600)
  }), {
    loading: 'Saving your changes',
    success: 'Changes saved',
    error: 'Could not save, try again',
  })
}

function stack() {
  toast.info('A new release is out')
  toast.success('Your theme is ready')
}

const BILLING = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]
const billing = ref<'monthly' | 'yearly'>('monthly')
const price = computed(() => (billing.value === 'monthly' ? 24 : 19))

const accepted = ref(true)
const notifications = ref(false)
const rating = ref(4)

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Settings', value: 'settings' },
]
const tab = ref('overview')
const page = ref(3)

function scene(sky: string, hill: string, sun: string, grayscale = false) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"${grayscale ? ' style="filter:grayscale(1)"' : ''}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${sun}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><circle cx="850" cy="300" r="90" fill="${sun}" opacity=".9"/><path d="M0 800V520L220 340L420 540L640 300L900 560L1200 400V800Z" fill="${hill}" opacity=".85"/><path d="M0 800V640L300 500L560 660L860 520L1200 680V800Z" fill="${hill}"/></svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const PHOTOS = [
  { src: scene('#1e3a8a', '#0f172a', '#f59e0b'), alt: 'Mountains at dusk', caption: 'Mountains at dusk' },
  { src: scene('#7c3aed', '#1e1b4b', '#f472b6'), alt: 'Violet ridge', caption: 'Violet ridge' },
  { src: scene('#0e7490', '#134e4a', '#fde68a'), alt: 'Teal valley', caption: 'Teal valley' },
]
const BEFORE = scene('#1e3a8a', '#0f172a', '#f59e0b', true)
const AFTER = scene('#1e3a8a', '#0f172a', '#f59e0b')

const lightboxOpened = ref(false)
const lightboxIndex = ref(0)

function openPhoto(index: number) {
  lightboxIndex.value = index
  lightboxOpened.value = true
}

const lastCommand = ref('none yet')

const COMMANDS = [
  {
    label: 'Go to',
    items: [
      { label: 'Getting started', description: 'Install and set up', href: '/guide/getting-started' },
      { label: 'Components', description: 'Every component', href: '/components/maz-btn' },
      { label: 'Theme editor', description: 'Build your preset', href: '/theme-editor' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Toggle reduced motion', keywords: ['animation', 'accessibility'], action: () => { reduced.value = !reduced.value } },
      { label: 'Toggle right to left', keywords: ['rtl', 'arabic', 'direction'], action: () => { rtl.value = !rtl.value } },
    ],
  },
]

const MENU = [
  { label: 'Rename', shortcut: 'F2', action: () => { lastCommand.value = 'Rename' } },
  { label: 'Duplicate', shortcut: 'Ctrl D', action: () => { lastCommand.value = 'Duplicate' } },
  { label: 'Share', disabled: true },
  { separator: true },
  { label: 'Delete', color: 'destructive' as const, action: () => { lastCommand.value = 'Delete' } },
]

const PANELS = [
  { id: 'list', size: 38, min: 20, max: 60 },
  { id: 'detail' },
]

const DOWNLOADS = [62, 71, 68, 84, 91, 88, 104, 112, 109, 128]
const WORDS = ['fast', 'accessible', 'yours']
</script>

<template>
  <HomeChapter id="motion" number="04" label="Motion" :swatch>
    <header class="maz:mb-[clamp(2.5rem,5vw,4rem)]">
      <p class="home-eyebrow">
        Play with it
      </p>
      <h2 id="motion-title" class="home-display maz:mt-3 maz:mb-6 maz:text-[clamp(2.5rem,6vw,4.75rem)] maz:font-bold">
        Motion that follows you
      </h2>
      <p class="home-lead maz:m-0">
        Dialogs grow from the button, numbers roll, pills slide. Everything below is a real component: use it, then turn on reduced motion or right to left to see it follow.
      </p>
    </header>

    <div class="maz:mb-6 maz:flex maz:flex-wrap maz:items-center maz:gap-x-8 maz:gap-y-3 maz:rounded-lg maz:border maz:border-divider maz:bg-container maz:px-5 maz:py-3">
      <MazSwitch v-model="reduced" label="Reduced motion" size="sm" />
      <MazSwitch v-model="rtl" label="Right to left" size="sm" />
      <p class="maz:m-0 maz:ms-auto maz:flex maz:items-center maz:gap-2 maz:text-sm maz:text-muted">
        Open the palette with <MazKbd :keys="['mod', 'J']" size="sm" />
      </p>
    </div>

    <div
      :dir="rtl ? 'rtl' : 'ltr'"
      :lang="rtl ? 'ar' : 'en'"
      class="maz:grid maz:grid-cols-1 maz:gap-4 maz:*:min-w-0 maz:tab-m:grid-cols-2 maz:lap-m:grid-cols-3"
      aria-label="Motion demos"
      role="group"
    >
      <HomeMotionCell v-reveal="'slide-up'" title="Dialog from its button" description="The dialog grows out of the button you pressed, and goes back into it.">
        <div class="maz:flex maz:flex-wrap maz:gap-2">
          <MazBtn @click="dialogOpened = true">
            Open the dialog
          </MazBtn>
          <MazBtn color="surface" variant="outline" @click="save">
            Save
          </MazBtn>
          <MazBtn color="surface" variant="outline" @click="stack">
            Stack toasts
          </MazBtn>
        </div>
        <p class="maz:m-0 maz:text-xs maz:text-muted">
          Save runs a promise toast. Stacked toasts can be swiped away.
        </p>
        <MazDialog v-model="dialogOpened" title="Ship the release?" max-width="26rem">
          <p :dir="rtl ? 'rtl' : 'ltr'" class="maz:m-0 maz:text-muted">
            The dialog started from the button and will fold back into it. Press Escape or click outside.
          </p>
          <template #footer="{ close }">
            <div class="maz:flex maz:justify-end maz:gap-2">
              <MazBtn color="surface" variant="outline" size="sm" @click="close">
                Not now
              </MazBtn>
              <MazBtn size="sm" @click="close">
                Ship it
              </MazBtn>
            </div>
          </template>
        </MazDialog>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 80 }" title="A price that rolls" description="Only the digits that change roll, up or down.">
        <MazSegmented v-model="billing" :options="BILLING" aria-label="Billing" block />
        <p class="maz:m-0 maz:flex maz:items-baseline maz:gap-2 maz:font-display maz:text-5xl maz:font-bold maz:tabular-nums">
          <MazRollingText :value="price" :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }" locale="en-US" dir="ltr" />
          <span class="maz:text-base maz:font-normal maz:text-muted">/ month</span>
        </p>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 160 }" title="Controls with a pulse" description="Checkbox, switch, drawn icon and rating answer to every press.">
        <MazCheckbox v-model="accepted">
          I accept the terms
        </MazCheckbox>
        <MazSwitch v-model="notifications" label="Release notes" />
        <div class="maz:flex maz:items-center maz:justify-between maz:gap-4">
          <MazRating v-model="rating" label="Rating" clearable />
          <MazBtn color="surface" variant="outline" size="sm" :aria-pressed="accepted" @click="accepted = !accepted">
            <MazDrawnIcon name="check" :drawn="accepted" label="Accepted" />
          </MazBtn>
        </div>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="'slide-up'" title="Tabs and pages with a pill" description="One pill slides between the choices, in both directions.">
        <MazTabsBar v-model="tab" :items="TABS" size="sm" standalone :elevation="false" aria-label="Sections" />
        <div class="maz:max-w-full maz:overflow-x-auto maz:p-1">
          <MazPagination v-model="page" :total-pages="5" size="xs" :page-range="1" />
        </div>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 80 }" title="Lightbox from a thumbnail" description="The picture grows from its thumbnail. Swipe, zoom, use the arrows.">
        <ul class="maz:m-0 maz:grid maz:list-none maz:grid-cols-3 maz:gap-2 maz:p-0">
          <li v-for="(photo, index) in PHOTOS" :key="photo.src">
            <button
              type="button"
              class="maz:block maz:w-full maz:cursor-pointer maz:overflow-hidden maz:rounded-md maz:border-0 maz:bg-transparent maz:p-0 maz:focus-ring"
              :aria-label="`Open ${photo.alt}`"
              @click="openPhoto(index)"
            >
              <img :src="photo.src" :alt="photo.alt" width="300" height="200" class="maz:block maz:aspect-3/2 maz:w-full maz:object-cover">
            </button>
          </li>
        </ul>
        <MazLightbox v-model="lightboxOpened" v-model:index="lightboxIndex" :images="PHOTOS" />
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 160 }" title="Commands and menus" description="A palette for the keyboard, a context menu for the pointer.">
        <MazCommandPalette :groups="COMMANDS" shortcut="mod+j" @select="lastCommand = $event.label">
          <template #trigger="{ open }">
            <MazBtn color="surface" variant="outline" block @click="open">
              Open the palette
            </MazBtn>
          </template>
        </MazCommandPalette>
        <MazContextMenu :items="MENU">
          <div tabindex="0" class="maz:flex maz:h-20 maz:flex-center maz:rounded-md maz:border maz:border-dashed maz:border-divider maz:p-3 maz:text-center maz:text-sm maz:text-muted maz:focus-ring">
            Right click, long press or Shift F10
          </div>
        </MazContextMenu>
        <p class="maz:m-0 maz:text-xs maz:text-muted">
          Last command: <span class="maz:text-foreground">{{ lastCommand }}</span>
        </p>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="'slide-up'" title="Numbers with a trend" description="A stat card with its sparkline, counting up when it appears.">
        <MazStatCard label="Weekly downloads" :value="128400" :delta="24" delta-label="vs last week" :data="DOWNLOADS" />
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 80 }" title="Resizable panels" description="Drag the handle, or focus it and use the arrows.">
        <div class="maz:h-36 maz:overflow-hidden maz:rounded-md maz:border maz:border-divider">
          <MazSplitter :panels="PANELS" label="List and detail">
            <template #list>
              <p class="maz:m-0 maz:bg-container maz:p-3 maz:text-sm maz:text-foreground">
                Inbox
              </p>
            </template>
            <template #detail>
              <p class="maz:m-0 maz:p-3 maz:text-sm">
                Pick a message
              </p>
            </template>
          </MazSplitter>
        </div>
      </HomeMotionCell>

      <HomeMotionCell v-reveal="{ effect: 'slide-up', delay: 160 }" title="Before and after" description="Drag the handle or click on the picture.">
        <MazBeforeAfter :before="BEFORE" :after="AFTER" before-alt="Grayscale mountains" after-alt="Mountains at dusk" label="Compare the two pictures" class="maz:rounded-md" />
      </HomeMotionCell>
    </div>

    <div v-reveal="'slide-up'" class="maz:mt-4 maz:mb-8 maz:grid maz:grid-cols-1 maz:gap-4 maz:*:min-w-0 maz:tab-m:grid-cols-2" :dir="rtl ? 'rtl' : 'ltr'">
      <HomeMotionCell title="Feel it in your hands" description="Hover, press and bring the pointer close.">
        <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
          <MazBtn v-ripple color="surface" variant="outline">
            Ripple
          </MazBtn>
          <MazBtn v-magnetic>
            Magnetic
          </MazBtn>
          <div v-tilt="{ glare: true, max: 14 }" class="maz:flex maz:min-h-10 maz:items-center maz:rounded-lg maz:border maz:border-divider maz:bg-container maz:px-5 maz:text-sm maz:shadow-md">
            Tilt me
          </div>
        </div>
      </HomeMotionCell>

      <HomeMotionCell title="Words that change" description="Animated text swaps the word, and shows it at once with reduced motion.">
        <MazAnimatedText
          effect="rotate"
          tag="p"
          text="Interfaces that are {word}"
          :words="WORDS"
          :interval="2500"
          class="maz:m-0 maz:font-display maz:text-3xl maz:font-semibold maz:tracking-tight"
        />
      </HomeMotionCell>
    </div>
  </HomeChapter>
</template>
