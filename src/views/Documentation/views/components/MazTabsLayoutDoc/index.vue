<template>
  <div class="maz-tabs-layout-doc">
    <ComponentContainer :code="codeExample">
      <MazTabsBar
        v-model="activeTabIndex"
        :items="tabs"
      />
      <div style="overflow: hidden;">
        <MazTabsContent>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 1</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 2</p>
            <p>Text content 2</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 3</p>
            <p>Text content 3</p>
            <p>Text content 3</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
          </MazTabsContentItem>
        </MazTabsContent>
      </div>
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazTabsBar
    :items=&quot;tabs&quot;
    align-left
  />
  <MazTabsContent>
    <MazTabsContentItem>
      <p>Text content 1</p>
    </MazTabsContentItem>
    <MazTabsContentItem>
      <p>Text content 2</p>
      <p>Text content 2</p>
    </MazTabsContentItem>
  </MazTabsContent>
</template>

<script>
  import { MazTabsBar, MazTabsContent, MazTabsContentItem } from 'maz-ui'
  export default {
    components: { MazTabsBar, MazTabsContent, MazTabsContentItem }
    data () {
      return {
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
</script>"
    >
      <h3 class="maz-mb-3">
        Tabs bar align left
      </h3>
      <MazTabsBar
        :items="tabs"
        align-left
      />
      <div style="overflow: hidden;">
        <MazTabsContent>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 1</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 2</p>
            <p>Text content 2</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 3</p>
            <p>Text content 3</p>
            <p>Text content 3</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
            <p>Text content 4</p>
          </MazTabsContentItem>
          <MazTabsContentItem class="maz-p-3 maz-text-center">
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
            <p>Text content 5</p>
          </MazTabsContentItem>
        </MazTabsContent>
      </div>
    </ComponentContainer>

    <hr
      id="howToUseIt"
      class="maz-border-top maz-border-solid maz-border-color maz-my-5"
    >

    <h3>
      How to use it ?
    </h3>

    <CodeContainer
      language="html"
      code="<template>
  <MazTabsBar
    :items=&quot;tabs&quot;
  />
  <MazTabsContent>
    <MazTabsContentItem>
      <p>Text content 1</p>
    </MazTabsContentItem>
    <MazTabsContentItem>
      <p>Text content 2</p>
      <p>Text content 2</p>
    </MazTabsContentItem>
  </MazTabsContent>
</template>

<script>
  import { MazTabsBar, MazTabsContent, MazTabsContentItem } from 'maz-ui'
  export default {
    components: { MazTabsBar, MazTabsContent, MazTabsContentItem }
    data () {
      return {
        tabs: [
          { label: 'First Tab' },
          { label: 'Second Tab' }
        ]
      }
    }
  }
</script>"
    />
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
    <MazTabsContent>
      <MazTabsContentItem class="maz-p-3 maz-text-center">
        <p>Text content 1</p>
      </MazTabsContentItem>
      <MazTabsContentItem class="maz-p-3 maz-text-center">
        <p>Text content 2</p>
        <p>Text content 2</p>
      </MazTabsContentItem>
      <MazTabsContentItem class="maz-p-3 maz-text-center">
        <p>Text content 3</p>
        <p>Text content 3</p>
        <p>Text content 3</p>
      </MazTabsContentItem>
      <MazTabsContentItem class="maz-p-3 maz-text-center">
        <p>Text content 4</p>
        <p>Text content 4</p>
        <p>Text content 4</p>
        <p>Text content 4</p>
      </MazTabsContentItem>
      <MazTabsContentItem class="maz-p-3 maz-text-center">
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
