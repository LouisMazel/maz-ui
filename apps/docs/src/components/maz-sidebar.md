---
title: MazSidebar
description: MazSidebar is a composable sidebar system for dashboard, admin, and SaaS applications. It provides a fully accessible, collapsible navigation with multiple display modes.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
`MazSidebar` shares its state with all sub-components via Vue's `provide`/`inject`. No separate Provider component is needed. All sub-components must be descendants of `MazSidebar`.
:::

::: warning Deferred features (v1.1)
The following features are planned for a future release and are **not yet available**:
- `localStorage` state persistence
- `Cmd/Ctrl+B` keyboard shortcut
- Automatic mobile drawer under a breakpoint
:::

## Sub-components

| Component | Role |
|---|---|
| `MazSidebar` | Root container — provides state context |
| `MazSidebarHeader` | Fixed top area |
| `MazSidebarContent` | Scrollable central area |
| `MazSidebarFooter` | Fixed bottom area |
| `MazSidebarGroup` | Item grouping with optional label |
| `MazSidebarSeparator` | Visual divider (`<hr>`) |
| `MazSidebarMenu` | `<ul>` wrapper with `role="menu"` |
| `MazSidebarMenuItem` | `<li>` item wrapper |
| `MazSidebarMenuButton` | Clickable item (link or button), supports icon, label, badge, tooltip |
| `MazSidebarMenuSub` | Collapsible sub-menu |
| `MazSidebarTrigger` | Toggle button (must be a descendant of `MazSidebar`) |

## Basic usage

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[25rem] maz:flex">
    <MazSidebar v-model:open="basicOpen" class="maz:h-full">
      <MazSidebarHeader>
        <div class="maz:p-4 maz:font-bold">My App</div>
      </MazSidebarHeader>
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Dashboard" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <div class="maz:p-4">Footer</div>
      </MazSidebarFooter>
    </MazSidebar>
    <main class="maz:flex-1 maz:p-4">Main content</main>
  </div>

<template #code>

```html
<div class="maz:flex maz:h-screen">
  <MazSidebar v-model:open="isOpen">
    <MazSidebarHeader>
      <div class="maz:p-4 maz:font-bold">My App</div>
    </MazSidebarHeader>
    <MazSidebarContent>
      <MazSidebarMenu>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Dashboard" :active="true" />
        </MazSidebarMenuItem>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Settings" />
        </MazSidebarMenuItem>
      </MazSidebarMenu>
    </MazSidebarContent>
    <MazSidebarFooter>
      <div class="maz:p-4">Footer</div>
    </MazSidebarFooter>
  </MazSidebar>
  <main class="maz:flex-1 maz:p-4">Main content</main>
</div>

<script setup>
const isOpen = ref(true)
</script>
```

  </template>
</ComponentDemo>

## Groups & dividers

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[25rem] maz:flex">
    <MazSidebar v-model:open="groupsOpen" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarGroup label="Navigation">
          <MazSidebarMenu>
            <MazSidebarMenuItem>
              <MazSidebarMenuButton label="Dashboard" :active="true" />
            </MazSidebarMenuItem>
            <MazSidebarMenuItem>
              <MazSidebarMenuButton label="Projects" />
            </MazSidebarMenuItem>
          </MazSidebarMenu>
        </MazSidebarGroup>
        <MazSidebarSeparator />
        <MazSidebarGroup label="Settings">
          <MazSidebarMenu>
            <MazSidebarMenuItem>
              <MazSidebarMenuButton label="Profile" />
            </MazSidebarMenuItem>
            <MazSidebarMenuItem>
              <MazSidebarMenuButton label="Billing" />
            </MazSidebarMenuItem>
          </MazSidebarMenu>
        </MazSidebarGroup>
      </MazSidebarContent>
    </MazSidebar>
    <main class="maz:flex-1 maz:p-4">Main content</main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen">
  <MazSidebarContent>
    <MazSidebarGroup label="Navigation">
      <MazSidebarMenu>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Dashboard" :active="true" />
        </MazSidebarMenuItem>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Projects" />
        </MazSidebarMenuItem>
      </MazSidebarMenu>
    </MazSidebarGroup>
    <MazSidebarSeparator />
    <MazSidebarGroup label="Settings">
      <MazSidebarMenu>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Profile" />
        </MazSidebarMenuItem>
      </MazSidebarMenu>
    </MazSidebarGroup>
  </MazSidebarContent>
