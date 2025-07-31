---
title: MazIcon
description: MazIcon is a standalone component to load your svg files
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

- Basically, this component will render your SVG from your project.
- The component will fetch the SVG from the `public` folder and parse it to render it.
- Place your SVG files in a public folder (default `/icons`, use `path` prop to change it)

## Get Icons Pack

This pack is the Heroicons icons set with some others from maz-ui

<MazBtn download href="/icons/_icons.zip" right-icon="arrow-down-tray">
  Download pack
</MazBtn>

Source: [Hericons](https://heroicons.com/)

## Basic usage

```vue
<script setup lang="ts">
import { MazIcon } from 'maz-ui/components'

const iconNames = [
  'academic-cap',
  'adjustments-horizontal',
  'adjustments-vertical',
  'archive-box-arrow-down',
  'archive-box-x-mark',
  'archive-box',
  ...
  'window',
  'wrench-screwdriver',
  'wrench',
  'x-circle',
  'x-mark'
]
</script>

<template>
  <div
    v-for="icon in iconNames"
    :key="icon"
  >
    <MazIcon :name="icon" size="2rem" />
    <span style="font-size: 11px;">
      {{ icon }}
    </span>
  </div>
</template>
```

<div class="flex items-start flex-wrap gap-05">
  <div v-for="icon in iconNames" :key="icon" class="flex flex-col flex-center maz-p-2 maz-rounded" style="border: 1px solid hsl(var(--maz-border-500));">
    <MazIcon :name="icon" size="2rem" />
    <span style="font-size: 11px;">
      {{ icon }}
    </span>
  </div>
</div>

<script setup lang="ts">
  const iconNames = [
    'academic-cap','adjustments-horizontal','adjustments-vertical','archive-box-arrow-down','archive-box-x-mark','archive-box','arrow-down-circle','arrow-down-left','arrow-down-on-square-stack','arrow-down-on-square','arrow-down-right','arrow-down-tray','arrow-down','arrow-left-circle','arrow-left-end-on-rectangle','arrow-left-on-rectangle','arrow-left-start-on-rectangle','arrow-left','arrow-long-down','arrow-long-left','arrow-long-right','arrow-long-up','arrow-path-rounded-square','arrow-path','arrow-right-circle','arrow-right-end-on-rectangle','arrow-right-on-rectangle','arrow-right-start-on-rectangle','arrow-right','arrow-small-down','arrow-small-left','arrow-small-right','arrow-small-up','arrow-top-right-on-square','arrow-trending-down','arrow-trending-up','arrow-up-circle','arrow-up-left','arrow-up-on-square-stack','arrow-up-on-square','arrow-up-right','arrow-up-tray','arrow-up','arrow-uturn-down','arrow-uturn-left','arrow-uturn-right','arrow-uturn-up','arrows-pointing-in','arrows-pointing-out','arrows-right-left','arrows-up-down','at-symbol','backspace','backward','banknotes','bars-2','bars-3-bottom-left','bars-3-bottom-right','bars-3-center-left','bars-3','bars-4','bars-arrow-down','bars-arrow-up','battery-0','battery-100','battery-50','beaker','bell-alert','bell-slash','bell-snooze','bell','bolt-slash','bolt','book-open','bookmark-slash','bookmark-square','bookmark','briefcase','bug-ant','building-library','building-office-2','building-office','building-storefront','cake','calculator','calendar-days','calendar','camera','chart-bar-square','chart-bar','chart-pie','chat-bubble-bottom-center-text','chat-bubble-bottom-center','chat-bubble-left-ellipsis','chat-bubble-left-right','chat-bubble-left','chat-bubble-oval-left-ellipsis','chat-bubble-oval-left','check-badge','check-circle','check','chevron-double-down','chevron-double-left','chevron-double-right','chevron-double-up','chevron-down','chevron-left','chevron-right','chevron-up-down','chevron-up','circle-stack','clipboard-document-check','clipboard-document-list','clipboard-document','clipboard','clock','cloud-arrow-down','cloud-arrow-up','cloud','code-bracket-square','code-bracket','cog-6-tooth','cog-8-tooth','cog','command-line','computer-desktop','cpu-chip','credit-card','cube-transparent','cube','currency-bangladeshi','currency-dollar','currency-euro','currency-pound','currency-rupee','currency-yen','cursor-arrow-rays','cursor-arrow-ripple','device-phone-mobile','device-tablet','document-arrow-down','document-arrow-up','document-chart-bar','document-check','document-duplicate','document-magnifying-glass','document-minus','document-plus','document-text','document','ellipsis-horizontal-circle','ellipsis-horizontal','ellipsis-vertical','envelope-open','envelope','exclamation-circle','exclamation-triangle','eye-dropper','eye-slash','eye','face-frown','face-smile','film','finger-print','fire','flag','folder-arrow-down','folder-minus','folder-open','folder-plus','folder','fork','forward','funnel','gif','gift-top','gift','github','globe-alt','globe-americas','globe-asia-australia','globe-europe-africa','hand-raised','hand-thumb-down','hand-thumb-up','hashtag','heart','home-modern','home','identification','inbox-arrow-down','inbox-stack','inbox','information-circle','key','language','lifebuoy','light-bulb','link','list-bullet','lock-closed','lock-open','magnifying-glass-circle','magnifying-glass-minus','magnifying-glass-plus','magnifying-glass','map-pin','map','megaphone','microphone','minus-circle','minus-small','minus','moon','musical-note','newspaper','no-image','no-symbol','paint-brush','paper-airplane','paper-clip','pause-circle','pause','pencil-square','pencil','phone-arrow-down-left','phone-arrow-up-right','phone-x-mark','phone','photo','play-circle','play-pause','play','plus-circle','plus-small','plus','power','presentation-chart-bar','presentation-chart-line','printer','puzzle-piece','qr-code','question-mark-circle','queue-list','radio','receipt-percent','receipt-refund','rectangle-group','rectangle-stack','rocket-launch','rss','scale','scissors','server-stack','server','share','shield-check','shield-exclamation','shopping-bag','shopping-cart','signal-slash','signal','sparkles','speaker-wave','speaker-x-mark','square-2-stack','square-3-stack-3d','squares-2x2','squares-plus','star','stop-circle','stop','sun','swatch','table-cells','tag','ticket','trash','trophy','truck','tv','user-circle','user-group','user-minus','user-plus','user','users','variable','video-camera-slash','video-camera','view-columns','viewfinder-circle','wallet','wifi','window','wrench-screwdriver','wrench','x-circle','x-mark'
  ]
</script>

## Options

### Set MazIcon path globally

```typescript
import { createApp } from 'vue'
const app = createApp(App)

app.provide('mazIconPath', '/your/custom/path')
```

<!--@include: ./../../.vitepress/generated-docs/maz-icon.doc.md-->
