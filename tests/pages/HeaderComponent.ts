import type { Locator, Page } from '@playwright/test'

export class HeaderComponent {
  readonly balance: Locator
  readonly transactionsLink: Locator

  constructor(page: Page) {
    this.balance = page.getByTestId('header-balance')
    this.transactionsLink = page.getByTestId('transactions-link')
  }
}
