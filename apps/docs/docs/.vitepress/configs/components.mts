import type { DefaultTheme } from 'vitepress'

export const components = {
  text: 'Components',
  collapsed: true,
  items: [
    {
      text: 'Forms',
      collapsed: true,
      items: [
        { text: 'Btn', link: '/components/maz-btn' },
        { text: 'Checkbox', link: '/components/maz-checkbox' },
        { text: 'Checklist', link: '/components/maz-checklist' },
        { text: 'DatePicker (time, range)', link: '/components/maz-date-picker' },
        { text: 'Input', link: '/components/maz-input' },
        { text: 'InputCode', link: '/components/maz-input-code' },
        { text: 'InputNumber', link: '/components/maz-input-number' },
        { text: 'InputPrice', link: '/components/maz-input-price' },
        { text: 'InputTags', link: '/components/maz-input-tags' },
        { text: 'InputPhoneNumber', link: '/components/maz-input-phone-number' },
        { text: 'Radio', link: '/components/maz-radio' },
        { text: 'RadioButtons', link: '/components/maz-radio-buttons' },
        { text: 'Select (multiple)', link: '/components/maz-select' },
        { text: 'SelectCountry', link: '/components/maz-select-country' },
        { text: 'Slider', link: '/components/maz-slider' },
        { text: 'Switch', link: '/components/maz-switch' },
        { text: 'Textarea', link: '/components/maz-textarea' },
      ],
    },
    {
      text: 'Navigation',
      collapsed: true,
      items: [
        { text: 'Tabs', link: '/components/maz-tabs' },
        { text: 'Stepper', link: '/components/maz-stepper' },
        { text: 'Pagination', link: '/components/maz-pagination' },
        { text: 'Link', link: '/components/maz-link' },
        { text: 'PullToRefresh', link: '/components/maz-pull-to-refresh' },
        { text: 'ReadingProgressBar', link: '/components/maz-reading-progress-bar' },
      ],
    },
    {
      text: 'Overlays',
      collapsed: true,
      items: [
        { text: 'Dialog', link: '/components/maz-dialog' },
        { text: 'DialogPromise', link: '/components/maz-dialog-promise' },
        { text: 'Drawer', link: '/components/maz-drawer' },
        { text: 'BottomSheet', link: '/components/maz-bottom-sheet' },
        { text: 'Popover', link: '/components/maz-popover' },
        { text: 'Dropdown', link: '/components/maz-dropdown' },
        { text: 'Backdrop', link: '/components/maz-backdrop' },
      ],
    },
    {
      text: 'Data',
      collapsed: true,
      items: [
        { text: 'Chart', link: '/components/maz-chart' },
        { text: 'Table (data-table)', link: '/components/maz-table' },
        { text: 'Dropzone', link: '/components/maz-dropzone' },
      ],
    },
    {
      text: 'Feedback',
      collapsed: true,
      items: [
        { text: 'Spinner', link: '/components/maz-spinner' },
        { text: 'LoadingBar', link: '/components/maz-loading-bar' },
        { text: 'FullscreenLoader', link: '/components/maz-fullscreen-loader' },
        { text: 'CircularProgressBar', link: '/components/maz-circular-progress-bar' },
        { text: 'Badge', link: '/components/maz-badge' },
      ],
    },
    {
      text: 'Média',
      collapsed: true,
      items: [
        { text: 'Avatar', link: '/components/maz-avatar' },
        { text: 'Gallery', link: '/components/maz-gallery' },
        { text: 'LazyImg', link: '/components/maz-lazy-img' },
        { text: 'Carousel', link: '/components/maz-carousel' },
        { text: 'Icon', link: '/components/maz-icon' },
      ],
    },
    {
      text: 'Animations',
      collapsed: true,
      items: [
        { text: 'AnimatedCounter', link: '/components/maz-animated-counter' },
        { text: 'AnimatedElement', link: '/components/maz-animated-element' },
        { text: 'AnimatedText', link: '/components/maz-animated-text' },
        { text: 'ExpandAnimation', link: '/components/maz-expand-animation' },
      ],
    },
    {
      text: 'Layout',
      collapsed: true,
      items: [
        { text: 'Accordion', link: '/components/maz-accordion' },
        { text: 'Card', link: '/components/maz-card' },
        { text: 'CardSpotlight', link: '/components/maz-card-spotlight' },
      ],
    },
  ],
} satisfies DefaultTheme.SidebarItem
