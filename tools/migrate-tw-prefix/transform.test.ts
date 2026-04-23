import { describe, expect, it } from 'vitest'
import {
  transformClassToken,
  transformCssFile,
  transformText,
  transformVueFile,
} from './transform'

describe('transformClassToken', () => {
  describe('Given a simple Tailwind class with maz- prefix', () => {
    describe('When transforming', () => {
      it('prefixes with maz: using the v4 syntax', () => {
        expect(transformClassToken('maz-flex')).toBe('maz:flex')
        expect(transformClassToken('maz-p-4')).toBe('maz:p-4')
        expect(transformClassToken('maz-bg-primary')).toBe('maz:bg-primary')
      })
    })
  })

  describe('Given a class with a single variant', () => {
    describe('When transforming', () => {
      it('moves maz: before the variant', () => {
        expect(transformClassToken('dark:maz-border')).toBe('maz:dark:border')
        expect(transformClassToken('hover:maz-bg-primary')).toBe('maz:hover:bg-primary')
        expect(transformClassToken('focus:maz-outline-none')).toBe('maz:focus:outline-hidden')
      })
    })
  })

  describe('Given a class with multiple variants', () => {
    describe('When transforming', () => {
      it('preserves variant order and prefixes with maz:', () => {
        expect(transformClassToken('dark:hover:maz-text-primary')).toBe('maz:dark:hover:text-primary')
        expect(transformClassToken('group-hover:focus:maz-opacity-50')).toBe(
          'maz:group-hover:focus:opacity-50',
        )
      })
    })
  })

  describe('Given the important modifier prefix', () => {
    describe('When transforming', () => {
      it('moves ! to the suffix position', () => {
        expect(transformClassToken('!maz-m-0')).toBe('maz:m-0!')
        expect(transformClassToken('!maz-p-4')).toBe('maz:p-4!')
      })
    })
  })

  describe('Given the important modifier combined with variants', () => {
    describe('When transforming', () => {
      it('keeps variants before and puts ! at the end', () => {
        expect(transformClassToken('!dark:maz-opacity-50')).toBe('maz:dark:opacity-50!')
        expect(transformClassToken('dark:!maz-opacity-50')).toBe('maz:dark:opacity-50!')
      })
    })
  })

  describe('Given a v3 utility that has been renamed in v4', () => {
    describe('When transforming', () => {
      it('renames to the v4 utility name', () => {
        expect(transformClassToken('maz-rounded-sm')).toBe('maz:rounded-xs')
        expect(transformClassToken('maz-outline-none')).toBe('maz:outline-hidden')
        expect(transformClassToken('maz-backdrop-blur-sm')).toBe('maz:backdrop-blur-xs')
        expect(transformClassToken('maz-bg-gradient-to-r')).toBe('maz:bg-linear-to-r')
        expect(transformClassToken('maz-bg-gradient-to-bl')).toBe('maz:bg-linear-to-bl')
      })
    })
  })

  describe('Given the bare shadow utility without suffix', () => {
    describe('When transforming', () => {
      it('promotes to shadow-sm to preserve v3 visual', () => {
        expect(transformClassToken('maz-shadow')).toBe('maz:shadow-sm')
      })
    })
  })

  describe('Given a shadow utility with an explicit size suffix', () => {
    describe('When transforming', () => {
      it('leaves the size suffix unchanged', () => {
        expect(transformClassToken('maz-shadow-lg')).toBe('maz:shadow-lg')
        expect(transformClassToken('maz-shadow-none')).toBe('maz:shadow-none')
      })
    })
  })

  describe('Given a class with fraction or slash', () => {
    describe('When transforming', () => {
      it('preserves the slash in the utility', () => {
        expect(transformClassToken('maz-w-1/2')).toBe('maz:w-1/2')
        expect(transformClassToken('maz-h-2/3')).toBe('maz:h-2/3')
      })
    })
  })

  describe('Given a class with an arbitrary value', () => {
    describe('When transforming', () => {
      it('preserves bracket syntax', () => {
        expect(transformClassToken('maz-w-[100px]')).toBe('maz:w-[100px]')
        expect(transformClassToken('maz-grid-cols-[1fr_2fr]')).toBe('maz:grid-cols-[1fr_2fr]')
      })
    })
  })

  describe('Given an arbitrary value with a variant', () => {
    describe('When transforming', () => {
      it('moves the prefix and keeps the brackets', () => {
        expect(transformClassToken('md:maz-w-[200px]')).toBe('maz:md:w-[200px]')
      })
    })
  })

  describe('Given a non-maz class', () => {
    describe('When transforming', () => {
      it('returns the token unchanged', () => {
        expect(transformClassToken('flex')).toBe('flex')
        expect(transformClassToken('text-red-500')).toBe('text-red-500')
        expect(transformClassToken('my-custom-class')).toBe('my-custom-class')
      })
    })
  })
})

