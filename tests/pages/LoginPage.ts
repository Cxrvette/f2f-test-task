import type { Locator, Page } from '@playwright/test'
import type { TestUser } from '../helpers'

export class LoginPage {
  readonly title: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly snackbar: Locator

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('login-title')
    this.emailInput = page.getByTestId('login-email')
    this.passwordInput = page.getByTestId('login-password')
    this.submitButton = page.getByTestId('login-submit')
    this.snackbar = page.getByTestId('snackbar')
  }

  async open() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginAs(user: TestUser) {
    await this.open()
    await this.login(user.email, user.password)
  }
}
