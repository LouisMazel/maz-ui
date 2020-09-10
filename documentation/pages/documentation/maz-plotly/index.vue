<template>
  <div class="maz-plotly-doc">
    <ComponentContainer>
      <no-ssr>
        <MazPlotly
          :data="data"
          :layout="layout"
          :display-mode-bar="false"
        />
      </no-ssr>
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
          x: [0, 1, 2, 3, 4, 5],
          y: [1.5, 1, 1.3, 0.7, 0.8, 0.9],
          type: 'scatter'
        },{
          x: [0, 1, 2, 3, 4, 5],
          y: [1, 0.5, 0.7, -1.2, 0.3, 0.4],
          type: 'bar'
        }],
        layout:{
          title: 'Line Chart and a Bar Chart'
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
        x: [0, 1, 2, 3, 4, 5],
        y: [1.5, 1, 1.3, 0.7, 0.8, 0.9],
        type: 'scatter'
      },{
        x: [0, 1, 2, 3, 4, 5],
        y: [1, 0.5, 0.7, -1.2, 0.3, 0.4],
        type: 'bar'
      }],
      layout:{
        title: 'Line Chart and a Bar Chart'
      }
    }
  }
}
</script>
