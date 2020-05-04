<template>
  <div class="maz-tabs-layout-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <MazTabsBar
        v-model="activeTabIndex"
        :items="tabs"
      />
      <div style="overflow: hidden;">
        <MazTabsContent class="m-3">
          <MazTabsContentItem
            class="flex flex-center direction-column"
          >
            <p>Text content 1</p>
          </MazTabsContentItem>
          <MazTabsContentItem
            class="flex flex-center direction-column"
          >
            <p>Text content 2</p>
            <p>Text content 2</p>
          </MazTabsContentItem>
          <MazTabsContentItem
            class="flex flex-center direction-column"
          >
            <p>Text content 3</p>
            <p>Text content 3</p>
            <p>Text content 3</p>
          </MazTabsContentItem>
          <MazTabsContentItem
            class="flex flex-center direction-column"
          >
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
          </MazTabsContentItem>
          <MazTabsContentItem
            class="flex flex-center direction-column"
          >
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
          </MazTabsContentItem>
        </MazTabsContent>
      </div>
    </ComponentContainer>
  </div>
</template>

<script>
  export default {
    name: 'MazTabsLayoutDoc',
    data () {
      return {
        activeTabIndex: 0,
        tabs: [
          { label: 'First Tab' },
          { label: 'Second Tab' },
          { label: 'Third Tab' },
          { label: 'Fourth Tab' },
          { label: 'Disabled Tab', disabled: true }
        ],
        codeExample: `<template>
  <MazTabsBar
    v-model="activeTabIndex"
    :items="tabs"
  />
  <div style="overflow: hidden;">
    <MazTabsContent class="m-3">
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>Text content 1</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>Text content 2</p>
        <p>Text content 2</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>Text content 3</p>
        <p>Text content 3</p>
        <p>Text content 3</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>Text content 4</p>
        <p>Text content 4</p>
        <p>Text content 4</p>
        <p>Text content 4</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>Text content 5</p>
        <p>Text content 5</p>
        <p>Text content 5</p>
        <p>Text content 5</p>
        <p>Text content 5</p>
      </MazTabsContentItem>
    </MazTabsContent>
  </div>
</template>

import { MazTabsBar, MazTabsContent, MazTabsContentItem } from 'maz-ui'

export default {
  components: {
    MazTabsBar,
    MazTabsContent,
    MazTabsContentItem
  },
  data () {
    return {
      activeTabIndex: 0,
      tabs: [
        { label: 'First Tab' },
        { label: 'Second Tab' },
        { label: 'Third Tab' },
        { label: 'Fourth Tab' },
        { label: 'Disabled Tab', disabled: true }
      ]
    }
  }
}`
      }
    }
  }
</script>
