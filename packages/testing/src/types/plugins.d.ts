import { ToasterHandler } from 'maz-ui'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToasterHandler
  }
}
