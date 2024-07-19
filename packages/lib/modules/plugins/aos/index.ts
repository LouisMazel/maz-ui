import type { App } from 'vue'
import type { Router } from 'vue-router'
import { sleep } from './../../helpers/sleep'
import { isClient } from './../../helpers/is-client'

export interface AosOptions {
  animation?: {
    delay?: number
    duration?: number
    once?: boolean
  }
  delay?: number
  observer?: IntersectionObserverInit
  router?: Router
}

interface ClassOptions extends Omit<AosOptions, 'router'> {
  animation: {
    delay: number
    duration: number
    once: boolean
  }
  delay: number
  observer: IntersectionObserverInit & {
    rootMargin: string
    threshold: number | number[]
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
    delay: 0,
  },
}

export class AosHandler {
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

  private handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    for (const entry of entries) {
      const target = entry.target as HTMLElement
      const hasChildren = target.getAttribute('data-maz-aos-children') === 'true'
      const animateElements: HTMLElement[] = entry.target.getAttribute('data-maz-aos')
        ? [entry.target as HTMLElement]
        : []

      if (hasChildren) {
        const children = [...document.querySelectorAll('[data-maz-aos-anchor]')].map(child =>
          child.getAttribute('data-maz-aos-anchor') === `#${entry.target.id}` ? child : undefined,
        )

        for (const child of children) {
          if (child) {
            animateElements.push(child as HTMLElement)
          }
        }
      }

      for (const element of animateElements) {
        const once = element.getAttribute('data-maz-aos-once')

        const useOnce: boolean
          = typeof once === 'string' ? once === 'true' : this.options.animation.once

        if (
          typeof this.options.observer.threshold === 'number'
          && entry.intersectionRatio > this.options.observer.threshold
        ) {
          const duration = element.getAttribute('data-maz-aos-duration')
          const delay = element.getAttribute('data-maz-aos-delay')

          if (!duration) {
            element.style.transitionDuration = `${this.options.animation.duration}ms`
            setTimeout(() => {
              element.style.transitionDuration = '0'
            }, 1000)
          }

          if (!delay) {
            element.style.transitionDelay = `${this.options.animation.delay}ms`
            setTimeout(() => {
              element.style.transitionDelay = '0'
            }, 1000)
          }

          element.classList.add('maz-aos-animate')

          if (useOnce) {
            const parentAnchor = element.getAttribute('data-maz-aos-anchor')
            if (parentAnchor) {
              const anchorElement = document.querySelector<HTMLElement>(parentAnchor)
              if (anchorElement) {
                observer.unobserve(anchorElement)
              }
            }

            observer.unobserve(element)
          }
        }
        else {
          element.classList.remove('maz-aos-animate')
        }
      }
    }
  }

  private async handleObserver() {
    await sleep(this.options.delay)

    const observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options.observer)

    for (const element of document.querySelectorAll('[data-maz-aos]')) {
      const anchorAttr = element.getAttribute('data-maz-aos-anchor')
      if (anchorAttr) {
        const anchorElement = document.querySelector(anchorAttr)
        if (anchorElement) {
          anchorElement.setAttribute('data-maz-aos-children', 'true')
          observer.observe(anchorElement)
        }
        else {
          console.warn(`[maz-ui](aos) no element found with selector "${anchorAttr}"`)
        }
      }
      else {
        observer.observe(element)
      }
    }
  }

  public runAnimations() {
    if (isClient()) {
      return this.handleObserver()
    }
    else {
      console.warn('[MazAos](runAnimations) should be executed on client side')
    }
  }
}

let instance: AosHandler

export const plugin = {
  install: (app: App, options?: AosOptions) => {
    instance = new AosHandler(options)

    app.provide('aos', instance)

    if (!isClient()) {
      return
    }
    if (options?.router) {
      options.router.afterEach(async () => {
        instance.runAnimations()
      })
    }
    else {
      instance.runAnimations()
    }
  },
}

export function getInstance(): AosHandler {
  return instance
}
