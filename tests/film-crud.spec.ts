import { test, expect, Page } from '@playwright/test';
import { getAddFilmButton } from './helpers';

function getEditFilmButton(page: Page) {
  return page.getByRole('button', { name: 'Edit' });
}

function getDeleteFilmButton(page: Page) {
  return page.getByRole('button', { name: 'Delete' });
}

async function closeTmdbDropdown(page: Page) {
  await page.locator('h2', { hasText: /^(Add new film|Edit film)$/ }).click();
}

async function addFilmManually(
  page: Page,
  name: string,
  link: string,
  extra?: { description?: string; year?: number; mark?: number; duration?: number },
) {
  await getAddFilmButton(page).click();

  await page.getByPlaceholder('Name').fill(name);
  await closeTmdbDropdown(page);
  await page.getByPlaceholder('Link').fill(link);

  if (extra?.description !== undefined) {
    await page.getByPlaceholder('Description').fill(extra.description);
  }
  if (extra?.year !== undefined) {
    await page.getByPlaceholder('Year').fill(String(extra.year));
  }
  if (extra?.mark !== undefined) {
    await page.getByPlaceholder('Mark').fill(String(extra.mark));
  }
  if (extra?.duration !== undefined) {
    await page.getByPlaceholder('Duration(min)').fill(String(extra.duration));
  }

  await page.getByRole('button', { name: 'Add', exact: true }).click();
}

test.describe('film CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('add a film manually', async ({ page }) => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const name = `E2E Manual Film ${uniqueSuffix}`;
    const link = `https://example.com/e2e-film-${uniqueSuffix}`;

    await addFilmManually(page, name, link);

    await expect(page).toHaveURL(/\/film\/\d+$/);
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
  });

  test('edit an existing film', async ({ page }) => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const originalName = `E2E Editable Film ${uniqueSuffix}`;
    const link = `https://example.com/e2e-film-${uniqueSuffix}`;

    await addFilmManually(page, originalName, link);
    await expect(page).toHaveURL(/\/film\/\d+$/);

    await getEditFilmButton(page).click();

    const updatedName = `E2E Edited Film ${uniqueSuffix}`;
    const updatedDescription = `E2E updated description ${uniqueSuffix}`;

    await page.getByPlaceholder('Name').fill(updatedName);
    await closeTmdbDropdown(page);
    await page.getByPlaceholder('Description').fill(updatedDescription);

    await page.locator('button[form="add-film-form"]').click();

    await expect(page.getByRole('heading', { name: updatedName, exact: true })).toBeVisible();
    await expect(page.getByText(updatedDescription)).toBeVisible();
  });

  test('delete a film', async ({ page }) => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const name = `E2E Deletable Film ${uniqueSuffix}`;
    const link = `https://example.com/e2e-film-${uniqueSuffix}`;

    await addFilmManually(page, name, link);
    await expect(page).toHaveURL(/\/film\/\d+$/);
    const filmUrl = page.url();

    await getDeleteFilmButton(page).click();

    await expect(page.getByText('Are you sure you want to delete this film?')).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();

    await expect(page).toHaveURL('/');

    await page.goto(filmUrl);
    await expect(page.getByText('Film not found')).toBeVisible();
  });

  test("view a film's detail page", async ({ page }) => {
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const name = `E2E Viewable Film ${uniqueSuffix}`;
    const link = `https://example.com/e2e-film-${uniqueSuffix}`;
    const description = `E2E view description ${uniqueSuffix}`;
    const year = 2020;
    const mark = 8;
    const duration = 120;

    await addFilmManually(page, name, link, { description, year, mark, duration });
    await expect(page).toHaveURL(/\/film\/\d+$/);
    const filmUrl = page.url();

    await page.goto(filmUrl);

    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
    await expect(page.getByText(`${duration} minutes`)).toBeVisible();

    await expect(page.getByRole('button', { name: String(year), exact: true })).toBeVisible();
        // the mark may come back from the API with trailing decimals (e.g. "8.00"), so match loosely.
    await expect(page.getByRole('button', { name: new RegExp(`^${mark}(\\.0+)?$`) })).toBeVisible();

    await expect(getEditFilmButton(page)).toBeVisible();
    await expect(getDeleteFilmButton(page)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to page' })).toHaveAttribute('href', link);
  });
});
