import type { Locator, Page } from '@playwright/test'

export class TransactionsPage {
  readonly title: Locator
  readonly addBalanceButton: Locator
  readonly modalTitle: Locator
  readonly amountInput: Locator
  readonly confirmButton: Locator
  readonly rows: Locator

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('transactions-title')
    this.addBalanceButton = page.getByTestId('open-balance-modal')
    this.modalTitle = page.getByTestId('balance-modal-title')
    this.amountInput = page.getByTestId('balance-amount')
    this.confirmButton = page.getByTestId('balance-submit')
    this.rows = page.getByTestId('transaction-row')
  }

  async open() {
    await this.page.goto('/transactions')
  }

  async openBalanceModal() {
    await this.open()
    await this.addBalanceButton.click()
  }

  async submitTopUp(amount: number) {
    await this.amountInput.fill(String(amount))
    await this.confirmButton.click()
  }

  transactionByAmount(amount: number) {
    return this.rows.filter({ hasText: String(amount) })
  }
}
