import { describe, it, expect } from "vitest";
import { filmSchema } from "./film.schema";

const validFilm = {
  name: "Film",
  link: "https://example.com",
  newSeason: null,
  latestEpisode: null,
};

function messagesFor(input: Record<string, unknown>) {
  const result = filmSchema.safeParse({ ...validFilm, ...input });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("filmSchema", () => {
  it("accepts a minimal valid film", () => {
    expect(messagesFor({})).toEqual([]);
  });

  it("emits translation keys for required text fields", () => {
    expect(messagesFor({ name: "  " })).toEqual(["validation.nameRequired"]);
    expect(messagesFor({ name: undefined })).toEqual(["validation.nameRequired"]);
    expect(messagesFor({ link: "" })).toEqual(["validation.linkRequired"]);
  });

  it("emits translation keys for number constraints", () => {
    expect(messagesFor({ seasons: 0 })).toEqual(["validation.positiveNumberRequired"]);
    expect(messagesFor({ episodes: 1.5 })).toEqual(["validation.wholeNumberRequired"]);
    expect(messagesFor({ duration: Number.NaN })).toEqual(["validation.numberInvalid"]);
    expect(messagesFor({ year: 2020.5 })).toEqual(["validation.wholeNumberRequired"]);
    expect(messagesFor({ mark: 0 })).toEqual(["validation.markRange"]);
    expect(messagesFor({ mark: 11 })).toEqual(["validation.markRange"]);
  });
});
