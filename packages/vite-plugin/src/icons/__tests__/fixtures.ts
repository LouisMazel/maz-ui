import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

export const X_MARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6l12 12" stroke="currentColor"/></svg>'
export const HOME_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 12 12 3l9 9"/></svg>'
export const HERO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120"><rect width="240" height="120" fill="#7dd3fc"/></svg>'

export function write(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

export interface ProjectFixture {
  /** Where `@maz-ui/icons` is installed: in `maz-ui` (pnpm strict), at the root, or nowhere */
  icons?: 'maz-ui' | 'root' | 'none'
  files?: Record<string, string>
}

/** A project with `maz-ui` and a fake `@maz-ui/icons` (`x-mark`, `home`, the raw module of `MazHome`) */
export function createProject({ icons = 'maz-ui', files = {} }: ProjectFixture = {}): string {
  // Resolved: Node resolves the symlinks of the temporary folder (`/var` is `/private/var` on macOS)
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'maz-icons-')))
  write(join(root, 'package.json'), '{"name":"app","type":"module"}')
  write(join(root, 'node_modules/maz-ui/package.json'), '{"name":"maz-ui","version":"5.7.0"}')

  if (icons !== 'none') {
    const packageDir = icons === 'maz-ui'
      ? join(root, 'node_modules/maz-ui/node_modules/@maz-ui/icons')
      : join(root, 'node_modules/@maz-ui/icons')

    write(join(packageDir, 'package.json'), '{"name":"@maz-ui/icons","version":"5.7.0"}')
    write(join(packageDir, 'icon-names.json'), JSON.stringify({ 'home': 'svg/home.svg', 'x-mark': 'svg/x-mark.svg' }))
    write(join(packageDir, 'svg/x-mark.svg'), X_MARK_SVG)
    write(join(packageDir, 'svg/home.svg'), HOME_SVG)
    write(join(packageDir, 'dist/raw/MazHome.js'), 'export const MazHome = ""')
  }

  for (const [file, content] of Object.entries(files))
    write(join(root, file), content)

  return root
}
