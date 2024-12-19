import type { Component, ComponentPublicInstance, FunctionalComponent, SVGAttributes } from 'vue'
import type { colors } from './constantes'

export type ModelValueSimple = string | number | null | undefined | boolean

export type MazGalleryImage =
  | {
    thumbnail?: string
    src: string
    alt?: string
  }
  | string

export type Color = (typeof colors)[number]

export type Size = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Position =
  | 'top'
  | 'top right'
  | 'top left'
  | 'bottom'
  | 'bottom right'
  | 'bottom left'
  | 'left'
  | 'right'

export interface Source {
  srcset?: string
  media?: string
}

export interface DataImage {
  sources?: Source[]
}

export type MazImage = DataImage | string

export type Icon = FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component
