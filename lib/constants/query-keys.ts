export const QUERY_KEYS = {
  films: {
    all: ["films"] as const,
    list: (params: {
      isWatched?: boolean;
      search?: string;
      categoryIds?: number[];
      newSeasonOut?: boolean;
      hasLatestEpisode?: boolean;
      limit: number;
    }) => ["films", params] as const,
    detail: (filmId: number) => ["films", filmId] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  tmdb: {
    search: (query: string) => ["tmdb-search", query] as const,
    details: (type: string | undefined, id: number | undefined) =>
      ["tmdb-details", type, id] as const,
  },
} as const;
