import type { IconComponent } from '@maz-ui/icons'
import { getRegisteredIcon } from '@maz-ui/icons/registry'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, inject, markRaw, ref, useAttrs, watch } from 'vue'
import { decodeSvgDataUri, extractSvgMarkup, fetchSvgText, isIconName, isStringIcon, isUrlLike, prefetchSvgText, svgTextCache } from './svg-utils'

type SvgSourceValue = string | IconComponent

export interface UseSvgSourceOptions {
  icon: () => SvgSourceValue | undefined
  fallback: () => SvgSourceValue | undefined
  /** Turns the SVG text into the markup to render (dimensions, title, attributes) */
  prepare: (svg: string) => string
  /** Values that change the prepared markup */
  watchSources: () => unknown[]
  onError: (error: Error) => void
}

export interface UseSvgAccessibilityOptions {
  title: () => string | undefined
  svgAttributes: () => Record<string, string | number> | undefined
}

const warnedNames = new Set<string>()

function warnUnknownName(name: string): Error {
  const error = new Error(`[maz-ui] Unknown icon "${name}": add MazUi() of @maz-ui/vite-plugin (included in @maz-ui/nuxt), or register it with registerIcon() of @maz-ui/icons/registry`)
  if (!warnedNames.has(name)) {
    warnedNames.add(name)
    console.warn(error.message)
  }
  return error
}

const URL_ORIGIN = /^(?:[a-z][a-z\d+\-.]*:)?\/\/[^/]+/i

function isRelativeUrl(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//')
}

/**
 * Resolves the `icon` of MazIcon and MazSvg: a registered name, a raw SVG, a data URI, a URL (fetched) or a
 * component. A name or a URL that fails renders the `fallback`.
 */
export function useSvgSource({ icon, fallback, prepare, watchSources, onError }: UseSvgSourceOptions) {
  const rawSvgContent = ref('')
  const hasError = ref(false)

  /**
   * Base URL prefix injected by the consuming app for relative URL `icon`s (e.g. to serve them from a CDN). An
   * absolute base also lets the server fetch them, as it has no host to resolve `/icons/star.svg` against.
   * Provided by `@maz-ui/nuxt` from `mazUi.general.defaultMazIconPath`.
   */
  const mazIconPath = inject<string | undefined>('mazIconPath', undefined)

  const componentIcon = computed<IconComponent | undefined>(() => {
    const value = icon()
    if (value && !isStringIcon(value))
      return markRaw(value)

    const fallbackValue = fallback()
    const useFallback = !value || (isStringIcon(value) && hasError.value)
    if (useFallback && fallbackValue && !isStringIcon(fallbackValue))
      return markRaw(fallbackValue)
    return undefined
  })

  /**
   * A URL icon not loaded yet renders a placeholder reserving its box. It has no `v-html`, so hydration does not
   * touch its content: the SVG the server rendered from its cache stays visible until the client has it.
   */
  const isPendingUrl = computed(() => {
    if (hasError.value)
      return false

    const value = icon()
    const fallbackValue = fallback()
    const source = isStringIcon(value)
      ? value
      : !value && isStringIcon(fallbackValue)
          ? fallbackValue
          : undefined

    return isUrlLike(source) && !isIconName(source) && !decodeSvgDataUri(source)
  })

  function render(svg: string) {
    rawSvgContent.value = prepare(svg)
  }

  /** `/star.svg` is `${mazIconPath}/star.svg`, a URL already under its path (`/icons/star.svg` with `/icons`) keeps it */
  function resolveUrl(value: string): string {
    if (!mazIconPath || !isRelativeUrl(value))
      return value

    const base = mazIconPath.endsWith('/')
      ? mazIconPath.slice(0, -1)
      : mazIconPath
    const origin = URL_ORIGIN.exec(base)?.[0] ?? ''
    const basePath = base.slice(origin.length)

    return basePath && (value === basePath || value.startsWith(`${basePath}/`))
      ? `${origin}${value}`
      : `${base}${value}`
  }

  async function fail(error: Error, value: string): Promise<void> {
    onError(error)
    hasError.value = true
    rawSvgContent.value = ''

    // A string fallback is tried in turn, a component fallback takes over through `componentIcon`
    const fallbackValue = fallback()
    if (fallbackValue && isStringIcon(fallbackValue) && fallbackValue !== value)
      await resolveString(fallbackValue)
  }

  async function resolveString(value: string): Promise<void> {
    const registered = getRegisteredIcon(value)
    if (registered) {
      render(registered)
      return
    }

    if (isIconName(value)) {
      await fail(warnUnknownName(value), value)
      return
    }

    // Raw SVGs and SVG data URIs are rendered synchronously, on the server too
    const inlineSvg = extractSvgMarkup(value) ?? decodeSvgDataUri(value)
    if (inlineSvg) {
      render(inlineSvg)
      return
    }

    if (!isUrlLike(value)) {
      rawSvgContent.value = ''
      return
    }

    const resolved = resolveUrl(value)

    // Synchronous when cached: the icon is in the SSR output and the first client render without a flicker
    const cached = svgTextCache.get(resolved)
    if (cached) {
      render(cached)
      return
    }

    // The server never waits for the network: it warms its cache for the next renders and leaves the empty
    // placeholder to the client. Relative URLs without a `mazIconPath` base cannot be fetched there.
    if (isServer()) {
      if (!isRelativeUrl(resolved))
        prefetchSvgText(resolved)
      return
    }

    try {
      render(await fetchSvgText(resolved))
    }
    catch (error) {
      const err = error instanceof Error
        ? error
        : new Error(String(error))
      // Surfaced by default, `@error` is there for telemetry
      console.warn(err)
      await fail(err, value)
    }
  }

  async function resolve(): Promise<void> {
    hasError.value = false

    // A URL keeps the previous icon until it is loaded
    const source = icon() || fallback()
    if (!source || !isStringIcon(source)) {
      rawSvgContent.value = ''
      return
    }

    await resolveString(source)
  }

  // On the server, `resolve` never waits for the network: the state is set synchronously, so the SSR render stays
  // synchronous too (no `onServerPrefetch`)
  if (isServer())
    resolve()

  // Runs synchronously during setup up to the first network request, so registered, cached, raw and data URI
  // icons are part of the first client render
  watch(
    () => [
      icon(),
      fallback(),
      ...watchSources(),
    ],
    async () => {
      if (!isServer())
        await resolve()
    },
    { immediate: true, deep: true },
  )

  return { rawSvgContent, isPendingUrl, componentIcon }
}

/** Decorative (`aria-hidden`) unless it has a title or a label, then exposed as an image */
export function useSvgAccessibility({ title, svgAttributes }: UseSvgAccessibilityOptions) {
  const attrs = useAttrs()

  const hasAriaLabel = computed(() =>
    Boolean(title() || attrs['aria-label'] || attrs['aria-labelledby'] || svgAttributes()?.['aria-label'] || svgAttributes()?.['aria-labelledby']),
  )

  const ariaHidden = computed<'true' | 'false' | undefined>(() => {
    const fromAttrs = attrs['aria-hidden']
    if (fromAttrs !== undefined && fromAttrs !== null) {
      return String(fromAttrs) === 'false'
        ? 'false'
        : 'true'
    }
    return hasAriaLabel.value ? undefined : 'true'
  })

  const role = computed(() => (hasAriaLabel.value ? 'img' : undefined))

  const ariaLabel = computed(() => (attrs['aria-label'] || attrs['aria-labelledby']
    ? undefined
    : title()))

  return { ariaHidden, role, ariaLabel }
}
