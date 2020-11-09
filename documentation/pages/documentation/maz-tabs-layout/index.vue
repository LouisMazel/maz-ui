<template>
  <div class="maz-tabs-layout-doc">
    <ComponentContainer :code="codeExample">
      <MazTabsBar
        v-model="activeTab"
        :items="tabs"
      />
      <MazTabsContent>
        <MazTabsContentItem
          class="maz-p-3 maz-text-center"
        >
          <p>Text content 1</p>
        </MazTabsContentItem>
        <MazTabsContentItem
          class="maz-p-3 maz-text-center"
        >
          <p>Text content 2</p>
          <p>Text content 2</p>
        </MazTabsContentItem>
        <MazTabsContentItem
          class="maz-p-3 maz-text-center"
        >
          <p>Text content 3</p>
          <p>Text content 3</p>
          <p>Text content 3</p>
        </MazTabsContentItem>
        <MazTabsContentItem
          class="maz-p-3 maz-text-center"
        >
          <p>Text content 4</p>
          <p>Text content 4</p>
          <p>Text content 4</p>
          <p>Text content 4</p>
        </MazTabsContentItem>
        <MazTabsContentItem
          class="maz-p-3 maz-text-center"
        >
          <p>Text content 5</p>
          <p>Text content 5</p>
          <p>Text content 5</p>
          <p>Text content 5</p>
          <p>Text content 5</p>
        </MazTabsContentItem>
      </MazTabsContent>
    </ComponentContainer>

    <!-- <ComponentContainer
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
    ...
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
    </ComponentContainer>

    <ComponentContainer
      code="<template>
  <MazTabsContent :active-tab=&quot;stepper&quot;>
    <MazTabsContentItem class=&quot;maz-p-3 maz-text-center&quot;>
      <p>Text content 1</p>
    </MazTabsContentItem>
    <MazTabsContentItem class=&quot;maz-p-3 maz-text-center&quot;>
      <p>Text content 2</p>
      <p>Text content 2</p>
    </MazTabsContentItem>
    <MazTabsContentItem class=&quot;maz-p-3 maz-text-center&quot;>
      <p>Text content 3</p>
      <p>Text content 3</p>
      <p>Text content 3</p>
    </MazTabsContentItem>
  </MazTabsContent>
  <div class=&quot;maz-flex-center maz-flex maz-mt-4&quot;>
    <MazStepper
      v-model=&quot;stepper&quot;
      :steps=&quot;3&quot;
      :size=&quot;12&quot;
      style=&quot;width: 100px;&quot;
    />
  </div>
</template>

<script>
  import { MazTabsContent, MazTabsContentItem } from 'maz-ui'
  export default {
    components: { MazTabsContent, MazTabsContentItem },
    data () {
      return {
        stepper: 1
      }
    }
  }
</script>"
    >
      <h3>
        Without tabs bar (use :active-tab="Number")
      </h3>
      <h4 class="maz-mb-3">
        Example with MazStepper
      </h4>
      <MazTabsContent :active-tab="stepper">
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
      </MazTabsContent>
      <div class="maz-flex-center maz-flex maz-mt-4">
        <MazStepper
          v-model="stepper"
          :steps="3"
          :size="12"
          style="width: 100px;"
        />
      </div>
    </ComponentContainer> -->

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
      activeTab: 2,
      stepper: 3,
      tabs: [
        { label: 'First Tab' },
        { label: 'Second Tab' },
        { label: 'Third Tab' },
        { label: 'Fourth Tab' },
        { label: 'Disabled Tab', disabled: true }
      ],
      codeExample: `<template>
  <MazTabsBar
    v-model="activeTab"
    :items="tabs"
  />
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
      activeTab: 0,
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