describe('transformText', () => {
  describe('Given a class list as a plain string', () => {
    describe('When transforming', () => {
      it('transforms each maz- token and preserves whitespace', () => {
        expect(transformText('maz-flex maz-p-4 dark:maz-text-white')).toBe(
          'maz:flex maz:p-4 maz:dark:text-white',
        )
      })
    })
  })

  describe('Given mixed maz- and non-maz classes', () => {
    describe('When transforming', () => {
      it('only transforms maz- tokens', () => {
        expect(transformText('maz-flex custom-class maz-p-4')).toBe(
          'maz:flex custom-class maz:p-4',
        )
      })
    })
  })

  describe('Given a string containing maz-ui (the package name)', () => {
    describe('When transforming', () => {
      it('leaves maz-ui unchanged as it is not a Tailwind utility', () => {
        expect(transformText('import from "maz-ui"')).toBe('import from "maz-ui"')
        expect(transformText('@maz-ui/cli')).toBe('@maz-ui/cli')
      })
    })
  })

  describe('Given @apply directives in CSS text', () => {
    describe('When transforming', () => {
      it('transforms the classes on the @apply line', () => {
        expect(transformText('@apply maz-flex maz-p-4;')).toBe('@apply maz:flex maz:p-4;')
      })
    })
  })
})

describe('transformVueFile', () => {
  describe('Given a Vue SFC with class attributes in the template', () => {
    describe('When transforming', () => {
      it('transforms classes in the template', () => {
        const input = `<template>
  <div class="maz-flex maz-p-4">
    <span class="dark:maz-text-white">hello</span>
  </div>
</template>`
        const expected = `<template>
  <div class="maz:flex maz:p-4">
    <span class="maz:dark:text-white">hello</span>
  </div>
</template>`
        expect(transformVueFile(input)).toBe(expected)
      })
    })
  })

  describe('Given a Vue SFC with @apply in the style block', () => {
    describe('When transforming', () => {
      it('transforms classes in the style block', () => {
        const input = `<template>
  <div class="wrapper"></div>
</template>

<style scoped>
.wrapper {
  @apply maz-flex maz-p-4;
}
</style>`
        const expected = `<template>
  <div class="wrapper"></div>
</template>

<style scoped>
.wrapper {
  @apply maz:flex maz:p-4;
}
</style>`
        expect(transformVueFile(input)).toBe(expected)
      })
    })
  })

  describe('Given a Vue SFC with a script importing maz-ui', () => {
    describe('When transforming', () => {
      it('does not transform the import statement', () => {
        const input = `<script setup lang="ts">
import { MazBtn } from 'maz-ui/components'
</script>

<template>
  <MazBtn class="maz-flex">Hello</MazBtn>
</template>`
        const expected = `<script setup lang="ts">
import { MazBtn } from 'maz-ui/components'
</script>

<template>
  <MazBtn class="maz:flex">Hello</MazBtn>
</template>`
        expect(transformVueFile(input)).toBe(expected)
      })
    })
  })

  describe('Given a :class binding with maz- classes in an object', () => {
    describe('When transforming', () => {
      it('transforms the class keys inside the binding', () => {
        const input = `<template>
  <div :class="{ 'maz-bg-primary': isActive, 'maz-text-white': true }"></div>
</template>`
        const expected = `<template>
  <div :class="{ 'maz:bg-primary': isActive, 'maz:text-white': true }"></div>
</template>`
        expect(transformVueFile(input)).toBe(expected)
      })
    })
  })

  describe('Given a v3 important modifier in the template', () => {
    describe('When transforming', () => {
      it('moves ! to the suffix position', () => {
        const input = `<template>
  <div class="!maz-m-0 maz-p-4"></div>
</template>`
        const expected = `<template>
  <div class="maz:m-0! maz:p-4"></div>
</template>`
        expect(transformVueFile(input)).toBe(expected)
      })
    })
  })
})

describe('transformCssFile', () => {
  describe('Given a CSS file with @apply directives', () => {
    describe('When transforming', () => {
      it('transforms all maz- classes on @apply lines', () => {
        const input = `.container {
  @apply maz-flex maz-p-4;
}

.button {
  @apply hover:maz-bg-primary !maz-m-0;
}`
        const expected = `.container {
  @apply maz:flex maz:p-4;
}

.button {
  @apply maz:hover:bg-primary maz:m-0!;
}`
        expect(transformCssFile(input)).toBe(expected)
      })
    })
  })
})
