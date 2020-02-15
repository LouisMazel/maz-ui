<template>
  <div class="maz-tabs-layout-doc">
    <ComponentContainer
      :code="codeExample"
    >
      <TabsBar
        v-model="activeTabIndex"
        :items="tabs"
      />
      <div style="overflow: hidden;">
        <TabsContent class="m-3">
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>111111111111111111111111111111111111111</p>
          </TabsContentItem>
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>222222222222222222222222222222222222222</p>
            <p>222222222222222222222222222222222222222</p>
          </TabsContentItem>
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>333333333333333333333333333333333333333</p>
            <p>333333333333333333333333333333333333333</p>
            <p>333333333333333333333333333333333333333</p>
          </TabsContentItem>
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>444444444444444444444444444444444444444</p>
            <p>444444444444444444444444444444444444444</p>
            <p>444444444444444444444444444444444444444</p>
            <p>444444444444444444444444444444444444444</p>
          </TabsContentItem>
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>4</p>
            <p>4</p>
            <p>4</p>
            <p>4</p>
            <p>4</p>
          </TabsContentItem>
          <TabsContentItem
            class="flex flex-center direction-column"
          >
            <p>5</p>
            <p>5</p>
            <p>5</p>
            <p>5</p>
            <p>5</p>
            <p>5</p>
          </TabsContentItem>
        </TabsContent>
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
        <p>111111111111111111111111111111111111111</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>222222222222222222222222222222222222222</p>
        <p>222222222222222222222222222222222222222</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>333333333333333333333333333333333333333</p>
        <p>333333333333333333333333333333333333333</p>
        <p>333333333333333333333333333333333333333</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>444444444444444444444444444444444444444</p>
        <p>444444444444444444444444444444444444444</p>
        <p>444444444444444444444444444444444444444</p>
        <p>444444444444444444444444444444444444444</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>4</p>
        <p>4</p>
        <p>4</p>
        <p>4</p>
        <p>4</p>
      </MazTabsContentItem>
      <MazTabsContentItem
        class="flex flex-center direction-column"
      >
        <p>5</p>
        <p>5</p>
        <p>5</p>
        <p>5</p>
        <p>5</p>
        <p>5</p>
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
