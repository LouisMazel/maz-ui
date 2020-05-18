<template>
  <div class="maz-plotly-doc">
    <ComponentContainer>
      <MazPlotly
        :data="data"
        :layout="layout"
        :display-mode-bar="false"
      />
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
  <MazPlotly
    :data=&quot;data&quot;
    :layout=&quot;layout&quot;
    :display-mode-bar=&quot;false&quot;
  />
</template>

<script>
  import { MazPlotly } from 'maz-ui'
  export default {
    components: { MazPlotly }
    data () {
      return {
        data: [{
          x: [1, 2, 3, 4],
          y: [10, 11, 12, 13],
          mode: 'markers',
          marker: {
            size: [40, 60, 80, 100]
          }
        }],
        layout:{
          title: 'Marker Size'
        }
      }
    }
  }
</script>"
    />
  </div>
</template>

<script>
export default {
  name: 'MazPlotlyDoc',
  data () {
    return {
      data: [{
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        mode: 'markers',
        marker: {
          size: [40, 60, 80, 100]
        }
      }],
      layout:{
        title: 'Marker Size'
      }
    }
  }
}
</script>
