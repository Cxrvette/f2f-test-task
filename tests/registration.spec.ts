import { test, expect } from '@playwright/test'
import { loginViaUi, uniqueUser } from './helpers'
import { RegisterPage } from './pages/RegisterPage'

test.describe('Регистрация', () => {
  test('High: новый пользователь регистрируется и может войти', async ({ page }) => {
    const user = uniqueUser('registration')
    const registerPage = new RegisterPage(page)

    await registerPage.register(user)

    await expect(page).toHaveURL('/login')
    await loginViaUi(page, user)
  })

  test('High: повторная регистрация с существующим email отклоняется', async ({ page }) => {
    const user = uniqueUser('duplicate')
    const registerPage = new RegisterPage(page)

    await registerPage.register(user)
    await expect(page).toHaveURL('/login')
    await registerPage.register(user)
    await expect(registerPage.error).toHaveText('User with this email already exists')
    await expect(page).toHaveURL('/register')
  })

  test('Medium: обязательные поля нельзя оставить пустыми', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    await registerPage.submitEmptyForm()

    await expect(page).toHaveURL('/register')
    await expect(registerPage.nameInput).toBeFocused()
    await expect(registerPage.nameInput).toHaveAttribute('required', '')
  })
})
