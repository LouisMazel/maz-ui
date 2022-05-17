---
title: MazChart
description: MazChart is a standalone input component generate graphics & charts with chart.js
---

# MazChart

To use this component, you have to install the dependency `chart.js`

<NpmBadge package="chart.js" />

<CodeGroup>

  <CodeGroupItem title="NPM" active>

```bash
# install in your project
npm install chart.js
```
  </CodeGroupItem>

  <CodeGroupItem title="YARN">

```bash
# install in your project
yarn add chart.js
```
  </CodeGroupItem>
</CodeGroup>

## Chart.JS Documentation

Show the [Chart.JS](https://www.chartjs.org/docs/latest/) documentation to create your own chart

You can use all plugins of Chart.JS. Follow the example bellow

## Pie chart

<br/>

<MazChart
  :type="pieChart.type"
  :data="pieChart.data"
  :options="pieChart.options"
/>

```vue
<template>
  <MazChart
    :type="pieChart.type"
    :data="pieChart.data"
    :options="pieChart.options"
  />
</template>

<script setup lang="ts">
  import dataLabels from 'chartjs-plugin-datalabels'

  let delayed: boolean

  const animation = {
    onComplete: () => {
      delayed = true
    },
    delay: (context: Record<string, any>) => {
      let delay = 0
      if (context.type === 'data' && context.mode === 'default' && !delayed) {
        delay = context.dataIndex * 100 + context.datasetIndex * 50
      }
      return delay
    },
  }

  const pieChart = {
    type: 'doughnut',
    data: {
      labels: [
        `Perfects - ${40}%`,
        `Bons - ${35}%`,
        `Mauvais - ${25}%`,
      ],
      datasets: [
        {
          backgroundColor: [
            '#fcb731',
            'rgb(28 209 161)',
            'rgb(255, 109, 106)',
          ],
          data: [
            40,
            35,
            25,
          ],
        },
      ],
    },
    options: {
      animation,
    }
  }
</script>
```

## Line chart

<br/>

<MazChart v-bind="{ ...lineChart }" />

```vue
<template>
  <MazChart v-bind="{ ...lineChart }" />
</template>

<script setup lang="ts">
  import dataLabels from 'chartjs-plugin-datalabels'

  let delayed: boolean

  const animation = {
    onComplete: () => {
      delayed = true
    },
    delay: (context: Record<string, any>) => {
      let delay = 0
      if (context.type === 'data' && context.mode === 'default' && !delayed) {
        delay = context.dataIndex * 100 + context.datasetIndex * 50
      }
      return delay
    },
  }

  const lineChart = {
    type: 'line',
    // locally registered and available for this chart
    plugins: [dataLabels],
    data: {
      labels: [1, 2, 3, 4, 5, 6],
      datasets: [
        {
          label: 'Moyenne des bons pronos du groupe',
          data: [10, 15, 20, 25, 30, 35],
          fill: false,
          borderColor: 'rgb(28 209 161)',
          tension: 0.5,
          backgroundColor: '#17a2b8',
        },
        {
          label: 'Vos bons pronos',
          data: [10, 15, 20, 25, 30, 35],
          fill: false,
          borderColor: '#333',
          tension: 0.5,
          backgroundColor: 'dodgerblue',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          backgroundColor: (context: Record<string, any>) => {
            return context.dataset.backgroundColor
          },
          borderRadius: 4,
          color: 'white',
          font: {
            weight: 'bold',
          },
          padding: 6,
        },
      },
      animation,
    }
  }
</script>
```

<script setup lang="ts">
  import dataLabels from 'chartjs-plugin-datalabels'

  let delayed: boolean

  const animation = {
    onComplete: () => {
      delayed = true
    },
    delay: (context: Record<string, any>) => {
      let delay = 0
      if (context.type === 'data' && context.mode === 'default' && !delayed) {
        delay = context.dataIndex * 100 + context.datasetIndex * 50
      }
      return delay
    },
  }

  const pieChart = {
    type: 'doughnut',
    data: {
      labels: [
        `Perfects - ${40}%`,
        `Bons - ${35}%`,
        `Mauvais - ${25}%`,
      ],
      datasets: [
        {
          backgroundColor: [
            '#fcb731',
            'rgb(28 209 161)',
            'rgb(255, 109, 106)',
          ],
          data: [
            40,
            35,
            25,
          ],
        },
      ],
    },
    options: {
      animation,
    }
  }
  const lineChart = {
    type: 'line',
    // locally registered and available for this chart
    plugins: [dataLabels],
    data: {
      labels: [1, 2, 3, 4, 5, 6],
      datasets: [
        {
          label: 'Moyenne des bons pronos du groupe',
          data: [10, 15, 20, 25, 30, 35],
          fill: false,
          borderColor: 'rgb(28 209 161)',
          tension: 0.5,
          backgroundColor: '#17a2b8',
        },
        {
          label: 'Vos bons pronos',
          data: [10, 15, 20, 25, 30, 35],
          fill: false,
          borderColor: '#333',
          tension: 0.5,
          backgroundColor: 'dodgerblue',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          backgroundColor: (context: Record<string, any>) => {
            return context.dataset.backgroundColor
          },
          borderRadius: 4,
          color: 'white',
          font: {
            weight: 'bold',
          },
          padding: 6,
        },
      },
      animation,
    }
  }
</script>

## Props & Events emitted

<ComponentPropDoc component="MazChart" />