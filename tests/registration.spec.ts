import { test, expect } from '@playwright/test'
import { loginViaUi, uniqueUser } from './helpers'

test.describe('Регистрация', () => {
  test('High: новый пользователь регистрируется и может войти', async ({ page }) => {
    const user = uniqueUser('registration')
    await page.goto('/register')

    await page.getByPlaceholder('Type your name').fill(user.name)
    await page.getByPlaceholder('Type your surname').fill(user.surname)
    await page.getByPlaceholder('Type your email').fill(user.email)
    await page.locator('input[type="password"]').fill(user.password)
    await page.getByRole('button', { name: 'Register' }).click()

    await expect(page).toHaveURL('/login')
    await loginViaUi(page, user)
  })

  test('High: повторная регистрация с существующим email отклоняется', async ({ page }) => {
    const user = uniqueUser('duplicate')

    const register = async () => {
      await page.goto('/register')
      await page.getByPlaceholder('Type your name').fill(user.name)
      await page.getByPlaceholder('Type your surname').fill(user.surname)
      await page.getByPlaceholder('Type your email').fill(user.email)
      await page.locator('input[type="password"]').fill(user.password)
      await page.getByRole('button', { name: 'Register' }).click()
    }

    await register()
    await expect(page).toHaveURL('/login')
    await register()
    await expect(page.getByText('User with this email already exists')).toBeVisible()
    await expect(page).toHaveURL('/register')
  })

  test('Medium: обязательные поля нельзя оставить пустыми', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: 'Register' }).click()

    await expect(page).toHaveURL('/register')
    await expect(page.getByPlaceholder('Type your name')).toBeFocused()
    await expect(page.getByPlaceholder('Type your name')).toHaveAttribute('required', '')
  })
})
