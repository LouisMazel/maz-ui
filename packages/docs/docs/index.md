---
layout: home
title: Maz UI - Standalone Components and Tools Library for Vue & Nuxt
description: Build amazing interfaces with Maz-UI - standalone components & tools library for Vue.JS & Nuxt.JS
# hero:
  # name: Maz-UI
  # text: Lightweight and efficient library
  # tagline: Standalone components and tools for Vue & Nuxt
  # image:
  #   src: /img/maz-ui-illu.png
  #   alt: Logo of Maz-UI
---

<section id="hero" class="maz-py-12 tab-m:maz-py-24 vp-raw">
  <div class="maz-mx-auto maz-max-w-3xl">
    <MazAnimatedText
      text="Collection of standalone components, plugins, directives, composables and more"
      direction="down"
      :delay="0"
      tag="h2"
      class="maz-text-xl maz-tracking-tight maz-text-muted tab-m:maz-flex-center tab-m:maz-w-full"
      :duration="2000"
      :column-gap="0.2"
    />
    <MazAnimatedText
      text="Lightweight and efficient library for"
      last-word="Vue & Nuxt"
      direction="down"
      :delay="500"
      tag="h1"
      class="maz-mt-6 maz-text-4xl maz-tracking-tighter maz-font-bold tab-m:maz-flex-center tab-m:maz-text-5xl lg:maz-text-6xl"
    />
  </div>
  <MazAnimatedElement :delay="1000">
    <div class="maz-mt-12 maz-flex maz-flex-col maz-gap-4 maz-flex-center mob-l:maz-flex-row">
      <MazBtn
        color="theme"
        size="lg"
        href="/guide/getting-started"
        class="maz-w-full mob-l:maz-w-auto maz-font-semibold"
        :left-icon="PlayIcon"
      >
        Get Started
      </MazBtn>
      <MazBtn v-if="typeof starCount === 'number'" href="https://github.com/LouisMazel/maz-ui" target="blank" outline color="theme" left-icon="github" size="lg" :right-icon="StarIcon" class="maz-w-full mob-l:maz-w-auto maz-font-semibold">
        <MazAnimatedCounter :delay="1250" :count="starCount" class="maz-text-xl maz-pl-2" />
      </MazBtn>
    </div>
  </MazAnimatedElement>
  <MazAnimatedElement :delay="1250" class="maz-mt-6 maz-flex maz-flex-col maz-gap-4">
    <p class="maz-text-base maz-text-muted maz-text-center">
      Start discovering
    </p>
    <div class="maz-flex maz-gap-4 maz-flex-center maz-flex-row maz-flex-wrap">
      <MazBtn href="/components/maz-btn" color="theme" size="md" pastel>Components</MazBtn>
      <MazBtn href="/plugins/toaster" color="theme" size="md" pastel>Plugins</MazBtn>
      <MazBtn href="/composables/use-form-validator" color="theme" size="md" pastel>Composables</MazBtn>
      <MazBtn href="/helpers/currency" color="theme" size="md" pastel>Helpers</MazBtn>
      <MazBtn href="/directives/fullscreen-img" color="theme" size="md" pastel>Directives</MazBtn>
    </div>
  </MazAnimatedElement>

  <MazAnimatedElement :delay="1500" class="maz-mt-12 tab-m:maz-mt-20">
    <MazTabs>
      <div class="maz-flex maz-justify-between maz-items-start tab-m:maz-items-center maz-gap-4 maz-mb-4 maz-flex-col-reverse tab-m:maz-flex-row">
        <MazTabsBar :items="['Dashboard', 'Product Page', 'Auth Page']" class="maz-border maz-border-color-light" no-elevation />
        <h3 class="maz-text-2xl maz-font-bold">
          Demonstrations
        </h3>
      </div>
      <MazTabsContent>
        <MazTabsContentItem :tab="1">
          <MazCard
            bordered
            no-padding
            overflow-hidden
            class="maz-relative maz-w-full"
            content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start"
          >
            <DemoDashboardPage :delay="2000" class="maz-hidden tab-m:maz-block" />
            <div class="dark:maz-hidden">
              <MazLazyImg class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" src="/img/demo/dashboard-light.png" alt="Maz-UI" />
            </div>
            <div class="maz-hidden dark:maz-block">
              <MazLazyImg src="/img/demo/dashboard-dark.png" class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" alt="Maz-UI" />
            </div>
          </MazCard>
        </MazTabsContentItem>
        <MazTabsContentItem :tab="2">
          <MazCard
            bordered
            no-padding
            overflow-hidden
            class="maz-relative maz-w-full"
            content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start"
          >
            <DemoProductPage class="maz-hidden tab-m:maz-block" />
            <div class="dark:maz-hidden">
              <MazLazyImg class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" src="/img/demo/product-page-light.png" alt="Maz-UI" />
            </div>
            <div class="maz-hidden dark:maz-block">
              <MazLazyImg src="/img/demo/product-page-dark.png" class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" alt="Maz-UI" />
            </div>
          </MazCard>
        </MazTabsContentItem>
        <MazTabsContentItem :tab="3">
          <MazCard
            bordered
            no-padding
            overflow-hidden
            class="maz-relative maz-w-full"
            content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start"
          >
            <DemoAuthPage class="maz-hidden tab-m:maz-flex" />
            <div class="dark:maz-hidden">
              <MazLazyImg class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" src="/img/demo/auth-page-light.png" alt="Maz-UI" />
            </div>
            <div class="maz-hidden dark:maz-block">
              <MazLazyImg src="/img/demo/auth-page-dark.png" class="maz-block tab-m:!maz-hidden maz-w-full maz-min-h-40" alt="Maz-UI" />
            </div>
          </MazCard>
        </MazTabsContentItem>
      </MazTabsContent>
    </MazTabs>
  </MazAnimatedElement>

