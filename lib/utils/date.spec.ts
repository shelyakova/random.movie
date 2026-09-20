import { describe, expect, it } from "vitest";
import { formatDateOnly, parseDateOnly } from "./date";

describe("formatDateOnly", () => {
  it("keeps the local calendar day for local midnight", () => {
    expect(formatDateOnly(new Date(2026, 8, 21))).toBe("2026-09-21");
  });

  it("keeps the local calendar day late in the evening", () => {
    expect(formatDateOnly(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });

  it("pads single-digit months and days", () => {
    expect(formatDateOnly(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("parseDateOnly", () => {
  it("parses YYYY-MM-DD as local midnight", () => {
    const date = parseDateOnly("2026-09-21");

    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2026, 8, 21, 0,
    ]);
  });

  it("round-trips with formatDateOnly", () => {
    expect(formatDateOnly(parseDateOnly("2026-03-01"))).toBe("2026-03-01");
  });

  it("uses the date part of a full ISO timestamp", () => {
    expect(formatDateOnly(parseDateOnly("2026-09-21T00:00:00.000Z"))).toBe("2026-09-21");
  });
});
