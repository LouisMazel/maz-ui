---
layout: home
title: Maz UI - Standalone Components and Tools Library for Vue & Nuxt
description: Build amazing interfaces with Maz-UI - standalone components & tools library for Vue.JS & Nuxt.JS
# hero:
#   name: Maz-UI
#   text: Lightweight and efficient library
#   tagline: Standalone components and tools for Vue & Nuxt
#   image:
#     src: /img/maz-ui-illu.png
#     alt: Logo of Maz-UI
---

<section class="vp-raw maz-flex maz-flex-col mob-l:maz-flex-center maz-gap-4 dark maz-text-secondary-foreground maz-rounded maz-p-8 maz-my-12 maz-from-primary-400 maz-to-secondary-700 maz-bg-gradient-to-br">
  <h2 class="maz-inline-flex maz-gap-4 mob-l:maz-text-center maz-text-2xl maz-font-semibold dark">
    <span class="maz-text-3xl">🎉</span>
    Maz-UI v4 is here!
  </h2>
  <p class="mob-l:maz-text-center maz-text-lg maz-mb-3 mob-l:maz-max-w-3xl dark">
    Discover the latest major release with improved performance, better tree-shaking, and enhanced TypeScript support, advanced theming, translations, icons set and more.
  </p>

  <div class="maz-flex maz-gap-2 maz-justify-center maz-flex-wrap">
    <MazBtn href="https://github.com/LouisMazel/maz-ui/blob/master/CHANGELOG.md" color="contrast" outlined class="dark maz-w-full mob-l:maz-w-auto" target="blank">
      Changelog
    </MazBtn>
    <MazBtn  href="/guide/migration-v4" color="contrast" class="dark maz-w-full mob-l:maz-w-auto">
      Migration guide
    </MazBtn>
  </div>
</section>

<section id="hero" class="maz-pb-6 tab-m:maz-pb-12 vp-raw">
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
        size="lg"
        href="/guide/getting-started"
        class="maz-w-full mob-l:maz-w-auto maz-font-semibold"
        :left-icon="MazPlay"
      >
        Get Started
      </MazBtn>
      <MazBtn v-if="typeof starCount === 'number'" href="https://github.com/LouisMazel/maz-ui" target="blank" outlined color="background" size="lg" class="maz-w-full mob-l:maz-w-auto">
        <template #left-icon>
          <MazGithub class="maz-text-3xl" />
        </template>
        <MazAnimatedCounter :delay="1250" :count="starCount" class="maz-text-xl maz-pl-2" />
        <template #right-icon>
          <MazStar class="maz-text-2xl" />
        </template>
      </MazBtn>
    </div>
  </MazAnimatedElement>

  <MazAnimatedElement :delay="1250" class="maz-mt-12 tab-l:maz-mt-20">
    <MazTabs>
      <div class="maz-flex maz-justify-between maz-items-start tab-l:maz-items-center maz-gap-4 maz-mb-4 maz-flex-col-reverse tab-l:maz-flex-row">
        <MazTabsBar :items="['Dashboard', 'Product Page', 'Auth Page']" />
        <div class="maz-flex maz-gap-2 maz-items-center maz-flex-row-reverse tab-l:maz-flex-row">
          <MazBtn fab color="background" :icon="isDark ? MazMoon : MazSun" outlined @click="toggleDarkMode" />
          <MazRadioButtons
            :model-value="currentPreset.name"
            size="lg"
            :options="[{
              label: 'Pristine',
              value: 'pristine'
            }, {
              label: 'Ocean',
              value: 'ocean'
            }, {
              label: 'Obsidian',
              value: 'obsidian'
            }, {
              label: 'Maz-UI',
              value: 'maz-ui'
            }]"
            @update:model-value="changePreset"
          />
        </div>
      </div>
      <MazTabsContent>
        <MazTabsContentItem :tab="1">
          <MazCard
            bordered
            :padding="false"
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
            :padding="false"
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
            :padding="false"
            overflow-hidden
            class="maz-relative maz-w-full"
            content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start"
          >
            <DemoAuthPage class="maz-hidden tab-m:maz-flex" />
          </MazCard>
        </MazTabsContentItem>
      </MazTabsContent>
    </MazTabs>
  </MazAnimatedElement>
</section>

