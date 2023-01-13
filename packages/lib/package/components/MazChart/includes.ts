export const chartJsEventNames = [
  'install',
  'start',
  'stop',
  'beforeInit',
  'afterInit',
  'beforeUpdate',
  'afterUpdate',
  'beforeElementsUpdate',
  'reset',
  'beforeDatasetsUpdate',
  'afterDatasetsUpdate',
  'beforeDatasetUpdate',
  'afterDatasetUpdate',
  'beforeLayout',
  'afterLayout',
  'afterLayout',
  'beforeRender',
  'afterRender',
  'resize',
  'destroy',
  'uninstall',
  'afterTooltipDraw',
  'beforeTooltipDraw',
]

export function generateEventObject(type: string, chartRef?: HTMLCanvasElement) {
  //chart js allows some events to be cancelled if they return false
  //this implements familiar logic to allow vue emitted chart events to be canceled
  return {
    type,
    chartRef,
    preventDefault() {
      this._defaultPrevented = true
    },
    isDefaultPrevented() {
      return !this._defaultPrevented
    },
    _defaultPrevented: false,
  }
}

export function generateChartJsEventListener(
  emit: (event: string, ...args: unknown[]) => void,
  event: ReturnType<typeof generateEventObject>,
) {
  return {
    [event.type]: () => {
      emit(event.type, event)
      return event.isDefaultPrevented()
    },
  }
}
