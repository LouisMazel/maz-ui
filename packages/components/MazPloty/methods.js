import Plotly from 'plotly.js-dist'

const plotlyFunctions = ['restyle', 'relayout', 'update', 'addTraces', 'deleteTraces', 'moveTraces', 'extendTraces', 'prependTraces', 'purge']

const methods = plotlyFunctions.reduce((all, functionName) => {
  all[functionName] = function (...args) {
    return Plotly[functionName].apply(Plotly, [this.$el, ...args])
  }
  return all
}, {})

export default methods
