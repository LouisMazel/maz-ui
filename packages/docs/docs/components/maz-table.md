---
title: MazTable
description: MazTable is designed to be a reusable data table with advanced features. Pagination, Search, Column Sorting, Row Selection, UI options, Loading and Slots.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Key Features

1. Pagination (prop `pagination`)
   * The component supports pagination with buttons to go to the first, previous, next, and last page.
   * You can display only the pagination elements (input and buttons) and make API calls to your server to get elements by using the prop `pagination` with `no-paginate-rows`.
2. Search (prop `search`): It includes a search feature with a search bar where users can enter a query to filter displayed data. You can choose the column where the search will be activated.
3. Column Sorting (prop: `sortable`): Columns are sortable, indicated by arrow icons. Sorting can be activated by clicking on the column header.
4. Row Selection (prop `select-value="key"`): There is a dedicated column for selection with a checkbox for each row. Users can individually or collectively select/deselect rows.
5. Customizable Page Size: Users can choose the number of items to display per page using a dropdown list.
6. Loading Indicator (prop `loading`): A loading indicator (MazLoadingBar) is displayed when data is being loaded.

## Available models

* v-model: `(string | boolean | number)[] | undefined` (list of selected key)
* v-model:search-query: `string | undefined`
* v-model:page: `number`
* v-model:page-size: `number`

## Basic usage

You can use MazTable and his child component to build a simple table and enjoy the style.

<MazTable size="md" :headers="['#', 'Lastname', 'Firstname', 'Age']">
  <MazTableRow>
    <MazTableCell>
      1
    </MazTableCell>
    <MazTableCell>
      John
    </MazTableCell>
    <MazTableCell>
      Doe
    </MazTableCell>
    <MazTableCell>
      99
    </MazTableCell>
  </MazTableRow>
  <MazTableRow>
    <MazTableCell>
      2
    </MazTableCell>
    <MazTableCell>
      Doe
    </MazTableCell>
    <MazTableCell>
      John
    </MazTableCell>
    <MazTableCell>
      30
    </MazTableCell>
  </MazTableRow>
</MazTable>

::: details Show code

```vue
<template>
  <MazTable size="sm" :headers="['#', 'Lastname', 'Firstname', 'Age']">
    <MazTableRow>
      <MazTableCell>
        1
      </MazTableCell>
      <MazTableCell>
        John
      </MazTableCell>
      <MazTableCell>
        Doe
      </MazTableCell>
      <MazTableCell>
        99
      </MazTableCell>
    </MazTableRow>
    <MazTableRow>
      <MazTableCell>
        2
      </MazTableCell>
      <MazTableCell>
        Doe
      </MazTableCell>
      <MazTableCell>
        John
      </MazTableCell>
      <MazTableCell>
        30
      </MazTableCell>
    </MazTableRow>
  </MazTable>
</template>

<script lang="ts" setup>
  import MazTable from 'maz-ui/components/MazTable'
  import MazTableRow from 'maz-ui/components/MazTable'
  import MazTableCell from 'maz-ui/components/MazTable'
</script>
```

:::

## Advanced

`v-model="{{selectedIds ?? 'undefined'}}"`
<br />
`v-model:search-query="{{searchQuery ?? 'undefined'}}"`
<br />
`v-model:page="{{page ?? 'undefined'}}"`
<br />
`v-model:page-size="{{pageSize ?? 'undefined'}}"`

<MazTable
  size="sm"
  v-model="selectedIds"
  v-model:search-query="searchQuery"
  v-model:page="page"
  v-model:page-size="pageSize"
  search
  pagination
  color="secondary"
  sortable
  selectable
  hoverable
  background-even
  selected-key="id"
  :headers="[
    { label:'#', key: 'index', align: 'center', sortable: false },
    { label:'Name', key: 'name' },
    { label: 'Code', key: 'code', align: 'center'  },
    { label: 'Type', key: 'type' },
    { label: 'Area', key: 'areaName', align: 'right', class: 'maz-text-right' },
  ]"
  :rows="competitions"
