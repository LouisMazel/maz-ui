---
title: MazList
description: MazList and MazListItem group rows in a rounded block, like the settings of iOS and macOS. Rows can show an icon or an avatar, a value, switches and buttons, link to a page or expand to reveal more.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Sub-components

| Component      | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `MazList`      | The block: optional title above, footer below, hairline separators between the rows           |
| `MazListItem`  | A row: static, clickable, link or collapsible, with slots for icons, values and actions       |

Both are exported by `maz-ui/components/MazList` and `maz-ui/components/MazListItem`.

## Basic usage

<ComponentDemo expanded>
  <MazList title="Account" footer="Your profile is visible to the members of your team.">
    <MazListItem title="Name" subtitle="Used on invoices and emails">
      <template #end>Louis Mazel</template>
    </MazListItem>
    <MazListItem title="Email">
      <template #end>louis@example.com</template>
    </MazListItem>
    <MazListItem title="Language">
      <template #end>English</template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
</script>

<template>
  <MazList title="Account" footer="Your profile is visible to the members of your team.">
    <MazListItem title="Name" subtitle="Used on invoices and emails">
      <template #end>
        Louis Mazel
      </template>
    </MazListItem>
    <MazListItem title="Email">
      <template #end>
        louis@example.com
      </template>
    </MazListItem>
    <MazListItem title="Language">
      <template #end>
        English
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

A row is made of zones, from start to end:

| Zone      | Use                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `start`   | An icon, an avatar, a badge                                                                           |
| `title`, `subtitle` | The text (or the `title` and `subtitle` props)                                            |
| `end`     | A value, a count, a badge. It is **part of the clickable area** and is not interactive                |
| `actions` | Switches, buttons, menus. It is **outside of the clickable area**, so it can be interactive           |

## Settings list

Put the controls in the `actions` slot and the current value in the `end` slot. The `actions` slot is a sibling of the clickable area, never nested in it: a switch inside a row that is a button would be invalid and unreliable with a keyboard or a screen reader.

<ComponentDemo>
  <MazList title="Connections" footer="Airplane mode turns off Wi-Fi and Bluetooth.">
    <MazListItem title="Airplane mode">
      <template #start>
        <span class="maz:flex maz:size-7 maz:items-center maz:justify-center maz:rounded-md maz:bg-warning maz:text-warning-foreground">
          <MazIcon :icon="MazBolt" class="maz:size-4" />
        </span>
      </template>
      <template #actions>
        <MazSwitch v-model="settings.airplane" aria-label="Airplane mode" />
      </template>
    </MazListItem>
    <MazListItem title="Wi-Fi">
      <template #start>
        <span class="maz:flex maz:size-7 maz:items-center maz:justify-center maz:rounded-md maz:bg-primary maz:text-primary-foreground">
          <MazIcon :icon="MazWifi" class="maz:size-4" />
        </span>
      </template>
      <template #end>Home network</template>
      <template #actions>
        <MazSwitch v-model="settings.wifi" aria-label="Wi-Fi" />
      </template>
    </MazListItem>
    <MazListItem title="Notifications" subtitle="Banners and sounds">
      <template #start>
        <span class="maz:flex maz:size-7 maz:items-center maz:justify-center maz:rounded-md maz:bg-destructive maz:text-destructive-foreground">
          <MazIcon :icon="MazBell" class="maz:size-4" />
        </span>
      </template>
      <template #actions>
        <MazSwitch v-model="settings.notifications" aria-label="Notifications" />
      </template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import { MazBell } from '@maz-ui/icons/static/MazBell'
import { MazBolt } from '@maz-ui/icons/static/MazBolt'
import { MazWifi } from '@maz-ui/icons/static/MazWifi'
import MazIcon from 'maz-ui/components/MazIcon'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
import MazSwitch from 'maz-ui/components/MazSwitch'
import { reactive } from 'vue'

const settings = reactive({ airplane: false, wifi: true, notifications: true })
</script>

