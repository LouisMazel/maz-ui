module.exports = (variables) => {
  const root = document.documentElement.style

  Object.entries(variables.light).forEach((values) => {
    root.setProperty(values[0], values[1])
  })

  Object.entries(variables.dark).forEach((values) => {
    root.setProperty(values[0], values[1])
  })
}
