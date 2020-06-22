<template>
  <div class="maz-collapse-doc">
    <h3>
      Examples
    </h3>

    <ComponentContainer :code="codeLight">
      <MazCollapse class="maz-mb-5">
        <div slot="header-text">
          Standalone collapse
        </div>
        <div class="maz-p-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </MazCollapse>

      <MazCollapse v-model="hasCollapseOpen">
        <div slot="header-text">
          Programmatically collapse 2
        </div>
        <div class="maz-p-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </MazCollapse>

      <MazBtn
        class="maz-mt-3"
        @click="hasCollapseOpen = !hasCollapseOpen"
      >
        Toggle collapse 2
      </MazBtn>
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
      class="maz-mb-0"
      code="<template>
  <MazCollapse class=&quot;maz-mb-5&quot;>
    <div slot=&quot;header-text&quot;>
      Standalone collapse
    </div>
    <div class=&quot;maz-p-4&quot;>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
  </MazCollapse>
</template>

<script>
  import { MazCollapse } from 'maz-ui'
  export default {
    components: { MazCollapse }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazCollapseDoc',
  data () {
    return {
      hasCollapseOpen: true,
      codeLight: `<MazCollapse class="maz-mb-5">
  <div slot="header-text">
    Standalone collapse
  </div>
  <div class="maz-p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>

<MazCollapse v-model="hasCollapseOpen">
  <div slot="header-text">
    Programmatically collapse 2
  </div>
  <div class="maz-p-4">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </div>
</MazCollapse>

<MazBtn
  class="mt-3"
  @click="hasCollapseOpen = !hasCollapseOpen"
>
  Open Collapse 2
</MazBtn>

export default {
  data () {
    return {
      hasCollapseOpen: true
    }
  }
}`
    }
  }
}
</script>
