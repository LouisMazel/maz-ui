import { mount } from '../../helpers/mount-component'
import type { App } from 'vue'
import MazToast, { type Props } from './MazToast.vue'
import type { ToasterOptions } from './types'

export interface LocalToasterOptions extends ToasterOptions {
  type: 'success' | 'info' | 'warning' | 'danger' | 'theme'
}

const DEFAULT_OPTIONS: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
}

export class ToasterHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions?: ToasterOptions,
  ) {}

  private show(message: string, options: LocalToasterOptions) {
    const propsData: Props = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
      message,
    }

    const { destroy, vNode } = mount(MazToast, {
      props: propsData,
      app: this.app,
    })

    return {
      destroy,
      close: () => vNode.component?.exposed?.close(),
    }
  }

  private getLocalOptions(
    type: LocalToasterOptions['type'],
    options?: ToasterOptions,
  ): LocalToasterOptions {
    return {
      type,
      ...options,
    }
  }

  message(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('theme', options))
  }

  success(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('success', options))
  }

  error(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('danger', options))
  }

  info(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('info', options))
  }

  warning(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('warning', options))
  }
}
