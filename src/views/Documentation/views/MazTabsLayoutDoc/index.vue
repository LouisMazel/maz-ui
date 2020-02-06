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
  import { TabsBar, TabsContent, TabsContentItem } from '@/../packages/components/MazTabsLayout'
  export default {
    name: 'MazTabsLayoutDoc',
    components: {
      TabsBar,
      TabsContent,
      TabsContentItem
    },
    data () {
      return {
        codeExample: `<template>
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
</template>

import { TabsBar, TabsContent, TabsContentItem } from '@/../packages/components/MazTabsLayout'

export default {
  components: {
    TabsBar,
    TabsContent,
    TabsContentItem
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
}`,
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
  }
</script>