>
  <template #cell-index="{ value }">
    <span class="maz-text-base">{{value}}</span>
  </template>
  <template #cell-name="{ row, value }">
    <div class="maz-flex maz-items-center maz-gap-2">
      <MazAvatar :src="row.logoUrl" size="0.5rem"></MazAvatar>
      <span>{{value}}</span>
    </div>
  </template>
  <template #cell-type="{ value }">
    <MazBadge :color="value === 'CUP' ? 'primary' : 'secondary'">{{value}}</MazBadge>
  </template>

  <template #actions>
    <MazBtn fab size="xs" color="danger" icon="trash" />
  </template>
</MazTable>

::: details Show code

```vue
<template>
  <MazTable
    size="sm"
    v-model="selectedIds"
    v-model:search-query="searchQuery"
    v-model:page="page"
    v-model:page-size="pageSize"
    search
    pagination
    color="secondary"
    sortable
    selectable
    hoverable
    background-even
    selected-key="id"
    :headers="[
      { label:'#', key: 'index', align: 'center', sortable: false },
      { label:'Name', key: 'name' },
      { label: 'Code', key: 'code', align: 'center'  },
      { label: 'Type', key: 'type' },
      { label: 'Area', key: 'areaName', align: 'right', class: 'maz-text-right' },
    ]"
    :rows="competitions"
  >
    <template #cell-index="{ value }">
      <span class="maz-text-base">{{value}}</span>
    </template>
    <template #cell-name="{ row, value }">
      <div class="maz-flex maz-items-center maz-gap-2">
        <MazAvatar :src="row.logoUrl" size="0.5rem"></MazAvatar>
        <span>{{value}}</span>
      </div>
    </template>
    <template #cell-type="{ value }">
      <MazBadge :color="value === 'CUP' ? 'primary' : 'secondary'">{{value}}</MazBadge>
    </template>

    <template #actions>
      <MazBtn fab size="xs" color="danger" icon="trash" />
    </template>
  </MazTable>
</template>

<script lang="ts">
  import MazTable from 'maz-ui/components/MazTable'

  const competitions = [
  {
    id: '0262672d-7c7a-4d30-866e-edb88b5a5336',
    name: 'UEFA Champions League',
    code: 'CL',
    type: 'CUP',
    areaName: 'Europe',
    matchday: 6,
    logoUrl: 'https://crests.football-data.org/CL.png',
    groups: 1,
    index: 1,
  },
  {
    id: '08d15e97-a319-4772-9b82-f1877369b40f',
    name: 'Premier League',
    code: 'PL',
    type: 'LEAGUE',
    areaName: 'England',
    matchday: 18,
    logoUrl: 'https://crests.football-data.org/PL.png',
    groups: 1,
    index: 2,
  },
  {
    id: '17e62396-bbcb-42f5-acff-caed11534976',
    name: 'Serie A',
    code: 'SA',
    type: 'LEAGUE',
    areaName: 'Italy',
    matchday: 17,
    logoUrl: 'https://crests.football-data.org/SA.png',
    groups: 0,
    index: 3,
  },
  {
    id: '3726264e-ba3a-4a9f-b4a4-8fc33e12747c',
    name: 'FIFA World Cup',
    code: 'WC',
    type: 'CUP',
    areaName: 'World',
    matchday: 8,
    logoUrl: 'https://crests.football-data.org/qatar.png',
    groups: 1,
    index: 4,
  },
  {
    id: '555dc3f4-e592-46af-b634-59f07a201f2e',
    name: 'Primeira Liga',
    code: 'PPL',
    type: 'LEAGUE',
    areaName: 'Portugal',
    matchday: 15,
    logoUrl: 'https://crests.football-data.org/PPL.png',
    groups: 0,
    index: 5,
  },
  {
    id: '59bbdfa0-86d8-4a74-b701-435747c55a42',
    name: 'Primera Division',
    code: 'PD',
    type: 'LEAGUE',
    areaName: 'Spain',
    matchday: 18,
    logoUrl: 'https://crests.football-data.org/PD.png',
    groups: 1,
    index: 6,
  },
  {
    id: '6ae53332-3d27-4781-912d-d9c4e69657f9',
    name: 'Ligue 1',
    code: 'FL1',
    type: 'LEAGUE',
    areaName: 'France',
    matchday: 17,
    logoUrl: 'https://crests.football-data.org/FL1.png',
    groups: 4,
    index: 7,
  },
  {
    id: '747c79ee-89c8-436a-b0ea-53f05f180007',
    name: 'European Championship',
    code: 'EC',
    type: 'CUP',
    areaName: 'Europe',
    matchday: 1,
    logoUrl: 'https://crests.football-data.org/EUR.svg',
    groups: 1,
    index: 8,
  },
  {
    id: '7a32d897-6b22-4212-8ffe-049ae912c346',
    name: 'Eredivisie',
    code: 'DED',
    type: 'LEAGUE',
    areaName: 'Netherlands',
    matchday: 18,
    logoUrl: 'https://crests.football-data.org/ED.png',
    groups: 0,
    index: 9,
  },
  {
    id: 'ab57e2dc-272c-45e6-b13e-57617a13b753',
    name: 'Championship',
    code: 'ELC',
    type: 'LEAGUE',
    areaName: 'England',
    matchday: 23,
    logoUrl: 'https://crests.football-data.org/ELC.png',
    groups: 0,
    index: 10,
  },
  {
    id: 'b84e3295-7315-46c7-b979-6d9d784e5460',
    name: 'Campeonato Brasileiro Série A',
    code: 'BSA',
    type: 'LEAGUE',
    areaName: 'Brazil',
    matchday: 38,
    logoUrl: 'https://crests.football-data.org/764.svg',
    groups: 0,
    index: 11,
  },
  {
    id: 'cafad3ce-1783-4652-9248-4bcad024dd98',
    name: 'Copa Libertadores',
    code: 'CLI',
    type: 'CUP',
    areaName: 'South America',
    matchday: 11,
    logoUrl: 'https://crests.football-data.org/CLI.svg',
    groups: 0,
    index: 12,
  },
  {
    id: 'ed945bea-9a58-450a-8d62-7baa7722b5e7',
    name: 'Bundesliga',
    code: 'BL1',
    type: 'LEAGUE',
    areaName: 'Germany',
    matchday: 16,
    logoUrl: 'https://crests.football-data.org/BL1.png',
    groups: 0,
    index: 13,
  },
]

</script>
```

