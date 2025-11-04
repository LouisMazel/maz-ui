import type { GitCommit, ResolvedChangelogConfig } from 'changelogen'
import type { ResolvedChangelogMonorepoConfig } from './config'
import { upperFirst } from '@maz-ui/utils'
import { formatCompareChanges, formatReference } from 'changelogen'
import { convert } from 'convert-gitmoji'
import { fetch } from 'node-fetch-native'

export interface Reference {
  type: 'hash' | 'issue' | 'pull-request'
  value: string
}

const CHANGELOG_RELEASE_HEAD_RE
  // eslint-disable-next-line sonarjs/slow-regex, regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation, regexp/no-misleading-capturing-group
  = /^#{2,}\s+(?:\S.*)?(v?(\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?)).*$/gm

const VERSION_RE = /^v?(\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?)$/

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export async function generateMarkDown(
  commits: GitCommit[],
  config: ResolvedChangelogMonorepoConfig,
) {
  const typeGroups = groupBy(commits, 'type')

  const markdown: string[] = []
  const breakingChanges = []

  // Version Title
  const v
    = config.newVersion
      && config.templates.tagBody.replaceAll('{{newVersion}}', config.newVersion)
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  markdown.push('', `## ${v || `${config.from || ''}...${config.to}`}`, '')

  if (config.repo && config.from && v) {
    markdown.push(formatCompareChanges(v, config as ResolvedChangelogConfig))
  }

  for (const type in config.types) {
    const group = typeGroups[type]
    if (!group || group.length === 0) {
      continue
    }

    if (typeof config.types[type] === 'boolean') {
      continue
    }

    markdown.push('', `### ${config.types[type].title}`, '')
    for (const commit of group.reverse()) {
      const line = formatCommit(commit, config)
      markdown.push(line)
      if (commit.isBreaking) {
        breakingChanges.push(line)
      }
    }
  }

  if (breakingChanges.length > 0) {
    markdown.push('', '#### ⚠️ Breaking Changes', '', ...breakingChanges)
  }

  const _authors = new Map<string, { email: Set<string>, github?: string, name?: string }>()

  for (const commit of commits) {
    if (!commit.author) {
      continue
    }

    const name = formatName(commit.author.name)
    if (!name || name.includes('[bot]')) {
      continue
    }

    if (
      config.excludeAuthors
      && config.excludeAuthors.some(
        v => name.includes(v) || commit.author.email?.includes(v),
      )
    ) {
      continue
    }

    if (_authors.has(name)) {
      const entry = _authors.get(name)
      entry?.email.add(commit.author.email)
    }
    else {
      _authors.set(name, { email: new Set([commit.author.email]), name })
    }
  }

  // Try to map authors to github usernames
  await Promise.all(
    [..._authors.keys()].map(async (authorName) => {
      const meta = _authors.get(authorName)

      if (!meta) {
        return
      }

      for (const data of [...meta.email, meta.name]) {
        const { user } = await fetch(`https://ungh.cc/users/find/${data}`)
          .then(r => r.json() as Promise<{ user: { username?: string } }>)
          .catch(() => ({ user: null }))

        if (user) {
          meta.github = user.username
          break
        }
      }
    }),
  )

  const authors = [..._authors.entries()].map(e => ({
    name: e[0],
    ...e[1],
  }))

  if (authors.length > 0 && !config.noAuthors) {
    markdown.push(
      '',
      '### ' + '❤️ Contributors',
      '',
      ...authors.map((i) => {
        const _email = [...i.email].find(
          e => !e.includes('noreply.github.com'),
        )
        const email
          = config.hideAuthorEmail !== true && _email ? ` <${_email}>` : ''
        const github = i.github
          ? ` ([@${i.github}](https://github.com/${i.github}))`
          : ''
        return `- ${i.name}${github || email || ''}`
      }),
    )
  }

  return convert(markdown.join('\n').trim(), true)
}

export function parseChangelogMarkdown(contents: string) {
  const headings = [...contents.matchAll(CHANGELOG_RELEASE_HEAD_RE)]
  const releases: { version?: string, body: string }[] = []

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i]
    const nextHeading = headings[i + 1]
    const [, title] = heading
    const version = title.match(VERSION_RE)
    const release = {
      version: version ? version[1] : undefined,
      body: contents
        .slice(
          heading.index + heading[0].length,
          nextHeading?.index ?? contents.length,
        )
        .trim(),
    }
    releases.push(release)
  }

  return {
    releases,
  }
}

// --- Internal utils ---

function getCommitBody(commit: GitCommit) {
  if (!commit.body) {
    return ''
  }

  const lines = commit.body.split('\n')

  const contentLines = lines.filter((line) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      return false
    }

    const isFileLine = /^[AMDRC]\s+/.test(trimmedLine)

    return !isFileLine
  })

  if (contentLines.length === 0) {
    return ''
  }

  const indentedBody = contentLines
    .map(line => `  ${line}`)
    .join('\n')

  return `\n\n${indentedBody}\n`
}

function formatCommit(commit: GitCommit, config: ResolvedChangelogMonorepoConfig) {
  const body = config.changelog.includeCommitBody ? getCommitBody(commit) : ''

  return (
    `- ${
      commit.scope ? `**${commit.scope.trim()}:** ` : ''
    }${commit.isBreaking ? '⚠️  ' : ''
    }${upperFirst(commit.description)
    }${formatReferences(commit.references, config)}${body}`
  )
}

function formatReferences(
  references: Reference[],
  config: ResolvedChangelogMonorepoConfig,
) {
  const pr = references.filter(ref => ref.type === 'pull-request')
  const issue = references.filter(ref => ref.type === 'issue')
  if (pr.length > 0 || issue.length > 0) {
    return (
      ` (${
        [...pr, ...issue]
          .map(ref => formatReference(ref, config.repo))
          .join(', ')
      })`
    )
  }
  if (references.length > 0) {
    return ` (${formatReference(references[0], config.repo)})`
  }
  return ''
}

function formatName(name = '') {
  return name
    .split(' ')
    .map(p => upperFirst(p.trim()))
    .join(' ')
}

function groupBy(items: any[], key: string) {
  const groups: Record<string, any[]> = {}
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || []
    groups[item[key]].push(item)
  }
  return groups
}
