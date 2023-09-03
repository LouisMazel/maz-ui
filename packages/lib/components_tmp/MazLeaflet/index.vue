<template>
  <div
    class="map maz-bg-color-light maz-elevation"
    :style="mapStyle"
    :class="{ 'maz-border-radius': !noRadius }"
  >
    <div :id="mapId" :style="mapStyle"></div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, watch } from 'vue'

  import type {
    LatLngExpression,
    LatLngTuple,
    AddMarkerOptions,
    MapProduct,
  } from '~/controllers/leaflet'
  import type MapController from '~/controllers/leaflet'
  import { currency, formatDate } from '~/plugins/filters'

  import type { Product } from '~/types'

  let Map: typeof MapController

  if (process.browser) {
    const { default: map } = require('~/controllers/leaflet')
    Map = map
  }

  const MAX_ZOOM = 12

  export default defineComponent({
    name: 'Map',
    props: {
      mapId: { type: String, required: true },
      height: { type: [Number, String], default: 200 },
      disabled: { type: Boolean, default: false },
      marker: { type: Array, default: null },
      markers: { type: Array, default: null },
      products: { type: Array, default: null },
      position: { type: Array, default: null },
      circle: { type: Object, default: null },
      noRadius: { type: Boolean, default: false },
    },
    setup(props, { root: { $i18n, localePath }, emit }) {
      let map: MapController

      const mapStyle = computed(() => ({
        height: Number.isInteger(props.height) ? `${props.height}px` : props.height,
      }))

      const addMarker = (latLng: LatLngExpression, opts?: AddMarkerOptions) => {
        map.addMarker(latLng, { zoom: MAX_ZOOM, ...opts })
      }

      const addProductMarker = (product: MapProduct) => {
        map.addProductMarker(product)
      }

      const removeAllMarkers = () => {
        map.removeAllMarkers()
      }

      const invalidSize = () => {
        map.invalidSize()
      }

      onMounted(() => {
        if (process.browser) {
          map = new Map(props.mapId, undefined, {
            zoomControl: false,
          }) as MapController

          emit('initiliazed')

          if (props.disabled) map.disable()

          watch(
            () => props.markers as LatLngTuple[],
            (markers: LatLngTuple[]) => {
              removeAllMarkers()
              if (!markers) return
              for (const m of markers) addMarker(m)
              setTimeout(() => map.fitBounds(markers, { maxZoom: MAX_ZOOM }), 300)
            },
            { immediate: true },
          )

          watch(
            () => props.marker as LatLngTuple,
            (marker: LatLngTuple) => {
              if (!marker) return
              removeAllMarkers()
              addMarker(marker)
            },
            { immediate: true },
          )

          watch(
            () => props.products as Product[],
            (products: Product[]) => {
              map.clearCluster()
              if (!products) return
              products.forEach((h: Product) => {
                addProductMarker({
                  ...h,
                  priceFormatted: currency(h.price, $i18n.locale, 'EUR'),
                  productLink: localePath({
                    name: 'categorie-slug',
                    params: { categorie: h.categorie, slug: h.slug },
                  }),
                  btnLabel: $i18n.t('app.buttons.see_ad') as string,
                  dateFormatted: formatDate(h.createdAt, {
                    locale: $i18n.locale,
                  }),
                  categorieTranslated: $i18n.t(`categories.${h.categorie}`) as string,
                  subcategorieTranslated: h.subcategorie
                    ? ($i18n.t(`categories.${h.subcategorie}`) as string)
                    : undefined,
                })
              })
              if (props.circle) return
              const bounds: LatLngTuple[] = products.map(({ location }) => [
                location.lat,
                location.lng,
              ])
              if (bounds.length > 0) {
                setTimeout(() => map.fitBounds(bounds, { maxZoom: MAX_ZOOM }), 300)
              }
            },
            { immediate: true },
          )

          watch(
            () => props.position,
            (latLng) => {
              if (latLng) map.addPositionMarker(latLng as LatLngExpression)
              else map.removePositionMarker()
            },
            { immediate: true },
          )

          watch(
            () => props.circle,
            (circle) => {
              if (circle) {
                const { latLng, radius } = circle
                map.addCircle(latLng as LatLngExpression, radius)
              } else map.removeCircle()
            },
            { immediate: true },
          )

          watch(
            () => props.disabled,
            (disabled) => {
              if (disabled) map.disable()
              else map.enable()
            },
            { immediate: true },
          )
        }
      })

      return {
        mapStyle,
        addMarker,
        removeAllMarkers,
        invalidSize,
        addProductMarker,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .map {
    overflow: hidden;
    width: 100%;
    > div {
      z-index: 0;
    }
  }
</style>
