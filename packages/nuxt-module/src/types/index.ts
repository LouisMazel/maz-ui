import type { VLazyImgOptions, VTooltipOptions, VFullscreenImgOptions } from 'maz-ui/directives'
import type { AosOptions, DialogOptions, ToasterOptions } from 'maz-ui/plugins'
import type { MazUiThemeOptions } from '@maz-ui/themes'
import type { MazTranslationsOptions } from '@maz-ui/translations'

export interface MazUiNuxtThemeOptions extends MazUiThemeOptions {
  /**
   * Inject full CSS on server-side
   * @description Inject full CSS on server-side to prevent FOUC on client-side
   * @default true
   */
  injectFullCSSOnServer?: boolean
}

export interface MazUiNuxtOptions {
  /**
   * General configuration
   */
  general?: {
    /**
     * Prefix for auto-imported composables
     * @description This prefix will be added after the `use` keyword
     * @example `autoImportPrefix: 'Maz'` will generate `useMazToast` instead of `useToast`
     * @default ''
     */
    autoImportPrefix?: string

    /**
     * Default path to public SVG icons folder for `<MazIcon />` component
     * @description Relative path from the public directory
     * @example '/icons' to access icons in `public/icons/`
     * @default ''
     */
    defaultMazIconPath?: string

    /**
     * Enable Nuxt DevTools integration
     * @description Adds a Maz-UI tab in Nuxt development tools
     * @default true
     */
    devtools?: boolean
  }

  /**
   * Theme system configuration
   * @description If false, the theme system will be completely disabled
   * @default {
   *   preset: 'mazUi',
   *   strategy: 'hybrid',
   *   darkModeStrategy: 'class',
   * }
   */
  theme?: false | MazUiNuxtThemeOptions

  /**
   * Translations configuration
   * @description If false, the translations system will be completely disabled
   * @default {
   *   locale: 'en',
   * }
   */
  translations?: false | MazTranslationsOptions

  /**
   * CSS and styles configuration
   */
  css?: {
    /**
     * Auto-import Maz-UI main CSS file
     * @description Automatically injects Maz-UI base styles
     * @default true
     */
    injectMainCss?: boolean
  }

  /**
   * Components configuration
   */
  components?: {
    /**
     * Auto-import all Maz-UI components
     * @description Makes all Maz-UI components available globally without explicit imports
     * @default true
     */
    autoImport?: boolean
  }

  /**
   * Composables configuration
   */
  composables?: {
    /**
     * Enable auto-import of useTranslations composable
     * @description Provides translations functionality from `@maz-ui/translations` package
     * @default true
     */
    useTranslations?: boolean

    /**
     * Enable auto-import of useTheme composable
     * @description Provides theme management functionality (toggle dark mode, change themes, etc.) from `@maz-ui/themes` package
     * @default false
     */
    useTheme?: boolean

    /**
     * Enable auto-import of useAos composable and install AOS plugin
     * @description Animation On Scroll functionality with advanced configuration options
     * @default true
     */
    useAos?:
      | boolean
      | (Omit<AosOptions, 'router'> & {
        /**
         * Auto inject AOS CSS file
         * @default true
         */
        injectCss?: boolean
        /**
         * Re-run animations on page change (for SPA navigation)
         * @default false
         */
        router?: boolean
      })

    /**
     * Enable auto-import of useToast composable and install Toaster plugin
     * @description Toast notifications functionality
     * @default true
     */
    useToast?: boolean | ToasterOptions

    /**
     * Enable auto-import of useDialog composable and install Dialog plugin
     * @description Modal dialogs functionality
     * @default true
     */
    useDialog?: boolean | DialogOptions

    /**
     * Enable auto-import of useWait composable and install Wait plugin
     * @description Loading state management functionality
     * @default true
     */
    useWait?: boolean

    /**
     * Enable auto-import of useIdleTimeout composable
     * @description Detect user idle state and execute callbacks
     * @default true
     */
    useIdleTimeout?: boolean

    /**
     * Enable auto-import of useReadingTime composable
     * @description Calculate estimated reading time for text content
     * @default true
     */
    useReadingTime?: boolean

    /**
     * Enable auto-import of useWindowSize composable
     * @description Reactive window dimensions tracking
     * @default true
     */
    useWindowSize?: boolean

    /**
     * Enable auto-import of useBreakpoints composable
     * @description Responsive breakpoints detection and utilities
     * @default true
     */
    useBreakpoints?: boolean

    /**
     * Enable auto-import of useUserVisibility composable
     * @description Detect when user is viewing the page (Page Visibility API)
     * @default true
     */
    useUserVisibility?: boolean

    /**
     * Enable auto-import of useStringMatching composable
     * @description String matching and filtering utilities
     * @default true
     */
    useStringMatching?: boolean

    /**
     * Enable auto-import of useTimer composable
     * @description Timer and countdown functionality
     * @default true
     */
    useTimer?: boolean

    /**
     * Enable auto-import of useFormField composable
     * @description Form field management (should be used with useFormValidator)
     * @default true
     */
    useFormField?: boolean

    /**
     * Enable auto-import of useFormValidator and useFormField composables
     * @description Form validation utilities and field management
     * @default true
     */
    useFormValidator?: boolean

    /**
     * Enable auto-import of useLanguageDisplayNames composable
     * @description Get localized language display names
     * @default true
     */
    useLanguageDisplayNames?: boolean

    /**
     * Enable auto-import of useSwiper composable
     * @description Swiper/carousel functionality utilities
     * @default true
     */
    useSwiper?: boolean

    /**
     * Enable auto-import of useFreezeValue composable
     * @description Freeze values to prevent mutation
     * @default true
     */
    useFreezeValue?: boolean

    /**
     * Enable auto-import of useInjectStrict composable
     * @description Inject strict types for components
     * @default true
     */
    useInjectStrict?: boolean

    /**
     * Enable auto-import of useInstanceUniqId composable
     * @description Generate unique IDs for components
     * @default true
     */
    useInstanceUniqId?: boolean

    /**
     * Enable auto-import of useMountComponent composable
     * @description Mount components on the DOM
     * @default true
     */
    useMountComponent?: boolean

    /**
     * Enable auto-import of useSwipe composable
     * @description Swipe gesture detection and handling
     * @default true
     */
    useSwipe?: boolean
  }

  /**
   * Vue directives configuration
   */
  directives?: {
    /**
     * Install v-zoom-img directive globally
     * @description Enables image zoom functionality on click
     * @default true
     */
    vZoomImg?: boolean

    /**
     * Install v-lazy-img directive globally
     * @description Lazy loading for images with intersection observer
     * @default true
     */
    vLazyImg?: boolean | VLazyImgOptions

    /**
     * Install v-click-outside directive globally
     * @description Detect clicks outside of an element
     * @default true
     */
    vClickOutside?: boolean

    /**
     * Install v-fullscreen-img directive globally
     * @description Fullscreen image viewer functionality
     * @default true
     */
    vFullscreenImg?: boolean | VFullscreenImgOptions

    /**
     * Install v-tooltip directive globally
     * @description Tooltip functionality for any element
     * @default true
     */
    vTooltip?: boolean | VTooltipOptions
  }
}
