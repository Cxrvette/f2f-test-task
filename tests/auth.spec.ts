import { test, expect } from '@playwright/test'
import { loginViaUi, registerViaApi } from './helpers'

test.describe('Авторизация', () => {
  test('Critical: вход с валидными данными открывает главную страницу', async ({ page, request }) => {
    const user = await registerViaApi(request)
    await loginViaUi(page, user)
    await expect(page.getByText('Transfer by phone number')).toBeVisible()
  })

  test('High: вход с неправильным паролем отклоняется', async ({ page, request }) => {
    const user = await registerViaApi(request)
    await page.goto('/login')
    await page.getByPlaceholder('Type your email').fill(user.email)
    await page.getByPlaceholder('Type your password').fill('wrong-password')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByText('Login failed')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('High: защищённая страница недоступна без авторизации', async ({ page }) => {
    await page.goto('/transactions')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Login to F2F Bank' })).toBeVisible()
  })
})
