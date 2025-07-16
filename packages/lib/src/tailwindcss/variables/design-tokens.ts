import type { CustomThemeConfig } from 'tailwindcss/types/config'

export const designTokens = {
  borderRadius: {
    sm: 'calc(var(--maz-radius) - 8px)',
    md: 'calc(var(--maz-radius) - 4px)',
    DEFAULT: 'var(--maz-radius)',
    lg: 'calc(var(--maz-radius) + 4px)',
    xl: 'calc(var(--maz-radius) + 8px)',
  },

  borderColor: {
    DEFAULT: 'hsl(var(--maz-border) / <alpha-value>)',
  },

  // Bordures
  borderWidth: {
    DEFAULT: 'var(--maz-border-width)',
    0: '0',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  // Typography
  fontFamily: {
    sans: 'var(--maz-font-family)',
  },

  // Animations et transitions
  transitionDuration: {
    DEFAULT: '200ms',
  },

  transitionTimingFunction: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} satisfies Partial<CustomThemeConfig>