<template>
  <MazList title="Connections" footer="Airplane mode turns off Wi-Fi and Bluetooth.">
    <MazListItem title="Airplane mode">
      <template #start>
        <span class="flex size-7 items-center justify-center rounded-md bg-warning text-warning-foreground">
          <MazIcon :icon="MazBolt" class="size-4" />
        </span>
      </template>
      <template #actions>
        <MazSwitch v-model="settings.airplane" aria-label="Airplane mode" />
      </template>
    </MazListItem>

    <MazListItem title="Wi-Fi">
      <template #start>
        <span class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <MazIcon :icon="MazWifi" class="size-4" />
        </span>
      </template>
      <template #end>
        Home network
      </template>
      <template #actions>
        <MazSwitch v-model="settings.wifi" aria-label="Wi-Fi" />
      </template>
    </MazListItem>

    <MazListItem title="Notifications" subtitle="Banners and sounds">
      <template #start>
        <span class="flex size-7 items-center justify-center rounded-md bg-destructive text-destructive-foreground">
          <MazIcon :icon="MazBell" class="size-4" />
        </span>
      </template>
      <template #actions>
        <MazSwitch v-model="settings.notifications" aria-label="Notifications" />
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Navigation list

Give a row `to` (a route, rendered with `router-link` or `nuxt-link`) or `href` (a regular link, with `target` if needed) and it becomes a link. Add a chevron in the `end` slot to show that it leads somewhere. Use `active` to highlight the current page.

<ComponentDemo>
  <MazList title="Settings" aria-label="Settings sections">
    <MazListItem title="Profile" href="#navigation-list" active>
      <template #start><MazIcon :icon="MazUser" class="maz:size-5 maz:text-muted" /></template>
      <template #end><MazIcon :icon="MazChevronRight" class="maz:size-3.5" /></template>
    </MazListItem>
    <MazListItem title="Security" subtitle="Password, two-factor authentication" href="#navigation-list">
      <template #start><MazIcon :icon="MazLockClosed" class="maz:size-5 maz:text-muted" /></template>
      <template #end><MazIcon :icon="MazChevronRight" class="maz:size-3.5" /></template>
    </MazListItem>
    <MazListItem title="Documentation" href="https://maz-ui.com" target="_blank">
      <template #start><MazIcon :icon="MazCog6Tooth" class="maz:size-5 maz:text-muted" /></template>
      <template #end><MazIcon :icon="MazArrowTopRightOnSquare" class="maz:size-4" /></template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/static/MazArrowTopRightOnSquare'
import { MazChevronRight } from '@maz-ui/icons/static/MazChevronRight'
import { MazCog6Tooth } from '@maz-ui/icons/static/MazCog6Tooth'
import { MazLockClosed } from '@maz-ui/icons/static/MazLockClosed'
import { MazUser } from '@maz-ui/icons/static/MazUser'
import MazIcon from 'maz-ui/components/MazIcon'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
</script>

<template>
  <MazList title="Settings">
    <!-- `to`: a route (router-link or nuxt-link) -->
    <MazListItem title="Profile" to="/settings/profile" active>
      <template #start>
        <MazIcon :icon="MazUser" class="size-5 text-muted" />
      </template>
      <template #end>
        <MazIcon :icon="MazChevronRight" class="size-3.5" />
      </template>
    </MazListItem>

    <MazListItem title="Security" subtitle="Password, two-factor authentication" to="/settings/security">
      <template #start>
        <MazIcon :icon="MazLockClosed" class="size-5 text-muted" />
      </template>
      <template #end>
        <MazIcon :icon="MazChevronRight" class="size-3.5" />
      </template>
    </MazListItem>

    <!-- `href` + `target`: a regular link (`rel="noopener noreferrer"` is added with `_blank`) -->
    <MazListItem title="Documentation" href="https://maz-ui.com" target="_blank">
      <template #start>
        <MazIcon :icon="MazCog6Tooth" class="size-5 text-muted" />
      </template>
      <template #end>
        <MazIcon :icon="MazArrowTopRightOnSquare" class="size-4" />
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Clickable rows

