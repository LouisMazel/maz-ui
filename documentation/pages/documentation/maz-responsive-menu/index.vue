<template>
  <div class="maz-read-more-doc">
    <ComponentContainer>
      <div class="maz-flex maz-justify-end">
        <MazResponsiveMenu :routes="routes" />
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
  <MazResponsiveMenu
    :routes=&quot;routes&quot;
  />
</template>

<script>
  import { MazResponsiveMenu } from 'maz-ui'
  export default {
    components: { MazResponsiveMenu }
    data () {
      return {
        routes: [
          { label: 'Home', name: 'index' },
          { label: 'Documentation', name: 'documentation' },
          { label: 'Made with Maz Ui', name: 'made-with-maz-ui' },
          { label: 'Responsive Menu Doc', name: 'documentation-maz-responsive-menu' }
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
  name: 'MazReadMoreDoc',
  data () {
    return {
      routes: [
        { label: 'Home', name: 'index' },
        { label: 'Documentation', name: 'documentation' },
        { label: 'Made with Maz Ui', name: 'made-with-maz-ui' },
        { label: 'Responsive Menu Doc', name: 'documentation-maz-responsive-menu' }
      ]
    }
  }
}
</script>
