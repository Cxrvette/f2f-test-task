import { test, expect } from '@playwright/test'
import { createAndLogin, topUp, transfer } from './helpers'
import { HeaderComponent } from './pages/HeaderComponent'
import { TransactionsPage } from './pages/TransactionsPage'
import { TransferPage } from './pages/TransferPage'

test.describe('Переводы', () => {
  test.beforeEach(async ({ page, request }) => {
    await createAndLogin(page, request)
    await topUp(page, 1000)
  })

  test('Critical: успешный перевод списывает сумму', async ({ page }) => {
    const transferPage = new TransferPage(page)
    const header = new HeaderComponent(page)
    await transfer(page, 300)
    await expect(transferPage.successMessage).toHaveText('Transfer completed')
    await expect(header.balance).toHaveText('Balance: 700')
  })

  test('Critical: можно перевести весь доступный баланс', async ({ page }) => {
    const transferPage = new TransferPage(page)
    const header = new HeaderComponent(page)
    await transfer(page, 1000)
    await expect(transferPage.successMessage).toHaveText('Transfer completed')
    await expect(header.balance).toHaveText('Balance: 0')
  })

  test('Critical: перевод больше баланса отклоняется без списания', async ({ page }) => {
    const transferPage = new TransferPage(page)
    const header = new HeaderComponent(page)
    await transfer(page, 1001)
    await expect(transferPage.snackbar).toHaveText('Transfer failed. Check your balance.')
    await expect(header.balance).toHaveText('Balance: 1000')
    await expect(transferPage.successMessage).not.toBeVisible()
  })

  for (const amount of [0, -100]) {
    test(`${amount < 0 ? 'Critical' : 'High'}: перевод на ${amount} блокируется`, async ({ page }) => {
      const transferPage = new TransferPage(page)
      const header = new HeaderComponent(page)
      await transfer(page, amount)
      await expect(transferPage.snackbar).toHaveText('Amount must be greater than zero')
      await expect(header.balance).toHaveText('Balance: 1000')
    })
  }

  for (const phone of ['79991234567', '+123456789', '+1234567890123456', '+abcdefghij']) {
    test(`High: невалидный телефон ${phone} отклоняется`, async ({ page }) => {
      const transferPage = new TransferPage(page)
      const header = new HeaderComponent(page)
      await transfer(page, 100, phone)
      await expect(transferPage.fieldError).toBeVisible()
      await expect(header.balance).toHaveText('Balance: 1000')
    })
  }

  test('High: успешный перевод появляется в истории', async ({ page }) => {
    const transferPage = new TransferPage(page)
    const transactionsPage = new TransactionsPage(page)
    await transfer(page, 300)
    await expect(transferPage.successMessage).toHaveText('Transfer completed')
    await transactionsPage.open()

    const row = transactionsPage.transactionByAmount(300)
    await expect(row).toContainText('withdrawal')
    await expect(row).toContainText('completed')
  })
})