`clickable` renders the row as a `<button>` and emits `click`. `disabled` turns it off.

<ComponentDemo>
  <MazList aria-label="Account actions">
    <MazListItem title="Export my data" subtitle="A ZIP archive sent by email" clickable @click="lastAction = 'Export requested'">
      <template #start><MazIcon :icon="MazArchiveBoxArrowDown" class="maz:size-5 maz:text-muted" /></template>
    </MazListItem>
    <MazListItem title="Switch to the yearly plan" clickable disabled>
      <template #start><MazIcon :icon="MazCreditCard" class="maz:size-5 maz:text-muted" /></template>
      <template #end>Unavailable</template>
    </MazListItem>
    <MazListItem title="Delete the account" clickable @click="lastAction = 'Deletion requested'">
      <template #start><MazIcon :icon="MazTrash" class="maz:size-5 maz:text-destructive" /></template>
      <template #title><span class="maz:text-destructive">Delete the account</span></template>
    </MazListItem>
  </MazList>
  <p class="maz:mt-3 maz:text-sm maz:text-muted">Last action: {{ lastAction }}</p>

  <template #code>

```vue
<script lang="ts" setup>
import { MazArchiveBoxArrowDown } from '@maz-ui/icons/static/MazArchiveBoxArrowDown'
import { MazCreditCard } from '@maz-ui/icons/static/MazCreditCard'
import { MazTrash } from '@maz-ui/icons/static/MazTrash'
import MazIcon from 'maz-ui/components/MazIcon'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
import { ref } from 'vue'

const lastAction = ref('None')
</script>

<template>
  <MazList aria-label="Account actions">
    <MazListItem
      title="Export my data"
      subtitle="A ZIP archive sent by email"
      clickable
      @click="lastAction = 'Export requested'"
    >
      <template #start>
        <MazIcon :icon="MazArchiveBoxArrowDown" class="size-5 text-muted" />
      </template>
    </MazListItem>

    <MazListItem title="Switch to the yearly plan" clickable disabled>
      <template #start>
        <MazIcon :icon="MazCreditCard" class="size-5 text-muted" />
      </template>
      <template #end>
        Unavailable
      </template>
    </MazListItem>

    <MazListItem clickable @click="lastAction = 'Deletion requested'">
      <template #start>
        <MazIcon :icon="MazTrash" class="size-5 text-destructive" />
      </template>
      <template #title>
        <span class="text-destructive">Delete the account</span>
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Collapsible rows

`collapsible` turns the row into a disclosure: the default slot is the expanded content, and a chevron shows the state. Bind `v-model:open` to control it, and use `chevron-position="end"` to move the chevron after the content of the row. Use `content-class` to change the padding or the background of the expanded area.

The default slot receives `{ open }`: render heavy content (a table, a chart, a request) only when it is `true`, so a list of many rows stays light.

<ComponentDemo>
  <MazList title="Projects" size="lg">
    <MazListItem
      v-for="project in projects"
      :key="project.name"
      v-model:open="project.open"
      collapsible
      chevron-position="end"
      :title="project.name"
      :subtitle="`${project.tasks.length} open tasks`"
    >
      <template #start>
        <MazAvatar :caption="project.name" color="auto" size="1.75rem" no-elevation />
      </template>
      <template #end>
        <MazBadge size="sm" :color="project.status === 'On track' ? 'success' : 'warning'" pastel>
          {{ project.status }}
        </MazBadge>
      </template>
      <template #default="{ open }">
        <table v-if="open" class="maz:w-full maz:text-sm">
          <thead>
            <tr class="maz:text-start maz:text-xs maz:text-muted">
              <th class="maz:py-1 maz:pe-3 maz:text-start maz:font-medium">Task</th>
              <th class="maz:py-1 maz:pe-3 maz:text-start maz:font-medium">Owner</th>
              <th class="maz:py-1 maz:text-end maz:font-medium">Due</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in project.tasks" :key="task.title">
              <td class="maz:py-1 maz:pe-3">{{ task.title }}</td>
              <td class="maz:py-1 maz:pe-3 maz:text-muted">{{ task.owner }}</td>
              <td class="maz:py-1 maz:text-end maz:text-muted">{{ task.due }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'
import MazBadge from 'maz-ui/components/MazBadge'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
import { reactive } from 'vue'

const projects = reactive([
  {
    name: 'Website redesign',
    status: 'On track',
    open: true,
    tasks: [
      { title: 'Homepage mockups', owner: 'Camille', due: 'Mar 14' },
      { title: 'Pricing page copy', owner: 'Louis', due: 'Mar 18' },
    ],
  },
  {
    name: 'Mobile app',
    status: 'At risk',
    open: false,
    tasks: [
      { title: 'Push notifications', owner: 'Sam', due: 'Mar 12' },
      { title: 'Offline mode', owner: 'Nina', due: 'Apr 2' },
      { title: 'App Store screenshots', owner: 'Camille', due: 'Apr 9' },
    ],
  },
])
</script>

<template>
  <MazList title="Projects" size="lg">
    <MazListItem
      v-for="project in projects"
      :key="project.name"
      v-model:open="project.open"
      collapsible
      chevron-position="end"
      :title="project.name"
      :subtitle="`${project.tasks.length} open tasks`"
    >
      <template #start>
        <MazAvatar :caption="project.name" color="auto" size="1.75rem" no-elevation />
      </template>

      <template #end>
        <MazBadge size="sm" :color="project.status === 'On track' ? 'success' : 'warning'" pastel>
          {{ project.status }}
        </MazBadge>
      </template>

      <!-- Rendered only when the row is expanded -->
      <template #default="{ open }">
        <table v-if="open" class="w-full text-sm">
          <thead>
            <tr class="text-xs text-muted">
              <th class="py-1 pe-3 text-start font-medium">
                Task
              </th>
              <th class="py-1 pe-3 text-start font-medium">
                Owner
              </th>
              <th class="py-1 text-end font-medium">
                Due
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in project.tasks" :key="task.title">
              <td class="py-1 pe-3">
                {{ task.title }}
              </td>
              <td class="py-1 pe-3 text-muted">
                {{ task.owner }}
              </td>
              <td class="py-1 text-end text-muted">
                {{ task.due }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

With the default `chevron-position="start"`, the chevron comes before the `start` slot, which suits trees and FAQ-like lists:

<ComponentDemo>
  <MazList>
    <MazListItem collapsible title="Can I change my plan later?" content-class="maz:px-4 maz:py-3 maz:text-sm maz:text-muted">
      Yes. You can upgrade or downgrade at any time from the billing page. The difference is prorated on your next invoice.
    </MazListItem>
    <MazListItem collapsible title="Is my data exported when I leave?" content-class="maz:px-4 maz:py-3 maz:text-sm maz:text-muted">
      Every workspace can be exported as a ZIP archive of JSON and CSV files, at any time, even after cancelling.
    </MazListItem>
  </MazList>

  <template #code>

```vue
<template>
  <MazList>
    <MazListItem
      collapsible
      title="Can I change my plan later?"
      content-class="px-4 py-3 text-sm text-muted"
    >
      Yes. You can upgrade or downgrade at any time from the billing page.
      The difference is prorated on your next invoice.
    </MazListItem>

    <MazListItem
      collapsible
      title="Is my data exported when I leave?"
      content-class="px-4 py-3 text-sm text-muted"
    >
      Every workspace can be exported as a ZIP archive of JSON and CSV files,
      at any time, even after cancelling.
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Wrapping text

