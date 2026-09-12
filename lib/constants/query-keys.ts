export const QUERY_KEYS = {
  films: {
    all: ["films"] as const,
    list: (params: { isWatched?: boolean; search: string; categoryIds: number[]; limit: number }) =>
      ["films", params] as const,
    detail: (filmId: number) => ["films", filmId] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
} as const;
