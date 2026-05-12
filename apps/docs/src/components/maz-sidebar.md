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

## 1. Basic usage

<ComponentDemo>
  <div style="height: 400px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="basicOpen" style="height: 100%;">
      <MazSidebarHeader>
        <div style="padding: 1rem; font-weight: bold;">My App</div>
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
        <div style="padding: 1rem;">Footer</div>
      </MazSidebarFooter>
    </MazSidebar>
    <main style="flex: 1; padding: 1rem;">Main content</main>
  </div>

<template #code>

```html
<div style="display: flex; height: 100vh;">
  <MazSidebar v-model:open="isOpen">
    <MazSidebarHeader>
      <div style="padding: 1rem; font-weight: bold;">My App</div>
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
      <div style="padding: 1rem;">Footer</div>
    </MazSidebarFooter>
  </MazSidebar>
  <main style="flex: 1; padding: 1rem;">Main content</main>
</div>

<script setup>
const isOpen = ref(true)
</script>
```

  </template>
</ComponentDemo>

## 2. Groups & dividers

<ComponentDemo>
  <div style="height: 400px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="groupsOpen" style="height: 100%;">
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
    <main style="flex: 1; padding: 1rem;">Main content</main>
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

## 3. Sub-menus

<ComponentDemo>
  <div style="height: 400px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="submenusOpen" style="height: 100%;">
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
    <main style="flex: 1; padding: 1rem;">Main content</main>
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

## 4. Icon mode with tooltips

When `collapsible="icon"` and the sidebar is collapsed, labels are visually hidden (but available to screen readers) and the `title` tooltip is shown on hover. The tooltip defaults to the `label` prop value.

<ComponentDemo>
  <div style="height: 400px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="iconModeOpen" collapsible="icon" style="height: 100%;">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton :icon="MazHome" label="Dashboard" tooltip="Go to Dashboard" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Settings" tooltip="Open Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <MazSidebarTrigger />
      </MazSidebarFooter>
    </MazSidebar>
    <main style="flex: 1; display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
      Click the trigger to collapse/expand
      <MazBtn @click="iconModeOpen = !iconModeOpen">Toggle sidebar</MazBtn>
    </main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen" collapsible="icon">
  <MazSidebarContent>
    <MazSidebarMenu>
      <MazSidebarMenuItem>
        <!-- tooltip shown automatically when collapsed -->
        <MazSidebarMenuButton label="Dashboard" tooltip="Go to Dashboard" />
      </MazSidebarMenuItem>
    </MazSidebarMenu>
  </MazSidebarContent>
  <MazSidebarFooter>
    <MazSidebarTrigger />
  </MazSidebarFooter>
</MazSidebar>
```

  </template>
</ComponentDemo>

## 5. Offcanvas mode

<ComponentDemo>
  <div style="height: 300px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="offcanvasOpen" collapsible="offcanvas" style="height: 100%;">
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
    <main style="flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 1rem;">
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

## 6. Overlay vs push mode

In `mode="push"` (default), the sidebar is part of the document flow and pushes the main content.
In `mode="overlay"`, the sidebar floats over the content with a backdrop.

<ComponentDemo>
  <div style="height: 300px; position: relative; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazBtn @click="overlayOpen = !overlayOpen" style="position: absolute; top: 1rem; left: 1rem; z-index: 1;">
      Toggle overlay sidebar
    </MazBtn>
    <MazSidebar v-model:open="overlayOpen" mode="overlay">
      <MazSidebarHeader>
        <div style="padding: 1rem; font-weight: bold;">Overlay Sidebar</div>
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

## 7. Side end (right)

<ComponentDemo>
  <div style="height: 300px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <main style="flex: 1; padding: 1rem;">Main content</main>
    <MazSidebar v-model:open="sideEndOpen" side="end" style="height: 100%;">
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
<div style="display: flex; height: 100vh;">
  <main style="flex: 1;">Main content</main>
  <MazSidebar v-model:open="isOpen" side="end">
    <!-- content -->
  </MazSidebar>
</div>
```

  </template>
</ComponentDemo>

## 8. Badges

<ComponentDemo>
  <div class="maz:border maz:overflow-hidden maz:rounded-md maz:h-[21.40rem] maz:flex">
    <MazSidebar v-model:open="badgesOpen" class="maz:h-full">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Inbox" :badge="12" :active="true" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Notifications" :badge="3" />
          </MazSidebarMenuItem>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Settings" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
    </MazSidebar>
    <main style="flex: 1; display: flex; flex-direction: column; gap: 1rem; padding: 1rem;">
      Badges are hidden in icon-collapsed mode.
      <MazBtn @click="badgesOpen = !badgesOpen">Toggle sidebar</MazBtn>
    </main>
  </div>

<template #code>

