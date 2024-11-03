import { type Page, expect } from "@playwright/test"

export async function signUpNewUser(
  page: Page,
  name: string,
  email: string,
  password: string,
) {
  await page.goto("/signup")

  await page.getByPlaceholder("Full Name").fill(name)
  await page.getByPlaceholder("Email").fill(email)
  await page.getByPlaceholder("Password", { exact: true }).fill(password)
  await page.getByPlaceholder("Repeat Password").fill(password)
  await page.getByRole("button", { name: "Sign Up" }).click()
  await expect(
    page.getByText("Your account has been created successfully"),
  ).toBeVisible()
  await page.goto("/login")
}

export async function logInUser(page: Page, email: string, password: string) {
  await page.goto("/login")

  await page.getByPlaceholder("邮箱").fill(email)
  await page.getByPlaceholder("密码", { exact: true }).fill(password)
  await page.getByRole("button", { name: "登录" }).click()
  await page.waitForURL("/")
  await expect(
    page.getByText("欢迎来到昊辰产值管理系统!"),
  ).toBeVisible()
}

export async function logOutUser(page: Page) {
  await page.getByTestId("user-menu").click()
  await page.getByRole("menuitem", { name: "登出" }).click()
  await page.goto("/login")
}
