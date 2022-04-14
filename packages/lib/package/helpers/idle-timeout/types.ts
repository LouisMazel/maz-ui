export type IdleTimeoutCallback = ({ isIdle }: { isIdle: boolean }) => void

export interface IdleTimeoutStrictOption {
  element: HTMLElement | Document // element to watch
  timeout: number // in milliseconds
  once: boolean
  immediate: boolean
}

export type IdleTimeoutOptions = Partial<IdleTimeoutStrictOption>
