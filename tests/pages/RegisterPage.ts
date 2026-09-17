import type { Locator, Page } from '@playwright/test'
import type { TestUser } from '../helpers'

export class RegisterPage {
  readonly nameInput: Locator
  readonly surnameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly error: Locator

  constructor(private readonly page: Page) {
    this.nameInput = page.getByTestId('register-name')
    this.surnameInput = page.getByTestId('register-surname')
    this.emailInput = page.getByTestId('register-email')
    this.passwordInput = page.getByTestId('register-password')
    this.submitButton = page.getByTestId('register-submit')
    this.error = page.getByTestId('register-error')
  }

  async open() {
    await this.page.goto('/register')
  }

  async register(user: TestUser) {
    await this.open()
    await this.nameInput.fill(user.name)
    await this.surnameInput.fill(user.surname)
    await this.emailInput.fill(user.email)
    await this.passwordInput.fill(user.password)
    await this.submitButton.click()
  }

  async submitEmptyForm() {
    await this.open()
    await this.submitButton.click()
  }
}
