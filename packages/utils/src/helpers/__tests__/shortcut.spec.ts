import { formatShortcut, matchesShortcut, parseShortcut } from '../shortcut.ts'

function keyEvent(init: KeyboardEventInit) {
  return new KeyboardEvent('keydown', init)
}

describe('given the parseShortcut function', () => {
  describe('when the shortcut has modifiers and a key', () => {
    it('then it returns the flags and the lowercase key', () => {
      expect(parseShortcut('Mod+Shift+K')).toEqual({ mod: true, ctrl: false, meta: false, alt: false, shift: true, key: 'k' })
    })

    it('then it resolves the aliases', () => {
      expect(parseShortcut('cmd+option+esc')).toMatchObject({ meta: true, alt: true, key: 'escape' })
      expect(parseShortcut('control+space')).toMatchObject({ ctrl: true, key: ' ' })
    })

    it('then it supports the plus key', () => {
      expect(parseShortcut('mod++')).toMatchObject({ mod: true, key: '+' })
    })
  })
})

describe('given the matchesShortcut function', () => {
  describe('when the layout is AZERTY', () => {
    it('then ctrl+w (physical KeyZ) does not trigger mod+z', () => {
      expect(matchesShortcut(keyEvent({ key: 'w', code: 'KeyZ', ctrlKey: true }), 'mod+z', { apple: false })).toBe(false)
    })

    it('then ctrl+z (physical KeyW) triggers mod+z', () => {
      expect(matchesShortcut(keyEvent({ key: 'z', code: 'KeyW', ctrlKey: true }), 'mod+z', { apple: false })).toBe(true)
    })

    it('then a digit matches through the physical code', () => {
      expect(matchesShortcut(keyEvent({ key: '&', code: 'Digit1', ctrlKey: true }), 'mod+1', { apple: false })).toBe(true)
    })
  })

  describe('when the key is not an ASCII character', () => {
    it('then it falls back on the physical letter code', () => {
      expect(matchesShortcut(keyEvent({ key: 'я', code: 'KeyZ', ctrlKey: true }), 'mod+z', { apple: false })).toBe(true)
    })
  })

  describe('when the platform is apple', () => {
    it('then mod is the meta key', () => {
      expect(matchesShortcut(keyEvent({ key: 'k', metaKey: true }), 'mod+k', { apple: true })).toBe(true)
      expect(matchesShortcut(keyEvent({ key: 'k', ctrlKey: true }), 'mod+k', { apple: true })).toBe(false)
    })
  })

  describe('when the platform is not apple', () => {
    it('then mod is the ctrl key', () => {
      expect(matchesShortcut(keyEvent({ key: 'k', ctrlKey: true }), 'mod+k', { apple: false })).toBe(true)
      expect(matchesShortcut(keyEvent({ key: 'k', metaKey: true }), 'mod+k', { apple: false })).toBe(false)
    })
  })

  describe('when an extra modifier is pressed', () => {
    it('then the shortcut does not match', () => {
      expect(matchesShortcut(keyEvent({ key: 'k', ctrlKey: true, shiftKey: true }), 'ctrl+k')).toBe(false)
    })
  })

  describe('when the key is a digit typed with alt', () => {
    it('then it falls back on the physical key code', () => {
      expect(matchesShortcut(keyEvent({ key: '¡', code: 'Digit1', altKey: true }), 'alt+1')).toBe(true)
    })
  })

  describe('when the shortcut is a parsed shortcut', () => {
    it('then it matches the same way', () => {
      expect(matchesShortcut(keyEvent({ key: 'Escape' }), parseShortcut('esc'))).toBe(true)
    })
  })

  describe('when the key is a symbol typed with shift', () => {
    it('then the shortcut without shift matches', () => {
      expect(matchesShortcut(keyEvent({ key: '?', code: 'Slash', shiftKey: true }), '?')).toBe(true)
    })

    it('then a letter shortcut still needs the exact shift state', () => {
      expect(matchesShortcut(keyEvent({ key: 'K', code: 'KeyK', shiftKey: true }), 'k')).toBe(false)
    })
  })

  describe('when the shortcut names the unshifted symbol with shift', () => {
    it('then it matches through the physical code', () => {
      expect(matchesShortcut(keyEvent({ key: '?', code: 'Slash', shiftKey: true }), 'shift+/')).toBe(true)
      expect(matchesShortcut(keyEvent({ key: '{', code: 'BracketLeft', ctrlKey: true, shiftKey: true }), 'mod+shift+[', { apple: false })).toBe(true)
    })

    it('then shift stays required', () => {
      expect(matchesShortcut(keyEvent({ key: '/', code: 'Slash' }), 'shift+/')).toBe(false)
    })
  })

  describe('when the key differs', () => {
    it('then it does not match', () => {
      expect(matchesShortcut(keyEvent({ key: 'j', ctrlKey: true }), 'ctrl+k')).toBe(false)
    })
  })
})

describe('given the formatShortcut function', () => {
  describe.each([
    ['mod+1', true, '⌘1'],
    ['mod+1', false, 'Ctrl+1'],
    ['mod+shift+s', true, '⇧⌘S'],
    ['mod+shift+s', false, 'Ctrl+Shift+S'],
    ['ctrl+alt+k', true, '⌃⌥K'],
    ['ctrl+alt+k', false, 'Ctrl+Alt+K'],
    ['mod+enter', true, '⌘↵'],
    ['mod+enter', false, 'Ctrl+Enter'],
    ['esc', false, 'Esc'],
    ['meta+k', false, 'Win+K'],
  ])('when the shortcut is %s (apple: %s)', (shortcut, apple, expected) => {
    it(`then the label is ${expected}`, () => {
      expect(formatShortcut(shortcut, { apple })).toBe(expected)
    })
  })

  describe('when the platform is not forced', () => {
    it('then it uses the platform of the browser', () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: '' })

      expect(formatShortcut('mod+1')).toBe('⌘1')

      vi.unstubAllGlobals()
    })
  })
})
