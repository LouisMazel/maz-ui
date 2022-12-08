export {
  plugin as installToaster,
  ToasterHandler,
  type ToasterOptions,
  type ToasterPositions,
} from './toaster'

export {
  plugin as installWait,
  WaitHandler,
  instance as waitInstance,
} from './wait'

export { plugin as installAos, instance as aosInstance } from './aos'
export { AosHandler, type AosOptions } from './aos'
