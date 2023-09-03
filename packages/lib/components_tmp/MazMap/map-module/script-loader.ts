export interface ScriptOptions {
  [key: string]: string | string[] | undefined
  language?: string
  region?: string
  libraries?: string[]
}

const DEFAULT_SCRIPT_OPTIONS = {
  language: 'fr',
  region: 'fr',
}

interface IWindow extends Window {
  onInitialized?: () => void
}

export class ScriptLoader {
  private readonly scriptOptions: ScriptOptions
  private resolveScript: (value: typeof google) => void
  public api: typeof google

  constructor(
    private readonly apiKey: string,
    private readonly options?: ScriptOptions,
  ) {
    if (typeof window === 'undefined')
      throw new TypeError('[NMap ScriptLoader]: Map is supported only on browser side')

    this.scriptOptions = {
      ...DEFAULT_SCRIPT_OPTIONS,
      ...this.options,
    }
  }

  private getUrl(): string {
    try {
      const { apiKey, scriptOptions } = this
      const queries: string[] = []

      if (!apiKey) throw String('the google maps api key should be defined')

      for (const name in scriptOptions) {
        let value = scriptOptions[name]

        if (name === 'libraries' && Array.isArray(value)) {
          value = value.join(',')
        }

        queries.push(`${name}=${value}`)
      }

      return `https://maps.googleapis.com/maps/api/js?callback=onInitialized&key=${apiKey}&${queries.join(
        '&',
      )}`
    } catch (error) {
      throw new Error(`[NMap]: ${error}`)
    }
  }

  public init(): Promise<typeof google> {
    if (window.google !== undefined) {
      this.api = window.google
      return Promise.resolve(window.google)
    }

    const vm: IWindow = window
    vm.onInitialized = () => {
      this.api = window.google
      this.resolveScript(window.google)
    }

    return new Promise((resolve, reject) => {
      this.resolveScript = resolve
      const script = document.createElement('script')
      script.src = this.getUrl()
      script.async = true
      script.addEventListener('error', (error) => reject(new Error(error.message)))

      document.head.append(script)
    })
  }
}