</MazSidebar>
```

  </template>
</ComponentDemo>

## Sub-menus

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[25rem] maz:flex">
    <MazSidebar v-model:open="submenusOpen" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Dashboard" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuSub label="Products" :default-open="true">
              <MazSidebarMenuItem>
                <MazSidebarMenuButton label="All Products" />
              </MazSidebarMenuItem>
              <MazSidebarMenuItem>
                <MazSidebarMenuButton label="Add Product" />
              </MazSidebarMenuItem>
            </MazSidebarMenuSub>
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuSub label="Reports">
              <MazSidebarMenuItem>
                <MazSidebarMenuButton label="Sales" />
              </MazSidebarMenuItem>
            </MazSidebarMenuSub>
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
    <main class="maz:flex-1 maz:p-4">Main content</main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen">
  <MazSidebarContent>
    <MazSidebarMenu>
      <MazSidebarMenuItem>
        <MazSidebarMenuSub label="Products" :default-open="true">
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="All Products" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Add Product" />
          </MazSidebarMenuItem>
        </MazSidebarMenuSub>
      </MazSidebarMenuItem>
    </MazSidebarMenu>
  </MazSidebarContent>
</MazSidebar>
```

  </template>
</ComponentDemo>

## Icon mode with tooltips

When `collapsible="icon"` and the sidebar is collapsed, labels fade out and only the icons stay visible. To help users identify items in collapsed state, provide a `tooltip` prop on each `MazSidebarMenuButton`: it uses the `v-tooltip` directive and is only shown on hover when the sidebar is collapsed by default.

### Controlling when the tooltip appears

Both `MazSidebar` and `MazSidebarMenuButton` accept a `tooltip-mode` prop:

- `closed` (default on the sidebar) — tooltip only shows on hover when the sidebar is collapsed
- `always` — tooltip shows on hover regardless of the sidebar state

Set it on the sidebar to apply to every descendant button, or override per-button:

```html
<!-- Every button: tooltip visible only when collapsed -->
<MazSidebar tooltip-mode="closed">
  <MazSidebarMenuButton :icon="MazHome" label="Dashboard" tooltip="Go to Dashboard" />
</MazSidebar>

<!-- This button overrides: tooltip always shown -->
<MazSidebar tooltip-mode="closed">
  <MazSidebarMenuButton
    :icon="MazCog6Tooth"
    label="Settings"
    tooltip="Open Settings"
    tooltip-mode="always"
  />
</MazSidebar>
```

::: tip Performance
When no `tooltip` prop is provided on a button, the `v-tooltip` directive is not attached at all — no listeners, no popover instance.
:::

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[25rem] maz:flex">
    <MazSidebar v-model:open="iconModeOpen" collapsible="icon" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton :icon="MazHome" label="Dashboard" tooltip="Go to Dashboard" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton :icon="MazCog6Tooth" label="Settings" tooltip="Open Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <MazSidebarTrigger />
      </MazSidebarFooter>
    </MazSidebar>
    <main class="maz:flex-1 maz:flex maz:flex-col maz:gap-4 maz:p-4">
      Click the trigger to collapse/expand
      <MazBtn @click="iconModeOpen = !iconModeOpen">Toggle sidebar</MazBtn>
    </main>
  </div>

<template #code>

```html
<script setup>
import { MazHome } from '@maz-ui/icons/lazy/MazHome'
import { MazCog6Tooth } from '@maz-ui/icons/lazy/MazCog6Tooth'

const isOpen = ref(true)
</script>

<template>
  <MazSidebar v-model:open="isOpen" collapsible="icon">
    <MazSidebarContent>
      <MazSidebarMenu>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton :icon="MazHome" label="Dashboard" tooltip="Go to Dashboard" />
        </MazSidebarMenuItem>
      </MazSidebarMenu>
    </MazSidebarContent>
    <MazSidebarFooter>
      <MazSidebarTrigger />
    </MazSidebarFooter>
  </MazSidebar>
</template>
```

  </template>
