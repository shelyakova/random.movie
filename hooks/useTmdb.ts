import { useQuery } from "@tanstack/react-query";
import { fetchTmdbSearch, fetchTmdbDetails } from "@/lib/api";
import { TmdbMediaType } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useTmdbSearch(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.tmdb.search(query),
    queryFn: () => fetchTmdbSearch(query),
    enabled: query.trim().length > 1,
  });
}

export function useTmdbDetails(type: TmdbMediaType | undefined, id: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.tmdb.details(type, id),
    queryFn: () => fetchTmdbDetails(type!, id!),
    enabled: Boolean(type) && Boolean(id),
  });
}
