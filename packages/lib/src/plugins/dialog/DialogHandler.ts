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

interface ActiveDialogEntry {
  destroy: () => void
  cleanupTimer?: ReturnType<typeof setTimeout>
}

export class DialogHandler {
  private activeDialogs = new Map<string, ActiveDialogEntry>()

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

    const { removeDialogFromState } = useMazDialogConfirm()

    // Destroy any existing dialog with the same identifier to prevent duplicates
    const existing = this.activeDialogs.get(props.identifier)
    if (existing) {
      if (existing.cleanupTimer) {
        clearTimeout(existing.cleanupTimer)
      }
      removeDialogFromState(props.identifier)
      existing.destroy()
      this.activeDialogs.delete(props.identifier)
    }

    const { destroy, vNode } = useMountComponent<typeof MazDialogConfirm, MazDialogConfirmProps>(MazDialogConfirm, {
      props,
      app: this.app,
    })

    const entry: ActiveDialogEntry = { destroy }
    this.activeDialogs.set(props.identifier, entry)

    const { showDialogAndWaitChoice } = useMazDialogConfirm()

    const scheduleDestroy = () => {
      const timer = setTimeout(() => {
        // Only destroy if this entry is still the active one for this identifier
        if (this.activeDialogs.get(props.identifier) === entry) {
          destroy()
          this.activeDialogs.delete(props.identifier)
        }
      }, 700)
      entry.cleanupTimer = timer
    }

    const close = (): void => {
      if (!vNode.component?.exposed?.isActive?.value) {
        return
      }

      vNode.component?.exposed?.close()
      props.onClose?.()
      scheduleDestroy()
    }

    const runDialog = async () => {
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
      finally {
        scheduleDestroy()
      }
    }

    runDialog()

    return {
      destroy: () => {
        if (entry.cleanupTimer) {
          clearTimeout(entry.cleanupTimer)
        }
        destroy()
        if (this.activeDialogs.get(props.identifier) === entry) {
          this.activeDialogs.delete(props.identifier)
        }
      },
      close,
    }
  }
}