</ComponentDemo>

## Hover mode

`collapsible="hover"` displays the sidebar in icon-only mode and **automatically expands it when the mouse enters the sidebar (or any descendant) and collapses it when the mouse leaves**. Keyboard focus also expands the sidebar, so users navigating with `Tab` see the full labels.

::: tip
This is a **purely visual** state. The `v-model:open` value is not updated and the persistence cookie is not written when the sidebar expands or collapses through hover. Use this mode when you want the rail-style sidebar of `collapsible="icon"` without exposing a toggle.
:::

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[22rem] maz:flex">
    <MazSidebar collapsible="hover" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton :icon="MazHome" label="Dashboard" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton :icon="MazCog6Tooth" label="Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
    <main class="maz:flex-1 maz:p-4">Move your cursor over the sidebar to expand it.</main>
  </div>

<template #code>

```html
<MazSidebar collapsible="hover">
  <MazSidebarContent>
    <MazSidebarMenu>
      <MazSidebarMenuItem>
        <MazSidebarMenuButton :icon="MazHome" label="Dashboard" />
      </MazSidebarMenuItem>
      <MazSidebarMenuItem>
        <MazSidebarMenuButton :icon="MazCog6Tooth" label="Settings" />
      </MazSidebarMenuItem>
    </MazSidebarMenu>
  </MazSidebarContent>
</MazSidebar>
```

  </template>
</ComponentDemo>

## Offcanvas mode

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[20rem] maz:flex">
    <MazSidebar v-model:open="offcanvasOpen" collapsible="offcanvas" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Home" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="About" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
    <main class="maz:flex-1 maz:flex maz:flex-col maz:gap-4 maz:p-4">
      <MazBtn @click="offcanvasOpen = !offcanvasOpen">Toggle sidebar</MazBtn>
      Main content — sidebar disappears completely when closed
    </main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen" collapsible="offcanvas">
  <!-- content -->
</MazSidebar>
```

  </template>
</ComponentDemo>

## Overlay vs push mode

In `mode="push"` (default), the sidebar is part of the document flow and pushes the main content.
In `mode="overlay"`, the sidebar floats over the content with a backdrop, escape key support and focus trapping.

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[20rem] maz:relative">
    <MazBtn class="maz:absolute maz:top-4 maz:left-4 maz:z-1" @click="overlayOpen = !overlayOpen">
      Toggle overlay sidebar
    </MazBtn>
    <MazSidebar v-model:open="overlayOpen" mode="overlay">
      <MazSidebarHeader>
        <div class="maz:p-4 maz:font-bold">Overlay Sidebar</div>
      </MazSidebarHeader>
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Home" :active="true" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <MazSidebarTrigger />
      </MazSidebarFooter>
    </MazSidebar>
  </div>

<template #code>

```html
<!-- Overlay mode: sidebar floats over content -->
<MazSidebar v-model:open="isOpen" mode="overlay">
  <!-- content -->
</MazSidebar>
```

  </template>
</ComponentDemo>

## Side end (right)

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[20rem] maz:flex">
    <main class="maz:flex-1 maz:p-4">Main content</main>
    <MazSidebar v-model:open="sideEndOpen" side="end" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Right panel item" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
  </div>

<template #code>

```html
<div class="maz:flex maz:h-screen">
  <main class="maz:flex-1">Main content</main>
  <MazSidebar v-model:open="isOpen" side="end">
    <!-- content -->
  </MazSidebar>
</div>
```

  </template>
</ComponentDemo>

## Badges

`badge` accepts a `string`, a `number`, or a full `MazBadgeProps` object (with an optional `text`) to fine-tune color, size, outlined, etc.

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[22rem] maz:flex">
    <MazSidebar v-model:open="badgesOpen" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Inbox" :badge="12" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Errors" :badge="{ text: 3, color: 'destructive' }" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Beta" :badge="{ text: 'NEW', color: 'success', outlined: true }" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
    <main class="maz:flex-1 maz:flex maz:flex-col maz:gap-4 maz:p-4">
      Badges are hidden in icon-collapsed mode.
      <MazBtn @click="badgesOpen = !badgesOpen">Toggle sidebar</MazBtn>
    </main>
  </div>

<template #code>

```html
<!-- Simple: pass a string or number -->
<MazSidebarMenuButton label="Inbox" :badge="12" />

