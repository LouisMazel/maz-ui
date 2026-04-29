import MazChart from '@components/MazChart.vue'
import { mount } from '@vue/test-utils'

const chartInstances: Array<{ data: unknown, options: unknown, update: ReturnType<typeof vi.fn>, destroy: ReturnType<typeof vi.fn> }> = []
const chartCtorCalls: Array<[unknown, Record<string, unknown>]> = []

class ChartCtor {
  data: unknown
  options: unknown
  update = vi.fn()
  destroy = vi.fn()
  static readonly register = vi.fn()

  constructor(canvas: unknown, config: Record<string, unknown>) {
    this.data = config.data
    this.options = config.options
    chartCtorCalls.push([canvas, config])
    chartInstances.push(this)
  }
}

vi.mock('chart.js', () => ({
  Chart: ChartCtor,
  Title: 'Title',
  Tooltip: 'Tooltip',
  Legend: 'Legend',
  Filler: 'Filler',
  BarController: 'BarController',
  BarElement: 'BarElement',
  LineController: 'LineController',
  LineElement: 'LineElement',
  PointElement: 'PointElement',
  PieController: 'PieController',
  DoughnutController: 'DoughnutController',
  ArcElement: 'ArcElement',
  RadarController: 'RadarController',
  PolarAreaController: 'PolarAreaController',
  ScatterController: 'ScatterController',
  BubbleController: 'BubbleController',
  CategoryScale: 'CategoryScale',
  LinearScale: 'LinearScale',
  RadialLinearScale: 'RadialLinearScale',
}))

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
  beforeEach(() => {
    chartInstances.length = 0
    chartCtorCalls.length = 0
    ChartCtor.register.mockClear()
  })

  it('renders a canvas with the m-chart class', () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
    expect(canvas.classes()).toContain('m-chart')
  })

  it('lazy-loads chart.js, registers only the modules needed for the type, and instantiates the chart on mount', async () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })

    await vi.dynamicImportSettled()

    expect(ChartCtor.register).toHaveBeenCalledTimes(1)
    const registered = ChartCtor.register.mock.calls[0]
    expect(registered).toContain('DoughnutController')
    expect(registered).toContain('ArcElement')
    expect(registered).not.toContain('BarController')
    expect(registered).not.toContain('CategoryScale')

    expect(chartCtorCalls).toHaveLength(1)
    const [canvas, config] = chartCtorCalls[0]
    expect(canvas).toBe(wrapper.find('canvas').element)
    expect(config.type).toBe('doughnut')
    expect(config.data).toEqual(pieChart.data)
  })

  it('updates the chart when data changes and uses the configured updateMode', async () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
        updateMode: 'reset',
      },
    })

    await vi.dynamicImportSettled()
    const instance = chartInstances[0]

    await wrapper.setProps({
      data: { ...pieChart.data, datasets: [{ ...pieChart.data.datasets[0], data: [10, 20, 30] }] },
    })

    expect(instance.update).toHaveBeenCalledWith('reset')
  })

  it('defaults updateMode to "none" so data changes do not animate', async () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })

    await vi.dynamicImportSettled()
    const instance = chartInstances[0]

    await wrapper.setProps({
      data: { ...pieChart.data, datasets: [{ ...pieChart.data.datasets[0], data: [1, 2, 3] }] },
    })

    expect(instance.update).toHaveBeenCalledWith('none')
  })

  it('destroys the chart on unmount', async () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })

    await vi.dynamicImportSettled()
    const instance = chartInstances[0]

    wrapper.unmount()

    expect(instance.destroy).toHaveBeenCalledTimes(1)
  })
})
