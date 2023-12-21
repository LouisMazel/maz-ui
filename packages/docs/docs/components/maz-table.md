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

* v-model: `string[] | undefined` (list of selected key)
* v-model:search-query: `string | undefined`
* v-model:page: `number`
* v-model:page-size: `number`

## Basic usage

You can use MazTable and his child component to build a simple table and enjoy the style.

<MazTable size="sm" :headers="['#', 'Lastname', 'Firstname', 'Age']">
  <MazTableRow>
    <MazTableCell>
      1
    </MazTableCell>
    <MazTableCell>
      Louis
    </MazTableCell>
    <MazTableCell>
      Mazel
    </MazTableCell>
    <MazTableCell>
      33
    </MazTableCell>
  </MazTableRow>
</MazTable>

```vue
<template>
  <MazTable size="sm" :headers="['#', 'Lastname', 'Firstname', 'Age']">
    <MazTableRow>
      <MazTableCell>
        1
      </MazTableCell>
      <MazTableCell>
        Louis
      </MazTableCell>
      <MazTableCell>
        Mazel
      </MazTableCell>
      <MazTableCell>
        33
      </MazTableCell>
    </MazTableRow>
  </MazTable>
</template>

<script lang="ts" setup>
  import MazTable from 'maz-ui/components/MazTable'
</script>
```

<MazTable
  size="sm"
  search
  pagination
  sortable
  selectable
  :headers="[
    { label:'#', key: 'index', align: 'center' },
    { label:'Name', key: 'name' },
    { label: 'Code', key: 'code'  },
    { label: 'Type', key: 'type' },
    { label: 'Area', key: 'areaName' },
    { label: 'Matchday', key: 'matchday' },
  ]"
  :rows="competitions"
>
</MazTable>

<script lang="ts" setup>
  import {competitions} from './competitions.ts'
</script>

## Advanced

## Props & Events emitted

## MazTable

<!--@include: ./../.vitepress/generated-docs/maz-table.doc.md-->

## MazTableCell

<!--@include: ./../.vitepress/generated-docs/maz-table-cell.doc.md-->

## MazTableRow

<!--@include: ./../.vitepress/generated-docs/maz-table-row.doc.md-->

## MazTableTitle

<!--@include: ./../.vitepress/generated-docs/maz-table-title.doc.md-->
