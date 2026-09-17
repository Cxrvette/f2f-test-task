import type { Locator, Page } from '@playwright/test'

export class TransferPage {
  readonly title: Locator
  readonly phoneInput: Locator
  readonly amountInput: Locator
  readonly purposeInput: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly fieldError: Locator
  readonly snackbar: Locator

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('transfer-title')
    this.phoneInput = page.getByTestId('transfer-phone')
    this.amountInput = page.getByTestId('transfer-amount')
    this.purposeInput = page.getByTestId('transfer-purpose')
    this.submitButton = page.getByTestId('transfer-submit')
    this.successMessage = page.getByTestId('transfer-success')
    this.fieldError = page.getByTestId('phone-error')
    this.snackbar = page.getByTestId('snackbar')
  }

  async open() {
    await this.page.goto('/')
  }

  async transfer(amount: number, phone = '+7 999 123-45-67', purpose = 'E2E transfer') {
    await this.open()
    await this.phoneInput.fill(phone)
    await this.amountInput.fill(String(amount))
    await this.purposeInput.fill(purpose)
    await this.submitButton.click()
  }
}
