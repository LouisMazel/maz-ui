export {
  ToasterHandler,
  installToaster,
  type ToasterOptions,
  type ToasterPosition,
  type ToasterPositions,
} from './toaster'

export { WaitHandler, plugin as installWait, instance as waitInstance } from './wait'

export { AosHandler, plugin as installAos, getInstance as getAosInstance, type AosOptions } from './aos'
