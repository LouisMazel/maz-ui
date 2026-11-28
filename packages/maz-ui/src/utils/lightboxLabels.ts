import { useTranslations } from '@maz-ui/translations/composables/useTranslations'

const FALLBACK_LABELS = {
  'lightbox.label': 'Image viewer',
  'lightbox.open': 'Enlarge image',
  'lightbox.close': 'Close',
  'lightbox.previous': 'Previous image',
  'lightbox.next': 'Next image',
  'lightbox.loading': 'Loading...',
} as const

export type LightboxLabelKey = keyof typeof FALLBACK_LABELS

/**
 * Translates a label of the lightbox. English when no translations plugin is installed (the directive
 * can be used without `MazUi`).
 */
export function getLightboxLabel(key: LightboxLabelKey): string {
  try {
    const value = useTranslations().t(key)

    return value && value !== key ? value : FALLBACK_LABELS[key]
  }
  catch {
    return FALLBACK_LABELS[key]
  }
}
