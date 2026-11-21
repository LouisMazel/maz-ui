/**
 * Tasks of a Vue app that maz-ui already solves. The prompts never name maz-ui: they are written as a user asks, the
 * eval measures whether the agent finds and reuses the ecosystem by itself.
 */
export interface EvalTask {
  id: string
  prompt: string
  /** Each pattern matches the code written by the agent: the expected maz-ui tools */
  expects: RegExp[]
  /** No pattern matches the code written by the agent: the hand-made versions */
  forbids: RegExp[]
}

const NATIVE_BUTTON = /<button\b/

export const TASKS: EvalTask[] = [
  {
    id: 'copy-link',
    prompt: 'Create `src/components/ShareLink.vue`: it shows the `url` prop and a button that copies it, the button shows "Copied" for 2 seconds after a copy.',
    expects: [/\buseClipboard\b|<MazBtnClipboard\b/],
    forbids: [/navigator\.clipboard/, NATIVE_BUTTON],
  },
  {
    id: 'copy-command',
    prompt: 'Create `src/components/InstallCommand.vue`: it shows the command `npm install my-lib` with a button to copy it, for the docs of a library.',
    expects: [/<MazBtnClipboard\b/],
    forbids: [/navigator\.clipboard/, NATIVE_BUTTON],
  },
  {
    id: 'delete-confirm',
    prompt: 'Create `src/components/DeleteProject.vue`: a delete button that asks the user to confirm, then emits `delete`.',
    expects: [/\buseDialog\b|<MazDialogConfirm\b/],
    forbids: [/(?<![.\w])confirm\(/, NATIVE_BUTTON],
  },
  {
    id: 'save-toast',
    prompt: 'Create `src/components/SaveButton.vue`: a button that calls the async `save` prop, shows that it is loading meanwhile, then tells the user whether it worked.',
    expects: [/\buseToast\b/, /<MazBtn\b/],
    forbids: [/\balert\(/, NATIVE_BUTTON],
  },
  {
    id: 'price',
    prompt: 'Create `src/components/PriceTag.vue`: it shows the `amount` prop, in cents, as a price in euros for French users.',
    expects: [/\bformatCurrency\b/],
    forbids: [/Intl\.NumberFormat/, /toFixed\(/],
  },
  {
    id: 'search-filter',
    prompt: 'Create `src/components/UserSearch.vue`: a search field that filters the `users` prop (`{ id: number, name: string }[]`) by name, 300 ms after the user stops typing.',
    expects: [/<MazInput\b/, /\b(?:debounce|useDebounce\w*)\b/],
    forbids: [/\bsetTimeout\(/, /from ['"]lodash/, /<input\b/],
  },
  {
    id: 'relative-time',
    prompt: 'Create `src/components/LastSeen.vue`: it shows when the `date` prop happened, as "5 minutes ago", and keeps it up to date.',
    expects: [/\buseRelativeTime\b/],
    forbids: [/\bsetInterval\(/, /from ['"](?:timeago\.js|vue-timeago3|dayjs)/],
  },
  {
    id: 'idle-logout',
    prompt: 'Create `src/composables/useAutoLogout.ts`: it calls a `logout` callback after 15 minutes without any activity of the user.',
    expects: [/\buseIdleTimeout\b/],
    forbids: [/addEventListener\(\s*['"](?:mousemove|keydown)/],
  },
  {
    id: 'resend-countdown',
    prompt: 'Create `src/components/ResendCode.vue`: a "Resend the code" button, disabled for 60 seconds after each click with the seconds left in its label, that emits `resend`.',
    expects: [/\buseTimer\b/, /<MazBtn\b/],
    forbids: [/\bsetInterval\(/, NATIVE_BUTTON],
  },
  {
    id: 'dark-mode',
    prompt: 'Create `src/components/ThemeToggle.vue`: a button that switches the app between light and dark mode, the choice is kept after a reload.',
    expects: [/\buseTheme\b/],
    forbids: [/classList\.(?:add|remove|toggle)\(\s*['"]dark/, /localStorage/, /prefers-color-scheme/],
  },
  {
    id: 'contact-form',
    prompt: 'Create `src/components/ContactForm.vue`: a form with a name, an email and a phone number with its country, each field validated, and a submit button that emits the values.',
    expects: [/<MazInputPhoneNumber\b/, /<MazBtn\b/],
    forbids: [/from ['"]libphonenumber-js/, /<input\b/, NATIVE_BUTTON],
  },
  {
    id: 'projects-table',
    prompt: 'Create `src/components/ProjectsTable.vue`: a table of the `projects` prop (`{ id: number, name: string, owner: string, createdAt: string }[]`) with sortable columns, a search, 10 rows per page, the creation date in a readable format, and a delete button on each row that asks the user to confirm, then emits `delete` with the id.',
    expects: [/<MazTable\b/, /\buseDialog\b|<MazDialogConfirm\b/],
    forbids: [/<table\b/, /(?<![.\w])confirm\(/, /toLocaleDateString\(/, /Intl\.DateTimeFormat/, NATIVE_BUTTON],
  },
  {
    id: 'settings-page',
    prompt: 'Create `src/pages/SettingsPage.vue`: the settings of the user, with their avatar (their initials when they have no picture), a language select (English, French), a dark mode switch kept after a reload, and a save button that tells the user their settings are saved.',
    expects: [/<MazAvatar\b/, /<MazSelect\b/, /\buseTheme\b/, /\buseToast\b/],
    forbids: [/<select\b/, /localStorage/, /classList\.(?:add|remove|toggle)\(\s*['"]dark/, /\balert\(/, NATIVE_BUTTON],
  },
  {
    id: 'avatar-upload',
    prompt: 'Create `src/components/AvatarUpload.vue`: the user drops an image on it or clicks it to pick one, 2 MB at most, it shows a preview of the image and emits `upload` with the file.',
    expects: [/<MazDropzone\b|\buseDropzone\b/],
    forbids: [/addEventListener\(\s*['"](?:drop|dragover)/, /@(?:drop|dragover)\b/],
  },
  {
    id: 'checkout-form',
    prompt: 'Create `src/components/CheckoutForm.vue`: a form with the name of the card holder, a delivery date picked in a calendar (never in the past), a quantity from 1 to 10 and the total price in euros (`unitPrice` prop, in euros), each field validated, and a submit button that shows a loading state while the async `submit` prop runs.',
    expects: [/<MazDatePicker\b/, /<MazBtn\b/, /\bformatCurrency\b|<MazInputPrice\b/],
    forbids: [/<input\b/, /type=["']date/, /Intl\.NumberFormat/, NATIVE_BUTTON],
  },
  {
    id: 'shared-loading',
    prompt: 'Create `src/api.ts` with a `fetchUser()` that resolves after one second, load the user in `src/App.vue`, and create `src/components/AppHeader.vue`, shown by `App.vue`, with a spinner while the user loads. Share the loading state between them without a prop nor an event.',
    expects: [/\buseWait\b/],
    forbids: [/\bprovide\(/, /\bdefineStore\(/],
  },
  {
    id: 'infinite-feed',
    prompt: 'Create `src/components/ActivityFeed.vue`: a list of the activities given 20 at a time by the async `loadPage(page: number)` prop (an empty array at the end). The next page loads when the user gets close to the end of the list, with a spinner meanwhile, and a button that brings the user back to the top appears after some scroll.',
    expects: [/\buseInfiniteScroll\b|\buseIntersectionObserver\b|\bv-intersect\b/, /<MazBtnScroll\b|\buseScroll\b/],
    forbids: [/new\s+IntersectionObserver\(/, /addEventListener\(\s*['"]scroll/],
  },
]
