import type { CSSRuleObject } from 'tailwindcss/types/config'

export const utilities = {
  '.flex-center': {
    'align-items': 'center',
    'justify-content': 'center',
  },
  '.padded-container-no-p': {
    'width': '100%',
    'padding-inline': 'calc(50% - var(--maz-container-max-width) / 2)',
  },
  '.padded-container': {
    'width': '100%',
    'padding-inline': 'var(--maz-container-padding)',
  },

  '.cap-f::first-letter': {
    'text-transform': 'capitalize',
  },
} satisfies CSSRuleObject