</section>

<section class="vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Why choose Maz-UI ?</h2>
  <div class="maz-grid mob-l:maz-grid-cols-2 tab-m:maz-grid-cols-3 maz-gap-4 maz-flex-wrap vp-raw">
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
          Maz-ui provides many modules, plugins, directives, formatters and composables
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="theme" outline size="sm" block href="/plugins/toaster">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
  </div>
</section>

<section class="maz-mt-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Popular Components & Modules</h2>
  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 tab-l:maz-grid-cols-3 maz-gap-4">
    <MazCardSpotlight color="info" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          📞
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazInputPhoneNumber</h3>
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
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
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
        <MazBadge color="info" class="maz-text-base">Plugin</MazBadge>
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
          ✨
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazAnimatedText</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A text animation component that brings your content to life with smooth sliding blur effects and gradient highlights. Perfect for creating engaging headings and text transitions.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-animated-text">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🎭
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazAnimatedElement</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile animation component that adds smooth entrance animations to any element. Features multiple animation directions and customizable timing for creating engaging UI interactions.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-animated-element">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          🔦
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
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
        <MazBadge color="success" class="maz-text-base">Composable</MazBadge>
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
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
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
        <MazBadge color="info" class="maz-text-base">Plugin</MazBadge>
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
        <MazBadge color="warning" class="maz-text-base">Directive</MazBadge>
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
        <MazBadge color="success" class="maz-text-base">Composable</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">useLanguageDisplayNames</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A Vue 3 composable that provides functions to work with language display names based on ISO codes, leveraging the Intl.DisplayNames API.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/composables/use-language-display-names">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" no-elevation content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-color-light maz-rounded-md maz-text-2xl">
          📊
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazTable</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful table component with sorting, search, pagination and selection features. Perfect for displaying and managing tabular data in an interactive manner.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="theme" outline size="sm" block href="/components/maz-table">Discover</MazBtn>
    </MazCardSpotlight>
  </div>
</section>

<script lang="ts" setup>
  import { ref } from 'vue'
  import StarIcon from 'maz-ui/icons/star-solid.svg'
  import PlayIcon from 'maz-ui/icons/play.svg'

  async function getStarCount() {
    try {
      const response = await fetch(`https://ungh.cc/repos/LouisMazel/maz-ui`);

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const data = await response.json();
      return data.repo.stars;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return null;
    }
  }

  const starCount = ref<number>(0)

  getStarCount().then((count) => {
    starCount.value = count
  })
</script>
