import { test, expect } from "@playwright/test";

const E2E_USERNAME = process.env.E2E_USERNAME;

if (!E2E_USERNAME) {
  throw new Error(
    "E2E_USERNAME must be set (e.g. in a .env.test file) to run registration.spec.ts",
  );
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("registration", () => {
  test("successful registration", async ({ page }) => {
    const username = `e2e_reg_${Date.now()}`;
    const password = "e2e_reg_password";

    await page.goto("/register");

    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password", { exact: true }).fill(password);
    await page.getByPlaceholder("Confirm password").fill(password);
    await page.getByRole("button", { name: "SignUp" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByPlaceholder("Search a movie or a series")).toBeVisible();
  });

  test("registration fails with a duplicate username", async ({ page }) => {
    const password = "e2e_reg_duplicate_password";

    await page.goto("/register");

    await page.getByPlaceholder("Username").fill(E2E_USERNAME!);
    await page.getByPlaceholder("Password", { exact: true }).fill(password);
    await page.getByPlaceholder("Confirm password").fill(password);
    await page.getByRole("button", { name: "SignUp" }).click();

    await expect(page).toHaveURL("/register");

    await expect(page.getByText("User with the same name is already exist")).toBeVisible();
  });
});
