const eventsName = [
  'AfterExport',
  'AfterPlot',
  'Animated',
  'AnimatingFrame',
  'AnimationInterrupted',
  'AutoSize',
  'BeforeExport',
  'ButtonClicked',
  'Click',
  'ClickAnnotation',
  'Deselect',
  'DoubleClick',
  'Framework',
  'Hover',
  'LegendClick',
  'LegendDoubleClick',
  'Relayout',
  'Restyle',
  'Redraw',
  'Selected',
  'Selecting',
  'SliderChange',
  'SliderEnd',
  'SliderStart',
  'Transitioning',
  'TransitionInterrupted',
  'Unhover'
]

const events = eventsName
  .map(evt => evt.toLocaleLowerCase())
  .map(eventName => ({
    completeName: 'plotly_' + eventName,
    handler: context => (...args) => {
      context.$emit.apply(context, [eventName, ...args])
    }
  }))

export default events
