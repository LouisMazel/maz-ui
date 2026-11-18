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
  <MazCard href="/guide/vue" :gallery="{ images: ['/vue.png'], height: 160, width: '100%' }" bordered block>
    <template #content-title>
      <p class="maz:text-lg maz:font-semibold">Vue</p>
    </template>
    <template #content-body>
      <p class="maz:text-sm maz:text-muted">The plugin, the Vite plugin and the imports</p>
    </template>
  </MazCard>
  <MazCard href="/ecosystem/nuxt" :gallery="{ images: ['/nuxt.png'], height: 160, width: '100%' }" bordered block>
    <template #content-title>
      <p class="maz:text-lg maz:font-semibold">Nuxt</p>
    </template>
    <template #content-body>
      <p class="maz:text-sm maz:text-muted">One module: auto-imports, icons, theme and translations</p>
    </template>
  </MazCard>
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

const email = ref('')
const toast = useToast()

function signUp() {
  toast.success(`Welcome ${email.value}`)
}
</script>
