<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazSizeUnit } from './types'
import { MazQuestionMarkCircle } from '@maz-ui/icons/lazy/MazQuestionMarkCircle'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { computed, inject, markRaw, ref, useAttrs, watch } from 'vue'
import { decodeSvgDataUri, fetchSvgText, isRawSvg, isStringIcon, isUrlLike, prefetchSvgText, prepareSvgString, svgTextCache } from '../utils/svg-utils'

const {
  icon,
  fallback = MazQuestionMarkCircle,
  size,
  title,
  svgAttributes,
  flipIconForRtl = false,
} = defineProps<MazIconProps>()

const emits = defineEmits<{
  /** Emitted when an SVG fails to fetch or parse — useful for telemetry / fallback UI. */
  (event: 'error', error: Error): void
}>()

const predefinedSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

type PredefinedSize = typeof predefinedSizes[number]

export type MazIconSize = MazSizeUnit | PredefinedSize
export type MazIconValue = string | IconComponent

export interface MazIconProps {
  /**
   * The icon to render. Accepts:
   * - A Vue component (e.g. `import { MazStar } from '@maz-ui/icons/static/MazStar'`)
   * - A URL or `data:` URI to a `.svg` file (`'/icons/star.svg'`, `'data:image/svg+xml,…'`)
   * - A raw SVG string (`'<svg viewBox="0 0 24 24">…</svg>'`)
   *
   * The component detects the format and renders accordingly.
   */
  icon?: MazIconValue
  /**
   * Fallback icon used when:
   * - `icon` is not provided
   * - `icon` is a URL that fails to load or returns invalid SVG
   *
   * Same shape as `icon`. Defaults to the imported `MazQuestionMarkCircle` if
   * neither `icon` nor `fallback` resolves to anything renderable.
   */
  fallback?: MazIconValue
  /** Predefined keyword (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`) or any CSS length. */
  size?: MazIconSize
  /** Sets a `<title>` element inside the SVG for screen-reader accessibility. */
  title?: string
  /** Extra attributes to merge onto the rendered `<svg>` root. */
  svgAttributes?: Record<string, string | number>
  /**
   * Mirror the icon horizontally when the document direction is RTL. Useful
   * for directional icons (chevrons, arrows). Renders unchanged in LTR.
   * @default false
   */
  flipIconForRtl?: boolean
}

const attrs = useAttrs()
const rawSvgContent = ref<string>('')
const hasFetchError = ref(false)

/**
 * Base URL prefix injected by the consuming app for relative URL `icon`s
 * (e.g. to serve them from a CDN). An absolute base also lets the server fetch
 * them, as it has no host to resolve `/icons/star.svg` against. Provided
 * automatically by `@maz-ui/nuxt` from
 * `mazUi.general.defaultMazIconPath`. Falls back to '' (no prefix) — the
 * icon path is then used as-is.
 */
const mazIconPath = inject<string | undefined>('mazIconPath', undefined)

const componentIcon = computed<IconComponent | undefined>(() => {
  if (icon && !isStringIcon(icon))
    return markRaw(icon)
  // Use the component fallback when no icon was provided OR when the
  // primary string icon failed to resolve.
  const useFallback = !icon || (isStringIcon(icon) && hasFetchError.value)
  if (useFallback && fallback && !isStringIcon(fallback))
    return markRaw(fallback)
  return undefined
})

/**
 * A URL icon not loaded yet renders a placeholder `<span>` reserving the 1em
 * box. It has no `v-html`, so hydration does not touch its content: the SVG
 * the server rendered from its cache stays visible until the client has it.
 */
const isPendingUrl = computed(() => {
  if (hasFetchError.value)
    return false
  const value = isStringIcon(icon) ? icon : !icon && isStringIcon(fallback) ? fallback : undefined
  return isUrlLike(value) && !decodeSvgDataUri(value)
})

const svgStyle = computed<CSSProperties | undefined>(() => {
  const isPredefined = size && predefinedSizes.includes(size as PredefinedSize)
  if (!size || isPredefined)
    return undefined
  return { fontSize: size }
})

const SIZE_CLASS = {
  xs: 'maz:text-base',
  sm: 'maz:text-xl',
  md: 'maz:text-2xl',
  lg: 'maz:text-4xl',
  xl: 'maz:text-5xl',
} as const

