---
layout: home
title: Maz UI - Standalone Components and Tools Library for Vue & Nuxt
description: Build amazing interfaces with Maz-UI - standalone components & tools library for Vue.JS & Nuxt.JS
hero:
  name: Maz-UI
  text: Lightweight and efficient library
  tagline: Standalone components and tools for Vue & Nuxt
  image:
    src: /img/maz-ui-illu.png
    alt: Logo of Maz-UI
---

<section class="maz-flex maz-pb-14 maz-flex-wrap maz-justify-center maz-items-center tab-l:maz-justify-start maz-gap-2">
  <MazBtn href="/guide/getting-started" color="primary" size="md" rounded>Get Started</MazBtn>
  <MazBtn href="/components/maz-btn" color="theme" size="md" pastel rounded>Components</MazBtn>
  <MazBtn href="/plugins/toaster" color="theme" size="md" pastel rounded>Plugins</MazBtn>
  <MazBtn href="/composables/use-theme-handler" color="theme" size="md" pastel rounded>Composables</MazBtn>
  <MazBtn href="/helpers/currency" color="theme" size="md" pastel rounded>Helpers</MazBtn>
  <MazBtn href="/directives/fullscreen-img" color="theme" size="md" pastel rounded>Directives</MazBtn>
  <MazBtn rounded v-if="typeof starCount === 'number'" href="https://github.com/LouisMazel/maz-ui" target="blank" outline color="theme" left-icon="github" size="md" :right-icon="StarIcon">
    <MazAnimatedCounter :count="starCount" class="maz-text-xl maz-pl-2" />
  </MazBtn>
</section>
<section class="maz-grid mob-l:maz-grid-cols-2 tab-m:maz-grid-cols-3 maz-gap-4 maz-flex-wrap vp-raw">
  <MazCardSpotlight no-elevation content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
    <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
      ⚡️
    </span>
    <h2 class="maz-text-base maz-font-semibold">Standalone</h2>
    <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
      All components or tools are standalone; if you want, you can use only one module from this library.
      You don't need to install the whole library.
    </p>
  </MazCardSpotlight>
  <MazCardSpotlight no-elevation content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
    <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
      👨‍❤️‍👨
    </span>
    <h2 class="maz-text-base maz-font-semibold">SSR Friendly</h2>
    <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
      All components work with Nuxt, no need to install components on the client side.
    </p>
  </MazCardSpotlight>
  <MazCardSpotlight no-elevation content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
    <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
      🔐
    </span>
    <h2 class="maz-text-base maz-font-semibold">Typescript</h2>
    <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
      This library is written in Typescript, so all types and declarations are directly available.
    </p>
  </MazCardSpotlight>
  <a href="/guide/theme" class="maz-flex">
    <MazCardSpotlight no-elevation class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
        💄
      </span>
      <h2 class="maz-text-base maz-font-semibold">Theming</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        Created with TailwindCSS | Optimized CSS file sizes | Complies with all CSS best practices | Use your theme easily.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/guide/theme">Discover</MazBtn>
    </MazCardSpotlight>
  </a>
  <a href="/guide/dark-mode" class="maz-flex">
    <MazCardSpotlight no-elevation class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
        🌗
      </span>
      <h2 class="maz-text-base maz-font-semibold">Dark and Light Theme</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        All components support the Dark and Light themes.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/guide/dark-mode">Discover</MazBtn>
    </MazCardSpotlight>
  </a>
  <a href="/plugins/toaster" class="maz-flex">
    <MazCardSpotlight no-elevation class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
        🛠
      </span>
      <h2 class="maz-text-base maz-font-semibold">Tools</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        Maz-ui provides many modules, plugins, directives, filters and composables
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/plugins/toaster">Discover</MazBtn>
    </MazCardSpotlight>
  </a>
</section>

<section class="maz-mt-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Popular Components & Modules</h2>
  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 tab-l:maz-grid-cols-3 maz-gap-4">
    <MazCardSpotlight color="info" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          📞
        </span>
        <MazBadge color="info" class="maz-text-base" rounded>Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazPhoneNumberInput</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful phone number input component with international number formatting and validation.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-phone-number-input">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="info" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          ✏️
        </span>
        <MazBadge color="info" class="maz-text-base" rounded>Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazInput</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile input component with various customization options and validation support.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-input">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="info" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🔔
        </span>
        <MazBadge color="info" class="maz-text-base" rounded>Plugin</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">Toaster</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A simple and customizable toast notification module to display messages to users.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/plugins/toaster">Discover</MazBtn>
    </MazCardSpotlight>
  </div>
</section>

<section class="maz-mt-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Latest Components & Modules</h2>
  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 tab-l:maz-grid-cols-3 maz-gap-4">
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🔦
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazCardSpotlight</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A beautiful card component with a spotlight effect that follows your cursor movement. Perfect for highlighting important content or creating engaging UI elements.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-card-spotlight">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          📝
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Composable</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">useFormValidator</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A Vue 3 composable designed to simplify form validation using Valibot as the validation library. Offers a flexible and typed approach to handle form validation.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/composables/use-form-validator">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          📋
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazChecklist</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile checklist component with integrated search functionality, perfect for managing multiple selections with an intuitive user interface.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-checklist">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          💬
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Plugin</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">Dialog</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A zero-template dialog solution - no component needed in your templates. Just use the composable function to display promised dialogs with full TypeScript support and customization options.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/plugins/dialog">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🖼️
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Directive</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">v-fullscreen-img</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful directive to display images in fullscreen with zoom capabilities, hover effects and smooth animations. Perfect for galleries and image previews.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/directives/fullscreen-img">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🌍
        </span>
        <MazBadge color="secondary" class="maz-text-base" rounded>Composable</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">useLanguageDisplayNames</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A Vue 3 composable that provides functions to work with language display names based on ISO codes, leveraging the Intl.DisplayNames API.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/composables/use-language-display-names">Discover</MazBtn>
    </MazCardSpotlight>
  </div>
</section>

<script lang="ts" setup>
  import { ref } from 'vue'
  import StarIcon from 'maz-ui/icons/star-solid.svg'

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  async function getStarCount(owner = 'LouisMazel', repo = 'maz-ui') {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stargazers_count;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return null;
    }
  }

  const starCount = ref<number>(0)

  getStarCount('LouisMazel', 'maz-ui').then((count) => {
    starCount.value = count
  })
</script>
