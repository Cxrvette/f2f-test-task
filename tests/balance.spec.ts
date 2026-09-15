import { test, expect } from '@playwright/test'
import { createAndLogin, openBalanceModal, topUp } from './helpers'

test.describe('Баланс', () => {
  test.beforeEach(async ({ page, request }) => {
    await createAndLogin(page, request)
  })

  test('Critical: баланс увеличивается после пополнения', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Balance: 0' })).toBeVisible()
    await topUp(page, 500)

    await expect(page.getByRole('heading', { name: 'Balance: 500' })).toBeVisible()
    await expect(page.locator('tbody tr').filter({ hasText: '500' })).toContainText('deposit')
  })

  for (const amount of [0, -100]) {
    test(`High: пополнение на ${amount} блокируется`, async ({ page }) => {
      await openBalanceModal(page)
      await page.getByPlaceholder('Enter sum').fill(String(amount))
      await page.getByRole('button', { name: 'Add', exact: true }).click()

      await expect(page.getByRole('heading', { name: 'Add balance' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Balance: 0' })).toBeVisible()
    })
  }
})
