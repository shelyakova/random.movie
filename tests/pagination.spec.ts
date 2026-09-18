import { test, expect } from "@playwright/test";
import {
  getAuthToken,
  createFilmViaApi,
  deleteFilmViaApi,
  getSection,
  scrollUntilVisible,
} from "./helpers";

const EXPANDED_VIEW_LIMIT = 18;
const FILM_COUNT = EXPANDED_VIEW_LIMIT + 4;

test.describe("pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("More button expands a section and loads additional films via infinite scroll", async ({
    page,
    request,
  }) => {
    test.setTimeout(90_000);

    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const names = Array.from(
      { length: FILM_COUNT },
      (_, i) => `E2E Page Film ${uniqueSuffix} ${String(i + 1).padStart(2, "0")}`,
    );
    const films: { id: number }[] = [];
    for (const [i, name] of names.entries()) {
      films.push(
        await createFilmViaApi(
          request,
          token,
          name,
          `https://example.com/e2e-page-film-${uniqueSuffix}-${i + 1}`,
          [],
          true,
        ),
      );
    }

    try {
      await page.goto("/");

      const firstFilm = page.getByText(names[0], { exact: true });
      const lastFilm = page.getByText(names[names.length - 1], { exact: true });

      await expect(firstFilm).toBeVisible();

      await getSection(page, "Previously watched").getByText("More", { exact: true }).click();
      await expect(page).toHaveURL("/?view=watched");

      await expect(firstFilm).toBeVisible();

      await expect(lastFilm).toHaveCount(0);

      await scrollUntilVisible(page, lastFilm);
      await expect(lastFilm).toBeVisible();
    } finally {
      await Promise.all(films.map((film) => deleteFilmViaApi(request, token, film.id)));
    }
  });
});
