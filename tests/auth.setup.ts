import { test as setup, expect } from "@playwright/test";
import { ENGLISH_LOCALE_COOKIE } from "./helpers";

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error(
    "E2E_USERNAME and E2E_PASSWORD must be set (e.g. in a .env.test.local file) to run tests",
  );
}

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.context().addCookies([ENGLISH_LOCALE_COOKIE]);
  await page.goto("/login");
  await page.getByLabel("Username").fill(E2E_USERNAME);
  await page.getByLabel("Password", { exact: true }).fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/");

  await page.context().storageState({ path: authFile });
});
