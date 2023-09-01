export {
  ToasterHandler,
  installToaster,
  toastInstance,
  type ToasterOptions,
  type ToasterPositions,
} from './toaster'

export { WaitHandler, plugin as installWait, instance as waitInstance } from './wait'

export { AosHandler, plugin as installAos, instance as aosInstance, type AosOptions } from './aos'
