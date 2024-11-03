import { test as setup } from "@playwright/test"
import { firstSuperuser, firstSuperuserPassword } from "./config.ts"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  await page.goto("/login")
  await page.getByPlaceholder("邮箱").fill(firstSuperuser)
  await page.getByPlaceholder("密码").fill(firstSuperuserPassword)
  await page.getByRole("button", { name: "登录" }).click()
  await page.waitForURL("/")
  await page.context().storageState({ path: authFile })
})
