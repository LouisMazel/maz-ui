import { DefaultTheme } from "vitepress";

export const components = {
  text: 'Components',
  collapsed: false,
  items: [
    {
      text: 'Form',
      collapsed: false,
      items: [
        { text: 'MazBtn', link: '/components/maz-btn' },
        { text: 'MazCheckbox', link: '/components/maz-checkbox' },
        { text: 'MazInput', link: '/components/maz-input' },
        { text: 'MazInputCode', link: '/components/maz-input-code' },
        { text: 'MazInputNumber', link: '/components/maz-input-number' },
        { text: 'MazInputPrice', link: '/components/maz-input-price' },
        { text: 'MazInputTags', link: '/components/maz-input-tags' },
        { text: 'MazPhoneNumberInput', link: '/components/maz-phone-number-input' },
        { text: 'MazRadio', link: '/components/maz-radio' },
        { text: 'MazRadioButtons', link: '/components/maz-radio-buttons' },
        { text: 'MazSelect (multiple)', link: '/components/maz-select' },
        { text: 'MazSlider', link: '/components/maz-slider' },
        { text: 'MazSwitch', link: '/components/maz-switch' },
        { text: 'MazTextarea', link: '/components/maz-textarea' },
      ]
    },
    {
      text: 'Data',
      collapsed: false,
      items: [
        { text: 'MazDropzone', link: '/components/maz-dropzone' },
        { text: 'MazPicker (date, time, range)', link: '/components/maz-picker' },
        { text: 'MazTable (data-table)', link: '/components/maz-table' },
      ]
    },
    {
      text: 'UI',
      collapsed: false,
      items: [
        { text: 'MazAccordion', link: '/components/maz-accordion' },
        { text: 'MazAnimatedCounter', link: '/components/maz-animated-counter' },
        { text: 'MazAvatar', link: '/components/maz-avatar' },
        { text: 'MazBadge', link: '/components/maz-badge' },
        { text: 'MazBackdrop', link: '/components/maz-backdrop' },
        { text: 'MazBottomSheet', link: '/components/maz-bottom-sheet' },
        { text: 'MazCard', link: '/components/maz-card' },
        { text: 'MazCardSpotlight', link: '/components/maz-card-spotlight' },
        { text: 'MazCarousel', link: '/components/maz-carousel' },
        { text: 'MazChart', link: '/components/maz-chart' },
        { text: 'MazCircularProgressBar', link: '/components/maz-circular-progress-bar' },
        { text: 'MazDropdown', link: '/components/maz-dropdown' },
        { text: 'MazExpandAnimation', link: '/components/maz-expand-animation' },
        { text: 'MazFullscreenLoader', link: '/components/maz-fullscreen-loader' },
        { text: 'MazDialog', link: '/components/maz-dialog' },
        { text: 'MazDialogPromise', link: '/components/maz-dialog-promise' },
        { text: 'MazDrawer', link: '/components/maz-drawer' },
        { text: 'MazGallery', link: '/components/maz-gallery' },
        { text: 'MazIcon', link: '/components/maz-icon' },
        { text: 'MazLazyImg', link: '/components/maz-lazy-img' },
        { text: 'MazLink', link: '/components/maz-link' },
        { text: 'MazLoadingBar', link: '/components/maz-loading-bar' },
        { text: 'MazPagination', link: '/components/maz-pagination' },
        { text: 'MazPullToRefresh', link: '/components/maz-pull-to-refresh' },
        { text: 'MazReadingProgressBar', link: '/components/maz-reading-progress-bar' },
        { text: 'MazStepper', link: '/components/maz-stepper' },
        { text: 'MazSpinner', link: '/components/maz-spinner' },
        { text: 'MazTabs', link: '/components/maz-tabs' },
        { text: 'MazTransitionExpand', link: '/components/maz-transition-expand' },
      ]
    }
  ]
} satisfies DefaultTheme.SidebarItem