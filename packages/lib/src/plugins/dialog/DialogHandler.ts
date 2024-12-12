import type { App } from 'vue'
import MazDialogPromise, { type MazDialogPromiseProps } from '@components/MazDialogPromise.vue'
import { useMazDialogPromise } from '@components/MazDialogPromise/useMazDialogPromise'
import { mount } from '@helpers/mountComponent'

export type DialogOptions = Partial<Omit<MazDialogPromiseProps, 'modelValue'>> & {
  promiseCallback?: () => unknown
}
type RequiredDialogOptions = DialogOptions & { identifier: string }

const DEFAULT_OPTIONS = {
  identifier: 'main-dialog',
} satisfies RequiredDialogOptions

export class DialogHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions: DialogOptions = DEFAULT_OPTIONS,
  ) {}

  public open(options: DialogOptions) {
    const props: RequiredDialogOptions = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
    }

    const { destroy, vNode } = mount<typeof MazDialogPromise, MazDialogPromiseProps>(MazDialogPromise, {
      props,
      app: this.app,
    })

    const { showDialogAndWaitChoice } = useMazDialogPromise()

    function close(): void {
      vNode.component?.exposed?.close()
      props.promiseCallback?.()

      setTimeout(() => {
        destroy()
      }, 700)
    }

    const promise = showDialogAndWaitChoice(props.identifier, () => {
      close()
    })

    return {
      promise,
      destroy,
      close,
    }
  }
}
