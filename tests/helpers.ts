import { expect, type APIRequestContext, type Page } from '@playwright/test'

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
  await page.goto('/login')
  await page.getByPlaceholder('Type your email').fill(user.email)
  await page.getByPlaceholder('Type your password').fill(user.password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible()
}

export async function createAndLogin(page: Page, request: APIRequestContext) {
  const user = await registerViaApi(request)
  await loginViaUi(page, user)
  return user
}

export async function openBalanceModal(page: Page) {
  await page.goto('/transactions')
  await page.getByRole('button', { name: 'Add balance' }).click()
  await expect(page.getByRole('heading', { name: 'Add balance' })).toBeVisible()
}

export async function topUp(page: Page, amount: number) {
  await openBalanceModal(page)
  await page.getByPlaceholder('Enter sum').fill(String(amount))
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.getByRole('heading', { name: `Balance: ${amount}` })).toBeVisible()
}

export async function transfer(page: Page, amount: number, phone = '+7 999 123-45-67') {
  await page.goto('/')
  await page.getByPlaceholder('+7 999 123-45-67').fill(phone)
  await page.getByPlaceholder('0.00').fill(String(amount))
  await page.getByPlaceholder('e.g. debt repayment').fill('E2E transfer')
  await page.getByRole('button', { name: 'Send' }).click()
}
