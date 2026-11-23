export interface MadeWithProject {
  id: string
  name: string
  url: string
  kind: string
  year: string
  tagline: string
  description: string
  highlights: string[]
  stack: string[]
  status?: string
  github?: string
  image: {
    light: string
    dark: string
  }
}

export const PROJECTS: MadeWithProject[] = [
  {
    id: 'relizy',
    name: 'Relizy',
    url: 'https://relizy.dev',
    kind: 'Open source · Release automation',
    year: '2025',
    tagline: 'Ship every release in one command',
    description: 'Versions, changelogs, git tags, npm publishing and GitHub or GitLab releases, computed from your Conventional Commits. For a single package or a whole monorepo. Maz-UI itself is released with it.',
    highlights: [
      'Unified, selective or independent versions, and groups of packages',
      'npm, pnpm, yarn and bun, GitHub and GitLab releases',
      'An MCP server, so AI agents preview a release before it ships',
    ],
    stack: ['VitePress', 'Maz-UI', 'TypeScript', 'Node.js', 'MCP'],
    github: 'https://github.com/LouisMazel/relizy',
    image: {
      light: '/img/made-with/relizy-light.webp',
      dark: '/img/made-with/relizy-dark.webp',
    },
  },
  {
    id: 'throw',
    name: 'Throw',
    url: 'https://throw.maz-ui.com',
    kind: 'Web app · Computer vision',
    year: '2026',
    tagline: 'You throw, the phone keeps the score',
    description: 'Set your phone in front of the dartboard: Throw finds every dart and counts the score. The vision models run in the browser, on the device, with no server and no extra hardware.',
    highlights: [
      '501, cricket, Shanghai and Capital, with friends or online',
      '71 to 96 ms per inference with WebGPU on an iPhone',
      'Its own YOLO pose models, trained and benchmarked over seven generations',
    ],
    stack: ['Nuxt', 'Maz-UI', 'ONNX Runtime Web', 'WebGPU', 'YOLO', 'PWA'],
    image: {
      light: '/img/made-with/throw-light.webp',
      dark: '/img/made-with/throw-dark.webp',
    },
  },
  {
    id: 'lirose',
    name: 'Lirose',
    url: 'https://lirose.loicmazuel.com',
    kind: 'Web app · AI assistant',
    year: '2026',
    status: 'Invite only',
    tagline: 'The right offers, and the application that goes with them',
    description: 'Lirose reads the job sites for you, picks the offers that match your profile and prepares a CV and a cover letter from your real experience, without making anything up. You read them again, you apply.',
    highlights: [
      'About ten job sites merged into a single queue, with no duplicates',
      'Every offer scored from 0 to 100 against the profile, with the reasons',
      'Six verification layers so the model never invents an experience',
    ],
    stack: ['Nuxt', 'Maz-UI', 'Claude', 'Zod', 'Drizzle', 'Telegram'],
    image: {
      light: '/img/made-with/lirose-light.webp',
      dark: '/img/made-with/lirose-dark.webp',
    },
  },
  {
    id: 'panenk',
    name: 'Panenk.app',
    url: 'https://panenk.app',
    kind: 'Web app · Football predictions',
    year: '2021',
    tagline: 'Football predictions between friends, in real time',
    description: 'Predict every match, follow a leaderboard that moves with each goal and tease your team. Free, without ads and without an app to install.',
    highlights: [
      'Create a league and invite your friends',
      '38 competitions followed live, from Ligue 1 to the World Cup',
      'A leaderboard that updates to the second',
    ],
    stack: ['Nuxt', 'Maz-UI', 'NestJS', 'GraphQL', 'Docker'],
    image: {
      light: '/img/made-with/panenk-light.webp',
      dark: '/img/made-with/panenk-dark.webp',
    },
  },
  {
    id: 'loicmazuel',
    name: 'loicmazuel.com',
    url: 'https://www.loicmazuel.com',
    kind: 'Website · Freelance portfolio',
    year: '2019',
    tagline: 'The home of the author of Maz-UI',
    description: 'The website of Loïc Mazuel, full stack developer and AI engineer, freelance since 2019. Case studies, open source libraries, resume and contact, in French and English.',
    highlights: [
      'Case studies of the products on this page',
      'Live GitHub and npm stats of maz-ui and relizy',
      'Light and dark themes, like the rest of Maz-UI',
    ],
    stack: ['Nuxt', 'Maz-UI', 'TypeScript', 'Prisma', 'i18n'],
    image: {
      light: '/img/made-with/loicmazuel-light.webp',
      dark: '/img/made-with/loicmazuel-dark.webp',
    },
  },
  {
    id: 'vue-smart-list-ui',
    name: 'Vue Smart List UI',
    url: 'https://louismazel.github.io/vue-smart-list-ui/',
    kind: 'Open source · Demo',
    year: '2020',
    tagline: 'A smart interface for lists of data',
    description: 'Display a list of data, filter it, sort it and search it, then open the details of each item.',
    highlights: [
      'Filters, sorting and search on the same list',
      'A details view for each item',
    ],
    stack: ['Vue', 'Maz-UI'],
    github: 'https://github.com/LouisMazel/vue-smart-list-ui',
    image: {
      light: '/img/made-with/vue-smart-list-ui.webp',
      dark: '/img/made-with/vue-smart-list-ui.webp',
    },
  },
]
