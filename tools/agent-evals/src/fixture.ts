import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, statSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

/** The packages the app installs, linked to the ones of the repository (built) */
export const LINKED_PACKAGES: Record<string, string> = {
  'maz-ui': 'packages/maz-ui',
  '@maz-ui/icons': 'packages/icons',
  '@maz-ui/mcp': 'packages/mcp',
  '@maz-ui/themes': 'packages/themes',
  '@maz-ui/translations': 'packages/translations',
  '@maz-ui/utils': 'packages/utils',
  '@maz-ui/vite-plugin': 'packages/vite-plugin',
}

/** The tools of the app (`vite build`, `vue-tsc`), linked to the ones of agent-evals */
export const LINKED_TOOLS = ['@tailwindcss/vite', '@vitejs/plugin-vue', 'tailwindcss', 'typescript', 'vite', 'vue-tsc']

/** Their commands, for the agent: `node_modules/.bin/<name>` */
const TOOL_BINS: Record<string, string> = {
  'tsc': 'typescript/bin/tsc',
  'vite': 'vite/bin/vite.js',
  'vue-tsc': 'vue-tsc/bin/vue-tsc.js',
}

/** Files of the app the agent may change: the review and the patterns only read these */
export const SOURCE_FILE = /\.(?:vue|[cm]?[jt]sx?|css)$/

function git(cwd: string, args: string[]): string {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- the git of the machine, in a temporary folder
  return execFileSync('git', ['-c', 'user.name=agent-evals', '-c', 'user.email=agent-evals@maz-ui.com', ...args], { cwd, encoding: 'utf8' })
}

function isTestFile(file: string): boolean {
  return file.includes('/__tests__/') || file.endsWith('.spec.ts')
}

/** Last change of the files of a folder, tests excepted, `0` without it */
function lastChange(directory: string): number {
  if (!existsSync(directory))
    return 0

  return Math.max(0, ...readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && !isTestFile(join(entry.parentPath, entry.name)))
    .map(entry => statSync(join(entry.parentPath, entry.name)).mtimeMs))
}

/** The packages of the repository the agent needs, not built or built before the last change of their sources */
export function checkBuilt(repoRoot: string): string[] {
  const missing = [
    'packages/maz-ui/dist',
    'packages/maz-ui/agent-docs/agents/session-context.md',
    'packages/mcp/dist',
  ].filter(path => !existsSync(join(repoRoot, path)))
  const stale = Object.values(LINKED_PACKAGES)
    .filter(path => existsSync(join(repoRoot, path, 'dist')) && lastChange(join(repoRoot, path, 'src')) > lastChange(join(repoRoot, path, 'dist')))
    .map(path => `${path}/dist (older than its sources)`)

  return [...missing, ...stale]
}

/**
 * A new Vue app that uses maz-ui, in a temporary folder: the template of `fixture/`, its `node_modules` linked to the
 * packages of the repository, to their Vue and to the build tools of agent-evals, and a first git commit (the review reads the changes from it). Without
 * `mcp`, the app does not install `@maz-ui/mcp`.
 */
export function createFixture(repoRoot: string, templateDir: string, { parent = tmpdir(), mcp = true } = {}): string {
  const directory = realpathSync(mkdtempSync(join(parent, 'maz-ui-eval-')))

  cpSync(templateDir, directory, { recursive: true })

  const packages = Object.entries(LINKED_PACKAGES).filter(([name]) => mcp || name !== '@maz-ui/mcp')
  const links = {
    ...Object.fromEntries(packages.map(([name, path]) => [name, join(repoRoot, path)])),
    vue: realpathSync(join(repoRoot, 'packages/maz-ui/node_modules/vue')),
    ...Object.fromEntries(LINKED_TOOLS.map(name => [name, realpathSync(join(repoRoot, 'tools/agent-evals/node_modules', name))])),
  }

  for (const [name, target] of Object.entries(links)) {
    const link = join(directory, 'node_modules', name)

    mkdirSync(dirname(link), { recursive: true })
    symlinkSync(target, link, 'dir')
  }

  const bins = {
    ...Object.fromEntries(Object.entries(TOOL_BINS).map(([name, path]) => [name, join(directory, 'node_modules', path)])),
    ...(mcp ? { 'maz-ui-mcp': join(repoRoot, 'packages/mcp/bin/maz-ui-mcp.mjs') } : {}),
  }

  mkdirSync(join(directory, 'node_modules/.bin'))

  for (const [name, target] of Object.entries(bins)) symlinkSync(target, join(directory, 'node_modules/.bin', name))

  if (!mcp) {
    const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')) as { devDependencies: Record<string, string> }

    delete manifest.devDependencies['@maz-ui/mcp']
    writeFileSync(join(directory, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  }

  git(directory, ['init', '-q'])
  commitAll(directory, 'initial app')

  return directory
}

/** Commits the files of the app: the changes of the agent are the ones after it */
export function commitAll(directory: string, message: string): void {
  git(directory, ['add', '-A'])
  git(directory, ['commit', '-q', '--allow-empty', '-m', message])
}

/** The source files the agent created or changed since the first commit, relative to the app */
export function changedFiles(directory: string): string[] {
  const entries = git(directory, ['status', '--porcelain', '-z', '--untracked-files=all']).split('\0').filter(Boolean)
  const files: string[] = []

  for (let index = 0; index < entries.length; index++) {
    const status = entries[index].slice(0, 2)

    if (!status.includes('D'))
      files.push(entries[index].slice(3))

    // A rename or a copy is followed by its old path
    if (/[RC]/.test(status))
      index++
  }

  return files
    .filter(file => SOURCE_FILE.test(file) && !file.startsWith('node_modules/') && !file.endsWith('.d.ts'))
    .sort()
}

export function readSources(directory: string, files: string[]): Record<string, string> {
  return Object.fromEntries(files.map(file => [file, readFileSync(join(directory, file), 'utf8')]))
}
