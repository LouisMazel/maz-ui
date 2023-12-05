import type { CSSRuleObject } from 'tailwindcss/types/config'

export const utilities = {
  '.padded-container': {
    width: '100%',
    'padding-left': 'var(--maz-container-padding)',
    'padding-right': 'var(--maz-container-padding)',
  },
  '.padded-container-no-p': {
    width: '100%',
    'padding-left': 'calc(50% - var(--maz-container-max-width) / 2)',
    'padding-right': 'calc(50% - var(--maz-container-max-width) / 2)',
  },
  '.elevation': {
    'box-shadow': '0 5px 10px 0 hsla(0, 0%, 0%, 0.05)',
  },
  '.flex-center': {
    'align-items': 'center',
    'justify-content': 'center',
  },
  '.cap-f': {
    '@apply first-letter:maz-capitalize': '',
  },
} satisfies CSSRuleObject | CSSRuleObject[]