Titles and subtitles are truncated on one line. Add `wrap` to let them run on several lines, for a setting with a long description:

```vue
<template>
  <MazList>
    <MazListItem wrap title="Launch at login" subtitle="Ripple starts hidden in the menu bar and checks your projects in the background.">
      <template #actions>
        <MazSwitch v-model="launchAtLogin" aria-label="Launch at login" />
      </template>
    </MazListItem>
  </MazList>
</template>
```

## Scrolling items

A long list in a bounded space (a dialog, a step of a wizard, a sidebar) can scroll its items only: add `scrollable` and give the list a bounded height. The title, the `header-end` actions and the footer stay in place.

```vue
<template>
  <!-- A fixed maximum height -->
  <MazList scrollable title="Repositories" class="max-h-80">
    <MazListItem v-for="repo in repos" :key="repo.path" :title="repo.name" :subtitle="repo.path" />
  </MazList>

  <!-- Or the rest of a flex column: the list shrinks to the space left -->
  <div class="flex h-full flex-col gap-4">
    <MazInput v-model="query" label="Search" />
    <MazList scrollable title="Repositories" class="flex-1">
      <MazListItem v-for="repo in repos" :key="repo.path" :title="repo.name" />
    </MazList>
  </div>
</template>
```

## Lazy content

