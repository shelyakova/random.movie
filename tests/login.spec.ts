import { test, expect } from "@playwright/test";

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error(
    "E2E_USERNAME and E2E_PASSWORD must be set (e.g. in a .env.test.local file) to run login.spec.ts",
  );
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("login", () => {
  test("successful login", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Username").fill(E2E_USERNAME);
    await page.getByPlaceholder("Password").fill(E2E_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByPlaceholder("Search a movie or a series")).toBeVisible();
  });

  test("invalid login shows an error", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Username").fill(E2E_USERNAME);
    await page.getByPlaceholder("Password").fill("definitely-the-wrong-password");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/login");
    await expect(page.getByText("Incorrect username or password")).toBeVisible();
  });

  test("successful logout", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("Username").fill(E2E_USERNAME);
    await page.getByPlaceholder("Password").fill(E2E_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/");

    const logoutButton = page.getByRole("button", { name: "Logout" });
    await logoutButton.click();

    await expect(page.getByText("Are you sure you want to logout?")).toBeVisible();
    await page.getByRole("button", { name: "Yes" }).click();

    await expect(page).toHaveURL("/login");

    // Confirm the session was actually cleared, not just a client-side redirect.
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });
});
