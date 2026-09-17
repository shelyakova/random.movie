import { TmdbSearchResult, TmdbDetails, TmdbMediaType } from "@/lib/types";
import { authorizedFetch } from "./client";

export function fetchTmdbSearch(query: string) {
  const params = new URLSearchParams();
  params.set("query", query);

  return authorizedFetch<TmdbSearchResult[]>(`/tmdb/search?${params}`);
}

export function fetchTmdbDetails(type: TmdbMediaType, id: number) {
  return authorizedFetch<TmdbDetails>(`/tmdb/details/${type}/${id}`);
}
