import type { App } from 'vue'
import type { MazDialogPromiseProps } from '../../components/MazDialogPromise.vue'
import { defineAsyncComponent } from 'vue'
import { useMazDialogPromise } from '../../components/MazDialogPromise/useMazDialogPromise'
import { useMountComponent } from '../../composables/useMountComponent'

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
    readonly globalOptions: DialogOptions = DEFAULT_OPTIONS,
  ) {}

  public open(options: DialogOptions) {
    const props: RequiredDialogOptions = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
    }

    const MazDialogPromise = defineAsyncComponent(() => import('../../components/MazDialogPromise.vue'))

    const { destroy, vNode } = useMountComponent<typeof MazDialogPromise, MazDialogPromiseProps>(MazDialogPromise, {
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
