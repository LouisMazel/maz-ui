import MazChart from '@package/components/MazChart.vue'
import { mount, shallowMount } from '@vue/test-utils'

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

describe('MazChart', () => {
  test('Should match wtesth the snapshot', () => {
    const wrapper = shallowMount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders correctly and emits event on click', async () => {
    const width = '300px'
    const height = '300px'
    const locale = 'fr-FR'

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

    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type,
        width,
        height,
        locale,
      },
    })

    expect(wrapper.exists()).toBeTruthy()
    const canvas = wrapper.find('canvas')
    await canvas.trigger('click')
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
