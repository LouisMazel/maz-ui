import { computed, type ComputedRef, type Ref } from 'vue'

export interface ReadingTimeOptions {
  /** Content to calculate the reading time */
  content?: string | Ref<string>
  /** Selector of the content to calculate the reading time */
  contentSelector?: string | Ref<string>
  /** Ref of the content to calculate the reading time */
  contentRef?: Ref<HTMLElement | undefined>
  /**
   * Words per minute
   * @default 150
   */
  velocity?: number | Ref<number>
}

export interface ReadingTimeReturn {
  /** Content to calculate the reading time */
  content: ComputedRef<string | undefined | null>
  /** Number of words in the content */
  wordCount: ComputedRef<number>
  /** Words per minute */
  velocity: ComputedRef<number>
  /** Reading time in minutes */
  duration: ComputedRef<number>
}

function countWords(text: (string | null | undefined)[]) {
  const words = text.join(', ').match(/\b\w+\b/g)
  return words ? words.length : 0
}

function getReadTimeInMinutes(content?: string | null, velocity = 150) {
  const words = countWords([content])

  return Math.ceil(words / velocity)
}

export function useReadingTime(options: ReadingTimeOptions): ReadingTimeReturn {
  const velocity = computed(() =>
    typeof options.velocity === 'number' ? options.velocity : options.velocity?.value ?? 150,
  )

  const selector = computed(() => {
    return typeof options.contentSelector === 'string'
      ? options.contentSelector
      : options.contentSelector?.value
  })

  const content = computed(() => {
    if (typeof options.contentRef?.value === 'object') {
      return options.contentRef.value?.textContent
    }

    if (selector.value && typeof document !== 'undefined') {
      const contentElement = document.querySelector(selector.value)
      if (contentElement) {
        return contentElement.textContent
      }
    }

    return typeof options.content === 'string' ? options.content : options.content?.value
  })

  const duration = computed(() => {
    return getReadTimeInMinutes(content.value, velocity.value)
  })

  const wordCount = computed(() => countWords([content.value]))

  return {
    content,
    wordCount,
    velocity,
    duration,
  }
}
