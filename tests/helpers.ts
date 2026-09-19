import { expect, APIRequestContext, Page, Locator } from "@playwright/test";
import { LOCALE_COOKIE_NAME } from "../i18n/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL must be set (e.g. in a .env.test.local file) to run the E2E suite",
  );
}

export const ENGLISH_LOCALE_COOKIE = {
  name: LOCALE_COOKIE_NAME,
  value: "en",
  domain: "localhost",
  path: "/",
  expires: -1,
  httpOnly: false,
  secure: false,
  sameSite: "Lax" as const,
};

export async function getAuthToken(page: Page): Promise<string> {
  const token = await page.evaluate(() => localStorage.getItem("token"));
  if (!token) throw new Error("Expected an auth token in localStorage after login");
  return token;
}

export async function createFilmViaApi(
  request: APIRequestContext,
  token: string,
  name: string,
  link: string,
  categoryIds: number[] = [],
  isWatched = false,
): Promise<{ id: number }> {
  const response = await request.post(`${API_BASE_URL}/film/create`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      link,
      categoryIds,
      isWatched,
      seasons: null,
      episodes: null,
      duration: null,
      description: "",
      year: null,
      mark: null,
      newSeason: null,
      latestEpisode: null,
    },
  });
  expect(
    response.ok(),
    `film/create failed: ${response.status()} ${await response.text()}`,
  ).toBeTruthy();
  return response.json();
}

export async function deleteFilmViaApi(request: APIRequestContext, token: string, filmId: number) {
  await request.delete(`${API_BASE_URL}/film/${filmId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createCategoryViaApi(
  request: APIRequestContext,
  token: string,
  name: string,
): Promise<{ id: number }> {
  const response = await request.post(`${API_BASE_URL}/category/create`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name },
  });
  expect(
    response.ok(),
    `category/create failed: ${response.status()} ${await response.text()}`,
  ).toBeTruthy();
  return response.json();
}

export async function deleteCategoryViaApi(
  request: APIRequestContext,
  token: string,
  categoryId: number,
) {
  await request.delete(`${API_BASE_URL}/category/${categoryId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getSection(page: Page, title: string) {
  return page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
}

// This shared test backend accumulates films across E2E runs and the home page
// sections lazy-load, so a freshly (un)watched or created film can be many pages
// down. Scroll the page (triggering FilmSection's IntersectionObserver sentinel)
// until it comes into view, or give up after a bounded number of attempts.
export async function scrollUntilVisible(page: Page, locator: Locator, maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const found = await locator
      .waitFor({ state: "visible", timeout: 1000 })
      .then(() => true)
      .catch(() => false);
    if (found) return;
    await page.mouse.wheel(0, 3000);
  }
}

export function getSettingsButton(page: Page) {
  return page.getByRole("button", { name: "Settings" });
}

export function getCategoryTag(page: Page, name: string) {
  return page.getByRole("button", { name, exact: true });
}

export function getAddFilmButton(page: Page) {
  return page.getByRole("button", { name: "Add film" });
}