<section class="vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Why choose Maz-UI ?</h2>
  <div class="maz-grid mob-l:maz-grid-cols-2 tab-m:maz-grid-cols-3 maz-gap-4 maz-flex-wrap vp-raw">
    <MazCardSpotlight content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
        ⚡️
      </span>
      <h2 class="maz-text-base maz-font-semibold">Standalone</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        All components or tools are standalone; if you want, you can use only one module from this library.
        You don't need to install the whole library.
      </p>
    </MazCardSpotlight>
    <MazCardSpotlight content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
        👨‍❤️‍👨
      </span>
      <h2 class="maz-text-base maz-font-semibold">SSR Friendly</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        All components work with Nuxt, no need to install components on the client side.
      </p>
    </MazCardSpotlight>
    <MazCardSpotlight content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
      <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
        🔐
      </span>
      <h2 class="maz-text-base maz-font-semibold">Typescript</h2>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        This library is written in Typescript, so all types and declarations are directly available.
      </p>
    </MazCardSpotlight>
    <a href="/guide/theme" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          💄
        </span>
        <h2 class="maz-text-base maz-font-semibold">Theming</h2>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          Created with TailwindCSS | Optimized CSS file sizes | Complies with all CSS best practices | Use your theme easily.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/theme">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
    <a href="/guide/dark-mode" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🌗
        </span>
        <h2 class="maz-text-base maz-font-semibold">Dark and Light Theme</h2>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          All components support the Dark and Light themes.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/dark-mode">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
    <a href="/plugins/toast" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🛠
        </span>
        <h2 class="maz-text-base maz-font-semibold">Tools</h2>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          Maz-ui provides many modules, plugins, directives, formatters and composables
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/plugins/toast">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
  </div>
</section>

<section class="maz-my-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Ecosystem</h2>

  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 maz-gap-4">
    <a href="/guide/nuxt" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" color="accent" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between maz-w-full">
          <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
            🚀
          </span>
          <MazBadge color="accent" class="maz-text-base">Package</MazBadge>
        </div>
        <h3 class="maz-text-base maz-font-semibold">@maz-ui/nuxt</h3>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          Official Nuxt module with auto-imports, optimized builds, and seamless SSR support. Zero configuration required.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/nuxt">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
    <a href="/guide/icons" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" color="accent" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between maz-w-full">
          <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
            🎨
          </span>
          <MazBadge color="accent" class="maz-text-base">Package</MazBadge>
        </div>
        <h3 class="maz-text-base maz-font-semibold">@maz-ui/icons</h3>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          328+ beautiful SVG icons ready for Vue. Multiple usage patterns: components, direct SVG files, or auto-import.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/icons">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
    <a href="/guide/translations" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" color="accent" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between maz-w-full">
          <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
            🌍
          </span>
          <MazBadge color="accent" class="maz-text-base">Package</MazBadge>
        </div>
        <h3 class="maz-text-base maz-font-semibold">@maz-ui/translations</h3>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          Simple internationalization system for Maz-UI components. Translate your interface into any language with ease.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/translations">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
    <a href="/guide/themes" class="maz-flex">
      <MazCardSpotlight class="maz-w-full" color="accent" content-class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
        <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between maz-w-full">
          <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
            🎭
          </span>
          <MazBadge color="accent" class="maz-text-base">Package</MazBadge>
        </div>
        <h3 class="maz-text-base maz-font-semibold">@maz-ui/themes</h3>
        <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
          Pre-built theme collections and design tokens for rapid UI development. Ready-to-use color schemes and styles.
        </p>
        <div class="maz-flex-1"></div>
        <MazBtn color="background" outlined size="sm" block href="/guide/themes">Discover</MazBtn>
      </MazCardSpotlight>
    </a>
  </div>
</section>

<section class="maz-mt-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Popular Components & Modules</h2>

  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 tab-l:maz-grid-cols-3 maz-gap-4">
    <MazCardSpotlight color="info" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          📞
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazInputPhoneNumber</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful phone number input component with international number formatting and validation.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-phone-number-input">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="info" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🪟
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazPopover</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful popover component with various customization options and smooth animations.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-popover">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="info" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          ✏️
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazInput</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile input component with various customization options and validation support.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-input">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="info" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🔔
        </span>
        <MazBadge color="info" class="maz-text-base">Plugin</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">Toast</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A simple and customizable toast notification module to display messages to users.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/plugins/toast">Discover</MazBtn>
    </MazCardSpotlight>
  </div>
</section>

