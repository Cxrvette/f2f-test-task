import { test, expect } from '@playwright/test'
import { createAndLogin, topUp, transfer } from './helpers'

test.describe('Переводы', () => {
  test.beforeEach(async ({ page, request }) => {
    await createAndLogin(page, request)
    await topUp(page, 1000)
  })

  test('Critical: успешный перевод списывает сумму', async ({ page }) => {
    await transfer(page, 300)
    await expect(page.getByText('Transfer completed', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Balance: 700' })).toBeVisible()
  })

  test('Critical: можно перевести весь доступный баланс', async ({ page }) => {
    await transfer(page, 1000)
    await expect(page.getByText('Transfer completed', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Balance: 0' })).toBeVisible()
  })

  test('Critical: перевод больше баланса отклоняется без списания', async ({ page }) => {
    await transfer(page, 1001)
    await expect(page.getByText('Transfer failed. Check your balance.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Balance: 1000' })).toBeVisible()
    await expect(page.getByText('Transfer completed', { exact: true })).not.toBeVisible()
  })

  for (const amount of [0, -100]) {
    test(`${amount < 0 ? 'Critical' : 'High'}: перевод на ${amount} блокируется`, async ({ page }) => {
      await transfer(page, amount)
      await expect(page.getByText('Amount must be greater than zero')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Balance: 1000' })).toBeVisible()
    })
  }

  for (const phone of ['79991234567', '+123456789', '+1234567890123456', '+abcdefghij']) {
    test(`High: невалидный телефон ${phone} отклоняется`, async ({ page }) => {
      await transfer(page, 100, phone)
      await expect(page.locator('.field-error')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Balance: 1000' })).toBeVisible()
    })
  }

  test('High: успешный перевод появляется в истории', async ({ page }) => {
    await transfer(page, 300)
    await expect(page.getByText('Transfer completed', { exact: true })).toBeVisible()
    await page.goto('/transactions')

    const row = page.locator('tbody tr').filter({ hasText: '300' })
    await expect(row).toContainText('withdrawal')
    await expect(row).toContainText('completed')
  })
})
