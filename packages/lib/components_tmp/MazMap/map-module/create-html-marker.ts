interface OffsetPosition {
  x: number
  y: number
}

export interface HTMLMarker extends google.maps.OverlayView {
  remove(): void
  getPosition(): google.maps.LatLng | null | undefined
  getDraggable(): boolean
}

export const createHTMLMarker = (options: {
  api: typeof google
  map: google.maps.Map
  templateHtml: string
  position: google.maps.LatLng | google.maps.LatLngLiteral
  offset?: OffsetPosition
}): HTMLMarker => {
  class HTMLMarker extends google.maps.OverlayView {
    private readonly api: typeof google = options.api
    private readonly map: google.maps.Map = options.map
    private readonly templateHtml: string = options.templateHtml
    private readonly position: google.maps.LatLng | google.maps.LatLngLiteral = options.position
    private readonly offset: OffsetPosition | undefined = options.offset
    private container: HTMLDivElement | null
    private latLng: google.maps.LatLng

    constructor() {
      super()
      const { position, map, api } = this
      this.setMap(map)

      const isLiteralPosition = position?.lat && position?.lng
      if (isLiteralPosition) {
        const literalPosition = position as google.maps.LatLngLiteral
        this.latLng = new api.maps.LatLng(literalPosition.lat, literalPosition.lng)
      } else {
        this.latLng = position as google.maps.LatLng
      }
    }

    private createDiv(): void {
      this.container = document.createElement('div')
      this.container.style.position = 'absolute'

      if (this.templateHtml) this.container.innerHTML = this.templateHtml
      this.api.maps.event.addDomListener(this.container, 'click', () => {
        this.api.maps.event.trigger(this, 'click')
      })
    }

    private appendDivToOverlay(): void {
      if (!this.container) return
      const panes = this.getPanes()
      panes?.overlayMouseTarget.append(this.container)
    }

    private positionDiv(): void {
      const { latLng, container, offset } = this

      const point = this.getProjection().fromLatLngToDivPixel(latLng)

      if (point && container) {
        const x = offset && offset.x ? point.x - offset.x : point.x
        const y = offset && offset.y ? point.y - offset.y : point.y
        container.style.left = `${x}px`
        container.style.top = `${y}px`
      }
    }

    draw(): void {
      if (!this.container) {
        this.createDiv()
        this.appendDivToOverlay()
      }
      this.positionDiv()
    }

    remove(): void {
      if (!this.container) return
      this.container.remove()
      this.container = null
    }

    getPosition(): google.maps.LatLng | null | undefined {
      return this.latLng
    }

    getDraggable(): boolean {
      return false
    }
  }
  return new HTMLMarker()
}
