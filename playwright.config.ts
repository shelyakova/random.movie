import { defineConfig, devices } from "@playwright/test";

try {
  process.loadEnvFile(".env.test.local");
} catch {
  throw new Error(
    ".env.test.local not found or unreadable — create it with NEXT_PUBLIC_API_URL, " +
      "E2E_USERNAME, and E2E_PASSWORD to run these tests",
  );
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  /* Slower dev machine: give tests more headroom than the 30s/5s defaults. */
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
