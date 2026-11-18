---
title: Getting Started
description: Build Vue and Nuxt applications faster with maz-ui - 50+ components, themes, icons and translations, tree-shakable and typed
head:
  - - meta
    - name: keywords
      content: vue ui library, vue components, nuxt ui, maz-ui installation, components, nuxt, vue, themes, translations, icons, mcp, maz-ui
---

# {{ $frontmatter.title }}

maz-ui gives you 50+ Vue 3 components, with composables, directives and plugins, and the packages around them: themes, icons, translations, helpers, a Nuxt module and the tools for AI agents. Import only what you use, everything is typed.

::: tip Migrating from v4?
Run `npx @maz-ui/upgrade ./` for the mechanical part of the migration, then follow the [v5 migration guide](./migration-v5.md).
:::

## Choose your framework

<div class="vp-raw maz:grid maz:gap-4 maz:tab-m:grid-cols-2">
  <MazCardSpotlight color="success" :padding="false" content-class="maz:h-full">
    <a href="/guide/vue" class="maz:group maz:flex maz:h-full maz:flex-col maz:gap-4 maz:p-5">
      <span class="maz:flex maz:items-center maz:gap-3">
        <MazSvg icon="logo-vue" width="40" />
        <span class="maz:flex maz:flex-col">
          <span class="maz:text-lg maz:font-semibold maz:text-foreground">Vue</span>
          <span class="maz:text-sm maz:text-muted">Vue 3 with Vite</span>
        </span>
        <MazIcon icon="arrow-right" class="maz:ms-auto maz:text-xl maz:text-muted maz:transition-transform maz:group-hover:translate-x-1 maz:group-hover:text-foreground" />
      </span>
      <code class="maz:rounded-md maz:border maz:border-divider maz:bg-surface maz:px-3 maz:py-2 maz:text-xs maz:text-foreground">npm install maz-ui @maz-ui/themes</code>
      <span class="maz:flex maz:flex-col maz:gap-2 maz:text-sm maz:text-foreground">
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>Theme and translations in one plugin</span></span>
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>MazUi(): icons by name, less CSS</span></span>
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>Auto-import with the resolvers</span></span>
      </span>
    </a>
  </MazCardSpotlight>
  <MazCardSpotlight color="success" :padding="false" content-class="maz:h-full">
    <a href="/ecosystem/nuxt" class="maz:group maz:flex maz:h-full maz:flex-col maz:gap-4 maz:p-5">
      <span class="maz:flex maz:items-center maz:gap-3">
        <MazSvg :icon="nuxtLogo" width="40" />
        <span class="maz:flex maz:flex-col">
          <span class="maz:text-lg maz:font-semibold maz:text-foreground">Nuxt</span>
          <span class="maz:text-sm maz:text-muted">Nuxt 3 and 4, one module</span>
        </span>
        <MazIcon icon="arrow-right" class="maz:ms-auto maz:text-xl maz:text-muted maz:transition-transform maz:group-hover:translate-x-1 maz:group-hover:text-foreground" />
      </span>
      <code class="maz:rounded-md maz:border maz:border-divider maz:bg-surface maz:px-3 maz:py-2 maz:text-xs maz:text-foreground">npx nuxt module add @maz-ui/nuxt</code>
      <span class="maz:flex maz:flex-col maz:gap-2 maz:text-sm maz:text-foreground">
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>Auto-imports, nothing to configure</span></span>
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>Icons by name, less CSS</span></span>
        <span class="maz:flex maz:items-start maz:gap-2"><MazIcon icon="check" class="maz:mt-0.5 maz:shrink-0 maz:text-success-700" /><span>Theme and translations in nuxt.config</span></span>
      </span>
    </a>
  </MazCardSpotlight>
</div>

## A first form

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3 maz:tab-m:flex-row maz:tab-m:items-start">
    <MazInput v-model="email" label="Email" type="email" start-icon="envelope" class="maz:flex-1" />
    <MazBtn color="primary" end-icon="arrow-right" size="lg" @click="signUp">
      Sign up
    </MazBtn>
  </div>

  <template #code>

