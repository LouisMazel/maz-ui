import type { App, Component, MaybeRefOrGetter } from 'vue'
import type { MazDialogConfirmProps } from '../../components/MazDialogConfirm.vue'
import MazDialogConfirm from '../../components/MazDialogConfirm.vue'
import { useMazDialogConfirm } from '../../components/MazDialogConfirm/useMazDialogConfirm'
import { useMountComponent } from '../../composables/useMountComponent'
import { createReactiveDialog, isReactiveSource } from './createReactiveDialog'

type DialogButtonProps = MazDialogConfirmProps['acceptProps']

export type DialogOptions = Partial<Omit<MazDialogConfirmProps, 'modelValue' | 'variant' | 'justify' | 'acceptProps' | 'rejectProps'>> & {
  /**
   * Props of the accept button, a ref, a getter or a reactive object to update the button while the dialog is open
   */
  acceptProps?: MaybeRefOrGetter<DialogButtonProps>
  /**
   * Props of the reject button, a ref, a getter or a reactive object to update the button while the dialog is open
   */
  rejectProps?: MaybeRefOrGetter<DialogButtonProps>
  /**
   * Component (or functional component / render function) rendered in the body instead of the message.
   * It receives `contentProps`, plus `accept` and `reject` functions.
   */
  content?: Component
  /**
   * Props of the `content` component, a ref, a getter or a reactive object to keep the content up to date
   */
  contentProps?: MaybeRefOrGetter<Record<string, unknown>>
  onClose?: () => unknown
  onAccept?: (response: unknown) => unknown
  onReject?: (response: unknown) => unknown
}
export type DialogConfirmOptions = Omit<DialogOptions, 'onAccept' | 'onReject' | 'onClose'>
type RequiredDialogOptions = DialogOptions & { identifier: string }

const DEFAULT_OPTIONS = {
  identifier: 'main-dialog',
} satisfies RequiredDialogOptions

interface ActiveDialogEntry {
  destroy: () => void
  cleanupTimer?: ReturnType<typeof setTimeout>
  onDispose?: () => void
}

export class DialogHandler {
  private activeDialogs = new Map<string, ActiveDialogEntry>()

  constructor(
    private readonly app: App,
    readonly globalOptions: DialogOptions = DEFAULT_OPTIONS,
  ) {}

  /**
   * Open a confirmation dialog and wait for the choice of the user
   * @returns a promise resolved with `true` on accept, and `false` on reject, close (button, escape, backdrop, programmatic), destroy or replacement by a dialog with the same identifier. It never rejects.
   */
  public confirm(options: DialogConfirmOptions = {}): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.mount(
        {
          ...options,
          onAccept: () => resolve(true),
          onReject: () => resolve(false),
          onClose: () => resolve(false),
        },
        () => resolve(false),
      )
    })
  }

  public open(options: DialogOptions) {
    return this.mount(options)
  }

  private mount(options: DialogOptions, onDispose?: () => void) {
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
      existing.onDispose?.()
      existing.destroy()
      this.activeDialogs.delete(props.identifier)
    }

    const isReactive = !!props.content
      || isReactiveSource(props.acceptProps)
      || isReactiveSource(props.rejectProps)

    const { destroy, vNode } = isReactive
      ? useMountComponent(
          createReactiveDialog({ props, content: props.content, contentProps: props.contentProps }),
          { app: this.app },
        )
      : useMountComponent<typeof MazDialogConfirm, MazDialogConfirmProps>(MazDialogConfirm, {
          props: props as MazDialogConfirmProps,
          app: this.app,
        })

    const entry: ActiveDialogEntry = { destroy, onDispose }
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
