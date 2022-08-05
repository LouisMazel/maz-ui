const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AosOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    document.querySelectorAll('[data-maz-aos]').forEach((element) => {
      const anchorAttr = element.getAttribute('data-maz-aos-anchor')
      if (anchorAttr) {
        const anchorElement = document.querySelector(anchorAttr)
        if (anchorElement) {
          anchorElement.setAttribute('data-maz-aos-children', 'true')
          observer.observe(anchorElement)
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `[maz-ui](aos) no element found with selector "${anchorAttr}"`,
          )
        }
      } else {
        observer.observe(element)
      }
    })
  }

  handleIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement
      const hasChildren =
        target.getAttribute('data-maz-aos-children') === 'true'
      const animateElements: HTMLElement[] = entry.target.getAttribute(
        'data-maz-aos',
      )
        ? [entry.target as HTMLElement]
        : []

      if (hasChildren) {
        const children = Array.from(
          document.querySelectorAll('[data-maz-aos-anchor]'),
        ).map((child) =>
          child.getAttribute('data-maz-aos-anchor') === `#${entry.target.id}`
            ? child
            : undefined,
        )

        children.forEach((child) => {
          if (child) {
            animateElements.push(child as HTMLElement)
          }
        })
      }

      animateElements.forEach((element) => {
        const once = element.getAttribute('data-maz-aos-once')

        const useOnce: boolean =
          typeof once === 'string'
            ? once === 'true'
            : this.options.animation.once

        if (entry.intersectionRatio > this.options.observer.threshold) {
          const duration = element.getAttribute('data-maz-aos-duration')

          if (!duration) {
            element.style.transitionDuration = `${this.options.animation.duration}ms`
            setTimeout(() => {
              element.style.transitionDuration = '0'
            }, 1000)
          }

          element.classList.add('maz-aos-animate')

          if (useOnce) {
            observer.unobserve(element)
          }
        } else {
          element.classList.remove('maz-aos-animate')
        }
      })
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
