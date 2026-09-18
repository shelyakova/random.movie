import { test, expect, Page } from "@playwright/test";

function getThemeToggleButton(page: Page) {
  return page.getByRole("button", { name: "Toggle theme" });
}

const DARK_CLASS_REGEX = /(^|\s)dark(\s|$)/;

test.describe("theme toggle", () => {
  test("toggling the theme applies and persists the dark class", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const initialClass = (await html.getAttribute("class")) ?? "";
    const wasDark = DARK_CLASS_REGEX.test(initialClass);

    await getThemeToggleButton(page).click();

    if (wasDark) {
      await expect(html).not.toHaveClass(DARK_CLASS_REGEX);
    } else {
      await expect(html).toHaveClass(DARK_CLASS_REGEX);
    }

    await page.reload();

    if (wasDark) {
      await expect(html).not.toHaveClass(DARK_CLASS_REGEX);
    } else {
      await expect(html).toHaveClass(DARK_CLASS_REGEX);
    }

    await getThemeToggleButton(page).click();

    if (wasDark) {
      await expect(html).toHaveClass(DARK_CLASS_REGEX);
    } else {
      await expect(html).not.toHaveClass(DARK_CLASS_REGEX);
    }
  });
});

test.describe("theme toggle with dark system preference", () => {
  test.use({ colorScheme: "dark" });

  test("default theme respects system color scheme preference when nothing is stored", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.removeItem("theme"));

    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(DARK_CLASS_REGEX);
  });
});
