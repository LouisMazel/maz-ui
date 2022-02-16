import { createHTMLMarker, HTMLMarker } from './create-html-marker'
import { ScriptLoader, ScriptOptions } from './script-loader'

export type MapOptions = google.maps.MapOptions

const DEFAULT_OPTIONS: MapOptions = {
  center: { lat: 50.644_879_6, lng: 3.056_052_4 },
  zoom: 12,
}

export interface MapMarker extends google.maps.MarkerOptions {
  infoWindow?: google.maps.InfoWindowOptions
}

export interface MarkerInfoWindowOptions extends google.maps.InfoWindowOptions {
  offset?: {
    x: number
    y: number
  }
}

export interface MapHTMLMarker {
  position: google.maps.LatLng | google.maps.LatLngLiteral
  templateHtml: string
  offset?: { x: number; y: number }
  infoWindow?: MarkerInfoWindowOptions
}

export class Map {
  private api: typeof google
  private map: google.maps.Map
  private markers: google.maps.Marker[] = []
  private htmlMarkers: HTMLMarker[] = []
  private mapOptions: MapOptions

  constructor(
    private readonly mapContainerId: string,
    private readonly apiKey: string,
    private readonly options?: MapOptions,
  ) {
    this.mapOptions = {
      ...DEFAULT_OPTIONS,
      ...this.options,
    }
  }

  public async init(options?: ScriptOptions): Promise<void> {
    try {
      this.api = await new ScriptLoader(this.apiKey, options).init()
      this.map = new this.api.maps.Map(
        document.querySelector(`#${this.mapContainerId}`) as HTMLDivElement,
        this.mapOptions,
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private getInfoWindow(
    options: MarkerInfoWindowOptions,
  ): google.maps.InfoWindow {
    if (options.offset)
      options.pixelOffset = new this.api.maps.Size(
        options.offset.x,
        options.offset.y,
      )
    return new this.api.maps.InfoWindow({
      ...options,
    })
  }

  private addInfoWindowContentToMarker(
    marker: HTMLMarker | google.maps.Marker,
    infoWindowOptions: MarkerInfoWindowOptions,
  ) {
    if (!infoWindowOptions.content)
      throw new Error('[Map] InfoWindow should have a content')
    const infoWindow = this.getInfoWindow(infoWindowOptions)
    marker.addListener('click', () => {
      infoWindow.open(this.map, marker)
    })
  }

  public addMarker({
    infoWindow,
    ...arguments_
  }: MapMarker): google.maps.Marker {
    const marker = new this.api.maps.Marker({
      ...arguments_,
      map: this.map,
    })

    if (infoWindow) this.addInfoWindowContentToMarker(marker, infoWindow)

    this.markers.push(marker)

    return marker
  }

  public addHTMLMarker({
    position,
    templateHtml,
    offset,
    infoWindow,
  }: MapHTMLMarker): HTMLMarker {
    const marker = createHTMLMarker({
      api: this.api,
      map: this.map,
      position,
      templateHtml,
      offset,
    })

    if (infoWindow) this.addInfoWindowContentToMarker(marker, infoWindow)

    this.htmlMarkers.push(marker)

    return marker
  }

  public get allMarkers(): (google.maps.Marker | HTMLMarker)[] {
    return [...this.markers, ...this.htmlMarkers]
  }

  public fitOnAllMarkers(): void {
    const bounds = new this.api.maps.LatLngBounds()

    for (const marker of this.allMarkers) {
      const markerPosition = marker.getPosition()
      if (markerPosition) bounds.extend(markerPosition)
    }

    this.map.fitBounds(bounds)
  }

  public removeAllMarkers(): void {
    for (const [index] of this.allMarkers.entries()) {
      this.allMarkers[index].setMap(null)
    }
  }
}

export * from './script-loader'
export * from './create-html-marker'