:::

## Loading

<MazTable loading :headers="['#', 'Lastname', 'Firstname', 'Age']">
  <MazTableRow>
    <MazTableCell>
      1
    </MazTableCell>
    <MazTableCell>
      John
    </MazTableCell>
    <MazTableCell>
      Doe
    </MazTableCell>
    <MazTableCell>
      99
    </MazTableCell>
  </MazTableRow>
</MazTable>

<script lang="ts" setup>
  import { ref } from 'vue'
  import {competitions} from './competitions.ts'

  const selectedIds = ref<string[]>(['0262672d-7c7a-4d30-866e-edb88b5a5336'])
  const searchQuery = ref<string>()
  const pageSize = ref<number>(10)
  const page = ref<number>(1)
</script>

## Props & Events emitted

## MazTable

<!--@include: ./../.vitepress/generated-docs/maz-table.doc.md-->

## MazTableCell

<!--@include: ./../.vitepress/generated-docs/maz-table-cell.doc.md-->

## MazTableRow

<!--@include: ./../.vitepress/generated-docs/maz-table-row.doc.md-->

## MazTableTitle

<!--@include: ./../.vitepress/generated-docs/maz-table-title.doc.md-->

<style lang="postcss">
  .m-table {
    table {
      display: inherit;
      margin: inherit;
      overflow-x: inherit;

      tr {
        background-color: inherit;
        border-top: inherit;
        transition: inherit;

        th, td {
          text-align: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          background-color: inherit;
          border: none;
          padding: inherit;
        }

        &:nth-child(2n) {
          background-color: inherit;
        }
      }
    }
  }

</style>
