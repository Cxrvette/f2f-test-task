import { test, expect } from '@playwright/test'
import { createAndLogin, openBalanceModal, topUp } from './helpers'
import { HeaderComponent } from './pages/HeaderComponent'
import { TransactionsPage } from './pages/TransactionsPage'

test.describe('Баланс', () => {
  test.beforeEach(async ({ page, request }) => {
    await createAndLogin(page, request)
  })

  test('Critical: баланс увеличивается после пополнения', async ({ page }) => {
    const header = new HeaderComponent(page)
    const transactionsPage = new TransactionsPage(page)

    await expect(header.balance).toHaveText('Balance: 0')
    await topUp(page, 500)

    await expect(header.balance).toHaveText('Balance: 500')
    await expect(transactionsPage.transactionByAmount(500)).toContainText('deposit')
  })

  for (const amount of [0, -100]) {
    test(`High: пополнение на ${amount} блокируется`, async ({ page }) => {
      const transactionsPage = new TransactionsPage(page)
      const header = new HeaderComponent(page)

      await openBalanceModal(page)
      await transactionsPage.submitTopUp(amount)

      await expect(transactionsPage.modalTitle).toBeVisible()
      await expect(header.balance).toHaveText('Balance: 0')
    })
  }
})