```html
<MazSidebarMenuButton label="Inbox" :badge="12" />
<MazSidebarMenuButton label="Notifications" :badge="3" />
```

  </template>
</ComponentDemo>

## 9. User menu in footer

<ComponentDemo>
  <div style="height: 350px; display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <MazSidebar v-model:open="userMenuOpen" style="height: 100%;">
      <MazSidebarContent>
        <MazSidebarMenu>
          <MazSidebarMenuItem>
            <MazSidebarMenuButton label="Dashboard" :active="true" />
          </MazSidebarMenuItem>
        </MazSidebarMenu>
      </MazSidebarContent>
      <MazSidebarFooter>
        <div style="padding: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
          <MazAvatar src="https://placedog.net/100/100" size="1rem" />
          <div style="flex: 1; min-width: 0;">
            <p style="margin: 0; font-weight: 600; font-size: 0.875rem;">Jane Doe</p>
            <p style="margin: 0; font-size: 0.75rem; opacity: 0.7;">jane@example.com</p>
          </div>
        </div>
      </MazSidebarFooter>
    </MazSidebar>
    <main style="flex: 1; padding: 1rem;">Main content</main>
  </div>

<template #code>

```html
<MazSidebar v-model:open="isOpen">
  <MazSidebarContent><!-- ... --></MazSidebarContent>
  <MazSidebarFooter>
    <div style="padding: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
      <MazAvatar src="..." size="1.5rem" />
      <div>
        <p>Jane Doe</p>
        <p>jane@example.com</p>
      </div>
    </div>
  </MazSidebarFooter>
</MazSidebar>
```

  </template>
</ComponentDemo>

## 10. Mobile (static rendering)

::: info
Automatic mobile drawer (drawer auto under a breakpoint with backdrop) is a **deferred v1.1 feature**. For now, control the sidebar visibility programmatically based on viewport.
:::

```html
<script setup>
import { useWindowSize } from 'maz-ui'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isOpen = ref(!isMobile.value)

// Close sidebar on mobile by default
watch(isMobile, (mobile) => {
  if (mobile) isOpen.value = false
  else isOpen.value = true
})
</script>

<template>
  <div style="display: flex; height: 100vh;">
    <MazSidebar v-model:open="isOpen" :mode="isMobile ? 'overlay' : 'push'">
      <!-- content -->
    </MazSidebar>
    <main style="flex: 1;">
      <MazSidebarTrigger />
      <!-- page content -->
    </main>
  </div>
</template>
```

## 11. Programmatic control (v-model + composable)

Use `v-model:open` for two-way binding, or `useMazSidebar()` inside any descendant component.

```html
<script setup>
import { useMazSidebar } from 'maz-ui'

// Inside a child component that is a descendant of MazSidebar:
const sidebar = useMazSidebar()

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
    <!-- MazSidebarTrigger uses useMazSidebar() internally -->
    <MazSidebarTrigger />
  </MazSidebar>
</template>
```

## 12. With router (vue-router / NuxtLink)

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

## MazSidebar Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | auto-generated | Unique identifier for the sidebar |
| `v-model:open` | `boolean` | `true` | Controls the open/closed state |
| `side` | `'start' \| 'end'` | `'start'` | Which side the sidebar appears on |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | How the sidebar collapses |
| `mode` | `'push' \| 'overlay'` | `'push'` | Whether content is pushed or overlaid |
| `width` | `string` | `'16rem'` | Width when expanded |
| `iconWidth` | `string` | `'3rem'` | Width in icon-collapsed mode |

## MazSidebarMenuButton Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `to` | `string \| object` | — | Router-link target |
| `href` | `string` | — | Anchor href |
| `icon` | `Component \| string` | — | Icon component or SVG |
| `label` | `string` | — | Text label |
| `badge` | `string \| number` | — | Badge content |
| `tooltip` | `string` | — | Tooltip (auto-shown when icon-collapsed; falls back to `label`) |
| `active` | `boolean` | — | Force active state (`aria-current="page"`) |
| `disabled` | `boolean` | `false` | Disable the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

## MazSidebarMenuSub Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label for the trigger button |
| `icon` | `Component \| string` | — | Icon for the trigger |
| `defaultOpen` | `boolean` | `false` | Open the sub-menu by default |

## CSS Variables

Customize the sidebar appearance using these CSS custom properties:

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
- `MazSidebarMenuButton` applies `aria-current="page"` on active items
- `MazSidebarMenuSub` trigger has `aria-expanded` and `aria-controls`
- In `mode="overlay"`, pressing `Escape` closes the sidebar and focus is restored to the trigger element
- In `mode="overlay"`, `Tab`/`Shift+Tab` are trapped within the sidebar
- All transitions respect `prefers-reduced-motion`

<script setup>
import { ref } from 'vue'

import { MazHome } from '@maz-ui/icons/lazy/MazHome'

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
