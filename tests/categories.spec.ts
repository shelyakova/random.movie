import { test, expect, Page, APIRequestContext } from '@playwright/test';
import {
  getAuthToken,
  createCategoryViaApi,
  deleteCategoryViaApi,
  createFilmViaApi,
  deleteFilmViaApi,
  getSettingsButton,
  getCategoryTag,
} from './helpers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchCategoriesViaApi(
  request: APIRequestContext,
  token: string,
): Promise<{ id: number; name: string }[]> {
  const response = await request.get(`${API_BASE_URL}/category`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.ok(), `category fetch failed: ${response.status()} ${await response.text()}`).toBeTruthy();
  return response.json();
}

function getModalEditToggle(page: Page) {
  return page.getByRole('button', { name: 'Edit', exact: true });
}

function getNewCategoryInput(page: Page) {
  return page.getByPlaceholder('Add new category');
}

function getAddCategoryButton(page: Page) {
  return page.getByRole('button', { name: 'Add category' });
}

test.describe('categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('create a new category', async ({ page, request }) => {
    const token = await getAuthToken(page);
    const categoryName = `E2E Category ${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    let categoryId: number | undefined;

    try {
      await getSettingsButton(page).click();
      await getModalEditToggle(page).click();
      await expect(page.getByRole('heading', { name: 'Edit categories' })).toBeVisible();

      await getNewCategoryInput(page).fill(categoryName);
      await getAddCategoryButton(page).click();

      await expect(getCategoryTag(page, categoryName)).toBeVisible();

      const categories = await fetchCategoriesViaApi(request, token);
      categoryId = categories.find((c) => c.name === categoryName)?.id;
      expect(categoryId, `expected category "${categoryName}" to exist via API`).toBeDefined();

      await getModalEditToggle(page).click();
      await expect(page.getByRole('heading', { name: 'Filter by categories' })).toBeVisible();
      await expect(getCategoryTag(page, categoryName)).toBeVisible();
    } finally {
      if (categoryId) await deleteCategoryViaApi(request, token, categoryId);
    }
  });

  test('filter films by category', async ({ page, request }) => {
    const token = await getAuthToken(page);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const categoryName = `E2E Filter Category ${uniqueSuffix}`;
    const matchingFilmName = `E2E Filtered Film ${uniqueSuffix}`;
    const otherFilmName = `E2E Unfiltered Film ${uniqueSuffix}`;

    const category = await createCategoryViaApi(request, token, categoryName);
    const matchingFilm = await createFilmViaApi(
      request,
      token,
      matchingFilmName,
      `https://example.com/e2e-filtered-${uniqueSuffix}`,
      [category.id],
    );
    const otherFilm = await createFilmViaApi(
      request,
      token,
      otherFilmName,
      `https://example.com/e2e-unfiltered-${uniqueSuffix}`,
    );

    try {
      await page.goto('/');

      await getSettingsButton(page).click();
      await expect(page.getByRole('heading', { name: 'Filter by categories' })).toBeVisible();

      await getCategoryTag(page, categoryName).click();
      await page.getByRole('button', { name: 'Filter', exact: true }).click();

      await expect(page.getByText('Showing search results for:')).toBeVisible();
      await expect(page.getByText(matchingFilmName, { exact: true })).toBeVisible();
      await expect(page.getByText(otherFilmName, { exact: true })).toHaveCount(0);
    } finally {
      await deleteFilmViaApi(request, token, matchingFilm.id);
      await deleteFilmViaApi(request, token, otherFilm.id);
      await deleteCategoryViaApi(request, token, category.id);
    }
  });
});
