import { expect, type APIRequestContext, type Page } from '@playwright/test'
import { HeaderComponent } from './pages/HeaderComponent'
import { LoginPage } from './pages/LoginPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { TransferPage } from './pages/TransferPage'

export const PASSWORD = 'Password123!'

export type TestUser = {
  name: string
  surname: string
  email: string
  password: string
}

export function uniqueUser(prefix = 'user'): TestUser {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    name: 'Test',
    surname: 'User',
    email: `${prefix.slice(0, 10)}-${suffix}@t.io`,
    password: PASSWORD,
  }
}

export async function registerViaApi(request: APIRequestContext, user = uniqueUser()) {
  const response = await request.post('/api/auth/register', {
    data: { ...user, role: 'user' },
  })
  expect(response.status(), await response.text()).toBe(201)
  return user
}

export async function loginViaUi(page: Page, user: TestUser) {
  const loginPage = new LoginPage(page)
  const header = new HeaderComponent(page)

  await loginPage.loginAs(user)
  await expect(page).toHaveURL('/')
  await expect(header.transactionsLink).toBeVisible()
}

export async function createAndLogin(page: Page, request: APIRequestContext) {
  const user = await registerViaApi(request)
  await loginViaUi(page, user)
  return user
}

export async function openBalanceModal(page: Page) {
  const transactionsPage = new TransactionsPage(page)
  await transactionsPage.openBalanceModal()
  await expect(transactionsPage.modalTitle).toBeVisible()
}

export async function topUp(page: Page, amount: number) {
  const transactionsPage = new TransactionsPage(page)
  const header = new HeaderComponent(page)

  await openBalanceModal(page)
  await transactionsPage.submitTopUp(amount)
  await expect(header.balance).toHaveText(`Balance: ${amount}`)
}

export async function transfer(page: Page, amount: number, phone = '+7 999 123-45-67') {
  await new TransferPage(page).transfer(amount, phone)
}
