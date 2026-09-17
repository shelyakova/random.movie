import { test, expect, Page, Locator, APIRequestContext } from '@playwright/test';

const E2E_USERNAME = process.env.E2E_USERNAME;
const E2E_PASSWORD = process.env.E2E_PASSWORD;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!E2E_USERNAME || !E2E_PASSWORD) {
  throw new Error(
    'E2E_USERNAME and E2E_PASSWORD must be set (e.g. in a .env.test.local file) to run login.spec.ts',
  );
}

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL must be set (e.g. in a .env.test.local file) to run login.spec.ts',
  );
}

async function getAuthToken(page: Page): Promise<string> {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) throw new Error('Expected an auth token in localStorage after login');
  return token;
}

async function createFilmViaApi(
  request: APIRequestContext,
  token: string,
  name: string,
  link: string,
): Promise<{ id: number }> {
  const response = await request.post(`${API_BASE_URL}/film/create`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      link,
      seasons: null,
      episodes: null,
      duration: null,
      description: '',
      year: null,
      mark: null,
      newSeason: null,
      latestEpisode: null,
    },
  });
  expect(response.ok(), `film/create failed: ${response.status()} ${await response.text()}`).toBeTruthy();
  return response.json();
}

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
  expect(response.ok(), `film PATCH failed: ${response.status()} ${await response.text()}`).toBeTruthy();
}

async function deleteFilmViaApi(request: APIRequestContext, token: string, filmId: number) {
  await request.delete(`${API_BASE_URL}/film/${filmId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

function getSection(page: Page, title: string) {
  return page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

// "Suggested to watch" sorts oldest-first and this shared test backend
// accumulates films across E2E runs (no cleanup convention exists for most
// of them), so a freshly created film can be many lazy-loaded pages down.
// Scroll the page (triggering FilmSection's IntersectionObserver sentinel)
// until it comes into view, or give up after a bounded number of attempts.
async function scrollUntilVisible(page: Page, locator: Locator, maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const found = await locator
      .waitFor({ state: 'visible', timeout: 1000 })
      .then(() => true)
      .catch(() => false);
    if (found) return;
    await page.mouse.wheel(0, 3000);
  }
}

test.describe('home page sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page splits films by watched status', async ({ page, request }) => {
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
      await page.goto('/');

      const suggestedSection = getSection(page, 'Suggested to watch');
      const watchedSection = getSection(page, 'Previously watched');

      await expect(watchedSection.getByText(watchedName, { exact: true })).toBeVisible();

      await expect(suggestedSection.getByText(watchedName, { exact: true })).toHaveCount(0);
      await expect(watchedSection.getByText(unwatchedName, { exact: true })).toHaveCount(0);

      await page.goto('/?view=suggested');
      const expandedSuggested = getSection(page, 'Suggested to watch');
      const unwatchedCard = expandedSuggested.getByText(unwatchedName, { exact: true });
      await scrollUntilVisible(page, unwatchedCard);
      await expect(unwatchedCard).toBeVisible();
    } finally {
      await deleteFilmViaApi(request, token, unwatchedFilm.id);
      await deleteFilmViaApi(request, token, watchedFilm.id);
    }
  });
});
