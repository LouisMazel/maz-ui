import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const BLOCKS = [
  'btn',
  'input',
  'select',
  'checkbox',
  'radio',
  'switch',
  'card',
  'tabs',
  'segmented',
  'badge',
  'alert',
  'avatar',
  'pagination',
  'stepper',
  'table',
  'datepicker',
  'textarea',
  'input-tags',
  'slider',
  'accordion',
  'progress-bar',
  'skeleton',
] as const

const FROZEN_STYLE = `
  :root { --maz-motion-scale: 0 !important; }
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
  }
`

async function open(page: Page, projectName: string) {
  const dir = projectName.endsWith('rtl')
    ? 'rtl'
    : 'ltr'

  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => route.abort())
  await page.goto(`/visual?dir=${dir}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => {
    const app = (globalThis as unknown as { useNuxtApp?: () => { isHydrating: boolean } }).useNuxtApp?.()
    return !!app && !app.isHydrating
  })
  await page.addStyleTag({ content: FROZEN_STYLE })
  await page.evaluate(() => document.fonts.ready)
}

test.beforeEach(async ({ page }, testInfo) => {
  await open(page, testInfo.project.name)

  const isDark = testInfo.project.name.startsWith('dark')
  await expect(page.locator('html')).toHaveClass(isDark ? /dark/ : /^(?!.*dark)/)
})

for (const block of BLOCKS) {
  test(`block ${block}`, async ({ page }) => {
    await expect(page.locator(`[data-visual="${block}"]`)).toHaveScreenshot(`${block}.png`)
  })
}

test('overlay select open', async ({ page }) => {
  const block = page.locator('[data-visual="select-open"]')
  await block.scrollIntoViewIfNeeded()
  await block.locator('input').first().click()
  await expect(page.getByRole('option', { name: 'Nuxt' })).toBeVisible()
  await expect(page).toHaveScreenshot('select-open.png', { clip: (await block.boundingBox()) ?? undefined })
})

test('overlay dropdown open', async ({ page }) => {
  const block = page.locator('[data-visual="dropdown"]')
  await block.getByText('Actions').click()
  await expect(page.getByText('Archive', { exact: true })).toBeVisible()
  await expect(block).toHaveScreenshot('dropdown-open.png')
})

test('overlay dialog open', async ({ page }) => {
  await page.getByTestId('open-dialog').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveScreenshot('dialog-open.png')
})

test('overlay drawer open', async ({ page }) => {
  await page.getByTestId('open-drawer').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveScreenshot('drawer-open.png')
})
