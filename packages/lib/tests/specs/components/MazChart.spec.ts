import MazChart from '@components/MazChart.vue'
import { mount } from '@vue/test-utils'

vi.mock('vue-chartjs', () => {
  const createMockChart = (name: string) => ({
    name,
    props: ['data', 'options', 'plugins', 'datasetIdKey', 'updateMode'],
    template: `<canvas class="chart-canvas"></canvas>`,
  })

  return {
    Doughnut: createMockChart('Doughnut'),
    Bar: createMockChart('Bar'),
    Line: createMockChart('Line'),
    Pie: createMockChart('Pie'),
    PolarArea: createMockChart('PolarArea'),
    Radar: createMockChart('Radar'),
    Scatter: createMockChart('Scatter'),
    Bubble: createMockChart('Bubble'),
  }
})

const pieChart = {
  type: 'doughnut',
  data: {
    labels: [`Perfects - ${40}%`, `Bons - ${35}%`, `Mauvais - ${25}%`],
    datasets: [
      {
        backgroundColor: ['#fcb731', 'rgb(28 209 161)', 'rgb(255, 109, 106)'],
        data: [40, 35, 25],
      },
    ],
  },
}

describe('mazChart', () => {
  it('should render the chart component with correct props', async () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('data')).toEqual(pieChart.data)
    expect(wrapper.props('type')).toBe(pieChart.type)

    // Test that the async component starts loading
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.html()).toContain('chart-canvas')
  })
})
