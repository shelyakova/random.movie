import { test, expect, APIRequestContext } from "@playwright/test";
import {
  getAuthToken,
  createFilmViaApi,
  deleteFilmViaApi,
  getSection,
  scrollUntilVisible,
} from "./helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function setFilmWatched(
  request: APIRequestContext,
  token: string,
  filmId: number,
  isWatched: boolean,
) {
  const response = await request.patch(`${API_BASE_URL}/film/${filmId}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { isWatched },
  });
  expect(
    response.ok(),
    `film PATCH failed: ${response.status()} ${await response.text()}`,
  ).toBeTruthy();
}

test.describe("home page sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("home page splits films by watched status", async ({ page, request }) => {
    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const unwatchedName = `E2E Unwatched Film ${uniqueSuffix}`;
    const watchedName = `E2E Watched Film ${uniqueSuffix}`;

    const unwatchedFilm = await createFilmViaApi(
      request,
      token,
      unwatchedName,
      `https://example.com/e2e-unwatched-${uniqueSuffix}`,
    );
    const watchedFilm = await createFilmViaApi(
      request,
      token,
      watchedName,
      `https://example.com/e2e-watched-${uniqueSuffix}`,
    );
    await setFilmWatched(request, token, watchedFilm.id, true);

    try {
      await page.goto("/");

      const suggestedSection = getSection(page, "Suggested to watch");
      const watchedSection = getSection(page, "Previously watched");

      await expect(watchedSection.getByText(watchedName, { exact: true })).toBeVisible();

      await expect(suggestedSection.getByText(watchedName, { exact: true })).toHaveCount(0);
      await expect(watchedSection.getByText(unwatchedName, { exact: true })).toHaveCount(0);

      await page.goto("/?view=suggested");
      const expandedSuggested = getSection(page, "Suggested to watch");
      const unwatchedCard = expandedSuggested.getByText(unwatchedName, { exact: true });
      await scrollUntilVisible(page, unwatchedCard);
      await expect(unwatchedCard).toBeVisible();
    } finally {
      await deleteFilmViaApi(request, token, unwatchedFilm.id);
      await deleteFilmViaApi(request, token, watchedFilm.id);
    }
  });
});