const sizeClass = computed<string | undefined>(() => {
  const isPredefined = size && predefinedSizes.includes(size as PredefinedSize)
  return isPredefined ? `m-icon--${size} ${SIZE_CLASS[size as PredefinedSize]}` : undefined
})

const hasAriaLabel = computed(() =>
  Boolean(attrs['aria-label'] || attrs['aria-labelledby'] || svgAttributes?.['aria-label'] || svgAttributes?.['aria-labelledby']),
)

const ariaHidden = computed<'true' | 'false' | undefined>(() => {
  const fromAttrs = attrs['aria-hidden']
  if (fromAttrs !== undefined && fromAttrs !== null)
    return String(fromAttrs) === 'false' ? 'false' : 'true'
  return hasAriaLabel.value ? undefined : 'true'
})

const role = computed(() => (hasAriaLabel.value ? 'img' : undefined))

const flipClass = computed(() => (flipIconForRtl ? 'm-icon--flip-for-rtl' : undefined))

function renderRaw(svg: string) {
  rawSvgContent.value = prepareSvgString(svg, {
    title,
    svgAttributes,
  })
}

function isRelativeUrl(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//')
}

function resolveUrl(value: string): string {
  // Prefix relative URLs with the injected base path.
  if (mazIconPath && isRelativeUrl(value)) {
    const base = mazIconPath.endsWith('/') ? mazIconPath.slice(0, -1) : mazIconPath
    const path = value.startsWith('/') ? value.slice(1) : value
    return `${base}/${path}`
  }
  return value
}

async function resolveStringIcon(value: string): Promise<void> {
  // Raw SVGs and SVG data URIs are rendered synchronously, on the server too.
  const inlineSvg = isRawSvg(value) ? value : decodeSvgDataUri(value)
  if (inlineSvg) {
    renderRaw(inlineSvg)
    return
  }

  if (isUrlLike(value)) {
    const resolved = resolveUrl(value)

    // Synchronous when cached: the icon is in the SSR output and the first
    // client render without a flicker.
    const cached = svgTextCache.get(resolved)
    if (cached) {
      renderRaw(cached)
      return
    }

    // The server never waits for the network: it warms its cache for the next
    // renders and leaves the empty placeholder to the client. Relative URLs
    // without a `mazIconPath` base cannot be fetched there.
    if (isServer()) {
      if (!isRelativeUrl(resolved))
        prefetchSvgText(resolved)
      return
    }

    try {
      const text = await fetchSvgText(resolved)
      renderRaw(text)
    }
    catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      // Surface the failure by default — consumers can still wire `@error`
      // for telemetry, but the warning makes the issue visible without it.
      console.warn(err)
      emits('error', err)
      hasFetchError.value = true
      // If the fallback is itself a string icon, try it. If it also fails,
      // the recursive call will set `hasFetchError` again — and the
      // component fallback (if any) will take over via `componentIcon`.
      if (fallback && isStringIcon(fallback) && fallback !== value)
        await resolveStringIcon(fallback)
    }
  }
}

async function renderIcon(): Promise<void> {
  hasFetchError.value = false

  // Component icons render via <component :is="…"> in the template — nothing to do here.
  if (icon && !isStringIcon(icon))
    return

  if (icon && isStringIcon(icon)) {
    await resolveStringIcon(icon)
    return
  }

  if (fallback && isStringIcon(fallback)) {
    await resolveStringIcon(fallback)
  }
}

// On the server, `renderIcon` never waits for the network: it sets the state
// synchronously, so the SSR render of the component stays synchronous too
// (no `onServerPrefetch`).
if (isServer())
  renderIcon()

// Runs synchronously during setup up to the first network request, so cached,
// raw and data URI icons are part of the first client render.
watch(
  () => [icon, fallback, title, svgAttributes],
  async () => {
    if (!isServer())
      await renderIcon()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <span
    v-if="rawSvgContent"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :role="role"
    v-html="rawSvgContent"
  />
  <span
    v-else-if="isPendingUrl"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :role="role"
  />
  <component
    :is="componentIcon"
    v-else-if="componentIcon"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :role="role"
  />
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-icon {
  &,
  &:deep(> svg) {
    @apply maz:size-[1em];
  }

  &.m-icon--flip-for-rtl {
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }
}
</style>
