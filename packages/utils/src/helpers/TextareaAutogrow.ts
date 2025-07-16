import { debounce } from './debounce'

export class TextareaAutogrow {
  private element: HTMLTextAreaElement

  constructor(element: HTMLTextAreaElement) {
    this.element = element
    this.onFocus = this.onFocus.bind(this)
    this.autogrow = this.autogrow.bind(this)
    this.onResize = debounce(this.onResize.bind(this), 200)
    this.connect()
  }

  private connect() {
    this.element.addEventListener('focus', this.onFocus)
    this.element.style.resize = 'none'
    this.element.style.boxSizing = 'border-box'
  }

  public disconnect() {
    window.removeEventListener('resize', this.onResize)
    this.element.removeEventListener('input', this.autogrow)
  }

  private onFocus() {
    this.autogrow()
    this.element.addEventListener('input', this.autogrow)
    window.addEventListener('resize', this.onResize)
    this.element.removeEventListener('focus', this.onFocus)
  }

  private onResize() {
    this.autogrow()
  }

  private autogrow() {
    this.element.style.height = 'auto'
    this.element.style.overflow = 'hidden'
    this.element.style.height = `${this.element.scrollHeight}px`
  }
}
