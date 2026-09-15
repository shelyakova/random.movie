import { authorizedFetch } from "./client";
import { EditFilmSchema, FilmSchema } from "../schemas/film.schema";
import { Film } from "../types";

export function fetchFilms(params: {
  search?: string;
  isWatched?: boolean;
  categoryIds?: number[];
  newSeasonOut?: boolean;
  hasLatestEpisode?: boolean;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.isWatched !== undefined) query.set("isWatched", String(params.isWatched));
  if (params.categoryIds)
    params.categoryIds.forEach((id) => query.append("categoryIds", String(id)));
  if (params.newSeasonOut) query.set("newSeasonOut", String(params.newSeasonOut));
  if (params.hasLatestEpisode) query.set("hasLatestEpisode", String(params.hasLatestEpisode));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return authorizedFetch<Film[]>(`/film?${query}`);
}

export function fetchRandomFilm(
  search: string,
  categoryIds: number[],
  newSeasonOut?: boolean,
  hasLatestEpisode?: boolean,
) {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  categoryIds.forEach((id) => query.append("categoryIds", String(id)));
  if (newSeasonOut) query.set("newSeasonOut", "true");
  if (hasLatestEpisode) query.set("hasLatestEpisode", "true");
  return authorizedFetch<{ id: number }>(`/film/random?${query}`);
}

export function fetchFilmById(filmId: number) {
  return authorizedFetch<Film>(`/film/${filmId}`);
}

export function uploadPoster(filmId: number, file: File) {
  const formData = new FormData();
  formData.append("poster", file);

  return authorizedFetch<Film>(`/film/${filmId}/poster`, {
    method: "POST",
    body: formData,
  });
}

export function createFilm(data: FilmSchema) {
  return authorizedFetch<Film>("/film/create", { method: "POST", body: JSON.stringify(data) });
}

export function editFilm(data: EditFilmSchema, filmId: number) {
  return authorizedFetch<Film>(`/film/${filmId}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function deleteFilm(filmId: number) {
  return authorizedFetch<Film>(`/film/${filmId}`, { method: "DELETE" });
}
