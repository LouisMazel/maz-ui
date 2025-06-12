import type { DefaultTheme } from 'vitepress'

export const components = {
  text: 'Components',
  collapsed: true,
  items: [
    {
      text: 'Forms',
      collapsed: false,
      items: [
        { text: 'MazBtn', link: '/components/maz-btn' },
        { text: 'MazCheckbox', link: '/components/maz-checkbox' },
        { text: 'MazChecklist', link: '/components/maz-checklist' },
        { text: 'MazInput', link: '/components/maz-input' },
        { text: 'MazInputCode', link: '/components/maz-input-code' },
        { text: 'MazInputNumber', link: '/components/maz-input-number' },
        { text: 'MazInputPrice', link: '/components/maz-input-price' },
        { text: 'MazInputTags', link: '/components/maz-input-tags' },
        { text: 'MazInputPhoneNumber', link: '/components/maz-input-phone-number' },
        { text: 'MazPicker (date, time, range)', link: '/components/maz-picker' },
        { text: 'MazRadio', link: '/components/maz-radio' },
        { text: 'MazRadioButtons', link: '/components/maz-radio-buttons' },
        { text: 'MazSelect (multiple)', link: '/components/maz-select' },
        { text: 'MazSlider', link: '/components/maz-slider' },
        { text: 'MazSwitch', link: '/components/maz-switch' },
        { text: 'MazTextarea', link: '/components/maz-textarea' },
      ],
    },
    {
      text: 'Navigation',
      collapsed: false,
      items: [
        { text: 'MazTabs', link: '/components/maz-tabs' },
        { text: 'MazStepper', link: '/components/maz-stepper' },
        { text: 'MazPagination', link: '/components/maz-pagination' },
        { text: 'MazLink', link: '/components/maz-link' },
        { text: 'MazPullToRefresh', link: '/components/maz-pull-to-refresh' },
        { text: 'MazReadingProgressBar', link: '/components/maz-reading-progress-bar' },
      ],
    },
    {
      text: 'Overlays',
      collapsed: false,
      items: [
        { text: 'MazDialog', link: '/components/maz-dialog' },
        { text: 'MazDialogPromise', link: '/components/maz-dialog-promise' },
        { text: 'MazDrawer', link: '/components/maz-drawer' },
        { text: 'MazBottomSheet', link: '/components/maz-bottom-sheet' },
        { text: 'MazPopover', link: '/components/maz-popover' },
        { text: 'MazDropdown', link: '/components/maz-dropdown' },
        { text: 'MazBackdrop', link: '/components/maz-backdrop' },
      ],
    },
    {
      text: 'Data',
      collapsed: false,
      items: [
        { text: 'MazChart', link: '/components/maz-chart' },
        { text: 'MazTable (data-table)', link: '/components/maz-table' },
        { text: 'MazDropzone', link: '/components/maz-dropzone' },
      ],
    },
    {
      text: 'Feedback',
      collapsed: false,
      items: [
        { text: 'MazSpinner', link: '/components/maz-spinner' },
        { text: 'MazLoadingBar', link: '/components/maz-loading-bar' },
        { text: 'MazFullscreenLoader', link: '/components/maz-fullscreen-loader' },
        { text: 'MazCircularProgressBar', link: '/components/maz-circular-progress-bar' },
        { text: 'MazBadge', link: '/components/maz-badge' },
      ],
    },
    {
      text: 'Média',
      collapsed: false,
      items: [
        { text: 'MazAvatar', link: '/components/maz-avatar' },
        { text: 'MazGallery', link: '/components/maz-gallery' },
        { text: 'MazLazyImg', link: '/components/maz-lazy-img' },
        { text: 'MazCarousel', link: '/components/maz-carousel' },
        { text: 'MazIcon', link: '/components/maz-icon' },
      ],
    },
    {
      text: 'Animations',
      collapsed: false,
      items: [
        { text: 'MazAnimatedCounter', link: '/components/maz-animated-counter' },
        { text: 'MazAnimatedElement', link: '/components/maz-animated-element' },
        { text: 'MazAnimatedText', link: '/components/maz-animated-text' },
        { text: 'MazExpandAnimation', link: '/components/maz-expand-animation' },
      ],
    },
    {
      text: 'Layout',
      collapsed: false,
      items: [
        { text: 'MazAccordion', link: '/components/maz-accordion' },
        { text: 'MazCard', link: '/components/maz-card' },
        { text: 'MazCardSpotlight', link: '/components/maz-card-spotlight' },
      ],
    },
  ],
} satisfies DefaultTheme.SidebarItem
