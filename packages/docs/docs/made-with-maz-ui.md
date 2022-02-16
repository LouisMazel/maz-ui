---
title: Made with Maz-UI
description: Library of standalone components and tools for Vue & Nuxt
sidebar: false
---

# Made with Maz-UI

<br />

<div class="flex flex-col" style="gap: 2rem">
<MazCard zoom v-for="({images, description, link, title, github }, i) in projects" :key="i" class="maz-w-full" :gallery-height="350" :images="images">
  <h1 class="maz-m-0" style="margin-bottom: 16px;">
    {{ title }}
  </h1>
  <h5 class="maz-m-0">
    {{ description }}
  </h5>

  <template #footer>
    <MazBtn v-if="github" color="black" :href="github" target="_blank" right-icon="Github" style="margin-right: 0.5rem;">
      Github
    </MazBtn>
    <MazBtn :href="link" target="_blank" right-icon="arrow-right">
      Show
    </MazBtn>
  </template>
</MazCard>
</div>

<script lang="ts" setup>
  import image from '@assets/harderbetter.png'

  const projects = [
    {
      title: 'loicmazuel.com',
      images: ['https://louismazel.github.io/maz-ui/_nuxt/img/loicmazuel.08f64a3.png'],
      description: 'Personal Freelance Website',
      link: 'https://www.loicmazuel.com'
    },
    {
      title: 'harderbetter.io',
      images: [image],
      description: 'Football pronostics between friends',
      link: 'https://www.harderbetter.io'
    },
    {
      title: 'whitebird.immo',
      images: ['https://louismazel.github.io/maz-ui/_nuxt/img/whitebird.88df710.jpg'],
      description: 'French startup: Property manager and trustee',
      link: 'https://www.whitebird.immo'
    },
    {
      title: 'Vue Smart List UI',
      images: ['https://louismazel.github.io/maz-ui/_nuxt/img/vue-smart-list-ui.9acb248.png'],
      description: 'An intelligent interface for displaying a list of data and performing filters, sorting and searching on it. Also to display the details of the data.',
      link: 'https://louismazel.github.io/vue-smart-list-ui/',
      github: 'https://github.com/LouisMazel/vue-smart-list-ui'
    },
  ]
</script>
