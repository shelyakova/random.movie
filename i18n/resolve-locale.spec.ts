import { describe, expect, it } from "vitest";
import { getLocaleFromAcceptLanguage } from "./resolve-locale";

describe("getLocaleFromAcceptLanguage", () => {
  it("falls back to English when the header is missing", () => {
    expect(getLocaleFromAcceptLanguage(null)).toBe("en");
  });

  it("matches on the primary subtag", () => {
    expect(getLocaleFromAcceptLanguage("uk-UA,uk;q=0.9")).toBe("uk");
    expect(getLocaleFromAcceptLanguage("en-GB")).toBe("en");
  });

  it("prefers the highest q-value among supported languages", () => {
    expect(getLocaleFromAcceptLanguage("en;q=0.5,uk;q=0.9")).toBe("uk");
  });

  it("skips unsupported languages", () => {
    expect(getLocaleFromAcceptLanguage("ru,uk;q=0.8")).toBe("uk");
  });

  it("falls back to English when neither Ukrainian nor English is present", () => {
    expect(getLocaleFromAcceptLanguage("de-DE,fr;q=0.8")).toBe("en");
  });

  it("ignores languages with q=0", () => {
    expect(getLocaleFromAcceptLanguage("uk;q=0,en;q=0.5")).toBe("en");
  });
});
