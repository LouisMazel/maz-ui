import { redactError, redactSecrets } from '../redactSecrets'

describe('given redactSecrets function', () => {
  describe('when the string contains an npm authToken', () => {
    it('then keeps the first and last characters and masks the middle', () => {
      const input = 'pnpm whoami --registry https://registry.npmjs.org --//registry.npmjs.org/:_authToken=npm_faketokenexample1234'
      const result = redactSecrets(input)
      expect(result).toContain('_authToken=npm_***1234')
      expect(result).not.toContain('faketokenexample1234')
    })
  })

  describe('when a named secret flag carries a long value', () => {
    it('then keeps the ends visible', () => {
      expect(redactSecrets('cmd --token=abcdefgh12345678')).toBe('cmd --token=abcd***5678')
      expect(redactSecrets('cmd --password abcdefgh12345678 --verbose')).toBe('cmd --password abcd***5678 --verbose')
    })
  })

  describe('when a named secret flag carries a short value', () => {
    it('then masks it entirely', () => {
      expect(redactSecrets('cmd --token=secret')).toBe('cmd --token=***')
    })
  })

  describe('when a named secret flag is followed by another flag', () => {
    it('then keeps the following flag untouched', () => {
      expect(redactSecrets('cmd --token --registry https://example.com')).toBe('cmd --token --registry https://example.com')
    })
  })

  describe('when the string contains basic-auth credentials in a URL', () => {
    it('then masks the password and keeps the username', () => {
      expect(redactSecrets('git clone https://user:s3cr3tpass@github.com/repo.git')).toBe('git clone https://user:***@github.com/repo.git')
    })
  })

  describe('when the string contains prefixed provider tokens', () => {
    it('then masks the body and keeps the ends', () => {
      expect(redactSecrets('export NPM_TOKEN=npm_0123456789abcdefABCDEF')).toContain('npm_***CDEF')
      expect(redactSecrets('token ghp_0123456789abcdefABCDEF0123456789')).toContain('ghp_***6789')
      expect(redactSecrets('token gho_0123456789abcdefABCDEF0123456789')).toContain('gho_***6789')
      expect(redactSecrets('token github_pat_0123456789abcdefABCDEF0123')).toContain('gith***0123')
      expect(redactSecrets('token glpat-fakegitlabexample1234')).toContain('glpa***1234')
      expect(redactSecrets('token xoxb-0123456789-abcdef')).toContain('xoxb***cdef')
      expect(redactSecrets('key AKIA0123456789ABCDEF')).toContain('AKIA***CDEF')
      expect(redactSecrets('key sk-0123456789abcdefABCDEF')).toContain('sk-0***CDEF')
    })
  })

  describe('when the string contains a JWT', () => {
    it('then keeps the ends visible', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
      const result = redactSecrets(`Authorization: Bearer ${jwt}`)
      expect(result).toBe('Authorization: Bearer eyJh***sR8U')
      expect(result).not.toContain(jwt)
    })
  })

  describe('when the string contains no secret', () => {
    it('then returns the string unchanged', () => {
      const input = 'pnpm install --frozen-lockfile'
      expect(redactSecrets(input)).toBe(input)
    })
  })
})

describe('given redactError function', () => {
  describe('when the error is null', () => {
    it('then returns it unchanged', () => {
      expect(redactError(null)).toBeNull()
    })
  })

  describe('when the error is not an object', () => {
    it('then returns it unchanged', () => {
      expect(redactError('plain string')).toBe('plain string')
    })
  })

  describe('when the error carries secrets in message, cmd and stack', () => {
    it('then redacts every string property', () => {
      const error = Object.assign(new Error('Command failed: cmd --token=abcdefgh12345678'), {
        cmd: 'cmd --token=abcdefgh12345678',
        stack: 'Error: Command failed: cmd --token=abcdefgh12345678\n    at file',
      })
      const result = redactError(error) as Error & { cmd: string }
      expect(result.message).toBe('Command failed: cmd --token=abcd***5678')
      expect(result.cmd).toBe('cmd --token=abcd***5678')
      expect(result.stack).toContain('--token=abcd***5678')
      expect(result.stack).not.toContain('abcdefgh12345678')
    })
  })

  describe('when the error has non-string redactable properties', () => {
    it('then leaves them untouched', () => {
      const error = Object.assign(new Error('boom'), { cmd: 42, stack: undefined })
      const result = redactError(error) as Error & { cmd: number }
      expect(result.message).toBe('boom')
      expect(result.cmd).toBe(42)
    })
  })

  describe('when the same error is redacted', () => {
    it('then returns the same reference', () => {
      const error = new Error('no secret here')
      expect(redactError(error)).toBe(error)
    })
  })
})
