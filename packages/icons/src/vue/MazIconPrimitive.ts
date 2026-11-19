import type { Component, PropType, SVGAttributes } from 'vue'
import type { IconName, IconOptions } from '../types.ts'
import type { SvgDimensions } from './svg.ts'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import { getRegisteredIcon, hasIconLoader, loadIcon } from '../registry.ts'
import { parseSvg, prepareSvgString } from './svg.ts'

/**
 * A registered name (`'x-mark'`, `'app:logo'`): the known names, with any string unless `strict` (names registered
 * with `registerIcon()`, without the types of the plugin)
 */
export type MazIconPrimitiveName = IconName | `~${IconName}` | (IconOptions extends { strict: true } ? never : string & Record<never, never>)

/** A length of the `<svg>` (`24`, `'2rem'`), `false` on both keeps the size of the SVG file */
export type MazIconPrimitiveSize = string | number | false

export interface MazIconPrimitiveProps {
  /** The name of the icon: `MazUiIcons()` reads the props whose name contains `icon`, and the ones of `scan.keys` */
  icon: MazIconPrimitiveName
  /**
   * Width of the `<svg>` (`24`, `'2rem'`). Without `height`, the height follows the ratio of the SVG. `false` on both
   * keeps the size of the SVG file
   * @default '1em' (with `height`, the size of the text)
   */
  width?: MazIconPrimitiveSize
  /** Height of the `<svg>`. Without `width`, the width follows the ratio of the SVG */
  height?: MazIconPrimitiveSize
  /**
   * The name of the icon for screen readers (its `aria-label`, and a `<title>` for the tooltip): the icon is an image
   * instead of a decorative icon. Not for an icon in a button or a link that has its own name
   */
  title?: string
  /** Attributes of the `<svg>`. The attributes passed to the component also go to the `<svg>` */
  svgAttributes?: Record<string, string | number>
}

/** `~x-mark` is `x-mark`, loaded when it is displayed */
function toIconName(name: string): string {
  return name.startsWith('~')
    ? name.slice(1)
    : name
}

/** Whether a name can be rendered: registered by `MazUiIcons()` or `registerIcon()`, or loaded on demand (`~x-mark`, a `lazy` folder) */
export function hasIcon(name: string): boolean {
  const iconName = toIconName(name)
  return getRegisteredIcon(iconName) !== undefined || hasIconLoader(iconName)
}

/** `1em` without a size, the size of the file with `false` on both, else the given ones (the other follows the ratio) */
function toDimensions(width: MazIconPrimitiveSize | undefined, height: MazIconPrimitiveSize | undefined): SvgDimensions | false | undefined {
  if (width === false && height === false)
    return false
  if (width === undefined && height === undefined)
    return undefined
  return {
    width: width || undefined,
    height: height || undefined,
  }
}

const warnedNames = new Set<string>()

function warnUnknownName(name: string): void {
  if (warnedNames.has(name))
    return

  warnedNames.add(name)
  console.warn(`[maz-ui:icons] Unknown icon "${name}": add MazUiIcons() of @maz-ui/icons/vite (included in MazUi() of @maz-ui/vite-plugin and @maz-ui/nuxt), or register it with registerIcon() of @maz-ui/icons/registry`)
}

/** In dev, an unknown name renders a dashed square: visible, with its name in a tooltip */
function renderPlaceholder(name: string, dimensions: SvgDimensions | false) {
  return h('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'viewBox': '0 0 24 24',
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': 1.5,
    'stroke-dasharray': '3 2',
    'width': '1em',
    'height': '1em',
    ...(dimensions || {}),
    'role': 'img',
    'data-unknown-icon': name,
  }, [
    h('title', `Unknown icon "${name}"`),
    h('rect', {
      x: 3,
      y: 3,
      width: 18,
      height: 18,
      rx: 2,
    }),
  ])
}

const iconProps = {
  icon: { type: String as PropType<MazIconPrimitiveName>, required: true },
  width: { type: [String, Number, Boolean] as PropType<MazIconPrimitiveSize>, default: undefined },
  height: { type: [String, Number, Boolean] as PropType<MazIconPrimitiveSize>, default: undefined },
  title: { type: String, default: undefined },
  svgAttributes: { type: Object as PropType<Record<string, string | number>>, default: undefined },
} as const