Rows are collapsed but their content is always rendered. With many rows holding heavy content (tables, charts), add `lazy`: the content is rendered at the first opening, then kept mounted so the closing animation still works. The default stays unchanged.

```vue
<template>
  <MazList>
    <MazListItem v-for="repo in repos" :key="repo.name" collapsible lazy :title="repo.name">
      <DependencyTable :repo />
    </MazListItem>
  </MazList>
</template>
```

## Avatars and badges

The `start` slot takes anything: a [MazAvatar](./maz-avatar.md) (with its own [indicator](./maz-avatar.md#indicator) for a status), the `end` slot a [MazBadge](./maz-badge.md) or a count.

<ComponentDemo>
  <MazList title="Team">
    <MazListItem v-for="member in team" :key="member.name" :title="member.name" :subtitle="member.role" clickable>
      <template #start>
        <MazAvatar
          :caption="member.name"
          color="auto"
          size="2rem"
          no-elevation
          :indicator="member.online ? { color: 'success', label: 'Online' } : false"
        />
      </template>
      <template #end>
        <MazBadge v-if="member.unread" color="primary" size="sm" rounded-size="full">{{ member.unread }}</MazBadge>
      </template>
    </MazListItem>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'
import MazBadge from 'maz-ui/components/MazBadge'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'

const team = [
  { name: 'Camille Durand', role: 'Design lead', online: true, unread: 3 },
  { name: 'Sam Okafor', role: 'Backend engineer', online: true, unread: 0 },
  { name: 'Nina Rossi', role: 'Product manager', online: false, unread: 12 },
]
</script>

<template>
  <MazList title="Team">
    <MazListItem
      v-for="member in team"
      :key="member.name"
      :title="member.name"
      :subtitle="member.role"
      clickable
    >
      <template #start>
        <MazAvatar
          :caption="member.name"
          color="auto"
          size="2rem"
          no-elevation
          :indicator="member.online ? { color: 'success', label: 'Online' } : false"
        />
      </template>

      <template #end>
        <MazBadge v-if="member.unread" color="primary" size="sm" rounded-size="full">
          {{ member.unread }}
        </MazBadge>
      </template>
    </MazListItem>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Header, footer and actions

`title` and `footer` accept plain text. For richer content use the `header` and `footer` slots, and `header-end` for something at the end of the title row, like a "See all" link or a count.

<ComponentDemo>
  <MazList>
    <template #header>Recent activity</template>
    <template #header-end>
      <MazLink href="#header-footer-and-actions" class="maz:text-xs">See all</MazLink>
    </template>
    <MazListItem title="Pull request merged" subtitle="feat(list): add MazList">
      <template #start><MazIcon :icon="MazGitPullRequest" class="maz:size-5 maz:text-success" /></template>
      <template #end>2 min ago</template>
    </MazListItem>
    <MazListItem title="Branch created" subtitle="fix/avatar-ring">
      <template #start><MazIcon :icon="MazGitBranch" class="maz:size-5 maz:text-info" /></template>
      <template #end>1 h ago</template>
    </MazListItem>
    <template #footer>
      Showing the <strong>2</strong> latest events of your <MazLink href="#header-footer-and-actions">repository</MazLink>.
    </template>
  </MazList>

  <template #code>

```vue
<script lang="ts" setup>
import { MazGitBranch } from '@maz-ui/icons/static/MazGitBranch'
import { MazGitPullRequest } from '@maz-ui/icons/static/MazGitPullRequest'
import MazIcon from 'maz-ui/components/MazIcon'
import MazLink from 'maz-ui/components/MazLink'
import MazList from 'maz-ui/components/MazList'
import MazListItem from 'maz-ui/components/MazListItem'
</script>

<template>
  <MazList>
    <template #header>
      Recent activity
    </template>

    <template #header-end>
      <MazLink to="/activity" class="text-xs">
        See all
      </MazLink>
    </template>

    <MazListItem title="Pull request merged" subtitle="feat(list): add MazList">
      <template #start>
        <MazIcon :icon="MazGitPullRequest" class="size-5 text-success" />
      </template>
      <template #end>
        2 min ago
      </template>
    </MazListItem>

    <MazListItem title="Branch created" subtitle="fix/avatar-ring">
      <template #start>
        <MazIcon :icon="MazGitBranch" class="size-5 text-info" />
      </template>
      <template #end>
        1 h ago
      </template>
    </MazListItem>

    <template #footer>
      Showing the <strong>2</strong> latest events of your repository.
    </template>
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Sizes

`size` sets the density of the rows (`sm`, `md` default, `lg`). The items inherit it, and a single item can override it with its own `size`.

<ComponentDemo>
  <div class="maz:grid maz:gap-4 maz:md:grid-cols-3">
    <MazList v-for="size in ['sm', 'md', 'lg']" :key="size" :size="size" :title="`size=${size}`">
      <MazListItem title="Inbox" clickable><template #end>12</template></MazListItem>
      <MazListItem title="Drafts" clickable><template #end>3</template></MazListItem>
      <MazListItem title="Archive" clickable />
    </MazList>
  </div>

  <template #code>

```vue
<template>
  <MazList size="sm">
    <MazListItem title="Inbox" clickable>
      <template #end>
        12
      </template>
    </MazListItem>
    <MazListItem title="Drafts" clickable>
      <template #end>
        3
      </template>
    </MazListItem>
    <!-- A row can override the size of its list -->
    <MazListItem title="Archive" size="lg" clickable />
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Without the block

`bordered` draws the rounded block (background and hairline edge). Set `:bordered="false"` to render the rows inline in a container that already has a background, such as a [MazCard](./maz-card.md), a [MazDialog](./maz-dialog.md) or a [MazDrawer](./maz-drawer.md). `rounded-size` changes the radius of the block, and `:divider="false"` removes the separators.

<ComponentDemo>
  <div class="maz:grid maz:gap-4 maz:md:grid-cols-2">
    <MazCard>
      <template #title>Storage</template>
      <MazList :bordered="false" size="sm">
        <MazListItem title="Photos"><template #end>12.4 GB</template></MazListItem>
        <MazListItem title="Documents"><template #end>3.1 GB</template></MazListItem>
        <MazListItem title="Backups"><template #end>38.0 GB</template></MazListItem>
      </MazList>
    </MazCard>
    <MazList rounded-size="xl" :divider="false" title="No separators, xl radius">
      <MazListItem title="Photos"><template #end>12.4 GB</template></MazListItem>
      <MazListItem title="Documents"><template #end>3.1 GB</template></MazListItem>
    </MazList>
  </div>

  <template #code>

```vue
<template>
  <MazCard>
    <template #title>
      Storage
    </template>

    <MazList :bordered="false" size="sm">
      <MazListItem title="Photos">
        <template #end>
          12.4 GB
        </template>
      </MazListItem>
      <MazListItem title="Documents">
        <template #end>
          3.1 GB
        </template>
      </MazListItem>
    </MazList>
  </MazCard>

  <MazList rounded-size="xl" :divider="false" title="No separators, xl radius">
    <MazListItem title="Photos" />
    <MazListItem title="Documents" />
  </MazList>
</template>
```

  </template>
</ComponentDemo>

## Accessibility

- The list is rendered with `role="list"` and each row with `role="listitem"`, so screen readers announce the count of rows.
- When the list has a title (the `title` prop or the `header` slot), it names the list through `aria-labelledby`. Without a title, set `aria-label` on `MazList`.
- A collapsible row is a `<button>` with `aria-expanded` and `aria-controls` pointing at the expanded content. The chevron is decorative (`aria-hidden`).
- A clickable row is a `<button type="button">`, a row with `to` or `href` is a link, a static row is a plain `div`. Disabled rows use `disabled` (buttons) or `aria-disabled` (links).
- The `actions` slot is rendered **next to** the clickable area, not inside it, so a switch, a button or a menu never ends up nested in another interactive element. Give each of them an accessible name (`aria-label="Wi-Fi"`), the name of the row is not enough on its own.
- The `end` slot is inside the clickable area: put only text, badges and icons there, never a button or a link.
- Everything stays reachable with the keyboard (`Tab`, `Enter` and `Space`), and the chevron rotation respects `prefers-reduced-motion`.
- Do not rely on the color alone to show the `active` row: add `aria-current="page"` on navigation links when the router does not do it for you.

<script lang="ts" setup>
import { MazArchiveBoxArrowDown } from '@maz-ui/icons/static/MazArchiveBoxArrowDown'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/static/MazArrowTopRightOnSquare'
import { MazBell } from '@maz-ui/icons/static/MazBell'
import { MazBolt } from '@maz-ui/icons/static/MazBolt'
import { MazChevronRight } from '@maz-ui/icons/static/MazChevronRight'
import { MazCog6Tooth } from '@maz-ui/icons/static/MazCog6Tooth'
import { MazCreditCard } from '@maz-ui/icons/static/MazCreditCard'
import { MazGitBranch } from '@maz-ui/icons/static/MazGitBranch'
import { MazGitPullRequest } from '@maz-ui/icons/static/MazGitPullRequest'
import { MazLockClosed } from '@maz-ui/icons/static/MazLockClosed'
import { MazTrash } from '@maz-ui/icons/static/MazTrash'
import { MazUser } from '@maz-ui/icons/static/MazUser'
import { MazWifi } from '@maz-ui/icons/static/MazWifi'
import { reactive, ref } from 'vue'

const settings = reactive({ airplane: false, wifi: true, notifications: true })

const lastAction = ref('None')

const projects = reactive([
  {
    name: 'Website redesign',
    status: 'On track',
    open: true,
    tasks: [
      { title: 'Homepage mockups', owner: 'Camille', due: 'Mar 14' },
      { title: 'Pricing page copy', owner: 'Louis', due: 'Mar 18' },
    ],
  },
  {
    name: 'Mobile app',
    status: 'At risk',
    open: false,
    tasks: [
      { title: 'Push notifications', owner: 'Sam', due: 'Mar 12' },
      { title: 'Offline mode', owner: 'Nina', due: 'Apr 2' },
      { title: 'App Store screenshots', owner: 'Camille', due: 'Apr 9' },
    ],
  },
])

const team = [
  { name: 'Camille Durand', role: 'Design lead', online: true, unread: 3 },
  { name: 'Sam Okafor', role: 'Backend engineer', online: true, unread: 0 },
  { name: 'Nina Rossi', role: 'Product manager', online: false, unread: 12 },
]
</script>

## MazList

<!--@include: ./../../.vitepress/generated-docs/maz-list.doc.md-->

## MazListItem

<!--@include: ./../../.vitepress/generated-docs/maz-list-item.doc.md-->