<!-- Full customisation: pass a MazBadgeProps object -->
<MazSidebarMenuButton
  label="Errors"
  :badge="{ text: 3, color: 'destructive' }"
/>
<MazSidebarMenuButton
  label="Beta"
  :badge="{ text: 'NEW', color: 'success', outlined: true }"
/>
```

  </template>
</ComponentDemo>

## User menu in footer

<ComponentDemo>
  <div class="maz:border maz:border-divider maz:overflow-hidden maz:rounded-md maz:h-[22rem] maz:flex">
    <MazSidebar v-model:open="userMenuOpen" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Dashboard" :active="true" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <div class="maz:flex maz:items-center maz:gap-3 maz:p-3">
          <MazAvatar src="https://placedog.net/100/100" size="0.8rem" />
          <div class="maz:flex-1 maz:min-w-0">
            <p class="maz:m-0 maz:text-md maz:font-semibold">Jane Doe</p>
            <p class="maz:m-0 maz:text-xs maz:text-muted">jane@example.com</p>
          </div>
        </div>
      </MazSidebarFooter>
    </MazSidebar>
    <main class="maz:flex-1 maz:p-4">Main content</main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen">
  <MazSidebarContent><!-- ... --></MazSidebarContent>
  <MazSidebarFooter>
    <div class="maz:flex maz:items-center maz:gap-3 maz:p-3">
      <MazAvatar src="..." size="0.8rem" />
      <div class="maz:flex-1 maz:min-w-0">
        <p class="maz:m-0 maz:text-md maz:font-semibold">Jane Doe</p>
        <p class="maz:m-0 maz:text-xs maz:text-muted">jane@example.com</p>
      </div>
    </div>
  </MazSidebarFooter>
</MazSidebar>
```

  </template>
</ComponentDemo>

## Mobile (static rendering)

::: info
Automatic mobile drawer (drawer auto under a breakpoint with backdrop) is a **deferred v1.1 feature**. For now, control the sidebar visibility programmatically based on viewport.
:::

```html
<script setup>
import { useWindowSize } from 'maz-ui'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isOpen = ref(!isMobile.value)

watch(isMobile, (mobile) => {
  isOpen.value = !mobile
})
</script>

<template>
  <div class="maz:flex maz:h-screen">
    <MazSidebar v-model:open="isOpen" :mode="isMobile ? 'overlay' : 'push'">
      <!-- content -->
    </MazSidebar>
    <main class="maz:flex-1">
      <MazSidebarTrigger />
      <!-- page content -->
    </main>
  </div>
</template>
```

## Programmatic control (v-model + composable)

Use `v-model:open` for two-way binding, or `useSidebar()` inside any descendant component.

```html
<script setup>
import { useSidebar } from 'maz-ui'

// Inside a child component that is a descendant of MazSidebar:
const sidebar = useSidebar()

// sidebar.open.value  → boolean
// sidebar.state.value → 'expanded' | 'collapsed'
// sidebar.toggle()    → toggle open state
// sidebar.setOpen(true/false) → set explicitly
</script>

<template>
  <MazSidebar v-model:open="isOpen">
    <MazSidebarContent>
      <MazSidebarMenu>
        <MazSidebarMenuItem>
          <MazSidebarMenuButton label="Dashboard" />
        </MazSidebarMenuItem>
      </MazSidebarMenu>
    </MazSidebarContent>
    <!-- MazSidebarTrigger uses useSidebar() internally -->
    <MazSidebarTrigger />
  </MazSidebar>
</template>
```

## Persistent open state

The sidebar persists its open/collapsed state in a cookie (`maz-sidebar-open`) so it survives page reloads. This is **enabled by default**.

```html
<!-- Default: persistence enabled, cookie name "maz-sidebar-open" -->
<MazSidebar v-model:open="isOpen" />

<!-- Disable persistence -->
<MazSidebar v-model:open="isOpen" :persist="false" />

<!-- Custom cookie key (useful when multiple sidebars coexist) -->
<MazSidebar v-model:open="isOpen" persist-key="admin-sidebar-open" />
```

