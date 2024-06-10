import MazChart from '@components/MazChart.vue'
import { mount } from '@vue/test-utils'

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
  it('should match with  the snapshot', () => {
    const wrapper = mount(MazChart, {
      props: {
        data: pieChart.data,
        type: pieChart.type as any,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
