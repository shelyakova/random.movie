import { test, expect, Page } from "@playwright/test";
import { getAuthToken, createFilmViaApi, deleteFilmViaApi, getAddFilmButton } from "./helpers";

function getSearchInput(page: Page) {
  return page.getByLabel("Search a movie or a series");
}

function getTmdbNameInput(page: Page) {
  return page.getByLabel("Name");
}

function getTmdbResult(page: Page, name: string, year: number) {
  return page
    .getByRole("button")
    .filter({ has: page.getByText(name, { exact: true }) })
    .filter({ has: page.getByText(String(year), { exact: true }) });
}

function getCloseModalButton(page: Page) {
  return page.getByRole("button", { name: "Close" });
}

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("text search filters films on the home page", async ({ page, request }) => {
    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const targetName = `E2E Searchable Film ${uniqueSuffix}`;
    const otherName = `E2E Unrelated Film ${uniqueSuffix}`;

    const targetFilm = await createFilmViaApi(
      request,
      token,
      targetName,
      `https://example.com/e2e-searchable-${uniqueSuffix}`,
    );
    const otherFilm = await createFilmViaApi(
      request,
      token,
      otherName,
      `https://example.com/e2e-unrelated-${uniqueSuffix}`,
    );

    try {
      await page.goto("/");
      await getSearchInput(page).fill(targetName);

      await expect(page.getByText(targetName, { exact: true })).toBeVisible();
      await expect(page.getByText(otherName, { exact: true })).toHaveCount(0);
    } finally {
      await deleteFilmViaApi(request, token, targetFilm.id);
      await deleteFilmViaApi(request, token, otherFilm.id);
    }
  });

  test("rapid typing does not drop characters from the search input", async ({ page }) => {
    const rapidText = "The Quick Brown Fox Jumps 12345";
    const searchInput = getSearchInput(page);

    await searchInput.pressSequentially(rapidText, { delay: 1 });

    await expect(searchInput).toHaveValue(rapidText);
  });

  test("TMDB search dropdown autofills the add-film form", async ({ page }) => {
    await getAddFilmButton(page).click();

    await getTmdbNameInput(page).fill("The Matrix");

    const matrixResult = getTmdbResult(page, "The Matrix", 1999);
    await expect(matrixResult).toBeVisible();
    await matrixResult.click();

    await expect(page.getByLabel("Description")).not.toHaveValue("");
    await expect(page.getByLabel("Year")).toHaveValue("1999");

    await getCloseModalButton(page).click();
  });
});