### How it works

- **In setup (server + client)**: the cookie is read and used to initialize the open state. On the server, the value is taken from the request `Cookie` header via Vue's `useSSRContext()`; on the client it comes from `document.cookie`.
- **On client mount**: `update:open` is emitted if the persisted value differs from the `:open` prop, so your parent `v-model` stays in sync.
- **On state change**: every transition between expanded/collapsed writes the new value to the cookie (1-year expiry, `SameSite=Lax`).

### SSR considerations

Persistence is **SSR-native** — the server reads the request cookie and renders the sidebar in its persisted state immediately, so there is no expand → collapse flash on hydration. This works out of the box in Nuxt and any Vue 3 SSR runtime that exposes the request headers through `useSSRContext()`.

If you prefer to manage the state yourself (e.g. to share it with other parts of your app), disable persistence and feed the cookie via your own ref:

```html
<script setup>
const sidebarOpen = useCookie<boolean>('maz-sidebar-open', { default: () => true })
</script>

<template>
  <MazSidebar v-model:open="sidebarOpen" :persist="false">
    <!-- ... -->
  </MazSidebar>
</template>
```

`:persist="false"` prevents the sidebar from also writing the cookie, leaving full control to your `useCookie` ref.

## With router (vue-router / NuxtLink)

`MazSidebarMenuButton` uses `resolveLinkComponent()` internally — it detects `RouterLink` (vue-router) or a provided `NuxtLink`. Pass the `to` prop for router navigation, `href` for plain anchor links.

```html
<!-- With vue-router -->
<MazSidebarMenuButton :to="{ name: 'home' }" label="Home" />
<MazSidebarMenuButton to="/about" label="About" />

<!-- With plain href -->
<MazSidebarMenuButton href="https://maz-ui.com" label="Docs" />

<!-- Mark as active manually (useful when router is not available) -->
<MazSidebarMenuButton label="Dashboard" :active="$route.name === 'dashboard'" />
```

## CSS Variables

Customize the sidebar width using these CSS custom properties (also settable via `width` / `iconWidth` props):

```css
:root {
  --maz-sidebar-width: 16rem;      /* expanded width */
  --maz-sidebar-icon-width: 3rem;  /* icon-mode collapsed width */
}
```

## Accessibility

- The sidebar root element renders as `<aside aria-label="Sidebar">`
- `MazSidebarMenu` renders as `<ul role="menu">`
- `MazSidebarMenuItem` renders as `<li role="none">`
- `MazSidebarTrigger` has `aria-expanded` and `aria-controls` referencing the sidebar `id`
- `MazSidebarMenuButton` applies `aria-current="page"` on active items and exposes the label via `aria-label`
- `MazSidebarMenuSub` trigger has `aria-expanded` and `aria-controls`
- In `mode="overlay"`, pressing `Escape` closes the sidebar and focus is restored to the trigger element
- In `mode="overlay"`, `Tab`/`Shift+Tab` are trapped within the sidebar
- All transitions respect `prefers-reduced-motion`

## MazSidebar

<!--@include: ./../../.vitepress/generated-docs/maz-sidebar.doc.md-->

## MazSidebarMenuButton

<!--@include: ./../../.vitepress/generated-docs/maz-sidebar-menu-button.doc.md-->

## MazSidebarMenuSub

<!--@include: ./../../.vitepress/generated-docs/maz-sidebar-menu-sub.doc.md-->

## MazSidebarGroup

<!--@include: ./../../.vitepress/generated-docs/maz-sidebar-group.doc.md-->

<script setup>
import { ref } from 'vue'

import { MazHome } from '@maz-ui/icons/lazy/MazHome'
import { MazCog6Tooth } from '@maz-ui/icons/lazy/MazCog6Tooth'

const overlayOpen = ref(false)
const offcanvasOpen = ref(true)
const userMenuOpen = ref(true)
const badgesOpen = ref(true)
const sideEndOpen = ref(true)
const iconModeOpen = ref(true)
const submenusOpen = ref(true)
const groupsOpen = ref(true)
const basicOpen = ref(true)
</script>