<section class="maz-mt-12 vp-raw">
  <h2 class="maz-text-2xl maz-font-bold maz-mb-8">Latest Components & Modules</h2>
  <div class="maz-grid maz-grid-cols-1 tab-m:maz-grid-cols-2 tab-l:maz-grid-cols-3 maz-gap-4">
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          ✨
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazAnimatedText</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A text animation component that brings your content to life with smooth sliding blur effects and gradient highlights. Perfect for creating engaging headings and text transitions.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-animated-text">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🎭
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazAnimatedElement</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile animation component that adds smooth entrance animations to any element. Features multiple animation directions and customizable timing for creating engaging UI interactions.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-animated-element">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🔦
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazCardSpotlight</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A beautiful card component with a spotlight effect that follows your cursor movement. Perfect for highlighting important content or creating engaging UI elements.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-card-spotlight">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          📝
        </span>
        <MazBadge color="success" class="maz-text-base">Composable</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">useFormValidator</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A Vue 3 composable designed to simplify form validation using Valibot as the validation library. Offers a flexible and typed approach to handle form validation.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/composables/use-form-validator">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          📋
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazChecklist</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A versatile checklist component with integrated search functionality, perfect for managing multiple selections with an intuitive user interface.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-checklist">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          💬
        </span>
        <MazBadge color="info" class="maz-text-base">Plugin</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">Dialog</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A zero-template dialog solution - no component needed in your templates. Just use the composable function to display promised dialogs with full TypeScript support and customization options.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/plugins/dialog">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🖼️
        </span>
        <MazBadge color="warning" class="maz-text-base">Directive</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">v-fullscreen-img</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful directive to display images in fullscreen with zoom capabilities, hover effects and smooth animations. Perfect for galleries and image previews.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/directives/fullscreen-img">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          🌍
        </span>
        <MazBadge color="success" class="maz-text-base">Composable</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">useDisplayNames</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A Vue 3 composable that provides functions to work with localized display names based on ISO codes, leveraging the Intl.DisplayNames API.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/composables/use-display-names">Discover</MazBtn>
    </MazCardSpotlight>
    <MazCardSpotlight color="secondary" content-class="maz-flex maz-flex-col maz-gap-2">
      <div class="maz-flex maz-items-start maz-gap-2 maz-justify-between w-full">
        <span class="maz-py-1 maz-px-2 maz-bg-surface-400 maz-rounded-md maz-text-2xl">
          📊
        </span>
        <MazBadge color="primary" class="maz-text-base">Component</MazBadge>
      </div>
      <h3 class="maz-text-base maz-font-semibold">MazTable</h3>
      <p class="dark:maz-text-gray-300 maz-text-muted maz-text-sm">
        A powerful table component with sorting, search, pagination and selection features. Perfect for displaying and managing tabular data in an interactive manner.
      </p>
      <div class="maz-flex-1"></div>
      <MazBtn color="background" outlined size="sm" block href="/components/maz-table">Discover</MazBtn>
    </MazCardSpotlight>
  </div>
</section>

<script lang="ts" setup>
  import DemoAuthPage from './.vitepress/theme/components/DemoAuthPage.vue'
  import DemoDashboardPage from './.vitepress/theme/components/DemoDashboardPage.vue'
  import DemoProductPage from './.vitepress/theme/components/DemoProductPage.vue'

  import { ref, computed } from 'vue'
  import { MazStar, MazPlay, MazGithub, MazSun, MazMoon } from '@maz-ui/icons/src/index.js'
  import { useTheme } from '@maz-ui/themes/src/composables/useTheme.js'

  const {
    isDark,
    colorMode,
    currentPreset,
    setColorMode,
    updateTheme,
    toggleDarkMode
  } = useTheme()

  const originalPreset = ref(null)

  async function getPreset(presetName) {
    switch (presetName) {
      case 'maz-ui':
        return import('@maz-ui/themes/src/presets/mazUi.ts').then(m => m.mazUi)
      case 'pristine':
        return import('@maz-ui/themes/src/presets/pristine.ts').then(m => m.pristine)
      case 'ocean':
        return import('@maz-ui/themes/src/presets/ocean.ts').then(m => m.ocean)
      case 'obsidian':
        return import('@maz-ui/themes/src/presets/obsidian.ts').then(m => m.obsidian)
      default:
        return import('@maz-ui/themes/src/presets/mazUi.ts').then(m => m.mazUi)
    }
  }

  async function changePreset(presetName) {
    const preset = await getPreset(presetName)
    updateTheme(preset)
    originalPreset.value = preset
  }

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
    }
  }

  const starCount = ref<number>(0)

  getStarCount().then((count) => {
    starCount.value = count
  })
</script>