type IconProps = Readonly<Required<Pick<MazIconPrimitiveProps, 'icon'>> & Omit<MazIconPrimitiveProps, 'icon'>>

/** The `<svg>` of a SVG string, with the size, the title and the accessibility of the props */
function renderSvg(svg: string, props: IconProps, attrs: Record<string, unknown>) {
  const parsed = parseSvg(prepareSvgString(svg, {
    title: props.title,
    svgAttributes: props.svgAttributes,
    dimensions: toDimensions(props.width, props.height),
  }))
  if (!parsed)
    return null

  const isLabelled = Boolean(attrs['aria-label'] || attrs['aria-labelledby'] || parsed.attributes['aria-label'] || parsed.attributes['aria-labelledby'])
  // Decorative by default. Named, it is an image: the title also in `aria-label`, read by every screen reader
  // (a `<title>` alone is not, with some browsers), and kept as the tooltip
  const accessibility: SVGAttributes = isLabelled || props.title
    ? {
        role: 'img',
        ...(isLabelled
          ? {}
          : { 'aria-label': props.title }),
      }
    : { 'aria-hidden': 'true' }

  return h('svg', {
    ...parsed.attributes,
    ...accessibility,
    innerHTML: parsed.content,
  })
}

/**
 * Renders a registered icon by its name, as its `<svg>`: no style, no other format. Made to be wrapped by the icon
 * component of a library, which adds its sizes, its fallback or its other formats.
 */
export const MazIconPrimitive = defineComponent({
  name: 'MazIconPrimitive',
  props: iconProps,
  setup(props, { attrs }) {
    return () => {
      const name = toIconName(props.icon)
      const svg = getRegisteredIcon(name)
      if (svg)
        return renderSvg(svg, props, attrs)

      // `~x-mark` or a name of a `lazy` folder: an async component, that SSR and the hydration wait for
      if (hasIconLoader(name)) {
        return h(getLazyIcon(name), {
          icon: name,
          width: props.width,
          height: props.height,
          title: props.title,
          svgAttributes: props.svgAttributes,
        })
      }

      if (process.env.NODE_ENV !== 'production') {
        warnUnknownName(props.icon)
        return renderPlaceholder(props.icon, toDimensions(props.width, props.height) || false)
      }
      return null
    }
  },
})

/** A lazy icon once loaded: its registered SVG only, never its loader again */
const MazIconLoaded = defineComponent({
  name: 'MazIconLoaded',
  props: iconProps,
  setup(props, { attrs }) {
    // Without its SVG (removed from the registry), `parseSvg` renders nothing
    return () => renderSvg(getRegisteredIcon(props.icon) ?? '', props, attrs)
  },
})

/** While a lazy icon loads: an empty `<svg>` of its size, the text does not move when it arrives */
export const MazIconLoading = defineComponent({
  name: 'MazIconLoading',
  props: iconProps,
  setup(props) {
    return () => h('svg', {
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': '0 0 24 24',
      'width': '1em',
      'height': '1em',
      ...(toDimensions(props.width, props.height) || {}),
      'aria-hidden': 'true',
      'data-loading-icon': props.icon,
    })
  },
})

const lazyIcons = new Map<string, Component>()

const EmptyIcon = () => null

/** The async component of a lazy name, once per name: it loads the SVG, then renders it */
function getLazyIcon(name: string): Component {
  let component = lazyIcons.get(name)
  if (!component) {
    component = defineAsyncComponent({
      // A failed load renders nothing, on the server too: an error of an async component stops the SSR in dev
      loader: () => loadIcon(name).then(() => MazIconLoaded, (error: unknown) => {
        console.warn(`[maz-ui:icons] The icon "${name}" could not be loaded`, error)
        lazyIcons.delete(name)
        return EmptyIcon
      }),
      loadingComponent: MazIconLoading,
      delay: 0,
    })
    lazyIcons.set(name, component)
  }
  return component
}
