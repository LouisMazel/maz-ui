import type { App } from 'vue'
import type { MazDialogConfirmProps } from '../../components/MazDialogConfirm.vue'
import MazDialogConfirm from '../../components/MazDialogConfirm.vue'
import { useMazDialogConfirm } from '../../components/MazDialogConfirm/useMazDialogConfirm'
import { useMountComponent } from '../../composables/useMountComponent'

export type DialogOptions = Partial<Omit<MazDialogConfirmProps, 'modelValue' | 'variant' | 'justify'>> & {
  onClose?: () => unknown
  onAccept?: (response: unknown) => unknown
  onReject?: (response: unknown) => unknown
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

    const { destroy, vNode } = useMountComponent<typeof MazDialogConfirm, MazDialogConfirmProps>(MazDialogConfirm, {
      props,
      app: this.app,
    })

    const { showDialogAndWaitChoice } = useMazDialogConfirm()

    function close(): void {
      if (!vNode.component?.exposed?.isActive?.value) {
        return
      }

      vNode.component?.exposed?.close()
      props.onClose?.()

      setTimeout(() => {
        destroy()
      }, 700)
    }

    async function runDialog() {
      try {
        const response = await showDialogAndWaitChoice(props.identifier)
        if (props.onAccept) {
          props.onAccept(response)
        }
      }
      catch (error) {
        const response = error
        if (props.onReject) {
          props.onReject(response)
        }
      }
    }

    runDialog()

    return {
      destroy,
      close,
    }
  }
}
