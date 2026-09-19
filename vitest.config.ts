import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // tests/ holds the Playwright E2E specs, which are run with `npx playwright test`.
    exclude: [...configDefaults.exclude, "tests/**"],
  },
});