```vue
<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn'
import MazInput from 'maz-ui/components/MazInput'
import { useToast } from 'maz-ui/composables/useToast'

const email = ref('')
const toast = useToast()

function signUp() {
  toast.success(`Welcome ${email.value}`)
}
</script>

<template>
  <MazInput v-model="email" label="Email" type="email" start-icon="envelope" />
  <MazBtn color="primary" end-icon="arrow-right" size="lg" @click="signUp">
    Sign up
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

Each component, composable and helper has its own import (`maz-ui/components/MazBtn`, `@maz-ui/utils/helpers/debounce`): only what you import is bundled. The icons are used by name, with [`MazUi()`](../ecosystem/vite-plugin.md) or [`@maz-ui/nuxt`](../ecosystem/nuxt.md).

## Ecosystem

<div class="vp-raw maz:grid maz:gap-4 maz:mob-l:grid-cols-2 maz:tab-l:grid-cols-3">
  <MazCard href="/ecosystem/themes" bordered block>
    <MazIcon icon="swatch" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">Themes</p>
    <p class="maz:text-sm maz:text-muted">Presets, dark mode, color scales</p>
  </MazCard>
  <MazCard href="/ecosystem/icons/" bordered block>
    <MazIcon icon="star" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">Icons</p>
    <p class="maz:text-sm maz:text-muted">860+ icons, logos and flags, by name</p>
  </MazCard>
  <MazCard href="/ecosystem/translations" bordered block>
    <MazIcon icon="language" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">Translations</p>
    <p class="maz:text-sm maz:text-muted">The texts of the components in your languages</p>
  </MazCard>
  <MazCard href="/ecosystem/utils/" bordered block>
    <MazIcon icon="wrench-screwdriver" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">Utils</p>
    <p class="maz:text-sm maz:text-muted">Debounce, formatters, cookies, helpers</p>
  </MazCard>
  <MazCard href="/ecosystem/vite-plugin" bordered block>
    <MazIcon icon="bolt" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">Vite plugin</p>
    <p class="maz:text-sm maz:text-muted">Icons by name and less CSS</p>
  </MazCard>
  <MazCard href="/guide/ai-agents" bordered block>
    <MazIcon icon="sparkles" class="maz:text-2xl maz:text-primary" />
    <p class="maz:mt-2 maz:font-semibold">AI agents</p>
    <p class="maz:text-sm maz:text-muted">MCP server and rules for your coding agents</p>
  </MazCard>
</div>

### Keep the packages on the same version

`maz-ui` and its packages are released together, on the same version: keep them on it. Two versions of a package install two copies, a heavier bundle, and two copies of `maz-ui` do not share their configuration.

::: details Group their updates in one pull request

With Dependabot (`.github/dependabot.yml`):

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    groups:
      maz-ui:
        patterns:
          - maz-ui
          - '@maz-ui/*'
```

With Renovate (`renovate.json`):

```json
{
  "packageRules": [
    {
      "groupName": "maz-ui",
      "matchPackageNames": ["maz-ui", "@maz-ui/*"]
    }
  ]
}
```

:::

## Next steps

- [Components](../components/maz-btn.md): live examples and API of each component
- [Tailwind CSS](./tailwind.md): the theme tokens of maz-ui in your Tailwind classes
- [MazUiProvider](./maz-ui-provider.md): load maz-ui only on the pages that use it
- [GitHub discussions](https://github.com/LouisMazel/maz-ui/discussions) and [issues](https://github.com/LouisMazel/maz-ui/issues) for help

<script setup>
import { ref } from 'vue'
import { useToast } from 'maz-ui/composables/useToast'
import nuxtLogo from '../assets/frameworks/nuxt.svg?raw'

const email = ref('')
const toast = useToast()

function signUp() {
  toast.success(`Welcome ${email.value}`)
}
</script>
