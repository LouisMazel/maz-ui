export class ToasterTimer {
  callback: () => unknown
  delay: number
  timer: ReturnType<typeof setTimeout>
  startedAt: number

  constructor(callback: () => unknown, delay: number) {
    this.startedAt = Date.now()
    this.callback = callback
    this.delay = delay
    this.start()
  }

  pause() {
    this.stop()
    this.delay -= Date.now() - this.startedAt
  }

  resume() {
    this.startedAt = Date.now()
    this.start()
  }

  start() {
    this.timer = setTimeout(this.callback, this.delay)
  }

  stop() {
    clearTimeout(this.timer)
  }
}
