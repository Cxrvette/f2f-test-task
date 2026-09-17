import { test, expect } from '@playwright/test'
import { loginViaUi, registerViaApi } from './helpers'
import { LoginPage } from './pages/LoginPage'
import { TransferPage } from './pages/TransferPage'

test.describe('Авторизация', () => {
  test('Critical: вход с валидными данными открывает главную страницу', async ({ page, request }) => {
    const user = await registerViaApi(request)
    await loginViaUi(page, user)
    await expect(new TransferPage(page).title).toBeVisible()
  })

  test('High: вход с неправильным паролем отклоняется', async ({ page, request }) => {
    const user = await registerViaApi(request)
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await loginPage.login(user.email, 'wrong-password')

    await expect(loginPage.snackbar).toHaveText('Login failed')
    await expect(page).toHaveURL('/login')
  })

  test('High: защищённая страница недоступна без авторизации', async ({ page }) => {
    await page.goto('/transactions')
    const loginPage = new LoginPage(page)
    await expect(page).toHaveURL('/login')
    await expect(loginPage.title).toHaveText('Login to F2F Bank')
  })
})
