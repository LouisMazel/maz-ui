import type { SetupAgentsAction, SetupAgentsChange } from './types'
import { existsSync, readdirSync, readFileSync, rmdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { writeFileAtomic } from './utils'

function isWriteAction(action: SetupAgentsAction): boolean {
  return action === 'create' || action === 'update' || action === 'remove'
}

export class ChangeSet {
  readonly changes: SetupAgentsChange[] = []
  /** Contents written during the run, dry run included: a file changed twice (`.gemini/settings.json`) is read back as changed */
  private readonly written = new Map<string, string>()

  constructor(private readonly rootDir: string, private readonly dryRun: boolean) {}

  private absolute(file: string): string {
    return join(this.rootDir, file)
  }

  /** One change per file: a write is kept over a later no-op, a file created then updated in the run is created */
  private record(change: SetupAgentsChange): void {
    const index = this.changes.findIndex(previous => previous.file === change.file)
    const previous = this.changes[index]

    if (!previous) {
      this.changes.push(change)
      return
    }

    if (isWriteAction(previous.action) && !isWriteAction(change.action))
      return

    this.changes[index] = {
      ...previous,
      ...change,
      action: previous.action === 'create' && change.action === 'update'
        ? 'create'
        : change.action,
    }
  }

  read(file: string): string | undefined {
    if (this.written.has(file))
      return this.written.get(file)

    const path = this.absolute(file)

    return existsSync(path)
      ? readFileSync(path, 'utf8')
      : undefined
  }

  write(file: string, content: string, current: string | undefined, reason?: string): void {
    if (current === content) {
      this.record({ file, action: 'unchanged' })
      return
    }

    this.written.set(file, content)
    this.record({
      file,
      action: current === undefined
        ? 'create'
        : 'update',
      ...(reason
        ? { reason }
        : {}),
    })

    if (!this.dryRun)
      writeFileAtomic(this.absolute(file), content)
  }

  delete(file: string): void {
    this.record({ file, action: 'remove' })

    if (!this.dryRun) {
      rmSync(this.absolute(file), { force: true })
      this.removeEmptyFolders(dirname(file))
    }
  }

  /** Folders left empty by a removed file (`.cursor/`, `.claude/rules/`), up to the root of the project */
  private removeEmptyFolders(folder: string): void {
    for (let current = folder; current !== '.'; current = dirname(current)) {
      const path = this.absolute(current)

      if (!existsSync(path) || readdirSync(path).length > 0)
        return

      rmdirSync(path)
    }
  }

  skip(file: string, reason: string): void {
    this.record({ file, action: 'skip', reason })
  }

  unchanged(file: string, reason: string): void {
    this.record({ file, action: 'unchanged', reason })
  }
}
