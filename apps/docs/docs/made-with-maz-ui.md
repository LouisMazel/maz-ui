---
title: Made with Maz-UI
description: List of websites using maz-ui library
layout: doc
sidebar: false
aside: false
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: info
Propose your website by opening an [issue](https://github.com/LouisMazel/maz-ui/issues/new?assignees=LouisMazel&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE%5D) or a [pull request](https://github.com/LouisMazel/maz-ui/edit/master/packages/docs/docs/made-with-maz-ui.md) and editing this page.
:::

<div class="flex flex-col" style="display: flex; flex-direction: column; gap: 2rem">
  <MazCard zoom v-for="({images, description, link, title, github }, i) in projects" :key="i" class="maz-w-full" :gallery-height="350" :images="images">
    <h1 class="maz-m-0" style="margin-bottom: 16px;">
      {{ title }}
    </h1>
    <h5 class="maz-m-0">
      {{ description }}
    </h5>
    <template #footer>
      <MazBtn v-if="github" color="black" :href="github" target="_blank" left-icon="github" class="maz-mr-4">
        Github
      </MazBtn>
      <MazBtn :href="link" target="_blank" left-icon="arrow-top-right-on-square">
        Show
      </MazBtn>
    </template>
  </MazCard>
</div>

<script lang="ts" setup>
  const projects = [
    {
      title: 'harderbetter.io',
      images: ['https://www.harderbetter.io/images/harderbetter-screenshot.png'],
      description: 'Football predictions between friends',
      link: 'https://www.harderbetter.io'
    },
    {
      title: 'loicmazuel.com',
      images: ['/loicmazuel.png'],
      description: 'Personal Freelance Website',
      link: 'https://www.loicmazuel.com'
    },
    {
      title: 'Vue Smart List UI',
      images: ['/vue-smart-list-ui.png'],
      description: 'An intelligent interface for displaying a list of data and performing filters, sorting and searching on it. Also to display the details of the data.',
      link: 'https://louismazel.github.io/vue-smart-list-ui/',
      github: 'https://github.com/LouisMazel/vue-smart-list-ui'
    },
  ]
</script>
