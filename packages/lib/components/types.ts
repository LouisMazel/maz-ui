export type ModelValueSimple = string | number | null | undefined | boolean

export type MazGalleryImage =
  | {
      thumbnail?: string
      src: string
      alt?: string
    }
  | string

export type Color =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'white'
  | 'black'
  | 'transparent'
  | 'theme'

export const colors: Color[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
  'white',
  'black',
  'transparent',
  'theme',
]

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

export type Image = DataImage | string
