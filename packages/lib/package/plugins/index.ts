export { plugin as installToaster, ToasterHandler } from './toaster'
export type { ToasterOptions, ToasterPositions } from './toaster'

export {
  plugin as installWait,
  WaitHandler,
  instance as waitInstance,
} from './wait'

export { plugin as installAos, instance as aosInstance } from './aos'
export type { AosHandler, AosOptions } from './aos'
