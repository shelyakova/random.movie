import { TmdbMediaType } from "./enums";

export interface TmdbSearchResult {
  tmdbId: number;
  type: TmdbMediaType;
  name: string;
  year: number | null;
}

export interface TmdbDetails {
  tmdbId: number;
  type: TmdbMediaType;
  name: string;
  description: string | null;
  year: number | null;
  duration: number | null;
  seasons: number | null;
  episodes: number | null;
  newSeason: string | null;
  latestEpisode: string | null;
  mark: number | null;
  posterUrl: string | null;
}
