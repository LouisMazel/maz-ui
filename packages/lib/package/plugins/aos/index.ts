import { isClient } from '@package/helpers/is-client'
import type { App } from 'vue'
import type { Router } from 'vue-router'

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface AosOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routerHook?: (args: any) => () => void
  router?: Router
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
    duration: 300,
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

  public runAnimations() {
    if (isClient()) {
      return this.handleObserver()
    } else {
      console.warn('[MazAos](runAnimations) should be executed on client side')
    }
  }

  private async handleObserver() {
    await sleep(this.options.delay)

    const observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      ...this.options.observer,
    })

    for (const element of document.querySelectorAll('[data-maz-aos]')) {
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
    }
  }

  private handleIntersect(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) {
    for (const entry of entries) {
      const target = entry.target as HTMLElement
      const hasChildren =
        target.getAttribute('data-maz-aos-children') === 'true'
      const animateElements: HTMLElement[] = entry.target.getAttribute(
        'data-maz-aos',
      )
        ? [entry.target as HTMLElement]
        : []

      if (hasChildren) {
        const children = [
          ...document.querySelectorAll('[data-maz-aos-anchor]'),
        ].map((child) =>
          child.getAttribute('data-maz-aos-anchor') === `#${entry.target.id}`
            ? child
            : undefined,
        )

        for (const child of children) {
          if (child) {
            animateElements.push(child as HTMLElement)
          }
        }
      }

      for (const element of animateElements) {
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
      }
    }
  }
}

export let instance: AosHandler

export const plugin = {
  install: (app: App, options?: AosOptions) => {
    instance = new AosHandler(options)

    app.provide('aos', instance)

    if (options?.router) {
      options.router.afterEach(async () => {
        instance.runAnimations()
      })
    } else {
      instance.runAnimations()
    }
  },
}

export { AosHandler }
