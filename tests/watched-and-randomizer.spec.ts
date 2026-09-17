import { test, expect, Page, Locator } from '@playwright/test';
import {
  getAuthToken,
  createFilmViaApi,
  deleteFilmViaApi,
  createCategoryViaApi,
  deleteCategoryViaApi,
  getSection,
  scrollUntilVisible,
  getSettingsButton,
  getCategoryTag,
} from './helpers';

function getWatchedToggleButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Watched' });
}

function getRandomizeButton(page: Page) {
  return page.getByRole('button', { name: 'Randomize', exact: true });
}

test.describe('watched status and randomizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test("toggle a film's watched status", async ({ page, request }) => {
    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const name = `E2E Watchable Film ${uniqueSuffix}`;

    const film = await createFilmViaApi(
      request,
      token,
      name,
      `https://example.com/e2e-watchable-${uniqueSuffix}`,
    );

    try {
      await page.goto(`/film/${film.id}`);

      const toggleButton = getWatchedToggleButton(page);
      await expect(toggleButton).not.toHaveClass(/rgba\(0,215,139,0\.34\)/);

      await toggleButton.click();

      await expect(toggleButton).toHaveClass(/rgba\(0,215,139,0\.34\)/);
      await toggleButton.hover();
      await expect(page.getByText('Mark as unwatched')).toBeVisible();

      await page.goto('/?view=watched');
      const watchedCard = getSection(page, 'Previously watched').getByText(name, { exact: true });
      await scrollUntilVisible(page, watchedCard);
      await expect(watchedCard).toBeVisible();
      await expect(getSection(page, 'Suggested to watch').getByText(name, { exact: true })).toHaveCount(0);

      await page.goto(`/film/${film.id}`);
      await toggleButton.click();

      await expect(toggleButton).not.toHaveClass(/rgba\(0,215,139,0\.34\)/);
      await toggleButton.hover();
      await expect(page.getByText('Mark as watched')).toBeVisible();

      await page.goto('/?view=suggested');
      const suggestedCard = getSection(page, 'Suggested to watch').getByText(name, { exact: true });
      await scrollUntilVisible(page, suggestedCard);
      await expect(suggestedCard).toBeVisible();
      await expect(getSection(page, 'Previously watched').getByText(name, { exact: true })).toHaveCount(0);
    } finally {
      await deleteFilmViaApi(request, token, film.id);
    }
  });

  test('randomizer respects active category filter', async ({ page, request }) => {
    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const categoryName = `E2E Randomizer Category ${uniqueSuffix}`;

    const category = await createCategoryViaApi(request, token, categoryName);
    const matchingFilm = await createFilmViaApi(
      request,
      token,
      `E2E Randomizer Match ${uniqueSuffix}`,
      `https://example.com/e2e-randomizer-match-${uniqueSuffix}`,
      [category.id],
    );
    const watchedMatchingFilm = await createFilmViaApi(
      request,
      token,
      `E2E Randomizer Watched Match ${uniqueSuffix}`,
      `https://example.com/e2e-randomizer-watched-match-${uniqueSuffix}`,
      [category.id],
      true,
    );
    const otherFilm1 = await createFilmViaApi(
      request,
      token,
      `E2E Randomizer Other 1 ${uniqueSuffix}`,
      `https://example.com/e2e-randomizer-other1-${uniqueSuffix}`,
    );
    const otherFilm2 = await createFilmViaApi(
      request,
      token,
      `E2E Randomizer Other 2 ${uniqueSuffix}`,
      `https://example.com/e2e-randomizer-other2-${uniqueSuffix}`,
    );

    try {
      await page.goto('/');

      await getSettingsButton(page).click();
      await expect(page.getByRole('heading', { name: 'Filter by categories' })).toBeVisible();
      await getCategoryTag(page, categoryName).click();
      await page.getByRole('button', { name: 'Filter', exact: true }).click();

      await expect(page.getByText('Showing search results for:')).toBeVisible();

      const randomizeButton = getRandomizeButton(page);
      const matchingFilmUrl = new RegExp(`/film/${matchingFilm.id}(\\?|$)`);

      for (let attempt = 0; attempt < 5; attempt++) {
        await randomizeButton.click();
        await expect(page).toHaveURL(matchingFilmUrl);
      }
    } finally {
      await deleteFilmViaApi(request, token, matchingFilm.id);
      await deleteFilmViaApi(request, token, watchedMatchingFilm.id);
      await deleteFilmViaApi(request, token, otherFilm1.id);
      await deleteFilmViaApi(request, token, otherFilm2.id);
      await deleteCategoryViaApi(request, token, category.id);
    }
  });
});
