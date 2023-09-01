interface IWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ScriptLoaderOptions {
  identifier: string
  src: string
  once?: boolean
  async?: boolean
  defer?: boolean
}

export class ScriptLoader {
  private src: string
  private script?: Event
  private once: boolean
  private async: boolean
  private defer: boolean
  private identifier: string

  constructor({ src, identifier, once = true, async = true, defer = true }: ScriptLoaderOptions) {
    if (typeof window === 'undefined') {
      throw new TypeError('[ScriptLoader]: Is supported only on browser side')
    }

    if (!src) {
      throw new Error('[ScriptLoader]: You should provide the attribut "src"')
    }

    if (!identifier) {
      throw new Error('[ScriptLoader]: You should provide the attribut "identifier"')
    }

    this.src = src
    this.identifier = identifier
    this.once = once
    this.async = async
    this.defer = defer
  }

  public removeTag(tag: Element | string) {
    if (typeof tag === 'string') {
      document.head.querySelector(`[data-identifier="${tag}"]`)?.remove()
    } else {
      tag.remove()
    }
  }

  public load() {
    const windowInstance = window as IWindow

    const scriptTags = document.head.querySelectorAll(`[data-identifier="${this.identifier}"]`)

    if (this.once && windowInstance[this.identifier] && scriptTags.length > 0) {
      this.script = windowInstance[this.identifier]
      return Promise.resolve(this.script)
    }

    if (!this.once && scriptTags.length > 0) {
      for (const tag of scriptTags) {
        this.removeTag(tag)
      }
    }

    return this.injectScript()
  }

  private injectScript() {
    const windowInstance = window as IWindow

    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script')
        script.src = this.src
        script.async = this.async
        script.defer = this.defer
        script.dataset.identifier = this.identifier

        script.addEventListener('error', (error) => {
          return reject(new Error(`[ScriptLoader](injectScript) ${error.message}`))
        })

        script.addEventListener('load', (success) => {
          this.script = success
          windowInstance[this.identifier] = success
          return resolve(success)
        })

        document.head.append(script)
      } catch (error) {
        throw new Error(`[ScriptLoader](init) ${error}`)
      }
    })
  }
}
