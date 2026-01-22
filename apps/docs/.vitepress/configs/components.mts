import type { DefaultTheme } from 'vitepress'

export const components = {
  text: 'Components',
  collapsed: true,
  items: [
    {
      text: 'Forms',
      collapsed: false,
      items: [
        { text: 'Btn', link: '/components/maz-btn' },
        { text: 'BtnGroup', link: '/components/maz-btn-group' },
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
      text: 'Layout',
      collapsed: false,
      items: [
        { text: 'Accordion', link: '/components/maz-accordion' },
        { text: 'Card', link: '/components/maz-card' },
        { text: 'CardSpotlight', link: '/components/maz-card-spotlight' },
        { text: 'ReadMore', link: '/components/maz-read-more' },
      ],
    },
    {
      text: 'Navigation',
      collapsed: false,
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
      collapsed: false,
      items: [
        { text: 'Dialog', link: '/components/maz-dialog' },
        { text: 'DialogConfirm', link: '/components/maz-dialog-confirm' },
        { text: 'Drawer', link: '/components/maz-drawer' },
        { text: 'BottomSheet', link: '/components/maz-bottom-sheet' },
        { text: 'Popover', link: '/components/maz-popover' },
        { text: 'Dropdown', link: '/components/maz-dropdown' },
        { text: 'Backdrop', link: '/components/maz-backdrop' },
      ],
    },
    {
      text: 'Data',
      collapsed: false,
      items: [
        { text: 'Chart', link: '/components/maz-chart' },
        { text: 'Table (data-table)', link: '/components/maz-table' },
        { text: 'Dropzone', link: '/components/maz-dropzone' },
      ],
    },
    {
      text: 'Feedback',
      collapsed: false,
      items: [
        { text: 'Spinner', link: '/components/maz-spinner' },
        { text: 'Skeleton', link: '/components/maz-skeleton' },
        { text: 'LoadingBar', link: '/components/maz-loading-bar' },
        { text: 'FullscreenLoader', link: '/components/maz-fullscreen-loader' },
        { text: 'CircularProggstressBar', link: '/components/maz-circular-progress-bar' },
        { text: 'Badge', link: '/components/maz-badge' },
      ],
    },
    {
      text: 'Média',
      collapsed: false,
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
      collapsed: false,
      items: [
        { text: 'AnimatedCounter', link: '/components/maz-animated-counter' },
        { text: 'AnimatedElement', link: '/components/maz-animated-element' },
        { text: 'AnimatedText', link: '/components/maz-animated-text' },
        { text: 'ExpandAnimation', link: '/components/maz-expand-animation' },
      ],
    },
  ],
} satisfies DefaultTheme.SidebarItem
