import { test, expect, Page } from "@playwright/test";

function getSwitchToUkrainianButton(page: Page) {
  return page.getByRole("button", { name: "Switch to Ukrainian" });
}

function getSwitchToEnglishButton(page: Page) {
  return page.getByRole("button", { name: "Перемкнути на англійську" });
}

test.describe("language toggle", () => {
  test("switches the UI between English and Ukrainian and persists the choice", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(getSwitchToUkrainianButton(page)).toHaveText("UA");

    await getSwitchToUkrainianButton(page).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "uk");
    await expect(getSwitchToEnglishButton(page)).toHaveText("EN");
    await expect(page.getByRole("heading", { name: "Що подивитися" })).toBeVisible();
    expect((await context.cookies()).find((c) => c.name === "locale")?.value).toBe("uk");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("lang", "uk");
    await expect(getSwitchToEnglishButton(page)).toBeVisible();

    await getSwitchToEnglishButton(page).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "Suggested to watch" })).toBeVisible();
    expect((await context.cookies()).find((c) => c.name === "locale")?.value).toBe("en");
  });
});
