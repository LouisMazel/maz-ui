---
title: MazChart
description: MazChart is a standalone component which generates graphics & charts with chart.js
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Documentation

Follow the [Chart.JS](https://www.chartjs.org/docs/latest/) documentation to create your own chart.

You can also check the documentation and [examples of vue-chartjs](https://vue-chartjs.org/examples/)

You can use all the plugins of Chart.JS. Follow the examples below.

## Bar chart

<MazChart
  v-bind="{ ...barChart }"
/>

::: details View code

```vue
<script setup lang="ts">
import dataLabels from 'chartjs-plugin-datalabels'

const barChart = {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  },
}
</script>

<template>
  <MazChart
    :type="barChart.type"
    :data="barChart.data"
    :options="barChart.options"
  />
</template>
```

:::

## Pie chart

<br/>

<MazChart
  :type="pieChart.type"
  :data="pieChart.data"
  :options="pieChart.options"
/>

::: details View code

```vue
<script setup lang="ts">
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
}
</script>

<template>
  <MazChart
    :type="pieChart.type"
    :data="pieChart.data"
  />
</template>
```

:::

## Line chart

<br/>

<MazChart v-bind="lineChart" />

::: details View code

```vue
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
        backgroundColor: '#1e90ff',
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

<template>
  <MazChart v-bind="lineChart" />
</template>
```

:::

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
        delay = context.dataIndex *100 + context.datasetIndex* 50
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
          data: [20, 15, 15, 30, 22, 40],
          fill: false,
          borderColor: '#333',
          tension: 0.5,
          backgroundColor: '#1e90ff',
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

  const barChart = {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    },
  }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-chart.doc.md-->

## Types

### ChartProps

Follow this link to see the type definitions: [vue-chartjs/src/types.ts](https://github.com/apertureless/vue-chartjs/blob/main/src/types.ts#L12)
