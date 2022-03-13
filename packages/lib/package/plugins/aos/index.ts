const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AosOptions {
  router?: Record<string, any>
  delay?: number
  observer?: IntersectionObserverInit
  animation?: {
    once?: boolean
    duration?: number
  }
}

interface ClassOptions extends Omit<AosOptions, 'router'> {
  delay: number
  observer: IntersectionObserverInit & {
    threshold: number | number[]
    rootMargin: string
  }
  animation: {
    once: boolean
    duration: number
  }
}

const DEFAULT_OPTIONS: ClassOptions = {
  delay: 100,
  observer: {
    root: undefined,
    rootMargin: '0px',
    threshold: 0.2,
  },
  animation: {
    once: true,
    duration: 400,
  },
}

class AosHandler {
  public options: ClassOptions

  constructor(options?: Omit<AosOptions, 'router'>) {
    this.options = {
      delay: options?.delay ?? DEFAULT_OPTIONS.delay,
      observer: {
        ...DEFAULT_OPTIONS.observer,
        ...options?.observer,
      },
      animation: {
        ...DEFAULT_OPTIONS.animation,
        ...options?.animation,
      },
    }
  }

  handleObserver = async () => {
    await sleep(this.options.delay)

    const observer = new IntersectionObserver(this.handleIntersect, {
      ...this.options.observer,
    })

    document.querySelectorAll('[data-maz-aos]').forEach((elem) => {
      observer.observe(elem)
    })
  }

  handleIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement
      const once = target.getAttribute('data-maz-aos-once')
      const useOnce: boolean =
        typeof once === 'string' ? once === 'true' : this.options.animation.once

      if (entry.intersectionRatio > this.options.observer.threshold) {
        const duration = target.getAttribute('data-maz-aos-duration')

        if (!duration) {
          target.style.transitionDuration = `${this.options.animation.duration}ms`
          setTimeout(() => {
            target.style.transitionDuration = '0'
          }, 1000)
        }

        target.classList.add('maz-aos-animate')

        if (useOnce) {
          observer.unobserve(target)
        }
      } else {
        target.classList.remove('maz-aos-animate')
      }
    })
  }
}

let instance: AosHandler

const plugin = {
  install: (_app, options?: AosOptions) => {
    const { ...opts } = options
    instance = new AosHandler(opts)

    if (options?.router) {
      options.router.afterEach(async () => instance.handleObserver())
    } else {
      instance.handleObserver()
    }
  },
}

export { instance, plugin, AosHandler }
