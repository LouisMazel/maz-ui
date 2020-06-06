<template>
  <div class="maz-read-more-doc">
    <ComponentContainer :code="codeExample">
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
          { label: 'Home', name: 'Home' },
          { label: 'Documentation', name: 'Documentation' },
          { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' },
          { label: 'Responsive Menu Doc', name: 'MazResponsiveMenuDoc' }
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
        { label: 'Home', name: 'Home' },
        { label: 'Documentation', name: 'Documentation' },
        { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' },
        { label: 'Responsive Menu Doc', name: 'MazResponsiveMenuDoc' }
      ],
      codeExample: `<template>
  <MazResponsiveMenu
    :routes="routes"
  />
</template>

export default {
  data () {
    return {
      routes: [
        { label: 'Home', name: 'Home' },
        { label: 'Documentation', name: 'Documentation' },
        { label: 'Mad with Maz Ui', name: 'MadeWithMazUi' },
        { label: 'Responsive Menu Doc', name: 'MazResponsiveMenuDoc' }
      ]
    }
  }
}`
    }
  }
}
</script>
